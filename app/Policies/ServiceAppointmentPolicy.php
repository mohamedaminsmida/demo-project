<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\ServiceAppointment;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServiceAppointmentPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:ServiceAppointment');
    }

    public function view(AuthUser $authUser, ServiceAppointment $serviceAppointment): bool
    {
        return $authUser->can('View:ServiceAppointment');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:ServiceAppointment');
    }

    public function update(AuthUser $authUser, ServiceAppointment $serviceAppointment): bool
    {
        return $authUser->can('Update:ServiceAppointment');
    }

    public function delete(AuthUser $authUser, ServiceAppointment $serviceAppointment): bool
    {
        return $authUser->can('Delete:ServiceAppointment');
    }

    public function restore(AuthUser $authUser, ServiceAppointment $serviceAppointment): bool
    {
        return $authUser->can('Restore:ServiceAppointment');
    }

    public function forceDelete(AuthUser $authUser, ServiceAppointment $serviceAppointment): bool
    {
        return $authUser->can('ForceDelete:ServiceAppointment');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:ServiceAppointment');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:ServiceAppointment');
    }

    public function replicate(AuthUser $authUser, ServiceAppointment $serviceAppointment): bool
    {
        return $authUser->can('Replicate:ServiceAppointment');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:ServiceAppointment');
    }

}