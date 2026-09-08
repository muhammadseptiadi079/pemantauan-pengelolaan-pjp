<?php

namespace Tests\Feature;

use App\Models\Pjp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PjpAdvanceTahapanTest extends TestCase
{
    use RefreshDatabase;

    public function test_bisa_lanjut_tahap_walau_skor_persyaratan_kosong(): void
    {
        // Sengaja tidak mengisi checklist SMKP sama sekali (skor 0%) — flow
        // ini harus tetap jalan, karena keputusan lanjut PJP ada di tangan
        // manajemen, bukan digerbang oleh skor minimum.
        $pjp = Pjp::factory()->create(['tahapan' => 'persyaratan-seleksi-penetapan']);

        $response = $this->post("/pjp/{$pjp->id}/advance-tahapan");

        $response->assertRedirect();
        $this->assertSame('tanggung-jawab-pemantauan-pelaporan', $pjp->fresh()->tahapan);
    }

    public function test_urutan_lanjut_tahap_mengikuti_next_tahapan(): void
    {
        $pjp = Pjp::factory()->create(['tahapan' => 'tanggung-jawab-pemantauan-pelaporan']);

        $this->post("/pjp/{$pjp->id}/advance-tahapan");

        $this->assertSame('evaluasi', $pjp->fresh()->tahapan);
    }

    public function test_tidak_bisa_lanjut_dari_tahap_terakhir(): void
    {
        $pjp = Pjp::factory()->create(['tahapan' => 'evaluasi']);

        $response = $this->post("/pjp/{$pjp->id}/advance-tahapan");

        $response->assertStatus(400);
        $this->assertSame('evaluasi', $pjp->fresh()->tahapan);
    }
}
