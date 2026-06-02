<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectEconomicParameter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Menampilkan daftar proyek yang dikelola.
     */
    public function index()
    {
        // Ambil semua proyek dari database beserta parameter keekonomian terbarunya
        $projects = Project::with(['economicParameters' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->orderBy('created_at', 'desc')->get();

        return Inertia::render('KelolaProyekPage', [
            'title' => 'Kelola Proyek',
            'projects' => $projects
        ]);
    }

    /**
     * Menyimpan proyek baru ke database beserta parameter keekonomian default.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        // 1. Buat data proyek utama
        $project = Project::create([
            'name' => $request->name,
            'location' => $request->location ?? 'Kalimantan Timur',
            'description' => $request->description ?? 'Deskripsi sumur migas baru.',
        ]);

        return redirect()->route('kelola-proyek')->with('success', 'Proyek berhasil ditambahkan!');
    }

    /**
     * Menampilkan halaman detil proyek berdasarkan ID.
     */
    public function show($id = null)
    {
        if ($id) {
            $project = Project::with(['economicParameters' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])->findOrFail($id);
        } else {
            $project = Project::with(['economicParameters' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])->first();
        }

        return Inertia::render('DetilProyekPage', [
            'title' => 'Ringkasan Proyek',
            'project' => $project
        ]);
    }

    /**
     * Menampilkan halaman kalkulator kalkulasi keekonomian proyek berdasarkan ID.
     */
    public function showCalculator($id = null)
    {
        if ($id) {
            $project = Project::with(['economicParameters' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])->findOrFail($id);
        } else {
            $project = Project::with(['economicParameters' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])->first();
        }

        return Inertia::render('DetilProyekDataPage', [
            'title' => 'Kalkulator Proyek',
            'project' => $project
        ]);
    }

    /**
     * Menyimpan atau memperbarui parameter ekonomi proyek.
     */
    public function storeParameter(Request $request, $id)
    {
        $request->validate([
            'duration' => 'required|integer|min:1|max:25',
            'capital_investment' => 'required|numeric|min:0',
            'non_capital_investment' => 'required|numeric|min:0',
            'production_y1' => 'required|numeric|min:0',
            'decline_rate' => 'required|numeric|min:0|max:100',
            'oil_price' => 'required|numeric|min:0',
            'opex_y1' => 'required|numeric|min:0',
            'tax_rate' => 'required|numeric|min:0|max:100',
        ]);

        $project = Project::findOrFail($id);

        // Cari atau buat parameter baru
        $project->economicParameters()->updateOrCreate(
            ['project_id' => $id], // Kriteria pencarian
            [
                'duration' => $request->duration,
                'discount_rate' => 0.10, // Default 10%
                'tax_rate' => $request->tax_rate / 100, // Konversi ke desimal desimal
                'capital_investment' => $request->capital_investment,
                'non_capital_investment' => $request->non_capital_investment,
                'depreciation_method' => 'straight_line',
                'production_y1' => $request->production_y1,
                'decline_rate' => $request->decline_rate / 100, // Konversi ke desimal desimal
                'oil_price' => $request->oil_price,
                'opex_y1' => $request->opex_y1,
                'opex_growth' => 0.00, // Default growth 0%
            ]
        );

        return redirect()->back()->with('success', 'Parameter ekonomi berhasil disimpan!');
    }
}
