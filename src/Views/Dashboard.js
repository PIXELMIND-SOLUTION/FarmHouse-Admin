import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  Users, Home, Calendar, DollarSign, TrendingUp, Star,
  MapPin, Phone, Mail, Clock, CheckCircle, XCircle,
  AlertCircle, Download, RefreshCw, MoreVertical, Eye,
  UserPlus, Building, CreditCard, Award, Activity,
  Sun, Moon, ChevronRight, Menu, Filter, Search,
  Bell, Settings, LogOut, Heart, Share2, Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ darkMode, collapsed }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [selectedChart, setSelectedChart] = useState('revenue');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // ✅ Fixed API URL (use correct IP instead of localhost)
      const response = await fetch('https://backend.vfarmstays.com/api/order/dashbord');
      const result = await response.json();
      if (result.success) {
        setData(result);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-stone-900' : 'bg-lime-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lime-500 mx-auto"></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-stone-900' : 'bg-lime-50'}`}>
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <p className={`mt-4 text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
            {error || 'Failed to load dashboard data'}
          </p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Destructure with safe fallbacks
  const { summary = {}, charts = {}, recentActivity = {} } = data;

  // Summary values - flat structure from API
  const totalUsers = summary.users || 0;
  const totalFarmhouses = summary.farmhouses || 0;
  const totalBookings = summary.bookings?.total || 0;
  const totalRevenue = summary.revenue?.total || 0;
  const completedBookings = summary.bookings?.completed || 0;
  const pendingBookings = summary.bookings?.pending || 0;
  const confirmedBookings = summary.bookings?.confirmed || 0;
  const cancelledBookings = summary.bookings?.cancelled || 0;

  // For charts: revenueByDay is missing, use bookingsByDay as fallback or create from bookingsByDay with revenue 0
  const revenueChartData = charts.bookingsByDay?.map(item => ({
    date: item.date,
    revenue: item.revenue || 0
  })) || [];

  // Users by day chart data
  const usersByDayData = charts.usersByDay || [];

  // Top performers: we don't have topPerformers in the response, so derive from recentActivity or show empty
  // For now, we'll use recentActivity.farmhouses as top farmhouses (sorted by revenue if possible, but we have no revenue)
  // So we'll just show the first 3 farmhouses from recentActivity as "top" (by default)
  const topFarmhouses = (recentActivity.farmhouses || []).slice(0, 3).map((fh, idx) => ({
    farmhouseName: fh.name,
    bookingCount: fh.bookedSlots?.length || 0,
    totalRevenue: 0, // No revenue in farmhouse object
    averageRating: fh.rating || 0
  }));

  // Color palette
  const COLORS = ['#84cc16', '#a3e635', '#d97706', '#ca8a04', '#65a30d', '#92400e'];

  // Stats cards data - updated to match flat structure
  const statsCards = [
    {
      title: 'Total Users',
      value: totalUsers,
      change: `Registered users`,
      icon: Users,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'lime',
      trend: 'up',
      link: '/admin/users'
    },
    {
      title: 'Farmhouses',
      value: totalFarmhouses,
      change: `Active listings`,
      icon: Home,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'amber',
      trend: 'up',
      link: '/admin/farmhouses'
    },
    {
      title: 'Bookings',
      value: totalBookings,
      change: `${completedBookings} completed`,
      icon: Calendar,
      color: 'from-lime-600 to-lime-700',
      bgColor: 'lime',
      trend: 'up',
      link: '/admin/allbookings'
    },
    {
      title: 'Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: `Total revenue`,
      icon: DollarSign,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'amber',
      trend: 'up',
      link: '/admin/revenue'
    }
  ];

  // Booking distribution for pie chart
  const bookingDistribution = [
    { name: 'Confirmed', value: confirmedBookings },
    { name: 'Pending', value: pendingBookings },
    { name: 'Completed', value: completedBookings },
    { name: 'Cancelled', value: cancelledBookings }
  ].filter(item => item.value > 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-stone-900' : 'bg-lime-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${darkMode ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'}`}>
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r from-lime-600 to-amber-600 bg-clip-text text-transparent`}>
                Dashboard Overview
              </h1>
              <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                Welcome back! Here's what's happening with your business.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                className={`p-2 rounded-xl ${darkMode ? 'hover:bg-stone-800' : 'hover:bg-lime-100'} transition-colors`}
              >
                <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border ${darkMode
                ? 'bg-stone-800/50 border-stone-700 hover:border-stone-600'
                : 'bg-white border-lime-200 hover:border-lime-300'
                } p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
              onClick={() => navigate(stat.link)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'} mb-1`}>
                  {stat.title}
                </h3>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-stone-900'} mb-2`}>
                  {stat.value}
                </p>
                <p className={`text-xs flex items-center text-lime-600`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart - using bookingsByDay data */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                Revenue Overview
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#57534e' : '#d9f99d'} />
                <XAxis dataKey="date" stroke={darkMode ? '#a8a29e' : '#78716c'} tick={{ fill: darkMode ? '#a8a29e' : '#78716c' }} />
                <YAxis stroke={darkMode ? '#a8a29e' : '#78716c'} tick={{ fill: darkMode ? '#a8a29e' : '#78716c' }} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#292524' : '#ffffff', borderColor: darkMode ? '#57534e' : '#d9f99d' }} />
                <Area type="monotone" dataKey="revenue" stroke="#84cc16" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Distribution Pie Chart */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'} mb-6`}>
              Booking Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#292524' : '#ffffff', borderColor: darkMode ? '#57534e' : '#d9f99d' }} />
                <Legend wrapperStyle={{ color: darkMode ? '#a8a29e' : '#78716c' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Users by Day Chart */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'} mb-6`}>
              User Registrations
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usersByDayData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#57534e' : '#d9f99d'} />
                <XAxis dataKey="date" stroke={darkMode ? '#a8a29e' : '#78716c'} tick={{ fill: darkMode ? '#a8a29e' : '#78716c', fontSize: 12 }} />
                <YAxis stroke={darkMode ? '#a8a29e' : '#78716c'} tick={{ fill: darkMode ? '#a8a29e' : '#78716c', fontSize: 12 }} width={35} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#292524' : '#ffffff', borderColor: darkMode ? '#57534e' : '#d9f99d', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Performing Farmhouses */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'} mb-6`}>
              Top Farmhouses
            </h2>
            <div className="space-y-4">
              {topFarmhouses.length > 0 ? (
                topFarmhouses.map((farmhouse, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-stone-700/50' : 'bg-lime-50'}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                        index === 0 ? 'from-amber-400 to-amber-600' :
                        index === 1 ? 'from-stone-400 to-stone-600' :
                        'from-orange-400 to-orange-600'
                      } flex items-center justify-center text-white font-bold`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                          {farmhouse.farmhouseName}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                          {farmhouse.bookingCount} bookings
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className={`ml-1 ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                        {farmhouse.averageRating}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-stone-500">No farmhouse data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>Recent Users</h2>
              <UserPlus className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
            </div>
            <div className="space-y-4">
              {(recentActivity.users || []).slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white font-semibold">
                    {user._id ? user._id.slice(-2) : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                      Guest User
                    </p>
                    <p className={`text-sm truncate ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                      ID: {user._id?.slice(-8)}
                    </p>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {(!recentActivity.users || recentActivity.users.length === 0) && (
                <p className="text-stone-500 text-center">No recent users</p>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>Recent Bookings</h2>
              <Calendar className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
            </div>
            <div className="space-y-4">
              {(recentActivity.bookings || []).slice(0, 5).map((booking, index) => {
                const status = booking.status || 'pending';
                const farmhouseName = booking.farmhouseId?.name || 'Unknown Farmhouse';
                const amount = booking.totalAmount || 0;
                const bookingDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'No date';
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status === 'confirmed' ? 'bg-lime-500/20' : 'bg-amber-500/20'}`}>
                      {status === 'confirmed' ? (
                        <CheckCircle className="h-5 w-5 text-lime-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                        {farmhouseName}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                        ₹{amount} • {bookingDate}
                      </p>
                    </div>
                  </div>
                );
              })}
              {(!recentActivity.bookings || recentActivity.bookings.length === 0) && (
                <p className="text-stone-500 text-center">No recent bookings</p>
              )}
            </div>
          </div>

          {/* New Farmhouses */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>New Farmhouses</h2>
              <Home className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
            </div>
            <div className="space-y-4">
              {(recentActivity.farmhouses || []).slice(0, 5).map((farmhouse, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <img
                    src={farmhouse.images?.[0] || 'https://via.placeholder.com/48'}
                    alt={farmhouse.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                      {farmhouse.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                      ₹{farmhouse.price}/hr
                    </p>
                  </div>
                </div>
              ))}
              {(!recentActivity.farmhouses || recentActivity.farmhouses.length === 0) && (
                <p className="text-stone-500 text-center">No new farmhouses</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;