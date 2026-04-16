import Link from 'next/link';
import { client } from '@/lib/sanity/client';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { deleteBlogPost } from '../../_actions/blogActions';

export const metadata = {
  title: 'Manage Blogs | Marketing Dashboard',
};

async function getBlogs() {
  return await client.fetch(`*[_type == "blogPost"] | order(publishedAt desc){
    _id,
    title,
    category,
    author,
    "publishedAt": publishedAt
  }`);
}

export const revalidate = 0; // Prevent caching so dashboard is always fresh

export default async function BlogsDashboardPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        </div>
        
        <Link 
          href="/marketingdashboard/blogs/new" 
          className="flex items-center space-x-2 bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Write New Post</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">Post Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Published Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No blog posts found. Click &quot;Write New Post&quot; to start!
                  </td>
                </tr>
              )}
              {blogs.map((blog: Record<string, string>) => (
                <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{blog.title}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {blog.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{blog.author || 'T VANAMM'}</td>
                  <td className="px-6 py-4 text-gray-500" suppressHydrationWarning>
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-GB') : 'Draft'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteBlogPost.bind(null, blog._id)}>
                      <button 
                        type="submit" 
                        className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition"
                        title="Delete Post"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-gray-100">
          {blogs.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              No blog posts found.
            </div>
          )}
          {blogs.map((blog: Record<string, string>) => (
            <div key={blog._id} className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-semibold text-gray-900 leading-tight flex-1">{blog.title}</h3>
                <form action={deleteBlogPost.bind(null, blog._id)}>
                  <button 
                    type="submit" 
                    className="text-red-500 p-2 rounded-md bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                  {blog.category || 'Uncategorized'}
                </span>
                <span className="text-gray-500 text-xs" suppressHydrationWarning>
                  {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Draft'}
                </span>
              </div>
              
              <div className="text-xs text-gray-400">
                Author: {blog.author || 'T VANAMM'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
