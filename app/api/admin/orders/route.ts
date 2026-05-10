import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/admin/orders
 * Returns paginated orders with optional status filter.
 */
export async function GET(request: Request) {
  const { isAdmin, error } = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const search = url.searchParams.get('search');
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('orders')
      .select(`
        id, order_number, status, subtotal, shipping_fee, discount, total,
        shipping_address, payment_method, payment_status, razorpay_payment_id,
        created_at, updated_at,
        customers!inner(full_name, email, phone),
        order_items(id, product_name, sku, quantity, unit_price, total_price, product_image)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%`);
    }

    const { data: orders, count, error: fetchError } = await query;

    if (fetchError) {
      console.error('[Admin Orders] Fetch error:', fetchError.message);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({
      orders: orders || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error('[Admin Orders] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
