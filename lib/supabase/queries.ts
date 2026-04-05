import { supabaseAdmin } from './admin';

export type FormType = 'franchise_enquiry' | 'franchise_application' | 'general_enquiry';

export interface InsertLeadParams {
  full_name: string;
  phone: string;
  email: string;
  city: string;
  message?: string;
  form_type: FormType;
  ip_address?: string;
}

export async function insertLead(data: InsertLeadParams) {
  const { error, data: insertedRow } = await supabaseAdmin
    .from('leads')
    .insert([
      {
        ...data,
      },
    ]);

  if (error) {
    console.error('Supabase inert error:', error);
    throw error;
  }

  return insertedRow;
}

export async function getNewLeads(startDate: string, endDate: string) {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }

  return data;
}
