<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PjpLaporan extends Model
{
    public const JENIS = [
        'spip' => 'Data SPIP (Sarana, Prasarana, Instalasi & Peralatan)',
        'tsp' => 'Target Sasaran Program (TSP)',
        'laporan_bulanan' => 'Laporan Bulanan',
        'laporan_triwulan' => 'Laporan Triwulan',
    ];

    protected $fillable = [
        'pjp_id',
        'jenis',
        'periode',
        'file_path',
        'file_name',
        'file_size',
        'catatan',
    ];

    public function pjp(): BelongsTo
    {
        return $this->belongsTo(Pjp::class);
    }
}
