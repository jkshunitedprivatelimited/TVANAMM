import Link from 'next/link';
import { LayoutDashboard, FileText, Search, Users, LogOut } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MobileNav } from './MobileNav';

export default function MarketingDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function handleLogout() {
    'use server';
    cookies().delete('marketing_auth_token');
    redirect('/marketinglogin');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-20 flex flex-col justify-center px-6 bg-green-950">
          <span className="text-white font-bold text-base tracking-widest">T VANAMM</span>
          <span className="text-[#C8A96E] font-bold text-[10px] uppercase tracking-[0.2em] -mt-0.5">Marketing Dashboard</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link 
            href="/marketingdashboard" 
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-green-100 hover:bg-green-800 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Overview</span>
          </Link>
          
          <Link 
            href="/marketingdashboard/blogs" 
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-green-100 hover:bg-green-800 transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">Blog Posts</span>
          </Link>

          <Link 
            href="/marketingdashboard/seo" 
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-green-100 hover:bg-green-800 transition-colors"
          >
            <Search className="h-5 w-5" />
            <span className="font-medium">Global SEO</span>
          </Link>

          <Link 
            href="/marketingdashboard/leads" 
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-green-100 hover:bg-green-800 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Enquiries</span>
          </Link>
        </nav>

        <div className="p-4 bg-green-950">
          <form action={handleLogout}>
            <button 
              type="submit"
              className="flex w-full items-center justify-center space-x-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden">
          <div className="flex flex-col">
            <span className="text-green-900 font-bold text-base tracking-widest leading-tight">T VANAMM</span>
            <span className="text-[#006437] font-bold text-[10px] uppercase tracking-wider opacity-70">Marketing Dashboard</span>
          </div>
          <form action={handleLogout}>
            <button type="submit" className="text-gray-500 hover:text-red-600 transition-colors">
              <LogOut className="h-6 w-6" />
            </button>
          </form>
        </header>

        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>

        {/* Bottom Navigation for Mobile */}
        <MobileNav />
      </main>
    </div>
  );
}
