<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Number;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Inertia\Inertia;
use Storage;
use Throwable;

class TagihanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
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

            $allowedSorts = ['name', 'email', 'device_id', 'meter_awal', 'meter_akhir', 'tanggal_mulai', 'pemakaian', 'total_bayar', 'status', 'created_at'];
            if (in_array($sortBy, $allowedSorts)) {
                if ($sortBy === 'name' || $sortBy === 'email') {
                    // Join users table to sort by user name or email
                    $query->join('wargas', 'tagihans.warga_id', '=', 'wargas.warga_id')
                        ->join('users', 'wargas.users_id', '=', 'users.id')
                        ->orderBy('users.' . $sortBy, $sortDir);
                } else {
                    $query->orderBy($sortBy, $sortDir);  // Untuk kolom lain yang ada di tagihans
                }
            }
            $bulanTersedia = DB::table(DB::raw('(SELECT DISTINCT DATE_FORMAT(tanggal_mulai, "%m-%Y") as bulan FROM tagihans) as bulan_sub'))
                ->orderByRaw('STR_TO_DATE(bulan, "%m-%Y")')
                ->pluck('bulan');

            $tagihans = $query->paginate($perPage)->withQueryString();

            return Inertia::render('admin/tagihan/index', [
                'tagihans' => $tagihans->through(fn($tagihan) => [
                    'tagihan_id' => $tagihan->tagihan_id,
                    'meter_awal' => $tagihan->meter_awal,
                    'meter_akhir' => $tagihan->meter_akhir,
                    'tanggal_mulai' => Carbon::parse($tagihan->tanggal_mulai)->format('d/m/Y'),
                    'tanggal_akhir' => Carbon::parse($tagihan->tanggal_akhir)->format('d/m/Y'),
                    'pemakaian' => $tagihan->pemakaian,
                    'total_bayar' => Number::useCurrency($tagihan->total_bayar),
                    'status' => $tagihan->status,
                    'bukti_pembayaran' => $tagihan->bukti_pembayaran,
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
                        'harga' => Number::useCurrency($tagihan->tarif->harga),
                    ],
                    'created_at' => $tagihan->created_at->format('d/m/Y H:i:s'),
                    'updated_at' => $tagihan->updated_at->format('d/m/Y H:i:s'),
                ]),
                'filter_by_months' => $bulanTersedia,
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
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ]);
        } catch (Throwable $th) {
            return dd($th->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function report(Request $request)
    {
        $periode = $request->input('periode'); // ex: '2025-04'

        try {
            $tagihan = Tagihan::query();

            if ($periode) {
                [$year, $month] = explode('-', $periode);

                $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth(); // 2025-04-01
                $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth(); // 2025-04-30

                $tagihan->where(function ($query) use ($startOfMonth, $endOfMonth) {
                    $query->whereBetween('tanggal_mulai', [$startOfMonth, $endOfMonth])
                        ->orWhereBetween('tanggal_akhir', [$startOfMonth, $endOfMonth])
                        ->orWhere(function ($q) use ($startOfMonth, $endOfMonth) {
                            $q->where('tanggal_mulai', '<=', $startOfMonth)
                                ->where('tanggal_akhir', '>=', $endOfMonth);
                        });
                });
            } else {
                return back()->with('error', 'Periode tidak valid.');
            }

            $data = $tagihan->get();
            $totalPemakaian = $data->sum('pemakaian');
            $totalTagihan = $data->sum('total_bayar');

            $pdf = Pdf::loadView('admin.tagihan.report', [
                'tagihans' => $data?->map(fn($tagihan) => [
                    'tagihan_id' => $tagihan->tagihan_id,
                    'name' => $tagihan->warga->user->name,
                    'device_id' => $tagihan->device->device_id,
                    'meter_awal' => $tagihan->meter_awal,
                    'meter_akhir' => $tagihan->meter_akhir,
                    'periode' => Carbon::parse($tagihan->tanggal_mulai)->format('F Y') . ' - ' . Carbon::parse($tagihan->tanggal_akhir)->format('F Y'),
                    'tanggal_mulai' => Carbon::parse($tagihan->tanggal_mulai)->format('d F Y'),
                    'tanggal_akhir' => Carbon::parse($tagihan->tanggal_akhir)->format('d F Y'),
                    'pemakaian' => $tagihan->pemakaian,
                    'total_bayar' => Number::useCurrency($tagihan->total_bayar),
                    'status' => $tagihan->status,
                    'total_pemakaian' => $totalPemakaian,
                    'total_tagihan' => Number::useCurrency($totalTagihan),
                ]),
            ])
                ->setPaper('a4', 'portrait');

            return $pdf->stream("laporan_tagihan_{$periode}.pdf");
        } catch (Throwable $th) {
            return dd($th->getMessage());
        }
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
    public function update(Request $request, Tagihan $tagihan)
    {
        $validated = $request->validate([
            'status' => 'required|in:lunas,belum_lunas',
        ]);

        $tagihan->update($validated);

        return back()->with('success', __('Tagihan berhasil diperbarui'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($tagihan)
    {
        $tagihan = Tagihan::where('tagihan_id', $tagihan)->first();

        $tagihan->delete();

        return back()->with('success', __('Pengguna berhasil dihapus'));
    }
}
