import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Download, RefreshCw, Eye, ArrowUpDown,
  ChevronLeft, ChevronRight, Calendar, DollarSign, CreditCard,
  TrendingUp, Award, Clock, CheckCircle, XCircle, AlertCircle,
  Building, User, Mail, Phone, MapPin, Calendar as CalendarIcon,
  Banknote, Receipt, FileText, Info, ExternalLink, Copy,
  Star
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Payment Details Component
const PaymentDetails = ({ paymentId, darkMode, onBack }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (paymentId) fetchPaymentDetails();
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://31.97.206.144:5124/api/order/payments/${paymentId}`);
      const result = await response.json();
      if (result.success) {
        setPayment(result.payment);
      } else {
        setError('Failed to fetch payment details');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto ${
            darkMode ? 'border-lime-500' : 'border-lime-600'
          }`}></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'
      }`}>
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <p className={`mt-4 text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>{error || 'Failed to load payment details'}</p>
          <button onClick={onBack} className="mt-4 px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        darkMode ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'
      }`}>
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-stone-800' : 'hover:bg-lime-100'}`}
              >
                <ChevronLeft className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
              </button>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  darkMode ? 'from-lime-400 to-amber-400' : 'from-lime-600 to-amber-600'
                }`}>
                  Payment Details
                </h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                  Transaction ID: {payment.identifiers.transactionId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Payment Status',
              content: (
                <div className="flex items-center">
                  {payment.summary.paymentStatus === 'completed'
                    ? <CheckCircle className="h-8 w-8 text-lime-500 mr-3" />
                    : <Clock className="h-8 w-8 text-amber-500 mr-3" />}
                  <div>
                    <p className={`text-xl font-bold capitalize ${darkMode ? 'text-white' : 'text-stone-900'}`}>{payment.summary.paymentStatus}</p>
                    <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{new Date(payment.timeline.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              )
            },
            {
              label: 'Amount',
              icon: <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center mr-3"><DollarSign className="h-6 w-6 text-white" /></div>,
              value: `₹${payment.summary.totalPaid.toLocaleString()}`,
              sub: `Net Amount: ₹${payment.summary.netAmount}`
            },
            {
              label: 'Payment Method',
              icon: <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mr-3"><CreditCard className="h-6 w-6 text-white" /></div>,
              value: payment.summary.paymentMethod,
              sub: payment.razorpay?.bank || 'N/A'
            },
            {
              label: 'Booking Status',
              icon: <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-600 to-lime-700 flex items-center justify-center mr-3"><Calendar className="h-6 w-6 text-white" /></div>,
              value: payment.summary.bookingStatus,
              sub: payment.booking.label
            }
          ].map((card, i) => (
            <div key={i} className={`rounded-2xl border ${
              darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
              <p className={`text-sm mb-2 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{card.label}</p>
              {card.content || (
                <div className="flex items-center">
                  {card.icon}
                  <div>
                    <p className={`text-xl font-bold capitalize ${darkMode ? 'text-white' : 'text-stone-900'}`}>{card.value}</p>
                    <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{card.sub}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                <User className={`h-5 w-5 mr-2 ${darkMode ? 'text-lime-400' : 'text-lime-600'}`} />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: payment.user.name },
                  { label: 'Email', value: payment.user.email, icon: <Mail className="h-4 w-4 mr-1 text-stone-400" /> },
                  { label: 'Phone', value: payment.user.phone, icon: <Phone className="h-4 w-4 mr-1 text-stone-400" /> },
                  { label: 'Joined', value: new Date(payment.user.joinedAt).toLocaleDateString() }
                ].map((item, i) => (
                  <div key={i}>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{item.label}</p>
                    <p className={`font-medium flex items-center ${darkMode ? 'text-white' : 'text-stone-900'}`}>
                      {item.icon}{item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Farmhouse Information */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                <Building className={`h-5 w-5 mr-2 ${darkMode ? 'text-lime-400' : 'text-lime-600'}`} />
                Farmhouse Details
              </h2>
              <div className="flex flex-col lg:flex-row gap-6">
                {payment.farmhouse.images && payment.farmhouse.images[0] && (
                  <img src={payment.farmhouse.images[0]} alt={payment.farmhouse.name} className="w-full lg:w-48 h-32 object-cover rounded-xl border-2 border-lime-300" />
                )}
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{payment.farmhouse.name}</h3>
                  <p className={`text-sm mb-3 flex items-start ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />{payment.farmhouse.address}
                  </p>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>{payment.farmhouse.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {payment.farmhouse.amenities.map((amenity, index) => (
                      <span key={index} className={`px-3 py-1 rounded-full text-xs ${
                        darkMode ? 'bg-lime-500/20 text-lime-400' : 'bg-lime-100 text-lime-700'
                      }`}>{amenity}</span>
                    ))}
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <Star className="h-4 w-4 text-amber-400 fill-current mr-1" />
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>{payment.farmhouse.rating}</span>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>₹{payment.farmhouse.pricePerHour}/hour</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                <Calendar className={`h-5 w-5 mr-2 ${darkMode ? 'text-lime-400' : 'text-lime-600'}`} />
                Booking Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Date', value: new Date(payment.booking.date).toLocaleDateString() },
                  { label: 'Slot', value: payment.booking.label },
                  { label: 'Check-in', value: new Date(payment.booking.checkIn).toLocaleTimeString() },
                  { label: 'Check-out', value: new Date(payment.booking.checkOut).toLocaleTimeString() }
                ].map((item, i) => (
                  <div key={i}>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{item.label}</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Amount Breakdown */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                <Receipt className={`h-5 w-5 mr-2 ${darkMode ? 'text-lime-400' : 'text-lime-600'}`} />
                Amount Breakdown
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Slot Price', value: payment.financial.breakdown.slotPrice },
                  { label: 'Cleaning Fee', value: payment.financial.breakdown.cleaningFee },
                  { label: 'Service Fee', value: payment.financial.breakdown.serviceFee }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className={darkMode ? 'text-stone-400' : 'text-stone-600'}>{item.label}</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>₹{item.value}</span>
                  </div>
                ))}
                <div className={`border-t pt-3 mt-3 ${darkMode ? 'border-stone-700' : 'border-lime-200'}`}>
                  <div className="flex justify-between font-bold">
                    <span className={darkMode ? 'text-stone-300' : 'text-stone-700'}>Total</span>
                    <span className={darkMode ? 'text-lime-400' : 'text-lime-600'}>₹{payment.financial.breakdown.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                <FileText className={`h-5 w-5 mr-2 ${darkMode ? 'text-lime-400' : 'text-lime-600'}`} />
                Transaction Details
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Transaction ID', value: payment.identifiers.transactionId },
                  { label: 'Razorpay Payment ID', value: payment.identifiers.razorpayPaymentId },
                  { label: 'Verification ID', value: payment.identifiers.verificationId }
                ].map((item, i) => (
                  <div key={i}>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{item.label}</p>
                    <p className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-stone-900'}`}>{item.value}</p>
                  </div>
                ))}
                <div className={`border-t pt-3 mt-3 ${darkMode ? 'border-stone-700' : 'border-lime-200'}`}>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-stone-400' : 'text-stone-600'}>Razorpay Fee</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>₹{payment.razorpay?.fee || 0}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className={darkMode ? 'text-stone-400' : 'text-stone-600'}>Tax</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>₹{payment.razorpay?.tax || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>
                <Clock className={`h-5 w-5 mr-2 ${darkMode ? 'text-lime-400' : 'text-lime-600'}`} />
                Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-lime-500 mr-3"></div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>Payment Created</p>
                    <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{payment.timeline.formatted.created}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 mr-3"></div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>Last Updated</p>
                    <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{payment.timeline.formatted.updated}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main AllPayments Component
const AllPayments = ({ darkMode, collapsed }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => { fetchPaymentsData(selectedPeriod); }, [selectedPeriod]);

  const fetchPaymentsData = async (period) => {
    try {
      setLoading(true);
      const response = await fetch(`http://31.97.206.144:5124/api/order/payments/statistics?period=${period}`);
      const result = await response.json();
      if (result.success) { setData(result.statistics); } else { setError('Failed to fetch payments data'); }
    } catch (err) { setError('Error connecting to server'); } finally { setLoading(false); }
  };

  const handleViewPayment = (paymentId) => { setSelectedPaymentId(paymentId); setShowPaymentDetails(true); };
  const handleBackToPayments = () => { setShowPaymentDetails(false); setSelectedPaymentId(null); };

  const COLORS = ['#84cc16', '#d97706', '#65a30d', '#ca8a04', '#a3e635'];

  const StatusBadge = ({ status }) => {
    const cfg = {
      completed: { cls: darkMode ? 'bg-lime-500/20 text-lime-400' : 'bg-lime-100 text-lime-700', icon: CheckCircle, text: 'Completed' },
      pending: { cls: darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700', icon: Clock, text: 'Pending' },
      failed: { cls: 'bg-red-100 text-red-700', icon: XCircle, text: 'Failed' },
      refunded: { cls: darkMode ? 'bg-stone-500/20 text-stone-400' : 'bg-stone-100 text-stone-700', icon: Award, text: 'Refunded' }
    };
    const config = cfg[status] || cfg.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.cls}`}>
        <Icon className="w-3 h-3 mr-1" />{config.text}
      </span>
    );
  };

  const getFilteredPayments = () => {
    if (!data?.topPayments) return [];
    let filtered = [...data.topPayments];
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.farmhouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      let aVal = sortField === 'date' ? new Date(a.date).getTime() : sortField === 'amount' ? a.amount : a.farmhouse;
      let bVal = sortField === 'date' ? new Date(b.date).getTime() : sortField === 'amount' ? b.amount : b.farmhouse;
      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return filtered;
  };

  const filteredPayments = getFilteredPayments();
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (showPaymentDetails && selectedPaymentId) {
    return <PaymentDetails paymentId={selectedPaymentId} darkMode={darkMode} onBack={handleBackToPayments} />;
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto ${darkMode ? 'border-lime-500' : 'border-lime-600'}`}></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'}`}>
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <p className={`mt-4 text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>{error || 'Failed to load payments data'}</p>
          <button onClick={() => fetchPaymentsData(selectedPeriod)} className="mt-4 px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  const { overview, dailyTrend, paymentMethods, refunds } = data;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'}`}>

      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${darkMode ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'}`}>
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${darkMode ? 'from-lime-400 to-amber-400' : 'from-lime-600 to-amber-600'}`}>
                Payments Management
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Track and manage all payment transactions</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => { setSelectedPeriod(e.target.value); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-xl border outline-none ${darkMode ? 'bg-stone-800 border-stone-700 text-white focus:ring-2 focus:ring-lime-500' : 'bg-white border-lime-300 text-stone-900 focus:ring-2 focus:ring-lime-400'}`}
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button onClick={() => fetchPaymentsData(selectedPeriod)} className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-stone-800' : 'hover:bg-lime-100'}`}>
                <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Payments', value: overview.totalPayments, sub: `${overview.successRate}% success rate`, icon: CreditCard, grad: 'from-lime-500 to-lime-600', subColor: 'text-lime-500' },
            { label: 'Total Amount', value: `₹${overview.totalAmount.toLocaleString()}`, sub: `Avg ₹${overview.averageAmount}/payment`, icon: DollarSign, grad: 'from-amber-500 to-amber-600', subColor: '' },
            { label: 'Payment Status', value: null, icon: Clock, grad: 'from-lime-600 to-lime-700', subColor: '' },
            { label: 'Refunds', value: `₹${refunds.totalRefundAmount}`, sub: `${refunds.totalRefunds} refunds • ${refunds.refundRate}% rate`, icon: Award, grad: 'from-amber-600 to-amber-700', subColor: '' }
          ].map((card, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6 hover:shadow-xl transition-all duration-300`}>
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.grad} flex items-center justify-center mb-4`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{card.label}</h3>
                {i === 2 ? (
                  <>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-lime-500">{overview.byStatus.completed}</span>
                      <span className={darkMode ? 'text-stone-600' : 'text-stone-300'}>•</span>
                      <span className="text-amber-500">{overview.byStatus.pending}</span>
                      <span className={darkMode ? 'text-stone-600' : 'text-stone-300'}>•</span>
                      <span className="text-red-500">{overview.byStatus.failed}</span>
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>Completed / Pending / Failed</p>
                  </>
                ) : (
                  <>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{card.value}</p>
                    <p className={`text-xs mt-2 ${card.subColor || (darkMode ? 'text-stone-500' : 'text-stone-500')}`}>{card.sub}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Daily Payment Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#44403c' : '#d9f99d'} />
                <XAxis dataKey="date" stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#a8a29e' : '#6b7280' }} />
                <YAxis yAxisId="left" stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#a8a29e' : '#6b7280' }} />
                <YAxis yAxisId="right" orientation="right" stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#a8a29e' : '#6b7280' }} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1c1917' : '#ffffff', borderColor: darkMode ? '#44403c' : '#d9f99d', color: darkMode ? '#ffffff' : '#000000' }} />
                <Bar yAxisId="left" dataKey="payments" fill="#84cc16" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="amount" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Payment Methods</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={paymentMethods.map((method) => ({ name: method.method[0] || 'Unknown', value: method.amount }))} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {paymentMethods.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1c1917' : '#ffffff', borderColor: darkMode ? '#44403c' : '#d9f99d', color: darkMode ? '#ffffff' : '#000000' }} />
                <Legend wrapperStyle={{ color: darkMode ? '#a8a29e' : '#6b7280' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payments Table */}
        <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'}`}>
          <div className={`p-6 border-b ${darkMode ? 'border-stone-700' : 'border-lime-100'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`} />
                <input
                  type="text" placeholder="Search payments..." value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border outline-none ${darkMode ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500 focus:ring-2 focus:ring-lime-500' : 'bg-white border-lime-300 text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-lime-400'}`}
                />
              </div>
              <button className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'}`}>
                <Filter className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-stone-700/50' : 'bg-lime-50'}>
                <tr>
                  {['Payment ID', 'Farmhouse', 'Customer', 'Date', 'Amount', 'Actions'].map((header, index) => (
                    <th key={index}
                      className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${darkMode ? 'text-stone-400 hover:text-lime-400' : 'text-stone-500 hover:text-lime-600'}`}
                      onClick={() => {
                        if (index === 2) { setSortField('date'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }
                        else if (index === 3) { setSortField('amount'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }
                        else if (index === 1) { setSortField('farmhouse'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{header}</span>
                        {(index === 1 || index === 2 || index === 3) && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-stone-700' : 'divide-lime-100'}`}>
                {paginatedPayments.map((payment) => (
                  <tr key={payment.id} className={`transition-colors ${darkMode ? 'hover:bg-stone-700/50' : 'hover:bg-lime-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-mono ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>{payment.id.slice(-8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>{payment.farmhouse}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-stone-900'}`}>{payment.user || 'Unknown'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-stone-900'}`}>{new Date(payment.date).toLocaleDateString()}</p>
                      <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{new Date(payment.date).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm font-semibold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>₹{payment.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleViewPayment(payment.id)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-stone-600' : 'hover:bg-lime-100'}`}>
                        <Eye className={`h-4 w-4 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`px-6 py-4 border-t flex items-center justify-between ${darkMode ? 'border-stone-700' : 'border-lime-100'}`}>
            <p className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
            </p>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'}`}>
                <ChevronLeft className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
              </button>
              <span className={`px-4 py-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${darkMode ? 'hover:bg-stone-700' : 'hover:bg-lime-100'}`}>
                <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPayments;