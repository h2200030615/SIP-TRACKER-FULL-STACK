import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Card } from '@/components/UI';
import { Alert } from '@/components/Common';
import { authAPI } from '@/services';
import { setToken, isTokenValid } from '@/utils/helpers';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isTokenValid()) {
      router.push('/dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
      setSuccess('Login successful! Redirecting...');

      setTimeout(() => {
        if (user.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/investors');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SIP Tracker</h1>
          <p className="text-blue-100">Portfolio Valuation System</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>

          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
          )}

          {success && (
            <Alert type="success" message={success} className="mb-4" />
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="moulika@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
