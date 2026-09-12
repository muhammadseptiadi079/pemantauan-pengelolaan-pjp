<?php

namespace Tests\Feature;

use App\Models\Pjp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PjpControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_nib_harus_13_digit_kalau_diisi(): void
    {
        $response = $this->post('/pjp', [
            'nama_perusahaan' => 'PT Contoh',
            'nib' => '12345',
            'status' => 'aktif',
        ]);

        $response->assertSessionHasErrors('nib');
        $this->assertDatabaseMissing('pjps', ['nama_perusahaan' => 'PT Contoh']);
    }

    public function test_nib_13_digit_valid_diterima(): void
    {
        $response = $this->post('/pjp', [
            'nama_perusahaan' => 'PT Contoh',
            'nib' => '1234567890123',
            'status' => 'aktif',
        ]);

        $response->assertSessionDoesntHaveErrors('nib');
        $this->assertDatabaseHas('pjps', ['nama_perusahaan' => 'PT Contoh', 'nib' => '1234567890123']);
    }

    public function test_nib_boleh_kosong(): void
    {
        $response = $this->post('/pjp', [
            'nama_perusahaan' => 'PT Contoh',
            'status' => 'aktif',
        ]);

        $response->assertSessionDoesntHaveErrors('nib');
        $this->assertDatabaseHas('pjps', ['nama_perusahaan' => 'PT Contoh']);
    }

    public function test_pencarian_cocok_dengan_nib(): void
    {
        Pjp::factory()->create(['nama_perusahaan' => 'PT Alpha', 'nib' => '1111111111111']);
        Pjp::factory()->create(['nama_perusahaan' => 'PT Beta', 'nib' => '2222222222222']);

        $response = $this->get('/pjp?search=1111111111111');

        $response->assertInertia(fn ($page) => $page
            ->has('pjps.data', 1)
            ->where('pjps.data.0.nama_perusahaan', 'PT Alpha')
        );
    }

    public function test_pencarian_cocok_dengan_penanggung_jawab(): void
    {
        Pjp::factory()->create(['nama_perusahaan' => 'PT Alpha', 'penanggung_jawab' => 'Budi Santoso']);
        Pjp::factory()->create(['nama_perusahaan' => 'PT Beta', 'penanggung_jawab' => 'Siti Aminah']);

        $response = $this->get('/pjp?search=Budi');

        $response->assertInertia(fn ($page) => $page
            ->has('pjps.data', 1)
            ->where('pjps.data.0.nama_perusahaan', 'PT Alpha')
        );
    }

    public function test_pencarian_cocok_dengan_alamat(): void
    {
        Pjp::factory()->create(['nama_perusahaan' => 'PT Alpha', 'alamat' => 'Jl. Sudirman, Jakarta']);
        Pjp::factory()->create(['nama_perusahaan' => 'PT Beta', 'alamat' => 'Jl. Thamrin, Jakarta']);

        $response = $this->get('/pjp?search=Sudirman');

        $response->assertInertia(fn ($page) => $page
            ->has('pjps.data', 1)
            ->where('pjps.data.0.nama_perusahaan', 'PT Alpha')
        );
    }
}
