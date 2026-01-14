<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceAppointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'appointment_date',
        'appointment_time',
        'customer_name',
        'customer_phone',
        'customer_email',
        'sms_updates',
        'estimated_price',
        'final_price',
        'status',
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'sms_updates' => 'boolean',
        'estimated_price' => 'decimal:2',
        'final_price' => 'decimal:2',
    ];

    /**
     * Get the user that owns the appointment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the vehicle for this appointment.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get all services for this appointment.
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'appointment_services')
            ->withPivot('price')
            ->withTimestamps();
    }

    /**
     * Get the appointment services (pivot records).
     */
    public function appointmentServices(): HasMany
    {
        return $this->hasMany(AppointmentService::class);
    }
}
