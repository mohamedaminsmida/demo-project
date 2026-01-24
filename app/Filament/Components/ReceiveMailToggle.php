<?php

namespace App\Filament\Components;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Auth;
use Joaopaulolndev\FilamentEditProfile\Concerns\HasSort;
use Livewire\Component;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;

class ReceiveMailToggle extends Component implements HasForms, HasActions
{
    use HasSort;
    use InteractsWithForms;
    use InteractsWithActions;

    protected static ?int $sort = 100;

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'receive_mail' => Auth::user()?->receive_mail ?? false,
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Toggle::make('receive_mail')
                    ->label('Receive booking emails')
                    ->helperText('If enabled, you will receive appointment booking notifications. Only one admin can have this enabled at a time.')
                    ->afterStateUpdated(function ($state) {
                        if ($state) {
                            $existing = \App\Models\User::where('receive_mail', true)
                                ->where('id', '!=', Auth::id())
                                ->first();
                            if ($existing) {
                                $this->form->fill(['receive_mail' => false]);
                                Notification::make()
                                    ->title('Warning')
                                    ->body("Only one admin can receive booking emails at a time. {$existing->name} already has this enabled.")
                                    ->warning()
                                    ->persistent()
                                    ->send();
                            } else {
                                // Save the setting
                                Auth::user()->update(['receive_mail' => true]);
                                Notification::make()
                                    ->title('Success')
                                    ->body('You will now receive booking emails.')
                                    ->success()
                                    ->send();
                            }
                        } else {
                            // Save the setting
                            Auth::user()->update(['receive_mail' => false]);
                            Notification::make()
                                ->title('Success')
                                ->body('You will no longer receive booking emails.')
                                ->success()
                                ->send();
                        }
                    }),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        // The toggle handles saving in the afterStateUpdated callback
        // This method is required for the form to work properly
    }

    public function render(): \Illuminate\View\View
    {
        return view('filament.components.receive-mail-toggle');
    }
}