<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sensor_data', function (Blueprint $table) {
            $table->id('sensor_data_id');
            $table->string('device_id');
            $table->foreign('device_id')->references('device_id')->on('devices')->onDelete('cascade');
            $table->foreignId('sensor_type_id')->references('sensor_type_id')->on('sensor_types')->onDelete('cascade');
            $table->json('value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_data');
    }
};
