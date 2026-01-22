<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use BezhanSalleh\FilamentShield\FilamentShieldPlugin;
use BezhanSalleh\FilamentShield\Resources\Roles\RoleResource;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use DiogoGPinto\AuthUIEnhancer\AuthUIEnhancerPlugin;
use Filament\Actions\Action;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Facades\Vite;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Joaopaulolndev\FilamentEditProfile\FilamentEditProfilePlugin;
use Joaopaulolndev\FilamentEditProfile\Pages\EditProfilePage;
use Illuminate\Support\Facades\Storage;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->resources([
                RoleResource::class,
            ])
            ->viteTheme('resources/css/filament/admin/theme.css')
            ->login()
            ->darkMode(false)
            ->userMenuItems([
                'profile' => Action::make('My Profile')
                     ->url('/admin/profile')
                     ->icon('heroicon-m-user-circle')
            ])
            ->colors([
                'primary' => Color::hex('#bb1010ff'), // deep red from red-arrow icon
                'success' => Color::hex('#15803D'), // green from check icon
            ])
            ->brandLogo(fn () => new HtmlString(
                '<img src="' . Vite::asset('resources/images/logo_black.png') . '" alt="Logo" style="height:6rem; max-height:100%;" />'
            ))
            ->brandLogoHeight('5rem')
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->sidebarCollapsibleOnDesktop()
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                AccountWidget::class,
                FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
             ->plugins([
                 FilamentShieldPlugin::make()
                    ->navigationLabel('Roles')
                    ->navigationIcon('heroicon-o-shield-check')
                    ->activeNavigationIcon('heroicon-s-shield-check')
                    ->navigationGroup('Admin')
                    ->navigationSort(2),
                AuthUIEnhancerPlugin::make()
                ->formPanelPosition('right')
                ->mobileFormPanelPosition('bottom')
                ->formPanelWidth('40%')
                ->emptyPanelBackgroundImageUrl(asset('images/backoffice_background.png')), 
                FilamentEditProfilePlugin::make()
                ->slug('profile')
                ->setTitle('My Profile')
                ->setNavigationLabel('My Profile')
                ->setNavigationGroup('Admin')
                ->setIcon('heroicon-o-user')
                ->setSort(10)
                ->shouldShowEmailForm()
                ->shouldShowDeleteAccountForm(false)
                ->shouldShowSanctumTokens()
                ->shouldShowBrowserSessionsForm()
                ->shouldShowAvatarForm()
             ])  
            ->favicon(asset('images/logo_black.png'));
    }
}
