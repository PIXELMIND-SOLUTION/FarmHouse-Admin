// src/components/Revenue.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
    TrendingUp, DollarSign, Home, Users, Award,
    RefreshCw, ArrowUp, ArrowDown, Minus,
    MapPin, Star, Receipt, Activity, Target,
    Calendar, Filter, X
} from 'lucide-react';
import {
    AreaChart, Area, PieChart as RePieChart, Pie, Cell,
    CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { exportToCSV, exportToPDF, printReport } from '../../utils/ExportUtils';
import * as XLSX from 'xlsx';

const Revenue = ({ darkMode }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFarmhouse, setSelectedFarmhouse] = useState(null);
    const [chartType, setChartType] = useState('revenue');
    
    // Filter states
    const [period, setPeriod] = useState('month');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [farmhouseFilter, setFarmhouseFilter] = useState('');
    const [farmhousesList, setFarmhousesList] = useState([]);
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({
        period: 'month',
        farmhouseId: '',
        startDate: '',
        endDate: ''
    });

    // Fetch farmhouses for dropdown
    useEffect(() => {
        const fetchFarmhouses = async () => {
            try {
                const response = await fetch('https://backend.vfarmstays.com/api/farmhouses');
                const result = await response.json();
                if (result.success) {
                    setFarmhousesList(result.farmhouses || []);
                }
            } catch (err) {
                console.error("Failed to fetch farmhouses:", err);
            }
        };
        fetchFarmhouses();
    }, []);

    // Fetch revenue data with filters
    const fetchRevenueData = async () => {
        try {
            setLoading(true);
            let url = 'https://backend.vfarmstays.com/api/order/revenue?';
            const params = new URLSearchParams();
            
            params.append('period', appliedFilters.period);
            if (appliedFilters.farmhouseId) {
                params.append('farmhouseId', appliedFilters.farmhouseId);
            }
            if (appliedFilters.period === 'custom' && appliedFilters.startDate && appliedFilters.endDate) {
                params.append('startDate', appliedFilters.startDate);
                params.append('endDate', appliedFilters.endDate);
            }
            
            url += params.toString();
            const response = await fetch(url);
            const result = await response.json();
            if (result.success) { setData(result); } 
            else { setError('Failed to fetch revenue data'); }
        } catch (err) { 
            setError('Error connecting to server'); 
            console.error(err);
        } finally { 
            setLoading(false); 
        }
    };

    // Apply filters
    const applyFilters = () => {
        setAppliedFilters({
            period: period,
            farmhouseId: farmhouseFilter,
            startDate: customStartDate,
            endDate: customEndDate
        });
    };

    // Reset filters
    const resetFilters = () => {
        setPeriod('month');
        setFarmhouseFilter('');
        setCustomStartDate('');
        setCustomEndDate('');
        setShowCustomDate(false);
        setAppliedFilters({
            period: 'month',
            farmhouseId: '',
            startDate: '',
            endDate: ''
        });
    };

    // Fetch when appliedFilters change
    useEffect(() => {
        fetchRevenueData();
    }, [appliedFilters]);

    const COLORS = ['#84cc16', '#d97706', '#65a30d', '#ca8a04', '#a3e635', '#f59e0b'];

    const formatCurrency = (value) => 
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

    const GrowthIndicator = ({ value }) => {
        if (value > 0) return <span className="flex items-center text-lime-500"><ArrowUp className="h-4 w-4 mr-1" />{value}%</span>;
        if (value < 0) return <span className="flex items-center text-red-500"><ArrowDown className="h-4 w-4 mr-1" />{Math.abs(value)}%</span>;
        return <span className="flex items-center text-stone-500 dark:text-stone-400"><Minus className="h-4 w-4 mr-1" />0%</span>;
    };

    const handleExport = async () => {
        if (!data) return;
        const farmhouseData = (data.byFarmhouse || []).map(f => ({
            'Farmhouse': f.farmhouseName,
            'Address': f.farmhouseAddress,
            'Total Revenue': f.statistics.totalRevenue,
            'Bookings': f.statistics.bookingCount,
            'Avg Booking Value': f.statistics.averageBookingValue
        }));
        const summaryData = [
            { Metric: 'Total Revenue', Value: data.combined?.totalRevenue || 0 },
            { Metric: 'Total Bookings', Value: data.combined?.totalBookings || 0 },
            { Metric: 'Unique Farmhouses', Value: data.combined?.uniqueFarmhouses || 0 },
            { Metric: 'Unique Users', Value: data.combined?.uniqueUsers || 0 }
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(farmhouseData), 'Farmhouses');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), 'Summary');
        XLSX.writeFile(wb, `revenue_analytics_${appliedFilters.period}.xlsx`);
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

    const { period: periodInfo, combined, byFarmhouse, trends, userDistribution, summary } = data;
    const topFarmhouse = summary?.topPerformingFarmhouse;
    const hasData = (combined?.totalRevenue > 0) || (byFarmhouse?.length > 0);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'}`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 backdrop-blur-xl border-b ${darkMode ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'}`}>
                <div className="px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${darkMode ? 'from-lime-400 to-amber-400' : 'from-lime-600 to-amber-600'}`}>
                                Revenue Analytics
                            </h1>
                            <p className={`text-sm mt-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                                {periodInfo ? `${new Date(periodInfo.start).toLocaleDateString()} - ${new Date(periodInfo.end).toLocaleDateString()}` : 'Select period'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleExport} className={`px-4 py-2 rounded-xl bg-lime-600 text-white hover:bg-lime-700 transition flex items-center gap-2`}>
                                Export Excel
                            </button>
                            <button onClick={fetchRevenueData} className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-stone-800' : 'hover:bg-lime-100'}`}>
                                <RefreshCw className={`h-5 w-5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className={`sticky top-20 z-10 backdrop-blur-md border-b ${darkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-white/60 border-lime-200'}`}>
                <div className="px-8 py-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Period Selector */}
                        <div className="flex items-center gap-2">
                            <Calendar className={`h-4 w-4 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
                            <select
                                value={period}
                                onChange={(e) => {
                                    setPeriod(e.target.value);
                                    setShowCustomDate(e.target.value === 'custom');
                                }}
                                className={`px-3 py-2 rounded-lg border outline-none text-sm ${darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-lime-300 text-stone-900'}`}
                            >
                                <option value="day">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        {/* Custom Date Range */}
                        {showCustomDate && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className={`px-3 py-2 rounded-lg border outline-none text-sm ${darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-lime-300 text-stone-900'}`}
                                />
                                <span className={`${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>to</span>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className={`px-3 py-2 rounded-lg border outline-none text-sm ${darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-lime-300 text-stone-900'}`}
                                />
                            </div>
                        )}

                        {/* Farmhouse Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className={`h-4 w-4 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`} />
                            <select
                                value={farmhouseFilter}
                                onChange={(e) => setFarmhouseFilter(e.target.value)}
                                className={`px-3 py-2 rounded-lg border outline-none text-sm ${darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-lime-300 text-stone-900'}`}
                            >
                                <option value="">All Farmhouses</option>
                                {farmhousesList.map(fh => (
                                    <option key={fh._id} value={fh._id}>{fh.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 rounded-lg bg-lime-600 text-white hover:bg-lime-700 transition text-sm font-medium"
                        >
                            Apply Filters
                        </button>
                        
                        {(period !== 'month' || farmhouseFilter || showCustomDate) && (
                            <button
                                onClick={resetFilters}
                                className={`px-4 py-2 rounded-lg border transition text-sm flex items-center gap-1 ${darkMode ? 'border-stone-600 text-stone-300 hover:bg-stone-800' : 'border-stone-400 hover:bg-stone-100'}`}
                            >
                                <X className="h-3 w-3" /> Reset
                            </button>
                        )}
                    </div>

                    {/* Active Filters Display */}
                    {(appliedFilters.farmhouseId || appliedFilters.period !== 'month') && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {appliedFilters.period !== 'month' && (
                                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-stone-700 text-stone-300' : 'bg-lime-100 text-lime-700'}`}>
                                    Period: {appliedFilters.period === 'custom' ? `${customStartDate} to ${customEndDate}` : appliedFilters.period}
                                </span>
                            )}
                            {appliedFilters.farmhouseId && (
                                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-stone-700 text-stone-300' : 'bg-lime-100 text-lime-700'}`}>
                                    Farmhouse: {farmhousesList.find(f => f._id === appliedFilters.farmhouseId)?.name || 'Selected'}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <GrowthIndicator value={combined?.growth?.revenue || 0} />
                        </div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Total Revenue</h3>
                        <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{formatCurrency(combined?.totalRevenue || 0)}</p>
                        <div className={`mt-4 flex items-center text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                            <span>{combined?.totalBookings || 0} bookings</span>
                            <span className="mx-2">•</span>
                            <span>Avg {formatCurrency(combined?.averageBookingValue || 0)}</span>
                        </div>
                    </div>

                    <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                            <Receipt className="h-6 w-6 text-white" />
                        </div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Revenue Breakdown</h3>
                        <div className="mt-4 space-y-2">
                            {[
                                { label: 'Slot Revenue', value: combined?.revenueBreakdown?.slotRevenue || 0 },
                                { label: 'Cleaning Fee', value: combined?.revenueBreakdown?.cleaningFee || 0 },
                                { label: 'Service Fee', value: combined?.revenueBreakdown?.serviceFee || 0 }
                            ].map((item, i) => (
                                <div key={i} className={`flex justify-between text-sm ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                                    <span>{item.label}</span>
                                    <span className="font-medium">{formatCurrency(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-600 to-lime-700 flex items-center justify-center mb-4">
                            <Home className="h-6 w-6 text-white" />
                        </div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Active Farmhouses</h3>
                        <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{combined?.uniqueFarmhouses || 0}</p>
                        <p className={`text-sm mt-4 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{summary?.farmhousesWithNoRevenue || 0} with no revenue</p>
                    </div>

                    <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mb-4">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Top Performer</h3>
                        {topFarmhouse ? (
                            <>
                                <p className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{topFarmhouse.name}</p>
                                <div className={`mt-4 flex items-center text-sm ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                                    <span>{formatCurrency(topFarmhouse.revenue)}</span>
                                    <span className="mx-2">•</span>
                                    <span>{topFarmhouse.bookings} bookings</span>
                                </div>
                            </>
                        ) : (
                            <p className={`text-md mt-2 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>No data available</p>
                        )}
                    </div>
                </div>

                {/* Charts */}
                {hasData ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                                {trends && trends.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={trends}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#44403c' : '#d9f99d'} />
                                            <XAxis dataKey="period" stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#d6d3d1' : '#374151' }} />
                                            <YAxis tickFormatter={(value) => chartType === 'revenue' ? `₹${value / 1000}k` : value} stroke={darkMode ? '#78716c' : '#6b7280'} tick={{ fill: darkMode ? '#d6d3d1' : '#374151' }} />
                                            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1c1917' : '#ffffff', color: darkMode ? '#e5e5e5' : '#1c1917' }} />
                                            <Area type="monotone" dataKey={chartType === 'revenue' ? 'revenue' : 'bookings'} stroke="#84cc16" fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className={`h-72 flex items-center justify-center ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>No trend data available</div>
                                )}
                            </div>

                            <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6`}>
                                <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Revenue by Farmhouse</h2>
                                {byFarmhouse && byFarmhouse.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RePieChart>
                                            <Pie data={byFarmhouse.map(f => ({ name: f.farmhouseName, value: f.statistics.totalRevenue }))}
                                                cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                                {byFarmhouse.map((_, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: darkMode ? '#1c1917' : '#ffffff', color: darkMode ? '#e5e5e5' : '#1c1917' }} />
                                            <Legend wrapperStyle={{ color: darkMode ? '#e5e5e5' : '#1c1917' }} />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className={`h-72 flex items-center justify-center ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>No farmhouse revenue data</div>
                                )}
                            </div>
                        </div>

                        {byFarmhouse && byFarmhouse.length > 0 && (
                            <div className="mb-8">
                                <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Farmhouse Performance</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {byFarmhouse.map((farmhouse) => (
                                        <div key={farmhouse.farmhouseId}
                                            className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6 cursor-pointer transition-all hover:shadow-xl`}
                                            onClick={() => setSelectedFarmhouse(selectedFarmhouse === farmhouse.farmhouseId ? null : farmhouse.farmhouseId)}>
                                            <div className="flex items-start space-x-4">
                                                <img src={farmhouse.farmhouseImage} alt={farmhouse.farmhouseName} className="w-20 h-20 rounded-xl object-cover border-2 border-lime-300" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>{farmhouse.farmhouseName}</h3>
                                                        <div className="flex items-center">
                                                            <Star className="h-4 w-4 text-amber-400 fill-current" />
                                                            <span className={`ml-1 ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>{farmhouse.farmhouseRating}</span>
                                                        </div>
                                                    </div>
                                                    <p className={`text-sm flex items-center mt-1 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                                                        <MapPin className="h-3 w-3 mr-1" />{farmhouse.farmhouseAddress}
                                                    </p>
                                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                                        <div><p className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Revenue</p><p className={`font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>{formatCurrency(farmhouse.statistics.totalRevenue)}</p></div>
                                                        <div><p className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Bookings</p><p className={`font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>{farmhouse.statistics.bookingCount}</p></div>
                                                        <div><p className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Avg Value</p><p className={`font-semibold ${darkMode ? 'text-white' : 'text-stone-900'}`}>{formatCurrency(farmhouse.statistics.averageBookingValue)}</p></div>
                                                    </div>
                                                    {selectedFarmhouse === farmhouse.farmhouseId && (
                                                        <div className="mt-6 pt-6 border-t border-stone-700">
                                                            <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>Recent Bookings</h4>
                                                            <div className="space-y-3">
                                                                {farmhouse.recentBookings.map((booking, idx) => (
                                                                    <div key={idx} className={`flex justify-between text-sm ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                                                                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                                                                        <span className="font-medium">{formatCurrency(booking.amount)}</span>
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
                        )}

                        {/* User Distribution - only show if not filtered to a single farmhouse */}
                        {!appliedFilters.farmhouseId && userDistribution && userDistribution.length > 0 && (
                            <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-6 mb-8`}>
                                <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-lime-400' : 'text-lime-700'}`}>Top Users by Farmhouse</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {userDistribution.slice(0, 4).map((farmhouse) => (
                                        <div key={farmhouse.farmhouseId}>
                                            <h3 className={`text-md font-medium mb-4 ${darkMode ? 'text-stone-200' : 'text-stone-800'}`}>{farmhouse.farmhouseName}</h3>
                                            <div className="space-y-4">
                                                {farmhouse.topUsers.slice(0, 5).map((user, idx) => (
                                                    <div key={user.userId} className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                                                idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-stone-400' : 'bg-lime-500'
                                                            }`}>{idx + 1}</div>
                                                            <span className={`text-sm ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>User {user.userId.slice(-8)}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`text-sm font-medium ${darkMode ? 'text-stone-200' : 'text-stone-800'}`}>{user.bookingCount} bookings</p>
                                                            <p className="text-xs text-lime-500">{formatCurrency(user.totalSpent)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={`rounded-2xl border ${darkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-lime-200'} p-12 text-center`}>
                        <TrendingUp className="h-16 w-16 mx-auto mb-4 text-stone-400" />
                        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>No Revenue Data</h3>
                        <p className={`${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>No bookings or revenue found for the selected period. Try changing the filters.</p>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className={`rounded-xl border ${darkMode ? 'bg-stone-800/30 border-stone-700' : 'bg-lime-50 border-lime-200'} p-4`}>
                        <div className={`flex items-center ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}><Activity className="h-5 w-5 mr-2" /><span>Avg Revenue per Farmhouse</span></div>
                        <p className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{formatCurrency(summary?.averageRevenuePerFarmhouse || 0)}</p>
                    </div>
                    <div className={`rounded-xl border ${darkMode ? 'bg-stone-800/30 border-stone-700' : 'bg-lime-50 border-lime-200'} p-4`}>
                        <div className={`flex items-center ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}><Target className="h-5 w-5 mr-2" /><span>Avg Bookings per Farmhouse</span></div>
                        <p className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{summary?.averageBookingsPerFarmhouse || 0}</p>
                    </div>
                    <div className={`rounded-xl border ${darkMode ? 'bg-stone-800/30 border-stone-700' : 'bg-lime-50 border-lime-200'} p-4`}>
                        <div className={`flex items-center ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}><Users className="h-5 w-5 mr-2" /><span>Unique Users</span></div>
                        <p className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-stone-900'}`}>{combined?.uniqueUsers || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Revenue;