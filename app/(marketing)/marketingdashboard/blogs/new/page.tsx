import { PenSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BlogForm from '@/components/marketing/BlogForm';

export const metadata = {
  title: 'Write New Post | Marketing Dashboard',
};

export default function NewBlogPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="mb-6">
        <Link 
          href="/marketingdashboard/blogs" 
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blogs</span>
        </Link>
        <div className="flex items-center space-x-3">
          <PenSquare className="w-8 h-8 text-green-700" />
          <h1 className="text-3xl font-bold text-gray-900">Write New Post</h1>
        </div>
      </div>

      <BlogForm />
    </div>
  );
}
