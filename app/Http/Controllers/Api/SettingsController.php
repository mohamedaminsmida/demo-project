<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = Setting::query()->first();

        return response()->json([
            'settings' => [
                'working_hours' => $settings?->working_hours ?? [],
            ],
        ]);
    }
}
