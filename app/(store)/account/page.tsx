import type { Metadata } from 'next';
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
        <AccountPageClient />
      </main>
    </>
  );
}
