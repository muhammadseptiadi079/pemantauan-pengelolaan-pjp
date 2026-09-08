<?php

namespace Tests\Feature;

use App\Models\Pjp;
use App\Models\PjpLaporan;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PjpLaporanTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    public function test_laporan_diunggah_pada_tanggal_batas_dianggap_tepat_waktu(): void
    {
        $pjp = Pjp::factory()->create();

        $laporan = PjpLaporan::factory()->for($pjp)->create([
            'created_at' => Carbon::parse('2026-09-03'),
        ]);

        $this->assertTrue($laporan->tepat_waktu);
    }

    public function test_laporan_diunggah_setelah_tanggal_batas_dianggap_terlambat(): void
    {
        $pjp = Pjp::factory()->create();

        $laporan = PjpLaporan::factory()->for($pjp)->create([
            'created_at' => Carbon::parse('2026-09-04'),
        ]);

        $this->assertFalse($laporan->tepat_waktu);
    }

    public function test_laporan_triwulan_hanya_terbuka_pada_bulan_tw1_tw2_tw3_tw4(): void
    {
        $this->assertTrue(PjpLaporan::triwulanSedangDibuka(Carbon::parse('2026-04-15')));
        $this->assertTrue(PjpLaporan::triwulanSedangDibuka(Carbon::parse('2026-07-01')));
        $this->assertTrue(PjpLaporan::triwulanSedangDibuka(Carbon::parse('2026-10-31')));
        $this->assertTrue(PjpLaporan::triwulanSedangDibuka(Carbon::parse('2027-01-01')));

        $this->assertFalse(PjpLaporan::triwulanSedangDibuka(Carbon::parse('2026-09-08')));
        $this->assertFalse(PjpLaporan::triwulanSedangDibuka(Carbon::parse('2026-03-31')));
    }

    public function test_upload_laporan_triwulan_ditolak_di_luar_bulan_yang_dibuka(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-09-08'));

        $pjp = Pjp::factory()->create();

        $response = $this->post("/pjp/{$pjp->id}/laporan", [
            'jenis' => 'laporan_triwulan',
            'file' => UploadedFile::fake()->create('laporan.pdf', 100),
        ]);

        $response->assertSessionHasErrors('file');
        $this->assertDatabaseCount('pjp_laporans', 0);

        Carbon::setTestNow();
    }

    public function test_upload_laporan_triwulan_diterima_saat_bulan_dibuka(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-04-05'));

        $pjp = Pjp::factory()->create();

        $response = $this->post("/pjp/{$pjp->id}/laporan", [
            'jenis' => 'laporan_triwulan',
            'file' => UploadedFile::fake()->create('laporan.pdf', 100),
        ]);

        $response->assertSessionDoesntHaveErrors();
        $this->assertDatabaseCount('pjp_laporans', 1);

        Carbon::setTestNow();
    }
}
