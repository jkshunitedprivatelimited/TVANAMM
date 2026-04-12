'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';

export default function SEOImageUploaderInput() {
  const [assetId, setAssetId] = useState<string>('');

  return (
    <div className="space-y-2">
      <input type="hidden" name="ogImageAssetId" value={assetId} />
      <span className="block text-sm font-semibold text-gray-900">
        Global Open Graph Image (For Social Media Previews)
      </span>
      <p className="text-xs text-gray-500 mb-2">This image appears when people share your link on WhatsApp, Facebook, or Twitter.</p>
      <ImageUploader label="" onUploadSuccess={(id) => setAssetId(id)} />
    </div>
  );
}
