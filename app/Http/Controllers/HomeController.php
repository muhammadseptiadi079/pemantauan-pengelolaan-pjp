<?php

namespace App\Http\Controllers;

use App\Models\Pjp;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $statusCounts = Pjp::statusCountsFor();

        return Inertia::render('Home', [
            'stats' => [
                'total' => array_sum($statusCounts),
                'aktifDipantau' => $statusCounts['aktif'],
                'perluTindakLanjut' => $statusCounts['perlu_tindak_lanjut'],
            ],
            'statusCounts' => $statusCounts,
        ]);
    }
}
