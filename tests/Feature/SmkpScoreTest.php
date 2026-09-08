<?php

namespace Tests\Feature;

use App\Models\Pjp;
use App\Models\SmkpChecklistAnswer;
use App\Models\SmkpChecklistCategory;
use App\Models\SmkpChecklistItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SmkpScoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_skor_nol_persen_saat_belum_ada_jawaban_sama_sekali(): void
    {
        $pjp = Pjp::factory()->create();

        $score = $pjp->smkpScore();

        $this->assertSame(0.0, $score['persentase']);
        $this->assertGreaterThan(0, $score['total_bobot']);
    }

    public function test_skor_seratus_persen_saat_semua_item_dijawab_nilai_maksimal(): void
    {
        $pjp = Pjp::factory()->create();

        SmkpChecklistItem::query()
            ->whereHas('category', fn ($q) => $q->where('kode', '!=', 'LEGALITAS'))
            ->get()
            ->each(function (SmkpChecklistItem $item) use ($pjp) {
                SmkpChecklistAnswer::create([
                    'pjp_id' => $pjp->id,
                    'smkp_checklist_item_id' => $item->id,
                    'jawaban' => 'ya',
                    'nilai' => '3',
                ]);
            });

        $this->assertSame(100.0, $pjp->smkpScore()['persentase']);
    }

    public function test_item_bernilai_na_dikeluarkan_dari_bobot_dan_skor(): void
    {
        $pjp = Pjp::factory()->create();

        $category = SmkpChecklistCategory::where('kode', '!=', 'LEGALITAS')->first();
        $items = $category->items;

        // Semua item di kategori ini dijawab N/A kecuali satu item bernilai 3 penuh.
        foreach ($items as $index => $item) {
            SmkpChecklistAnswer::create([
                'pjp_id' => $pjp->id,
                'smkp_checklist_item_id' => $item->id,
                'jawaban' => $index === 0 ? 'ya' : 'na',
                'nilai' => $index === 0 ? '3' : 'na',
            ]);
        }

        $breakdown = collect($pjp->smkpCategoryBreakdown())->firstWhere('kode', $category->kode);

        // Bobot yang dinilai cuma dari 1 item (yang tidak N/A), jadi skornya penuh 100%.
        $this->assertSame($items->first()->bobot, $breakdown['bobot_dinilai']);
        $this->assertSame(100.0, $breakdown['persentase']);
    }

    public function test_item_yang_belum_dijawab_tetap_menyumbang_bobot_dengan_skor_nol(): void
    {
        $pjp = Pjp::factory()->create();

        $category = SmkpChecklistCategory::where('kode', '!=', 'LEGALITAS')->first();
        $totalBobotKategori = $category->items->sum('bobot');

        // Tidak ada satupun jawaban diisi untuk kategori ini.
        $breakdown = collect($pjp->smkpCategoryBreakdown())->firstWhere('kode', $category->kode);

        $this->assertSame($totalBobotKategori, $breakdown['bobot_dinilai']);
        $this->assertSame(0.0, $breakdown['persentase']);
    }

    public function test_legalitas_status_menghitung_item_berjawaban_ya_tanpa_masuk_skor(): void
    {
        $pjp = Pjp::factory()->create();

        $legalitasItems = SmkpChecklistCategory::where('kode', 'LEGALITAS')->first()->items;
        $this->assertGreaterThan(0, $legalitasItems->count());

        SmkpChecklistAnswer::create([
            'pjp_id' => $pjp->id,
            'smkp_checklist_item_id' => $legalitasItems->first()->id,
            'jawaban' => 'ya',
            'nilai' => '3',
        ]);

        $status = $pjp->smkpLegalitasStatus();

        $this->assertSame($legalitasItems->count(), $status['total']);
        $this->assertSame(1, $status['lengkap']);

        // Kategori LEGALITAS tidak boleh muncul di breakdown skor A-P.
        $this->assertArrayNotHasKey('LEGALITAS', array_column($pjp->smkpCategoryBreakdown(), null, 'kode'));
    }
}
