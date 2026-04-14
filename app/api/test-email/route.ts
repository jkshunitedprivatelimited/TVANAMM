import { NextResponse } from 'next/server';
import resend from '@/lib/email/resend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const adminEmail = process.env.SES_TO_EMAIL || 'tvanamm@gmail.com';
  const fromEmail = process.env.SES_FROM_EMAIL || 'no-reply@tvanamm.com';

  console.log('[Test Email API] Starting test send...');
  console.log(`[Test Email API] From: ${fromEmail}`);
  console.log(`[Test Email API] To: ${adminEmail}`);

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('[Test Email API] RESEND_API_KEY missing');
      return NextResponse.json({ 
        success: false, 
        error: 'RESEND_API_KEY is missing in environment variables' 
      }, { status: 500 });
    }

    const response = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      reply_to: adminEmail,
      subject: 'T Vanamm — Email Configuration Successful',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h1 style="color: #006437;">Resend Connectivity Test</h1>
          <p>This is a diagnostic test email to verify your email configuration.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Configured From:</strong> ${fromEmail}</p>
          <p><strong>Configured To:</strong> ${adminEmail}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN')}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">If you are seeing this email, it means:</p>
          <ul style="color: #666; font-size: 14px;">
            <li>Your Resend API Key is valid.</li>
            <li>Your domain <strong>${fromEmail.split('@')[1]}</strong> is verified in the Resend dashboard.</li>
            <li>The lead notification system should be working correctly.</li>
          </ul>
        </div>
      `,
    });

    if (response.error) {
      console.error('[Test Email API] Resend Error:', response.error);
      return NextResponse.json({ 
        success: false, 
        message: 'Resend returned an error. This usually means the domain is not verified.',
        error: response.error 
      }, { status: 500 });
    }

    console.log('[Test Email API] Test email sent successfully:', response.data);
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully! Please check ' + adminEmail,
      data: response.data 
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Test Email API] Catch block error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal error while sending test email',
      error: message 
    }, { status: 500 });
  }
}
