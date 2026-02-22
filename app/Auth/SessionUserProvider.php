<?php

declare(strict_types=1);

namespace App\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;

final class SessionUserProvider implements UserProvider
{
    /**
     * Retrieve a user by their unique identifier.
     */
    public function retrieveById($identifier): ?Authenticatable
    {
        // SessionUser is retrieved from session, not database
        // This method is called by Laravel's Auth system
        // The identifier is the Google ID stored in session
        if (session()->has('auth.google_id')) {
            return new SessionUser(session('auth.google_id'));
        }

        return null;
    }

    /**
     * Retrieve a user by their unique identifier and "remember me" token.
     */
    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        // Remember me functionality not used for SessionUser
        return null;
    }

    /**
     * Update the "remember me" token for the given user in storage.
     */
    public function updateRememberToken(Authenticatable $user, $token): void
    {
        // Remember me functionality not used for SessionUser
    }

    /**
     * Retrieve a user by the given credentials.
     */
    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        // This is used for login attempts
        // For OAuth, credentials come from OAuth callback, not this method
        if (isset($credentials['google_id'])) {
            return new SessionUser($credentials['google_id']);
        }

        return null;
    }

    /**
     * Validate a user against the given credentials.
     */
    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        // For OAuth, validation happens during OAuth callback
        // This method is not typically called for SessionUser
        return $user instanceof SessionUser && $user->getAuthIdentifier() === ($credentials['google_id'] ?? null);
    }

    /**
     * Rehash the user's password if required and supported.
     */
    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false): void
    {
        // Not applicable for SessionUser (no password)
    }
}
