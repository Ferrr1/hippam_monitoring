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
        Schema::create('wargas', function (Blueprint $table) {
            $table->id('warga_id');
            $table->foreignId('users_id')->unique()->constrained('users')->onDelete('cascade');
            $table->foreignId('device_id')->unique()->nullable()->constrained('devices')->onDelete('cascade');
            $table->string('no_telp', 16);
            $table->text('alamat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wargas');
    }
};
