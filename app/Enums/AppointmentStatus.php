<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case Scheduled = 'scheduled';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case NoShow = 'no_show';

    public function badgeColor(): string
    {
        return match ($this) {
            self::Scheduled => 'warning',
            self::InProgress => 'info',
            self::Completed => 'success',
            self::Cancelled => 'danger',
            self::NoShow => 'gray',
        };
    }

    public static function tableColorMap(): array
    {
        return [
            'warning' => [self::Scheduled->value],
            'info' => [self::InProgress->value],
            'success' => [self::Completed->value],
            'danger' => [self::Cancelled->value],
            'gray' => [self::NoShow->value],
        ];
    }
}
