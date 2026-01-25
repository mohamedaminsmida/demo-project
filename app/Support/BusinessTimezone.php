<?php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class BusinessTimezone
{
    /**
     * Get the business timezone from settings.
     * Falls back to app timezone if not configured.
     */
    public static function get(): string
    {
        return Cache::remember('business_timezone', 3600, function () {
            $settings = Setting::query()->first();

            return $settings?->timezone ?? config('app.timezone', 'America/Los_Angeles');
        });
    }

    /**
     * Clear the cached timezone (call after settings are updated).
     */
    public static function clearCache(): void
    {
        Cache::forget('business_timezone');
    }
}
