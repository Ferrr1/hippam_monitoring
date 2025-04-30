<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SensorUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public string $device_id;
    public array $payload;

    public string $flow;

    public function __construct($device_id, $payload, $flow)
    {
        $this->device_id = $device_id;
        $this->payload = $payload;
        $this->flow = $flow;
    }

    public function broadcastWith(): array
    {
        return [
            'device_id' => $this->device_id,
            'value' => $this->payload,
            'flow' => $this->flow
        ];
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): Channel
    {
        logger('📡 Broadcasting to channel: data_monitoring.' . $this->device_id);
        return new Channel('data_monitoring.' . $this->device_id);
    }
    public function broadcastAs()
    {
        return 'SensorUpdated';
    }
}
