<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function getDataMonitoringDevice(Request $request)
    {
        try {
            $user = $request->user();
            $isAdmin = $user->role === 'admin';

            $devices = Device::when($isAdmin, function ($query) {
                // Admin hanya melihat device yang mengandung 'MTG'
                $query->where('device_id', 'LIKE', '%MTG%');
            }, function ($query) use ($user) {
                // User biasa: lihat device yang dimilikinya + MTG
                $query->where(function ($subQuery) use ($user) {
                    $subQuery->whereHas('warga', function ($q) use ($user) {
                        $q->where('users_id', $user->id);
                    })->orWhere('device_id', 'LIKE', '%MTG%');
                });
            })->get();

            return Inertia::render('dashboard', [
                'devices' => $devices->pluck('device_id'),
            ]);
        } catch (Exception $e) {
            return dd($e);
        }
    }
}
