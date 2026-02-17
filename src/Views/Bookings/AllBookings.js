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

  // Color palette - lime/amber farmhouse theme
  const COLORS = ['#84cc16', '#d97706', '#65a30d', '#ca8a04', '#a3e635'];

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      confirmed: { bg: darkMode ? 'bg-lime-500/20 text-lime-400' : 'bg-lime-100 text-lime-700', icon: CheckCircle, text: 'Confirmed' },
      pending: { bg: darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700', icon: Clock, text: 'Pending' },
      cancelled: { bg: darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700', icon: XCircle, text: 'Cancelled' },
      completed: { bg: darkMode ? 'bg-lime-500/20 text-lime-400' : 'bg-lime-100 text-lime-700', icon: CheckCircle, text: 'Completed' },
      upcoming: { bg: darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700', icon: Calendar, text: 'Upcoming' },
      active: { bg: darkMode ? 'bg-lime-500/20 text-lime-400' : 'bg-lime-100 text-lime-700', icon: Clock, text: 'Active' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // Filter and sort bookings
  const getFilteredBookings = () => {
    if (!data?.recentBookings) return [];
    let filtered = [...data.recentBookings];
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.farmhouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(booking => new Date(booking.date).toDateString() === now.toDateString());
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(booking => new Date(booking.date) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(booking => new Date(booking.date) >= monthAgo);
    }
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'date': aVal = new Date(a.date).getTime(); bVal = new Date(b.date).getTime(); break;
        case 'amount': aVal = a.totalAmount; bVal = b.totalAmount; break;
        case 'status': aVal = a.status; bVal = b.status; break;
        default: aVal = new Date(a.date).getTime(); bVal = new Date(b.date).getTime();
      }
      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return filtered;
  };

  const filteredBookings = getFilteredBookings();
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto ${
            darkMode ? 'border-lime-500' : 'border-lime-600'
          }`}></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'
      }`}>
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <p className={`mt-4 text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>
            {error || 'Failed to load bookings data'}
          </p>
          <button
            onClick={fetchBookingsData}
            className="mt-4 px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
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
      darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'
    }`}>

      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        darkMode ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'
      }`}>
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                darkMode ? 'from-lime-400 to-amber-400' : 'from-lime-600 to-amber-600'
              }`}>
                Bookings Management
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                Manage and track all farmhouse bookings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchBookingsData}
                className={`p-2 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-stone-800' : 'hover:bg-lime-100'
                }`}
              >
                <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
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
            darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-lime-500 to-lime-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Total Bookings</h3>
              <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{summary.total}</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-lime-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />+{summary.today} today
                </span>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Total Revenue</h3>
              <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>₹{revenue.totalRevenue.toLocaleString()}</p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>Avg ₹{revenue.avgBookingValue}/booking</p>
            </div>
          </div>

          {/* Active Bookings */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-lime-600 to-lime-700 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-600 to-lime-700 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Active Bookings</h3>
              <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{summary.confirmed.active}</p>
              <div className="flex items-center mt-2 text-xs space-x-2">
                <span className={darkMode ? 'text-stone-400' : 'text-stone-600'}>Upcoming: {summary.confirmed.upcoming}</span>
                <span className={darkMode ? 'text-stone-600' : 'text-stone-300'}>•</span>
                <span className={darkMode ? 'text-stone-400' : 'text-stone-600'}>Completed: {summary.confirmed.completed}</span>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Completion Rate</h3>
              <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                {Math.round((summary.confirmed.completed / summary.total) * 100)}%
              </p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>
                {summary.confirmed.completed} completed out of {summary.total}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Stats Chart */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
          } p-6`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
              Weekly Bookings & Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#44403c' : '#d9f99d'} />
                <XAxis dataKey="_id" stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#a8a29e' : '#6b7280' }} />
                <YAxis yAxisId="left" stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#a8a29e' : '#6b7280' }} />
                <YAxis yAxisId="right" orientation="right" stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#a8a29e' : '#6b7280' }} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1c1917' : '#ffffff', borderColor: darkMode ? '#44403c' : '#d9f99d', color: darkMode ? '#ffffff' : '#000000' }} />
                <Bar yAxisId="left" dataKey="count" fill="#84cc16" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Farmhouses */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
          } p-6`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
              Top Performing Farmhouses
            </h2>
            <div className="space-y-4">
              {topFarmhouses.map((farmhouse, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${
                  darkMode ? 'bg-stone-700/50' : 'bg-lime-50'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'from-amber-400 to-amber-600' :
                      index === 1 ? 'from-stone-400 to-stone-600' :
                      'from-lime-500 to-lime-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>{farmhouse.name}</p>
                      <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{farmhouse.bookingCount} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>₹{farmhouse.revenue.toLocaleString()}</p>
                    <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className={`rounded-2xl border overflow-hidden ${
          darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
        }`}>
          {/* Table Header with Filters */}
          <div className={`p-6 border-b ${darkMode ? 'border-stone-700' : 'border-lime-100'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  darkMode ? 'text-stone-500' : 'text-stone-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border outline-none ${
                    darkMode
                      ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500 focus:ring-2 focus:ring-lime-500'
                      : 'bg-white border-lime-300 text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-lime-400'
                  }`}
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-stone-900 border-stone-700 text-white focus:ring-2 focus:ring-lime-500' : 'bg-white border-lime-300 text-stone-900 focus:ring-2 focus:ring-lime-400'
                  }`}
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
                  className={`px-4 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-stone-900 border-stone-700 text-white focus:ring-2 focus:ring-lime-500' : 'bg-white border-lime-300 text-stone-900 focus:ring-2 focus:ring-lime-400'
                  }`}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <button className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'}`}>
                  <Filter className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-stone-700/50' : 'bg-lime-50'}>
                <tr>
                  {['Booking ID', 'Farmhouse', 'Customer', 'Date', 'Amount', 'Status', 'Actions'].map((header, index) => (
                    <th
                      key={index}
                      className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                        darkMode ? 'text-stone-400 hover:text-lime-400' : 'text-stone-500 hover:text-lime-600'
                      }`}
                      onClick={() => {
                        if (index === 2) { setSortField('date'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }
                        else if (index === 4) { setSortField('amount'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }
                        else if (index === 5) { setSortField('status'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{header}</span>
                        {(index === 2 || index === 4 || index === 5) && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-stone-700' : 'divide-lime-100'}`}>
                {paginatedBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`transition-colors cursor-pointer ${
                      darkMode ? 'hover:bg-stone-700/50' : 'hover:bg-lime-50'
                    }`}
                    onClick={() => { setSelectedBooking(booking); setShowDetailsModal(true); }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-mono ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>{booking._id.slice(-8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {booking.farmhouse.images && booking.farmhouse.images[0] && (
                          <img src={booking.farmhouse.images[0]} alt={booking.farmhouse.name} className="w-10 h-10 rounded-lg object-cover mr-3 border-2 border-lime-300" />
                        )}
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>{booking.farmhouse.name}</p>
                          <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{booking.farmhouse.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.user ? (
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-stone-900'}`}>{booking.user.email}</p>
                      ) : (
                        <span className={`text-sm ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>Guest User</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-stone-900'}`}>{new Date(booking.date).toLocaleDateString()}</p>
                      <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{new Date(booking.checkIn).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm font-semibold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>₹{booking.totalAmount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); setShowDetailsModal(true); }}
                        className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-stone-600' : 'hover:bg-lime-100'}`}
                      >
                        <Eye className={`h-4 w-4 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={`px-6 py-4 border-t flex items-center justify-between ${darkMode ? 'border-stone-700' : 'border-lime-100'}`}>
            <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'}`}
              >
                <ChevronLeft className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
              </button>
              <span className={`px-4 py-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'}`}
              >
                <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
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
            <div className={`relative rounded-2xl max-w-2xl w-full shadow-2xl ${
              darkMode ? 'bg-stone-800' : 'bg-white'
            }`}>
              <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-stone-700' : 'border-lime-200'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Booking Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'}`}>
                  <XCircle className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Booking ID</p>
                    <p className={`font-mono ${darkMode ? 'text-white' : 'text-stone-900'}`}>{selectedBooking._id}</p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Status</p>
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Farmhouse</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>{selectedBooking.farmhouse.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{selectedBooking.farmhouse.address}</p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Customer</p>
                    {selectedBooking.user ? (
                      <>
                        <p className={darkMode ? 'text-white' : 'text-stone-900'}>{selectedBooking.user.email}</p>
                        <p className={`text-sm ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>ID: {selectedBooking.user._id}</p>
                      </>
                    ) : (
                      <p className={darkMode ? 'text-stone-500' : 'text-stone-400'}>Guest User</p>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Booking Date</p>
                    <p className={darkMode ? 'text-white' : 'text-stone-900'}>{new Date(selectedBooking.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Check-in Time</p>
                    <p className={darkMode ? 'text-white' : 'text-stone-900'}>{new Date(selectedBooking.checkIn).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Amount</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-lime-400' : 'text-lime-600'}`}>₹{selectedBooking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Created At</p>
                    <p className={darkMode ? 'text-white' : 'text-stone-900'}>{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {selectedBooking.farmhouse.images && selectedBooking.farmhouse.images.length > 0 && (
                  <div className="mt-6">
                    <p className={`text-sm mb-3 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Farmhouse Images</p>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedBooking.farmhouse.images.map((image, index) => (
                        <img key={index} src={image} alt={`Farmhouse ${index + 1}`} className="w-full h-24 object-cover rounded-lg border-2 border-lime-300" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className={`px-6 py-4 border-t flex justify-end space-x-3 ${darkMode ? 'border-stone-700' : 'border-lime-200'}`}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-stone-700 text-white hover:bg-stone-600' : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
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