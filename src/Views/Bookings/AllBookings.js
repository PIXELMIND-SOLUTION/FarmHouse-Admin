import React, { useState, useEffect } from 'react';
import {
  Calendar, Search, Filter, RefreshCw, Eye,
  CheckCircle, XCircle, Clock, AlertCircle, DollarSign,
  ChevronLeft, ChevronRight, ArrowUpDown, TrendingUp, Award, Trash2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

const API = 'http://31.97.206.144:5124/api/order/admin/summary';
const DELETE_API = (id) => `http://31.97.206.144:5124/api/order/deletebooking/${id}`;

// ─── SAFE HELPERS ─────────────────────────────────────────
const safe    = (val, fallback = '—')  => (val != null ? val : fallback);
const safeNum = (val, fallback = 0)    => (typeof val === 'number' && !isNaN(val) ? val : fallback);
const safeArr = (val)                  => (Array.isArray(val) ? val : []);
const safeStr = (val, fallback = '')   => (typeof val === 'string' ? val : fallback);
const safeDate = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};
const fmt = (dateVal, opts) => {
  const d = safeDate(dateVal);
  if (!d) return '—';
  return d.toLocaleDateString('en-IN', opts || { day: '2-digit', month: 'short', year: 'numeric' });
};
const fmtTime = (dateVal) => {
  const d = safeDate(dateVal);
  if (!d) return '—';
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};
const fmtMoney = (val) => `₹${safeNum(val).toLocaleString('en-IN')}`;

// ─── MAIN COMPONENT ───────────────────────────────────────
const AllBookings = ({ darkMode }) => {
  const dm = darkMode;

  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setPage]      = useState(1);
  const [sortField, setSortField]   = useState('date');
  const [sortDir, setSortDir]       = useState('desc');
  const [selected, setSelected]     = useState(null);
  const [showModal, setShowModal]   = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting]           = useState(false);
  const [deleteError, setDeleteError]     = useState(null);
  const [toast, setToast]                 = useState(null);

  const itemsPerPage = 10;

  // TOAST HELPER
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // FETCH
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res    = await fetch(API);
      const result = await res.json();
      if (result?.success) {
        setData(result);
      } else {
        setError(result?.message || 'Failed to fetch bookings data');
      }
    } catch {
      setError('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // DELETE HANDLER
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      const res    = await fetch(DELETE_API(deleteTarget._id), { method: 'DELETE' });
      const result = await res.json();
      if (res.ok || result?.success) {
        // Optimistically remove from local state
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentBookings: safeArr(prev.recentBookings).filter((b) => b._id !== deleteTarget._id),
          };
        });
        setShowDeleteModal(false);
        setDeleteTarget(null);
        showToast(`Booking deleted successfully.`);
      } else {
        setDeleteError(result?.message || 'Failed to delete booking. Please try again.');
      }
    } catch {
      setDeleteError('Error connecting to server. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (e, booking) => {
    e.stopPropagation();
    setDeleteTarget(booking);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  // SORT TOGGLE
  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  // FILTER + SORT
  const getFiltered = () => {
    let list = safeArr(data?.recentBookings);
    const s  = safeStr(searchTerm).toLowerCase();

    if (s) {
      list = list.filter((b) =>
        safeStr(b?.farmhouse?.name).toLowerCase().includes(s) ||
        safeStr(b?.user?.email).toLowerCase().includes(s)    ||
        safeStr(b?._id).toLowerCase().includes(s)
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter((b) => safeStr(b?.status) === statusFilter);
    }
    const now = new Date();
    if (dateFilter === 'today') {
      list = list.filter((b) => {
        const d = safeDate(b?.date);
        return d && d.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'week') {
      const ago = new Date(); ago.setDate(ago.getDate() - 7);
      list = list.filter((b) => { const d = safeDate(b?.date); return d && d >= ago; });
    } else if (dateFilter === 'month') {
      const ago = new Date(); ago.setMonth(ago.getMonth() - 1);
      list = list.filter((b) => { const d = safeDate(b?.date); return d && d >= ago; });
    }

    list.sort((a, b) => {
      let av, bv;
      if (sortField === 'date')   { av = safeDate(a?.date)?.getTime() ?? 0; bv = safeDate(b?.date)?.getTime() ?? 0; }
      else if (sortField === 'amount') { av = safeNum(a?.totalAmount); bv = safeNum(b?.totalAmount); }
      else if (sortField === 'status') { av = safeStr(a?.status); bv = safeStr(b?.status); }
      else { av = 0; bv = 0; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  };

  const filtered   = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // SAFE SUMMARY
  const summary    = data?.summary || {};
  const confirmed  = summary?.confirmed || {};
  const revenue    = data?.revenue || {};
  const weekly     = safeArr(data?.weeklyStats);
  const topFarms   = safeArr(data?.topFarmhouses);

  const total     = safeNum(summary?.total);
  const todayCount= safeNum(summary?.today);
  const active    = safeNum(confirmed?.active);
  const upcoming  = safeNum(confirmed?.upcoming);
  const completed = safeNum(confirmed?.completed);
  const totalRev  = safeNum(revenue?.totalRevenue);
  const avgVal    = safeNum(revenue?.avgBookingValue);
  const compRate  = total > 0 ? Math.round((completed / total) * 100) : 0;

  // EXPORT CSV
  const exportCSV = () => {
    const header = ['Booking ID', 'Farmhouse', 'Address', 'Customer Email', 'Date', 'Check-in', 'Amount', 'Status'];
    const rows   = filtered.map((b) => [
      safeStr(b?._id),
      safeStr(b?.farmhouse?.name),
      safeStr(b?.farmhouse?.address),
      safeStr(b?.user?.email, 'Guest'),
      fmt(b?.date),
      fmtTime(b?.checkIn),
      safeNum(b?.totalAmount),
      safeStr(b?.status),
    ]);
    const csv  = 'data:text/csv;charset=utf-8,' + [header, ...rows].map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href  = encodeURI(csv);
    link.download = `bookings-${Date.now()}.csv`;
    link.click();
  };

  // ── INPUT CLASS ──
  const inputCls = `px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-lime-500 transition text-sm
    ${dm ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500' : 'bg-white border-lime-300 text-stone-900 placeholder-stone-400'}`;

  // ── LOADING ──
  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${dm ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto ${dm ? 'border-lime-500' : 'border-lime-600'}`} />
        <p className={`mt-4 text-sm font-medium ${dm ? 'text-stone-400' : 'text-stone-600'}`}>Loading bookings...</p>
      </div>
    </div>
  );

  // ── ERROR ──
  if (error || !data) return (
    <div className={`min-h-screen flex items-center justify-center ${dm ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100'}`}>
      <div className="text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className={`text-lg font-semibold mb-2 ${dm ? 'text-stone-200' : 'text-stone-700'}`}>{error || 'Failed to load data'}</p>
        <button onClick={fetchData}
          className="mt-2 px-6 py-2.5 bg-gradient-to-r from-lime-500 to-lime-600 text-white rounded-xl hover:scale-105 transition shadow-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dm ? 'bg-stone-900 text-white' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100 text-stone-900'}`}>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold animate-fade-in transition-all
          ${toast.type === 'success'
            ? dm ? 'bg-lime-500/20 border-lime-500/40 text-lime-300' : 'bg-lime-50 border-lime-300 text-lime-700'
            : dm ? 'bg-red-500/20 border-red-500/40 text-red-300'   : 'bg-red-50 border-red-300 text-red-700'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── STICKY HEADER ── */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl border-b ${dm ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'}`}>
        <div className="px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${dm ? 'from-lime-400 to-amber-400' : 'from-lime-600 to-amber-600'}`}>
              Bookings Management
            </h1>
            <p className={`text-sm mt-0.5 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>
              Track and manage all farmhouse bookings
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCSV}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition
                ${dm ? 'border-lime-500/30 text-lime-400 hover:bg-lime-500/10' : 'border-lime-400 text-lime-700 hover:bg-lime-50'}`}
            >
              ↓ Export CSV
            </button>
            <button onClick={fetchData}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-lime-500 to-lime-600 hover:scale-105 transition shadow-[0_0_20px_rgba(132,204,22,.4)]"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">

        {/* ── STAT CARDS ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Bookings"   value={total}         sub={`+${todayCount} today`}            icon={<Calendar className="h-5 w-5" />} gradient="from-lime-500 to-lime-600"   dm={dm} />
          <StatCard label="Total Revenue"    value={fmtMoney(totalRev)} sub={`Avg ${fmtMoney(avgVal)}/booking`} icon={<DollarSign className="h-5 w-5" />} gradient="from-amber-500 to-amber-600" dm={dm} />
          <StatCard label="Active Bookings"  value={active}        sub={`Upcoming: ${upcoming} · Done: ${completed}`} icon={<Clock className="h-5 w-5" />} gradient="from-lime-600 to-lime-700" dm={dm} />
          <StatCard label="Completion Rate"  value={`${compRate}%`} sub={`${completed} of ${total} completed`} icon={<Award className="h-5 w-5" />} gradient="from-amber-600 to-amber-700" dm={dm} />
        </div>

        {/* ── CHARTS ── */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Weekly Chart */}
          <div className={`rounded-2xl border p-6 ${dm ? 'bg-stone-800/60 border-stone-700' : 'bg-white border-lime-200 shadow-lg'}`}>
            <h2 className={`text-base font-bold mb-5 ${dm ? 'text-lime-400' : 'text-lime-700'}`}>Weekly Bookings & Revenue</h2>
            {weekly.length === 0 ? (
              <div className="flex items-center justify-center h-48 opacity-40">
                <p className="text-sm">No weekly data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={weekly} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dm ? '#44403c' : '#d9f99d'} />
                  <XAxis dataKey="_id" tick={{ fill: dm ? '#a8a29e' : '#6b7280', fontSize: 11 }} stroke="none" />
                  <YAxis yAxisId="l" tick={{ fill: dm ? '#a8a29e' : '#6b7280', fontSize: 11 }} stroke="none" />
                  <YAxis yAxisId="r" orientation="right" tick={{ fill: dm ? '#a8a29e' : '#6b7280', fontSize: 11 }} stroke="none" />
                  <Tooltip
                    contentStyle={{ backgroundColor: dm ? '#1c1917' : '#fff', borderColor: dm ? '#44403c' : '#d9f99d', borderRadius: 12, fontSize: 12 }}
                    formatter={(v, n) => [n === 'revenue' ? fmtMoney(v) : v, n === 'revenue' ? 'Revenue' : 'Bookings']}
                  />
                  <Bar yAxisId="l" dataKey="count"   fill="#84cc16" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="r" dataKey="revenue" fill="#d97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top Farmhouses */}
          <div className={`rounded-2xl border p-6 ${dm ? 'bg-stone-800/60 border-stone-700' : 'bg-white border-lime-200 shadow-lg'}`}>
            <h2 className={`text-base font-bold mb-5 ${dm ? 'text-lime-400' : 'text-lime-700'}`}>Top Performing Farmhouses</h2>
            {topFarms.length === 0 ? (
              <div className="flex items-center justify-center h-48 opacity-40">
                <p className="text-sm">No farmhouse data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topFarms.map((f, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${dm ? 'bg-stone-700/50' : 'bg-lime-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br
                        ${i === 0 ? 'from-amber-400 to-amber-600' : i === 1 ? 'from-stone-400 to-stone-600' : 'from-lime-500 to-lime-700'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${dm ? 'text-white' : 'text-stone-900'}`}>{safe(f?.name)}</p>
                        <p className={`text-xs ${dm ? 'text-stone-400' : 'text-stone-500'}`}>{safeNum(f?.bookingCount)} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${dm ? 'text-lime-400' : 'text-lime-700'}`}>{fmtMoney(f?.revenue)}</p>
                      <p className={`text-xs ${dm ? 'text-stone-500' : 'text-stone-400'}`}>revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── TABLE CARD ── */}
        <div className={`rounded-2xl border overflow-hidden ${dm ? 'bg-stone-800/60 border-stone-700 shadow-[0_0_40px_rgba(132,204,22,.08)]' : 'bg-white border-lime-200 shadow-xl'}`}>

          {/* FILTERS */}
          <div className={`p-5 border-b ${dm ? 'border-stone-700' : 'border-lime-100'}`}>
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lime-500/50" />
                <input
                  placeholder="Search farmhouse, email, ID..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className={`${inputCls} pl-9 w-full`}
                />
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <select value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={inputCls}>
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                </select>
                <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} className={inputCls}>
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
            {/* META */}
            <p className={`text-xs mt-3 ${dm ? 'text-stone-500' : 'text-stone-400'}`}>
              Showing {paginated.length} of {filtered.length} bookings
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${dm ? 'bg-stone-700/40 border-stone-700' : 'bg-lime-50 border-lime-100'}`}>
                  {[
                    { label: 'Booking ID', sortKey: null },
                    { label: 'Farmhouse',  sortKey: null },
                    { label: 'Customer',   sortKey: null },
                    { label: 'Date',       sortKey: 'date' },
                    { label: 'Amount',     sortKey: 'amount' },
                    { label: 'Status',     sortKey: 'status' },
                    { label: 'Actions',    sortKey: null },
                  ].map(({ label, sortKey }) => (
                    <th
                      key={label}
                      onClick={() => sortKey && toggleSort(sortKey)}
                      className={`px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest
                        ${sortKey ? 'cursor-pointer select-none' : ''}
                        ${dm ? 'text-lime-400/70 hover:text-lime-400' : 'text-lime-600 hover:text-lime-800'}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {label}
                        {sortKey && <ArrowUpDown className={`h-3 w-3 ${sortField === sortKey ? 'opacity-100' : 'opacity-30'}`} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 opacity-40">
                      <Calendar className="h-10 w-10 mx-auto mb-3 text-lime-500" />
                      <p className="text-sm">No bookings found</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((b) => {
                    const bookingId  = safeStr(b?._id);
                    const farmName   = safe(b?.farmhouse?.name);
                    const farmAddr   = safe(b?.farmhouse?.address, '');
                    const farmImg    = safeArr(b?.farmhouse?.images)[0] || null;
                    const email      = safe(b?.user?.email, 'Guest User');
                    const amount     = safeNum(b?.totalAmount);
                    const status     = safeStr(b?.status, 'pending');
                    const bookDate   = b?.date;
                    const checkIn    = b?.checkIn;

                    return (
                      <tr key={bookingId}
                        onClick={() => { setSelected(b); setShowModal(true); }}
                        className={`border-b cursor-pointer transition-all ${dm ? 'border-stone-700 hover:bg-stone-700/40' : 'border-lime-100 hover:bg-lime-50'}`}
                      >
                        {/* ID */}
                        <td className="px-5 py-4">
                          <code className={`text-xs font-mono px-2 py-1 rounded-lg
                            ${dm ? 'bg-lime-500/10 text-lime-300' : 'bg-lime-50 text-lime-700'}`}>
                            {bookingId ? `…${bookingId.slice(-8)}` : '—'}
                          </code>
                        </td>
                        {/* Farmhouse */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {farmImg
                              ? <img src={farmImg} alt={farmName} className="w-10 h-10 rounded-xl object-cover border-2 border-lime-300 shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                              : <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dm ? 'bg-lime-500/10' : 'bg-lime-100'}`}><Calendar className="h-4 w-4 text-lime-500" /></div>
                            }
                            <div>
                              <p className={`font-semibold text-sm ${dm ? 'text-white' : 'text-stone-900'}`}>{farmName}</p>
                              {farmAddr && <p className={`text-xs truncate max-w-[150px] ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{farmAddr}</p>}
                            </div>
                          </div>
                        </td>
                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className={`text-sm ${dm ? 'text-stone-300' : 'text-stone-700'}`}>{email}</p>
                        </td>
                        {/* Date */}
                        <td className="px-5 py-4">
                          <p className={`text-sm font-medium ${dm ? 'text-white' : 'text-stone-900'}`}>{fmt(bookDate)}</p>
                          <p className={`text-xs ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{fmtTime(checkIn)}</p>
                        </td>
                        {/* Amount */}
                        <td className="px-5 py-4">
                          <span className={`font-bold ${dm ? 'text-lime-400' : 'text-lime-700'}`}>{fmtMoney(amount)}</span>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusBadge status={status} dm={dm} />
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {/* View */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelected(b); setShowModal(true); }}
                              className={`p-2 rounded-xl border transition hover:scale-110
                                ${dm ? 'border-lime-500/20 text-lime-400 hover:bg-lime-500/10' : 'border-lime-300 text-lime-600 hover:bg-lime-50'}`}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={(e) => openDeleteModal(e, b)}
                              className={`p-2 rounded-xl border transition hover:scale-110
                                ${dm ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'border-red-200 text-red-500 hover:bg-red-50'}`}
                              title="Delete Booking"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className={`flex flex-wrap justify-between items-center px-5 py-4 border-t ${dm ? 'border-stone-700' : 'border-lime-100'}`}>
            <p className={`text-sm ${dm ? 'text-stone-400' : 'text-stone-500'}`}>
              Page <span className={`font-bold ${dm ? 'text-lime-400' : 'text-lime-600'}`}>{currentPage}</span> of {totalPages}
              &nbsp;·&nbsp;{filtered.length} records
            </p>
            <div className="flex gap-2 items-center">
              <PageBtn onClick={() => setPage(1)} disabled={currentPage === 1} dm={dm}>«</PageBtn>
              <PageBtn onClick={() => setPage((p) => p - 1)} disabled={currentPage === 1} dm={dm}><ChevronLeft className="h-4 w-4" /></PageBtn>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                const num   = start + i;
                return num <= totalPages ? (
                  <button key={num} onClick={() => setPage(num)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition
                      ${num === currentPage
                        ? 'bg-gradient-to-r from-lime-500 to-lime-600 text-white shadow-[0_0_12px_rgba(132,204,22,.4)]'
                        : dm ? 'text-stone-400 hover:bg-stone-700 hover:text-white' : 'text-stone-500 hover:bg-lime-50'
                      }`}
                  >{num}</button>
                ) : null;
              })}
              <PageBtn onClick={() => setPage((p) => p + 1)} disabled={currentPage >= totalPages} dm={dm}><ChevronRight className="h-4 w-4" /></PageBtn>
              <PageBtn onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} dm={dm}>»</PageBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ── DETAILS MODAL ── */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border z-10 overflow-hidden
            ${dm ? 'bg-stone-800 border-stone-700' : 'bg-white border-lime-200'}`}
          >
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dm ? 'border-stone-700' : 'border-lime-200'}`}>
              <h3 className={`text-lg font-extrabold bg-gradient-to-r from-lime-500 to-amber-500 bg-clip-text text-transparent`}>
                Booking Details
              </h3>
              <button onClick={() => setShowModal(false)}
                className={`p-2 rounded-xl border transition ${dm ? 'border-stone-600 text-stone-400 hover:bg-stone-700' : 'border-lime-200 text-stone-500 hover:bg-lime-50'}`}>
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Booking ID',  value: safeStr(selected?._id) || '—', mono: true },
                  { label: 'Status',      value: null, badge: safeStr(selected?.status, 'pending') },
                  { label: 'Farmhouse',   value: safe(selected?.farmhouse?.name) },
                  { label: 'Address',     value: safe(selected?.farmhouse?.address, 'N/A') },
                  { label: 'Customer',    value: safe(selected?.user?.email, 'Guest User') },
                  { label: 'User ID',     value: safe(selected?.user?._id, 'N/A'), mono: true },
                  { label: 'Date',        value: fmt(selected?.date) },
                  { label: 'Check-in',    value: fmtTime(selected?.checkIn) },
                  { label: 'Amount',      value: fmtMoney(selected?.totalAmount), highlight: true },
                  { label: 'Created At',  value: selected?.createdAt ? new Date(selected.createdAt).toLocaleString('en-IN') : '—' },
                ].map(({ label, value, badge, mono, highlight }) => (
                  <div key={label} className={`p-3 rounded-xl ${dm ? 'bg-stone-700/50' : 'bg-lime-50'}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dm ? 'text-lime-400/70' : 'text-lime-600'}`}>{label}</p>
                    {badge
                      ? <StatusBadge status={badge} dm={dm} />
                      : mono
                        ? <code className={`text-xs font-mono break-all ${dm ? 'text-stone-300' : 'text-stone-600'}`}>{value}</code>
                        : highlight
                          ? <p className={`font-extrabold text-lg ${dm ? 'text-lime-400' : 'text-lime-600'}`}>{value}</p>
                          : <p className={`text-sm font-medium ${dm ? 'text-white' : 'text-stone-800'}`}>{value}</p>
                    }
                  </div>
                ))}
              </div>

              {/* Farmhouse Images */}
              {safeArr(selected?.farmhouse?.images).length > 0 && (
                <div className="mt-5">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${dm ? 'text-lime-400/70' : 'text-lime-600'}`}>Farmhouse Images</p>
                  <div className="grid grid-cols-3 gap-3">
                    {safeArr(selected.farmhouse.images).map((img, i) => (
                      <img key={i} src={img} alt={`Farm ${i + 1}`}
                        className="w-full h-24 object-cover rounded-xl border-2 border-lime-300"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`flex justify-end gap-3 px-6 py-4 border-t ${dm ? 'border-stone-700' : 'border-lime-200'}`}>
              <button onClick={() => setShowModal(false)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition
                  ${dm ? 'border-stone-600 text-stone-300 hover:bg-stone-700' : 'border-lime-200 text-stone-600 hover:bg-lime-50'}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border z-10 overflow-hidden
            ${dm ? 'bg-stone-800 border-stone-700' : 'bg-white border-red-200'}`}
          >
            {/* Header */}
            <div className={`flex items-center gap-3 px-6 py-4 border-b ${dm ? 'border-stone-700' : 'border-red-100'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <h3 className={`text-lg font-extrabold ${dm ? 'text-white' : 'text-stone-900'}`}>Delete Booking</h3>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className={`text-sm mb-4 ${dm ? 'text-stone-300' : 'text-stone-600'}`}>
                Are you sure you want to permanently delete this booking? This action cannot be undone.
              </p>

              {/* Booking summary */}
              <div className={`rounded-xl p-4 space-y-2 ${dm ? 'bg-stone-700/50' : 'bg-red-50'}`}>
                <div className="flex justify-between text-sm">
                  <span className={dm ? 'text-stone-400' : 'text-stone-500'}>Booking ID</span>
                  <code className={`text-xs font-mono ${dm ? 'text-red-300' : 'text-red-600'}`}>…{safeStr(deleteTarget._id).slice(-8)}</code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={dm ? 'text-stone-400' : 'text-stone-500'}>Farmhouse</span>
                  <span className={`font-semibold ${dm ? 'text-white' : 'text-stone-800'}`}>{safe(deleteTarget?.farmhouse?.name)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={dm ? 'text-stone-400' : 'text-stone-500'}>Amount</span>
                  <span className={`font-bold ${dm ? 'text-red-400' : 'text-red-600'}`}>{fmtMoney(deleteTarget?.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={dm ? 'text-stone-400' : 'text-stone-500'}>Customer</span>
                  <span className={`text-xs ${dm ? 'text-stone-300' : 'text-stone-700'}`}>{safe(deleteTarget?.user?.email, 'Guest User')}</span>
                </div>
              </div>

              {/* Error */}
              {deleteError && (
                <div className={`mt-4 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm
                  ${dm ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-red-50 border-red-300 text-red-600'}`}>
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {deleteError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex justify-end gap-3 px-6 py-4 border-t ${dm ? 'border-stone-700' : 'border-red-100'}`}>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); setDeleteError(null); }}
                disabled={deleting}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition disabled:opacity-50
                  ${dm ? 'border-stone-600 text-stone-300 hover:bg-stone-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                  bg-gradient-to-r from-red-500 to-red-600 hover:scale-105 transition shadow-lg disabled:opacity-50 disabled:hover:scale-100"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, gradient, dm }) => (
  <div className={`relative overflow-hidden rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-xl
    ${dm ? 'bg-stone-800/60 border-stone-700' : 'bg-white border-lime-200 shadow-md'}`}
  >
    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-20 bg-lime-400 pointer-events-none" />
    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3 shadow-lg`}>
      {icon}
    </div>
    <p className={`text-xs font-semibold uppercase tracking-widest ${dm ? 'text-stone-400' : 'text-stone-500'}`}>{label}</p>
    <p className={`text-2xl font-extrabold mt-1 ${dm ? 'text-white' : 'text-stone-900'}`}>{value}</p>
    {sub && <p className={`text-xs mt-1 ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{sub}</p>}
  </div>
);

// ─── STATUS BADGE ─────────────────────────────────────────
const StatusBadge = ({ status, dm }) => {
  const cfg = {
    confirmed: { cls: dm ? 'bg-lime-500/20 text-lime-400 border-lime-500/30'   : 'bg-lime-100 text-lime-700 border-lime-300',   icon: CheckCircle, label: 'Confirmed' },
    completed: { cls: dm ? 'bg-lime-500/20 text-lime-400 border-lime-500/30'   : 'bg-lime-100 text-lime-700 border-lime-300',   icon: CheckCircle, label: 'Completed' },
    active:    { cls: dm ? 'bg-lime-500/20 text-lime-400 border-lime-500/30'   : 'bg-lime-100 text-lime-700 border-lime-300',   icon: Clock,       label: 'Active'    },
    pending:   { cls: dm ? 'bg-amber-500/20 text-amber-400 border-amber-500/30': 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock,       label: 'Pending'   },
    upcoming:  { cls: dm ? 'bg-amber-500/20 text-amber-400 border-amber-500/30': 'bg-amber-100 text-amber-700 border-amber-300', icon: Calendar,    label: 'Upcoming'  },
    cancelled: { cls: dm ? 'bg-red-500/20 text-red-400 border-red-500/30'      : 'bg-red-100 text-red-700 border-red-300',      icon: XCircle,     label: 'Cancelled' },
  };
  const s    = cfg[status] || cfg.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.cls}`}>
      <Icon className="h-3 w-3" />{s.label}
    </span>
  );
};

// ─── PAGINATION BUTTON ────────────────────────────────────
const PageBtn = ({ children, disabled, onClick, dm }) => (
  <button disabled={disabled} onClick={onClick}
    className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition
      ${dm ? 'border-stone-700 text-stone-400 hover:bg-stone-700 hover:text-white disabled:opacity-20' : 'border-lime-200 text-stone-400 hover:bg-lime-50 disabled:opacity-30'}
      disabled:cursor-not-allowed`}
  >{children}</button>
);

export default AllBookings;