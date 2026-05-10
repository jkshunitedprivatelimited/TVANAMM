import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/store/settings
 * Public endpoint — returns store settings needed by the storefront.
 * Currently returns transport_charge.
 * Uses a fresh Supabase client each time to avoid any module-level caching.
 */
export async function GET() {
  try {
    // Create a fresh client to avoid any cached connections
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('store_settings')
      .select('key, value')
      .in('key', ['transport_charge']);

    if (error) {
      console.error('[Store Settings] Fetch error:', error.message);
      return NextResponse.json(
        { transport_charge: { amount: 250 } },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    const settings: Record<string, unknown> = {};
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    // Ensure transport_charge always has a default
    if (!settings.transport_charge) {
      settings.transport_charge = { amount: 250 };
    }

    console.log('[Store Settings] Returning:', JSON.stringify(settings));

    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('[Store Settings] Unhandled:', error);
    return NextResponse.json(
      { transport_charge: { amount: 250 } },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }
}
