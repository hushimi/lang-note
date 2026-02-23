<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

final class TopController extends Controller
{
    /**
     * Display the top page
     */
    public function top(): Response
    {
        return Inertia::render('TopPage');
    }
}
