<?php

namespace App\Http\Controllers;

use App\Models\Pjp;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Home', [
            'stats' => [
                'total' => Pjp::count(),
                'aktifDipantau' => Pjp::where('status', 'aktif')->count(),
                'perluTindakLanjut' => Pjp::where('status', 'perlu_tindak_lanjut')->count(),
            ],
            'statusCounts' => Pjp::statusCountsFor(),
        ]);
    }
}
