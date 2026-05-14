import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/UI';

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6">
          <span className="text-5xl">💰</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">SIP Tracker</h1>
        <p className="text-xl text-blue-100 mb-8">
          Portfolio Valuation System
        </p>
        <div className="space-y-3">
          <p className="text-blue-100">Redirecting...</p>
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
