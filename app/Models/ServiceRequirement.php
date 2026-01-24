<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ServiceRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'label',
        'key',
        'type',
        'price',
        'options',
        'is_required',
        'validations',
        'placeholder',
        'help_text',
        'sort_order',
    ];

    protected $casts = [
        'options' => 'array',
        'validations' => 'array',
        'is_required' => 'boolean',
        'sort_order' => 'integer',
        'price' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::saving(function (ServiceRequirement $requirement): void {
            if (! $requirement->service_id || ! $requirement->label) {
                return;
            }

            if ($requirement->key) {
                return;
            }

            $serviceSlug = $requirement->service?->slug
                ?? Service::query()->whereKey($requirement->service_id)->value('slug');

            $baseKey = Str::slug(trim(sprintf('%s %s', $serviceSlug, $requirement->label)), '_');

            if ($baseKey === '') {
                return;
            }

            $key = $baseKey;
            $suffix = 1;

            while (self::query()
                ->where('service_id', $requirement->service_id)
                ->where('key', $key)
                ->when($requirement->exists, fn ($query) => $query->whereKeyNot($requirement->id))
                ->exists()) {
                $suffix += 1;
                $key = $baseKey . '_' . $suffix;
            }

            $requirement->key = $key;
        });
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function values(): HasMany
    {
        return $this->hasMany(ServiceRequirementValue::class);
    }
}
