<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\OauthToken;
use Carbon\Carbon;

final class OAuthTokenService
{
    /**
     * Store or update OAuth token for a Google ID.
     */
    public function storeOrUpdateToken(
        string $googleId,
        string $accessToken,
        ?string $refreshToken,
        Carbon $accessTokenExpiresAt,
        ?Carbon $refreshTokenExpiresAt
    ): OauthToken {
        return OauthToken::updateOrCreate(
            ['google_id' => $googleId],
            [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'access_token_expires_at' => $accessTokenExpiresAt,
                'refresh_token_expires_at' => $refreshTokenExpiresAt,
            ]
        );
    }

    /**
     * Get OAuth token by Google ID.
     */
    public function getTokenByGoogleId(string $googleId): ?OauthToken
    {
        return OauthToken::where('google_id', $googleId)->first();
    }
}
