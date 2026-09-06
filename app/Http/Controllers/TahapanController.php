<?php

namespace App\Http\Controllers;

use App\Models\Pjp;
use Inertia\Inertia;
use Inertia\Response;

class TahapanController extends Controller
{
    public function persyaratanSeleksiPenetapan(): Response
    {
        return Inertia::render('PersyaratanSeleksiPenetapan', [
            'pjps' => $this->pjpsForTahapan('persyaratan-seleksi-penetapan'),
        ]);
    }

    public function tanggungJawabPemantauanPelaporan(): Response
    {
        return Inertia::render('TanggungJawabPemantauanPelaporan', [
            'pjps' => $this->pjpsForTahapan('tanggung-jawab-pemantauan-pelaporan'),
        ]);
    }

    public function evaluasi(): Response
    {
        return Inertia::render('Evaluasi', [
            'pjps' => $this->pjpsForTahapan('evaluasi'),
        ]);
    }

    private function pjpsForTahapan(string $tahapan)
    {
        return Pjp::where('tahapan', $tahapan)
            ->latest()
            ->get(['id', 'nama_perusahaan', 'status']);
    }
}
