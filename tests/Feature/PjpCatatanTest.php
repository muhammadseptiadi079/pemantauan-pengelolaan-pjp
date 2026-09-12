<?php

namespace Tests\Feature;

use App\Models\Pjp;
use App\Models\PjpCatatan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PjpCatatanTest extends TestCase
{
    use RefreshDatabase;

    public function test_menambah_catatan_baru_tidak_menimpa_catatan_lama(): void
    {
        $pjp = Pjp::factory()->create();

        $this->post("/pjp/{$pjp->id}/catatan", ['isi' => 'Catatan pertama']);
        $this->post("/pjp/{$pjp->id}/catatan", ['isi' => 'Catatan kedua']);

        $this->assertDatabaseCount('pjp_catatans', 2);
        $this->assertSame('Catatan kedua', $pjp->catatans()->first()->isi);
    }

    public function test_isi_wajib_diisi(): void
    {
        $pjp = Pjp::factory()->create();

        $response = $this->post("/pjp/{$pjp->id}/catatan", ['isi' => '']);

        $response->assertSessionHasErrors('isi');
        $this->assertDatabaseCount('pjp_catatans', 0);
    }

    public function test_hapus_catatan_pjp_lain_ditolak(): void
    {
        $pjpA = Pjp::factory()->create();
        $pjpB = Pjp::factory()->create();
        $catatan = PjpCatatan::factory()->for($pjpA)->create();

        $response = $this->delete("/pjp/{$pjpB->id}/catatan/{$catatan->id}");

        $response->assertNotFound();
        $this->assertDatabaseHas('pjp_catatans', ['id' => $catatan->id]);
    }

    public function test_hapus_catatan_menghilangkannya_dari_riwayat(): void
    {
        $pjp = Pjp::factory()->create();
        $catatan = PjpCatatan::factory()->for($pjp)->create();

        $this->delete("/pjp/{$pjp->id}/catatan/{$catatan->id}");

        $this->assertDatabaseMissing('pjp_catatans', ['id' => $catatan->id]);
    }
}
