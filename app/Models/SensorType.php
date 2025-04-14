<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorType extends Model
{
    // SensorType.php
    public function sensorData()
    {
        return $this->hasMany(SensorData::class, 'sensor_type_id');
    }
}
