<?php

namespace Tests\Feature;

use App\Models\Pjp;
use App\Models\PjpLaporan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PjpDestroyTest extends TestCase
{
    use RefreshDatabase;

    public function test_hapus_pjp_ikut_menghapus_folder_dokumennya(): void
    {
        Storage::fake('public');

        $pjp = Pjp::factory()->create();

        $path = UploadedFile::fake()->create('laporan.pdf', 100)->store("pjp-laporan/{$pjp->id}", 'public');
        PjpLaporan::factory()->for($pjp)->create(['file_path' => $path]);

        Storage::disk('public')->assertExists($path);

        $this->delete("/pjp/{$pjp->id}");

        Storage::disk('public')->assertMissing($path);
        $this->assertDatabaseMissing('pjps', ['id' => $pjp->id]);
        $this->assertDatabaseCount('pjp_laporans', 0);
    }
}
