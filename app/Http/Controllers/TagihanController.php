<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagihanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Tagihan::query();

        $search = $request->input('search');
        $sortBy = $request->input('sortBy', 'created_at');
        $sortDir = $request->input('sortDir', 'asc');
        $perPage = $request->input('perPage', 10);

        // Search logic
        if ($search) {
            $searchTerm = addcslashes($search, '%_\\');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('periode', 'like', "%{$searchTerm}%")
                    ->orWhere('pemakaian', 'like', "%{$searchTerm}%")
                    ->orWhereHas('warga.user', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%")
                            ->orWhere('email', 'like', "%{$searchTerm}%");
                    });
            });
        }

        // Sorting logic
        $allowedSorts = ['periode', 'pemakaian', 'created_at', 'updated_at', 'name'];
        if (in_array($sortBy, $allowedSorts)) {
            if ($sortBy === 'name') {
                // Join users table to sort by user name
                $query->join('wargas', 'tagihans.warga.users_id', '=', 'users.id')
                    ->orderBy('users.name', $sortDir)
                    ->select('tagihans.*'); // Prevent column name conflicts
            } else {
                $query->orderBy($sortBy, $sortDir);
            }
        }

        $tagihans = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/tagihan/index', [
            'tagihans' => $tagihans->through(fn($tagihan) => [
                'tagihan_id' => $tagihan->tagihan_id,
                'periode' => $tagihan->periode,
                'pemakaian' => $tagihan->pemakaian,
                'total_bayar' => $tagihan->total_bayar,
                'warga' => [
                    'user' => [
                        'name' => $tagihan->warga->user->name,
                        'email' => $tagihan->warga->user->email
                    ],
                    'no_telp' => $tagihan->warga->no_telp,
                    'alamat' => $tagihan->warga->alamat,
                ],
                'device' => [
                    'device_id' => $tagihan->device->device_id,
                    'mac_address' => $tagihan->device->mac_address,
                    'status' => $tagihan->device->status,
                ],
                'tarif' => [
                    'tarif_id' => $tagihan->tarif->tarif_id,
                    'harga' => $tagihan->tarif->harga
                ],
                'created_at' => $tagihan->created_at->format('d/m/Y H:i:s'),
                'updated_at' => $tagihan->updated_at->format('d/m/Y H:i:s'),
            ]),
            'filters' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDir' => $sortDir,
                'perPage' => $perPage,
            ],
            'pagination' => [
                'current_page' => $tagihans->currentPage(),
                'per_page' => $tagihans->perPage(),
                'total' => $tagihans->total(),
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
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
