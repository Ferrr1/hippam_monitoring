<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\User;
use App\Models\Warga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WargaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $queryWarga = Warga::query();
        $queryUser = User::query();
        $queryDevice = Device::query();

        $search = $request->input('search');
        $sortBy = $request->input('sortBy', 'created_at');
        $sortDir = $request->input('sortDir', 'asc');
        $perPage = $request->input('perPage', 10);

        // Search logic
        if ($search) {
            $searchTerm = addcslashes($search, '%_\\');

            $queryWarga->where(function ($q) use ($searchTerm) {
                $q->where('no_telp', 'like', "%{$searchTerm}%")
                    ->orWhere('alamat', 'like', "%{$searchTerm}%")
                    ->orWhereHas('user', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%")
                            ->orWhere('email', 'like', "%{$searchTerm}%");
                    })
                    ->orWhereHas('device', function ($q) use ($searchTerm) {
                        $q->where('device_id', 'like', "%{$searchTerm}%");
                    });
            });


            $queryUser->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%");
            });
            $queryDevice->where(function ($q) use ($searchTerm) {
                $q->where('device_id', 'like', "%{$searchTerm}%");
            });
        }


        $allowedSorts = ['no_telp', 'alamat', 'created_at', 'updated_at', 'name', 'email', 'device_id'];
        if (in_array($sortBy, $allowedSorts)) {
            if ($sortBy === 'name' || $sortBy === 'email') {
                // Join users table to sort by user name or email
                $queryWarga->join('users', 'wargas.users_id', '=', 'users.id')
                    ->orderBy('users.' . $sortBy, $sortDir);  // Sort by users.name or users.email
            } else {
                $queryWarga->orderBy($sortBy, $sortDir);
            }
        }

        $users = $queryUser->paginate(10)->withQueryString();
        $devices = $queryDevice->paginate(10)->withQueryString();
        if ($request->wantsJson()) {
            return response()->json([
                'users' => $users,
                'devices' => $devices
            ]);
        }

        $wargas = $queryWarga->paginate($perPage)->withQueryString();
        return Inertia::render('admin/warga/index', [
            'wargas' => $wargas->through(fn($warga) => [
                'warga_id' => $warga->warga_id,
                'users_id' => $warga->users_id,
                'device' => $warga->device
                    ? [
                        'id' => $warga->device->id,
                        'device_id' => $warga->device->device_id
                    ]
                    : null,
                'no_telp' => $warga->no_telp,
                'alamat' => $warga->alamat,
                'user' => [
                    'name' => $warga->user->name,
                    'email' => $warga->user->email,
                ],
                'created_at' => $warga->created_at->format('d/m/Y H:i:s'),
                'updated_at' => $warga->updated_at->format('d/m/Y H:i:s'),
            ]),
            'users' => $users,
            'devices' => $devices,
            'filters' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDir' => $sortDir,
                'perPage' => $perPage,
            ],
            'pagination' => [
                'current_page' => $wargas->currentPage(),
                'per_page' => $wargas->perPage(),
                'total' => $wargas->total(),
            ],
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
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'users_id' => 'required|unique:wargas,users_id|exists:users,id',
                'device_id' => 'required|unique:wargas,device_id|exists:devices,id',
                'no_telp' => 'required|numeric|unique:wargas,no_telp|max_digits:16',
                'alamat' => 'required|string|unique:wargas,alamat|min:20|max:255',
            ]);

            $warga = Warga::create([
                'users_id' => $validated['users_id'],
                'device_id' => $validated['device_id'],
                'no_telp' => $validated['no_telp'],
                'alamat' => $validated['alamat'],
            ]);

            $warga->save();
            return back()->with('success', __('Warga berhasil ditambahkan'));
        } catch (\Exception $e) {
            return back()->with(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request, Warga $warga)
    {
        try {
            $validated = $request->validate([
                'warga_id' => 'required|exists:wargas,warga_id',
                'device_id' => 'required|exists:devices,id',
                'no_telp' => 'required|numeric|max_digits:16',
                'alamat' => 'required|string|min:20|max:255',
            ]);
            // Validasi jika tidak ada perubahan
            if (
                $validated['no_telp'] === $warga->no_telp &&
                $validated['device_id'] === $warga->device_id &&
                $validated['alamat'] === $warga->alamat
            ) {
                return back()->with(['message' => 'Tidak ada perubahan data.']);
            }

            $warga->update($validated);

            return back()->with('success', __('Pengguna berhasil diperbarui'));
        } catch (\Exception $e) {
            return back()->with(['message' => "Device ID sudah digunakan oleh warga lain."]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($warga)
    {
        try {
            $warga = Warga::where('warga_id', $warga)->first();

            $warga->delete();

            return back()->with('success', __('Pengguna berhasil dihapus'));
        } catch (\Exception $e) {
            return back()->with(['error' => $e->getMessage()]);
        }
    }
}
