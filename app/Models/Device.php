<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = [
        'device_id',
        'mac_address',
        'status',
    ];
    // Device.php
    public function tagihan()
    {
        return $this->hasMany(Tagihan::class, 'device_id');
    }

    public function sensorData()
    {
        return $this->hasMany(SensorData::class, 'device_id');
    }
}
