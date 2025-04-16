<?php

namespace App\Http\Controllers;

use App\Models\Tarif;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TarifAirController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tarif = Tarif::first();
        return Inertia::render('admin/tarif/index', [
            'tarif' => $tarif
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
        $validated = $request->validate([
            'harga' => 'required|numeric|min_digits:3',
        ]);

        // Ambil tarif pertama, kalau tidak ada maka buat baru
        $tarif = Tarif::first();

        if ($tarif) {
            $tarif->update(['harga' => $validated['harga']]);
        } else {
            Tarif::create(['harga' => $validated['harga']]);
        }

        return back()->with('success', __('Tarif berhasil disimpan'));
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
