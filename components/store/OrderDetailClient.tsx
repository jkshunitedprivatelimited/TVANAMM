'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  CreditCard,
  Phone,
} from 'lucide-react';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface FullOrder {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipping_address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  payment_status: string;
  razorpay_payment_id: string;
  created_at: string;
  items: OrderItem[];
}

const statusSteps = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];

const statusIcons: Record<string, React.ReactNode> = {
  placed: <Clock size={16} />,
  confirmed: <CheckCircle size={16} />,
  processing: <Package size={16} />,
  shipped: <Truck size={16} />,
  delivered: <CheckCircle size={16} />,
  cancelled: <XCircle size={16} />,
};

function formatCurrency(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderDetailClient() {
  const params = useParams();
  const orderId = params?.id as string;
  const { session, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<FullOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !session) {
      window.location.href = '/store';
      return;
    }

    if (!session?.access_token || !orderId) return;

    fetch(`/api/store/account/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load order');
        const data = await res.json();
        setOrder(data.order);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session, authLoading, orderId]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#006437]" size={32} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 px-4">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
        <p className="text-gray-500 text-sm mb-6">{error || 'This order does not exist.'}</p>
        <Link href="/account" className="text-[#006437] font-semibold hover:underline">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  const addr = order.shipping_address;

  return (
    <div className="w-full px-4 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006437] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to My Orders
      </Link>

      {/* Order Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{order.order_number}</h1>
            <p className="text-sm text-gray-400 mt-1">{formatDate(order.created_at)}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#006437]">{formatCurrency(order.total)}</p>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => {
              const isActive = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                      isActive
                        ? isCurrent
                          ? 'bg-[#006437] text-white ring-4 ring-green-100'
                          : 'bg-[#006437] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {statusIcons[step]}
                  </div>
                  <span
                    className={`text-[10px] font-medium capitalize ${
                      isActive ? 'text-[#006437]' : 'text-gray-400'
                    }`}
                  >
                    {step === 'processing' ? 'packed' : step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <XCircle className="text-red-500" size={20} />
          <p className="text-sm text-red-700 font-medium">This order has been cancelled.</p>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Items Ordered</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  SKU: {item.sku} • Qty: {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{formatCurrency(item.total_price)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="text-gray-900">{formatCurrency(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-2 mt-2">
            <span className="text-gray-900">Total</span>
            <span className="text-[#006437]">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-[#006437]" />
            <h3 className="text-sm font-semibold text-gray-900">Delivery Address</h3>
          </div>
          <p className="text-sm font-medium text-gray-900">{addr.fullName}</p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {addr.addressLine1}
            {addr.addressLine2 && `, ${addr.addressLine2}`}
            <br />
            {addr.city}, {addr.state} - {addr.pincode}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-2">
            <Phone size={14} className="text-gray-400" />
            <span>{addr.phone}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} className="text-[#006437]" />
            <h3 className="text-sm font-semibold text-gray-900">Payment Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="text-gray-900">Razorpay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </span>
            </div>
            {order.razorpay_payment_id && (
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID</span>
                <span className="text-gray-900 text-xs font-mono">{order.razorpay_payment_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
