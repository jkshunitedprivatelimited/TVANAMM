import React from 'react';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { insertLead, FormType } from '@/lib/supabase/queries';
import resend from '@/lib/email/resend';
import LeadNotificationEmail from '@/lib/email/templates/LeadNotification';
import UserConfirmationEmail from '@/lib/email/templates/UserConfirmation';

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
    limiter: Ratelimit.slidingWindow(20, "1 h"),
  });
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    
    // Step 1: Rate limiting
    if (ratelimit) {
      const { success } = await ratelimit.limit(`contact_${ip}`);
      if (!success) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
      }
    }

    // Step 2: Validate form data
    const body = await request.json();
    console.log('[Contact API] Received body:', JSON.stringify(body, null, 2));
    const validatedData = contactSchema.parse(body);

    // Step 3: Turnstile Verification (only if key is configured)
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

    // Step 4: Insert into Supabase
    console.log('[Contact API] Inserting lead into Supabase...');
    try {
      await insertLead({
        full_name: validatedData.fullName,
        phone: validatedData.phone,
        email: validatedData.email,
        city: validatedData.city,
        message: validatedData.message,
        form_type: validatedData.form_type as FormType,
        ip_address: ip,
      });
      console.log('[Contact API] Supabase insert successful.');
    } catch (supabaseError) {
      console.error('[Contact API] SUPABASE ERROR:', supabaseError);
      return NextResponse.json({ error: 'Failed to save your enquiry. Please try again.' }, { status: 500 });
    }

    // Step 5: Send emails (non-blocking - don't crash if emails fail)
    if (process.env.RESEND_API_KEY) {
      try {
        // Admin notification
        console.log('[Contact API] Sending admin notification email...');
        const adminRes = await resend.emails.send({
          from: process.env.SES_FROM_EMAIL || 'T Vanamm <onboarding@resend.dev>',
          to: process.env.SES_TO_EMAIL || 'tvanamm@gmail.com',
          reply_to: validatedData.email,
          subject: `New Franchise Lead — ${validatedData.fullName} from ${validatedData.city}`,
          react: LeadNotificationEmail({
            fullName: validatedData.fullName,
            phone: validatedData.phone,
            email: validatedData.email,
            city: validatedData.city,
            message: validatedData.message
          })
        });
        
        if (adminRes.error) {
          console.error('[Contact API] ADMIN EMAIL ERROR:', adminRes.error);
        } else {
          console.log('[Contact API] Admin email sent successfully:', adminRes.data?.id);
        }

        // User confirmation
        console.log('[Contact API] Sending user confirmation email...');
        const userRes = await resend.emails.send({
          from: process.env.SES_FROM_EMAIL || 'T Vanamm <onboarding@resend.dev>',
          to: validatedData.email,
          reply_to: process.env.SES_TO_EMAIL || 'tvanamm@gmail.com',
          subject: `Thank you for your interest in T Vanamm Franchise`,
          react: UserConfirmationEmail({
            fullName: validatedData.fullName
          })
        });

        if (userRes.error) {
          console.error('[Contact API] USER EMAIL ERROR:', userRes.error);
        } else {
          console.log('[Contact API] User email sent successfully:', userRes.data?.id);
        }
      } catch (emailError) {
        // Log email error but don't fail the request — the lead is already saved
        console.error('[Contact API] EMAIL ERROR (lead was still saved):', emailError);
      }
    } else {
      console.warn('[Contact API] RESEND_API_KEY missing, emails bypassed.');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Contact API] UNHANDLED ERROR:', error);
    if (error instanceof z.ZodError) {
      console.error('[Contact API] Zod validation errors:', error.issues);
      return NextResponse.json({ error: 'Invalid form data. Please check your inputs.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
