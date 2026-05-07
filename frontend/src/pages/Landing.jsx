// frontend/src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ShieldCheck, BarChart3, Globe, ChevronRight, Activity, Users, Award } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const features = [
        {
            icon: <Brain className="text-blue-600" />,
            title: "Scientific Assessment",
            desc: "Validated memory recall and cognitive focus tests designed for early detection.",
            color: "bg-blue-50"
        },
        {
            icon: <Globe className="text-indigo-600" />,
            title: "Local Language Support",
            desc: "Full support for Marathi and English to ensure comfort for all users.",
            color: "bg-indigo-50"
        },
        {
            icon: <BarChart3 className="text-amber-600" />,
            title: "Progress Tracking",
            desc: "Visual analytics to monitor cognitive trends over weeks and months.",
            color: "bg-amber-50"
        },
        {
            icon: <ShieldCheck className="text-emerald-600" />,
            title: "Privacy First",
            desc: "Your data is encrypted and securely stored using enterprise-grade cloud security.",
            color: "bg-emerald-50"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-700">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, -80, 0], y: [0, 120, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-indigo-200/20 rounded-full blur-[100px]"
                />
            </div>

            {/* Sticky Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Brain size={24} />
                        </div>
                        <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            CognitiveCare
                        </span>
                    </motion.div>
                    <div className="flex items-center gap-6">
                        <button className="hidden md:block text-slate-600 font-medium hover:text-blue-600 transition-colors">About Us</button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2.5 font-bold text-white bg-slate-900 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-95"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        New: Marathi Support Available
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-6xl md:text-8xl font-black leading-[1.1] mb-8 tracking-tight"
                    >
                        Early Detection <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                            Better Care.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed mx-auto lg:mx-0"
                    >
                        Empowering families with simple, clinical-grade memory assessments.
                        Detect subtle changes in cognitive health from home in just 10 minutes.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="group bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                            Get Started Free
                            <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="bg-white text-slate-800 border border-slate-200 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            Watch Demo
                        </button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all"
                    >
                        <div className="flex items-center gap-2 font-bold text-slate-500 italic"><Activity size={20} /> Healthcare Verified</div>
                        <div className="flex items-center gap-2 font-bold text-slate-500 italic"><Users size={20} /> 5k+ Active Users</div>
                        <div className="flex items-center gap-2 font-bold text-slate-500 italic"><Award size={20} /> Privacy Award 2026</div>
                    </motion.div>
                </div>

                <div className="flex-1 w-full relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 p-4 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[40px] shadow-2xl overflow-hidden"
                    >
                        <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-[32px] flex items-center justify-center relative overflow-hidden group">
                            <Brain size={200} className="text-blue-200 absolute -bottom-10 -right-10 group-hover:scale-110 transition-transform duration-700" />
                            <div className="text-center p-8 relative z-20">
                                <div className="inline-block p-4 bg-white rounded-3xl shadow-xl mb-6">
                                    <Activity className="text-blue-600" size={48} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-800 mb-2">Cognitive Insight</h4>
                                <p className="text-slate-500 font-medium">Real-time analysis dashboard</p>
                            </div>
                        </div>
                    </motion.div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-200/50 rounded-full blur-3xl z-0" />
                </div>
            </header>

            {/* Features Section */}
            <section className="relative z-10 py-32 bg-slate-900 text-white rounded-[60px] mx-4 shadow-3xl">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Powerful Technology, <span className="text-blue-400">Human Approach.</span>
                        </motion.h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Built with accessibility in mind, helping seniors bridge the gap between technology and healthcare.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((f, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="group bg-slate-800/50 backdrop-blur-lg p-10 rounded-[32px] border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300"
                            >
                                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(f.icon, { size: 32 })}
                                </div>
                                <h3 className="font-bold text-2xl mb-4 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                                <p className="text-slate-400 leading-relaxed italic">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-black mb-8">Ready to track your cognitive health?</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                    >
                        Join Thousands Today
                    </button>
                    <p className="mt-6 text-slate-500 font-medium italic">No credit card required. Free for initial assessment.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm font-medium">
                <p>&copy; 2026 CognitiveCare Assessment Platform. Built for Public Health.</p>
                <div className="mt-4 flex justify-center gap-6">
                    <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Clinical Credits</a>
                </div>
            </footer>
        </div>
    );
};

export default Landing;