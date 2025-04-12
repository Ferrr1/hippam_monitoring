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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('data-warga', function () {
        return Inertia::render('admin/data-warga');
    })->name('data-warga');
    Route::get('tagihan', function () {
        return Inertia::render('admin/tagihan');
    })->name('tagihan');
    Route::get('tarif', function () {
        return Inertia::render('admin/tarif');
    })->name('tarif');
    Route::get('/test-email', function () {
        Mail::raw('Test email dari Laravel via Mailtrap', function ($message) {
            $message->to('maulanasetyawan8@gmail.com') // Bebas, Mailtrap akan nangkep semua
                ->subject('Tes Kirim Email');
        });

        return '✅ Email test dikirim (kalau config benar).';
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
