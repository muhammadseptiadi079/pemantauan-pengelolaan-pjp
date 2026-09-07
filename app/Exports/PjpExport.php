<?php

namespace App\Exports;

use App\Models\Pjp;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PjpExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        private readonly ?string $search = null,
        private readonly ?string $status = null,
        private readonly ?string $tahapan = null,
    ) {}

    public function collection(): Collection
    {
        return Pjp::query()
            ->filter($this->search, $this->status, $this->tahapan)
            ->latest()
            ->get();
    }

    public function headings(): array
    {
        return [
            'Nama Perusahaan',
            'NIB',
            'Penanggung Jawab',
            'Alamat',
            'Tahapan',
            'Status',
            'Catatan',
            'Terdaftar Sejak',
        ];
    }

    public function map(mixed $row): array
    {
        return [
            $row->nama_perusahaan,
            $row->nib,
            $row->penanggung_jawab,
            $row->alamat,
            Pjp::TAHAPAN[$row->tahapan] ?? $row->tahapan,
            Pjp::STATUS[$row->status] ?? $row->status,
            $row->catatan,
            $row->created_at->format('d-m-Y'),
        ];
    }
}
