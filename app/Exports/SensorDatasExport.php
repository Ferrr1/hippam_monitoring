<?php

namespace App\Exports;

use App\Models\SensorData;
use App\Services\FuzzyWaterQualityService;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SensorDatasExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * @return \Illuminate\Support\Collection
     */

    protected $deviceId;
    protected $dynamicKeys = [];

    public function __construct($deviceId)
    {
        $this->deviceId = $deviceId;

        // Ambil data pertama untuk membaca key JSON secara dinamis
        $sample = SensorData::where('device_id', $this->deviceId)->first();

        if ($sample) {
            $value = is_array($sample->value) ? $sample->value : json_decode($sample->value, true);
            if (is_array($value)) {
                $this->dynamicKeys = array_keys($value); // simpan key JSON
            }
        }
    }

    public function collection()
    {
        return SensorData::where('device_id', $this->deviceId)->get();
    }

    public function headings(): array
    {
        return array_merge(['Device ID'], $this->dynamicKeys, [
            'Fuzzifikasi pH Basa',
            'Fuzzifikasi pH Netral',
            'Fuzzifikasi pH Asam',
            'Fuzzifikasi TDS Rendah',
            'Fuzzifikasi TDS Sedang',
            'Fuzzifikasi TDS Tinggi',
            'Fuzzifikasi Turbidity Jernih',
            'Fuzzifikasi Turbidity Sedang',
            'Fuzzifikasi Turbidity Keruh',
            'Nilai Max Bahaya',
            'Nilai Max Waspada',
            'Nilai Max Aman',
            'Himpunan Bahaya',
            'Himpunan Waspada Naik',
            'Himpunan Waspada Turun',
            'Himpunan Aman',
            'Momen 1',
            'Momen 2',
            'Momen 3',
            'Area 1',
            'Area 2',
            'Area 3',
            'Nilai Deffuzifikasi',
            'Water Condition',
            'Created At',
            'Updated At'
        ]);
    }

    public function map($row): array
    {
        $value = is_array($row->value) ? $row->value : json_decode($row->value, true);

        $mappedValues = [];
        foreach ($this->dynamicKeys as $key) {
            $mappedValues[] = $value[$key] ?? null;
        }
        $waterQualityService = new FuzzyWaterQualityService();
        $fuzzyMamdani = $waterQualityService->calculateWaterQuality(
            $mappedValues[0] ?? 0,
            $mappedValues[1] ?? 0,
            $mappedValues[2] ?? 0
        );
        $water_condition = $waterQualityService->defineWaterCondition($fuzzyMamdani['result']);
        // dd($fuzzyMamdani['himpunan'], $water_condition);
        // 'value_fuzzy' => $fuzzyMamdani,
        //         'water_condition' => $water_condition,
        return array_merge([
            $row->device_id,
        ], $mappedValues, [
            $fuzzyMamdani['ph']['phBasa'],
            $fuzzyMamdani['ph']['phNetral'],
            $fuzzyMamdani['ph']['phAsam'],
            $fuzzyMamdani['tds']['tdsRendah'],
            $fuzzyMamdani['tds']['tdsSedang'],
            $fuzzyMamdani['tds']['tdsTinggi'],
            $fuzzyMamdani['turbidity']['turbidityJernih'],
            $fuzzyMamdani['turbidity']['turbiditySedang'],
            $fuzzyMamdani['turbidity']['turbidityKeruh'],
            $fuzzyMamdani['membership']['membershipBahaya'],
            $fuzzyMamdani['membership']['membershipWaspada'],
            $fuzzyMamdani['membership']['membershipAman'],
            $fuzzyMamdani['himpunan']['himpunanBahayaBaru'],
            $fuzzyMamdani['himpunan']['himpunanWaspadaLinearNaikBaru'],
            $fuzzyMamdani['himpunan']['himpunanWaspadaLinearTurunBaru'],
            $fuzzyMamdani['himpunan']['himpunanAmanBaru'],
            $fuzzyMamdani['momen']['momen1'],
            $fuzzyMamdani['momen']['momen2'],
            $fuzzyMamdani['momen']['momen3'],
            $fuzzyMamdani['area']['area1'],
            $fuzzyMamdani['area']['area2'],
            $fuzzyMamdani['area']['area3'],
            $fuzzyMamdani['result'],
            $water_condition,
            $row->created_at ? $row->created_at->format('Y-m-d H:i:s') : null,
            $row->updated_at ? $row->updated_at->format('Y-m-d H:i:s') : null,
        ]);
    }
}
