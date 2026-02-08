const Dashboard = ({ darkMode, collapsed }) => {
    return (
        <div className={`text-center text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome to the Dashboard
        </div>
    );
}
export default Dashboard;


// import React from "react";
// import {
//     FaUsers,
//     FaHome,
//     FaCalendarCheck,
//     FaImages,
//     FaPlus,
// } from "react-icons/fa";

// import {
//     LineChart,
//     Line,
//     CartesianGrid,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";

// import { useNavigate } from "react-router-dom";

// const Dashboard = ({ darkMode }) => {
//     const navigate = useNavigate();

//     /* ================= STATIC DATA ================= */

//     const stats = {
//         users: 1248,
//         farmhouses: 86,
//         bookings: 432,
//         banners: 12,
//     };

//     const graphData = [
//         { name: "Jan", value: 120 },
//         { name: "Feb", value: 210 },
//         { name: "Mar", value: 180 },
//         { name: "Apr", value: 260 },
//         { name: "May", value: 340 },
//         { name: "Jun", value: 390 },
//     ];

//     const latestUsers = [
//         { fullName: "Aarav Sharma", email: "aarav@mail.com", createdAt: "2025-01-02" },
//         { fullName: "Priya Reddy", email: "priya@mail.com", createdAt: "2025-01-04" },
//         { fullName: "Kiran Patel", email: "kiran@mail.com", createdAt: "2025-01-06" },
//         { fullName: "Neha Gupta", email: "neha@mail.com", createdAt: "2025-01-08" },
//         { fullName: "Rahul Verma", email: "rahul@mail.com", createdAt: "2025-01-10" },
//     ];

//     const latestBookings = [
//         { customerName: "Rohit Mehta", farmhouse: "Green Valley", date: "2025-01-03" },
//         { customerName: "Sneha Kapoor", farmhouse: "Palm Retreat", date: "2025-01-05" },
//         { customerName: "Arjun Rao", farmhouse: "Hilltop Stay", date: "2025-01-07" },
//         { customerName: "Pooja Singh", farmhouse: "River Edge", date: "2025-01-09" },
//         { customerName: "Vikram Das", farmhouse: "Sunset Villa", date: "2025-01-11" },
//     ];

//     return (
//         <div
//             className={`relative min-h-screen p-8 overflow-hidden ${darkMode
//                 ? "bg-[#020617] text-white"
//                 : "bg-gradient-to-br from-slate-100 to-white"
//                 }`}
//         >
//             {/* Mesh Glow */}
//             <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 blur-[120px]" />
//             <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px]" />

//             <div className="relative max-w-7xl mx-auto space-y-10">
//                 {/* HEADER */}
//                 <h1 className="text-4xl font-bold tracking-tight">
//                     Welcome Back 👋
//                 </h1>

//                 {/* KPI */}
//                 <div className="grid md:grid-cols-4 gap-8">
//                     <StatCard icon={<FaUsers />} label="Users" value={stats.users} darkMode={darkMode} />
//                     <StatCard icon={<FaHome />} label="Farmhouses" value={stats.farmhouses} darkMode={darkMode} />
//                     <StatCard icon={<FaCalendarCheck />} label="Bookings" value={stats.bookings} darkMode={darkMode} />
//                     <StatCard icon={<FaImages />} label="Banners" value={stats.banners} darkMode={darkMode} />
//                 </div>

//                 {/* GRAPH */}
//                 <GlassCard darkMode={darkMode}>
//                     <h2 className="text-2xl font-semibold mb-6">
//                         Growth Overview
//                     </h2>

//                     <ResponsiveContainer width="100%" height={320}>
//                         <LineChart data={graphData}>
//                             <Line
//                                 type="monotone"
//                                 dataKey="value"
//                                 stroke="#6366f1"
//                                 strokeWidth={3}
//                             />
//                             <CartesianGrid strokeOpacity={0.1} />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </GlassCard>

//                 {/* 🔥 LATEST USERS TABLE */}
//                 <PremiumTable
//                     darkMode={darkMode}
//                     title="Latest Users"
//                     headers={["Name", "Email", "Joined"]}
//                     rows={latestUsers.map((u) => [
//                         u.fullName,
//                         u.email,
//                         new Date(u.createdAt).toLocaleDateString(),
//                     ])}
//                 />

//                 {/* 🔥 LATEST BOOKINGS TABLE */}
//                 <PremiumTable
//                     darkMode={darkMode}
//                     title="Latest Bookings"
//                     headers={["Customer", "Farmhouse", "Date"]}
//                     rows={latestBookings.map((b) => [
//                         b.customerName,
//                         b.farmhouse,
//                         new Date(b.date).toLocaleDateString(),
//                     ])}
//                 />

//                 {/* QUICK ACTIONS */}
//                 <GlassCard darkMode={darkMode}>
//                     <h2 className="text-2xl font-semibold mb-6">
//                         Quick Actions
//                     </h2>

//                     <div className="grid md:grid-cols-3 gap-6">
//                         <QuickCard label="Create Farmhouse" onClick={() => navigate("/admin/create-farmhouse")} />
//                         <QuickCard label="Create Banner" onClick={() => navigate("/admin/banners")} />
//                         <QuickCard label="View Bookings" onClick={() => navigate("/admin/bookings")} />
//                     </div>
//                 </GlassCard>
//             </div>
//         </div>
//     );
// };

// /* ================= COMPONENTS ================= */

// const GlassCard = ({ children, darkMode }) => (
//     <div
//         className={`rounded-3xl p-8 backdrop-blur-2xl border shadow-xl
//     ${darkMode
//                 ? "bg-white/5 border-white/10"
//                 : "bg-white/70 border-white"
//             }`}
//     >
//         {children}
//     </div>
// );

// const StatCard = ({ icon, label, value, darkMode }) => (
//     <div className="relative">
//         <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-3xl"></div>

//         <div
//             className={`relative rounded-3xl p-6 backdrop-blur-xl border
//       hover:scale-105 transition shadow-lg
//       ${darkMode
//                     ? "bg-white/5 border-white/10"
//                     : "bg-white border-gray-200"
//                 }`}
//         >
//             <div className="flex justify-between items-center">
//                 <div>
//                     <p className="opacity-70">{label}</p>
//                     <h2 className="text-3xl font-bold mt-1">{value}</h2>
//                 </div>

//                 <div className="text-indigo-400 text-3xl">
//                     {icon}
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// const PremiumTable = ({ title, headers, rows, darkMode }) => (
//     <div
//         className={`
//       rounded-3xl
//       overflow-hidden
//       shadow-[0_10px_40px_rgba(0,0,0,0.25)]
//       ${darkMode
//                 ? "bg-[#0B1120]"     // solid luxury dark (NOT transparent)
//                 : "bg-white"
//             }
//     `}
//     >
//         {/* HEADER */}
//         <div
//             className={`
//         px-8 py-6
//         ${darkMode
//                     ? "border-b border-white/5"
//                     : "border-b border-gray-200"
//                 }
//       `}
//         >
//             <h2 className="text-2xl font-semibold tracking-tight">
//                 {title}
//             </h2>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//                 {/* THEAD */}
//                 <thead
//                     className={`
//             ${darkMode
//                             ? "bg-[#020617]"   // strong separation
//                             : "bg-gray-50"
//                         }
//           `}
//                 >
//                     <tr>
//                         {headers.map((h, i) => (
//                             <th
//                                 key={i}
//                                 className="
//                   text-left
//                   px-8
//                   py-4
//                   text-xs
//                   font-semibold
//                   uppercase
//                   tracking-wider
//                   opacity-70
//                 "
//                             >
//                                 {h}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>

//                 {/* TBODY */}
//                 <tbody>
//                     {rows.map((row, i) => (
//                         <tr
//                             key={i}
//                             className={`
//                 transition
//                 ${darkMode
//                                     ? "border-t border-white/5 hover:bg-white/3"
//                                     : "border-t border-gray-200 hover:bg-gray-50"
//                                 }
//               `}
//                         >
//                             {row.map((cell, j) => (
//                                 <td
//                                     key={j}
//                                     className="
//                     px-8
//                     py-5
//                     text-sm
//                     font-medium
//                   "
//                                 >
//                                     {cell}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     </div>
// );


// const QuickCard = ({ label, onClick }) => (
//     <button
//         onClick={onClick}
//         className="
//     p-6 rounded-2xl
//     bg-gradient-to-r from-indigo-500 to-purple-600
//     hover:scale-105
//     shadow-2xl
//     font-semibold
//     flex items-center justify-center gap-2
//     transition
//     "
//     >
//         <FaPlus />
//         {label}
//     </button>
// );

// export default Dashboard;
