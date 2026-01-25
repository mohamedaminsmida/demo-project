<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'working_hours',
        'total_capacity',
        'timezone',
        'footer_phone',
        'footer_email',
        'footer_address',
        'footer_facebook',
        'footer_instagram',
        'footer_description',
    ];

    protected $casts = [
        'working_hours' => 'array',
        'total_capacity' => 'integer',
    ];
}
