import type { Metadata } from 'next';
import { StoreHeader } from '@/components/store/StoreHeader';
import { OrderSuccessClient } from '@/components/store/OrderSuccessClient';

export const metadata: Metadata = {
  title: 'Order Confirmed | T VANAMM Store',
  description: 'Your order has been placed successfully.',
};

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <StoreHeader />
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <OrderSuccessClient />
      </main>
    </div>
  );
}
