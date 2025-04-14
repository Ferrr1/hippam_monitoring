<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    // SensorData.php
    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    public function sensorType()
    {
        return $this->belongsTo(SensorType::class, 'sensor_type_id');
    }
}
