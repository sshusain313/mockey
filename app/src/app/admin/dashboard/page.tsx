'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';

// Define types for analytics data
interface UserAnalytics {
  totalUsers: number;
  newUsers: number;
  subscriptionBreakdown: {
    free: number;
    pro: number;
    lifetime: number;
  };
  signupsByDate: Array<{ _id: string; count: number }>;
}

interface DownloadAnalytics {
  totalDownloads: number;
  downloadsByDate: Array<{ _id: string; count: number }>;
}

interface ProductAnalytics {
  totalProducts: number;
  newProducts: number;
  productsByCategory: Array<{ _id: string; count: number }>;
}

interface RevenueAnalytics {
  estimatedMonthlyRevenue: number;
  estimatedLifetimeRevenue: number;
  estimatedTotalRevenue: number;
}

interface AnalyticsData {
  userAnalytics: UserAnalytics;
  downloadAnalytics: DownloadAnalytics;
  productAnalytics: ProductAnalytics;
  revenueAnalytics: RevenueAnalytics;
}

// Define types for user data
interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'user';
  subscription: 'free' | 'pro' | 'lifetime';
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsError, setAnalyticsError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30');
  const [activeTab, setActiveTab] = useState('users');
  const [exportLoading, setExportLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    api: 'healthy',
    database: 'healthy',
    storage: 'healthy',
    lastChecked: new Date().toISOString()
  });

  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const SUBSCRIPTION_COLORS = {
    free: '#00C49F',
    pro: '#0088FE',
    lifetime: '#FFBB28'
  };

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/'); // Redirect non-admin users
      } else {
        // Fetch users data
        fetchUsers();
        fetchAnalyticsData(analyticsPeriod);
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin'); // Redirect unauthenticated users
    }
  }, [status, session, router]);

  // Filter users when search term or subscription filter changes
  useEffect(() => {
    if (users.length > 0) {
      let filtered = [...users];
      
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(term) || 
          user.email.toLowerCase().includes(term)
        );
      }
      
      // Apply subscription filter
      if (subscriptionFilter !== 'all') {
        filtered = filtered.filter(user => user.subscription === subscriptionFilter);
      }
      
      setFilteredUsers(filtered);
    }
  }, [searchTerm, subscriptionFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async (period: string) => {
    try {
      setAnalyticsLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err: any) {
      setAnalyticsError(err.message || 'An error occurred while fetching analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };
  
  const toggleUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      setUpdatingUserId(userId);
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }
      
      // Refresh the users list after successful update
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const updateUserSubscription = async (userId: string, subscriptionType: 'free' | 'pro' | 'lifetime') => {
    try {
      setUpdatingUserId(userId);
      const response = await fetch('/api/admin/subscriptions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, subscriptionType }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user subscription');
      }
      
      // Refresh the users list and analytics after successful update
      fetchUsers();
      fetchAnalyticsData(analyticsPeriod);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating user subscription');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const exportData = async (dataType: 'users' | 'analytics') => {
    try {
      setExportLoading(true);
      
      let dataToExport;
      let filename;
      
      if (dataType === 'users') {
        dataToExport = users.map(user => ({
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
          createdAt: new Date(user.createdAt).toLocaleDateString()
        }));
        filename = 'users-export.json';
      } else {
        dataToExport = analyticsData;
        filename = 'analytics-export.json';
      }
      
      // Create a blob and download link
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
    } finally {
      setExportLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Prepare chart data
  const prepareSignupData = () => {
    if (!analyticsData) return [];
    
    return analyticsData.userAnalytics.signupsByDate.map(item => ({
      date: item._id,
      signups: item.count
    }));
  };

  const prepareDownloadData = () => {
    if (!analyticsData) return [];
    
    return analyticsData.downloadAnalytics.downloadsByDate.map(item => ({
      date: item._id,
      downloads: item.count
    }));
  };

  const prepareSubscriptionData = () => {
    if (!analyticsData) return [];
    
    const { free, pro, lifetime } = analyticsData.userAnalytics.subscriptionBreakdown;
    return [
      { name: 'Free', value: free, color: SUBSCRIPTION_COLORS.free },
      { name: 'Pro', value: pro, color: SUBSCRIPTION_COLORS.pro },
      { name: 'Lifetime', value: lifetime, color: SUBSCRIPTION_COLORS.lifetime }
    ];
  };

  const prepareCategoryData = () => {
    if (!analyticsData) return [];
    
    return analyticsData.productAnalytics.productsByCategory.map((item, index) => ({
      name: item._id,
      value: item.count,
      color: COLORS[index % COLORS.length]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Mockey Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>{session?.user?.name}</span>
            <Link href="/" className="text-sm hover:underline">
              Back to Site
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Dashboard Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('users')}
          >
            User Analytics
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'revenue' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('revenue')}
          >
            Revenue Analytics
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('products')}
          >
            Product Usage
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'management' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('management')}
          >
            User Management
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'system' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('system')}
          >
            System Status
          </button>
        </div>

        {/* Analytics Period Selector */}
        {activeTab !== 'management' && activeTab !== 'system' && (
          <div className="mb-6 flex items-center">
            <label htmlFor="period" className="mr-2 text-sm font-medium text-gray-700">Time Period:</label>
            <select
              id="period"
              value={analyticsPeriod}
              onChange={(e) => {
                setAnalyticsPeriod(e.target.value);
                fetchAnalyticsData(e.target.value);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            
            <button
              onClick={() => exportData('analytics')}
              disabled={exportLoading || !analyticsData}
              className="ml-auto px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 flex items-center"
            >
              {exportLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  Exporting...
                </>
              ) : (
                <>Export Analytics</>
              )}
            </button>
          </div>
        )}

        {/* User Analytics Tab */}
        {activeTab === 'users' && (
          <>
            {analyticsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : analyticsError ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{analyticsError}</div>
            ) : analyticsData ? (
              <>
                {/* User Analytics Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                    <p className="text-3xl font-bold">{analyticsData.userAnalytics.totalUsers}</p>
                    <p className="text-sm text-green-600 mt-2">
                      +{analyticsData.userAnalytics.newUsers} new in selected period
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Pro Users</h2>
                    <p className="text-3xl font-bold">{analyticsData.userAnalytics.subscriptionBreakdown.pro}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {((analyticsData.userAnalytics.subscriptionBreakdown.pro / analyticsData.userAnalytics.totalUsers) * 100).toFixed(1)}% of total users
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Lifetime Pro Users</h2>
                    <p className="text-3xl font-bold">{analyticsData.userAnalytics.subscriptionBreakdown.lifetime}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {((analyticsData.userAnalytics.subscriptionBreakdown.lifetime / analyticsData.userAnalytics.totalUsers) * 100).toFixed(1)}% of total users
                    </p>
                  </div>
                </div>

                {/* User Signups Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">User Signups Over Time</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareSignupData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="signups" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Subscription Breakdown Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Subscription Breakdown</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareSubscriptionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepareSubscriptionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}

        {/* Revenue Analytics Tab */}
        {activeTab === 'revenue' && (
          <>
            {analyticsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : analyticsError ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{analyticsError}</div>
            ) : analyticsData ? (
              <>
                {/* Revenue Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Monthly Revenue (MRR)</h2>
                    <p className="text-3xl font-bold">${analyticsData.revenueAnalytics.estimatedMonthlyRevenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Based on {analyticsData.userAnalytics.subscriptionBreakdown.pro} Pro subscribers
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Lifetime Revenue</h2>
                    <p className="text-3xl font-bold">${analyticsData.revenueAnalytics.estimatedLifetimeRevenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      From {analyticsData.userAnalytics.subscriptionBreakdown.lifetime} Lifetime Pro users
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
                    <p className="text-3xl font-bold">${analyticsData.revenueAnalytics.estimatedTotalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Combined monthly and lifetime revenue
                    </p>
                  </div>
                </div>

                {/* Revenue by Subscription Type */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Revenue by Subscription Type</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Monthly (Pro)', value: analyticsData.revenueAnalytics.estimatedMonthlyRevenue },
                          { name: 'Lifetime Pro', value: analyticsData.revenueAnalytics.estimatedLifetimeRevenue }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Revenue']} />
                        <Legend />
                        <Bar dataKey="value" name="Revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Payments (Placeholder) */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
                  <p className="text-gray-500 italic">
                    Payment data integration is in progress. This section will display recent payment transactions once integrated.
                  </p>
                </div>
              </>
            ) : null}
          </>
        )}

        {/* Product Usage Tab */}
        {activeTab === 'products' && (
          <>
            {analyticsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : analyticsError ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{analyticsError}</div>
            ) : analyticsData ? (
              <>
                {/* Product Usage Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Total Products</h2>
                    <p className="text-3xl font-bold">{analyticsData.productAnalytics.totalProducts}</p>
                    <p className="text-sm text-green-600 mt-2">
                      +{analyticsData.productAnalytics.newProducts} new in selected period
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Total Downloads</h2>
                    <p className="text-3xl font-bold">{analyticsData.downloadAnalytics.totalDownloads}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Across all users and products
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Avg. Downloads per User</h2>
                    <p className="text-3xl font-bold">
                      {analyticsData.userAnalytics.totalUsers > 0 
                        ? (analyticsData.downloadAnalytics.totalDownloads / analyticsData.userAnalytics.totalUsers).toFixed(1) 
                        : '0'}
                    </p>
                  </div>
                </div>

                {/* Downloads Over Time Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Downloads Over Time</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareDownloadData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="downloads" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Products by Category Chart */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Products by Category</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareCategoryData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepareCategoryData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Download Limits by Subscription */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Download Limits by Subscription</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Download Limit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Free</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">10 downloads</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{analyticsData.userAnalytics.subscriptionBreakdown.free}</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Pro</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">100 downloads</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{analyticsData.userAnalytics.subscriptionBreakdown.pro}</div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Lifetime Pro</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Unlimited</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{analyticsData.userAnalytics.subscriptionBreakdown.lifetime}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}

        {/* User Management Tab */}
        {activeTab === 'management' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">User Management</h2>
              
              {/* Search and Filter Controls */}
              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="md:w-1/4">
                  <label htmlFor="subscription-filter" className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
                  <select
                    id="subscription-filter"
                    value={subscriptionFilter}
                    onChange={(e) => setSubscriptionFilter(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="all">All Subscriptions</option>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="lifetime">Lifetime Pro</option>
                  </select>
                </div>
                <div className="md:w-auto flex items-end">
                  <button
                    onClick={() => exportData('users')}
                    disabled={exportLoading}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 flex items-center"
                  >
                    {exportLoading ? (
                      <>
                        <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                        Exporting...
                      </>
                    ) : (
                      <>Export Users</>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin inline-block rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
                <p>Loading users...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              {user.image ? (
                                <Image 
                                  src={user.image} 
                                  alt={user.name} 
                                  width={40} 
                                  height={40} 
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.subscription === 'free' ? 'bg-gray-100 text-gray-800' : 
                              user.subscription === 'pro' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {user.subscription}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {/* Role Toggle Button */}
                          <button 
                            className={`text-indigo-600 hover:text-indigo-900 mr-3 ${
                              user.email === session?.user?.email ? 'opacity-50 cursor-not-allowed' : 
                              updatingUserId === user._id ? 'opacity-75 cursor-wait' : ''
                            }`}
                            disabled={user.email === session?.user?.email || updatingUserId === user._id}
                            onClick={() => {
                              const newRole = user.role === 'admin' ? 'user' : 'admin';
                              toggleUserRole(user._id, newRole);
                            }}
                          >
                            {updatingUserId === user._id ? (
                              <span className="flex items-center">
                                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-indigo-600 rounded-full"></span>
                                Updating...
                              </span>
                            ) : (
                              user.role === 'admin' ? 'Remove Admin' : 'Make Admin'
                            )}
                          </button>
                          
                          {/* Subscription Dropdown */}
                          <select
                            value={user.subscription}
                            onChange={(e) => updateUserSubscription(user._id, e.target.value as 'free' | 'pro' | 'lifetime')}
                            disabled={updatingUserId === user._id}
                            className="ml-2 text-sm rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                            <option value="lifetime">Lifetime Pro</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination or "No Results" message */}
                {filteredUsers.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No users match your search criteria
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* System Status Tab */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">API Status</h3>
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${systemStatus.api === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={systemStatus.api === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                    {systemStatus.api === 'healthy' ? 'Operational' : 'Issues Detected'}
                  </span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Database Status</h3>
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${systemStatus.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={systemStatus.database === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                    {systemStatus.database === 'healthy' ? 'Operational' : 'Issues Detected'}
                  </span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Storage Status</h3>
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${systemStatus.storage === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={systemStatus.storage === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                    {systemStatus.storage === 'healthy' ? 'Operational' : 'Issues Detected'}
                  </span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Last Status Check</h3>
                <p>{new Date(systemStatus.lastChecked).toLocaleString()}</p>
                <button 
                  onClick={() => setSystemStatus({...systemStatus, lastChecked: new Date().toISOString()})}
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                >
                  Refresh Status
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-medium mb-2">Recent Error Logs</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-500 italic">No recent errors to display.</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">System Information</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Node.js Version</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">v16.x</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Next.js Version</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">v13.x</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Database</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MongoDB</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Environment</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Production</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
