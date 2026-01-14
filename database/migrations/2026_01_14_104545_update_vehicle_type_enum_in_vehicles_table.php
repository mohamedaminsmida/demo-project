<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For PostgreSQL, we need to drop the constraint and recreate it with new values
        DB::statement("ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_type_check");
        DB::statement("ALTER TABLE vehicles ADD CONSTRAINT vehicles_type_check CHECK (type::text = ANY (ARRAY['car'::text, 'suv'::text, 'truck'::text, 'van'::text, 'light-truck'::text, 'motorcycle'::text, 'other'::text]))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_type_check");
        DB::statement("ALTER TABLE vehicles ADD CONSTRAINT vehicles_type_check CHECK (type::text = ANY (ARRAY['car'::text, 'suv'::text, 'truck'::text, 'van'::text]))");
    }
};
