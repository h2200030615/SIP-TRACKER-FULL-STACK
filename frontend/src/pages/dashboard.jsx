'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Users,
  PieChart as PieChartIcon,
  BarChart3,
  Bell,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet,
  Target,
  Award,
} from 'lucide-react';
import { Card, Button, Badge, Table, Input } from '@/components/UI';
import { Alert } from '@/components/Common';
import { investorAPI, fundAPI, sipAPI } from '@/services';
import { formatCurrency, formatDate, removeToken } from '@/utils/helpers';

// Dummy data for charts
const monthlyInvestmentData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 67000 },
];

const portfolioDistribution = [
  { name: 'SBI Bluechip', value: 35 },
  { name: 'HDFC Balanced', value: 40 },
  { name: 'ICICI Debt', value: 25 },
];

const amcInvestmentData = [
  { amc: 'SBI', amount: 150000 },
  { amc: 'HDFC', amount: 180000 },
  { amc: 'ICICI', amount: 120000 },
  { amc: 'Axis', amount: 95000 },
  { amc: 'Kotak', amount: 80000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const activityTimeline = [
  {
    id: 1,
    type: 'investor_added',
    description: 'New investor moulika added to the system',
    timestamp: '2 hours ago',
    icon: Users,
  },
  {
    id: 2,
    type: 'sip_registered',
    description: 'SIP registered for SBI Bluechip Fund - ₹5,000/month',
    timestamp: '4 hours ago',
    icon: Target,
  },
  {
    id: 3,
    type: 'nav_updated',
    description: 'NAV updated for HDFC Balanced Fund - ₹56.20',
    timestamp: '6 hours ago',
    icon: TrendingUp,
  },
  {
    id: 4,
    type: 'transaction_processed',
    description: 'SIP transaction processed - 2.5 units allocated',
    timestamp: '8 hours ago',
    icon: Wallet,
  },
];

const Dashboard = () => {
  const router = useRouter();
  const [investors, setInvestors] = useState([]);
  const [funds, setFunds] = useState([]);
  const [sips, setSips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [investorsRes, fundsRes, sipsRes] = await Promise.all([
        investorAPI.getAll(),
        fundAPI.getAll(),
        sipAPI.getAll(),
      ]);

      setInvestors(investorsRes.data || []);
      setFunds(fundsRes.data || []);
      setSips(sipsRes.data || []);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const activeSIPs = sips.filter(
    (sip) => sip.status?.toLowerCase() === 'active'
  ).length;

  const totalSIPAmount = sips.reduce((sum, sip) => sum + (sip.sip_amount || 0), 0);
  const totalPortfolioValue = funds.reduce(
    (sum, fund) => sum + (fund.nav || fund.latest_nav || 0),
    0
  );

  const stats = [
    {
      title: 'Total Investors',
      value: investors.length,
      growth: '+12.5%',
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Mutual Funds',
      value: funds.length,
      growth: '+8.2%',
      icon: Award,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Active SIPs',
      value: activeSIPs,
      growth: '+15.3%',
      icon: Target,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Monthly SIP Collection',
      value: formatCurrency(totalSIPAmount),
      growth: '+5.7%',
      icon: DollarSign,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(totalPortfolioValue),
      growth: '+9.4%',
      icon: Wallet,
      color: 'bg-pink-500',
      lightColor: 'bg-pink-100',
      textColor: 'text-pink-600',
    },
    {
      title: 'Investor Net Worth',
      value: formatCurrency(totalPortfolioValue * 100),
      growth: '+18.2%',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
    },
  ];

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navbar */}
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40 shadow-sm`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              💰 SIP Tracker
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-6">
            <div className={`relative ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center px-4 py-2`}>
              <Search size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <input
                type="text"
                placeholder="Search..."
                className={`bg-transparent ml-2 w-full outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className={`relative p-2 rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}>
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  moulika
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Administrator
                </p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-64 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} min-h-[calc(100vh-80px)] p-6 fixed left-0 top-20 shadow-lg`}>
            <nav className="space-y-2">
              {[
                { label: 'Dashboard', icon: BarChart3 },
                { label: 'Investors', icon: Users },
                { label: 'Mutual Funds', icon: Award },
                { label: 'SIP Registrations', icon: Target },
                { label: 'SIP Transactions', icon: Wallet },
                { label: 'Portfolio Valuation', icon: PieChartIcon },
                { label: 'Reports', icon: TrendingUp },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    item.label === 'Dashboard'
                      ? `${darkMode ? 'bg-blue-600' : 'bg-blue-50'} text-blue-600`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </nav>

            <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition text-red-600 hover:${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : ''} p-8 transition-margin duration-300`}>
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-6"
            />
          )}

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        {stat.title}
                      </p>
                      <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value}
                      </h3>
                      <div className="flex items-center gap-1 mt-2">
                        <ArrowUpRight size={16} className="text-green-500" />
                        <span className="text-sm text-green-500 font-medium">{stat.growth}</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div className={`${stat.lightColor} p-3 rounded-lg`}>
                      <Icon size={24} className={stat.textColor} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Line Chart */}
            <Card className={`p-6 lg:col-span-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Monthly SIP Investments
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyInvestmentData}>
                  <CartesianGrid stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#fff',
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Pie Chart */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Portfolio Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={portfolioDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card className={`p-6 mb-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AMC-wise Investment Amounts
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={amcInvestmentData}>
                <CartesianGrid stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#10b981" name="Investment Amount" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent SIP Transactions Table */}
          <Card className={`p-6 mb-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent SIP Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Investor Name
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Fund Name
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      SIP Amount
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      NAV
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Units
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sips.slice(0, 5).map((sip, index) => (
                    <tr
                      key={index}
                      className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} transition`}
                    >
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {sip.investor_name || 'N/A'}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {funds.find((f) => f.fund_id === sip.fund_id)?.fund_name || 'N/A'}
                      </td>
                      <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {formatCurrency(sip.sip_amount)}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        ₹{(funds.find((f) => f.fund_id === sip.fund_id)?.nav || 0).toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {(sip.sip_amount / (funds.find((f) => f.fund_id === sip.fund_id)?.nav || 1)).toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {sip.start_date ? formatDate(sip.start_date) : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            sip.status?.toLowerCase() === 'active'
                              ? 'success'
                              : sip.status?.toLowerCase() === 'paused'
                                ? 'warning'
                                : 'error'
                          }
                        >
                          {sip.status || 'Unknown'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Portfolio Overview & Top Funds */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Portfolio Overview */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Portfolio Overview
              </h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    Total Invested Amount
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(totalSIPAmount * 12)}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    Current Market Value
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(totalPortfolioValue * 1000)}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    Profit/Loss
                  </p>
                  <p className={`text-2xl font-bold text-green-600`}>
                    +{formatCurrency((totalPortfolioValue * 1000) - (totalSIPAmount * 12))}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    ROI Percentage
                  </p>
                  <p className={`text-2xl font-bold text-green-600`}>+18.5%</p>
                </div>
              </div>
            </Card>

            {/* Top Performing Funds */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Top Performing Funds
              </h3>
              <div className="space-y-4">
                {funds.map((fund, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {fund.fund_name}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {fund.amc_name}
                        </p>
                      </div>
                      <Badge variant={fund.risk_level?.toLowerCase() === 'high' ? 'error' : fund.risk_level?.toLowerCase() === 'medium' ? 'warning' : 'success'}>
                        {fund.risk_level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Current NAV
                        </p>
                        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ₹{(fund.nav || fund.latest_nav || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Returns
                        </p>
                        <p className="text-lg font-bold text-green-600">+12.5%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Activity Timeline
            </h3>
            <div className="space-y-4">
              {activityTimeline.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className={`flex gap-4 pb-4 ${index !== activityTimeline.length - 1 ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'}`}>
                      <Icon size={20} className={index % 2 === 0 ? 'text-blue-600' : 'text-green-600'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activity.description}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

