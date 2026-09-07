<?php

namespace App\Http\Controllers;

use App\Models\Pjp;
use App\Models\PjpLaporan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PjpController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $tahapan = $request->query('tahapan');
        $status = $request->query('status');

        $pjps = Pjp::query()
            ->when($search, fn ($query, $search) => $query->where('nama_perusahaan', 'like', "%{$search}%"))
            ->when($tahapan, fn ($query, $tahapan) => $query->where('tahapan', $tahapan))
            ->when($status, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->get();

        return Inertia::render('Pjp/Index', [
            'pjps' => $pjps,
            'filters' => [
                'search' => $search ?? '',
                'tahapan' => $tahapan ?? '',
                'status' => $status ?? '',
            ],
            'statusCounts' => Pjp::statusCountsFor(),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Pjp/Create', [
            'defaultTahapan' => $request->query('tahapan'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        Pjp::create($data);

        return to_route('pjp.index')->with('success', 'Data PJP berhasil ditambahkan.');
    }

    public function show(Pjp $pjp): Response
    {
        $pjp->load('laporans');

        return Inertia::render('Pjp/Show', [
            'pjp' => $pjp,
            'laporans' => $pjp->laporans,
            'triwulanTerbuka' => PjpLaporan::triwulanSedangDibuka(),
            'bulanTriwulanDibuka' => implode(', ', PjpLaporan::BULAN_TRIWULAN_DIBUKA),
        ]);
    }

    public function edit(Pjp $pjp): Response
    {
        return Inertia::render('Pjp/Edit', [
            'pjp' => $pjp,
        ]);
    }

    public function update(Request $request, Pjp $pjp): RedirectResponse
    {
        $data = $this->validateData($request);

        $pjp->update($data);

        return to_route('pjp.index')->with('success', 'Data PJP berhasil diperbarui.');
    }

    public function destroy(Pjp $pjp): RedirectResponse
    {
        $pjp->delete();

        return to_route('pjp.index')->with('success', 'Data PJP berhasil dihapus.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'nama_perusahaan' => ['required', 'string', 'max:255'],
            'nib' => ['nullable', 'string', 'max:255'],
            'penanggung_jawab' => ['nullable', 'string', 'max:255'],
            'alamat' => ['nullable', 'string'],
            'tahapan' => ['required', 'string', 'in:'.implode(',', array_keys(Pjp::TAHAPAN))],
            'status' => ['required', 'string', 'in:'.implode(',', array_keys(Pjp::STATUS))],
            'catatan' => ['nullable', 'string'],
        ]);
    }
}
