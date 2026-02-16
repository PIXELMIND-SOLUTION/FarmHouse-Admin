import React, { useState, useEffect } from 'react';
import {
  Calendar, Search, Filter, Download, RefreshCw, Eye,
  CheckCircle, XCircle, Clock, AlertCircle, DollarSign,
  Home, User, Mail, Phone, MapPin, MoreVertical,
  ChevronLeft, ChevronRight, ArrowUpDown, Calendar as CalendarIcon,
  TrendingUp, Award, CreditCard, Users, BarChart3
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AllBookings = ({ darkMode, collapsed }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookingsData();
  }, []);

  const fetchBookingsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://31.97.206.144:5124/api/order/admin/summary');
      const result = await response.json();
      if (result.success) {
        setData(result);
      } else {
        setError('Failed to fetch bookings data');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Color palette
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      confirmed: { color: 'green', icon: CheckCircle, text: 'Confirmed' },
      pending: { color: 'yellow', icon: Clock, text: 'Pending' },
      cancelled: { color: 'red', icon: XCircle, text: 'Cancelled' },
      completed: { color: 'blue', icon: CheckCircle, text: 'Completed' },
      upcoming: { color: 'purple', icon: Calendar, text: 'Upcoming' },
      active: { color: 'indigo', icon: Clock, text: 'Active' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900/30 dark:text-${config.color}-400`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // Filter and sort bookings
  const getFilteredBookings = () => {
    if (!data?.recentBookings) return [];

    let filtered = [...data.recentBookings];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.farmhouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Apply date filter
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(booking => 
        new Date(booking.date).toDateString() === now.toDateString()
      );
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(booking => 
        new Date(booking.date) >= weekAgo
      );
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(booking => 
        new Date(booking.date) >= monthAgo
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'amount':
          aVal = a.totalAmount;
          bVal = b.totalAmount;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  // Pagination
  const filteredBookings = getFilteredBookings();
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {error || 'Failed to load bookings data'}
          </p>
          <button
            onClick={fetchBookingsData}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, revenue, weeklyStats, topFarmhouses } = data;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    } `}>
      
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent`}>
                Bookings Management
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and track all farmhouse bookings
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchBookingsData}
                className={`p-2 rounded-xl ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              
              <button className={`px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium flex items-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105`}>
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Bookings
              </h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                {summary.total}
              </p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{summary.today} today
                </span>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Revenue
              </h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                ₹{revenue.totalRevenue.toLocaleString()}
              </p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Avg ₹{revenue.avgBookingValue}/booking
              </p>
            </div>
          </div>

          {/* Active Bookings */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Bookings
              </h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                {summary.confirmed.active}
              </p>
              <div className="flex items-center mt-2 text-xs space-x-2">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Upcoming: {summary.confirmed.upcoming}
                </span>
                <span className={`${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>•</span>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Completed: {summary.confirmed.completed}
                </span>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Completion Rate
              </h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                {Math.round((summary.confirmed.completed / summary.total) * 100)}%
              </p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {summary.confirmed.completed} completed out of {summary.total}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Stats Chart */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Weekly Bookings & Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="_id" 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
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
                <Bar yAxisId="left" dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Farmhouses */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Top Performing Farmhouses
            </h2>
            <div className="space-y-4">
              {topFarmhouses.map((farmhouse, index) => (
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
                    } flex items-center justify-center text-white font-bold`}>
                      {index === 0 ? '1' : index === 1 ? '2' : '3'}
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {farmhouse.name}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {farmhouse.bookingCount} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{farmhouse.revenue.toLocaleString()}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      revenue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className={`rounded-2xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        } overflow-hidden`}>
          {/* Table Header with Filters */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className={`px-4 py-2 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>

                <button className={`p-2 rounded-xl ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors`}>
                  <Filter className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <tr>
                  {['Booking ID', 'Farmhouse', 'Customer', 'Date', 'Amount', 'Status', 'Actions'].map((header, index) => (
                    <th
                      key={index}
                      className={`px-6 py-4 text-left text-xs font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wider cursor-pointer hover:text-indigo-500 transition-colors`}
                      onClick={() => {
                        if (index === 2) {
                          setSortField('date');
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else if (index === 4) {
                          setSortField('amount');
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else if (index === 5) {
                          setSortField('status');
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        }
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{header}</span>
                        {(index === 2 || index === 4 || index === 5) && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {paginatedBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`${
                      darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                    } transition-colors cursor-pointer`}
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDetailsModal(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {booking._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {booking.farmhouse.images && booking.farmhouse.images[0] && (
                          <img
                            src={booking.farmhouse.images[0]}
                            alt={booking.farmhouse.name}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                          />
                        )}
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {booking.farmhouse.name}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {booking.farmhouse.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.user ? (
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {booking.user.email}
                          </p>
                        </div>
                      ) : (
                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Guest User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(booking.checkIn).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{booking.totalAmount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                        className={`p-2 rounded-lg ${
                          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                        } transition-colors`}
                      >
                        <Eye className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'hover:bg-gray-700 disabled:hover:bg-transparent disabled:opacity-50' 
                    : 'hover:bg-gray-100 disabled:hover:bg-transparent disabled:opacity-50'
                } transition-colors`}
              >
                <ChevronLeft className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <span className={`px-4 py-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'hover:bg-gray-700 disabled:hover:bg-transparent disabled:opacity-50' 
                    : 'hover:bg-gray-100 disabled:hover:bg-transparent disabled:opacity-50'
                } transition-colors`}
              >
                <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDetailsModal(false)}></div>
            
            <div className={`relative rounded-2xl max-w-2xl w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-2xl`}>
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Booking Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } transition-colors`}
                >
                  <XCircle className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Booking ID</p>
                    <p className={`font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedBooking._id}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Status</p>
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Farmhouse</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedBooking.farmhouse.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{selectedBooking.farmhouse.address}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Customer</p>
                    {selectedBooking.user ? (
                      <>
                        <p className={`${darkMode ? 'text-white' : 'text-gray-900'}>`}>{selectedBooking.user.email}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}>`}>ID: {selectedBooking.user._id}</p>
                      </>
                    ) : (
                      <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Guest User</p>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Booking Date</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedBooking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Check-in Time</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedBooking.checkIn).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Amount</p>
                    <p className={`text-xl font-bold text-indigo-600`}>
                      ₹{selectedBooking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Created At</p>
                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Farmhouse Images */}
                {selectedBooking.farmhouse.images && selectedBooking.farmhouse.images.length > 0 && (
                  <div className="mt-6">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Farmhouse Images</p>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedBooking.farmhouse.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Farmhouse ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;