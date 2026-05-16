import Link from 'next/link';
import { StoreHeader } from '@/components/store/StoreHeader';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Visit T VANAMM homepage or explore our premium tea franchise opportunities.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthProvider>
        <CartProvider>
          <StoreHeader />
        </CartProvider>
      </AuthProvider>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl md:text-8xl font-playfair font-bold text-[#006437] mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 mb-4">
          Oops! That page seems to be missing.
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-base">
          The link you clicked may be broken, or the page may have been removed. Don't worry, there's plenty of premium tea and coffee waiting for you.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm mx-auto">
          <Link 
            href="/store"
            className="w-full sm:w-auto px-8 py-3 bg-[#006437] text-white rounded-full font-medium hover:bg-[#005530] transition-colors shadow-lg hover:shadow-xl"
          >
            Visit Our Store
          </Link>
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-white text-[#006437] rounded-full font-medium border border-[#006437]/20 hover:bg-gray-50 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
