<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     */

    public function index(Request $request): Response
    {
        $query = User::query();

        $search = $request->input('search');
        $sortBy = $request->input('sortBy', 'created_at');
        $sortDir = $request->input('sortDir', 'asc');
        $perPage = $request->input('perPage', 10);

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
                'updated_at' => $user->updated_at->format('d/m/Y H:i:s'),
            ]),
            'filters' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDir' => $sortDir,
                'perPage' => $perPage,
            ],
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }
    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', Password::defaults()],
                'role' => 'required|in:admin,user',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            event(new Registered($user));

            return back()->with('success', __('Pengguna berhasil ditambahkan'));
        } catch (\Exception $e) {
            return back()->with(['error' => $e->getMessage()]);
        }
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
                'role' => 'required|in:admin,user',
            ]);

            if (
                $validated['name'] === $user->name &&
                $validated['email'] === $user->email &&
                $validated['role'] === $user->role
            ) {
                return back()->with(['message' => 'Tidak ada perubahan data.']);
            }

            $user->update($validated);

            return back()->with('success', __('Pengguna berhasil diperbarui'));
        } catch (\Exception $e) {
            return back()->with(['error' => $e->getMessage()]);
        }
    }
    public function destroy($email): RedirectResponse
    {
        try {
            $user = User::where('email', $email)->first();

            $user->delete();

            return back()->with('success', __('Pengguna berhasil dihapus'));
        } catch (\Exception $e) {
            return back()->with(['error' => $e->getMessage()]);
        }
    }
}
