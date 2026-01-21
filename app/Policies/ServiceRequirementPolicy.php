<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\ServiceRequirement;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServiceRequirementPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:ServiceRequirement');
    }

    public function view(AuthUser $authUser, ServiceRequirement $serviceRequirement): bool
    {
        return $authUser->can('View:ServiceRequirement');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:ServiceRequirement');
    }

    public function update(AuthUser $authUser, ServiceRequirement $serviceRequirement): bool
    {
        return $authUser->can('Update:ServiceRequirement');
    }

    public function delete(AuthUser $authUser, ServiceRequirement $serviceRequirement): bool
    {
        return $authUser->can('Delete:ServiceRequirement');
    }

    public function restore(AuthUser $authUser, ServiceRequirement $serviceRequirement): bool
    {
        return $authUser->can('Restore:ServiceRequirement');
    }

    public function forceDelete(AuthUser $authUser, ServiceRequirement $serviceRequirement): bool
    {
        return $authUser->can('ForceDelete:ServiceRequirement');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:ServiceRequirement');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:ServiceRequirement');
    }

    public function replicate(AuthUser $authUser, ServiceRequirement $serviceRequirement): bool
    {
        return $authUser->can('Replicate:ServiceRequirement');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:ServiceRequirement');
    }

}