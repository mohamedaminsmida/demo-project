<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_requirement_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_requirement_id')->constrained()->cascadeOnDelete();
            $table->jsonb('value')->nullable();
            $table->timestamps();

            $table->unique(['appointment_service_id', 'service_requirement_id'], 'appointment_service_requirement_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_requirement_values');
    }
};
