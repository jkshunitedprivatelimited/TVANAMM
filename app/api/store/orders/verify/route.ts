import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyRazorpaySignature } from '@/lib/razorpay/verify';
import { supabaseAdmin } from '@/lib/supabase/server';
import { notifyOrderPlaced } from '@/lib/notifications/orderNotifier';

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  orderId: z.string().uuid(),
});

/**
 * POST /api/store/orders/verify
 * Verify Razorpay payment signature and mark order as paid.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = verifySchema.parse(body);

    // Step 1: Verify Razorpay signature
    const isValid = verifyRazorpaySignature({
      orderId: validated.razorpay_order_id,
      paymentId: validated.razorpay_payment_id,
      signature: validated.razorpay_signature,
    });

    if (!isValid) {
      console.error('[Payment Verify] Invalid signature for order:', validated.razorpay_order_id);
      return NextResponse.json(
        { error: 'Payment verification failed. Please contact support.' },
        { status: 400 }
      );
    }

    // Step 2: Update order in Supabase
    const { data: order, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        razorpay_payment_id: validated.razorpay_payment_id,
        razorpay_signature: validated.razorpay_signature,
        payment_status: 'paid',
        status: 'placed',
      })
      .eq('id', validated.orderId)
      .eq('razorpay_order_id', validated.razorpay_order_id)
      .select('id, order_number, total, customer_id')
      .single();

    if (updateError || !order) {
      console.error('[Payment Verify] DB update failed:', updateError?.message);
      return NextResponse.json(
        { error: 'Order update failed. Payment was successful — please contact support.' },
        { status: 500 }
      );
    }

    // Step 3: Trigger notifications (email) in background
    console.log(`[Payment Verify] Order ${order.order_number} confirmed. Total: ₹${order.total / 100}`);

    // Fetch full order details for email
    try {
      const { data: fullOrder } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', order.id)
        .single();

      const { data: orderItems } = await supabaseAdmin
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('email, full_name, phone')
        .eq('id', order.customer_id)
        .single();

      if (fullOrder && orderItems && customer) {
        // Fire-and-forget (don't block the response)
        notifyOrderPlaced({
          id: fullOrder.id,
          order_number: fullOrder.order_number,
          customer_email: customer.email,
          customer_name: customer.full_name,
          customer_phone: customer.phone,
          items: orderItems,
          subtotal: fullOrder.subtotal,
          shipping_fee: fullOrder.shipping_fee,
          total: fullOrder.total,
          shipping_address: fullOrder.shipping_address,
          created_at: fullOrder.created_at,
          payment_status: fullOrder.payment_status,
          razorpay_payment_id: validated.razorpay_payment_id,
        }).catch(console.error);
      }
    } catch (emailErr) {
      // Non-fatal — order is still confirmed even if email fails
      console.error('[Payment Verify] Notification error:', emailErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payment data.' }, { status: 400 });
    }
    console.error('[Payment Verify] Unhandled:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
