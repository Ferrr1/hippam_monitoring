<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Throwable;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     */

    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('sortBy') && $request->has('sortDir')) {
            $query->orderBy($request->sortBy, $request->sortDir);
        }

        $perPage = $request->input('perPage', 10);
        $users = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/pengguna/index', [
            'users' => $users->through(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at->format('d/m/Y H:i:s'),
                'updated_at' => $user->updated_at->format('d/m/Y'),
            ]),
            'filters' => [
                'search' => $request->input('search', ''), // default kosong
                'sortBy' => $request->input('sortBy', 'name'),
                'sortDir' => $request->input('sortDir', 'asc'),
                'perPage' => $request->input('perPage', '10'),
            ],
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', Rules\Password::defaults()],
                'role' => 'required|in:admin,user',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            event(new Registered($user));

            return response()->json([
                'message' => 'Pendaftaran berhasil',
                'status' => 'success',
            ], 201); // Created
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Field harus di isi, silahkan coba lagi',
                'errors' => $e->errors(), // Laravel structure: field => [message]
            ], 422); // Unprocessable Entity
        } catch (Throwable $th) {
            return response()->json([
                'message' => 'Terjadi kesalahan di server',
                'errors' => $th->getMessage(),
            ], 500); // Internal Server Error
        }
    }

    public function update(Request $request, $email)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'role' => 'required|in:admin,user',
            ]); // Validasi input
            $user = User::where('email', $email)->first();

            if (!$user) {
                return to_route('pengguna.index')->with('error', 'Pengguna tidak ditemukan');
            }

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
            ]);

            return to_route('pengguna.index')->with('success', 'Pengguna berhasil diperbarui');
        } catch (ValidationException $e) {
            return to_route('pengguna.index')->with('error', 'Field harus di isi, silahkan coba lagi')->withErrors($e->errors()); // Laravel structure: field => [message]
        } catch (Throwable $th) {
            return to_route('pengguna.index')->with('error', 'Terjadi kesalahan di server: ' . $th->getMessage());
        }
    }
    public function destroy($email)
    {
        try {
            $user = User::where('email', $email)->first();

            if (!$user) {
                return to_route('pengguna.index')->with('error', 'Pengguna tidak ditemukan');
            }

            $user->delete();

            return to_route('pengguna.index')->with('success', 'Pengguna berhasil dihapus');
        } catch (Throwable $th) {
            return to_route('pengguna.index')->with('error', 'Terjadi kesalahan di server: ' . $th->getMessage());
        }
    }
}
