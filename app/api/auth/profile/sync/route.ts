import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * POST /api/auth/profile/sync
 * Called by the client after OAuth login to ensure the 'customers' table has a row.
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token and get user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if customer profile exists
    const { data: existing } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!existing) {
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'Customer';

      await supabaseAdmin.from('customers').insert({
        auth_id: user.id,
        full_name: fullName,
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
      });
      
      console.log('[Profile Sync] Created customer profile for:', user.email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Profile Sync] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
