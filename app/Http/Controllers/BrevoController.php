<?php

namespace App\Http\Controllers;

use Hofmannsven\Brevo\Facades\Brevo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BrevoController extends Controller
{
    /**
     * Get account information
     */
    public function getAccount(): JsonResponse
    {
        try {
            $result = Brevo::AccountApi()->getAccount();
            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all domains
     */
    public function getDomains(): JsonResponse
    {
        try {
            $result = Brevo::DomainsApi()->getDomains();
            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all contacts
     */
    public function getContacts(): JsonResponse
    {
        try {
            $result = Brevo::ContactsApi()->getContacts();
            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a transactional email
     */
    public function sendTransactionalEmail(Request $request): JsonResponse
    {
        $request->validate([
            'to' => 'required|array',
            'to.*.email' => 'required|email',
            'to.*.name' => 'nullable|string',
            'subject' => 'required|string',
            'htmlContent' => 'required|string',
            'sender' => 'required|array',
            'sender.email' => 'required|email',
            'sender.name' => 'required|string',
        ]);

        try {
            $result = Brevo::TransactionalEmailsApi()->sendTransacEmail([
                'sender' => $request->sender,
                'to' => $request->to,
                'subject' => $request->subject,
                'htmlContent' => $request->htmlContent,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create an email campaign
     */
    public function createCampaign(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string',
            'subject' => 'required|string',
            'htmlContent' => 'required|string',
            'sender' => 'required|array',
            'sender.email' => 'required|email',
            'sender.name' => 'required|string',
            'recipients' => 'required|array',
        ]);

        try {
            $result = Brevo::EmailCampaignsApi()->createEmailCampaign([
                'name' => $request->name,
                'subject' => $request->subject,
                'htmlContent' => $request->htmlContent,
                'sender' => $request->sender,
                'recipients' => $request->recipients,
            ]);

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get email campaigns
     */
    public function getCampaigns(): JsonResponse
    {
        try {
            $result = Brevo::EmailCampaignsApi()->getEmailCampaigns();
            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
