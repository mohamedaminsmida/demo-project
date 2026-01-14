<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'category',
        'description',
        'details',
        'image',
        'estimated_duration',
        'base_price',
        'is_active',
        'required_fields',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'is_active' => 'boolean',
        'required_fields' => 'array',
        'details' => 'array',
    ];

    /**
     * Get all appointments that include this service.
     */
    public function appointments(): BelongsToMany
    {
        return $this->belongsToMany(ServiceAppointment::class, 'appointment_services')
            ->withPivot('price')
            ->withTimestamps();
    }
}
