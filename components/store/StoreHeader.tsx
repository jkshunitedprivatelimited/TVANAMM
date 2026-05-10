'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CartDrawer } from './CartDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { AccountMenu } from '@/components/auth/AccountMenu';

export function StoreHeader() {
  const { itemCount } = useCart();
  const { user, isLoading } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 py-2">
        <div className="w-full px-4 lg:px-8 flex items-center justify-between">
          {/* Left: Back + Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 text-gray-500 hover:text-[#006437] rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Back to main website"
            >
              <ArrowLeft size={20} />
            </Link>
            <Link href="/store" className="flex items-center gap-2" aria-label="T VANAMM Store">
              <Image
                src="/images/logo_gif.gif"
                alt="T VANAMM"
                width={40}
                height={40}
                className="object-contain"
                unoptimized
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-playfair font-bold text-lg text-[#006437] leading-tight">
                  T VANAMM
                </span>
                <span className="text-[10px] text-[#C8A96E] -mt-0.5 font-medium uppercase tracking-widest">
                  Store
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Auth + Cart */}
          <div className="flex items-center gap-2">
            {/* Auth */}
            {!isLoading && (
              <>
                {user ? (
                  <AccountMenu />
                ) : (
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#006437] rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}
              </>
            )}

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 text-gray-600 hover:text-[#006437] rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#006437] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
