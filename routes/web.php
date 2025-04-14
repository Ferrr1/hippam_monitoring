<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return to_route('login');
})->name('home');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::post('register', [RegisteredUserController::class, 'store'])->name('register.store');
    Route::put('register/{email}/update', [RegisteredUserController::class, 'update'])->name('register.update');
    Route::delete('register/delete/{email}', [RegisteredUserController::class, 'destroy'])->name('register.destroy');
    Route::get('admin/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('admin.dashboard');
    Route::get('admin/pengguna', [RegisteredUserController::class, 'index'])->name('pengguna.index');
    Route::get('admin/data-warga', function () {
        return Inertia::render('admin/data-warga');
    })->name('data-warga.index');
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
