<?php

namespace Tests\Feature;

use App\Exports\PjpExport;
use App\Models\Pjp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PjpExportTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Regresi: PhpSpreadsheet menulis angka 0 mentah sebagai sel kosong,
     * jadi PjpExport::map() sengaja mengubah skor jadi string ('0%',
     * bukan float 0). Tes ini memastikan itu tidak sengaja diubah balik
     * ke angka mentah oleh perubahan berikutnya.
     */
    public function test_skor_nol_persen_diekspor_sebagai_string_bukan_angka_mentah(): void
    {
        $pjp = Pjp::factory()->create();

        $row = (new PjpExport())->map($pjp);

        [, , , , , $skorPersyaratan, $skorPelaporan, $skorEvaluasi] = $row;

        $this->assertSame('0%', $skorPersyaratan);
        $this->assertIsString($skorPersyaratan);
        $this->assertSame('Belum ada laporan', $skorPelaporan);
        $this->assertSame('Belum dievaluasi', $skorEvaluasi);
    }
}
