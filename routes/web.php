<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\WargaController;

Route::get('/', function () {
    return to_route('login');
})->name('home');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('admin/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('admin.dashboard');
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
    // Route Untuk Tagihan
    Route::get('admin/tagihan', function () {
        return Inertia::render('admin/tagihan');
    })->name('tagihan.index');
    Route::get('admin/tarif', function () {
        return Inertia::render('admin/tarif');
    })->name('tarif.index');
    Route::get('admin/fuzzy', function () {
        return Inertia::render('admin/fuzzy');
    })->name('fuzzy.index');
});
Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('user.dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
