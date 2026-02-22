<?php

declare(strict_types=1);

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class OAuthTokenData extends Data
{
    public function __construct(
        public string $googleId,
        public string $accessToken,
        public ?string $refreshToken,
        public Carbon $accessTokenExpiresAt,
        public ?Carbon $refreshTokenExpiresAt,
    ) {}
}
