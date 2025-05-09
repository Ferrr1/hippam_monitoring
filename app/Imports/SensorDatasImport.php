<?php

namespace App\Imports;

use App\Models\SensorData;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SensorDatasImport implements ToModel, WithHeadingRow
{
    protected $deviceId;

    public function __construct($deviceId)
    {
        $this->deviceId = $deviceId;
    }

    public function model(array $row)
    {
        if (!isset($row['ph'], $row['tds'], $row['turbidity'])) {
            return null;
        }

        $ph = $row['ph'];
        $tds = $row['tds'];
        $turbidity = $row['turbidity'];

        // Perbaikan di sini
        $createdAt = isset($row['created_at']) || !empty($row['created_at'])
            ? \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['created_at'])
            : now();

        $updatedAt = isset($row['updated_at']) || !empty($row['updated_at'])
            ? \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['updated_at'])
            : now();

        $model = new SensorData([
            'device_id' => $this->deviceId,
            'value' => [
                'ph' => $ph,
                'tds' => $tds,
                'turbidity' => $turbidity,
            ],
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
        ]);

        $model->timestamps = false;

        return $model;
    }
}
