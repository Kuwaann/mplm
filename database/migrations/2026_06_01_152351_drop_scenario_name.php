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
            $table->dropColumn('scenario_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_economic_parameters', function (Blueprint $table) {
            $table->string('scenario_name');
        });
    }
};
