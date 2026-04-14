import { NextResponse } from 'next/server';
import { getAllLeads } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leads = await getAllLeads();
    
    return NextResponse.json({
      success: true,
      total_leads: leads?.length || 0,
      recent_leads: leads?.slice(0, 10).map(l => ({
        id: l.id,
        name: l.full_name,
        email: l.email,
        city: l.city,
        type: l.form_type,
        created_at: l.created_at
      }))
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Check Leads API] Error:', error);
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}
