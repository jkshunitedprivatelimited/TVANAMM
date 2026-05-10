import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.SES_TO_EMAIL || 'tvanamm@gmail.com';

/**
 * Verify the request is from an admin.
 * Checks the Authorization header and verifies the user's email matches the admin email.
 */
export async function verifyAdmin(request: Request): Promise<{ isAdmin: boolean; error?: string }> {
  const authHeader = request.headers.get('Authorization');

  // Support both Bearer token and Basic auth
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { isAdmin: false, error: 'Invalid token' };
    }

    // Check if user email matches admin
    if (user.email !== ADMIN_EMAIL) {
      return { isAdmin: false, error: 'Access denied' };
    }

    return { isAdmin: true };
  }

  // Basic auth fallback for API testing
  if (authHeader?.startsWith('Basic ')) {
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [email, password] = credentials.split(':');

    if (
      email === ADMIN_EMAIL &&
      password === (process.env.MARKETING_ADMIN_PASSWORD || 'admin')
    ) {
      return { isAdmin: true };
    }
    return { isAdmin: false, error: 'Invalid credentials' };
  }

  return { isAdmin: false, error: 'No authorization header' };
}

/**
 * Helper to get dashboard statistics.
 */
export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [
    { count: totalOrders },
    { count: todayOrders },
    { data: revenueData },
    { data: todayRevenueData },
    { count: pendingOrders },
    { count: totalCustomers },
  ] = await Promise.all([
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid'),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid').gte('created_at', todayISO),
    supabaseAdmin.from('orders').select('total').eq('payment_status', 'paid'),
    supabaseAdmin.from('orders').select('total').eq('payment_status', 'paid').gte('created_at', todayISO),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).in('status', ['placed', 'confirmed', 'processing', 'shipped']),
    supabaseAdmin.from('customers').select('*', { count: 'exact', head: true }),
  ]);

  const totalRevenue = revenueData?.reduce((sum: number, o: { total: number }) => sum + o.total, 0) || 0;
  const todayRevenue = todayRevenueData?.reduce((sum: number, o: { total: number }) => sum + o.total, 0) || 0;

  return {
    totalOrders: totalOrders || 0,
    todayOrders: todayOrders || 0,
    totalRevenue,
    todayRevenue,
    pendingOrders: pendingOrders || 0,
    totalCustomers: totalCustomers || 0,
  };
}
