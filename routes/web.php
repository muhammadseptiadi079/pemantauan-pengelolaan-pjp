<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PjpController;
use App\Http\Controllers\PjpLaporanController;
use App\Http\Controllers\TahapanController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get(
    '/persyaratan-seleksi-penetapan',
    [TahapanController::class, 'persyaratanSeleksiPenetapan']
)->name('persyaratan-seleksi-penetapan');

Route::get(
    '/tanggung-jawab-pemantauan-pelaporan',
    [TahapanController::class, 'tanggungJawabPemantauanPelaporan']
)->name('tanggung-jawab-pemantauan-pelaporan');

Route::get('/evaluasi', [TahapanController::class, 'evaluasi'])->name('evaluasi');

Route::resource('pjp', PjpController::class);

Route::post('/pjp/{pjp}/laporan', [PjpLaporanController::class, 'store'])->name('pjp.laporan.store');
Route::delete('/pjp/{pjp}/laporan/{laporan}', [PjpLaporanController::class, 'destroy'])->name('pjp.laporan.destroy');
