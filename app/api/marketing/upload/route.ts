import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const authCookie = cookies().get('marketing_auth_token');
    if (!authCookie || authCookie.value !== process.env.MARKETING_ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Sanity
    const asset = await client.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return NextResponse.json({ assetId: asset._id, url: asset.url });
  } catch (error: unknown) {
    console.error('Error uploading image to Sanity:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
