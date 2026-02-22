<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Auth\SessionUser;
use App\Services\OAuthTokenService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Log;

final class HandleGoogleOAuthCallback
{
    public function __construct(
        private OAuthTokenService $oauthTokenService
    ) {}

    /**
     * Handle Google OAuth callback and authenticate user.
     */
    public function __invoke(): RedirectResponse
    {
        try {
            // Get Google user from OAuth callback
            $googleUser = Socialite::driver('google')->user();

            // Extract only Google ID (not email or name)
            $googleId = $googleUser->getId();

            // Get token information from Google user
            $token = $googleUser->token;
            $refreshToken = $googleUser->refreshToken;
            $expiresIn = $googleUser->expiresIn ?? 3600; // Default to 1 hour if not provided

            // Calculate expiration timestamps
            $accessTokenExpiresAt = Carbon::now()->addSeconds($expiresIn);
            $refreshTokenExpiresAt = $refreshToken ? Carbon::now()->addDays(30) : null; // Refresh tokens typically last 30 days

            // Store or update OAuth tokens in database
            $this->oauthTokenService->storeOrUpdateToken(
                $googleId,
                $token,
                $refreshToken,
                $accessTokenExpiresAt,
                $refreshTokenExpiresAt
            );

            // Create SessionUser instance with Google ID only
            $sessionUser = new SessionUser($googleId);

            // Store Google ID in session for SessionUserProvider
            session(['auth.google_id' => $googleId]);

            // Log in the user
            Auth::login($sessionUser, true);

            // Redirect to dashboard
            return redirect()->intended('/dashboard');
        } catch (Exception $e) {
            // Log error for debugging (optional)
            Log::error('Google OAuth callback failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Redirect with error message
            return redirect('/')->with('error', 'Google認証に失敗しました。もう一度お試しください。');
        }
    }
}
