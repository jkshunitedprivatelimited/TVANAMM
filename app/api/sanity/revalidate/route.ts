import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

// Sanity webhook secret — must match the secret configured in Sanity's webhook settings
const SANITY_WEBHOOK_SECRET = process.env.SANITY_REVALIDATE_SECRET;

// Map Sanity document types to Next.js cache tags
const TYPE_TO_TAGS: Record<string, string[]> = {
  homePage: ['homePage'],
  aboutPage: ['aboutPage'],
  galleryPage: ['galleryPage'],
  blogPost: ['blogPosts', 'blogPost'],
  contactPage: ['contactPage'],
  siteSettings: ['siteSettings'],
};

export async function POST(req: NextRequest) {
  try {
    // If no secret is configured, skip signature validation (dev mode)
    // In production, ALWAYS set SANITY_REVALIDATE_SECRET
    if (!SANITY_WEBHOOK_SECRET) {
      console.warn(
        '⚠️  SANITY_REVALIDATE_SECRET is not set — accepting webhook without signature verification'
      );

      const body = await req.json();
      const { _type } = body;

      if (!_type) {
        return NextResponse.json(
          { message: 'No _type in body' },
          { status: 400 }
        );
      }

      const tags = TYPE_TO_TAGS[_type] || [_type];
      for (const tag of tags) {
        revalidateTag(tag);
      }

      return NextResponse.json({
        revalidated: true,
        tags,
        now: Date.now(),
      });
    }

    // Production: verify webhook signature
    const { isValidSignature, body } = await parseBody<{
      _type: string;
      slug?: { current?: string };
    }>(req, SANITY_WEBHOOK_SECRET);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: 'Bad request — no _type found' },
        { status: 400 }
      );
    }

    const tags = TYPE_TO_TAGS[body._type] || [body._type];
    for (const tag of tags) {
      revalidateTag(tag);
    }

    console.log(`✅ Revalidated tags: [${tags.join(', ')}] for type: ${body._type}`);

    return NextResponse.json({
      revalidated: true,
      tags,
      now: Date.now(),
    });
  } catch (err) {
    console.error('Sanity revalidation error:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}
