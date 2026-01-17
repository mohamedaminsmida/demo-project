<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AppointmentService extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_appointment_id',
        'service_id',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    /**
     * Get the appointment this belongs to.
     */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(ServiceAppointment::class, 'service_appointment_id');
    }

    /**
     * Get the service.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the service requirement values.
     */
    public function requirementValues(): HasMany
    {
        return $this->hasMany(ServiceRequirementValue::class);
    }
}
