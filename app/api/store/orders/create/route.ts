import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getRazorpay } from '@/lib/razorpay/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { getProductsByIds } from '@/lib/sanity/queries';

const DEFAULT_SHIPPING_FEE = 250; // fallback in rupees

const cartItemSchema = z.object({
  sanityId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string(),
  price: z.number().positive(),
  originalPrice: z.number().positive(),
  quantity: z.number().int().positive(),
  weight: z.string().optional(),
  sku: z.string().min(1),
  maxStock: z.number().int().positive(),
});

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^(?:\+91|91)?[6-9]\d{9}$/),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
});

const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  shippingAddress: addressSchema,
});

/**
 * POST /api/store/orders/create
 * 1. Authenticate user
 * 2. Validate cart items against Sanity (prices, stock)
 * 3. Calculate totals server-side
 * 4. Create Razorpay order
 * 5. Save pending order in Supabase
 * 6. Return razorpay_order_id to client
 */
export async function POST(request: Request) {
  try {
    // Step 1: Authenticate
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Please sign in to place an order.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
    }

    // Get customer record
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id, email, full_name, phone')
      .eq('auth_id', user.id)
      .single();

    if (!customer) {
      return NextResponse.json({ error: 'Customer profile not found.' }, { status: 404 });
    }

    // Step 2: Validate request body
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    // Step 3: Verify prices against Sanity (never trust client prices)
    const sanityIds = validated.items.map((i) => i.sanityId);
    const sanityProducts = await getProductsByIds(sanityIds);

    if (!sanityProducts || sanityProducts.length !== validated.items.length) {
      return NextResponse.json(
        { error: 'Some products are no longer available. Please refresh your cart.' },
        { status: 400 }
      );
    }

    // Build verified items with server-side prices
    let subtotalPaise = 0;
    const verifiedItems = validated.items.map((clientItem) => {
      const sanityProduct = sanityProducts.find(
        (p: { _id: string }) => p._id === clientItem.sanityId
      );

      if (!sanityProduct) {
        throw new Error(`Product ${clientItem.sanityId} not found in Sanity`);
      }

      if (!sanityProduct.inStock || sanityProduct.stockQuantity < clientItem.quantity) {
        throw new Error(`${sanityProduct.name} is out of stock or insufficient quantity`);
      }

      // Use server-side price (salePrice if available, otherwise price)
      const serverPrice =
        sanityProduct.salePrice && sanityProduct.salePrice < sanityProduct.price
          ? sanityProduct.salePrice
          : sanityProduct.price;

      const unitPricePaise = Math.round(serverPrice * 100);
      const totalPricePaise = unitPricePaise * clientItem.quantity;
      subtotalPaise += totalPricePaise;

      return {
        product_sanity_id: clientItem.sanityId,
        product_name: sanityProduct.name || clientItem.name,
        product_image: sanityProduct.images || clientItem.image,
        sku: sanityProduct.sku || clientItem.sku,
        quantity: clientItem.quantity,
        unit_price: unitPricePaise,
        total_price: totalPricePaise,
      };
    });

    // Fetch transport charge from store settings (admin-configurable)
    let shippingFeeRupees = DEFAULT_SHIPPING_FEE;
    try {
      const { data: setting } = await supabaseAdmin
        .from('store_settings')
        .select('value')
        .eq('key', 'transport_charge')
        .single();

      if (setting?.value && typeof setting.value === 'object' && 'amount' in setting.value) {
        shippingFeeRupees = Number((setting.value as { amount: number }).amount);
      }
    } catch {
      console.warn('[Order Create] Could not fetch transport charge, using default ₹' + DEFAULT_SHIPPING_FEE);
    }

    const shippingPaise = shippingFeeRupees * 100;
    const totalPaise = subtotalPaise + shippingPaise;

    // Step 4: Generate order number
    const { data: orderNumResult } = await supabaseAdmin.rpc('generate_order_number');
    const orderNumber = orderNumResult || `TV-${Date.now()}`;

    // Step 5: Create Razorpay order
    const razorpayOrder = await getRazorpay().orders.create({
      amount: totalPaise,
      currency: 'INR',
      receipt: orderNumber,
      notes: {
        customer_id: customer.id,
        customer_email: customer.email,
        order_number: orderNumber,
      },
    });

    // Step 6: Save order in Supabase (pending payment)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customer.id,
        status: 'placed',
        subtotal: subtotalPaise,
        shipping_fee: shippingPaise,
        discount: 0,
        tax: 0,
        total: totalPaise,
        shipping_address: validated.shippingAddress,
        payment_method: 'razorpay',
        razorpay_order_id: razorpayOrder.id,
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('[Order Create] DB error:', orderError?.message);
      return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
    }

    // Step 7: Save order items
    const orderItems = verifiedItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[Order Create] Items DB error:', itemsError.message);
    }

    // Step 8: Save shipping address if user doesn't have one
    const { data: existingAddress } = await supabaseAdmin
      .from('addresses')
      .select('id')
      .eq('customer_id', customer.id)
      .limit(1)
      .single();

    if (!existingAddress) {
      await supabaseAdmin.from('addresses').insert({
        customer_id: customer.id,
        label: 'Home',
        full_name: validated.shippingAddress.fullName,
        phone: validated.shippingAddress.phone,
        address_line1: validated.shippingAddress.addressLine1,
        address_line2: validated.shippingAddress.addressLine2 || null,
        city: validated.shippingAddress.city,
        state: validated.shippingAddress.state,
        pincode: validated.shippingAddress.pincode,
        is_default: true,
      });
    }

    // Return Razorpay details to client
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: totalPaise,
      currency: 'INR',
      customerEmail: customer.email,
      customerName: customer.full_name,
      customerPhone: customer.phone,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid order data. Please check your cart and address.' },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      console.error('[Order Create] Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('[Order Create] Unhandled:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
