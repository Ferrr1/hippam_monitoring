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
        Schema::create('tagihans', function (Blueprint $table) {
            $table->id('tagihan_id');
            $table->foreignId('warga_id')->references('warga_id')->on('wargas')->onDelete('cascade');
            $table->string('device_id');
            $table->foreign('device_id')->references('device_id')->on('devices')->onDelete('cascade');
            $table->foreignId('tarif_id')->references('tarif_id')->on('tarifs')->onDelete('cascade');
            $table->string('periode');
            $table->float('pemakaian');
            $table->bigInteger('total_bayar');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tagihans');
    }
};
