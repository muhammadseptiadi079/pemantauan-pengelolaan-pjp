<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pjp extends Model
{
    use HasFactory;

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
        $breakdown = $this->smkpCategoryBreakdown();

        $totalBobot = array_sum(array_column($breakdown, 'bobot_dinilai'));
        $totalSkor = array_sum(array_column($breakdown, 'skor'));

        $persentase = $totalBobot > 0 ? round($totalSkor / $totalBobot * 100, 1) : 0.0;

        return [
            'total_bobot' => $totalBobot,
            'total_skor' => round($totalSkor, 1),
            'persentase' => $persentase,
            'kategori_risiko' => self::kategoriRisikoFor($persentase),
        ];
    }

    /**
     * Rincian skor checklist SMKP per kategori (A-P, tidak termasuk
     * LEGALITAS), supaya kelihatan kategori mana yang paling lemah —
     * bukan cuma satu angka persentase total.
     */
    public function smkpCategoryBreakdown(): array
    {
        $answers = $this->smkpChecklistAnswers()->get()->keyBy('smkp_checklist_item_id');

        $categories = SmkpChecklistCategory::query()
            ->where('kode', '!=', 'LEGALITAS')
            ->orderBy('urutan')
            ->with('items')
            ->get();

        return $categories->map(function (SmkpChecklistCategory $category) use ($answers) {
            $bobotDinilai = 0;
            $skor = 0.0;

            foreach ($category->items as $item) {
                $nilai = $answers->get($item->id)?->nilai;

                if ($nilai === 'na') {
                    continue;
                }

                $bobotDinilai += $item->bobot;
                $skor += $item->bobot * ((int) ($nilai ?? 0) / 3);
            }

            return [
                'kode' => $category->kode,
                'nama' => $category->nama,
                'bobot' => $category->bobot,
                'bobot_dinilai' => $bobotDinilai,
                'skor' => round($skor, 1),
                'persentase' => $bobotDinilai > 0 ? round($skor / $bobotDinilai * 100, 1) : 0.0,
            ];
        })->values()->toArray();
    }

    /**
     * Status kelengkapan syarat wajib Dokumen Legalitas — terpisah dari
     * skor 180 checklist SMKP, jadi cuma dihitung "berapa dari total item
     * yang sudah dijawab Y", bukan skor 0-3.
     */
    public function smkpLegalitasStatus(): array
    {
        $answers = $this->smkpChecklistAnswers()->get()->keyBy('smkp_checklist_item_id');

        $items = SmkpChecklistCategory::where('kode', 'LEGALITAS')->first()?->items ?? collect();

        return [
            'total' => $items->count(),
            'lengkap' => $items->filter(fn (SmkpChecklistItem $item) => $answers->get($item->id)?->jawaban === 'ya')->count(),
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

    /**
     * Skor achievement PJP sesuai tahap tempatnya berada sekarang — dipakai
     * seragam oleh grafik achievement per tahap maupun ringkasan lintas-tahap
     * di Beranda, supaya logikanya cuma didefinisikan sekali.
     */
    public function achievement(): ?float
    {
        return match ($this->tahapan) {
            'persyaratan-seleksi-penetapan' => $this->smkpScore()['persentase'],
            'tanggung-jawab-pemantauan-pelaporan' => $this->pelaporanScore(),
            'evaluasi' => $this->evaluasis()->first()?->skor_rata_rata,
            default => null,
        };
    }

    /**
     * Jumlah PJP dengan achievement() di bawah 80 — dipakai oleh badge
     * ringkas di sidebar (lihat HandleInertiaRequests) dan sejalan dengan
     * daftar "PJP Paling Perlu Perhatian" di Beranda.
     */
    public static function perluPerhatianCount(): int
    {
        return static::all(['id', 'tahapan'])
            ->filter(fn (Pjp $pjp) => ($achievement = $pjp->achievement()) !== null && $achievement < 80)
            ->count();
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
