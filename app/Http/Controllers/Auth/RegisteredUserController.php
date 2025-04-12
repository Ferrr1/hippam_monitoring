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
use Throwable;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', Rules\Password::defaults()],
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
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
                'error' => $th->getMessage(),
            ], 500); // Internal Server Error
        }
    }
}
