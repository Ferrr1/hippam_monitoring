<?php

namespace App\Console\Commands;

use App\Services\MqttService;
use Illuminate\Console\Command;

class MqttStart extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mqtt:start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Starting MQTT Client';

    /**
     * Execute the console command.
     */
    protected $mqttService;

    public function __construct(MqttService $mqttService)
    {
        parent::__construct();
        $this->mqttService = $mqttService;
    }

    public function handle()
    {
        $this->mqttService->connect();
        $this->mqttService->subscribe('water_monitoring/ESP_02_FLOW/data');  // Ganti dengan topik yang sesuai
        $this->info('MQTT Client started and subscribed to topic "your/topic"');

        // Menjaga aplikasi berjalan dan mendengarkan pesan MQTT
        while ($this->mqttService->isConnected()) {
            $this->mqttService->loop();
        }
    }
}
