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

        $perluPerhatian = Pjp::query()
            ->get(['id', 'nama_perusahaan', 'tahapan'])
            ->map(fn (Pjp $pjp) => [
                'id' => $pjp->id,
                'nama_perusahaan' => $pjp->nama_perusahaan,
                'tahapan' => $pjp->tahapan,
                'achievement' => $pjp->achievement(),
            ])
            ->filter(fn (array $row) => $row['achievement'] !== null && $row['achievement'] < 80)
            ->sortBy('achievement')
            ->take(5)
            ->values();

        return Inertia::render('Home', [
            'stats' => [
                'total' => array_sum($statusCounts),
                'aktifDipantau' => $statusCounts['aktif'],
                'perluTindakLanjut' => $statusCounts['perlu_tindak_lanjut'],
            ],
            'statusCounts' => $statusCounts,
            'pjpBelumLaporanBulanan' => Pjp::belumLaporanBulananBulanIni(),
            'perluPerhatian' => $perluPerhatian,
        ]);
    }
}
