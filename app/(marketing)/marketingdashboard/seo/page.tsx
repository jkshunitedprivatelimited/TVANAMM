import { client } from '@/lib/sanity/client';
import { updateSeoSettings } from '../../_actions/seoActions';
import { Settings } from 'lucide-react';
import SEOImageUploaderInput from '@/components/marketing/SEOImageUploaderInput';

export const metadata = {
  title: 'Global SEO Settings | Marketing',
};

async function getSiteSettings() {
  return await client.fetch(`*[_type == "siteSettings"][0]{
    defaultSeoTitle,
    defaultSeoDescription,
    seoKeywords
  }`);
}

export default async function SEODashboardPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-3 mb-8">
        <Settings className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">Global SEO</h1>
      </div>

      <form action={async (formData) => { 'use server'; await updateSeoSettings(formData); }} className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div className="space-y-2 text-sm text-gray-600 pb-4 border-b border-gray-100">
          These settings tell Google and other search engines what your website is about. They act as the default fallback for all pages.
        </div>

        <div className="space-y-2">
          <label htmlFor="defaultSeoTitle" className="block text-sm font-semibold text-gray-900">
            Default SEO Title
          </label>
          <input 
            type="text" 
            id="defaultSeoTitle" 
            name="defaultSeoTitle" 
            defaultValue={settings?.defaultSeoTitle || ''}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2.5 px-3 border" 
            placeholder="e.g. T VANAMM | India's Best Tea Franchise" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="defaultSeoDescription" className="block text-sm font-semibold text-gray-900">
            Global Meta Description
          </label>
          <textarea 
            id="defaultSeoDescription" 
            name="defaultSeoDescription" 
            rows={3} 
            defaultValue={settings?.defaultSeoDescription || ''}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2.5 px-3 border" 
            placeholder="A compelling description of your business..." 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="seoKeywords" className="block text-sm font-semibold text-gray-900">
            Target Keywords
          </label>
          <p className="text-xs text-gray-500">Enter keywords, putting one keyword phrase per line (press enter after each phrase).</p>
          <textarea 
            id="seoKeywords" 
            name="seoKeywords" 
            rows={5} 
            defaultValue={settings?.seoKeywords?.join('\n') || ''}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2.5 px-3 border" 
            placeholder="tea shop franchise&#10;best tea cafe&#10;business opportunity" 
          />
        </div>

        <SEOImageUploaderInput />

        <div className="pt-6 flex justify-end">
          <button 
            type="submit" 
            className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            Save Default SEO
          </button>
        </div>
      </form>
    </div>
  );
}
