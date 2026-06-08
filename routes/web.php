<?php

use App\Http\Controllers\ProjectController;
use App\Models\Project;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LoginPage', [
        'title' => 'Masuk',
    ]);
});

Route::get('/beranda', function () {
    $projects = Project::with('economicParameters')->get();

    return Inertia::render('HomePage', [
        'title' => 'Beranda',
        'projects' => $projects,
    ]);
});

Route::get('/kelola-proyek', [ProjectController::class, 'index'])->name('kelola-proyek');
Route::post('/proyek', [ProjectController::class, 'store'])->name('proyek.store');

Route::get('/detil-proyek/data', [ProjectController::class, 'showCalculator'])->name('proyek.calculator.default');
Route::get('/detil-proyek/{id}/pengaturan', [ProjectController::class, 'showSettings'])->name('proyek.settings');
Route::put('/detil-proyek/{id}/pengaturan', [ProjectController::class, 'updateSettings'])->name('proyek.settings.update');
Route::get('/detil-proyek/{id?}', [ProjectController::class, 'show'])->name('proyek.show');
Route::get('/detil-proyek/{id?}/data', [ProjectController::class, 'showCalculator'])->name('proyek.calculator');
Route::post('/detil-proyek/{id}/parameter', [ProjectController::class, 'storeParameter'])->name('proyek.parameter.store');
