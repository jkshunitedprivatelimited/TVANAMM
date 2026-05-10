'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle size={48} className="text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">
          Thank you for shopping with T VANAMM.
        </p>

        {orderNumber && (
          <div className="inline-flex items-center gap-2 bg-gray-100 px-5 py-2.5 rounded-full mb-6">
            <Package size={16} className="text-[#006437]" />
            <span className="text-sm font-mono font-semibold text-gray-800">
              {orderNumber}
            </span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-[#006437]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#006437]">1</span>
              </div>
              <span>You&apos;ll receive an order confirmation email shortly with your invoice.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-[#006437]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#006437]">2</span>
              </div>
              <span>Our team will prepare your order with care and pack it fresh.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-[#006437]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#006437]">3</span>
              </div>
              <span>Your order will be delivered within Hyderabad. We&apos;re expanding to more cities soon!</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/store"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#006437] text-white rounded-xl font-semibold hover:bg-[#005530] transition-colors"
          >
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            View My Orders
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
