// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Brain, History as HistoryIcon, User as UserIcon, Globe, Activity, Zap, ArrowUpRight } from 'lucide-react';
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
        <div className="min-h-screen bg-[#fcfdfe] font-sans pb-20">
            {/* Minimalist Nav */}
            <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ rotate: 15 }} className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Brain size={22} />
                        </motion.div>
                        <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tighter">CognitiveCare</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="hidden sm:flex items-center gap-2 text-slate-600 font-bold bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:bg-white transition-all text-sm"
                        >
                            <Globe size={16} />
                            {i18n.language === 'en' ? 'Marathi' : 'English'}
                        </button>
                        <div className="text-right hidden sm:block border-l border-slate-100 pl-4">
                            <p className="text-sm font-bold text-slate-700">{user?.displayName || 'Patient'}</p>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="group p-2.5 bg-slate-100 hover:bg-red-500 rounded-xl transition-all"
                        >
                            <LogOut size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6 md:p-12">
                <header className="mb-16 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl -z-10" />
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4"
                    >
                        {t('common.welcome')}, <span className="text-blue-600">{user?.displayName ? user.displayName.split(' ')[0] : 'User'}</span>
                    </motion.h2>
                    <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed">
                        {t('common.subtitle')}
                    </p>
                </header>

                {/* Assessment Suite */}
                <SectionHeading>Cognitive Assessment Suite</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    <AssessmentCard link="/test/memory" icon={<Brain />} title={t('dashboard.startTest')} desc={t('dashboard.startTestDesc')} theme="blue" />
                    <AssessmentCard link="/test/math" icon={<Zap />} title={t('dashboard.mathTest')} desc={t('dashboard.mathTestDesc')} theme="amber" />
                    <AssessmentCard link="/test/mmse" icon={<Activity />} title={t('dashboard.mmseTest')} desc={t('dashboard.mmseTestDesc')} theme="indigo" />
                    <AssessmentCard link="/test/moca" icon={<Zap />} title={t('dashboard.mocaTest')} desc={t('dashboard.mocaTestDesc')} theme="amber" />
                    <AssessmentCard link="/test/fluency" icon={<Activity />} title={t('dashboard.fluencyTest')} desc={t('dashboard.fluencyTestDesc')} theme="blue" />
                </div>

                {/* Management Section */}
                <SectionHeading>Patient Resources</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AssessmentCard link="/history" icon={<HistoryIcon />} title={t('dashboard.viewHistory')} desc={t('dashboard.viewHistoryDesc')} theme="slate" />
                    <AssessmentCard link="#" icon={<UserIcon />} title={t('dashboard.profile')} desc={t('dashboard.profileDesc')} theme="emerald" />
                </div>
            </main>
        </div>
    );
};

const SectionHeading = ({ children }) => (
    <h3 className="text-xs uppercase tracking-[0.3em] font-black text-slate-300 mb-8 ml-2">{children}</h3>
);

const AssessmentCard = ({ link, icon, title, desc, theme }) => {
    const themes = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        slate: "text-slate-600 bg-slate-50 border-slate-100"
    };

    return (
        <Link to={link}>
            <motion.div
                whileHover={{ y: -8, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.05)" }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white p-10 rounded-[3rem] border-2 border-slate-50 hover:border-blue-100 transition-all h-full flex flex-col shadow-sm"
            >
                <div className={`w-16 h-16 ${themes[theme]} rounded-[1.5rem] flex items-center justify-center mb-8 border group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(icon, { size: 28 })}
                </div>
                <h3 className="font-black text-slate-800 text-2xl mb-3">{title}</h3>
                <p className="text-slate-400 font-semibold text-sm leading-relaxed">{desc}</p>
                <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Now <ArrowUpRight size={14} />
                </div>
            </motion.div>
        </Link>
    );
};

export default Dashboard;