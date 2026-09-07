<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
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

    public const KESESUAIAN = [
        'sesuai' => 'Sesuai',
        'tidak_sesuai' => 'Tidak Sesuai',
    ];

    /**
     * Batas tanggal pengiriman Laporan Bulanan setiap bulannya.
     */
    public const BATAS_TANGGAL_LAPORAN_BULANAN = 3;

    protected $fillable = [
        'pjp_id',
        'jenis',
        'periode',
        'file_path',
        'file_name',
        'file_size',
        'catatan',
        'kesesuaian_isi',
    ];

    protected $appends = ['tepat_waktu'];

    public function pjp(): BelongsTo
    {
        return $this->belongsTo(Pjp::class);
    }

    /**
     * Hanya relevan untuk Laporan Bulanan: null berarti tidak berlaku.
     */
    protected function tepatWaktu(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->jenis === 'laporan_bulanan'
                ? $this->created_at->day <= self::BATAS_TANGGAL_LAPORAN_BULANAN
                : null,
        );
    }
}
