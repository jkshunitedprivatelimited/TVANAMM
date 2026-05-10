import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/store/account/orders
 * Returns orders for the authenticated user.
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get customer ID
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!customer) {
      return NextResponse.json({ orders: [] });
    }

    // Fetch orders with item count
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, status, total, created_at, payment_status')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ orders: orders || [] });
  } catch (err) {
    console.error('[Account Orders] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
