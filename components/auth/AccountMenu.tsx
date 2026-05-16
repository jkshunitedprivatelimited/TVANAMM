'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Package, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

/**
 * Account dropdown menu — shown in navbar when user is logged in.
 * Displays user avatar/initial with dropdown for orders, addresses, logout.
 */
export function AccountMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initial = user.fullName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.fullName || 'User Avatar'}
            width={32}
            height={32}
            unoptimized
            className="w-8 h-8 rounded-full object-cover border-2 border-[#006437]"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#006437] text-white flex items-center justify-center font-semibold text-sm">
            {initial}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          {/* User info */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Package size={16} className="text-gray-400" />
              My Orders
            </Link>
            <Link
              href="/account?tab=addresses"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <MapPin size={16} className="text-gray-400" />
              My Addresses
            </Link>
            <Link
              href="/account?tab=profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={16} className="text-gray-400" />
              Profile
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={async () => {
                await signOut();
                setOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
