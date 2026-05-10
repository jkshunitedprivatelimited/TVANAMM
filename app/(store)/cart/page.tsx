import type { Metadata } from 'next';
import { StoreHeader } from '@/components/store/StoreHeader';
import { CartPageClient } from '@/components/store/CartPageClient';

export const metadata: Metadata = {
  title: 'Cart | T VANAMM Store',
  description: 'Review your cart items before checkout.',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <StoreHeader />
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <CartPageClient />
      </main>
    </div>
  );
}
