<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\HandleGoogleOAuthCallback;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Facades\Socialite;

final class OAuthController extends Controller
{
    public function __construct(
        private HandleGoogleOAuthCallback $handleGoogleOAuthCallback
    ) {}

    /**
     * Redirect to Google OAuth provider
     */
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback(): RedirectResponse
    {
        return ($this->handleGoogleOAuthCallback)();
    }

    /**
     * Log the user out and invalidate the session
     */
    public function logout(): RedirectResponse
    {
        auth()->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect(url('/'));
    }
}
