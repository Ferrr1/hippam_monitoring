<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Number;
use Inertia\Inertia;
use Storage;

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
                    'tagihan_id' => $invoice->tagihan_id ?? '-',
                    'meter_awal' => $invoice->meter_awal ?? '-',
                    'meter_akhir' => $invoice->meter_akhir ?? '-',
                    'tanggal_mulai' => $invoice->tanggal_mulai ? Carbon::parse($invoice->tanggal_mulai)->locale('id')->translatedFormat('j F Y') : '-',
                    'tanggal_akhir' => $invoice->tanggal_akhir ? Carbon::parse($invoice->tanggal_akhir)->locale('id')->translatedFormat('j F Y') : '-',
                    'pemakaian' => $invoice->pemakaian ?? '-',
                    'total_bayar' => $invoice->total_bayar ? Number::useCurrency($invoice->total_bayar) : Number::useCurrency(0),
                    'status' => $invoice->status ?? '-',
                    'bukti_pembayaran' => $invoice->bukti_pembayaran ?? '-',
                    'tarif' => [
                        'harga' => Number::useCurrency($invoice->tarif->harga) ?? Number::useCurrency(0),
                    ],
                    'created_at' => $invoice->created_at ? $invoice->created_at->format('d/m/Y H:i:s') : '-',
                    'updated_at' => $invoice->updated_at ? $invoice->updated_at->format('d/m/Y H:i:s') : '-',
                ] : null,
            ]);
        } catch (\Throwable $th) {
            dd($th->getMessage(), $th->getTraceAsString());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function payment(Request $request, Tagihan $tagihan)
    {
        $request->validate([
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('bukti_pembayaran')) {
            $file = $request->file('bukti_pembayaran');

            // Hapus file lama kalau ada
            if ($tagihan->bukti_pembayaran && Storage::disk('public')->exists($tagihan->bukti_pembayaran)) {
                Storage::disk('public')->delete($tagihan->bukti_pembayaran);
            }

            // Simpan file baru
            $path = $file->store('bukti', 'public');

            // Update path di database
            $tagihan->bukti_pembayaran = $path;
            $tagihan->save();

            return back()->with('success', __('Tagihan berhasil diperbarui'));
        }

        // If no file is found
        return back()->with('error', __('Tidak ada file yang diunggah'));
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
