import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import resend from '@/lib/email/resend';
import LeadNotificationEmail from '@/lib/email/templates/LeadNotification';
import UserConfirmationEmail from '@/lib/email/templates/UserConfirmation';
import { render } from '@react-email/components';

const contactSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^(?:\+91|91)?[6-9]\d{9}$/),
  email: z.string().email(),
  city: z.string().min(2),
  message: z.string().optional(),
  form_type: z.enum(['franchise_enquiry', 'franchise_application', 'general_enquiry']),
  turnstileToken: z.string().optional(),
});

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
  });
}

// Background email sender — does NOT block the response
function sendEmailsInBackground(validatedData: {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  message?: string;
}) {
  // Fire and forget — runs after response is already sent
  Promise.all([
    render(LeadNotificationEmail({
      fullName: validatedData.fullName,
      phone: validatedData.phone,
      email: validatedData.email,
      city: validatedData.city,
      message: validatedData.message,
    })).then(html => resend.emails.send({
      from: process.env.SES_FROM_EMAIL || 'T VANAMM <no-reply@tvanamm.com>',
      to: process.env.SES_TO_EMAIL || 'tvanamm@gmail.com',
      replyTo: validatedData.email,
      subject: `New Franchise Lead — ${validatedData.fullName} from ${validatedData.city}`,
      html: html,
    })),
    render(UserConfirmationEmail({
      fullName: validatedData.fullName,
    })).then(html => resend.emails.send({
      from: process.env.SES_FROM_EMAIL || 'T VANAMM <no-reply@tvanamm.com>',
      to: validatedData.email,
      replyTo: process.env.SES_TO_EMAIL || 'tvanamm@gmail.com',
      subject: `Thank you for your interest in T VANAMM Franchise`,
      html: html,
    })),
  ]).then(results => {
    results.forEach((result, i) => {
      const type = i === 0 ? 'ADMIN' : 'USER';
      if (result.error) {
        console.error(`[Contact API] ${type} EMAIL ERROR:`, result.error);
      } else {
        console.log(`[Contact API] ${type} email sent:`, result.data?.id);
      }
    });
  }).catch(err => {
    console.error('[Contact API] EMAIL BACKGROUND ERROR:', err);
  });
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';

    // Step 1: Rate limiting (anti-spam)
    if (ratelimit) {
      const { success } = await ratelimit.limit(`contact_${ip}`);
      if (!success) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
      }
    }

    // Step 2: Validate form data
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Step 3: Turnstile verification (only if configured)
    if (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY) {
      if (!validatedData.turnstileToken) {
        return NextResponse.json({ error: 'Security token is required' }, { status: 400 });
      }
      const formData = new FormData();
      formData.append('secret', process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY);
      formData.append('response', validatedData.turnstileToken);
      formData.append('remoteip', ip);

      const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        body: formData,
        method: 'POST',
      });

      const outcome = await result.json();
      if (!outcome.success) {
        return NextResponse.json({ error: 'Security verification failed. Please try again.' }, { status: 403 });
      }
    }

    // Step 4: Fire emails in background — DON'T wait for them
    if (process.env.RESEND_API_KEY) {
      sendEmailsInBackground(validatedData);
    } else {
      console.warn('[Contact API] RESEND_API_KEY missing — emails skipped.');
    }

    // Step 5: Return success IMMEDIATELY
    return NextResponse.json({ success: true });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data. Please check your inputs.' }, { status: 400 });
    }
    console.error('[Contact API] UNHANDLED ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
