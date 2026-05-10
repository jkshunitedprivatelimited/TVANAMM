'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Package,
  IndianRupee,
  ShoppingCart,
  Users,
  Clock,
  TrendingUp,
  Loader2,
  Truck,
  Check,
  Pencil,
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
}

function formatCurrency(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Transport charge state
  const [transportCharge, setTransportCharge] = useState<number>(250);
  const [transportInput, setTransportInput] = useState<string>('250');
  const [isEditingTransport, setIsEditingTransport] = useState(false);
  const [transportSaving, setTransportSaving] = useState(false);
  const [transportSaved, setTransportSaved] = useState(false);
  const [transportLoading, setTransportLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) return;

    // Fetch dashboard stats
    fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch transport charge setting
    fetch('/api/admin/settings', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          const amount = data?.transport_charge?.amount;
          if (typeof amount === 'number') {
            setTransportCharge(amount);
            setTransportInput(String(amount));
          }
        }
      })
      .catch(console.error)
      .finally(() => setTransportLoading(false));
  }, [session?.access_token]);

  const saveTransportCharge = async () => {
    if (!session?.access_token) return;

    const newAmount = Math.max(0, Math.round(Number(transportInput)));
    if (isNaN(newAmount)) return;

    setTransportSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          key: 'transport_charge',
          value: { amount: newAmount },
        }),
      });

      if (res.ok) {
        setTransportCharge(newAmount);
        setTransportInput(String(newAmount));
        setIsEditingTransport(false);
        setTransportSaved(true);
        setTimeout(() => setTransportSaved(false), 2000);
      }
    } catch (err) {
      console.error('[Admin] Transport charge save error:', err);
    } finally {
      setTransportSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#006437]" size={28} />
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: <IndianRupee size={20} />,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: "Today's Revenue",
      value: formatCurrency(stats?.todayRevenue || 0),
      icon: <TrendingUp size={20} />,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Total Orders',
      value: String(stats?.totalOrders || 0),
      icon: <ShoppingCart size={20} />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: "Today's Orders",
      value: String(stats?.todayOrders || 0),
      icon: <Package size={20} />,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Pending Orders',
      value: String(stats?.pendingOrders || 0),
      icon: <Clock size={20} />,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Total Customers',
      value: String(stats?.totalCustomers || 0),
      icon: <Users size={20} />,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your store performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Transport Charge Settings Card */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Settings</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-5 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Truck size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Transport Charge</p>
                <p className="text-xs text-gray-500">Applied to every order at checkout</p>
              </div>
            </div>
            {!isEditingTransport && (
              <button
                onClick={() => {
                  setIsEditingTransport(true);
                  setTransportInput(String(transportCharge));
                }}
                className="p-2 text-gray-400 hover:text-[#006437] hover:bg-green-50 rounded-lg transition-colors"
                title="Edit transport charge"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>

          {transportLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : isEditingTransport ? (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={transportInput}
                  onChange={(e) => setTransportInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTransportCharge();
                    if (e.key === 'Escape') {
                      setIsEditingTransport(false);
                      setTransportInput(String(transportCharge));
                    }
                  }}
                  autoFocus
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#006437]/20 focus:border-[#006437]"
                />
              </div>
              <button
                onClick={saveTransportCharge}
                disabled={transportSaving}
                className="px-4 py-2.5 bg-[#006437] text-white rounded-lg text-sm font-semibold hover:bg-[#005530] transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {transportSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingTransport(false);
                  setTransportInput(String(transportCharge));
                }}
                className="px-3 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-gray-900">₹{transportCharge}</p>
              {transportSaved && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full animate-in fade-in">
                  <Check size={12} /> Saved
                </span>
              )}
            </div>
          )}

          <p className="text-[11px] text-gray-400 mt-3">
            This amount is charged as transportation fee on every order placed through the store. Set to ₹0 for free shipping.
          </p>
        </div>
      </div>
    </div>
  );
}
