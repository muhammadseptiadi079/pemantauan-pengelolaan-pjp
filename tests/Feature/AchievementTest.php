<?php

namespace Tests\Feature;

use App\Models\Pjp;
use App\Models\PjpEvaluasi;
use App\Models\PjpLaporan;
use App\Models\SmkpChecklistAnswer;
use App\Models\SmkpChecklistItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AchievementTest extends TestCase
{
    use RefreshDatabase;

    public function test_achievement_nol_bukan_null_saat_checklist_kosong(): void
    {
        // smkpScore() selalu numerik (checklist kosong = 0%, bukan null),
        // dan itu satu-satunya metrik yang selalu ada — jadi PJP yang benar-
        // benar belum tersentuh tetap kelihatan sebagai "0%", bukan hilang
        // dari perhitungan seolah belum punya data sama sekali.
        $pjp = Pjp::factory()->create();

        $this->assertSame(0.0, $pjp->achievement());
    }

    public function test_achievement_pakai_skor_terendah_di_antara_ketiga_metrik(): void
    {
        $pjp = Pjp::factory()->create();

        SmkpChecklistItem::whereHas('category', fn ($q) => $q->where('kode', '!=', 'LEGALITAS'))
            ->get()
            ->each(fn (SmkpChecklistItem $item) => SmkpChecklistAnswer::create([
                'pjp_id' => $pjp->id,
                'smkp_checklist_item_id' => $item->id,
                'jawaban' => 'ya',
                'nilai' => '3',
            ]));
        PjpLaporan::factory()->for($pjp)->create(['created_at' => now()->startOfMonth()->addDay()]);
        PjpEvaluasi::factory()->for($pjp)->create([
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 30, 'skor_keselamatan_kesehatan' => 30, 'skor_lingkungan' => 30,
        ]);

        // Skor evaluasi (30) paling rendah di antara skor SMKP dan pelaporan
        // yang keduanya 100 — achievement harus ikut yang terendah, bukan
        // rata-rata, supaya satu area buruk tidak tertutup dua area baik.
        $this->assertSame(30.0, $pjp->achievement());
    }

    public function test_achievement_mengabaikan_pelaporan_dan_evaluasi_yang_masih_null(): void
    {
        $pjp = Pjp::factory()->create();

        SmkpChecklistItem::whereHas('category', fn ($q) => $q->where('kode', '!=', 'LEGALITAS'))
            ->get()
            ->each(fn (SmkpChecklistItem $item) => SmkpChecklistAnswer::create([
                'pjp_id' => $pjp->id,
                'smkp_checklist_item_id' => $item->id,
                'jawaban' => 'ya',
                'nilai' => '3',
            ]));

        // Belum ada laporan maupun evaluasi sama sekali — keduanya null dan
        // harus diabaikan, bukan dianggap 0, supaya achievement tetap 100
        // dari skor SMKP saja.
        $this->assertSame($pjp->smkpScore()['persentase'], $pjp->achievement());
    }

    /**
     * Regresi: setiap PJP berjalan di ketiga tahap (Persyaratan, Pelaporan,
     * Evaluasi) sekaligus — bukan bergantian lewat kolom `tahapan` yang sudah
     * dihapus — jadi setiap halaman tahap harus menampilkan SEMUA PJP dengan
     * skor spesifik halaman itu sebagai `achievement`, bukan cuma sebagian.
     */
    public function test_halaman_persyaratan_mengembalikan_skor_smkp_sebagai_achievement(): void
    {
        $pjp = Pjp::factory()->create();

        SmkpChecklistItem::whereHas('category', fn ($q) => $q->where('kode', '!=', 'LEGALITAS'))
            ->get()
            ->each(fn (SmkpChecklistItem $item) => SmkpChecklistAnswer::create([
                'pjp_id' => $pjp->id,
                'smkp_checklist_item_id' => $item->id,
                'jawaban' => 'ya',
                'nilai' => '3',
            ]));

        $response = $this->get('/persyaratan-seleksi-penetapan');

        // Nilai lewat JSON Inertia, jadi 100.0 dibulatkan JS/PHP jadi int 100
        // saat di-decode ulang oleh helper assertInertia — bukan berarti tipe aslinya berubah.
        $response->assertInertia(fn ($page) => $page
            ->where('pjps.0.achievement', 100)
        );
    }

    public function test_halaman_pelaporan_mengembalikan_skor_pelaporan_sebagai_achievement(): void
    {
        $pjp = Pjp::factory()->create();
        PjpLaporan::factory()->for($pjp)->create(['created_at' => now()->startOfMonth()->addDay()]);

        $response = $this->get('/tanggung-jawab-pemantauan-pelaporan');

        // Sama seperti tes SMKP di atas: 100.0 dibulatkan JS/PHP jadi int 100
        // saat di-decode ulang oleh helper assertInertia.
        $response->assertInertia(fn ($page) => $page
            ->where('pjps.0.achievement', 100)
        );
    }

    public function test_halaman_evaluasi_mengembalikan_skor_evaluasi_terbaru_sebagai_achievement(): void
    {
        $pjp = Pjp::factory()->create();
        PjpEvaluasi::factory()->for($pjp)->create([
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 90, 'skor_keselamatan_kesehatan' => 90, 'skor_lingkungan' => 90,
        ]);

        $response = $this->get('/evaluasi');

        $response->assertInertia(fn ($page) => $page
            ->where('pjps.0.achievement', 90)
        );
    }
}
