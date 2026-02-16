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

// Payment Details Component (Separate Page/Component)
const PaymentDetails = ({ paymentId, darkMode, onBack }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
    }
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
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading payment details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {error || 'Failed to load payment details'}
          </p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className={`p-2 rounded-xl ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <ChevronLeft className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent`}>
                  Payment Details
                </h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Transaction ID: {payment.identifiers.transactionId}
                </p>
              </div>
            </div>
            
            {/* <div className="flex items-center space-x-4">
              <button
                onClick={() => copyToClipboard(payment._id)}
                className={`px-4 py-2 rounded-xl border ${
                  darkMode 
                    ? 'border-gray-700 hover:bg-gray-800' 
                    : 'border-gray-200 hover:bg-gray-100'
                } transition-colors flex items-center space-x-2`}
              >
                <Copy className="h-4 w-4" />
                <span>{copied ? 'Copied!' : 'Copy ID'}</span>
              </button>
              
              <button className={`px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium flex items-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all`}>
                <Download className="h-4 w-4" />
                <span>Receipt</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Payment Status</p>
            <div className="flex items-center">
              {payment.summary.paymentStatus === 'completed' ? (
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              ) : (
                <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              )}
              <div>
                <p className={`text-xl font-bold capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {payment.summary.paymentStatus}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {new Date(payment.timeline.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Amount</p>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-3`}>
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ₹{payment.summary.totalPaid.toLocaleString()}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Net Amount: ₹{payment.summary.netAmount}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Payment Method</p>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mr-3`}>
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`text-xl font-bold capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {payment.summary.paymentMethod}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {payment.razorpay?.bank || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Booking Status</p>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mr-3`}>
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`text-xl font-bold capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {payment.summary.bookingStatus}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {payment.booking.label}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User & Farmhouse Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <User className="h-5 w-5 mr-2 text-indigo-500" />
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Full Name</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {payment.user.name}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Email</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <Mail className="h-4 w-4 mr-1 text-gray-400" />
                    {payment.user.email}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Phone</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                    <Phone className="h-4 w-4 mr-1 text-gray-400" />
                    {payment.user.phone}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Joined</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(payment.user.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Farmhouse Information */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Building className="h-5 w-5 mr-2 text-indigo-500" />
                Farmhouse Details
              </h2>
              
              <div className="flex flex-col lg:flex-row gap-6">
                {payment.farmhouse.images && payment.farmhouse.images[0] && (
                  <img
                    src={payment.farmhouse.images[0]}
                    alt={payment.farmhouse.name}
                    className="w-full lg:w-48 h-32 object-cover rounded-xl"
                  />
                )}
                
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {payment.farmhouse.name}
                  </h3>
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 flex items-start`}>
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    {payment.farmhouse.address}
                  </p>
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    {payment.farmhouse.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {payment.farmhouse.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {payment.farmhouse.rating}
                      </span>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      ₹{payment.farmhouse.pricePerHour}/hour
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                Booking Details
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Date</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(payment.booking.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Slot</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {payment.booking.label}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Check-in</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(payment.booking.checkIn).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Check-out</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(payment.booking.checkOut).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Details */}
          <div className="space-y-6">
            {/* Amount Breakdown */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Receipt className="h-5 w-5 mr-2 text-indigo-500" />
                Amount Breakdown
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Slot Price</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{payment.financial.breakdown.slotPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Cleaning Fee</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{payment.financial.breakdown.cleaningFee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Service Fee</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{payment.financial.breakdown.serviceFee}
                  </span>
                </div>
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3 mt-3`}>
                  <div className="flex justify-between font-bold">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Total</span>
                    <span className="text-indigo-600">₹{payment.financial.breakdown.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                Transaction Details
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Transaction ID</p>
                  <p className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {payment.identifiers.transactionId}
                  </p>
                </div>
                
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Razorpay Payment ID</p>
                  <p className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {payment.identifiers.razorpayPaymentId}
                  </p>
                </div>
                
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Verification ID</p>
                  <p className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {payment.identifiers.verificationId}
                  </p>
                </div>
                
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3 mt-3`}>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Razorpay Fee</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{payment.razorpay?.fee || 0}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Tax</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{payment.razorpay?.tax || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className={`rounded-2xl border ${
              darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            } p-6`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Payment Created
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {payment.timeline.formatted.created}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Last Updated
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {payment.timeline.formatted.updated}
                    </p>
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

  useEffect(() => {
    fetchPaymentsData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchPaymentsData = async (period) => {
    try {
      setLoading(true);
      const response = await fetch(`http://31.97.206.144:5124/api/order/payments/statistics?period=${period}`);
      const result = await response.json();
      if (result.success) {
        setData(result.statistics);
      } else {
        setError('Failed to fetch payments data');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setShowPaymentDetails(true);
  };

  const handleBackToPayments = () => {
    setShowPaymentDetails(false);
    setSelectedPaymentId(null);
  };

  // Color palette
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: { color: 'green', icon: CheckCircle, text: 'Completed' },
      pending: { color: 'yellow', icon: Clock, text: 'Pending' },
      failed: { color: 'red', icon: XCircle, text: 'Failed' },
      refunded: { color: 'purple', icon: Award, text: 'Refunded' }
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

  // Filter and sort payments
  const getFilteredPayments = () => {
    if (!data?.topPayments) return [];

    let filtered = [...data.topPayments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.farmhouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
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
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'farmhouse':
          aVal = a.farmhouse;
          bVal = b.farmhouse;
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
  const filteredPayments = getFilteredPayments();
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // If showing payment details, render PaymentDetails component
  if (showPaymentDetails && selectedPaymentId) {
    return <PaymentDetails 
      paymentId={selectedPaymentId} 
      darkMode={darkMode} 
      onBack={handleBackToPayments}
    />;
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading payments...
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
            {error || 'Failed to load payments data'}
          </p>
          <button
            onClick={() => fetchPaymentsData(selectedPeriod)}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, dailyTrend, paymentMethods, refunds } = data;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent`}>
                Payments Management
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track and manage all payment transactions
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => {
                  setSelectedPeriod(e.target.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              
              <button
                onClick={() => fetchPaymentsData(selectedPeriod)}
                className={`p-2 rounded-xl ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              
              {/* <button className={`px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium flex items-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105`}>
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Payments */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Payments
              </h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                {overview.totalPayments}
              </p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {overview.successRate}% success rate
                </span>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Amount
              </h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                ₹{overview.totalAmount.toLocaleString()}
              </p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Avg ₹{overview.averageAmount}/payment
              </p>
            </div>
          </div>

          {/* Payment Status */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Payment Status
              </h3>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-green-500">{overview.byStatus.completed}</span>
                <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
                <span className="text-yellow-500">{overview.byStatus.pending}</span>
                <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
                <span className="text-red-500">{overview.byStatus.failed}</span>
              </div>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Completed / Pending / Failed
              </p>
            </div>
          </div>

          {/* Refunds */}
          <div className={`group relative overflow-hidden rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6 hover:shadow-xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Refunds
              </h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                ₹{refunds.totalRefundAmount}
              </p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {refunds.totalRefunds} refunds • {refunds.refundRate}% rate
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Trend Chart */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Daily Payment Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="date" 
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
                <Bar yAxisId="left" dataKey="payments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Methods Distribution */}
          <div className={`rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
          } p-6`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Payment Methods
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethods.map((method, index) => ({
                    name: method.method[0] || 'Unknown',
                    value: method.amount
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        </div>

        {/* Payments Table */}
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
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
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
                  {['Payment ID', 'Farmhouse', 'Customer', 'Date', 'Amount', 'Actions'].map((header, index) => (
                    <th
                      key={index}
                      className={`px-6 py-4 text-left text-xs font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      } uppercase tracking-wider cursor-pointer hover:text-indigo-500 transition-colors`}
                      onClick={() => {
                        if (index === 2) {
                          setSortField('date');
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else if (index === 3) {
                          setSortField('amount');
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else if (index === 1) {
                          setSortField('farmhouse');
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        }
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{header}</span>
                        {(index === 1 || index === 2 || index === 3) && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {paginatedPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className={`${
                      darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {payment.id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {payment.farmhouse}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {payment.user || 'Unknown'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(payment.date).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm font-semibold text-indigo-600`}>
                        ₹{payment.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewPayment(payment.id)}
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
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
    </div>
  );
};

export default AllPayments;