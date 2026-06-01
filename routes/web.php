<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LoginPage', [
        'title' => 'Masuk',
    ]);
});

Route::get('/home', function () {
    return Inertia::render('HomePage', [
        'title' => 'Beranda',
    ]);
});

Route::get('/kelola-proyek', function () {
    return Inertia::render('KelolaProyekPage', [
        'title' => 'Kelola Proyek',
    ]);
});

Route::get('/detil-proyek', function () {
    return Inertia::render('DetilProyekPage', [
        'title' => 'Proyek',
    ]);
});

Route::get('/detil-proyek/data', function () {
    return Inertia::render('DetilProyekDataPage', [
        'title' => 'Data Proyek',
    ]);
});

Route::get('/detil-proyek/data/tambah', function () {
    return Inertia::render('TambahDataProyekPage', [
        'title' => 'Tambah Data Proyek',
    ]);
});