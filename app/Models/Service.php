<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'service_category_id',
        'description',
        'image',
        'estimated_duration',
        'max_concurrent_bookings',
        'base_price',
        'is_active',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'is_active' => 'boolean',
        'max_concurrent_bookings' => 'integer',
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

    public function requirements(): HasMany
    {
        return $this->hasMany(ServiceRequirement::class)
            ->orderBy('sort_order');
    }

    public function serviceCategory(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class);
    }
}
