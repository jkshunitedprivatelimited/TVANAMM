import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase/server';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Manual signup — creates Supabase Auth user + customer row.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = signupSchema.parse(body);

    // Create a Supabase client with anon key for signup
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.fullName,
          phone: validated.phone,
        },
      },
    });

    if (authError) {
      // Handle duplicate email
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 409 }
        );
      }
      console.error('[Signup API] Auth error:', authError.message);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // Step 2: Create customer profile (using service role to bypass RLS)
    const { error: profileError } = await supabaseAdmin.from('customers').insert({
      auth_id: authData.user.id,
      full_name: validated.fullName,
      email: validated.email,
      phone: validated.phone,
    });

    if (profileError) {
      console.error('[Signup API] Profile creation error:', profileError.message);
      // Auth user was created but profile failed — non-fatal, can retry via /auth/callback
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      // If email confirmation is enabled in Supabase, user needs to verify
      needsEmailConfirmation: !authData.session,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data.', details: error.issues },
        { status: 400 }
      );
    }
    console.error('[Signup API] Unhandled error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
