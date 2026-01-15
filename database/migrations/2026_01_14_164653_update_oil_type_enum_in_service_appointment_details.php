<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the old constraint and add new one with more oil types
        DB::statement('ALTER TABLE service_appointment_details DROP CONSTRAINT IF EXISTS service_appointment_details_oil_type_check');
        DB::statement("ALTER TABLE service_appointment_details ADD CONSTRAINT service_appointment_details_oil_type_check CHECK (oil_type IN ('conventional', 'synthetic', 'synthetic-blend', 'full-synthetic', 'high-mileage'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE service_appointment_details DROP CONSTRAINT IF EXISTS service_appointment_details_oil_type_check');
        DB::statement("ALTER TABLE service_appointment_details ADD CONSTRAINT service_appointment_details_oil_type_check CHECK (oil_type IN ('conventional', 'synthetic'))");
    }
};
