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
        return Inertia::render('PersyaratanSeleksiPenetapan', [
            'pjps' => $this->pjpsForTahapan('persyaratan-seleksi-penetapan', $request),
            'filters' => $this->filtersFromRequest($request),
        ]);
    }

    public function tanggungJawabPemantauanPelaporan(Request $request): Response
    {
        return Inertia::render('TanggungJawabPemantauanPelaporan', [
            'pjps' => $this->pjpsForTahapan('tanggung-jawab-pemantauan-pelaporan', $request),
            'filters' => $this->filtersFromRequest($request),
        ]);
    }

    public function evaluasi(Request $request): Response
    {
        return Inertia::render('Evaluasi', [
            'pjps' => $this->pjpsForTahapan('evaluasi', $request),
            'filters' => $this->filtersFromRequest($request),
        ]);
    }

    private function pjpsForTahapan(string $tahapan, Request $request): Collection
    {
        $search = $request->query('search');
        $status = $request->query('status');

        return Pjp::where('tahapan', $tahapan)
            ->when($search, fn ($query, $search) => $query->where('nama_perusahaan', 'like', "%{$search}%"))
            ->when($status, fn ($query, $status) => $query->where('status', $status))
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
