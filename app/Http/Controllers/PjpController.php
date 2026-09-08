<?php

namespace App\Http\Controllers;

use App\Exports\PjpExport;
use App\Models\Pjp;
use App\Models\PjpLaporan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PjpController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $tahapan = $request->query('tahapan');
        $status = $request->query('status');

        $pjps = Pjp::query()
            ->filter($search, $status, $tahapan)
            ->latest()
            ->paginate(15)
            ->withQueryString();

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

    public function export(Request $request): BinaryFileResponse
    {
        $export = new PjpExport(
            $request->query('search'),
            $request->query('status'),
            $request->query('tahapan'),
        );

        return Excel::download($export, 'data-pjp.xlsx');
    }

    public function exportPdf(Pjp $pjp): HttpResponse
    {
        $laporans = $pjp->laporans()->get();

        $pdf = Pdf::loadView('pdf.pjp-report', [
            'pjp' => $pjp,
            'laporans' => $laporans,
            'tahapanLabel' => Pjp::TAHAPAN[$pjp->tahapan] ?? $pjp->tahapan,
            'statusLabel' => Pjp::STATUS[$pjp->status] ?? $pjp->status,
            'jenisOptions' => PjpLaporan::JENIS,
        ]);

        $fileName = 'laporan-'.str($pjp->nama_perusahaan)->slug().'.pdf';

        return $pdf->stream($fileName);
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

        $pjp = Pjp::create($data);

        return to_route($pjp->tahapan)->with('success', 'Data PJP berhasil ditambahkan.');
    }

    public function show(Pjp $pjp): Response
    {
        return Inertia::render('Pjp/Show', [
            'pjp' => $pjp,
            'laporans' => $pjp->laporans()->get(),
            'evaluasis' => $pjp->evaluasis()->get(),
            'smkpScore' => $pjp->smkpScore(),
            'nextTahapan' => Pjp::NEXT_TAHAPAN[$pjp->tahapan] ?? null,
            'triwulanTerbuka' => PjpLaporan::triwulanSedangDibuka(),
            'bulanTriwulanDibuka' => implode(', ', PjpLaporan::BULAN_TRIWULAN_DIBUKA),
        ]);
    }

    public function advanceTahapan(Pjp $pjp): RedirectResponse
    {
        $next = Pjp::NEXT_TAHAPAN[$pjp->tahapan] ?? null;

        abort_if($next === null, 400, 'PJP sudah berada di tahap terakhir.');

        $pjp->update(['tahapan' => $next]);

        return back()->with('success', 'PJP dilanjutkan ke tahap "'.Pjp::TAHAPAN[$next].'".');
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

        return to_route('pjp.show', $pjp)->with('success', 'Data PJP berhasil diperbarui.');
    }

    public function destroy(Pjp $pjp): RedirectResponse
    {
        $tahapan = $pjp->tahapan;

        Storage::disk('public')->deleteDirectory("pjp-laporan/{$pjp->id}");
        $pjp->delete();

        return to_route($tahapan)->with('success', 'Data PJP berhasil dihapus.');
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
