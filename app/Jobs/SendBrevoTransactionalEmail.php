<?php

namespace App\Jobs;

use Hofmannsven\Brevo\Facades\Brevo;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendBrevoTransactionalEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @param array<string, mixed> $payload
     */
    public function __construct(
        public readonly array $payload
    ) {
    }

    public function handle(): void
    {
        Brevo::TransactionalEmailsApi()->sendTransacEmail($this->payload);
    }
}
