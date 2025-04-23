<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function getDataMonitoringDevice(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        // Ambil data device berdasarkan role
        $devices = Device::when($isAdmin, function ($query) {
            // Jika admin, hanya cari device yang mengandung 'MTG'
            $query->where('device_id', 'LIKE', '%MTG%');
        }, function ($query) {
            // Jika bukan admin, cari 'MTG' atau 'FLOW'
            $query->where(function ($subQuery) {
                $subQuery->where('device_id', 'LIKE', '%MTG%')
                    ->orWhere('device_id', 'LIKE', '%FLOW%');
            });
        })
            ->get();

        return Inertia::render('dashboard', [
            'devices' => $devices->pluck('device_id'),
        ]);
    }
}
