<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Warga;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request)
    {
        try {
            $user = $request->user();
            $validated = $request->validated();

            if ($request->user()->isDirty('email')) {
                $request->user()->email_verified_at = null;
            }

            $user->fill($validated);
            $user->save();

            $warga = $user->warga;
            if (!$warga) {
                $checkData = Warga::where('no_telp', $validated['no_telp'])
                    ->orWhere('alamat', $validated['alamat'])
                    ->first();
                if ($checkData) {
                    return back()->withErrors(['message' => 'No Telepon atau Alamat sudah digunakan.']);
                } else {
                    Warga::create([
                        'users_id' => $user->id,
                        'no_telp' => $validated['no_telp'],
                        'alamat' => $validated['alamat'],
                    ]);
                }
            } elseif ($warga) {
                if (
                    $validated['no_telp'] === $warga->no_telp &&
                    $validated['alamat'] === $warga->alamat
                ) {
                    return back()->withErrors(['message' => 'Tidak ada perubahan data.']);
                } else {
                    $warga->update([
                        'no_telp' => $validated['no_telp'],
                        'alamat' => $validated['alamat'],
                    ]);
                }
            }
            return to_route('profile.edit');
        } catch (\Throwable $th) {
            return $th->getMessage();
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
