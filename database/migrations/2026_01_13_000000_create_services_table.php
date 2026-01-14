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
        // Services catalog table (11 service types)
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // e.g., 'new-tires', 'oil-change'
            $table->string('name'); // e.g., 'New Tires', 'Oil Change'
            $table->enum('category', ['tires', 'maintenance', 'repairs']);
            $table->text('description');
            $table->string('estimated_duration'); // e.g., '1-2 hours'
            $table->decimal('base_price', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            
            // Define which form fields this service requires (JSON array)
            // e.g., ['tire_condition', 'number_of_tires', 'tpms_service', 'alignment_service']
            $table->json('required_fields')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
