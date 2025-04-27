<?php

namespace Database\Factories;

use App\Models\Tagihan;
use App\Models\Warga;
use App\Models\Device;
use App\Models\Tarif;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TagihanFactory extends Factory
{
    protected $model = Tagihan::class;

    public function definition(): array
    {
        // Ambil warga random
        $warga = Warga::inRandomOrder()->first();

        // Ambil device milik warga ini
        $device = Device::inRandomOrder()->first();

        // Ambil tarif pertama
        $tarif = Tarif::first();

        $bulanIni = Carbon::now();

        // Pastikan bukti pembayaran dummy ada

        $meterAwal = $this->faker->numberBetween(1000, 2000);
        $pemakaian = $this->faker->numberBetween(10, 100);
        $meterAkhir = $meterAwal + $pemakaian;
        $hargaPerM3 = 5000;
        $totalBayar = $pemakaian * $hargaPerM3;

        return [
            'warga_id' => $warga->warga_id,
            'device_id' => $device->id,
            'tarif_id' => $tarif->tarif_id,
            'meter_awal' => $meterAwal,
            'meter_akhir' => $meterAkhir,
            'tanggal_mulai' => $bulanIni->copy()->startOfMonth(),
            'tanggal_akhir' => $bulanIni->copy()->endOfMonth(),
            'pemakaian' => $pemakaian,
            'total_bayar' => $totalBayar,
            'status' => $this->faker->randomElement(['lunas', 'belum_lunas']),
            'bukti_pembayaran' => 'https://picsum.photos/720/1366?' . rand(1, 10000),
        ];
    }
}
