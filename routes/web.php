<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PjpController;
use App\Http\Controllers\PjpEvaluasiController;
use App\Http\Controllers\PjpLaporanController;
use App\Http\Controllers\SmkpChecklistController;
use App\Http\Controllers\TahapanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::get('/bantuan', fn () => Inertia::render('Bantuan'))->name('bantuan');

Route::get(
    '/persyaratan-seleksi-penetapan',
    [TahapanController::class, 'persyaratanSeleksiPenetapan']
)->name('persyaratan-seleksi-penetapan');

Route::get(
    '/tanggung-jawab-pemantauan-pelaporan',
    [TahapanController::class, 'tanggungJawabPemantauanPelaporan']
)->name('tanggung-jawab-pemantauan-pelaporan');

Route::get('/evaluasi', [TahapanController::class, 'evaluasi'])->name('evaluasi');

Route::get('/pjp/export', [PjpController::class, 'export'])->name('pjp.export');
Route::get('/pjp/{pjp}/export-pdf', [PjpController::class, 'exportPdf'])->name('pjp.export-pdf');

Route::resource('pjp', PjpController::class);

Route::post('/pjp/{pjp}/laporan', [PjpLaporanController::class, 'store'])->name('pjp.laporan.store');
Route::patch('/pjp/{pjp}/laporan/{laporan}', [PjpLaporanController::class, 'update'])->name('pjp.laporan.update');
Route::delete('/pjp/{pjp}/laporan/{laporan}', [PjpLaporanController::class, 'destroy'])->name('pjp.laporan.destroy');

Route::get('/pjp/{pjp}/checklist-smkp', [SmkpChecklistController::class, 'show'])->name('pjp.checklist-smkp.show');
Route::post('/pjp/{pjp}/checklist-smkp', [SmkpChecklistController::class, 'update'])->name('pjp.checklist-smkp.update');

Route::post('/pjp/{pjp}/evaluasi', [PjpEvaluasiController::class, 'store'])->name('pjp.evaluasi.store');
Route::delete('/pjp/{pjp}/evaluasi/{evaluasi}', [PjpEvaluasiController::class, 'destroy'])->name('pjp.evaluasi.destroy');
