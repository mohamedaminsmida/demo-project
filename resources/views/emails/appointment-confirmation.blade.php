<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Appointment Confirmation</title>
</head>

<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f5f5f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0"
                    style="width:600px;max-width:100%;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 35px rgba(15,23,42,0.15);">

                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding:28px 40px 20px;background-color:#ffffff;">
                            <img src="{{ $logoUrl ?? asset('images/logo_black.png') }}" alt="{{ $companyName }} Logo"
                                style="display:block;height:100px;width:auto;" />
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 40px 20px;color:#111827;">
                            <p style="margin:0 0 12px;font-size:16px;">Hi
                                <strong>{{ $greetingName ?? 'Luque Tires Team' }}</strong>,
                            </p>
                            <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4b5563;">
                                {{ $introText ?? 'A new service appointment has been booked and is ready for your review.' }}
                            </p>

                            <h3 style="margin:0 0 16px;font-size:18px;color:#111827;">
                                {{ $detailsHeading ?? 'Appointment Details' }}</h3>
                            <div
                                style="border:1px solid #e5e7eb;border-radius:18px;padding:22px;background-color:#f9fafb;box-shadow:inset 0 1px 0 rgba(255,255,255,0.6);">
                                <table role="presentation" cellpadding="0" cellspacing="0"
                                    style="width:100%;font-size:15px;color:#1f2937;">
                                    <tr>
                                        <td
                                            style="padding:10px 12px;width:35%;text-transform:uppercase;letter-spacing:0.06em;font-size:12px;color:#6b7280;">
                                            Services</td>
                                        <td style="padding:10px 12px;font-weight:600;color:#111827;">{{ $services }}
                                        </td>
                                    </tr>
                                    @if (!empty($serviceDetails) && is_array($serviceDetails))
                                        <tr>
                                            <td
                                                style="padding:10px 12px;width:35%;text-transform:uppercase;letter-spacing:0.06em;font-size:12px;color:#6b7280;vertical-align:top;">
                                                Service details</td>
                                            <td style="padding:10px 12px;color:#111827;">
                                                <table role="presentation" cellpadding="0" cellspacing="0"
                                                    style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">
                                                    @foreach ($serviceDetails as $serviceDetail)
                                                        <tr>
                                                            <td style="padding:6px 0;color:#111827;">
                                                                {{ $serviceDetail['name'] ?? '' }}
                                                            </td>
                                                            <td align="right"
                                                                style="padding:6px 0;color:#111827;font-weight:600;">
                                                                ${{ $serviceDetail['price'] ?? '' }}
                                                            </td>
                                                        </tr>
                                                    @endforeach
                                                    @if (!empty($totalPrice))
                                                        <tr>
                                                            <td
                                                                style="padding:10px 0 0;color:#111827;border-top:1px solid #e5e7eb;font-weight:700;">
                                                                Total</td>
                                                            <td align="right"
                                                                style="padding:10px 0 0;color:#0f9d58;border-top:1px solid #e5e7eb;font-weight:800;">
                                                                ${{ $totalPrice }}</td>
                                                        </tr>
                                                    @endif
                                                </table>
                                            </td>
                                        </tr>
                                    @endif
                                    <tr>
                                        <td
                                            style="padding:10px 12px;width:35%;text-transform:uppercase;letter-spacing:0.06em;font-size:12px;color:#6b7280;">
                                            Date</td>
                                        <td style="padding:10px 12px;color:#111827;">{{ $appointmentDate }}</td>
                                    </tr>
                                    <tr>
                                        <td
                                            style="padding:10px 12px;width:35%;text-transform:uppercase;letter-spacing:0.06em;font-size:12px;color:#6b7280;">
                                            Time</td>
                                        <td style="padding:10px 12px;color:#111827;">{{ $appointmentTime }}</td>
                                    </tr>
                                    <tr>
                                        <td
                                            style="padding:10px 12px;width:35%;text-transform:uppercase;letter-spacing:0.06em;font-size:12px;color:#6b7280;">
                                            Vehicle</td>
                                        <td style="padding:10px 12px;color:#111827;">{{ $vehicleInfo }}</td>
                                    </tr>
                                    @if (!empty($estimatedPrice))
                                        <tr>
                                            <td
                                                style="padding:10px 12px;width:35%;text-transform:uppercase;letter-spacing:0.06em;font-size:12px;color:#6b7280;">
                                                Estimate</td>
                                            <td style="padding:10px 12px;font-weight:600;color:#0f9d58;">
                                                ${{ $estimatedPrice }}</td>
                                        </tr>
                                    @endif
                                </table>
                            </div>

                            @if (!empty($customerNotice))
                                <div
                                    style="margin-top:18px;border:1px solid #fecaca;border-radius:18px;padding:16px 18px;background-color:#fee2e2;">
                                    <p style="margin:0;font-size:14px;line-height:1.6;color:#991b1b;">
                                        <strong>{{ $customerNoticeTitle ?? 'Please note' }}:</strong>
                                        {{ $customerNotice }}
                                    </p>
                                </div>
                            @endif

                            @if (!empty($showCustomerDetails))
                                <h3 style="margin:22px 0 16px;font-size:18px;color:#111827;">Customer Contact</h3>
                                <div
                                    style="border:1px solid #e5e7eb;border-radius:18px;padding:22px;background-color:#ffffff;">
                                    <table role="presentation" cellpadding="0" cellspacing="0"
                                        style="width:100%;font-size:15px;color:#1f2937;">
                                        <tr>
                                            <td
                                                style="padding:10px 12px;width:35%;text-transform:uppercase;letter-spacing:0.06em;font-size:12px;color:#6b7280;">
                                                Name</td>
                                            <td style="padding:10px 12px;font-weight:600;color:#111827;">
                                                {{ $customerName }}</td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="padding:10px 12px;width:35%;text-transform:uppercase;letter-spacing:0.06em;font-size:12px;color:#6b7280;">
                                                Email</td>
                                            <td style="padding:10px 12px;color:#111827;">{{ $customerEmail }}</td>
                                        </tr>
                                        @if (!empty($customerPhone))
                                            <tr>
                                                <td
                                                    style="padding:10px 12px;width:35%;text-transform:uppercase;letter-spacing:0.06em;font-size:12px;color:#6b7280;">
                                                    Phone</td>
                                                <td style="padding:10px 12px;color:#111827;">{{ $customerPhone }}</td>
                                            </tr>
                                        @endif
                                    </table>
                                </div>
                            @endif
                        </td>
                    </tr>
                    @if (!empty($actionUrl))
                        <tr>
                            <td align="center" style="padding:0 40px 26px;">
                                <a href="{{ $actionUrl }}"
                                    style="display:inline-block;background-color:#0f9d58;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-weight:600;font-size:15px;">
                                    {{ $actionLabel ?? 'See Details' }}
                                </a>
                            </td>
                        </tr>
                    @endif

                    <tr>
                        <td style="background-color:#111827;color:#ffffff;padding:28px 40px;font-size:13px;">
                            <div style="display:flex;align-items:center;justify-content:center;position:relative;">
                                <div style="text-align:center;">
                                    <strong
                                        style="display:block;font-size:16px;letter-spacing:0.08em;text-transform:uppercase;">Luque
                                        Tires</strong>
                                    <span style="display:block;margin-top:6px;color:#d1d5db;font-size:13px;">Fast,
                                        reliable auto services for our community.</span>
                                    <a href="{{ url('/privacy-policy') }}"
                                        style="display:inline-block;margin-top:12px;color:#9ca3af;text-decoration:none;font-size:13px;">Privacy
                                        Policy</a>
                                </div>
                                <img src="{{ $footerLogoUrl ?? asset('images/logo.png') }}" alt="Luque Tires Logo"
                                    style="position:absolute;right:0;top:50%;transform:translateY(-50%);height:48px;width:auto;" />
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
