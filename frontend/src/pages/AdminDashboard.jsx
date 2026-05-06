// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, CheckCircle, Activity, Search } from 'lucide-react';

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

    if (loading) return <div className="p-20 text-center font-bold text-primary">Loading Admin Console...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-dark tracking-tight">Admin Insights</h1>
                        <p className="text-slate-500">Monitoring cognitive health across all registered patients.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by patient email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Tests" value={sessions.length} icon={<Activity className="text-blue-500" />} color="bg-blue-50" />
                    <StatCard title="Alerts" value={sessions.filter(s => s.score < 50).length} icon={<AlertTriangle className="text-red-500" />} color="bg-red-50" />
                    <StatCard title="Stable" value={sessions.filter(s => s.score >= 80).length} icon={<CheckCircle className="text-emerald-500" />} color="bg-emerald-50" />
                    <StatCard title="Unique Patients" value={new Set(sessions.map(s => s.userId)).size} icon={<Users className="text-purple-500" />} color="bg-purple-50" />
                </div>

                {/* Patients Table */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-bold">Patient Email</th>
                                <th className="px-6 py-4 font-bold">Test Type</th>
                                <th className="px-6 py-4 font-bold">Score</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSessions.map((s) => (
                                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-dark">{s.userEmail}</td>
                                    <td className="px-6 py-4 text-slate-600">{s.testType}</td>
                                    <td className="px-6 py-4 font-bold text-primary">{s.score}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                s.score >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {s.mentalState}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">
                                        {new Date(s.completedAt).toLocaleDateString()}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-dark">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;