<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pjp extends Model
{
    public const TAHAPAN = [
        'persyaratan-seleksi-penetapan' => 'Persyaratan, Seleksi, dan Penetapan',
        'tanggung-jawab-pemantauan-pelaporan' => 'Tanggung Jawab, Pemantauan, dan Pelaporan',
        'evaluasi' => 'Evaluasi',
    ];

    public const STATUS = [
        'aktif' => 'Aktif Dipantau',
        'perlu_tindak_lanjut' => 'Perlu Tindak Lanjut',
        'tidak_aktif' => 'Tidak Aktif',
    ];

    protected $fillable = [
        'nama_perusahaan',
        'nib',
        'penanggung_jawab',
        'alamat',
        'tahapan',
        'status',
        'catatan',
    ];

    public function laporans(): HasMany
    {
        return $this->hasMany(PjpLaporan::class)->latest();
    }

    public function scopeFilter(
        Builder $query,
        ?string $search,
        ?string $status,
        ?string $tahapan = null,
    ): Builder {
        return $query
            ->when($search, fn ($q, $search) => $q->where('nama_perusahaan', 'like', "%{$search}%"))
            ->when($status, fn ($q, $status) => $q->where('status', $status))
            ->when($tahapan, fn ($q, $tahapan) => $q->where('tahapan', $tahapan));
    }

    /**
     * PJP (yang masih dipantau, bukan tidak_aktif) yang belum mengirim Laporan
     * Bulanan bulan ini, atau mengirimnya lewat dari tanggal batas. Kosong
     * sebelum tanggal batas terlewati (belum dianggap terlambat).
     */
    public static function belumLaporanBulananBulanIni(): \Illuminate\Support\Collection
    {
        if (now()->day <= PjpLaporan::BATAS_TANGGAL_LAPORAN) {
            return collect();
        }

        $batasBulanIni = now()->startOfMonth()->addDays(PjpLaporan::BATAS_TANGGAL_LAPORAN);

        return static::query()
            ->where('status', '!=', 'tidak_aktif')
            ->where(function (Builder $outer) use ($batasBulanIni) {
                $outer->whereDoesntHave('laporans', function (Builder $query) {
                    $query->where('jenis', 'laporan_bulanan')
                        ->whereYear('created_at', now()->year)
                        ->whereMonth('created_at', now()->month);
                })->orWhereHas('laporans', function (Builder $query) use ($batasBulanIni) {
                    $query->where('jenis', 'laporan_bulanan')
                        ->whereYear('created_at', now()->year)
                        ->whereMonth('created_at', now()->month)
                        ->where('created_at', '>', $batasBulanIni);
                });
            })
            ->orderBy('nama_perusahaan')
            ->get(['id', 'nama_perusahaan']);
    }

    /**
     * Count of records per status, always including every status key (0 if none).
     */
    public static function statusCountsFor(?Builder $query = null): array
    {
        $query ??= static::query();

        $counts = $query->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        return collect(array_keys(self::STATUS))
            ->mapWithKeys(fn (string $status) => [$status => (int) ($counts[$status] ?? 0)])
            ->toArray();
    }
}
