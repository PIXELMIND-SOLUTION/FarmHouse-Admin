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

const Dashboard = ({ darkMode, collapsed }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [selectedChart, setSelectedChart] = useState('revenue');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://31.97.206.144:5124/api/order/dashbord');
      const result = await response.json();
      if (result.success) {
        setData(result);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {error || 'Failed to load dashboard data'}
          </p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, charts, recentActivity, topPerformers } = data;

  // Color palette for charts
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Users',
      value: summary.users.total,
      change: `+${summary.users.newToday} today`,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'blue',
      trend: 'up'
    },
    {
      title: 'Farmhouses',
      value: summary.farmhouses.total,
      change: `${summary.farmhouses.active} active`,
      icon: Home,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'emerald',
      trend: 'up'
    },
    {
      title: 'Bookings',
      value: summary.bookings.total,
      change: `${summary.bookings.completed} completed`,
      icon: Calendar,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'purple',
      trend: 'up'
    },
    {
      title: 'Revenue',
      value: `₹${summary.revenue.total.toLocaleString()}`,
      change: `Avg ₹${summary.revenue.averagePerBooking}/booking`,
      icon: DollarSign,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'amber',
      trend: 'up'
    },
    {
      title: 'Vendors',
      value: summary.vendors.total,
      change: `+${summary.vendors.newThisMonth} this month`,
      icon: Building,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'cyan',
      trend: 'up'
    },
    {
      title: 'Completion Rate',
      value: `${summary.bookings.completionRate}%`,
      change: 'of bookings completed',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'green',
      trend: 'up'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent`}>
                Dashboard Overview
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome back! Here's what's happening with your business.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              {/* <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-4 py-2 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-300' 
                    : 'bg-white border-gray-200 text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select> */}

              {/* Action Buttons */}
              {/* <button className={`p-2 rounded-xl ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              } transition-colors`}>
                <Download className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button> */}
              
              <button
                onClick={fetchDashboardData}
                className={`p-2 rounded-xl ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              } p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  {stat.title}
                </h3>
                
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {stat.value}
                </p>
                
                <p className={`text-xs flex items-center ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Revenue Overview
              </h2>
              <div className="flex space-x-2">
                {/* {['revenue', 'bookings', 'users'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChart(type)}
                    className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                      selectedChart === type
                        ? 'bg-indigo-600 text-white'
                        : darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {type}
                  </button>
                ))} */}
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.revenueByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="date" 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings Distribution */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Booking Distribution
            </h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Confirmed', value: summary.bookings.confirmed },
                    { name: 'Pending', value: summary.bookings.pending },
                    { name: 'Completed', value: summary.bookings.completed },
                    { name: 'Cancelled', value: summary.bookings.cancelled }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    color: darkMode ? '#9ca3af' : '#6b7280'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Users by Day Chart */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              User Registrations
            </h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.usersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="date" 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Performing Farmhouses */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Top Performing Farmhouses
            </h2>
            
            <div className="space-y-4">
              {topPerformers.farmhouses.map((farmhouse, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                      index === 0 ? 'from-yellow-400 to-yellow-600' :
                      index === 1 ? 'from-gray-400 to-gray-600' :
                      'from-orange-400 to-orange-600'
                    } flex items-center justify-center`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {farmhouse.farmhouseName}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {farmhouse.bookingCount} bookings • ₹{farmhouse.totalRevenue}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className={`ml-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {farmhouse.averageRating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Users
              </h2>
              <UserPlus className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            
            <div className="space-y-4">
              {recentActivity.users.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold`}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.name || 'Unknown User'}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.email || 'No email provided'}
                    </p>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Bookings
              </h2>
              <Calendar className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            
            <div className="space-y-4">
              {recentActivity.bookings.map((booking, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${
                    booking.status === 'confirmed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                  } flex items-center justify-center`}>
                    {booking.status === 'confirmed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {booking.farmhouse.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ₹{booking.totalAmount} • {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Farmhouses */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                New Farmhouses
              </h2>
              <Home className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            
            <div className="space-y-4">
              {recentActivity.farmhouses.slice(0, 5).map((farmhouse, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <img
                    src={farmhouse.image}
                    alt={farmhouse.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {farmhouse.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ₹{farmhouse.pricePerHour}/hr
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


// import React from "react";
// import {
//     FaUsers,
//     FaHome,
//     FaCalendarCheck,
//     FaImages,
//     FaPlus,
// } from "react-icons/fa";

// import {
//     LineChart,
//     Line,
//     CartesianGrid,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";

// import { useNavigate } from "react-router-dom";

// const Dashboard = ({ darkMode }) => {
//     const navigate = useNavigate();

//     /* ================= STATIC DATA ================= */

//     const stats = {
//         users: 1248,
//         farmhouses: 86,
//         bookings: 432,
//         banners: 12,
//     };

//     const graphData = [
//         { name: "Jan", value: 120 },
//         { name: "Feb", value: 210 },
//         { name: "Mar", value: 180 },
//         { name: "Apr", value: 260 },
//         { name: "May", value: 340 },
//         { name: "Jun", value: 390 },
//     ];

//     const latestUsers = [
//         { fullName: "Aarav Sharma", email: "aarav@mail.com", createdAt: "2025-01-02" },
//         { fullName: "Priya Reddy", email: "priya@mail.com", createdAt: "2025-01-04" },
//         { fullName: "Kiran Patel", email: "kiran@mail.com", createdAt: "2025-01-06" },
//         { fullName: "Neha Gupta", email: "neha@mail.com", createdAt: "2025-01-08" },
//         { fullName: "Rahul Verma", email: "rahul@mail.com", createdAt: "2025-01-10" },
//     ];

//     const latestBookings = [
//         { customerName: "Rohit Mehta", farmhouse: "Green Valley", date: "2025-01-03" },
//         { customerName: "Sneha Kapoor", farmhouse: "Palm Retreat", date: "2025-01-05" },
//         { customerName: "Arjun Rao", farmhouse: "Hilltop Stay", date: "2025-01-07" },
//         { customerName: "Pooja Singh", farmhouse: "River Edge", date: "2025-01-09" },
//         { customerName: "Vikram Das", farmhouse: "Sunset Villa", date: "2025-01-11" },
//     ];

//     return (
//         <div
//             className={`relative min-h-screen p-8 overflow-hidden ${darkMode
//                 ? "bg-[#020617] text-white"
//                 : "bg-gradient-to-br from-slate-100 to-white"
//                 }`}
//         >
//             {/* Mesh Glow */}
//             <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 blur-[120px]" />
//             <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px]" />

//             <div className="relative max-w-7xl mx-auto space-y-10">
//                 {/* HEADER */}
//                 <h1 className="text-4xl font-bold tracking-tight">
//                     Welcome Back 👋
//                 </h1>

//                 {/* KPI */}
//                 <div className="grid md:grid-cols-4 gap-8">
//                     <StatCard icon={<FaUsers />} label="Users" value={stats.users} darkMode={darkMode} />
//                     <StatCard icon={<FaHome />} label="Farmhouses" value={stats.farmhouses} darkMode={darkMode} />
//                     <StatCard icon={<FaCalendarCheck />} label="Bookings" value={stats.bookings} darkMode={darkMode} />
//                     <StatCard icon={<FaImages />} label="Banners" value={stats.banners} darkMode={darkMode} />
//                 </div>

//                 {/* GRAPH */}
//                 <GlassCard darkMode={darkMode}>
//                     <h2 className="text-2xl font-semibold mb-6">
//                         Growth Overview
//                     </h2>

//                     <ResponsiveContainer width="100%" height={320}>
//                         <LineChart data={graphData}>
//                             <Line
//                                 type="monotone"
//                                 dataKey="value"
//                                 stroke="#6366f1"
//                                 strokeWidth={3}
//                             />
//                             <CartesianGrid strokeOpacity={0.1} />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </GlassCard>

//                 {/* 🔥 LATEST USERS TABLE */}
//                 <PremiumTable
//                     darkMode={darkMode}
//                     title="Latest Users"
//                     headers={["Name", "Email", "Joined"]}
//                     rows={latestUsers.map((u) => [
//                         u.fullName,
//                         u.email,
//                         new Date(u.createdAt).toLocaleDateString(),
//                     ])}
//                 />

//                 {/* 🔥 LATEST BOOKINGS TABLE */}
//                 <PremiumTable
//                     darkMode={darkMode}
//                     title="Latest Bookings"
//                     headers={["Customer", "Farmhouse", "Date"]}
//                     rows={latestBookings.map((b) => [
//                         b.customerName,
//                         b.farmhouse,
//                         new Date(b.date).toLocaleDateString(),
//                     ])}
//                 />

//                 {/* QUICK ACTIONS */}
//                 <GlassCard darkMode={darkMode}>
//                     <h2 className="text-2xl font-semibold mb-6">
//                         Quick Actions
//                     </h2>

//                     <div className="grid md:grid-cols-3 gap-6">
//                         <QuickCard label="Create Farmhouse" onClick={() => navigate("/admin/create-farmhouse")} />
//                         <QuickCard label="Create Banner" onClick={() => navigate("/admin/banners")} />
//                         <QuickCard label="View Bookings" onClick={() => navigate("/admin/bookings")} />
//                     </div>
//                 </GlassCard>
//             </div>
//         </div>
//     );
// };

// /* ================= COMPONENTS ================= */

// const GlassCard = ({ children, darkMode }) => (
//     <div
//         className={`rounded-3xl p-8 backdrop-blur-2xl border shadow-xl
//     ${darkMode
//                 ? "bg-white/5 border-white/10"
//                 : "bg-white/70 border-white"
//             }`}
//     >
//         {children}
//     </div>
// );

// const StatCard = ({ icon, label, value, darkMode }) => (
//     <div className="relative">
//         <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-3xl"></div>

//         <div
//             className={`relative rounded-3xl p-6 backdrop-blur-xl border
//       hover:scale-105 transition shadow-lg
//       ${darkMode
//                     ? "bg-white/5 border-white/10"
//                     : "bg-white border-gray-200"
//                 }`}
//         >
//             <div className="flex justify-between items-center">
//                 <div>
//                     <p className="opacity-70">{label}</p>
//                     <h2 className="text-3xl font-bold mt-1">{value}</h2>
//                 </div>

//                 <div className="text-indigo-400 text-3xl">
//                     {icon}
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// const PremiumTable = ({ title, headers, rows, darkMode }) => (
//     <div
//         className={`
//       rounded-3xl
//       overflow-hidden
//       shadow-[0_10px_40px_rgba(0,0,0,0.25)]
//       ${darkMode
//                 ? "bg-[#0B1120]"     // solid luxury dark (NOT transparent)
//                 : "bg-white"
//             }
//     `}
//     >
//         {/* HEADER */}
//         <div
//             className={`
//         px-8 py-6
//         ${darkMode
//                     ? "border-b border-white/5"
//                     : "border-b border-gray-200"
//                 }
//       `}
//         >
//             <h2 className="text-2xl font-semibold tracking-tight">
//                 {title}
//             </h2>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//                 {/* THEAD */}
//                 <thead
//                     className={`
//             ${darkMode
//                             ? "bg-[#020617]"   // strong separation
//                             : "bg-gray-50"
//                         }
//           `}
//                 >
//                     <tr>
//                         {headers.map((h, i) => (
//                             <th
//                                 key={i}
//                                 className="
//                   text-left
//                   px-8
//                   py-4
//                   text-xs
//                   font-semibold
//                   uppercase
//                   tracking-wider
//                   opacity-70
//                 "
//                             >
//                                 {h}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>

//                 {/* TBODY */}
//                 <tbody>
//                     {rows.map((row, i) => (
//                         <tr
//                             key={i}
//                             className={`
//                 transition
//                 ${darkMode
//                                     ? "border-t border-white/5 hover:bg-white/3"
//                                     : "border-t border-gray-200 hover:bg-gray-50"
//                                 }
//               `}
//                         >
//                             {row.map((cell, j) => (
//                                 <td
//                                     key={j}
//                                     className="
//                     px-8
//                     py-5
//                     text-sm
//                     font-medium
//                   "
//                                 >
//                                     {cell}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     </div>
// );


// const QuickCard = ({ label, onClick }) => (
//     <button
//         onClick={onClick}
//         className="
//     p-6 rounded-2xl
//     bg-gradient-to-r from-indigo-500 to-purple-600
//     hover:scale-105
//     shadow-2xl
//     font-semibold
//     flex items-center justify-center gap-2
//     transition
//     "
//     >
//         <FaPlus />
//         {label}
//     </button>
// );

// export default Dashboard;
