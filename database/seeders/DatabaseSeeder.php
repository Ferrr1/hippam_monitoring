<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\Tagihan;
use App\Models\Tarif;
use App\Models\User;
use App\Models\Warga;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Feri Admin',
            'email' => 'maulanasetyawan8@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'remember_token' => Str::random(10),
        ]);

        // 100 user dummy
        $users = User::factory(100)->create();

        // Buat devices
        $devices = Device::factory()->count(100)->create();

        // Buat warga dan hubungkan dengan user + device (unik)
        foreach ($users as $index => $user) {
            Warga::factory()->create([
                'users_id' => $user->id,
                'device_id' => $devices[$index]->id,
            ]);
        }

        // Buat tarif sekali saja
        Tarif::create([
            'harga' => 5000
        ]);
        $wargas = Warga::all();

        foreach ($wargas as $warga) {
            Tagihan::factory()->create([
                'warga_id' => $warga->warga_id,
            ]);
        }
    }
}
