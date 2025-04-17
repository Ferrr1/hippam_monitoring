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
            $table->foreignId('warga_id')
                ->constrained('wargas', 'warga_id')
                ->onDelete('cascade');
            $table->foreignId('device_id')
                ->constrained('devices')
                ->onDelete('cascade');
            $table->foreignId('tarif_id')
                ->constrained('tarifs', 'tarif_id')
                ->onDelete('cascade');
            $table->date('tanggal_mulai');
            $table->date('tanggal_akhir');
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
