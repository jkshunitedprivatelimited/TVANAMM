import type { Metadata } from 'next';
import { StoreHeader } from '@/components/store/StoreHeader';
import { CheckoutClient } from '@/components/store/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout | T VANAMM Store',
  description: 'Complete your order and pay securely via Razorpay.',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <StoreHeader />
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <CheckoutClient />
      </main>
    </div>
  );
}
