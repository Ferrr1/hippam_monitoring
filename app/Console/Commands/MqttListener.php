<?php

namespace App\Console\Commands;

use App\Events\SensorUpdated;
use App\Events\WaterConditionStatus;
use App\Models\Device;
use App\Models\SensorData;
use App\Models\Tagihan;
use App\Models\Tarif;
use App\Models\Warga;
use App\Services\FuzzyWaterQualityService;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Log;
use PhpMqtt\Client\Facades\MQTT;

class MqttListener extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mqtt:start';
    public $mqtt;
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

    // Function for update data
    public function updateData(string $device_id, array $data)
    {
        $this->info("Message dari Updated Data Function: {$device_id}" . json_encode($data));

        $device = Device::where('device_id', $data['device_id'])->first();
        if (!$device) {
            $this->error("Device dengan ID {$data['device_id']} tidak ditemukan.");
            return;
        }
        if ($device) {
            $device->update([
                'status' => $data['status'] ?? 'tidak_aktif',
                'last_seen_at' => now(),
            ]);
            $this->info("Device {$device_id} Status berhasil diupdate ke Aktif.");
        }
        // Create or Update Sensor Data Hehe
        if (!is_array($data)) {
            $this->error("Data tidak berbentuk array saat ingin disimpan ke kolom JSON.");
            return;
        }

        $warga = Warga::where('device_id', $device->id)->first();
        $user = Warga::where('device_id', $device->id)->with('user')->first()?->user;
        $this->info("Info Warga : {$warga}");
        $this->info("Info User : {$user}");
        $baseKeys = ['ph', 'tds', 'turbidity'];
        $extraKeys = [];

        try {
            if ($user && $user->role !== 'admin') {
                $extraKeys = ['volume_liters', 'volume_m3', 'flow_m3_second'];
            } else {
                $waterCondition = $this->WaterStatus([
                    'device_id' => $device_id,
                    'ph' => $data['ph'] ?? 0,
                    'tds' => $data['tds'] ?? 0,
                    'turbidity' => $data['turbidity'] ?? 0,
                ]);
                // $this->error("Water Condition: " . $waterCondition);
            }
        } catch (\Throwable $th) {
            $this->error($th->getMessage());
        }

        $keys = array_merge($baseKeys, $extraKeys);

        $filteredValues = Arr::only((array) $data, $keys);
        $this->info('Data Masuk: ' . json_encode($data));
        $this->info('Filtered Keys: ' . json_encode($keys));
        $this->info('Filtered Values: ' . json_encode($filteredValues));

        $this->info("Device ID: {$device_id}");

        if (isset($filteredValues['volume_liters'], $filteredValues['volume_m3'], $filteredValues['flow_m3_second'])) {
            $this->error("Masuk Kondisi Volume Liter dan Volume M3");
            // Cek data terakhir dalam 1 bulan terakhir
            $tagihanPerMonth = Tagihan::where('warga_id', $warga->warga_id)
                ->whereNotNull('meter_awal')
                ->whereNotNull('meter_akhir')
                ->where('created_at', '>=', now()->subMonth())
                ->latest()
                ->first();
            $tarif = Tarif::first();
            $harga = $tarif->harga;
            if ($tagihanPerMonth) {
                $meterAwal = $tagihanPerMonth->meter_awal;
                $meterAkhirBaru = $filteredValues['volume_m3'];
                $pemakaian = $meterAkhirBaru - $meterAwal;

                $tagihanPerMonth->update([
                    'meter_akhir' => $meterAkhirBaru,
                    'pemakaian' => $pemakaian,
                    'total_bayar' => $pemakaian * $harga
                ]);
            } else {
                $meterAwal = 0;
                $meterAkhir = $filteredValues['volume_m3'];
                $pemakaian = $meterAkhir - $meterAwal;

                Tagihan::create([
                    'warga_id' => $warga->warga_id,
                    'device_id' => $device->id,
                    'tarif_id' => $tarif->tarif_id,
                    'meter_awal' => $meterAwal,
                    'meter_akhir' => $meterAkhir,
                    'tanggal_mulai' => now(),
                    'tanggal_akhir' => now()->addDays(30),
                    'pemakaian' => $pemakaian,
                    'total_bayar' => $pemakaian * $harga,
                    'status' => 'belum_lunas',
                ]);
            }
            $exceptFlowKubic = Arr::except($filteredValues, ['flow_m3_second']);
            $latestSensorData = SensorData::where('device_id', $device->id)
                ->whereNotNull('value->volume_liters')
                ->whereNotNull('value->volume_m3')
                ->where('created_at', '>=', now()->subMonth())
                ->latest()
                ->first();

            if ($latestSensorData) {
                // Update data yang sudah ada
                $latestSensorData->update([
                    'value' => $exceptFlowKubic,
                ]);
            } else {
                // Belum ada data sama sekali dalam 1 bulan terakhir
                SensorData::create([
                    'device_id' => $device->id,
                    'value' => $exceptFlowKubic,
                ]);
            }
        } else {
            // Sensor biasa (non-FLOW) tetap disimpan seperti biasa
            SensorData::create([
                'device_id' => $device->id,
                'value' => $filteredValues,
            ]);
        }
        $this->info("SensorData untuk {$device_id} berhasil diupdate/insert.");
        SensorUpdated::dispatch($device_id, $filteredValues);
        $this->error("Sensor data dispatched ");
        WaterConditionStatus::dispatch($waterCondition);
        $this->error("Water Status Condition data dispatched");
        $this->error("Water Condition: " . $waterCondition);
    }

    public function WaterStatus($data)
    {
        $this->error("===> WaterStatus START: " . json_encode($data));

        $waterQualityService = new FuzzyWaterQualityService();

        $this->error("===> CALLING calculateWaterQuality...");
        $result = $waterQualityService->calculateWaterQuality(
            $data['ph'] ?? 0,
            $data['tds'] ?? 0,
            $data['turbidity'] ?? 0
        );
        $this->error("===> RESULT calculateWaterQuality: " . json_encode($result));

        $valueFuzzy = $result['result'] ?? null;

        $this->error("===> CALLING defineWaterCondition...");
        $waterCondition = $waterQualityService->defineWaterCondition($valueFuzzy);
        $this->error("===> Water Condition Result: " . $waterCondition);

        return $waterCondition;
    }



    public function handle()
    {
        $this->info('Connecting to MQTT broker...');
        $this->mqtt = MQTT::connection();
        $this->info('Connected.');

        $this->info('Subscribing to topic...');
        $this->mqtt->subscribe(
            'water_monitoring/+/data',
            function (string $topic, string $message) {
                // $this->info("Topic: {$topic}");
                // $this->info("Message: {$message}");
    
                // Parse pesan, misalnya JSON
                $data = json_decode($message, true);

                if (!isset($data['device_id'])) {
                    $this->error('device_id tidak ditemukan di message.');
                    return;
                }

                // Ambil data device dari DB
                $device = Device::where('device_id', $data['device_id'])->first();
                if (!$device) {
                    $this->error("Device dengan ID {$data['device_id']} tidak ditemukan.");
                    return;
                }

                $this->updateData($data['device_id'], $data);
            },
            2
        );

        $this->mqtt->loop();

        return "SUCCESS";
    }
}
