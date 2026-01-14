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
            $table->foreignId('appointment_service_id')->constrained()->onDelete('cascade');
            
            // Tire-related fields (for tire services: new-tires, used-tires, alignment, wheels, flat-repair)
            $table->enum('tire_condition', ['new', 'used'])->nullable();
            $table->integer('number_of_tires')->nullable(); // 1-4
            $table->boolean('tpms_service')->nullable();
            $table->boolean('alignment_service')->nullable();
            $table->string('wheel_type')->nullable(); // alloy, steel, chrome, etc.
            
            // Oil change fields (for oil-change service)
            $table->enum('oil_type', ['conventional', 'synthetic'])->nullable();
            $table->date('last_change_date')->nullable();
            
            // Brake service fields (for brakes service)
            $table->enum('brake_position', ['front', 'rear', 'both'])->nullable();
            $table->boolean('noise_or_vibration')->nullable();
            $table->boolean('warning_light')->nullable();
            
            // Repair services fields (for engine-repair, engine-replacement, transmission, lift-kit)
            $table->text('problem_description')->nullable();
            $table->enum('vehicle_drivable', ['yes', 'no'])->nullable();
            $table->json('photo_paths')->nullable(); // Array of uploaded photo paths
            
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
