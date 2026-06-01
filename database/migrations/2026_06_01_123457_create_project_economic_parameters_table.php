<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_economic_parameters', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel projects (foreign key) dengan opsi cascade delete
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            
            // Nama Skenario (e.g. Base Case, Optimis, Krisis)
            $table->string('scenario_name')->default('Base Case');
            
            // Parameter Waktu & Finansial Dasar
            $table->integer('duration'); // Jangka waktu proyek (tahun)
            $table->decimal('discount_rate', 5, 4)->default(0.1000); // Bunga diskonto desimal (e.g. 0.1000 untuk 10%)
            $table->decimal('tax_rate', 5, 4)->default(0.5100); // Tarif pajak desimal (e.g. 0.5100 untuk 51%)

            // Parameter Pengeluaran Modal (Investasi)
            $table->decimal('capital_investment', 15, 2); // Pengeluaran Modal Kapital
            $table->decimal('non_capital_investment', 15, 2); // Pengeluaran Modal Non-Kapital
            $table->string('depreciation_method')->default('straight_line'); // straight_line, declining_balance, syd, unit_of_production
            $table->decimal('total_reserve', 15, 2)->nullable(); // Cadangan Awal (Mbbl) - Opsional jika menggunakan metode UOP
            
            // Parameter Produksi & Harga
            $table->decimal('production_y1', 15, 2); // Produksi tahun pertama (Mbbl)
            $table->decimal('decline_rate', 5, 4); // Laju penurunan produksi (decline rate) desimal
            $table->decimal('oil_price', 8, 2); // Harga minyak per barel (USD/bbl atau IDR/bbl)

            // Parameter OPEX
            $table->decimal('opex_y1', 15, 2); // Biaya operasional tahun pertama
            $table->decimal('opex_growth', 5, 4)->default(0.0000); // Laju kenaikan OPEX per tahun (inflasi)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_economic_parameters');
    }
};
