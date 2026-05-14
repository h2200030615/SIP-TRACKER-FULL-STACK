import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isTokenValid } from '@/utils/helpers';

export const withAuth = (Component) => {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
      const checkAuth = () => {
        if (!isTokenValid()) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      };

      checkAuth();
    }, []);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};

export const withLayout = (Component) => {
  const WithLayoutComponent = (props) => {
    const { Navbar, Sidebar } = require('@/components/Layout');

    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-8">
              <Component {...props} />
            </div>
          </main>
        </div>
      </div>
    );
  };

  return WithLayoutComponent;
};

export const withAuthAndLayout = (Component) => {
  return withAuth(withLayout(Component));
};
