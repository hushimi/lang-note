<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\TopController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [TopController::class, 'top'])->name('top');

// OAuth routes
Route::prefix('auth')->group(function () {
    Route::get('google', [OAuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('google/callback', [OAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [OAuthController::class, 'logout'])->name('logout');
});
