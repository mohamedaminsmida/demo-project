<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions (if they don't exist)
        $permissions = [
            // Role permissions
            'ViewAny:Role',
            'View:Role',
            'Create:Role',
            'Update:Role',
            'Delete:Role',
            'Restore:Role',
            'ForceDelete:Role',
            'ForceDeleteAny:Role',
            'RestoreAny:Role',
            'Replicate:Role',
            'Reorder:Role',
            // Customer permissions
            'ViewAny:Customer',
            'View:Customer',
            'Create:Customer',
            'Update:Customer',
            'Delete:Customer',
            'Restore:Customer',
            'ForceDelete:Customer',
            'ForceDeleteAny:Customer',
            'RestoreAny:Customer',
            'Replicate:Customer',
            'Reorder:Customer',
            // ServiceAppointment permissions
            'ViewAny:ServiceAppointment',
            'View:ServiceAppointment',
            'Create:ServiceAppointment',
            'Update:ServiceAppointment',
            'Delete:ServiceAppointment',
            'Restore:ServiceAppointment',
            'ForceDelete:ServiceAppointment',
            'ForceDeleteAny:ServiceAppointment',
            'RestoreAny:ServiceAppointment',
            'Replicate:ServiceAppointment',
            'Reorder:ServiceAppointment',
            // ServiceRequirement permissions
            'ViewAny:ServiceRequirement',
            'View:ServiceRequirement',
            'Create:ServiceRequirement',
            'Update:ServiceRequirement',
            'Delete:ServiceRequirement',
            'Restore:ServiceRequirement',
            'ForceDelete:ServiceRequirement',
            'ForceDeleteAny:ServiceRequirement',
            'RestoreAny:ServiceRequirement',
            'Replicate:ServiceRequirement',
            'Reorder:ServiceRequirement',
            // Service permissions
            'ViewAny:Service',
            'View:Service',
            'Create:Service',
            'Update:Service',
            'Delete:Service',
            'Restore:Service',
            'ForceDelete:Service',
            'ForceDeleteAny:Service',
            'RestoreAny:Service',
            'Replicate:Service',
            'Reorder:Service',
            // User permissions
            'ViewAny:User',
            'View:User',
            'Create:User',
            'Update:User',
            'Delete:User',
            'Restore:User',
            'ForceDelete:User',
            'ForceDeleteAny:User',
            'RestoreAny:User',
            'Replicate:User',
            'Reorder:User',
            // Vehicle permissions
            'ViewAny:Vehicle',
            'View:Vehicle',
            'Create:Vehicle',
            'Update:Vehicle',
            'Delete:Vehicle',
            'Restore:Vehicle',
            'ForceDelete:Vehicle',
            'ForceDeleteAny:Vehicle',
            'RestoreAny:Vehicle',
            'Replicate:Vehicle',
            'Reorder:Vehicle',
            // Settings permissions
            'View:Settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

        // Assign permissions to roles
        $superAdminRole->givePermissionTo(Permission::all());

        // Admin role gets all permissions except Role permissions
        $adminPermissions = Permission::whereNotIn('name', [
            'ViewAny:Role',
            'View:Role',
            'Create:Role',
            'Update:Role',
            'Delete:Role',
            'Restore:Role',
            'ForceDelete:Role',
            'ForceDeleteAny:Role',
            'RestoreAny:Role',
            'Replicate:Role',
            'Reorder:Role',
        ])->get();
        $adminRole->givePermissionTo($adminPermissions);

        // Create or update super admin user
        $superAdmin = User::firstOrCreate(['email' => 'super_admin@strivehawk.com'], [
            'name' => 'strivehawk',
            'email' => 'super_admin@strivehawk.com',
            'password' => Hash::make('password'), // Change this if needed
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole($superAdminRole);

        // Create or update admin user
        $admin = User::firstOrCreate(['email' => 'aminsmida2022@gmail.com'], [
            'name' => 'luquetiers',
            'email' => 'aminsmida2022@gmail.com',
            'password' => Hash::make('password'), // Change this if needed
            'email_verified_at' => now(),
        ]);
        $admin->assignRole($adminRole);
    }
}
