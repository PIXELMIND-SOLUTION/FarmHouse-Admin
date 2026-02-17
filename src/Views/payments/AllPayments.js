import React, { useState, useEffect } from 'react';
import {
  Search, RefreshCw, Eye, ArrowUpDown, ChevronLeft, ChevronRight,
  Calendar, DollarSign, CreditCard, Clock, CheckCircle, XCircle,
  AlertCircle, Building, User, Mail, Phone, MapPin, Receipt,
  FileText, Star, Award, Filter, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

// ─── SAFE HELPERS ─────────────────────────────────────────
const safe    = (v, fb = '—')  => (v != null && v !== '' ? v : fb);
const safeNum = (v, fb = 0)    => (typeof v === 'number' && !isNaN(v) ? v : (parseFloat(v) || fb));
const safeArr = (v)             => (Array.isArray(v) ? v : []);
const safeStr = (v, fb = '')   => (typeof v === 'string' ? v : String(v ?? fb));
const safeDate = (v) => { if (!v) return null; const d = new Date(v); return isNaN(d.getTime()) ? null : d; };
const fmt     = (v, opts)      => { const d = safeDate(v); return d ? d.toLocaleDateString('en-IN', opts) : '—'; };
const fmtTime = (v)            => { const d = safeDate(v); return d ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'; };
const fmtDT   = (v)            => { const d = safeDate(v); return d ? d.toLocaleString('en-IN') : '—'; };
const fmtMon  = (v)            => `₹${safeNum(v).toLocaleString('en-IN')}`;

const LIME_COLORS = ['#84cc16', '#d97706', '#65a30d', '#ca8a04', '#a3e635', '#bef264'];

// ─────────────────────────────────────────────────────────
// SHARED SUB-COMPONENTS
// ─────────────────────────────────────────────────────────
const StatusBadge = ({ status, dm }) => {
  const cfg = {
    completed: { cls: dm ? 'bg-lime-500/20 text-lime-400 border-lime-500/30'   : 'bg-lime-100 text-lime-700 border-lime-300',   Icon: CheckCircle, label: 'Completed' },
    pending:   { cls: dm ? 'bg-amber-500/20 text-amber-400 border-amber-500/30': 'bg-amber-100 text-amber-700 border-amber-300', Icon: Clock,       label: 'Pending'   },
    failed:    { cls: dm ? 'bg-red-500/20 text-red-400 border-red-500/30'      : 'bg-red-100 text-red-700 border-red-300',      Icon: XCircle,     label: 'Failed'    },
    refunded:  { cls: dm ? 'bg-stone-500/20 text-stone-400 border-stone-500/30': 'bg-stone-100 text-stone-700 border-stone-300', Icon: Award,       label: 'Refunded'  },
  };
  const s = cfg[safeStr(status).toLowerCase()] || cfg.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.cls}`}>
      <s.Icon className="h-3 w-3" />{s.label}
    </span>
  );
};

const PageBtn = ({ children, disabled, onClick, dm }) => (
  <button disabled={disabled} onClick={onClick}
    className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm transition
      ${dm ? 'border-stone-700 text-stone-400 hover:bg-stone-700 hover:text-white disabled:opacity-20'
           : 'border-lime-200 text-stone-400 hover:bg-lime-50 disabled:opacity-30'}
      disabled:cursor-not-allowed`}
  >{children}</button>
);

const SectionCard = ({ dm, children, className = '' }) => (
  <div className={`rounded-2xl border p-6 ${dm ? 'bg-stone-800/60 border-stone-700' : 'bg-white border-lime-200 shadow-md'} ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, label, dm }) => (
  <h2 className={`text-base font-bold mb-5 flex items-center gap-2 ${dm ? 'text-lime-400' : 'text-lime-700'}`}>
    <Icon className="h-5 w-5" />{label}
  </h2>
);

// ─────────────────────────────────────────────────────────
// PAYMENT DETAILS PAGE
// ─────────────────────────────────────────────────────────
const PaymentDetails = ({ paymentId, darkMode: dm, onBack }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => { if (paymentId) fetch_(); }, [paymentId]);

  const fetch_ = async () => {
    try {
      setLoading(true); setError(null);
      const res    = await fetch(`http://31.97.206.144:5124/api/order/payments/${paymentId}`);
      const result = await res.json();
      if (result?.success) setPayment(result.payment);
      else setError(result?.message || 'Failed to fetch payment details');
    } catch { setError('Error connecting to server'); }
    finally { setLoading(false); }
  };

  const bg = dm ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100';

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto ${dm ? 'border-lime-500' : 'border-lime-600'}`} />
        <p className={`mt-4 text-sm ${dm ? 'text-stone-400' : 'text-stone-600'}`}>Loading payment details…</p>
      </div>
    </div>
  );

  if (error || !payment) return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className="text-center">
        <AlertCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
        <p className={`text-base font-semibold ${dm ? 'text-stone-300' : 'text-stone-700'}`}>{error || 'No payment data'}</p>
        <button onClick={onBack} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-lime-500 to-lime-600 text-white rounded-xl hover:scale-105 transition shadow-lg">Go Back</button>
      </div>
    </div>
  );

  // safe accessors
  const summary     = payment?.summary     || {};
  const timeline    = payment?.timeline    || {};
  const identifiers = payment?.identifiers || {};
  const financial   = payment?.financial   || {};
  const breakdown   = financial?.breakdown || {};
  const razorpay    = payment?.razorpay    || {};
  const booking     = payment?.booking     || {};
  const farmhouse   = payment?.farmhouse   || {};
  const pUser       = payment?.user        || {};

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl border-b ${dm ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'}`}>
        <div className="px-8 py-5 flex items-center gap-4">
          <button onClick={onBack} className={`p-2 rounded-xl transition ${dm ? 'hover:bg-stone-800' : 'hover:bg-lime-100'}`}>
            <ChevronLeft className={`h-5 w-5 ${dm ? 'text-stone-400' : 'text-stone-600'}`} />
          </button>
          <div>
            <h1 className={`text-2xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${dm ? 'from-lime-400 to-amber-400' : 'from-lime-600 to-amber-600'}`}>
              Payment Details
            </h1>
            <p className={`text-xs mt-0.5 font-mono ${dm ? 'text-stone-500' : 'text-stone-400'}`}>
              {safe(identifiers?.transactionId)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Top stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: 'Payment Status',
              content: (
                <div className="flex items-center gap-3 mt-2">
                  {safeStr(summary?.paymentStatus) === 'completed'
                    ? <CheckCircle className="h-8 w-8 text-lime-500" />
                    : <Clock className="h-8 w-8 text-amber-500" />}
                  <div>
                    <p className={`text-lg font-bold capitalize ${dm ? 'text-white' : 'text-stone-900'}`}>{safe(summary?.paymentStatus)}</p>
                    <p className={`text-xs ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{fmtDT(timeline?.createdAt)}</p>
                  </div>
                </div>
              ),
            },
            {
              label: 'Amount Paid',
              icon: <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center"><DollarSign className="h-5 w-5 text-white" /></div>,
              value: fmtMon(summary?.totalPaid),
              sub: `Net: ${fmtMon(summary?.netAmount)}`,
            },
            {
              label: 'Payment Method',
              icon: <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center"><CreditCard className="h-5 w-5 text-white" /></div>,
              value: safe(summary?.paymentMethod),
              sub: safe(razorpay?.bank, 'N/A'),
            },
            {
              label: 'Booking Status',
              icon: <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-600 to-lime-700 flex items-center justify-center"><Calendar className="h-5 w-5 text-white" /></div>,
              value: safe(summary?.bookingStatus),
              sub: safe(booking?.label),
            },
          ].map((card, i) => (
            <SectionCard key={i} dm={dm}>
              <p className={`text-xs font-bold uppercase tracking-widest ${dm ? 'text-lime-400/70' : 'text-lime-600'}`}>{card.label}</p>
              {card.content || (
                <div className="flex items-center gap-3 mt-2">
                  {card.icon}
                  <div>
                    <p className={`text-lg font-bold capitalize ${dm ? 'text-white' : 'text-stone-900'}`}>{card.value}</p>
                    <p className={`text-xs ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{card.sub}</p>
                  </div>
                </div>
              )}
            </SectionCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left col */}
          <div className="lg:col-span-2 space-y-6">

            {/* Customer */}
            <SectionCard dm={dm}>
              <SectionTitle icon={User} label="Customer Information" dm={dm} />
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: safe(pUser?.name) },
                  { label: 'Email',     value: safe(pUser?.email), icon: <Mail className="h-4 w-4 text-lime-500" /> },
                  { label: 'Phone',     value: safe(pUser?.phone), icon: <Phone className="h-4 w-4 text-lime-500" /> },
                  { label: 'Joined',    value: fmt(pUser?.joinedAt) },
                ].map(({ label, value, icon }) => (
                  <div key={label} className={`p-3 rounded-xl ${dm ? 'bg-stone-700/40' : 'bg-lime-50'}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dm ? 'text-lime-400/70' : 'text-lime-600'}`}>{label}</p>
                    <p className={`text-sm font-medium flex items-center gap-1 ${dm ? 'text-white' : 'text-stone-900'}`}>{icon}{value}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Farmhouse */}
            <SectionCard dm={dm}>
              <SectionTitle icon={Building} label="Farmhouse Details" dm={dm} />
              <div className="flex flex-col lg:flex-row gap-5">
                {safeArr(farmhouse?.images)[0] && (
                  <img src={safeArr(farmhouse.images)[0]} alt={safe(farmhouse?.name)}
                    className="w-full lg:w-44 h-32 object-cover rounded-xl border-2 border-lime-300"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-1 ${dm ? 'text-white' : 'text-stone-900'}`}>{safe(farmhouse?.name)}</h3>
                  {farmhouse?.address && (
                    <p className={`text-sm mb-2 flex items-start gap-1 ${dm ? 'text-stone-400' : 'text-stone-600'}`}>
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-lime-500" />{farmhouse.address}
                    </p>
                  )}
                  {farmhouse?.description && (
                    <p className={`text-sm mb-3 ${dm ? 'text-stone-400' : 'text-stone-600'}`}>{farmhouse.description}</p>
                  )}
                  {safeArr(farmhouse?.amenities).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {safeArr(farmhouse.amenities).map((a, i) => (
                        <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${dm ? 'bg-lime-500/20 text-lime-400' : 'bg-lime-100 text-lime-700'}`}>{a}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {farmhouse?.rating != null && (
                      <span className="flex items-center gap-1 text-sm font-semibold">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        {safeNum(farmhouse.rating).toFixed(1)}
                      </span>
                    )}
                    {farmhouse?.pricePerHour != null && (
                      <span className={`text-sm ${dm ? 'text-stone-400' : 'text-stone-500'}`}>{fmtMon(farmhouse.pricePerHour)}/hour</span>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Booking Dates */}
            <SectionCard dm={dm}>
              <SectionTitle icon={Calendar} label="Booking Details" dm={dm} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Date',      value: fmt(booking?.date) },
                  { label: 'Slot',      value: safe(booking?.label) },
                  { label: 'Check-in',  value: fmtTime(booking?.checkIn) },
                  { label: 'Check-out', value: fmtTime(booking?.checkOut) },
                ].map(({ label, value }) => (
                  <div key={label} className={`p-3 rounded-xl ${dm ? 'bg-stone-700/40' : 'bg-lime-50'}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dm ? 'text-lime-400/70' : 'text-lime-600'}`}>{label}</p>
                    <p className={`text-sm font-medium ${dm ? 'text-white' : 'text-stone-900'}`}>{value}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Right col */}
          <div className="space-y-6">

            {/* Amount Breakdown */}
            <SectionCard dm={dm}>
              <SectionTitle icon={Receipt} label="Amount Breakdown" dm={dm} />
              <div className="space-y-3">
                {[
                  { label: 'Slot Price',    val: breakdown?.slotPrice },
                  { label: 'Cleaning Fee',  val: breakdown?.cleaningFee },
                  { label: 'Service Fee',   val: breakdown?.serviceFee },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className={dm ? 'text-stone-400' : 'text-stone-600'}>{label}</span>
                    <span className={`font-medium ${dm ? 'text-white' : 'text-stone-900'}`}>{fmtMon(val)}</span>
                  </div>
                ))}
                <div className={`border-t pt-3 mt-1 ${dm ? 'border-stone-700' : 'border-lime-200'}`}>
                  <div className="flex justify-between font-bold">
                    <span className={dm ? 'text-stone-200' : 'text-stone-800'}>Total</span>
                    <span className={dm ? 'text-lime-400' : 'text-lime-600'}>{fmtMon(breakdown?.total)}</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Transaction IDs */}
            <SectionCard dm={dm}>
              <SectionTitle icon={FileText} label="Transaction Details" dm={dm} />
              <div className="space-y-3">
                {[
                  { label: 'Transaction ID',      val: identifiers?.transactionId },
                  { label: 'Razorpay Payment ID', val: identifiers?.razorpayPaymentId },
                  { label: 'Verification ID',     val: identifiers?.verificationId },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dm ? 'text-lime-400/70' : 'text-lime-600'}`}>{label}</p>
                    <code className={`text-xs font-mono break-all ${dm ? 'text-stone-300' : 'text-stone-700'}`}>{safe(val)}</code>
                  </div>
                ))}
                <div className={`border-t pt-3 mt-1 space-y-2 ${dm ? 'border-stone-700' : 'border-lime-200'}`}>
                  {[
                    { label: 'Razorpay Fee', val: razorpay?.fee },
                    { label: 'Tax',          val: razorpay?.tax },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className={dm ? 'text-stone-400' : 'text-stone-600'}>{label}</span>
                      <span className={`font-medium ${dm ? 'text-white' : 'text-stone-900'}`}>{fmtMon(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* Timeline */}
            <SectionCard dm={dm}>
              <SectionTitle icon={Clock} label="Timeline" dm={dm} />
              <div className="space-y-4">
                {[
                  { dot: 'bg-lime-500',  label: 'Payment Created', val: timeline?.formatted?.created || fmtDT(timeline?.createdAt) },
                  { dot: 'bg-amber-500', label: 'Last Updated',    val: timeline?.formatted?.updated || fmtDT(timeline?.updatedAt) },
                ].map(({ dot, label, val }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dot}`} />
                    <div>
                      <p className={`text-sm font-semibold ${dm ? 'text-white' : 'text-stone-900'}`}>{label}</p>
                      <p className={`text-xs ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{safe(val)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// MAIN ALL PAYMENTS
// ─────────────────────────────────────────────────────────
const AllPayments = ({ darkMode }) => {
  const dm = darkMode;

  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [period, setPeriod]       = useState('day');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir]     = useState('desc');
  const [detailId, setDetailId]   = useState(null);
  const perPage = 10;

  useEffect(() => { fetchData(period); }, [period]);

  const fetchData = async (p) => {
    try {
      setLoading(true); setError(null);
      const res    = await fetch(`http://31.97.206.144:5124/api/order/payments/statistics?period=${p}`);
      const result = await res.json();
      if (result?.success) setData(result.statistics);
      else setError(result?.message || 'Failed to fetch payments data');
    } catch { setError('Error connecting to server'); }
    finally { setLoading(false); }
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  // Export CSV
  const exportCSV = () => {
    const header = ['Payment ID', 'Farmhouse', 'Customer', 'Date', 'Amount', 'Status'];
    const rows   = getFiltered().map((p) => [
      safeStr(p?.id), safeStr(p?.farmhouse), safeStr(p?.user, 'Unknown'),
      fmtDT(p?.date), safeNum(p?.amount), safeStr(p?.status),
    ]);
    const csv  = 'data:text/csv;charset=utf-8,' + [header, ...rows].map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href  = encodeURI(csv);
    link.download = `payments-${period}-${Date.now()}.csv`;
    link.click();
  };

  const getFiltered = () => {
    let list = safeArr(data?.topPayments);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((p) =>
        safeStr(p?.farmhouse).toLowerCase().includes(s) ||
        safeStr(p?.user).toLowerCase().includes(s)      ||
        safeStr(p?.id).toLowerCase().includes(s)
      );
    }
    list.sort((a, b) => {
      let av, bv;
      if (sortField === 'date')      { av = safeDate(a?.date)?.getTime() ?? 0; bv = safeDate(b?.date)?.getTime() ?? 0; }
      else if (sortField === 'amount')   { av = safeNum(a?.amount); bv = safeNum(b?.amount); }
      else if (sortField === 'farmhouse') { av = safeStr(a?.farmhouse); bv = safeStr(b?.farmhouse); }
      else { av = 0; bv = 0; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  };

  const filtered   = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  // Safe data
  const overview = data?.overview || {};
  const byStatus = overview?.byStatus || {};
  const daily    = safeArr(data?.dailyTrend);
  const methods  = safeArr(data?.paymentMethods);
  const refunds  = data?.refunds || {};

  const inputCls = `px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-lime-500 transition text-sm
    ${dm ? 'bg-stone-900 border-stone-700 text-white placeholder-stone-500' : 'bg-white border-lime-300 text-stone-900 placeholder-stone-400'}`;

  const bg = dm ? 'bg-stone-900' : 'bg-gradient-to-br from-amber-50 via-lime-50 to-stone-100';

  // ── DETAIL VIEW ──
  if (detailId) return <PaymentDetails paymentId={detailId} darkMode={dm} onBack={() => setDetailId(null)} />;

  // ── LOADING ──
  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto ${dm ? 'border-lime-500' : 'border-lime-600'}`} />
        <p className={`mt-4 text-sm ${dm ? 'text-stone-400' : 'text-stone-600'}`}>Loading payments…</p>
      </div>
    </div>
  );

  // ── ERROR ──
  if (error || !data) return (
    <div className={`min-h-screen flex items-center justify-center ${bg}`}>
      <div className="text-center">
        <AlertCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
        <p className={`font-semibold ${dm ? 'text-stone-300' : 'text-stone-700'}`}>{error || 'Failed to load'}</p>
        <button onClick={() => fetchData(period)} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-lime-500 to-lime-600 text-white rounded-xl hover:scale-105 transition shadow-lg">Retry</button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bg}`}>

      {/* ── STICKY HEADER ── */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl border-b ${dm ? 'bg-stone-900/80 border-stone-800' : 'bg-white/80 border-lime-200'}`}>
        <div className="px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${dm ? 'from-lime-400 to-amber-400' : 'from-lime-600 to-amber-600'}`}>
              Payments Management
            </h1>
            <p className={`text-sm mt-0.5 ${dm ? 'text-stone-400' : 'text-stone-500'}`}>Track and manage all payment transactions</p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <select value={period} onChange={(e) => { setPeriod(e.target.value); setPage(1); }} className={inputCls}>
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button onClick={exportCSV}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition
                ${dm ? 'border-lime-500/30 text-lime-400 hover:bg-lime-500/10' : 'border-lime-400 text-lime-700 hover:bg-lime-50'}`}
            >
              ↓ Export
            </button>
            <button onClick={() => fetchData(period)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-lime-500 to-lime-600 hover:scale-105 transition shadow-[0_0_20px_rgba(132,204,22,.35)]"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">

        {/* ── STAT CARDS ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Payments', value: safeNum(overview?.totalPayments),                     sub: `${safeNum(overview?.successRate)}% success rate`, grad: 'from-lime-500 to-lime-600',   icon: CreditCard },
            { label: 'Total Amount',   value: fmtMon(overview?.totalAmount),                        sub: `Avg ${fmtMon(overview?.averageAmount)}/payment`,  grad: 'from-amber-500 to-amber-600', icon: DollarSign },
            { label: 'Completed',      value: safeNum(byStatus?.completed),                          sub: `Pending: ${safeNum(byStatus?.pending)} · Failed: ${safeNum(byStatus?.failed)}`, grad: 'from-lime-600 to-lime-700', icon: CheckCircle },
            { label: 'Refunds',        value: fmtMon(refunds?.totalRefundAmount),                   sub: `${safeNum(refunds?.totalRefunds)} refunds · ${safeNum(refunds?.refundRate)}% rate`, grad: 'from-amber-600 to-amber-700', icon: Award },
          ].map(({ label, value, sub, grad, icon: Icon }) => (
            <div key={label} className={`relative overflow-hidden rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-xl
              ${dm ? 'bg-stone-800/60 border-stone-700' : 'bg-white border-lime-200 shadow-md'}`}>
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-20 bg-lime-400 pointer-events-none" />
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white mb-3 shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className={`text-xs font-bold uppercase tracking-widest ${dm ? 'text-stone-400' : 'text-stone-500'}`}>{label}</p>
              <p className={`text-2xl font-extrabold mt-1 ${dm ? 'text-white' : 'text-stone-900'}`}>{value}</p>
              <p className={`text-xs mt-1 ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── CHARTS ── */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Daily Trend */}
          <SectionCard dm={dm}>
            <h2 className={`text-base font-bold mb-5 ${dm ? 'text-lime-400' : 'text-lime-700'}`}>Daily Payment Trend</h2>
            {daily.length === 0
              ? <div className="flex items-center justify-center h-48 opacity-40 text-sm">No trend data</div>
              : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={daily} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dm ? '#44403c' : '#d9f99d'} />
                    <XAxis dataKey="date" tick={{ fill: dm ? '#a8a29e' : '#6b7280', fontSize: 11 }} stroke="none" />
                    <YAxis yAxisId="l" tick={{ fill: dm ? '#a8a29e' : '#6b7280', fontSize: 11 }} stroke="none" />
                    <YAxis yAxisId="r" orientation="right" tick={{ fill: dm ? '#a8a29e' : '#6b7280', fontSize: 11 }} stroke="none" />
                    <Tooltip contentStyle={{ backgroundColor: dm ? '#1c1917' : '#fff', borderColor: dm ? '#44403c' : '#d9f99d', borderRadius: 12, fontSize: 12 }}
                      formatter={(v, n) => [n === 'amount' ? fmtMon(v) : v, n === 'amount' ? 'Amount' : 'Payments']} />
                    <Bar yAxisId="l" dataKey="payments" fill="#84cc16" radius={[6, 6, 0, 0]} />
                    <Bar yAxisId="r" dataKey="amount"   fill="#d97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
            }
          </SectionCard>

          {/* Payment Methods */}
          <SectionCard dm={dm}>
            <h2 className={`text-base font-bold mb-5 ${dm ? 'text-lime-400' : 'text-lime-700'}`}>Payment Methods</h2>
            {methods.length === 0
              ? <div className="flex items-center justify-center h-48 opacity-40 text-sm">No method data</div>
              : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={methods.map((m) => ({ name: safeStr(safeArr(m?.method)[0], 'Unknown'), value: safeNum(m?.amount) }))}
                      cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value"
                    >
                      {methods.map((_, i) => <Cell key={i} fill={LIME_COLORS[i % LIME_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: dm ? '#1c1917' : '#fff', borderColor: dm ? '#44403c' : '#d9f99d', borderRadius: 12, fontSize: 12 }}
                      formatter={(v) => [fmtMon(v), 'Amount']} />
                    <Legend wrapperStyle={{ color: dm ? '#a8a29e' : '#6b7280', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )
            }
          </SectionCard>
        </div>

        {/* ── TABLE ── */}
        <div className={`rounded-2xl border overflow-hidden ${dm ? 'bg-stone-800/60 border-stone-700 shadow-[0_0_30px_rgba(132,204,22,.08)]' : 'bg-white border-lime-200 shadow-xl'}`}>

          {/* Filter bar */}
          <div className={`p-5 border-b ${dm ? 'border-stone-700' : 'border-lime-100'}`}>
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lime-500/50" />
                <input placeholder="Search farmhouse, customer, ID…" value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className={`${inputCls} pl-9 w-full`}
                />
              </div>
            </div>
            <p className={`text-xs mt-3 ${dm ? 'text-stone-500' : 'text-stone-400'}`}>
              Showing {paginated.length} of {filtered.length} payments
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${dm ? 'bg-stone-700/40 border-stone-700' : 'bg-lime-50 border-lime-100'}`}>
                  {[
                    { label: 'Payment ID', key: null },
                    { label: 'Farmhouse',  key: 'farmhouse' },
                    { label: 'Customer',   key: null },
                    { label: 'Date',       key: 'date' },
                    { label: 'Amount',     key: 'amount' },
                    { label: 'Status',     key: null },
                    { label: 'View',       key: null },
                  ].map(({ label, key }) => (
                    <th key={label}
                      onClick={() => key && toggleSort(key)}
                      className={`px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest
                        ${key ? 'cursor-pointer select-none' : ''}
                        ${dm ? 'text-lime-400/70 hover:text-lime-400' : 'text-lime-600 hover:text-lime-800'}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {label}
                        {key && <ArrowUpDown className={`h-3 w-3 ${sortField === key ? 'opacity-100' : 'opacity-30'}`} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 opacity-40">
                      <CreditCard className="h-10 w-10 mx-auto mb-3 text-lime-500" />
                      <p className="text-sm">No payments found</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((p) => {
                    const id       = safeStr(p?.id);
                    const farm     = safe(p?.farmhouse);
                    const customer = safe(p?.user, 'Unknown');
                    const amount   = safeNum(p?.amount);
                    const status   = safeStr(p?.status, 'pending');
                    return (
                      <tr key={id}
                        className={`border-b transition-all ${dm ? 'border-stone-700 hover:bg-stone-700/40' : 'border-lime-100 hover:bg-lime-50'}`}
                      >
                        <td className="px-5 py-4">
                          <code className={`text-xs font-mono px-2 py-1 rounded-lg
                            ${dm ? 'bg-lime-500/10 text-lime-300' : 'bg-lime-50 text-lime-700'}`}>
                            {id ? `…${id.slice(-8)}` : '—'}
                          </code>
                        </td>
                        <td className="px-5 py-4">
                          <p className={`font-semibold text-sm ${dm ? 'text-white' : 'text-stone-900'}`}>{farm}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className={`text-sm ${dm ? 'text-stone-300' : 'text-stone-700'}`}>{customer}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className={`text-sm font-medium ${dm ? 'text-white' : 'text-stone-900'}`}>{fmt(p?.date)}</p>
                          <p className={`text-xs ${dm ? 'text-stone-500' : 'text-stone-400'}`}>{fmtTime(p?.date)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`font-bold ${dm ? 'text-lime-400' : 'text-lime-700'}`}>{fmtMon(amount)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={status} dm={dm} />
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => setDetailId(id)}
                            className={`p-2 rounded-xl border transition hover:scale-110
                              ${dm ? 'border-lime-500/20 text-lime-400 hover:bg-lime-500/10' : 'border-lime-300 text-lime-600 hover:bg-lime-50'}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={`flex flex-wrap justify-between items-center px-5 py-4 border-t ${dm ? 'border-stone-700' : 'border-lime-100'}`}>
            <p className={`text-sm ${dm ? 'text-stone-400' : 'text-stone-500'}`}>
              Page <span className={`font-bold ${dm ? 'text-lime-400' : 'text-lime-600'}`}>{page}</span> of {totalPages}
              &nbsp;·&nbsp;{filtered.length} records
            </p>
            <div className="flex gap-2 items-center">
              <PageBtn onClick={() => setPage(1)} disabled={page === 1} dm={dm}>«</PageBtn>
              <PageBtn onClick={() => setPage((p) => p - 1)} disabled={page === 1} dm={dm}><ChevronLeft className="h-4 w-4" /></PageBtn>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const num   = start + i;
                return num <= totalPages ? (
                  <button key={num} onClick={() => setPage(num)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition
                      ${num === page
                        ? 'bg-gradient-to-r from-lime-500 to-lime-600 text-white shadow-[0_0_12px_rgba(132,204,22,.4)]'
                        : dm ? 'text-stone-400 hover:bg-stone-700 hover:text-white' : 'text-stone-500 hover:bg-lime-50'
                      }`}
                  >{num}</button>
                ) : null;
              })}
              <PageBtn onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages} dm={dm}><ChevronRight className="h-4 w-4" /></PageBtn>
              <PageBtn onClick={() => setPage(totalPages)} disabled={page === totalPages} dm={dm}>»</PageBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPayments;