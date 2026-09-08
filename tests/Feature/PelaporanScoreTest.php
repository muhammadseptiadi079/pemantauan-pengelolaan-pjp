<?php

namespace Tests\Feature;

use App\Models\Pjp;
use App\Models\PjpLaporan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PelaporanScoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_null_saat_pjp_belum_pernah_mengunggah_laporan(): void
    {
        $pjp = Pjp::factory()->create();

        $this->assertNull($pjp->pelaporanScore());
    }

    public function test_hanya_pakai_rate_tepat_waktu_saat_belum_ada_yang_dievaluasi(): void
    {
        $pjp = Pjp::factory()->create();

        PjpLaporan::factory()->for($pjp)->create(['created_at' => now()->startOfMonth()->addDay()]); // tepat waktu
        PjpLaporan::factory()->for($pjp)->create(['created_at' => now()->startOfMonth()->addDays(10)]); // terlambat

        // 1 dari 2 tepat waktu = 50%, tidak ada yang dievaluasi jadi skor akhir = 50.
        $this->assertSame(50.0, $pjp->pelaporanScore());
    }

    public function test_rata_rata_tepat_waktu_dan_kesesuaian_saat_sudah_dievaluasi(): void
    {
        $pjp = Pjp::factory()->create();

        // 2 dari 2 tepat waktu = 100%.
        PjpLaporan::factory()->for($pjp)->create([
            'created_at' => now()->startOfMonth()->addDay(),
            'kesesuaian_isi' => 'sesuai',
        ]);
        PjpLaporan::factory()->for($pjp)->create([
            'created_at' => now()->startOfMonth()->addDay(),
            'kesesuaian_isi' => 'tidak_sesuai',
        ]);

        // 1 dari 2 yang dievaluasi dinilai sesuai = 50%.
        // Rata-rata (100 + 50) / 2 = 75.
        $this->assertSame(75.0, $pjp->pelaporanScore());
    }

    public function test_laporan_yang_belum_dievaluasi_tidak_ikut_menghitung_rate_kesesuaian(): void
    {
        $pjp = Pjp::factory()->create();

        PjpLaporan::factory()->for($pjp)->create([
            'created_at' => now()->startOfMonth()->addDay(),
            'kesesuaian_isi' => 'sesuai',
        ]);
        PjpLaporan::factory()->for($pjp)->create([
            'created_at' => now()->startOfMonth()->addDay(),
            'kesesuaian_isi' => null,
        ]);

        // Tepat waktu 2/2 = 100%. Kesesuaian hanya dihitung dari 1 yang
        // dievaluasi (sesuai) = 100%. Rata-rata = 100.
        $this->assertSame(100.0, $pjp->pelaporanScore());
    }
}
