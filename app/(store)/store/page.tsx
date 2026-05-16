import type { Metadata } from 'next';
import { getAllProducts, getAllProductCategories } from '@/lib/sanity/queries';
import { StoreHeader } from '@/components/store/StoreHeader';
import { ProductGrid } from '@/components/store/ProductGrid';

export const metadata: Metadata = {
  title: 'Shop | T VANAMM — Premium Teas & Coffees Online',
  description:
    'Browse and order premium teas, coffees, and beverages from T VANAMM. Fresh, authentic, and delivered across India with ₹250 flat shipping.',
  openGraph: {
    title: 'Shop T VANAMM — Premium Teas & Coffees Online',
    description:
      'Browse and order premium teas, coffees, and beverages from T VANAMM.',
  },
  alternates: { canonical: '/store' },
};

export default async function StorePage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllProductCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <StoreHeader />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900">
            Our Store
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Premium teas, coffees, and beverages — currently delivering in Hyderabad. More cities coming soon!
          </p>
        </div>

        {/* Product grid with search, category, and sort */}
        <ProductGrid
          products={products || []}
          categories={categories || []}
        />
      </main>

      {/* Store footer */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-12">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} T VANAMM. All rights reserved. A brand of JKSH United Private Limited.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            GST inclusive pricing • Delivering within Hyderabad • Expanding to more cities soon • Online payments via Razorpay
          </p>
        </div>
      </footer>
    </div>
  );
}
