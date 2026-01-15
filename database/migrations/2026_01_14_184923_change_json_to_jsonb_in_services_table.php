<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Convert JSON columns to JSONB for PostgreSQL equality comparison support.
     */
    public function up(): void
    {
        // Convert details column from json to jsonb
        DB::statement('ALTER TABLE services ALTER COLUMN details TYPE jsonb USING details::jsonb');
        
        // Convert required_fields column from json to jsonb
        DB::statement('ALTER TABLE services ALTER COLUMN required_fields TYPE jsonb USING required_fields::jsonb');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert back to json
        DB::statement('ALTER TABLE services ALTER COLUMN details TYPE json USING details::json');
        DB::statement('ALTER TABLE services ALTER COLUMN required_fields TYPE json USING required_fields::json');
    }
};
