'use server';

import { getAllLeads, deleteLeadById } from '@/lib/supabase/queries';
import { revalidatePath } from 'next/cache';

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

export async function deleteLeadAction(id: string) {
  try {
    await deleteLeadById(id);
    revalidatePath('/marketingdashboard/leads');
    return { success: true };
  } catch (error) {
    console.error('[deleteLeadAction] Error:', error);
    return { success: false, error: 'Failed to delete enquiry' };
  }
}
