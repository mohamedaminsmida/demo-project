<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceRequirementValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_service_id',
        'service_requirement_id',
        'value',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    public function appointmentService(): BelongsTo
    {
        return $this->belongsTo(AppointmentService::class);
    }

    public function requirement(): BelongsTo
    {
        return $this->belongsTo(ServiceRequirement::class, 'service_requirement_id');
    }
}
