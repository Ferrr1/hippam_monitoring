<?php

namespace App\Console\Commands;

use App\Models\Device;
use Illuminate\Console\Command;

class CheckInactiveDevices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:inactive-devices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        logger('This scheduler devices is working!');
        $threshold = now()->subMinutes(2); // 2 menit tidak update = tidak aktif

        $updated = Device::where('status', 'aktif')
            ->where('last_seen_at', '<', $threshold)
            ->update(['status' => 'tidak_aktif']);

        $this->info("Device non-aktif: $updated");
    }
}
