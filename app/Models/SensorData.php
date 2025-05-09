<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    protected $primaryKey = 'sensor_data_id';
    protected $casts = [
        'value' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    protected $fillable = [
        'device_id',
        'value',
        'created_at',
        'updated_at'
    ];

    // SensorData.php
    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }
}
