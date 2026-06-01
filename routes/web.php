<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProjectController;

use App\Models\Project;

Route::get('/', function () {
    return Inertia::render('LoginPage', [
        'title' => 'Masuk',
    ]);
});

Route::get('/home', function () {
    $projects = Project::with('economicParameters')->get();
    return Inertia::render('HomePage', [
        'title' => 'Beranda',
        'projects' => $projects,
    ]);
});

Route::get('/kelola-proyek', [ProjectController::class, 'index'])->name('kelola-proyek');
Route::post('/proyek', [ProjectController::class, 'store'])->name('proyek.store');

Route::get('/detil-proyek/data', [ProjectController::class, 'showCalculator'])->name('proyek.calculator.default');
Route::get('/detil-proyek/{id?}', [ProjectController::class, 'show'])->name('proyek.show');
Route::get('/detil-proyek/{id?}/data', [ProjectController::class, 'showCalculator'])->name('proyek.calculator');
Route::post('/detil-proyek/{id}/parameter', [ProjectController::class, 'storeParameter'])->name('proyek.parameter.store');

Route::get('/detil-proyek/data/tambah', function () {
    return Inertia::render('TambahDataProyekPage', [
        'title' => 'Tambah Data Proyek',
    ]);
});