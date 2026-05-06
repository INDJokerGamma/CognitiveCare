// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Brain, History as HistoryIcon, User as UserIcon, Globe, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'mr' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md">
                        <Brain size={24} />
                    </div>
                    <span className="font-bold text-xl text-dark hidden md:block tracking-tight">CognitiveCare</span>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 text-primary font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-100"
                    >
                        <Globe size={18} />
                        {i18n.language === 'en' ? 'मराठी' : 'English'}
                    </button>

                    <div className="text-right hidden sm:block border-l border-slate-200 pl-6">
                        <p className="text-sm font-bold text-dark">{user?.displayName || 'Patient'}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>

                    <button
                        onClick={() => logout()}
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6 md:p-10">
                <header className="mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-dark tracking-tight mb-2"
                    >
                        {t('common.welcome')}, {user?.displayName ? user.displayName.split(' ')[0] : 'User'}!
                    </motion.h2>
                    <p className="text-slate-500 text-lg font-medium">{t('common.subtitle')}</p>
                </header>

                {/* Section: Assessment Suite */}
                <h3 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-6">Cognitive Assessment Suite</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <Link to="/test/memory">
                        <DashboardCard
                            icon={<Brain className="text-primary" />}
                            title={t('dashboard.startTest')}
                            desc={t('dashboard.startTestDesc')}
                            color="bg-primary/10"
                            hoverBorder="hover:border-primary/50"
                        />
                    </Link>

                    <Link to="/test/math">
                        <DashboardCard
                            icon={<Zap className="text-amber-500" />}
                            title={t('dashboard.mathTest')}
                            desc={t('dashboard.mathTestDesc')}
                            color="bg-amber-50"
                            hoverBorder="hover:border-amber-500/50"
                        />
                    </Link>

                    <Link to="/test/fluency">
                        <DashboardCard
                            icon={<Activity className="text-secondary" />}
                            title={t('dashboard.fluencyTest')}
                            desc={t('dashboard.fluencyTestDesc')}
                            color="bg-secondary/10"
                            hoverBorder="hover:border-secondary/50"
                        />
                    </Link>
                </div>

                {/* Section: Management */}
                <h3 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-6">Patient Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/history">
                        <DashboardCard
                            icon={<HistoryIcon className="text-indigo-500" />}
                            title={t('dashboard.viewHistory')}
                            desc={t('dashboard.viewHistoryDesc')}
                            color="bg-indigo-50"
                            hoverBorder="hover:border-indigo-500/50"
                        />
                    </Link>

                    <Link to="#">
                        <DashboardCard
                            icon={<UserIcon className="text-slate-500" />}
                            title={t('dashboard.profile')}
                            desc={t('dashboard.profileDesc')}
                            color="bg-slate-100"
                            hoverBorder="hover:border-slate-400"
                        />
                    </Link>
                </div>
            </main>
        </div>
    );
};

const DashboardCard = ({ icon, title, desc, color, hoverBorder }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 border-transparent cursor-pointer transition-all h-full flex flex-col ${hoverBorder}`}
    >
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6`}>
            {icon}
        </div>
        <h3 className="font-bold text-dark text-xl mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

export default Dashboard;