<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\SensorData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class DeviceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Device::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('device_id', 'like', "%{$search}%")
                    ->orWhere('mac_address', 'like', "%{$search}%");
            });
        }

        if ($request->has('sortBy') && $request->has('sortDir')) {
            $query->orderBy($request->sortBy, $request->sortDir);
        }
        $search = $request->input('search');
        $sortBy = $request->input('sortBy', 'created_at');
        $sortDir = $request->input('sortDir', 'asc');
        $perPage = $request->input('perPage', 10);
        $devices = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/devices/index', [
            'devices' => $devices->through(fn($device) => [
                'id' => $device->id,
                'device_id' => $device->device_id,
                'mac_address' => $device->mac_address,
                'status' => $device->status,
                'created_at' => $device->created_at->format('d/m/Y H:i:s'),
                'updated_at' => $device->updated_at->format('d/m/Y H:i:s'),
            ]),
            'filters' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDir' => $sortDir,
                'perPage' => $perPage,
            ],
            'pagination' => [
                'current_page' => $devices->currentPage(),
                'per_page' => $devices->perPage(),
                'total' => $devices->total(),
            ],
            // 'success' => $request->session()->get('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'device_id' => 'required|string|min:6|max:10|unique:devices,device_id',
            'mac_address' => 'required|string|min:17|max:17|unique:devices,mac_address',
            'status' => 'required|in:aktif,tidak_aktif',
        ]);

        $device = Device::create([
            'device_id' => $validated['device_id'],
            'mac_address' => $validated['mac_address'],
            'status' => $validated['status'],
        ]);

        $device->save();

        return back()->with('success', __('Device berhasil ditambahkan'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $devices)
    {
        $device = Device::where('device_id', $devices)->firstOrFail();
        $query = $device->sensorData();
        if (!$device) {
            return abort(404);
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('device_id', 'like', "%{$search}%")
                    ->orWhere('value', 'like', "%{$search}%");
            });
        }

        if ($request->has('sortBy') && $request->has('sortDir')) {
            $query->orderBy($request->sortBy, $request->sortDir);
        }

        $search = $request->input('search');
        $sortBy = $request->input('sortBy', 'created_at');
        $sortDir = $request->input('sortDir', 'asc');
        $perPage = $request->input('perPage', 10);
        $sensors = $query->paginate($perPage)->withQueryString();
        return Inertia::render('admin/devices/sensor/index',  [
            'sensors' => $sensors->through(fn($sensor) => [
                'sensor_data_id' => $sensor->sensor_data_id,
                'device' => [
                    'device_id' => $sensor->device->device_id,
                ],
                'value' => $sensor->value,
                'created_at' => $sensor->created_at->format('d/m/Y H:i:s'),
                'updated_at' => $sensor->updated_at->format('d/m/Y H:i:s'),
            ]),
            'filters' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDir' => $sortDir,
                'perPage' => $perPage,
            ],
            'pagination' => [
                'current_page' => $sensors->currentPage(),
                'per_page' => $sensors->perPage(),
                'total' => $sensors->total(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Device $devices): RedirectResponse
    {
        $validated = $request->validate([
            'device_id' => 'required|string|min:6|max:10',
            'mac_address' => 'required|string|min:17|max:17',
            'status' => 'required|in:aktif,tidak_aktif',
        ]);
        $existsDeviceId = Device::where('device_id', $validated['device_id'])
            ->where('id', '!=', $devices->id)
            ->exists();

        if ($existsDeviceId) {
            return back()->withErrors(['device_id' => 'Device ID sudah digunakan.']);
        }

        $existsMac = Device::where('mac_address', $validated['mac_address'])
            ->where('id', '!=', $devices->id)
            ->exists();

        if ($existsMac) {
            return back()->withErrors(['mac_address' => 'MAC Address sudah digunakan.']);
        }
        if (
            $validated['device_id'] === $devices->device_id &&
            $validated['mac_address'] === $devices->mac_address &&
            $validated['status'] === $devices->status
        ) {
            return back()->withErrors(['message' => 'Tidak ada perubahan data.']);
        }

        $devices->update($validated);

        return back()->with('success', __('Device berhasil diperbarui'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($devices): RedirectResponse
    {
        $devices = Device::where('id', $devices)->first();

        $devices->delete();

        return back()->with('success', __('Device berhasil dihapus'));
    }
}
