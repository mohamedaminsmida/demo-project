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
        Schema::table('service_appointment_details', function (Blueprint $table) {
            $table->string('symptom_type')->nullable()->after('warning_light');
            $table->text('other_symptom_description')->nullable()->after('symptom_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_appointment_details', function (Blueprint $table) {
            $table->dropColumn(['symptom_type', 'other_symptom_description']);
        });
    }
};
