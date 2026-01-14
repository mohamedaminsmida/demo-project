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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['car', 'suv', 'truck', 'van']);
            $table->string('brand'); // Toyota, Ford, Honda
            $table->string('model'); // Camry, F-150, Civic
            $table->string('year'); // 2020, 2021, etc.
            $table->string('vin')->nullable();
            $table->string('tire_size')->nullable(); // e.g., 225/65R17
            $table->text('notes')->nullable();
            $table->boolean('is_primary')->default(false); // User's primary vehicle
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
