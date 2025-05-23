<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;
    protected $fillable = [
        'device_id',
        'status',
        'last_seen_at'
    ];
    // Device.php
    public function tagihan()
    {
        return $this->hasMany(Tagihan::class, 'device_id');
    }

    public function warga()
    {
        return $this->hasOne(Warga::class, 'device_id');
    }

    public function sensorData()
    {
        return $this->hasMany(SensorData::class, 'device_id');
    }
}
