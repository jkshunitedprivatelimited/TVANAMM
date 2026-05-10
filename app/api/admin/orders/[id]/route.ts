import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendOrderStatusEmail } from '@/lib/notifications/orderNotifier';

/**
 * PATCH /api/admin/orders/[id]
 * Update order status and notify customer.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { isAdmin, error } = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update order status
    const { data: order, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select('id, order_number, customer_id, status')
      .single();

    if (updateError || !order) {
      console.error('[Admin Order Update Error]:', updateError);
      return NextResponse.json({ 
        error: 'Order not found or update failed', 
        details: updateError 
      }, { status: 500 }); // Changed to 500 to differentiate from Next.js built-in 404
    }

    // Send email notification to customer
    try {
      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('email, full_name')
        .eq('id', order.customer_id)
        .single();

      if (customer) {
        sendOrderStatusEmail(
          customer.email,
          customer.full_name,
          order.order_number,
          status
        ).catch(console.error);
      }
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('[Admin Status Update] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/orders/[id]
 * Permanently delete an order and its items.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAdmin, error: authError } = await verifyAdmin(request);

    if (!isAdmin) {
      return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Delete order_items first, then the order
    await supabaseAdmin.from('order_items').delete().eq('order_id', id);

    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('[Admin Order Delete]', deleteError);
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Admin Order Delete] Exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
