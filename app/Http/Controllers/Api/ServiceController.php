<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    /**
     * Get all active services for booking
     */
    public function index(): JsonResponse
    {
        $services = Service::where('is_active', true)
            ->with('requirements')
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'slug' => $service->slug,
                    'name' => $service->name,
                    'category' => $service->category,
                    'description' => $service->description,
                    'details' => $service->details ?? null,
                    'image' => $service->image ? asset('storage/' . $service->image) : null,
                    'estimatedDuration' => $service->estimated_duration,
                    'basePrice' => $service->base_price ? (float) $service->base_price : null,
                    'requirements' => $service->requirements->map(function ($requirement) {
                        return [
                            'id' => $requirement->id,
                            'label' => $requirement->label,
                            'key' => $requirement->key,
                            'type' => $requirement->type,
                            'options' => $requirement->options,
                            'isRequired' => $requirement->is_required,
                            'validations' => $requirement->validations,
                            'placeholder' => $requirement->placeholder,
                            'helpText' => $requirement->help_text,
                            'sortOrder' => $requirement->sort_order,
                        ];
                    })->values(),
                ];
            });

        return response()->json([
            'services' => $services,
        ]);
    }

    /**
     * Get a single service by slug
     */
    public function show(string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)
            ->where('is_active', true)
            ->with('requirements')
            ->first();

        if (!$service) {
            return response()->json([
                'error' => 'Service not found',
            ], 404);
        }

        return response()->json([
            'service' => [
                'id' => $service->id,
                'slug' => $service->slug,
                'name' => $service->name,
                'category' => $service->category,
                'description' => $service->description,
                'details' => $service->details ?? null,
                'image' => $service->image ? asset('storage/' . $service->image) : null,
                'estimatedDuration' => $service->estimated_duration,
                'basePrice' => $service->base_price ? (float) $service->base_price : null,
                'requirements' => $service->requirements->map(function ($requirement) {
                    return [
                        'id' => $requirement->id,
                        'label' => $requirement->label,
                        'key' => $requirement->key,
                        'type' => $requirement->type,
                        'options' => $requirement->options,
                        'isRequired' => $requirement->is_required,
                        'validations' => $requirement->validations,
                        'placeholder' => $requirement->placeholder,
                        'helpText' => $requirement->help_text,
                        'sortOrder' => $requirement->sort_order,
                    ];
                })->values(),
            ],
        ]);
    }
}
