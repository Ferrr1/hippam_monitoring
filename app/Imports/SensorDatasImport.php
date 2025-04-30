<?php

namespace App\Imports;

use App\Models\SensorData;
use Maatwebsite\Excel\Concerns\ToModel;

class SensorDatasImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    protected $deviceId;

    public function __construct($deviceId)
    {
        $this->deviceId = $deviceId;
    }
    public function model(array $row)
    {
        $json = json_decode($row[0], true);

        // Validasi JSON
        if (!is_array($json) || !isset($json['ph'], $json['tds'], $json['turbidity'])) {
            return null;
        }

        // Cek apakah tanggal valid
        $createdAt = !empty($row[1])
            ? \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row[1])
            : now();

        $updatedAt = !empty($row[2])
            ? \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row[2])
            : now();

        $model = new SensorData([
            'device_id' => $this->deviceId,
            'value' => $json,
            'created_at' => $createdAt,
            'updated_at' => $updatedAt,
        ]);

        $model->timestamps = false;

        return $model;
    }

}
