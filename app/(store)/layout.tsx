import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Shop T VANAMM | Premium Teas & Coffees Online',
  description:
    'Shop premium teas, coffees, and beverages from T VANAMM. Fresh, authentic, and delivered to your doorstep across India.',
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
