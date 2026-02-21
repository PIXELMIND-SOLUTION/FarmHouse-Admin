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
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-stone-900' : 'bg-lime-50'
        }`}>
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
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-stone-900' : 'bg-lime-50'
        }`}>
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

  const { summary, charts, recentActivity, topPerformers } = data;

  // Color palette for charts - light green and brown theme
  const COLORS = ['#84cc16', '#a3e635', '#d97706', '#ca8a04', '#65a30d', '#92400e'];

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Users',
      value: summary.users.total,
      change: `+${summary.users.newToday} today`,
      icon: Users,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'lime',
      trend: 'up',
      link: '/admin/users'
    },
    {
      title: 'Farmhouses',
      value: summary.farmhouses.total,
      change: `${summary.farmhouses.active} active`,
      icon: Home,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'amber',
      trend: 'up',
      link: '/admin/farmhouses'
    },
    {
      title: 'Bookings',
      value: summary.bookings.total,
      change: `${summary.bookings.completed} completed`,
      icon: Calendar,
      color: 'from-lime-600 to-lime-700',
      bgColor: 'lime',
      trend: 'up',
      link: '/admin/allbookings'
    },
    {
      title: 'Revenue',
      value: `₹${summary.revenue.total.toLocaleString()}`,
      change: `Avg ₹${summary.revenue.averagePerBooking}/booking`,
      icon: DollarSign,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'amber',
      trend: 'up',
      link: '/admin/revenue'
    },
    // {
    //   title: 'Vendors',
    //   value: summary.vendors.total,
    //   change: `+${summary.vendors.newThisMonth} this month`,
    //   icon: Building,
    //   color: 'from-lime-500 to-emerald-600',
    //   bgColor: 'lime',
    //   trend: 'up',
    //   link: '/admin/allfarmhouses'
    // },
    // {
    //   title: 'Completion Rate',
    //   value: `${summary.bookings.completionRate}%`,
    //   change: 'of bookings completed',
    //   icon: CheckCircle,
    //   color: 'from-lime-600 to-green-600',
    //   bgColor: 'lime',
    //   trend: 'up',
    //   link: '/admin/allbookings'
    //}
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-stone-900' : 'bg-lime-50'
      }`}>

      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${darkMode ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'
        }`}>
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
                className={`p-2 rounded-xl ${darkMode ? 'hover:bg-stone-800' : 'hover:bg-lime-100'
                  } transition-colors`}
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
                } p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              onClick={() => navigate(`${stat.link}`)}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Icon */}
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

                <p className={`text-xs flex items-center ${stat.trend === 'up' ? 'text-lime-600' : 'text-red-500'
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
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                Revenue Overview
              </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.revenueByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#57534e' : '#d9f99d'} />
                <XAxis
                  dataKey="date"
                  stroke={darkMode ? '#a8a29e' : '#78716c'}
                  tick={{ fill: darkMode ? '#a8a29e' : '#78716c' }}
                />
                <YAxis
                  stroke={darkMode ? '#a8a29e' : '#78716c'}
                  tick={{ fill: darkMode ? '#a8a29e' : '#78716c' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#292524' : '#ffffff',
                    borderColor: darkMode ? '#57534e' : '#d9f99d',
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#84cc16"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings Distribution */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'} mb-6`}>
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
                    backgroundColor: darkMode ? '#292524' : '#ffffff',
                    borderColor: darkMode ? '#57534e' : '#d9f99d',
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: darkMode ? '#a8a29e' : '#78716c'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Users by Day Chart */}
          <div
            className={`rounded-2xl border ${darkMode ? "bg-stone-800/50 border-stone-700" : "bg-white border-lime-200"
              } p-4 sm:p-5 lg:p-6`}
          >
            {/* TITLE */}
            <h2
              className={`text-base sm:text-lg lg:text-xl font-semibold ${darkMode ? "text-white" : "text-stone-900"
                } mb-4 sm:mb-6`}
            >
              User Registrations
            </h2>

            {/* CHART WRAPPER */}
            <div className="w-full h-[220px] xs:h-[240px] sm:h-[260px] md:h-[300px] lg:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charts.usersByDay}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#57534e" : "#d9f99d"}
                  />

                  {/* X AXIS */}
                  <XAxis
                    dataKey="date"
                    stroke={darkMode ? "#a8a29e" : "#78716c"}
                    tick={{ fill: darkMode ? "#a8a29e" : "#78716c", fontSize: 12 }}
                    interval="preserveStartEnd"
                  />

                  {/* Y AXIS */}
                  <YAxis
                    stroke={darkMode ? "#a8a29e" : "#78716c"}
                    tick={{ fill: darkMode ? "#a8a29e" : "#78716c", fontSize: 12 }}
                    width={35}
                  />

                  {/* TOOLTIP */}
                  <Tooltip
                    wrapperStyle={{ outline: "none" }}
                    contentStyle={{
                      backgroundColor: darkMode ? "#292524" : "#ffffff",
                      borderColor: darkMode ? "#57534e" : "#d9f99d",
                      borderRadius: "12px",
                      fontSize: "12px"
                    }}
                  />

                  {/* BAR */}
                  <Bar
                    dataKey="count"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* Top Performing Farmhouses */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'} mb-6`}>
              Top Performing Farmhouses
            </h2>

            <div className="space-y-4">
              {topPerformers.farmhouses.map((farmhouse, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-stone-700/50' : 'bg-lime-50'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${index === 0 ? 'from-amber-400 to-amber-600' :
                      index === 1 ? 'from-stone-400 to-stone-600' :
                        'from-orange-400 to-orange-600'
                      } flex items-center justify-center`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                        {farmhouse.farmhouseName}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                        {farmhouse.bookingCount} bookings • ₹{farmhouse.totalRevenue}
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
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div
            className={`rounded-2xl border ${darkMode ? "bg-stone-800/50 border-stone-700" : "bg-white border-lime-200"
              } p-4 sm:p-5 lg:p-6`}
          >
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2
                className={`text-base sm:text-lg lg:text-xl font-semibold ${darkMode ? "text-white" : "text-stone-900"
                  }`}
              >
                Recent Users
              </h2>

              <UserPlus
                className={`h-5 w-5 sm:h-6 sm:w-6 ${darkMode ? "text-stone-400" : "text-stone-600"
                  }`}
              />
            </div>

            {/* USERS */}
            <div className="space-y-4 sm:space-y-5">
              {recentActivity.users.slice(0, 5).map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  {/* Avatar */}
                  <div className="min-w-[38px] sm:min-w-[42px] h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>

                  {/* Name + Email */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium text-sm sm:text-base truncate ${darkMode ? "text-white" : "text-stone-900"
                        }`}
                    >
                      {user.name || "Unknown User"}
                    </p>

                    <p
                      className={`text-xs sm:text-sm truncate ${darkMode ? "text-stone-400" : "text-stone-600"
                        }`}
                    >
                      {user.email || "No email provided"}
                    </p>
                  </div>

                  {/* Date */}
                  <div
                    className={`text-[10px] sm:text-xs md:text-sm whitespace-nowrap ${darkMode ? "text-stone-500" : "text-stone-400"
                      }`}
                  >
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Recent Bookings */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                Recent Bookings
              </h2>
              <Calendar className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
            </div>

            <div className="space-y-4">

              {/* Empty State */}
              {!recentActivity?.bookings?.length && (
                <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                  No recent bookings found.
                </p>
              )}

              {recentActivity?.bookings?.map((booking, index) => {

                // SAFE FALLBACKS
                const status = booking?.status || "pending";
                const farmhouseName = booking?.farmhouse?.name || "Unknown Farmhouse";
                const amount = booking?.totalAmount ?? "0";
                const bookingDate = booking?.date
                  ? new Date(booking.date).toLocaleDateString()
                  : "No date";

                return (
                  <div key={index} className="flex items-start space-x-3">

                    {/* STATUS ICON */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center
          ${status === "confirmed" ? "bg-lime-500/20" : "bg-amber-500/20"}`}
                    >
                      {status === "confirmed" ? (
                        <CheckCircle className="h-5 w-5 text-lime-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-600" />
                      )}
                    </div>

                    {/* BOOKING INFO */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${darkMode ? "text-white" : "text-stone-900"
                          }`}
                      >
                        {farmhouseName}
                      </p>

                      <p
                        className={`text-sm ${darkMode ? "text-stone-400" : "text-stone-600"
                          }`}
                      >
                        ₹{amount} • {bookingDate}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Recent Farmhouses */}
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                New Farmhouses
              </h2>
              <Home className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
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
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                      {farmhouse.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
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