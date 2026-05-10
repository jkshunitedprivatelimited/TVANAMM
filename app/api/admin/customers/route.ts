import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/admin/customers
 * Returns paginated customer list with order count.
 */
export async function GET(request: Request) {
  const { isAdmin, error } = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    const { data: customers, count, error: fetchError } = await supabaseAdmin
      .from('customers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }

    // Get order counts per customer
    const customerIds = (customers || []).map((c: { id: string }) => c.id);
    const { data: orderCounts } = await supabaseAdmin
      .from('orders')
      .select('customer_id')
      .in('customer_id', customerIds)
      .eq('payment_status', 'paid');

    const countMap: Record<string, number> = {};
    (orderCounts || []).forEach((o: { customer_id: string }) => {
      countMap[o.customer_id] = (countMap[o.customer_id] || 0) + 1;
    });

    const enriched = (customers || []).map((c: { id: string }) => ({
      ...c,
      order_count: countMap[c.id] || 0,
    }));

    return NextResponse.json({
      customers: enriched,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error('[Admin Customers] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
