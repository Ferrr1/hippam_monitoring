<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Number;
use Inertia\Inertia;

class TagihanUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $warga = $request->user()?->warga;
            $invoice = $warga?->tagihan()->with('tarif')->latest()->first();

            return Inertia::render('user/tagihan/index', [
                'tagihan' => $invoice ? [
                    'meter_awal'     => $invoice->meter_awal ?? '-',
                    'meter_akhir'    => $invoice->meter_akhir ?? '-',
                    'tanggal_mulai'  => $invoice->tanggal_mulai ? Carbon::parse($invoice->tanggal_mulai)->locale('id')->translatedFormat('j F Y') : '-',
                    'tanggal_akhir'  => $invoice->tanggal_akhir ? Carbon::parse($invoice->tanggal_akhir)->locale('id')->translatedFormat('j F Y') : '-',
                    'pemakaian'      => $invoice->pemakaian ?? '-',
                    'total_bayar'    => Number::currency($invoice->total_bayar, locale: 'id') ?? '-',
                    'status'         => $invoice->status ?? '-',
                    'tarif'          => [
                        'harga' => Number::currency($invoice->tarif->harga, locale: 'id') ?? '-',
                    ],
                    'created_at'     => $invoice->created_at ? $invoice->created_at->format('d/m/Y H:i:s') : '-',
                    'updated_at'     => $invoice->updated_at ? $invoice->updated_at->format('d/m/Y H:i:s') : '-',
                ] : null,
            ]);
        } catch (\Throwable $th) {
            dd($th->getMessage(), $th->getTraceAsString());
        }
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
