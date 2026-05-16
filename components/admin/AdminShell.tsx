'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ADMIN_EMAIL = 'tvanamm@gmail.com';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/orders', label: 'Orders', icon: <Package size={18} /> },
  { href: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, session, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Compute authorization — during testing, any signed-in user can access
  const authorized = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const userEmail = user?.email;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#006437] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={28} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm mb-4">
            {!user
              ? 'You are not signed in. Please sign in with the admin account first on the store page.'
              : `Signed in as "${userEmail}" — admin access requires "${ADMIN_EMAIL}".`}
          </p>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006437] text-white rounded-xl font-semibold hover:bg-[#005530] transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Go to Store & Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-100 fixed inset-y-0">
        <div className="p-6 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="T VANAMM Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <p className="font-bold text-gray-900 text-sm">T VANAMM</p>
              <p className="text-[10px] text-[#C8A96E] uppercase tracking-widest">Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#006437] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            href="/store"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-[#006437] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 hover:text-gray-900">
          <Menu size={20} />
        </button>
        <p className="font-bold text-gray-900 text-sm">T VANAMM Admin</p>
        <div className="w-9" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-bold text-gray-900">Admin Menu</p>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#006437] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
