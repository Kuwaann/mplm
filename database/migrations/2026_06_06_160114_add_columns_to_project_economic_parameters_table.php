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
        Schema::table('project_economic_parameters', function (Blueprint $table) {
            $table->integer('initial_production_years')->nullable()->after('duration');
            $table->json('production_data')->nullable()->after('initial_production_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_economic_parameters', function (Blueprint $table) {
            $table->dropColumn(['initial_production_years', 'production_data']);
        });
    }
};
