import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AccountPageClient } from '@/components/store/AccountPageClient';
import { StoreHeader } from '@/components/store/StoreHeader';

export const metadata: Metadata = {
  title: 'My Account | T VANAMM Store',
  description: 'View your orders, manage addresses, and update your profile.',
};

export default function AccountPage() {
  return (
    <>
      <StoreHeader />
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>}>
          <AccountPageClient />
        </Suspense>
      </main>
    </>
  );
}
