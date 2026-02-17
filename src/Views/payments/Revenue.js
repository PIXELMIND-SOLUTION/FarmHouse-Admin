import React, { useState, useEffect, useRef } from 'react';
import {
    TrendingUp, DollarSign, Calendar, Home, Users, Award,
    Download, RefreshCw, ChevronLeft, ChevronRight, BarChart3,
    PieChart, LineChart as LineChartIcon, ArrowUp, ArrowDown,
    Clock, MapPin, Star, CreditCard, Receipt, Filter,
    ArrowUpRight, ArrowDownRight, Minus, Activity, Target
} from 'lucide-react';
import {
    FileText, FileSpreadsheet, Printer, ChevronDown
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    AreaChart, Area
} from 'recharts';
import { BsFilePdf } from 'react-icons/bs';
import { exportToCSV, exportToPDF, printReport } from '../../utils/ExportUtils';
import * as XLSX from 'xlsx';

const Revenue = ({ darkMode, collapsed }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFarmhouse, setSelectedFarmhouse] = useState(null);
    const [timeRange, setTimeRange] = useState('month');
    const [chartType, setChartType] = useState('revenue');
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const exportMenuRef = useRef(null);

    useEffect(() => { fetchRevenueData(); }, []);

    const fetchRevenueData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://31.97.206.144:5124/api/order/revenue');
            const result = await response.json();
            if (result.success) { setData(result); } else { setError('Failed to fetch revenue data'); }
        } catch (err) { setError('Error connecting to server'); } finally { setLoading(false); }
    };

    // Farmhouse color palette - lime/amber
    const COLORS = ['#84cc16', '#d97706', '#65a30d', '#ca8a04', '#a3e635', '#f59e0b'];

    const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    const GrowthIndicator = ({ value }) => {
        if (value > 0) return <span className="flex items-center text-lime-500"><ArrowUp className="h-4 w-4 mr-1" />{value}%</span>;
        if (value < 0) return <span className="flex items-center text-red-500"><ArrowDown className="h-4 w-4 mr-1" />{Math.abs(value)}%</span>;
        return <span className="flex items-center text-stone-500"><Minus className="h-4 w-4 mr-1" />0%</span>;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) setExportMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const prepareRevenueExportData = () => {
        const farmhouseData = byFarmhouse.map(f => ({
            'Farmhouse': f.farmhouseName, 'Address': f.farmhouseAddress, 'Rating': f.farmhouseRating,
            'Total Revenue': f.statistics.totalRevenue, 'Bookings': f.statistics.bookingCount,
            'Unique Users': f.statistics.uniqueUsers, 'Avg Booking Value': f.statistics.averageBookingValue,
            'Min Booking': f.statistics.minBookingValue, 'Max Booking': f.statistics.maxBookingValue,
            'Slot Revenue': f.statistics.revenueBreakdown.slotRevenue,
            'Cleaning Fee': f.statistics.revenueBreakdown.cleaningFee,
            'Service Fee': f.statistics.revenueBreakdown.serviceFee,
            'First Booking': new Date(f.timeline.firstBooking).toLocaleDateString(),
            'Last Booking': new Date(f.timeline.lastBooking).toLocaleDateString()
        }));
        const summaryData = [
            { 'Metric': 'Total Revenue', 'Value': combined.totalRevenue },
            { 'Metric': 'Total Bookings', 'Value': combined.totalBookings },
            { 'Metric': 'Unique Farmhouses', 'Value': combined.uniqueFarmhouses },
            { 'Metric': 'Unique Users', 'Value': combined.uniqueUsers },
            { 'Metric': 'Average Booking Value', 'Value': combined.averageBookingValue },
            { 'Metric': 'Min Booking Value', 'Value': combined.minBookingValue },
            { 'Metric': 'Max Booking Value', 'Value': combined.maxBookingValue }
        ];
        return { farmhouseData, summaryData };
    };

    const handleExport = (type, format) => {
        const { farmhouseData, summaryData } = prepareRevenueExportData();
        const filename = `revenue_analytics_${timeRange}`;
        const exportData = type === 'farmhouses' ? farmhouseData : summaryData;
        const headers = Object.keys(exportData[0]);
        switch (format) {
            case 'csv': exportToCSV(exportData, `${filename}_${type}`, headers); break;
            case 'excel':
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(farmhouseData), 'Farmhouses');
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), 'Summary');
                XLSX.writeFile(wb, `${filename}.xlsx`);
                break;
            case 'pdf': exportToPDF(exportData, `${filename}_${type}`, headers, `Revenue Analytics - ${type === 'farmhouses' ? 'Farmhouse Performance' : 'Summary'}`, darkMode); break;
            case 'print': printReport(exportData, headers, `Revenue Analytics - ${type === 'farmhouses' ? 'Farmhouse Performance' : 'Summary'}`); break;
        }
        setExportMenuOpen(false);
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'}`}>
                <div className="text-center">
                    <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto ${darkMode ? 'border-lime-500' : 'border-lime-600'}`}></div>
                    <p className={`mt-4 text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>Loading revenue analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'}`}>
                <div className="text-center">
                    <div className="text-red-500 mb-4"><TrendingUp className="h-16 w-16 mx-auto" /></div>
                    <p className={`text-lg ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>{error || 'Failed to load revenue data'}</p>
                    <button onClick={fetchRevenueData} className="mt-4 px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">Retry</button>
                </div>
            </div>
        );
    }

    const { period, combined, byFarmhouse, trends, userDistribution, summary } = data;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'}`}>

            {/* Header */}
            <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${darkMode ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'}`}>
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${darkMode ? 'from-lime-400 to-amber-400' : 'from-lime-600 to-amber-600'}`}>
                                Revenue Analytics
                            </h1>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                                {new Date(period.start).toLocaleDateString()} - {new Date(period.end).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
                                className={`px-4 py-2 rounded-xl border outline-none ${darkMode ? 'bg-stone-800 border-stone-700 text-white focus:ring-2 focus:ring-lime-500' : 'bg-white border-lime-300 text-stone-900 focus:ring-2 focus:ring-lime-400'}`}>
                                <option value="day">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                            </select>
                            <button onClick={fetchRevenueData} className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-stone-800' : 'hover:bg-lime-100'}`}>
                                <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Revenue */}
                    <div className={`group relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6 hover:shadow-xl transition-all duration-300`}>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <GrowthIndicator value={combined.growth.revenue} />
                            </div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Total Revenue</h3>
                            <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{formatCurrency(combined.totalRevenue)}</p>
                            <div className="mt-4 flex items-center text-sm">
                                <span className={darkMode ? 'text-stone-500' : 'text-stone-500'}>{combined.totalBookings} bookings</span>
                                <span className={`mx-2 ${darkMode ? 'text-stone-700' : 'text-stone-300'}`}>•</span>
                                <span className={darkMode ? 'text-stone-500' : 'text-stone-500'}>Avg {formatCurrency(combined.averageBookingValue)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Breakdown */}
                    <div className={`group relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6 hover:shadow-xl transition-all duration-300`}>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                                    <Receipt className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Revenue Breakdown</h3>
                            <div className="mt-4 space-y-2">
                                {[
                                    { label: 'Slot Revenue', value: combined.revenueBreakdown.slotRevenue },
                                    { label: 'Cleaning Fee', value: combined.revenueBreakdown.cleaningFee },
                                    { label: 'Service Fee', value: combined.revenueBreakdown.serviceFee }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className={darkMode ? 'text-stone-400' : 'text-stone-600'}>{item.label}</span>
                                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>{formatCurrency(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active Farmhouses */}
                    <div className={`group relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6 hover:shadow-xl transition-all duration-300`}>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-600 to-lime-700 flex items-center justify-center">
                                    <Home className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Active Farmhouses</h3>
                            <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{combined.uniqueFarmhouses}</p>
                            <p className={`text-sm mt-4 ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{summary.farmhousesWithNoRevenue} with no revenue</p>
                        </div>
                    </div>

                    {/* Top Performer */}
                    <div className={`group relative overflow-hidden rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6 hover:shadow-xl transition-all duration-300`}>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
                                    <Award className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Top Performer</h3>
                            <p className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{summary.topPerformingFarmhouse.name}</p>
                            <div className="mt-4 flex items-center text-sm">
                                <span className={darkMode ? 'text-stone-500' : 'text-stone-500'}>{formatCurrency(summary.topPerformingFarmhouse.revenue)}</span>
                                <span className={`mx-2 ${darkMode ? 'text-stone-700' : 'text-stone-300'}`}>•</span>
                                <span className={darkMode ? 'text-stone-500' : 'text-stone-500'}>{summary.topPerformingFarmhouse.bookings} bookings</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Trend */}
                    <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Revenue Trend</h2>
                            <div className="flex space-x-2">
                                {['revenue', 'bookings'].map((type) => (
                                    <button key={type} onClick={() => setChartType(type)}
                                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                            chartType === type
                                                ? darkMode ? 'bg-lime-600 text-white' : 'bg-lime-500 text-white'
                                                : darkMode ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                                        }`}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#44403c' : '#d9f99d'} />
                                <XAxis dataKey="period" stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#a8a29e' : '#6b7280' }} />
                                <YAxis stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#a8a29e' : '#6b7280' }}
                                    tickFormatter={(value) => chartType === 'revenue' ? `₹${value / 1000}k` : value} />
                                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1c1917' : '#ffffff', borderColor: darkMode ? '#44403c' : '#d9f99d', color: darkMode ? '#ffffff' : '#000000' }}
                                    formatter={(value) => chartType === 'revenue' ? [`₹${value}`, 'Revenue'] : [value, 'Bookings']} />
                                <Area type="monotone" dataKey={chartType === 'revenue' ? 'revenue' : 'bookings'} stroke="#84cc16" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue by Farmhouse */}
                    <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
                        <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Revenue by Farmhouse</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <RePieChart>
                                <Pie data={byFarmhouse.map(f => ({ name: f.farmhouseName, value: f.statistics.totalRevenue }))}
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {byFarmhouse.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1c1917' : '#ffffff', borderColor: darkMode ? '#44403c' : '#d9f99d', color: darkMode ? '#ffffff' : '#000000' }} formatter={(value) => formatCurrency(value)} />
                                <Legend wrapperStyle={{ color: darkMode ? '#a8a29e' : '#6b7280' }} />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Farmhouse Performance Cards */}
                <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Farmhouse Performance</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {byFarmhouse.map((farmhouse, index) => (
                            <div key={farmhouse.farmhouseId}
                                className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6 hover:shadow-xl transition-all duration-300 cursor-pointer`}
                                onClick={() => setSelectedFarmhouse(selectedFarmhouse === farmhouse.farmhouseId ? null : farmhouse.farmhouseId)}>
                                <div className="flex items-start space-x-4">
                                    <img src={farmhouse.farmhouseImage} alt={farmhouse.farmhouseName} className="w-20 h-20 rounded-xl object-cover border-2 border-lime-300" />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>{farmhouse.farmhouseName}</h3>
                                                <p className={`text-sm flex items-center mt-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                                                    <MapPin className="h-3 w-3 mr-1" />{farmhouse.farmhouseAddress}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-amber-400 fill-current" />
                                                <span className={`ml-1 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{farmhouse.farmhouseRating}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            {[
                                                { label: 'Revenue', value: formatCurrency(farmhouse.statistics.totalRevenue) },
                                                { label: 'Bookings', value: farmhouse.statistics.bookingCount },
                                                { label: 'Avg Value', value: formatCurrency(farmhouse.statistics.averageBookingValue) }
                                            ].map((item, i) => (
                                                <div key={i}>
                                                    <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{item.label}</p>
                                                    <p className={`font-semibold ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedFarmhouse === farmhouse.farmhouseId && (
                                            <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-stone-700' : 'border-lime-200'}`}>
                                                <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>Recent Bookings</h4>
                                                <div className="space-y-3">
                                                    {farmhouse.recentBookings.map((booking) => (
                                                        <div key={booking.bookingId} className="flex items-center justify-between">
                                                            <div>
                                                                <p className={`text-sm ${darkMode ? 'text-stone-300' : 'text-stone-600'}`}>{new Date(booking.date).toLocaleDateString()}</p>
                                                                <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>User ID: {booking.userId.slice(-8)}</p>
                                                            </div>
                                                            <p className={`font-medium ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>{formatCurrency(booking.amount)}</p>
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

                {/* User Distribution */}
                <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
                    <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Top Users by Farmhouse</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {userDistribution.map((farmhouse) => (
                            <div key={farmhouse.farmhouseId}>
                                <h3 className={`text-md font-medium mb-4 ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>{farmhouse.farmhouseName}</h3>
                                <div className="space-y-4">
                                    {farmhouse.topUsers.map((user, index) => (
                                        <div key={user.userId} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm ${
                                                    index === 0 ? 'from-amber-400 to-amber-600' :
                                                    index === 1 ? 'from-stone-400 to-stone-600' :
                                                    'from-lime-500 to-lime-700'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-stone-900'}`}>User {user.userId.slice(-8)}</p>
                                                    <p className={`text-xs ${darkMode ? 'text-stone-500' : 'text-stone-500'}`}>{user.bookingCount} {user.bookingCount === 1 ? 'booking' : 'bookings'}</p>
                                                </div>
                                            </div>
                                            <p className={`font-medium ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>{formatCurrency(user.totalSpent)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {[
                        { icon: Activity, label: 'Avg Revenue per Farmhouse', value: formatCurrency(summary.averageRevenuePerFarmhouse) },
                        { icon: Target, label: 'Avg Bookings per Farmhouse', value: summary.averageBookingsPerFarmhouse },
                        { icon: Users, label: 'Unique Users', value: combined.uniqueUsers }
                    ].map((item, i) => (
                        <div key={i} className={`rounded-xl border ${darkMode ? 'bg-stone-800/30 border-stone-700' : 'bg-lime-50 border-lime-200'} p-4`}>
                            <div className="flex items-center">
                                <item.icon className={`h-5 w-5 mr-2 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
                                <span className={`text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{item.label}</span>
                            </div>
                            <p className={`text-xl font-bold mt-2 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Revenue;