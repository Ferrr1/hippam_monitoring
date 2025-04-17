<?php

namespace Database\Seeders;

use App\Models\User;
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
        User::factory(20)->create();
    }
}
