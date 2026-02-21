<?php

use App\Http\Controllers\Auth\OAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// OAuth routes
Route::prefix('auth')->group(function () {
    Route::get('google', [OAuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('google/callback', [OAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    Route::post('/logout', function () {
        auth()->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect('/');
    })->name('logout');
});
