'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, MessageSquare, PhoneCall, Settings, LogOut, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic Client-Side Auth Check
    const token = localStorage.getItem('adminToken');
    
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (token && pathname === '/admin/login') {
      router.push('/admin');
    } else {
      // Small delay to prevent layout flashing
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // If on the login page, render only the content without sidebar/header
  if (pathname === '/admin/login') {
    return <main className="min-h-screen bg-background text-white">{children}</main>;
  }

  const getHeaderTitle = () => {
    switch (pathname) {
      case '/admin':
        return 'Dashboard Overview';
      case '/admin/leads':
        return 'Leads Management';
      case '/admin/chats':
        return 'AI Chat Histories';
      case '/admin/calls':
        return 'AI Call Records';
      case '/admin/settings':
        return 'Settings & API Config';
      default:
        return 'Admin Dashboard';
    }
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/admin/leads', label: 'Leads', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/chats', label: 'AI Chats', icon: <MessageSquare className="w-5 h-5" /> },
    { href: '/admin/calls', label: 'Call Logs', icon: <PhoneCall className="w-5 h-5" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex text-white">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-gray-800 flex flex-col pt-8 hidden md:flex">
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Moto Monk Admin</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium shadow-[inset_0_0_12px_rgba(249,115,22,0.05)] border border-primary/20'
                    : 'text-gray-400 border border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors border border-transparent text-left"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-gray-800 bg-card/50 flex items-center justify-between px-8 shrink-0">
          <h1 className="font-semibold text-lg">{getHeaderTitle()}</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>
        
        <main className="p-8 flex-grow bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}