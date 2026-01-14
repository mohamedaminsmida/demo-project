<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceAppointmentDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_service_id',
        // Tire fields
        'tire_condition',
        'number_of_tires',
        'tpms_service',
        'alignment_service',
        'wheel_type',
        // Oil change fields
        'oil_type',
        'last_change_date',
        // Brake fields
        'brake_position',
        'noise_or_vibration',
        'warning_light',
        // Repair fields
        'problem_description',
        'vehicle_drivable',
        'photo_paths',
    ];

    protected $casts = [
        'tpms_service' => 'boolean',
        'alignment_service' => 'boolean',
        'noise_or_vibration' => 'boolean',
        'warning_light' => 'boolean',
        'last_change_date' => 'date',
        'photo_paths' => 'array',
    ];

    /**
     * Get the appointment service this detail belongs to.
     */
    public function appointmentService(): BelongsTo
    {
        return $this->belongsTo(AppointmentService::class);
    }
}
