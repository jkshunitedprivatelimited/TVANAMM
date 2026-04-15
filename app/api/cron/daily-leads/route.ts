import { NextResponse } from 'next/server';
import { getNewLeads } from '@/lib/supabase/queries';
import resend from '@/lib/email/resend';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Define the time range (previous 24 hours)
    // 6 AM IST = 12:30 AM UTC
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const startDate = twentyFourHoursAgo.toISOString();
    const endDate = now.toISOString();

    const leads = await getNewLeads(startDate, endDate);
    console.log(`[Daily Leads Cron] Found ${leads?.length || 0} leads between ${startDate} and ${endDate}`);

    if (!leads || leads.length === 0) {
      console.log('No new leads to report today.');
      return NextResponse.json({ message: 'No new leads to report today.' });
    }

    // Generate CSV
    const headers = ['Date', 'Full Name', 'Phone', 'Email', 'City', 'Message'];
    const csvRows = leads.map(lead => [
      format(new Date(lead.created_at), 'yyyy-MM-dd HH:mm:ss'),
      lead.full_name,
      lead.phone,
      lead.email,
      lead.city,
      lead.message?.replace(/,/g, ';').replace(/\n/g, ' ') || ''
    ].map(field => `"${field}"`).join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Send email with attachment
    const dateStr = format(now, 'dd-MM-yyyy');
    await resend.emails.send({
      from: process.env.SES_FROM_EMAIL || 'T VANAMM Reports <onboarding@resend.dev>',
      to: 'telecallers@tvanamm.com',
      subject: `Daily Lead Report - ${dateStr}`,
      text: `Please find the attached lead report for the last 24 hours.\n\nTotal New Leads: ${leads.length}`,
      attachments: [
        {
          filename: `t-vanamm-leads-${dateStr}.csv`,
          content: Buffer.from(csvContent),
        }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      count: leads.length,
      message: `Successfully sent report with ${leads.length} leads.`
    });

  } catch (error) {
    console.error('Daily leads report error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
