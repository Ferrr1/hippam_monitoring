<?php

namespace App\Console\Commands;

use App\Events\SensorUpdated;
use App\Models\Device;
use App\Models\SensorData;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use PhpMqtt\Client\Facades\MQTT;

class MqttListener extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mqtt:subscribe';
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
        if (Str::contains($device->device_id, 'FLOW')) {
            $keys = ['volume_liters', 'volume_m3'];
        } else {
            $keys = ['ph', 'tds', 'turbidity'];
        }

        $filteredValues = Arr::only((array) $data, $keys);
        SensorUpdated::dispatch($device_id, $filteredValues);

        if (isset($filteredValues['volume_liters'], $filteredValues['volume_m3'])) {
            // Cek data terakhir dalam 1 bulan terakhir
            $latestData = SensorData::where('device_id', $device->id)
                ->whereNotNull('value->volume_liters')
                ->whereNotNull('value->volume_m3')
                ->where('created_at', '>=', now()->subMonth())
                ->latest()
                ->first();

            if ($latestData) {
                // Update data yang sudah ada
                $latestData->update([
                    'value' => $filteredValues,
                ]);
            } else {
                // Belum ada data sama sekali dalam 1 bulan terakhir
                SensorData::create([
                    'device_id' => $device->id,
                    'value' => $filteredValues,
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


        $this->info("[$device_id] Data updated successfully.");
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
