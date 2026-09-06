<?php

namespace App\Http\Controllers;

use App\Models\Pjp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PjpController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Pjp/Index', [
            'pjps' => Pjp::latest()->get(),
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
