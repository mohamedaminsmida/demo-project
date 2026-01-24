<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ServiceCategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = ServiceCategory::with(['services' => function ($query) {
            $query->where('is_active', true);
        }])->get();

        return response()->json($categories);
    }
}
