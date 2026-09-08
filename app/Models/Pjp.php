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

    /**
     * Tahap berikutnya dalam alur pengelolaan PJP. Perpindahan ini murni
     * keputusan admin (lewat PjpController::advanceTahapan) — tidak ada
     * skor minimum yang memblokir, karena manajemen bisa saja tetap
     * memutuskan memakai PJP walau skor Persyaratan PJP-nya belum ideal.
     */
    public const NEXT_TAHAPAN = [
        'persyaratan-seleksi-penetapan' => 'tanggung-jawab-pemantauan-pelaporan',
        'tanggung-jawab-pemantauan-pelaporan' => 'evaluasi',
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

    public function smkpChecklistAnswers(): HasMany
    {
        return $this->hasMany(SmkpChecklistAnswer::class);
    }

    public function evaluasis(): HasMany
    {
        return $this->hasMany(PjpEvaluasi::class)->orderByDesc('tahun')->orderByDesc('semester');
    }

    /**
     * Skor kepatuhan checklist prakualifikasi SMKP, dihitung dari kategori
     * berbobot A-P (kategori Dokumen Legalitas tidak ikut dihitung karena
     * berupa syarat wajib terpisah, bukan bagian dari sistem bobot 180).
     * Item dengan nilai N/A dikeluarkan dari total bobot maupun skor; item
     * yang belum diisi tetap menyumbang bobot ke penyebut (skor 0).
     */
    public function smkpScore(): array
    {
        $answers = $this->smkpChecklistAnswers()
            ->with('item.category')
            ->get()
            ->keyBy('smkp_checklist_item_id');

        $items = SmkpChecklistItem::query()
            ->with('category')
            ->whereHas('category', fn (Builder $q) => $q->where('kode', '!=', 'LEGALITAS'))
            ->get();

        $totalBobot = 0;
        $totalSkor = 0.0;

        foreach ($items as $item) {
            $nilai = $answers->get($item->id)?->nilai;

            if ($nilai === 'na') {
                continue;
            }

            $totalBobot += $item->bobot;
            $totalSkor += $item->bobot * ((int) ($nilai ?? 0) / 3);
        }

        $persentase = $totalBobot > 0 ? round($totalSkor / $totalBobot * 100, 1) : 0.0;

        return [
            'total_bobot' => $totalBobot,
            'total_skor' => round($totalSkor, 1),
            'persentase' => $persentase,
            'kategori_risiko' => self::kategoriRisikoFor($persentase),
        ];
    }

    /**
     * Skor kepatuhan pelaporan Tahap 2, dari rata-rata dua hal yang sudah
     * ada: persentase laporan yang tepat waktu, dan (kalau ada yang sudah
     * dievaluasi) persentase yang dinilai sesuai isinya. `null` artinya PJP
     * ini belum pernah mengunggah laporan sama sekali — beda dari skor 0,
     * supaya tidak salah ditandai "kritis" padahal cuma belum ada datanya.
     */
    public function pelaporanScore(): ?float
    {
        $laporans = $this->laporans()->get();

        if ($laporans->isEmpty()) {
            return null;
        }

        $rateTepatWaktu = $laporans->filter(fn (PjpLaporan $l) => $l->tepat_waktu)->count() / $laporans->count() * 100;

        $dievaluasi = $laporans->whereNotNull('kesesuaian_isi');
        $rateSesuai = $dievaluasi->isNotEmpty()
            ? $dievaluasi->filter(fn (PjpLaporan $l) => $l->kesesuaian_isi === 'sesuai')->count() / $dievaluasi->count() * 100
            : null;

        return round($rateSesuai !== null ? ($rateTepatWaktu + $rateSesuai) / 2 : $rateTepatWaktu, 1);
    }

    private static function kategoriRisikoFor(float $persentase): string
    {
        return match (true) {
            $persentase > 75 => 'Kritis',
            $persentase >= 55 => 'Tinggi',
            $persentase >= 36 => 'Sedang',
            $persentase >= 20 => 'Rendah',
            default => 'Sangat Rendah',
        };
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
