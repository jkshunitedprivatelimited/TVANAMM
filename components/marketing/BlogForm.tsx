'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import { createBlogPost } from '@/app/(marketing)/_actions/blogActions';

export default function BlogForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [thumbnailAssetId, setThumbnailAssetId] = useState<string>('');
  const [ogImageAssetId, setOgImageAssetId] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    if (thumbnailAssetId) {
      formData.append('thumbnailAssetId', thumbnailAssetId);
    }
    if (ogImageAssetId) {
      formData.append('ogImageAssetId', ogImageAssetId);
    }

    const result = await createBlogPost(formData);
    
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/marketing-dashboard/blogs');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Post Title</label>
          <input required type="text" id="title" name="title" className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border" placeholder="e.g. 5 Reasons to Start a Tea Franchise" />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input required type="text" id="category" name="category" className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border bg-white" placeholder="e.g. Franchise Tips, News, Insights" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author Name</label>
        <input required type="text" id="author" name="author" className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border" placeholder="e.g. T Vanamm Team" />
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Short Summary (Excerpt)</label>
        <textarea required id="excerpt" name="excerpt" rows={2} className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border" placeholder="A brief 1-2 sentence description snippet." />
      </div>

      <div className="space-y-2">
        <ImageUploader label="Post Thumbnail Image" onUploadSuccess={(assetId) => setThumbnailAssetId(assetId)} />
        {thumbnailAssetId && <p className="text-sm text-green-600">✓ Image ready</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body Content</label>
        <p className="text-xs text-gray-500 mb-2">Double enter to create a new paragraph. Simple text only for now.</p>
        <textarea required id="body" name="body" rows={12} className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border font-sans" placeholder="Write your full article here..." />
      </div>

      <div className="pt-6 pb-2 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Per-Post SEO Settings</h3>
        <p className="text-xs text-gray-500">How this specific post appears on Google and Social Media.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">Meta Title (Optional)</label>
        <input type="text" id="metaTitle" name="metaTitle" className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border" placeholder="e.g. 5 Tea Franchise Tips | T Vanamm" />
      </div>

      <div className="space-y-2">
        <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">Meta Description (Optional)</label>
        <textarea id="metaDescription" name="metaDescription" rows={2} className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-2 px-3 border" placeholder="Targeted search engine snippet..." />
      </div>

      <div className="space-y-2">
        <ImageUploader label="Open Graph Image (Social Media Share Image)" onUploadSuccess={(assetId) => setOgImageAssetId(assetId)} />
        {ogImageAssetId && <p className="text-sm text-green-600">✓ SEO Image ready</p>}
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
        </button>
      </div>
    </form>
  );
}
