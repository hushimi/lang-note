<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class TopController extends Controller
{
    /**
     * Display the top page
     */
    public function top(): Response
    {
        return Inertia::render('TopPage');
    }
}
