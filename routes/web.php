<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/persyaratan-seleksi-penetapan', function () {
    return Inertia::render('PersyaratanSeleksiPenetapan');
})->name('persyaratan-seleksi-penetapan');

Route::get('/tanggung-jawab-pemantauan-pelaporan', function () {
    return Inertia::render('TanggungJawabPemantauanPelaporan');
})->name('tanggung-jawab-pemantauan-pelaporan');

Route::get('/evaluasi', function () {
    return Inertia::render('Evaluasi');
})->name('evaluasi');
