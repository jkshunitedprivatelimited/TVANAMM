import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '@/lib/sanity/queries';
import { StoreHeader } from '@/components/store/StoreHeader';
import { ProductDetailClient } from '@/components/store/ProductDetail';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.seoTitle || `${product.name} | T VANAMM Store`,
    description:
      product.seoDescription ||
      product.shortDescription ||
      `Buy ${product.name} from T VANAMM. Premium quality, delivered fresh.`,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.name,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return (products || []).map((p: { slug: { current: string } }) => ({
    slug: p.slug.current,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.shortDescription || product.seoDescription,
            image: product.images?.[0],
            sku: product.sku,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: product.salePrice && product.salePrice < product.price ? product.salePrice : product.price,
              availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: `https://tvanamm.com/store/${product.slug}`,
            },
          }),
        }}
      />
      <StoreHeader />
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <ProductDetailClient product={product} />
      </main>
    </div>
  );
}
