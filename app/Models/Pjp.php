<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pjp extends Model
{
    public const TAHAPAN = [
        'persyaratan-seleksi-penetapan' => 'Persyaratan, Seleksi, dan Penetapan',
        'tanggung-jawab-pemantauan-pelaporan' => 'Tanggung Jawab, Pemantauan, dan Pelaporan',
        'evaluasi' => 'Evaluasi',
    ];

    public const STATUS = [
        'aktif' => 'Aktif Dipantau',
        'perlu_tindak_lanjut' => 'Perlu Tindak Lanjut',
        'tidak_aktif' => 'Tidak Aktif',
    ];

    protected $fillable = [
        'nama_perusahaan',
        'nib',
        'penanggung_jawab',
        'alamat',
        'tahapan',
        'status',
        'catatan',
    ];
}
