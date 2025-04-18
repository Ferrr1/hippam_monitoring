<?php

namespace App\Services;

use App\Models\Tagihan;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;

class MqttService
{
    protected $client;

    public function __construct()
    {
        $server = env('MQTT_HOST', 'localhost');
        $port = env('MQTT_PORT', 1883);
        $clientId = uniqid('mqtt-client-', true);

        $this->client = new MqttClient($server, $port, $clientId);
    }

    public function connect()
    {
        $settings = (new ConnectionSettings)
            ->setUsername(env('MQTT_USERNAME'))
            ->setPassword(env('MQTT_PASSWORD'))
            ->setKeepAliveInterval(60);

        $this->client->connect($settings);
    }

    public function subscribe($topic)
    {
        $this->client->subscribe($topic, function (string $topic, string $message) {
            // Handle incoming message
            echo ("Received message on topic {$topic}: {$message}");
            $data = json_decode($message, true);

            if (is_array($data)) {
                Tagihan::create([
                    // 'device_id'        => $data['device_id'] ?? 0,
                    'value'       => $data['volume_m3'] ?? 0,
                    // 'value' => $data['turbidity'] ?? 0,
                    // 'value' => $data['total_volume'] ?? 0,
                ]);

                echo "✅ Data disimpan ke database: " . json_encode($data) . "\n";
            } else {
                echo "⚠ Data tidak valid: $message\n";
            }
        });
    }

    public function publish($topic, $message)
    {
        $this->client->publish($topic, $message, 0);
    }

    public function loop()
    {
        // Start receiving messages
        $this->client->loop();
    }

    public function isConnected()
    {
        return $this->client->isConnected();
    }

    public function disconnect()
    {
        $this->client->disconnect();
    }
}
