<?php

namespace Database\Seeders;

use App\Models\Tagihan;
use App\Models\Warga;
use App\Models\Device;
use App\Models\Tarif;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TagihanSeeder extends Seeder
{
    public function run(): void
    {
        $wargas = Warga::all();
        $devices = Device::all()->keyBy('device_id'); // biar gampang assign
        $tarif = Tarif::first(); // ambil satu tarif saja

        // Simulasi upload bukti pembayaran
        $buktiPembayaranPath = 'bukti_pembayaran/test.jpg';
        if (!Storage::exists($buktiPembayaranPath)) {
            Storage::put(
                $buktiPembayaranPath,
                file_get_contents('https://picsum.photos/300')
            );
        }

        $bulanIni = Carbon::now();

        foreach ($wargas as $warga) {
            $device = $devices->where('warga_id', $warga->warga_id)->first();

            // Jika tidak ada device milik warga ini, skip
            if (!$device) {
                continue;
            }

            // Cek kalau sudah ada tagihan bulan ini untuk warga ini, skip (aturan 1 tagihan per bulan per warga)
            $sudahAdaTagihan = Tagihan::where('warga_id', $warga->warga_id)
                ->whereMonth('tanggal_mulai', $bulanIni->month)
                ->whereYear('tanggal_mulai', $bulanIni->year)
                ->exists();

            if ($sudahAdaTagihan) {
                continue;
            }

            $meterAwal = random_int(1000, 2000);
            $pemakaian = random_int(10, 100); // pakai random pemakaian
            $meterAkhir = $meterAwal + $pemakaian;
            $hargaPerM3 = 5000; // misal
            $totalBayar = $pemakaian * $hargaPerM3;

            Tagihan::create([
                'warga_id' => $warga->warga_id,
                'device_id' => $device->device_id,
                'tarif_id' => $tarif->tarif_id,
                'meter_awal' => $meterAwal,
                'meter_akhir' => $meterAkhir,
                'tanggal_mulai' => $bulanIni->copy()->startOfMonth(),
                'tanggal_akhir' => $bulanIni->copy()->endOfMonth(),
                'pemakaian' => $pemakaian,
                'total_bayar' => $totalBayar,
                'status' => fake()->randomElement(['lunas', 'belum_lunas']),
                'bukti_pembayaran' => $buktiPembayaranPath,
            ]);
        }
    }
}
