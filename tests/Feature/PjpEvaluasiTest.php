<?php

namespace Tests\Feature;

use App\Models\Pjp;
use App\Models\PjpEvaluasi;
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

    public function test_average_trend_merata_ratakan_seluruh_pjp_per_periode(): void
    {
        $pjpA = Pjp::factory()->create();
        $pjpB = Pjp::factory()->create();

        PjpEvaluasi::factory()->for($pjpA)->create([
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 80, 'skor_keselamatan_kesehatan' => 80, 'skor_lingkungan' => 80,
        ]);
        PjpEvaluasi::factory()->for($pjpB)->create([
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 60, 'skor_keselamatan_kesehatan' => 60, 'skor_lingkungan' => 60,
        ]);

        $trend = PjpEvaluasi::averageTrend();

        $this->assertCount(1, $trend);
        $this->assertSame(2026, $trend[0]['tahun']);
        $this->assertSame(1, $trend[0]['semester']);
        // (80 + 60) / 2 = 70
        $this->assertSame(70.0, $trend[0]['rata_rata']);
        $this->assertSame(2, $trend[0]['jumlah_pjp']);
    }

    public function test_average_trend_terurut_kronologis(): void
    {
        $pjp = Pjp::factory()->create();

        PjpEvaluasi::factory()->for($pjp)->create([
            'tahun' => 2026, 'semester' => 2,
            'skor_teknis' => 50, 'skor_keselamatan_kesehatan' => 50, 'skor_lingkungan' => 50,
        ]);
        PjpEvaluasi::factory()->for($pjp)->create([
            'tahun' => 2025, 'semester' => 2,
            'skor_teknis' => 40, 'skor_keselamatan_kesehatan' => 40, 'skor_lingkungan' => 40,
        ]);
        PjpEvaluasi::factory()->for($pjp)->create([
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 60, 'skor_keselamatan_kesehatan' => 60, 'skor_lingkungan' => 60,
        ]);

        $trend = PjpEvaluasi::averageTrend()->values();

        $this->assertSame([2025, 2026, 2026], $trend->pluck('tahun')->all());
        $this->assertSame([2, 1, 2], $trend->pluck('semester')->all());
    }

    public function test_halaman_evaluasi_mengirim_trend_gabungan(): void
    {
        $pjp = Pjp::factory()->create();
        PjpEvaluasi::factory()->for($pjp)->create([
            'tahun' => 2026, 'semester' => 1,
            'skor_teknis' => 90, 'skor_keselamatan_kesehatan' => 90, 'skor_lingkungan' => 90,
        ]);

        $response = $this->get('/evaluasi');

        $response->assertInertia(fn ($page) => $page
            ->has('evaluasiTrendGabungan', 1)
            ->where('evaluasiTrendGabungan.0.rata_rata', 90)
        );
    }
}
