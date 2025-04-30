<?php

use App\Events\SensorUpdated;
use App\Http\Controllers\Admin\DeviceController;
use App\Http\Controllers\Admin\SensorDataController;
use App\Http\Controllers\Admin\TagihanController;
use App\Http\Controllers\Admin\TarifAirController;
use App\Http\Controllers\Admin\WargaController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FuzzyController;
use App\Http\Controllers\User\RiwayatTagihanController;
use App\Http\Controllers\User\TagihanUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return to_route('login');
})->name('home');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('admin/dashboard', [DashboardController::class, 'getDataMonitoringDevice'])->name('admin.dashboard');
    // Route Untuk Pengguna/User
    Route::post('register', [RegisteredUserController::class, 'store'])->name('register.store');
    Route::put('/register/{user}/update', [RegisteredUserController::class, 'update'])->name('register.update');
    Route::delete('register/delete/{email}', [RegisteredUserController::class, 'destroy'])->name('register.destroy');
    Route::get('admin/pengguna', [RegisteredUserController::class, 'index'])->name('pengguna.index');
    // Route Untuk Warga
    Route::get('admin/warga', [WargaController::class, 'index'])->name('warga.index');
    Route::post('admin/warga/store', [WargaController::class, 'store'])->name('warga.store');
    Route::put('admin/warga/{warga}/update', [WargaController::class, 'update'])->name('warga.update');
    Route::delete('admin/warga/{warga}/destroy', [WargaController::class, 'destroy'])->name('warga.destroy');
    // Route Untuk Devices
    Route::get('admin/devices', [DeviceController::class, 'index'])->name('devices.index');
    Route::post('admin/devices/store', [DeviceController::class, 'store'])->name('devices.store');
    Route::put('admin/devices/{devices}/update', [DeviceController::class, 'update'])->name('devices.update');
    Route::delete('admin/devices/{devices}/destroy', [DeviceController::class, 'destroy'])->name('devices.destroy');
    // Route Sensor Data Per Device
    Route::get('admin/devices/{devices:device_id}/show', [DeviceController::class, 'show'])->name('devices.show');
    Route::post('admin/devices/sensor/{sensor}/import', [SensorDataController::class, 'importData'])->name('devices.sensor.importData');
    Route::get('admin/devices/sensor/{sensor}/export', [SensorDataController::class, 'exportData'])->name('devices.sensor.exportData');
    Route::delete('admin/devices/sensor/{sensor}/destroy', [SensorDataController::class, 'destroy'])->name('devices.sensor.destroy');
    // Route Untuk Tagihan
    Route::get('admin/tagihan', [TagihanController::class, 'index'])->name('tagihan.index');
    Route::put('admin/tagihan/{tagihan}/update', [TagihanController::class, 'update'])->name('tagihan.update');
    Route::delete('admin/tagihan/{tagihan}/destroy', [TagihanController::class, 'destroy'])->name('tagihan.destroy');
    Route::get('admin/tagihan/report', [TagihanController::class, 'report'])->name('tagihan.report');
    // Route Untuk Tarif
    Route::get('admin/tarif', [TarifAirController::class, 'index'])->name('tarif.index');
    Route::post('admin/tarif/store', [TarifAirController::class, 'store'])->name('tarif.store');
    // Route Untuk Fuzzy
    Route::get('admin/fuzzy', [FuzzyController::class, 'index'])->name('fuzzy.index');
});
Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'getDataMonitoringDevice'])->name('user.dashboard');
    Route::get('/tagihan', [TagihanUserController::class, 'index'])->name('user.tagihan.index');
    Route::post('/tagihan/{tagihan}/payment/', [TagihanUserController::class, 'payment'])->name('proof.payment');
    Route::get('/riwayat-tagihan', [RiwayatTagihanController::class, 'index'])->name('user.riwayat_tagihan.index');
});

Route::get('/test-broadcast', function () {
    broadcast(new SensorUpdated('ESP_02_FLOW', [
        'value' => ['volume_liters' => 10.5, 'volume_m3' => 0.01]
    ]));

    return 'broadcasted!';
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
