<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    protected $primaryKey = 'sensor_data_id';
    protected $fillable = [
        'device_id',
        'value',
    ];
    // SensorData.php
    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }
}
