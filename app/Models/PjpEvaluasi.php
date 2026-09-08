<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PjpEvaluasi extends Model
{
    public const SEMESTER = [
        1 => 'Semester 1 (Januari - Juni)',
        2 => 'Semester 2 (Juli - Desember)',
    ];

    protected $fillable = [
        'pjp_id',
        'tahun',
        'semester',
        'skor_teknis',
        'skor_keselamatan_kesehatan',
        'skor_lingkungan',
        'catatan',
    ];

    protected $appends = ['skor_rata_rata'];

    public function pjp(): BelongsTo
    {
        return $this->belongsTo(Pjp::class);
    }

    protected function skorRataRata(): Attribute
    {
        return Attribute::make(
            get: fn () => round(($this->skor_teknis + $this->skor_keselamatan_kesehatan + $this->skor_lingkungan) / 3, 1),
        );
    }
}
