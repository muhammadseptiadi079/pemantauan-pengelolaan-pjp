<?php

namespace Tests\Feature;

use App\Models\Pjp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PjpEvaluasiTest extends TestCase
{
    use RefreshDatabase;

    public function test_skor_rata_rata_dihitung_dari_tiga_aspek(): void
    {
        $pjp = Pjp::factory()->create();

        $this->post("/pjp/{$pjp->id}/evaluasi", [
            'tahun' => 2026,
            'semester' => 1,
            'skor_teknis' => 90,
            'skor_keselamatan_kesehatan' => 80,
            'skor_lingkungan' => 70,
        ]);

        $evaluasi = $pjp->evaluasis()->first();

        $this->assertSame(80.0, $evaluasi->skor_rata_rata);
    }

    public function test_submit_ulang_semester_yang_sama_menimpa_bukan_menduplikasi(): void
    {
        $pjp = Pjp::factory()->create();

        $this->post("/pjp/{$pjp->id}/evaluasi", [
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 50, 'skor_keselamatan_kesehatan' => 50, 'skor_lingkungan' => 50,
        ]);

        $this->post("/pjp/{$pjp->id}/evaluasi", [
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 90, 'skor_keselamatan_kesehatan' => 90, 'skor_lingkungan' => 90,
        ]);

        $this->assertDatabaseCount('pjp_evaluasis', 1);
        $this->assertSame(90.0, $pjp->evaluasis()->first()->skor_rata_rata);
    }

    public function test_semester_berbeda_membuat_baris_terpisah(): void
    {
        $pjp = Pjp::factory()->create();

        $this->post("/pjp/{$pjp->id}/evaluasi", [
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 50, 'skor_keselamatan_kesehatan' => 50, 'skor_lingkungan' => 50,
        ]);

        $this->post("/pjp/{$pjp->id}/evaluasi", [
            'tahun' => 2026, 'semester' => 2,
            'skor_teknis' => 90, 'skor_keselamatan_kesehatan' => 90, 'skor_lingkungan' => 90,
        ]);

        $this->assertDatabaseCount('pjp_evaluasis', 2);
    }
}
