<?php

namespace App\Exports;

use App\Models\SensorData;
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
        return array_merge(['Device ID'], $this->dynamicKeys, ['Created At', 'Updated At']);
    }

    public function map($row): array
    {
        $value = is_array($row->value) ? $row->value : json_decode($row->value, true);

        $mappedValues = [];
        foreach ($this->dynamicKeys as $key) {
            $mappedValues[] = $value[$key] ?? null;
        }

        return array_merge([
            $row->device_id,
        ], $mappedValues, [
            $row->created_at ? $row->created_at->format('Y-m-d H:i:s') : null,
            $row->updated_at ? $row->updated_at->format('Y-m-d H:i:s') : null,
        ]);
    }
}
