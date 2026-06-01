<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'description',
    ];

    /**
     * Mendapatkan daftar skenario parameter ekonomi untuk proyek ini.
     *
     * @return HasMany
     */
    public function economicParameters(): HasMany
    {
        return $this->hasMany(ProjectEconomicParameter::class);
    }
}
