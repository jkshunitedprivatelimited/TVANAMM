'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartItemRow } from './CartItem';

export function CartPageClient() {
  const { items, subtotal, shippingFee, total, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={36} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven&apos;t added any products yet. Browse our store to find premium teas and coffees.
        </p>
        <Link
          href="/store"
          className="flex items-center gap-2 px-6 py-3 bg-[#006437] text-white rounded-xl font-semibold hover:bg-[#005530] transition-colors"
        >
          <ArrowLeft size={16} />
          Browse Store
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-500 text-sm mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
          {items.map((item) => (
            <CartItemRow key={item.sanityId} item={item} />
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Transport</span>
                <span>₹{shippingFee}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>GST</span>
                <span className="text-green-600">Included</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full mt-6 py-3.5 bg-[#006437] text-white rounded-xl font-semibold hover:bg-[#005530] transition-colors"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/store"
              className="flex items-center justify-center gap-2 w-full mt-3 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>

            <p className="text-xs text-center text-gray-400 mt-4">
              Secure payment via Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
