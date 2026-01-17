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
        $isSqlite = Schema::getConnection()->getDriverName() === 'sqlite';

        if (Schema::hasColumn('service_appointments', 'sms_updates')) {
            Schema::table('service_appointments', function (Blueprint $table) {
                $table->dropColumn('sms_updates');
            });
        }

        if (Schema::hasColumn('service_appointments', 'estimated_price')) {
            Schema::table('service_appointments', function (Blueprint $table) {
                $table->dropColumn('estimated_price');
            });
        }

        if (! $isSqlite) {
            DB::statement('ALTER TABLE service_appointments DROP CONSTRAINT IF EXISTS service_appointments_status_check');
        }

        DB::table('service_appointments')
            ->whereIn('status', ['pending', 'confirmed'])
            ->update(['status' => 'scheduled']);

        if (! $isSqlite) {
            DB::statement("ALTER TABLE service_appointments ADD CONSTRAINT service_appointments_status_check CHECK (status IN ('scheduled','in_progress','completed','cancelled','no_show'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $isSqlite = Schema::getConnection()->getDriverName() === 'sqlite';

        if (! $isSqlite) {
            DB::statement('ALTER TABLE service_appointments DROP CONSTRAINT IF EXISTS service_appointments_status_check');
        }

        DB::table('service_appointments')
            ->where('status', 'scheduled')
            ->update(['status' => 'pending']);

        if (! $isSqlite) {
            DB::statement("ALTER TABLE service_appointments ADD CONSTRAINT service_appointments_status_check CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled'))");
        }

        Schema::table('service_appointments', function (Blueprint $table) {
            if (! Schema::hasColumn('service_appointments', 'sms_updates')) {
                $table->boolean('sms_updates')->default(false);
            }

            if (! Schema::hasColumn('service_appointments', 'estimated_price')) {
                $table->decimal('estimated_price', 10, 2)->nullable();
            }
        });
    }
};
