<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    protected $fillable = [
        'harga',
    ];
    // TarifAir.php
    public function tagihan()
    {
        return $this->hasMany(Tagihan::class, 'tarif_id');
    }
}
