# Lang Note

A modern language learning application built with Laravel 12, InertiaJS, React, and TypeScript.

## Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **Laravel Data** - Type-safe data transfer objects
- **TypeScript Transformer** - Generate TypeScript types from PHP classes
- **Laravel Socialite** - OAuth authentication (Google)

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **InertiaJS** - Modern monolith approach
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful UI components
- **FontAwesome** - Icon library
- **Vite** - Fast build tool

## Features

- ✅ Google OAuth authentication (OAuth-only)
- ✅ Modern, responsive UI with Shadcn/ui components
- ✅ Type-safe data flow from backend to frontend
- ✅ Hot Module Replacement (HMR) for rapid development
- ✅ Docker development environment

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Composer (for local development)

## Setup Instructions

### 1. Database Setup

The database migrations need to be run inside the Docker container:

```bash
# Start the Docker containers
docker-compose up -d

# Access the PHP container
docker exec -it laravel-apache-myapp-1 bash

# Run migrations
cd /var/www/html/lang-note
php artisan migrate
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8000/auth/google/callback`
6. Copy the Client ID and Client Secret
7. Update `.env` file:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URL=http://localhost:8000/auth/google/callback
```

### 4. Generate TypeScript Types

Generate TypeScript types from PHP Data classes:

```bash
npm run generate-types
```

This will create `resources/js/types/generated.d.ts` with TypeScript definitions from your PHP Data classes.

### 5. Start Development Servers

You need to run two servers:

**Terminal 1 - Laravel (inside Docker):**
```bash
docker exec -it laravel-apache-myapp-1 bash
cd /var/www/html/lang-note
php artisan serve --host=0.0.0.0 --port=8000
```

**Terminal 2 - Vite (on your host machine):**
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:8000`
- Vite HMR: `http://localhost:5173`

## Project Structure

```
lang-note/
├── app/
│   ├── Data/              # Laravel Data DTOs
│   │   └── UserData.php   # Example Data class with TypeScript generation
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Auth/
│   │   │       └── OAuthController.php  # Google OAuth handling
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php  # Shared Inertia data
│   └── Models/
│       └── User.php       # User model with OAuth fields
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   └── ui/        # Shadcn/ui components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       └── label.tsx
│   │   ├── lib/
│   │   │   └── utils.ts   # Utility functions (cn helper)
│   │   ├── Pages/
│   │   │   ├── Welcome.tsx     # Landing page with Google login
│   │   │   └── Dashboard.tsx   # User dashboard
│   │   ├── types/
│   │   │   ├── index.d.ts      # Manual type definitions
│   │   │   └── generated.d.ts  # Auto-generated from PHP
│   │   ├── app.tsx        # Main Inertia app
│   │   └── bootstrap.ts   # Axios configuration
│   └── css/
│       └── app.css        # Tailwind & Shadcn theme
├── database/
│   └── migrations/
│       └── 0001_01_01_000000_create_users_table.php  # With OAuth fields
├── routes/
│   └── web.php            # Application routes
├── config/
│   ├── services.php       # Google OAuth config
│   └── typescript-transformer.php  # Type generation config
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run build           # Build for production
npm run generate-types  # Generate TypeScript types from PHP

# Backend
php artisan serve                    # Start Laravel server
php artisan migrate                  # Run database migrations
php artisan typescript:transform     # Generate TypeScript types
```

## Creating TypeScript Types from PHP

To automatically generate TypeScript types from your PHP classes:

1. Create a Data class with the `#[TypeScript]` attribute:

```php
<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PostData extends Data
{
    public function __construct(
        public int $id,
        public string $title,
        public string $content,
    ) {
    }
}
```

2. Run the type generator:

```bash
npm run generate-types
```

3. Use the generated types in your React components:

```typescript
import { PostData } from '@/types/generated';

// The type is now available with full IntelliSense support
```

## Adding Shadcn/ui Components

To add more Shadcn/ui components, you can manually create them in `resources/js/Components/ui/` following the Shadcn/ui documentation.

Example components already included:
- Button
- Card
- Input
- Label

## Environment Variables

Required environment variables:

```env
# Application
APP_NAME="Lang Note"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (Docker MySQL)
DB_CONNECTION=mysql
DB_HOST=mydb
DB_PORT=3306
DB_DATABASE=lang_note_db
DB_USERNAME=admin
DB_PASSWORD=secret

# Mail (MailHog)
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URL=http://localhost:8000/auth/google/callback
```

## Authentication Flow

The application uses Google OAuth for authentication:

1. User clicks "Continue with Google" on the welcome page
2. Redirected to Google OAuth consent screen
3. After approval, Google redirects back to the callback URL
4. Application creates or updates user in the database
5. User is logged in and redirected to the dashboard

## Troubleshooting

### Database Connection Issues

If you get "could not find driver" errors, make sure to run migrations inside the Docker container, not on your host machine.

### Vite HMR Not Working

Make sure the Vite dev server is running on port 5173 and that the port is exposed in docker-compose.yml.

### OAuth Redirect Issues

Ensure the redirect URL in Google Cloud Console matches exactly with the one in your `.env` file.

## Development Workflow

1. Make changes to PHP code or React components
2. Changes are automatically reflected (HMR for frontend)
3. After modifying Data classes, run `npm run generate-types`
4. TypeScript will provide type checking and IntelliSense

## Production Build

```bash
# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## License

This project is open-sourced software.
