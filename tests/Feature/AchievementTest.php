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

    public function test_achievement_pakai_smkp_score_di_tahap_persyaratan(): void
    {
        $pjp = Pjp::factory()->create(['tahapan' => 'persyaratan-seleksi-penetapan']);

        $item = SmkpChecklistItem::whereHas('category', fn ($q) => $q->where('kode', '!=', 'LEGALITAS'))->first();
        SmkpChecklistAnswer::create([
            'pjp_id' => $pjp->id,
            'smkp_checklist_item_id' => $item->id,
            'jawaban' => 'ya',
            'nilai' => '3',
        ]);

        $this->assertSame($pjp->smkpScore()['persentase'], $pjp->achievement());
    }

    public function test_achievement_pakai_pelaporan_score_di_tahap_tanggung_jawab(): void
    {
        $pjp = Pjp::factory()->create(['tahapan' => 'tanggung-jawab-pemantauan-pelaporan']);
        PjpLaporan::factory()->for($pjp)->create(['created_at' => now()->startOfMonth()->addDay()]);

        $this->assertSame($pjp->pelaporanScore(), $pjp->achievement());
    }

    public function test_achievement_pakai_evaluasi_terbaru_di_tahap_evaluasi(): void
    {
        $pjp = Pjp::factory()->create(['tahapan' => 'evaluasi']);
        PjpEvaluasi::factory()->for($pjp)->create([
            'tahun' => 2025, 'semester' => 2,
            'skor_teknis' => 80, 'skor_keselamatan_kesehatan' => 80, 'skor_lingkungan' => 80,
        ]);
        $terbaru = PjpEvaluasi::factory()->for($pjp)->create([
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 90, 'skor_keselamatan_kesehatan' => 90, 'skor_lingkungan' => 90,
        ]);

        $this->assertSame($terbaru->skor_rata_rata, $pjp->achievement());
    }

    /**
     * Regresi: TahapanController::pjpsForTahapan pernah men-select kolom
     * ['id', 'nama_perusahaan', 'status'] tanpa 'tahapan', yang membuat
     * achievement() jatuh ke default => null untuk semua baris karena
     * $this->tahapan selalu kosong. Tes ini memukul endpoint sungguhan
     * supaya regresi itu tidak bisa lolos diam-diam lagi.
     */
    public function test_halaman_tahap_mengembalikan_achievement_bukan_null_saat_ada_skor(): void
    {
        $pjp = Pjp::factory()->create(['tahapan' => 'persyaratan-seleksi-penetapan']);

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
}
