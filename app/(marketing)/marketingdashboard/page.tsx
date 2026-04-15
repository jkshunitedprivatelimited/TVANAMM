import Link from 'next/link';
import { PenSquare, FileText, Settings, Users } from 'lucide-react';

export const metadata = {
  title: 'T VANAMM Marketing Dashboard',
};

export default function MarketingDashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        Welcome to T VANAMM Dashboard
      </h1>
      <p className="text-gray-600 text-sm md:text-base max-w-2xl">
        Manage your website&apos;s content and SEO directly from this dashboard. Changes made here will immediately reflect on the live website.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link href="/marketingdashboard/blogs/new" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PenSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Write a Post</h3>
          <p className="text-sm text-gray-500 mt-2">Draft and publish a new article to the blog.</p>
        </Link>

        <Link href="/marketingdashboard/blogs" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Manage Content</h3>
          <p className="text-sm text-gray-500 mt-2">View, edit, or delete existing blog posts.</p>
        </Link>

        <Link href="/marketingdashboard/seo" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Global SEO Settings</h3>
          <p className="text-sm text-gray-500 mt-2">Update global meta descriptions and main keywords.</p>
        </Link>

        <Link href="/marketingdashboard/leads" className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group">
          <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Enquiries</h3>
          <p className="text-sm text-gray-500 mt-2">View all franchise enquiries and brochure requests. Export to Excel.</p>
        </Link>
      </div>
    </div>
  );
}
