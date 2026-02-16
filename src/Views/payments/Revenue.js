import React, { useState, useEffect, useRef } from 'react';
import {
    TrendingUp, DollarSign, Calendar, Home, Users, Award,
    Download, RefreshCw, ChevronLeft, ChevronRight, BarChart3,
    PieChart, LineChart as LineChartIcon, ArrowUp, ArrowDown,
    Clock, MapPin, Star, CreditCard, Receipt, Filter,
    ArrowUpRight, ArrowDownRight, Minus, Activity, Target
} from 'lucide-react';
import {
    FileText,
    FileSpreadsheet,
    FilePdf,
    Printer,
    ChevronDown
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    AreaChart, Area
} from 'recharts';
import { BsFilePdf } from 'react-icons/bs';
import { exportToCSV, exportToPDF, printReport } from '../../utils/ExportUtils'
import * as XLSX from 'xlsx';

const Revenue = ({ darkMode, collapsed }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFarmhouse, setSelectedFarmhouse] = useState(null);
    const [timeRange, setTimeRange] = useState('month');
    const [chartType, setChartType] = useState('revenue');

    useEffect(() => {
        fetchRevenueData();
    }, []);

    const fetchRevenueData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://31.97.206.144:5124/api/order/revenue');
            const result = await response.json();
            if (result.success) {
                setData(result);
            } else {
                setError('Failed to fetch revenue data');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    // Color palette
    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Growth indicator component
    const GrowthIndicator = ({ value }) => {
        if (value > 0) {
            return (
                <span className="flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {value}%
                </span>
            );
        } else if (value < 0) {
            return (
                <span className="flex items-center text-red-500">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    {Math.abs(value)}%
                </span>
            );
        } else {
            return (
                <span className="flex items-center text-gray-500">
                    <Minus className="h-4 w-4 mr-1" />
                    0%
                </span>
            );
        }
    };

    // Add this state and functions to your Revenue component
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const exportMenuRef = useRef(null);

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setExportMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prepare export data
    const prepareRevenueExportData = () => {
        const farmhouseData = byFarmhouse.map(f => ({
            'Farmhouse': f.farmhouseName,
            'Address': f.farmhouseAddress,
            'Rating': f.farmhouseRating,
            'Total Revenue': f.statistics.totalRevenue,
            'Bookings': f.statistics.bookingCount,
            'Unique Users': f.statistics.uniqueUsers,
            'Avg Booking Value': f.statistics.averageBookingValue,
            'Min Booking': f.statistics.minBookingValue,
            'Max Booking': f.statistics.maxBookingValue,
            'Slot Revenue': f.statistics.revenueBreakdown.slotRevenue,
            'Cleaning Fee': f.statistics.revenueBreakdown.cleaningFee,
            'Service Fee': f.statistics.revenueBreakdown.serviceFee,
            'First Booking': new Date(f.timeline.firstBooking).toLocaleDateString(),
            'Last Booking': new Date(f.timeline.lastBooking).toLocaleDateString()
        }));

        const summaryData = [{
            'Metric': 'Total Revenue',
            'Value': combined.totalRevenue
        }, {
            'Metric': 'Total Bookings',
            'Value': combined.totalBookings
        }, {
            'Metric': 'Unique Farmhouses',
            'Value': combined.uniqueFarmhouses
        }, {
            'Metric': 'Unique Users',
            'Value': combined.uniqueUsers
        }, {
            'Metric': 'Average Booking Value',
            'Value': combined.averageBookingValue
        }, {
            'Metric': 'Min Booking Value',
            'Value': combined.minBookingValue
        }, {
            'Metric': 'Max Booking Value',
            'Value': combined.maxBookingValue
        }];

        return { farmhouseData, summaryData };
    };

    const handleExport = (type, format) => {
        const { farmhouseData, summaryData } = prepareRevenueExportData();
        const filename = `revenue_analytics_${timeRange}`;

        switch (format) {
            case 'csv':
                if (type === 'farmhouses') {
                    exportToCSV(farmhouseData, `${filename}_farmhouses`, Object.keys(farmhouseData[0]));
                } else {
                    exportToCSV(summaryData, `${filename}_summary`, Object.keys(summaryData[0]));
                }
                break;

            case 'excel':
                const wb = XLSX.utils.book_new();
                const farmhouseWs = XLSX.utils.json_to_sheet(farmhouseData);
                const summaryWs = XLSX.utils.json_to_sheet(summaryData);
                XLSX.utils.book_append_sheet(wb, farmhouseWs, 'Farmhouses');
                XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
                XLSX.writeFile(wb, `${filename}.xlsx`);
                break;

            case 'pdf':
                if (type === 'farmhouses') {
                    exportToPDF(
                        farmhouseData,
                        `${filename}_farmhouses`,
                        Object.keys(farmhouseData[0]),
                        'Revenue Analytics - Farmhouse Performance',
                        darkMode
                    );
                } else {
                    exportToPDF(
                        summaryData,
                        `${filename}_summary`,
                        Object.keys(summaryData[0]),
                        'Revenue Analytics - Summary',
                        darkMode
                    );
                }
                break;

            case 'print':
                if (type === 'farmhouses') {
                    printReport(
                        farmhouseData,
                        Object.keys(farmhouseData[0]),
                        'Revenue Analytics - Farmhouse Performance'
                    );
                } else {
                    printReport(
                        summaryData,
                        Object.keys(summaryData[0]),
                        'Revenue Analytics - Summary'
                    );
                }
                break;
        }

        setExportMenuOpen(false);
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
                } ${collapsed ? 'ml-20' : 'ml-64'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Loading revenue analytics...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
                } ${collapsed ? 'ml-20' : 'ml-64'}`}>
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <TrendingUp className="h-16 w-16 mx-auto" />
                    </div>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {error || 'Failed to load revenue data'}
                    </p>
                    <button
                        onClick={fetchRevenueData}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { period, combined, byFarmhouse, trends, userDistribution, summary } = data;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>

            {/* Header */}
            <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
                }`}>
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent`}>
                                Revenue Analytics
                            </h1>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Period Selector */}
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className={`px-4 py-2 rounded-xl border ${darkMode
                                        ? 'bg-gray-800 border-gray-700 text-white'
                                        : 'bg-white border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="day">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                            </select>

                            <button
                                onClick={fetchRevenueData}
                                className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                                    } transition-colors`}
                            >
                                <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>

             
                            {/* <div className="relative" ref={exportMenuRef}>
                                <button
                                    onClick={() => setExportMenuOpen(!exportMenuOpen)}
                                    className={`px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium flex items-center space-x-2 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105`}
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Export</span>
                                </button>

                                {exportMenuOpen && (
                                    <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                        } overflow-hidden z-50`}>
                                        <div className={`px-4 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Export Options
                                        </div>

                                        
                                        <div className="p-2">
                                            <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} px-2 mb-1`}>
                                                Farmhouse Performance
                                            </p>
                                            <button
                                                onClick={() => handleExport('farmhouses', 'csv')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                                    } transition-colors flex items-center`}
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                Export as CSV
                                            </button>
                                            <button
                                                onClick={() => handleExport('farmhouses', 'excel')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                                    } transition-colors flex items-center`}
                                            >
                                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                                Export as Excel
                                            </button>
                                            <button
                                                onClick={() => handleExport('farmhouses', 'pdf')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                                    } transition-colors flex items-center`}
                                            >
                                                <BsFilePdf className="h-4 w-4 mr-2" />
                                                Export as PDF
                                            </button>
                                        </div>

                                     
                                        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                            <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} px-2 mb-1`}>
                                                Summary Statistics
                                            </p>
                                            <button
                                                onClick={() => handleExport('summary', 'csv')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                                    } transition-colors flex items-center`}
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                Export as CSV
                                            </button>
                                            <button
                                                onClick={() => handleExport('summary', 'pdf')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                                    } transition-colors flex items-center`}
                                            >
                                                <BsFilePdf className="h-4 w-4 mr-2" />
                                                Export as PDF
                                            </button>
                                        </div>

                                 
                                        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={() => handleExport('farmhouses', 'print')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                                    } transition-colors flex items-center`}
                                            >
                                                <Printer className="h-4 w-4 mr-2" />
                                                Print Report
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Revenue */}
                    <div className={`group relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                        } p-6 hover:shadow-xl transition-all duration-300`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <GrowthIndicator value={combined.growth.revenue} />
                            </div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Total Revenue
                            </h3>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                                {formatCurrency(combined.totalRevenue)}
                            </p>
                            <div className="mt-4 flex items-center text-sm">
                                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                    {combined.totalBookings} bookings
                                </span>
                                <span className={`mx-2 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>•</span>
                                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                    Avg {formatCurrency(combined.averageBookingValue)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Breakdown */}
                    <div className={`group relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                        } p-6 hover:shadow-xl transition-all duration-300`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    <Receipt className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Revenue Breakdown
                            </h3>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Slot Revenue</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formatCurrency(combined.revenueBreakdown.slotRevenue)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Cleaning Fee</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formatCurrency(combined.revenueBreakdown.cleaningFee)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Service Fee</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {formatCurrency(combined.revenueBreakdown.serviceFee)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unique Farmhouses */}
                    <div className={`group relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                        } p-6 hover:shadow-xl transition-all duration-300`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 opacity-0 group-hover:opacity-5 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                    <Home className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Active Farmhouses
                            </h3>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                                {combined.uniqueFarmhouses}
                            </p>
                            <div className="mt-4">
                                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                    {summary.farmhousesWithNoRevenue} with no revenue
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Top Performer */}
                    <div className={`group relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                        } p-6 hover:shadow-xl transition-all duration-300`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                                    <Award className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Top Performer
                            </h3>
                            <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                                {summary.topPerformingFarmhouse.name}
                            </p>
                            <div className="mt-4 flex items-center text-sm">
                                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                    {formatCurrency(summary.topPerformingFarmhouse.revenue)}
                                </span>
                                <span className={`mx-2 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>•</span>
                                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                    {summary.topPerformingFarmhouse.bookings} bookings
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Trend Chart */}
                    <div className={`rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                        } p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Revenue Trend
                            </h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setChartType('revenue')}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${chartType === 'revenue'
                                            ? 'bg-indigo-600 text-white'
                                            : darkMode
                                                ? 'text-gray-400 hover:text-white'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Revenue
                                </button>
                                <button
                                    onClick={() => setChartType('bookings')}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${chartType === 'bookings'
                                            ? 'bg-indigo-600 text-white'
                                            : darkMode
                                                ? 'text-gray-400 hover:text-white'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Bookings
                                </button>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                                <XAxis
                                    dataKey="period"
                                    stroke={darkMode ? '#9ca3af' : '#6b7280'}
                                    tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                                />
                                <YAxis
                                    stroke={darkMode ? '#9ca3af' : '#6b7280'}
                                    tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                                    tickFormatter={(value) => chartType === 'revenue' ? `₹${value / 1000}k` : value}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                                        borderColor: darkMode ? '#374151' : '#e5e7eb',
                                        color: darkMode ? '#ffffff' : '#000000'
                                    }}
                                    formatter={(value) => chartType === 'revenue' ? [`₹${value}`, 'Revenue'] : [value, 'Bookings']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={chartType === 'revenue' ? 'revenue' : 'bookings'}
                                    stroke="#6366f1"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue Distribution Pie Chart */}
                    <div className={`rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                        } p-6`}>
                        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                            Revenue by Farmhouse
                        </h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <RePieChart>
                                <Pie
                                    data={byFarmhouse.map(f => ({
                                        name: f.farmhouseName,
                                        value: f.statistics.totalRevenue
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {byFarmhouse.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                                        borderColor: darkMode ? '#374151' : '#e5e7eb',
                                        color: darkMode ? '#ffffff' : '#000000'
                                    }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Legend
                                    wrapperStyle={{
                                        color: darkMode ? '#9ca3af' : '#6b7280'
                                    }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Farmhouse Performance Cards */}
                <div className="mb-8">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                        Farmhouse Performance
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {byFarmhouse.map((farmhouse, index) => (
                            <div
                                key={farmhouse.farmhouseId}
                                className={`rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                                    } p-6 hover:shadow-xl transition-all duration-300 cursor-pointer`}
                                onClick={() => setSelectedFarmhouse(selectedFarmhouse === farmhouse.farmhouseId ? null : farmhouse.farmhouseId)}
                            >
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={farmhouse.farmhouseImage}
                                        alt={farmhouse.farmhouseName}
                                        className="w-20 h-20 rounded-xl object-cover"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {farmhouse.farmhouseName}
                                                </h3>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center mt-1`}>
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {farmhouse.farmhouseAddress}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className={`ml-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {farmhouse.farmhouseRating}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Revenue</p>
                                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {formatCurrency(farmhouse.statistics.totalRevenue)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Bookings</p>
                                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {farmhouse.statistics.bookingCount}
                                                </p>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Avg Value</p>
                                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {formatCurrency(farmhouse.statistics.averageBookingValue)}
                                                </p>
                                            </div>
                                        </div>

                                        {selectedFarmhouse === farmhouse.farmhouseId && (
                                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                                <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                                                    Recent Bookings
                                                </h4>
                                                <div className="space-y-3">
                                                    {farmhouse.recentBookings.map((booking) => (
                                                        <div key={booking.bookingId} className="flex items-center justify-between">
                                                            <div>
                                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                    {new Date(booking.date).toLocaleDateString()}
                                                                </p>
                                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                                    User ID: {booking.userId.slice(-8)}
                                                                </p>
                                                            </div>
                                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                {formatCurrency(booking.amount)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Distribution Section */}
                <div className={`rounded-2xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                    } p-6`}>
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                        Top Users by Farmhouse
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {userDistribution.map((farmhouse) => (
                            <div key={farmhouse.farmhouseId}>
                                <h3 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                                    {farmhouse.farmhouseName}
                                </h3>
                                <div className="space-y-4">
                                    {farmhouse.topUsers.map((user, index) => (
                                        <div key={user.userId} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${index === 0 ? 'from-yellow-400 to-yellow-600' :
                                                        index === 1 ? 'from-gray-400 to-gray-600' :
                                                            'from-orange-400 to-orange-600'
                                                    } flex items-center justify-center text-white font-bold text-sm`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        User {user.userId.slice(-8)}
                                                    </p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                        {user.bookingCount} {user.bookingCount === 1 ? 'booking' : 'bookings'}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {formatCurrency(user.totalSpent)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className={`rounded-xl border ${darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
                        } p-4`}>
                        <div className="flex items-center">
                            <Activity className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Avg Revenue per Farmhouse
                            </span>
                        </div>
                        <p className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatCurrency(summary.averageRevenuePerFarmhouse)}
                        </p>
                    </div>

                    <div className={`rounded-xl border ${darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
                        } p-4`}>
                        <div className="flex items-center">
                            <Target className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Avg Bookings per Farmhouse
                            </span>
                        </div>
                        <p className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {summary.averageBookingsPerFarmhouse}
                        </p>
                    </div>

                    <div className={`rounded-xl border ${darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
                        } p-4`}>
                        <div className="flex items-center">
                            <Users className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Unique Users
                            </span>
                        </div>
                        <p className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {combined.uniqueUsers}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Revenue;