import type { Metadata } from 'next';
import { OrderDetailClient } from '@/components/store/OrderDetailClient';
import { StoreHeader } from '@/components/store/StoreHeader';

export const metadata: Metadata = {
  title: 'Order Details | T VANAMM Store',
  description: 'View your order details, items, and tracking status.',
};

export default function OrderDetailPage() {
  return (
    <>
      <StoreHeader />
      <main className="min-h-screen bg-gray-50">
        <OrderDetailClient />
      </main>
    </>
  );
}
