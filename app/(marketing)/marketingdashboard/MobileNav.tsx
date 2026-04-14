'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Search, Users } from 'lucide-react';

const navItems = [
  {
    name: 'Home',
    href: '/marketingdashboard',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Blogs',
    href: '/marketingdashboard/blogs',
    icon: FileText
  },
  {
    name: 'SEO',
    href: '/marketingdashboard/seo',
    icon: Search
  },
  {
    name: 'Enquiries',
    href: '/marketingdashboard/leads',
    icon: Users
  }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 px-6 py-3 flex items-center justify-between safe-area-inset-bottom z-50">
      {navItems.map((item) => {
        const isActive = item.exact 
          ? pathname === item.href 
          : pathname.startsWith(item.href);
        
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
              isActive ? 'text-green-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-colors ${
              isActive ? 'bg-green-50' : 'bg-transparent'
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isActive ? 'opacity-100' : 'opacity-70'
            }`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
