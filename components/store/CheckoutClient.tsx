'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Check,
  Shield,
  Truck,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

type CheckoutStep = 'address' | 'review' | 'payment';

// Razorpay type for window
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, itemCount, clearCart } = useCart();
  const { user, session, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<CheckoutStep>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [error, setError] = useState('');

  // Address form
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Telangana',
    pincode: '',
  });

  // Pre-fill name from auth
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Auto-pop sign-in modal if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuth(true);
    }
  }, [authLoading, user]);

  // Redirect to store if cart is empty
  if (!authLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={36} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add items to your cart before checking out.</p>
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

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate address
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(address.phone)) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!user || !session) {
      setShowAuth(true);
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Step 1: Create order + Razorpay order on server
      const res = await fetch('/api/store/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          items,
          shippingAddress: address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create order.');
        setIsProcessing(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'T VANAMM',
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: data.customerName || address.fullName,
          email: data.customerEmail || '',
          contact: data.customerPhone || address.phone,
        },
        theme: {
          color: '#006437',
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3: Verify payment on server
          try {
            const verifyRes = await fetch('/api/store/orders/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(`/order-success?order=${data.orderNumber}`);
            } else {
              setError(verifyData.error || 'Payment verification failed. Contact support if money was deducted.');
              setIsProcessing(false);
            }
          } catch {
            setError('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError('Payment was cancelled. You can try again.');
          },
        },
      };

      if (typeof window.Razorpay === 'undefined') {
        setError('Payment gateway is loading. Please try again in a moment.');
        setIsProcessing(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb steps */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/cart" className="text-gray-400 hover:text-[#006437] flex items-center gap-1">
            <ArrowLeft size={14} /> Cart
          </Link>
          <span className="text-gray-300">/</span>
          <span className={step === 'address' ? 'text-[#006437] font-semibold' : 'text-gray-400'}>
            Address
          </span>
          <span className="text-gray-300">/</span>
          <span className={step === 'review' ? 'text-[#006437] font-semibold' : 'text-gray-400'}>
            Review
          </span>
          <span className="text-gray-300">/</span>
          <span className={step === 'payment' ? 'text-[#006437] font-semibold' : 'text-gray-400'}>
            Payment
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Address Step */}
            {step === 'address' && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin size={20} className="text-[#006437]" />
                  <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
                </div>

                {!user && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-700">
                      Please{' '}
                      <button onClick={() => setShowAuth(true)} className="font-semibold underline">
                        sign in
                      </button>{' '}
                      to place your order. Your cart items will be saved.
                    </p>
                  </div>
                )}

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkout-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006437]/20 focus:border-[#006437] outline-none text-sm"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006437]/20 focus:border-[#006437] outline-none text-sm"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-address1" className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      id="checkout-address1"
                      type="text"
                      value={address.addressLine1}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006437]/20 focus:border-[#006437] outline-none text-sm"
                      placeholder="House/Flat No., Street, Area"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-address2" className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      id="checkout-address2"
                      type="text"
                      value={address.addressLine2}
                      onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006437]/20 focus:border-[#006437] outline-none text-sm"
                      placeholder="Landmark, Building Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="checkout-city" className="block text-sm font-medium text-gray-700 mb-1">
                        District *
                      </label>
                      <select
                        id="checkout-city"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006437]/20 focus:border-[#006437] outline-none text-sm bg-white appearance-none"
                      >
                        <option value="">Select district</option>
                        {[
                          'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad',
                          'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal',
                          'Kamareddy', 'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad',
                          'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak',
                          'Medchal–Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
                          'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli',
                          'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet',
                          'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal',
                          'Yadadri Bhuvanagiri',
                        ].map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="checkout-state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-700 flex items-center gap-2">
                        <span>Telangana</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006437" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                      <input type="hidden" name="state" value="Telangana" />
                    </div>
                    <div>
                      <label htmlFor="checkout-pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        id="checkout-pincode"
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        required
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006437]/20 focus:border-[#006437] outline-none text-sm"
                        placeholder="6-digit pincode"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!user}
                      className="w-full py-3.5 bg-[#006437] text-white rounded-xl font-semibold hover:bg-[#005530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Review
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-6">
                {/* Address summary */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <h3 className="font-semibold text-gray-900">Delivery Address</h3>
                    </div>
                    <button
                      onClick={() => setStep('address')}
                      className="text-sm text-[#006437] font-medium hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-0.5 pl-7">
                    <p className="font-medium text-gray-900">{address.fullName}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>Phone: {address.phone}</p>
                  </div>
                </div>

                {/* Items summary */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-[#006437]" />
                    Order Items ({itemCount})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.sanityId} className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place order button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#006437] text-white rounded-xl font-semibold hover:bg-[#005530] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Pay ₹{total}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar — Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Items ({itemCount})</span>
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
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Lock size={14} className="text-[#006437] flex-shrink-0" />
                  <span>Payments secured by Razorpay</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Shield size={14} className="text-[#006437] flex-shrink-0" />
                  <span>Your data is encrypted & safe</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Truck size={14} className="text-[#006437] flex-shrink-0" />
                  <span>Currently delivering in Hyderabad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} redirectTo="/checkout" />
    </>
  );
}
