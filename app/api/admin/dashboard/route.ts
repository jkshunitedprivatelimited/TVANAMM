import { NextResponse } from 'next/server';
import { verifyAdmin, getDashboardStats } from '@/lib/admin/auth';

/**
 * GET /api/admin/dashboard
 * Returns aggregated dashboard statistics.
 */
export async function GET(request: Request) {
  const { isAdmin, error } = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error('[Admin Dashboard] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
