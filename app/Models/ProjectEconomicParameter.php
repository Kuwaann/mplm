<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectEconomicParameter extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'scenario_name',
        'duration',
        'discount_rate',
        'tax_rate',
        'capital_investment',
        'non_capital_investment',
        'depreciation_method',
        'total_reserve',
        'production_y1',
        'decline_rate',
        'oil_price',
        'opex_y1',
        'opex_growth',
        'initial_production_years',
        'production_data',
    ];

    protected $casts = [
        'duration' => 'integer',
        'discount_rate' => 'float',
        'tax_rate' => 'float',
        'capital_investment' => 'float',
        'non_capital_investment' => 'float',
        'total_reserve' => 'float',
        'production_y1' => 'float',
        'decline_rate' => 'float',
        'oil_price' => 'float',
        'opex_y1' => 'float',
        'opex_growth' => 'float',
        'initial_production_years' => 'integer',
        'production_data' => 'array',
    ];

    /**
     * Mendapatkan objek Proyek yang memiliki skenario parameter ini.
     *
     * @return BelongsTo
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
