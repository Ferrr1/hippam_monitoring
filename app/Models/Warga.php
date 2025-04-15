<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warga extends Model
{

    protected $primaryKey = 'warga_id';
    protected $fillable = [
        'users_id',
        'no_telp',
        'alamat',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function tagihan()
    {
        return $this->hasMany(Tagihan::class, 'warga_id');
    }
}
