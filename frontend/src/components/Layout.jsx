import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">💰</span>
          </div>
          <span className="font-bold text-lg text-gray-900 hidden sm:inline">SIP Tracker</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <span className="text-gray-600 text-sm">Welcome back!</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-error hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {showMenu && (
        <div className="md:hidden border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-error hover:bg-red-50 rounded-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export const Sidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Investors', path: '/investors', icon: '👥' },
    { name: 'Mutual Funds', path: '/funds', icon: '📈' },
    { name: 'SIP Registration', path: '/sips', icon: '💳' },
    { name: 'Transactions', path: '/transactions', icon: '📋' },
    { name: 'Portfolio', path: '/portfolio', icon: '💼' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 left-4 z-50 p-2 bg-primary text-white rounded-full shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } md:w-64 bg-gray-900 text-white transition-all duration-300 fixed md:relative h-screen overflow-hidden z-40`}
      >
        <div className="p-6 border-b border-gray-800">
          <h2 className="font-bold text-xl">SIP Tracker</h2>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-3 rounded-lg transition ${
                router.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  setIsOpen(false);
                }
              }}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
