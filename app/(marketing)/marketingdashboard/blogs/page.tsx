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
        <div className="overflow-x-auto">
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
                    No blog posts found. Click "Write New Post" to start!
                  </td>
                </tr>
              )}
              {blogs.map((blog: any) => (
                <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{blog.title}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {blog.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{blog.author || 'T Vanamm'}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={async () => {
                      'use server';
                      await deleteBlogPost(blog._id);
                    }}>
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
      </div>
    </div>
  );
}
