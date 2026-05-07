// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, CheckCircle, Activity, Search, Filter, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/tests/admin/all-sessions');
                setSessions(res.data.sessions);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const filteredSessions = sessions.filter(s =>
        s.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Activity className="text-blue-600" size={40} />
                </motion.div>
                <p className="font-bold text-slate-400 animate-pulse">Initializing Console...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
            {/* Top Glossy Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 mb-8">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-blue-600">Admin Insights</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CognitiveCare Health Monitor</p>
                    </div>
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search patient records..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Volume" value={sessions.length} icon={<Activity />} trend="+12%" color="blue" />
                    <StatCard title="Critical Alerts" value={sessions.filter(s => s.score < 50).length} icon={<AlertTriangle />} trend="High Priority" color="red" />
                    <StatCard title="Stable Cases" value={sessions.filter(s => s.score >= 80).length} icon={<CheckCircle />} trend="Recovery High" color="emerald" />
                    <StatCard title="Total Patients" value={new Set(sessions.map(s => s.userId)).size} icon={<Users />} trend="Active" color="purple" />
                </div>

                {/* Table Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
                >
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2"><Filter size={18} /> Recent Activity</h3>
                        <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">Export CSV</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[11px] uppercase tracking-[0.15em] font-black">
                                    <th className="px-8 py-5">Patient Identity</th>
                                    <th className="px-8 py-5">Assessment</th>
                                    <th className="px-8 py-5 text-center">Efficiency Score</th>
                                    <th className="px-8 py-5">Clinical Status</th>
                                    <th className="px-8 py-5">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence>
                                    {filteredSessions.map((s, idx) => (
                                        <motion.tr
                                            key={s.id || idx}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="group hover:bg-blue-50/30 transition-all cursor-default"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                        {s.userEmail[0].toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{s.userEmail}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500">{s.testType}</span>
                                            </td>
                                            <td className="px-8 py-5 text-center font-black text-blue-600 italic">
                                                {s.score}%
                                            </td>
                                            <td className="px-8 py-5">
                                                <StatusBadge score={s.score} text={s.mentalState} />
                                            </td>
                                            <td className="px-8 py-5 text-slate-400 font-medium text-xs">
                                                {new Date(s.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatusBadge = ({ score, text }) => {
    const config = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        red: "bg-red-50 text-red-600 border-red-100"
    };
    const style = score >= 80 ? config.emerald : score >= 50 ? config.orange : config.red;
    return (
        <span className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider ${style}`}>
            {text}
        </span>
    );
};

const StatCard = ({ title, value, icon, trend, color }) => {
    const colors = {
        blue: "bg-blue-600 text-white shadow-blue-200",
        red: "bg-red-500 text-white shadow-red-200",
        emerald: "bg-emerald-500 text-white shadow-emerald-200",
        purple: "bg-purple-600 text-white shadow-purple-200"
    };

    return (
        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
                <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center shadow-lg`}>
                    {React.cloneElement(icon, { size: 20 })}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                    {trend} <ArrowUpRight size={12} />
                </div>
            </div>
            <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-800">{value}</h3>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;