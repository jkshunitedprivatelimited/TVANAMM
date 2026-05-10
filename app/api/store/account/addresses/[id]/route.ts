import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Verify address belongs to customer
    const { data: address } = await supabaseAdmin
      .from('addresses')
      .select('id')
      .eq('id', params.id)
      .eq('customer_id', customer.id)
      .single();

    if (!address) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    const body = await request.json();

    const { error: updateError } = await supabaseAdmin
      .from('addresses')
      .update({
        label: body.label,
        full_name: body.full_name,
        phone: body.phone,
        address_line1: body.address_line1,
        address_line2: body.address_line2 || null,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        is_default: body.is_default
      })
      .eq('id', params.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Address Update]', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}
