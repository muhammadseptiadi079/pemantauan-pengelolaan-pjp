<?php

namespace App\Http\Controllers;

use App\Models\Pjp;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TahapanController extends Controller
{
    public function persyaratanSeleksiPenetapan(Request $request): Response
    {
        return $this->renderTahapan('PersyaratanSeleksiPenetapan', 'persyaratan-seleksi-penetapan', $request);
    }

    public function tanggungJawabPemantauanPelaporan(Request $request): Response
    {
        return $this->renderTahapan('TanggungJawabPemantauanPelaporan', 'tanggung-jawab-pemantauan-pelaporan', $request);
    }

    public function evaluasi(Request $request): Response
    {
        return $this->renderTahapan('Evaluasi', 'evaluasi', $request);
    }

    private function renderTahapan(string $component, string $tahapan, Request $request): Response
    {
        return Inertia::render($component, [
            'pjps' => $this->pjpsForTahapan($tahapan, $request),
            'filters' => $this->filtersFromRequest($request),
            'statusCounts' => Pjp::statusCountsFor(Pjp::where('tahapan', $tahapan)),
        ]);
    }

    private function pjpsForTahapan(string $tahapan, Request $request): Collection
    {
        return Pjp::where('tahapan', $tahapan)
            ->filter($request->query('search'), $request->query('status'))
            ->latest()
            ->get(['id', 'nama_perusahaan', 'status']);
    }

    private function filtersFromRequest(Request $request): array
    {
        return [
            'search' => $request->query('search', ''),
            'status' => $request->query('status', ''),
        ];
    }
}
