<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class PjpImportTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Menulis file .xlsx sungguhan ke disk lokal (bukan UploadedFile::fake(),
     * yang isinya byte acak dan tidak bisa dibaca ulang sebagai spreadsheet)
     * supaya import beneran mem-parsing baris demi baris seperti kondisi
     * nyata pemakainya.
     */
    private function xlsxUploadFrom(array $rows): UploadedFile
    {
        Storage::fake('local');

        Excel::store(new class($rows) implements FromArray {
            public function __construct(private readonly array $rows) {}

            public function array(): array
            {
                return $this->rows;
            }
        }, 'import-test.xlsx', 'local');

        $path = Storage::disk('local')->path('import-test.xlsx');

        return new UploadedFile($path, 'import-test.xlsx', null, null, true);
    }

    public function test_baris_valid_disimpan_baris_tidak_valid_dilewati(): void
    {
        $file = $this->xlsxUploadFrom([
            ['Nama Perusahaan', 'NIB', 'Penanggung Jawab', 'Alamat', 'Status', 'Catatan'],
            ['PT Contoh Satu', '1111111111111', 'Budi', 'Jl. A', 'Aktif Dipantau', 'Catatan A'],
            ['', '2222222222222', 'Siti', 'Jl. B', 'aktif', ''],
            ['PT Contoh Dua', '3333333333333', 'Rudi', 'Jl. C', 'Status Ngasal Tidak Ada', ''],
        ]);

        $response = $this->post('/pjp/import', ['file' => $file]);

        $response->assertRedirect('/pjp');
        // 1 baris valid tersimpan; 2 baris (nama kosong, status tidak dikenal) dilewati
        // tanpa membatalkan baris yang valid.
        $this->assertDatabaseCount('pjps', 1);
        $this->assertDatabaseHas('pjps', [
            'nama_perusahaan' => 'PT Contoh Satu',
            'status' => 'aktif',
            'catatan' => 'Catatan A',
        ]);
    }

    public function test_baris_dengan_nib_tidak_13_digit_dilewati(): void
    {
        $file = $this->xlsxUploadFrom([
            ['Nama Perusahaan', 'NIB', 'Penanggung Jawab', 'Alamat', 'Status', 'Catatan'],
            ['PT NIB Salah', '12345', '', '', 'aktif', ''],
        ]);

        $this->post('/pjp/import', ['file' => $file]);

        $this->assertDatabaseMissing('pjps', ['nama_perusahaan' => 'PT NIB Salah']);
    }

    public function test_status_kosong_default_ke_aktif(): void
    {
        $file = $this->xlsxUploadFrom([
            ['Nama Perusahaan', 'NIB', 'Penanggung Jawab', 'Alamat', 'Status', 'Catatan'],
            ['PT Tanpa Status', '', '', '', '', ''],
        ]);

        $this->post('/pjp/import', ['file' => $file]);

        $this->assertDatabaseHas('pjps', [
            'nama_perusahaan' => 'PT Tanpa Status',
            'status' => 'aktif',
        ]);
    }

    public function test_template_import_bisa_diunduh(): void
    {
        $response = $this->get('/pjp/import-template');

        $response->assertOk();
    }
}
