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
