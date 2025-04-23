<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Number;
use Inertia\Inertia;

use function PHPSTORM_META\map;

class RiwayatTagihanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $warga = $request->user()?->warga;
        $invoices = $warga?->tagihan()->with('tarif')->orderBy('created_at', 'asc')->paginate(5);
        // Jika $invoices null, set sebagai koleksi kosong
        if (!$invoices) {
            $invoices = collect(); // Ubah menjadi koleksi kosong
        }
        // Jika tagihan kosong, set pagination default
        $pagination = $invoices->isEmpty() ? [
            'current_page' => 1,
            'per_page' => 5,
            'total' => 0,
        ] : [
            'current_page' => $invoices->currentPage(),
            'per_page' => $invoices->perPage(),
            'total' => $invoices->total(),
        ];

        $total_pemakaian = $warga?->tagihan()->sum('pemakaian');
        $total_tagihan = $warga?->tagihan()->sum('total_bayar');
        return Inertia::render('user/riwayat_tagihan/index', [
            'tagihans' => $invoices?->map(fn($invoice) => [
                'meter_awal'     => $invoice->meter_awal ?? '-',
                'meter_akhir'    => $invoice->meter_akhir ?? '-',
                'tanggal_mulai'  => $invoice->tanggal_mulai ? Carbon::parse($invoice->tanggal_mulai)->format('d/m/Y') : '-',
                'tanggal_akhir'  => $invoice->tanggal_akhir ? Carbon::parse($invoice->tanggal_akhir)->format('d/m/Y') : '-',
                'pemakaian'      => $invoice->pemakaian ?? '-',
                'total_bayar'    => isset($invoice->total_bayar) ? Number::useCurrency($invoice->total_bayar) : '-',
                'status'         => $invoice->status ?? '-',
                'tarif'          => [
                    'harga' => $invoice->tarif?->harga
                        ? Number::useCurrency($invoice->tarif->harga)
                        : '-',
                ],
                'created_at'     => $invoice->created_at ? $invoice->created_at->format('d/m/Y H:i:s') : '-',
                'updated_at'     => $invoice->updated_at ? $invoice->updated_at->format('d/m/Y H:i:s') : '-',
            ]),
            'total_pemakaian'    => $total_pemakaian ?? '0',
            'total_tagihan'    => isset($total_tagihan) ? Number::useCurrency($total_tagihan) : Number::useCurrency(0),
            'pagination' => $pagination,
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
