<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tagihan extends Model
{
    protected $primaryKey = 'tagihan_id';
    protected $fillable = [
        'warga_id',
        'device_id',
        'tarif_id',
        'meter_awal',
        'meter_akhir',
        'tanggal_mulai',
        'tanggal_akhir',
        'pemakaian',
        'total_bayar',
        'status',
    ];
    public function warga()
    {
        return $this->belongsTo(Warga::class, 'warga_id');
    }

    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    public function tarif()
    {
        return $this->belongsTo(Tarif::class, 'tarif_id');
    }
}
