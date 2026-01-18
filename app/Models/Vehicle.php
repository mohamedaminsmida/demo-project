<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'type',
        'other_type',
        'brand',
        'model',
        'year',
        'vin',
        'tire_size',
        'notes',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    /**
     * Get the customer that owns the vehicle.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get all appointments for this vehicle.
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(ServiceAppointment::class);
    }

    /**
     * Get the full vehicle name.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->year} {$this->brand} {$this->model}";
    }
}
