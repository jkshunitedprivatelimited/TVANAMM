import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/server';
import { notifyOrderPlaced } from '@/lib/notifications/orderNotifier';

/**
 * POST /api/store/webhooks/razorpay
 * 
 * Razorpay sends webhook events here when payment status changes.
 * This is a safety net — if the client-side verify fails (user closed browser),
 * this webhook will still mark the order as paid.
 * 
 * Razorpay expects a 200 response within 5 seconds.
 */
export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    // Step 1: Get raw body and signature header
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('[Razorpay Webhook] Missing x-razorpay-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Step 2: Verify webhook signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('[Razorpay Webhook] Invalid signature — possible tampering');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Step 3: Parse the verified payload
    const event = JSON.parse(rawBody) as RazorpayWebhookEvent;
    console.log(`[Razorpay Webhook] Event: ${event.event}, Payment: ${event.payload?.payment?.entity?.id}`);

    // Step 4: Handle payment.captured event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      if (!razorpayOrderId) {
        console.error('[Razorpay Webhook] No order_id in payment entity');
        return NextResponse.json({ status: 'skipped — no order_id' });
      }

      // Check if the order was already confirmed (client-side verify succeeded)
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id, order_number, payment_status, customer_id, total')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (!existingOrder) {
        console.error(`[Razorpay Webhook] No order found for razorpay_order_id: ${razorpayOrderId}`);
        return NextResponse.json({ status: 'order not found' });
      }

      // Already paid — skip (client-side verify handled it)
      if (existingOrder.payment_status === 'paid') {
        console.log(`[Razorpay Webhook] Order ${existingOrder.order_number} already paid — skipping`);
        return NextResponse.json({ status: 'already processed' });
      }

      // Update order to paid
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          razorpay_payment_id: razorpayPaymentId,
          payment_status: 'paid',
          status: 'confirmed',
        })
        .eq('id', existingOrder.id);

      if (updateError) {
        console.error('[Razorpay Webhook] DB update failed:', updateError.message);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
      }

      console.log(`[Razorpay Webhook] ✅ Order ${existingOrder.order_number} marked as paid via webhook`);

      // Send notification email (fire-and-forget)
      try {
        const { data: fullOrder } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('id', existingOrder.id)
          .single();

        const { data: orderItems } = await supabaseAdmin
          .from('order_items')
          .select('*')
          .eq('order_id', existingOrder.id);

        const { data: customer } = await supabaseAdmin
          .from('customers')
          .select('email, full_name, phone')
          .eq('id', existingOrder.customer_id)
          .single();

        if (fullOrder && orderItems && customer) {
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
            razorpay_payment_id: razorpayPaymentId,
          }).catch(console.error);
        }
      } catch (emailErr) {
        console.error('[Razorpay Webhook] Notification error (non-fatal):', emailErr);
      }
    }

    // Step 5: Handle payment.failed event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      if (razorpayOrderId) {
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
          })
          .eq('razorpay_order_id', razorpayOrderId)
          .eq('payment_status', 'pending'); // Only update if still pending

        console.log(`[Razorpay Webhook] ❌ Payment failed for razorpay_order_id: ${razorpayOrderId}`);
      }
    }

    // Always return 200 — Razorpay retries on non-2xx
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Razorpay Webhook] Unhandled error:', error);
    // Still return 200 to prevent Razorpay from retrying on parse errors
    return NextResponse.json({ status: 'error logged' });
  }
}

// ─── Types ───────────────────────────────────────────────────────
interface RazorpayPaymentEntity {
  id: string;
  order_id: string | null;
  amount: number;
  currency: string;
  status: string;
  method: string;
  email: string;
  contact: string;
}

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment: {
      entity: RazorpayPaymentEntity;
    };
  };
}
