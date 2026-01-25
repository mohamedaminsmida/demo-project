<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Filament\Models\Contracts\HasAvatar;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasAvatar
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'city',
        'state',
        'zip_code',
        'sms_notifications',
        'email_notifications',
        'avatar_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'sms_notifications' => 'boolean',
            'email_notifications' => 'boolean',
        ];
    }

    /**
     * Get the avatar URL attribute.
     */
    public function getAvatarUrlAttribute(): string
    {
        $rawAvatarUrl = $this->getRawOriginal('avatar_url');
        return $rawAvatarUrl 
            ? Storage::url($rawAvatarUrl)
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=7F9CF5&background=EBF4FF';
    }

    public function getFilamentAvatarUrl(): ?string
    {
        $rawAvatarUrl = $this->getRawOriginal('avatar_url');

        if (! $rawAvatarUrl) {
            return null;
        }

        if (filter_var($rawAvatarUrl, FILTER_VALIDATE_URL)) {
            return $rawAvatarUrl;
        }

        $disk = config('filament-edit-profile.disk', config('filesystems.default', 'public'));

        if (Storage::disk($disk)->exists($rawAvatarUrl)) {
            return Storage::disk($disk)->url($rawAvatarUrl);
        }

        return Storage::url($rawAvatarUrl);
    }

}
