'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  Package,
  MapPin,
  User,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  ShoppingBag,
  Phone,
  Edit2,
  Save,
  X,
} from 'lucide-react';

interface OrderSummary {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  payment_status: string;
  item_count: number;
}

interface Address {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

type Tab = 'orders' | 'addresses' | 'profile';

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  placed: { icon: <Clock size={14} />, color: 'text-amber-700', bg: 'bg-amber-50' },
  confirmed: { icon: <CheckCircle size={14} />, color: 'text-blue-700', bg: 'bg-blue-50' },
  processing: { icon: <Package size={14} />, color: 'text-indigo-700', bg: 'bg-indigo-50' },
  shipped: { icon: <Truck size={14} />, color: 'text-purple-700', bg: 'bg-purple-50' },
  delivered: { icon: <CheckCircle size={14} />, color: 'text-green-700', bg: 'bg-green-50' },
};

function formatCurrency(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function AccountPageClient() {
  const { user, session, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'orders';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);

    try {
      const [ordersRes, addressesRes] = await Promise.all([
        fetch('/api/store/account/orders', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }),
        fetch('/api/store/account/addresses', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }),
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }
      if (addressesRes.ok) {
        const data = await addressesRes.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('[Account] Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (session?.access_token) {
      fetchData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [session?.access_token, authLoading, fetchData]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#006437]" size={32} />
      </div>
    );
  }

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/store';
    }
  }, [user, authLoading]);

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#006437]" size={32} />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'orders', label: 'My Orders', icon: <Package size={18} /> },
    { key: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { key: 'profile', label: 'Profile', icon: <User size={18} /> },
  ];

  return (
    <div className="w-full px-4 lg:px-8 py-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user.fullName}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#006437] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-[#006437]" size={28} />
        </div>
      ) : (
        <>
          {activeTab === 'orders' && <OrdersTab orders={orders} />}
          {activeTab === 'addresses' && <AddressesTab addresses={addresses} onUpdate={fetchData} session={session} />}
          {activeTab === 'profile' && <ProfileTab user={user} />}
        </>
      )}
    </div>
  );
}

function OrdersTab({ orders }: { orders: OrderSummary[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 text-sm mb-6">
          When you place an order, it will appear here.
        </p>
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#006437] text-white rounded-xl font-semibold hover:bg-[#005530] transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const cfg = statusConfig[order.status] || statusConfig.placed;
        return (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{order.order_number}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                  >
                    {cfg.icon}
                    {order.status === 'processing' ? 'Packed' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function AddressesTab({ addresses, onUpdate, session }: { addresses: Address[]; onUpdate: () => void; session: any }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Address>>({});
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setEditForm(addr);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    if (!session?.access_token) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/store/account/addresses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setEditingId(null);
        onUpdate();
      } else {
        alert('Failed to update address');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="text-center py-16">
        <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved addresses</h3>
        <p className="text-gray-500 text-sm">
          Your delivery addresses will be saved here when you place an order.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addresses.map((addr) => {
        const isEditing = editingId === addr.id;

        return (
          <div
            key={addr.id}
            className={`bg-white rounded-xl border p-4 transition-all ${
              addr.is_default ? 'border-[#006437] ring-1 ring-[#006437]/20' : 'border-gray-100'
            }`}
          >
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">Edit Address</h4>
                  <button onClick={cancelEdit} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Label (e.g. Home)"
                    value={editForm.label || ''}
                    onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                    className="col-span-2 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006437]"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={editForm.full_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="col-span-2 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006437]"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="col-span-2 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006437]"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={editForm.address_line1 || ''}
                    onChange={(e) => setEditForm({ ...editForm, address_line1: e.target.value })}
                    className="col-span-2 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006437]"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={editForm.address_line2 || ''}
                    onChange={(e) => setEditForm({ ...editForm, address_line2: e.target.value })}
                    className="col-span-2 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006437]"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006437]"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={editForm.state || ''}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006437]"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={editForm.pincode || ''}
                    onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                    className="col-span-2 text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006437]"
                  />
                </div>
                <button
                  onClick={() => handleSave(addr.id)}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 bg-[#006437] text-white rounded-lg text-sm font-medium hover:bg-[#005530] transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#006437] bg-green-50 px-2 py-0.5 rounded-full uppercase">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="text-xs text-gray-400">Default</span>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(addr)}
                    className="text-gray-400 hover:text-[#006437] p-1 rounded-md transition-colors"
                    title="Edit Address"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{addr.full_name}</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {addr.address_line1}
                  {addr.address_line2 && `, ${addr.address_line2}`}
                  <br />
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-2">
                  <Phone size={14} className="text-gray-400" />
                  <span>{addr.phone}</span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProfileTab({ user }: { user: { fullName: string; email: string; phone: string; avatarUrl?: string } }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-4 mb-6">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.fullName || 'User Avatar'}
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16 rounded-full object-cover border-2 border-[#006437]"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#006437] text-white flex items-center justify-center text-2xl font-bold">
            {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-900">{user.fullName}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500">Full Name</span>
          <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500">Email</span>
          <span className="text-sm font-medium text-gray-900">{user.email}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-500">Phone</span>
          <span className="text-sm font-medium text-gray-900">{user.phone || 'Not provided'}</span>
        </div>
      </div>
    </div>
  );
}
