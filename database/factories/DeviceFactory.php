<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Device>
 */
class DeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $counter = 0;

        if ($counter === 0) {
            $deviceId = 'ESP_MTG';
        } else {
            $deviceId = 'ESP_' . str_pad($counter, 2, '0', STR_PAD_LEFT) . '_FLOW';
        }

        $counter++;

        return [
            'device_id' => $deviceId,
        ];
    }
}
