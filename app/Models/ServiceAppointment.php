<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\AppointmentStatus;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceAppointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'vehicle_id',
        'appointment_date',
        'appointment_time',
        'customer_name',
        'customer_phone',
        'customer_email',
        'final_price',
        'status',
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'final_price' => 'decimal:2',
        'status' => AppointmentStatus::class,
    ];

    /**
     * Get the customer that owns the appointment.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
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
     * Note: We select specific columns to avoid PostgreSQL JSON comparison issues with DISTINCT
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'appointment_services')
            ->select(['services.id', 'services.slug', 'services.name', 'services.category', 'services.description', 'services.image', 'services.estimated_duration', 'services.base_price', 'services.is_active', 'services.created_at', 'services.updated_at'])
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
