import { fetchLeads } from '@/app/(marketing)/_actions/leadActions';
import { LeadsTable } from '@/app/(marketing)/marketingdashboard/leads/LeadsTable';

export const metadata = {
  title: 'Enquiries | T VANAMM Marketing Dashboard',
};

export const revalidate = 0;

export default async function LeadsPage() {
  const leads = await fetchLeads();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries & Downloads</h1>
          <p className="text-gray-500 text-sm mt-1">
            All franchise enquiries and brochure download requests from the website.
          </p>
        </div>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
