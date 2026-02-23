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
            $googleId = $googleUser->getId();

            // Get token information from Google user
            $token = $googleUser->token;
            $refreshToken = $googleUser->refreshToken;
            $expiresIn = $googleUser->expiresIn ?? 3600;

            // Calculate expiration timestamps
            $accessTokenExpiresAt = Carbon::now()->addSeconds($expiresIn);
            $refreshTokenExpiresAt = $refreshToken ? Carbon::now()->addDays(30) : null;

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

            // Log in the user first (this migrates the session to a new ID)
            Auth::login($sessionUser);

            // Store Google ID in session AFTER login (post-migration session)
            session(['auth.google_id' => $googleId]);

            session()->save();
            session()->regenerateToken();

            return redirect()->intended(url('/'));
        } catch (Exception $e) {
            Log::error('Google OAuth callback failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect('/')->with('error', 'Google認証に失敗しました。もう一度お試しください。');
        }
    }
}
