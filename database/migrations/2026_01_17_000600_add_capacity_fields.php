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
        Schema::table('settings', function (Blueprint $table) {
            $table->unsignedInteger('total_capacity')->nullable()->after('working_hours');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->unsignedInteger('max_concurrent_bookings')->nullable()->after('estimated_duration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn('total_capacity');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('max_concurrent_bookings');
        });
    }
};
