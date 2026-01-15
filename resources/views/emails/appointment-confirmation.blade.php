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
                            <img src="{{ url('images/logo_black.png') }}" alt="{{ $companyName }} Logo"
                                style="display:block;height:100px;width:auto;" />
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 40px 20px;color:#111827;">
                            <p style="margin:0 0 12px;font-size:16px;">Hi <strong>Luque Tires Team</strong>,</p>
                            <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4b5563;">
                                A new service appointment has been booked and is ready for your review. Please find the
                                customer and appointment details below so you can prepare the bay and notify the
                                technicians.
                            </p>

                            <h3 style="margin:0 0 16px;font-size:18px;color:#111827;">Appointment Details</h3>
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
                                    @if ($estimatedPrice)
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
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:0 40px 26px;">
                            <a href="{{ $manageUrl }}"
                                style="display:inline-block;background-color:#0f9d58;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-weight:600;font-size:15px;">
                                See Details
                            </a>
                        </td>
                    </tr>

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
                                <img src="{{ asset('images/logo.png') }}" alt="Luque Tires Logo"
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
