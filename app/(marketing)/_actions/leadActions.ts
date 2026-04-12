'use server';

import { getAllLeads } from '@/lib/supabase/queries';

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  message: string | null;
  form_type: string;
  ip_address: string | null;
  created_at: string;
}

export async function fetchLeads(): Promise<Lead[]> {
  try {
    const data = await getAllLeads();
    return (data || []) as Lead[];
  } catch (error) {
    console.error('[fetchLeads] Error:', error);
    return [];
  }
}
