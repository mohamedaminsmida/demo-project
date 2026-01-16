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
        Schema::create('service_appointment_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_service_id')->constrained()->cascadeOnDelete();
            $table->enum('tire_condition', ['new', 'used'])->nullable();
            $table->integer('number_of_tires')->nullable();
            $table->boolean('tpms_service')->nullable();
            $table->boolean('alignment_service')->nullable();
            $table->string('wheel_type')->nullable();
            $table->enum('oil_type', ['conventional', 'synthetic', 'synthetic-blend', 'full-synthetic', 'high-mileage'])->nullable();
            $table->date('last_change_date')->nullable();
            $table->enum('brake_position', ['front', 'rear', 'both'])->nullable();
            $table->boolean('noise_or_vibration')->nullable();
            $table->boolean('warning_light')->nullable();
            $table->string('symptom_type')->nullable();
            $table->text('other_symptom_description')->nullable();
            $table->text('problem_description')->nullable();
            $table->enum('vehicle_drivable', ['yes', 'no'])->nullable();
            $table->json('photo_paths')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_appointment_details');
    }
};
