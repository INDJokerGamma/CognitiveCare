// frontend/src/pages/History.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowLeft, Calendar, Brain, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tests/history/${user.uid}`);
                // Reverse for the chart so it goes left-to-right (oldest to newest)
                const chartData = [...response.data.history].reverse().map(item => ({
                    date: new Date(item.completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                    score: item.score
                }));
                setData(chartData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching history", error);
                setLoading(false);
            }
        };
        if (user) fetchHistory();
    }, [user]);

    if (loading) return <div className="h-screen flex items-center justify-center font-bold text-primary">Loading records...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-dark mb-2">Cognitive Progress Report</h1>
                    <p className="text-slate-500">Visualizing your memory performance over time.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" /> Performance Trend
                            </h3>
                        </div>

                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Quick Stats Sidebar */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-primary text-white p-8 rounded-3xl shadow-lg shadow-primary/20">
                            <p className="text-primary-100 text-sm mb-1 uppercase tracking-wider font-bold">Average Score</p>
                            <h2 className="text-5xl font-black">
                                {data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / data.length) : 0}%
                            </h2>
                            <div className="mt-4 bg-white/20 h-1 rounded-full overflow-hidden">
                                <div className="bg-white h-full" style={{ width: `${data.length > 0 ? data.reduce((acc, curr) => acc + curr.score, 0) / data.length : 0}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                                <Calendar size={18} className="text-secondary" /> Recent Sessions
                            </h3>
                            <div className="space-y-4">
                                {data.slice(-3).reverse().map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <span className="text-sm font-medium text-slate-600">{item.date}</span>
                                        <span className="font-bold text-primary">{item.score}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;