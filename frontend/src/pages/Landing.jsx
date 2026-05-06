// frontend/src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ShieldCheck, BarChart3, Globe, ChevronRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Brain className="text-primary" />,
            title: "Scientific Assessment",
            desc: "Validated memory recall and cognitive focus tests designed for early detection."
        },
        {
            icon: <Globe className="text-secondary" />,
            title: "Local Language Support",
            desc: "Full support for Marathi and English to ensure comfort for all users."
        },
        {
            icon: <BarChart3 className="text-orange-500" />,
            title: "Progress Tracking",
            desc: "Visual analytics to monitor cognitive trends over weeks and months."
        },
        {
            icon: <ShieldCheck className="text-emerald-500" />,
            title: "Privacy First",
            desc: "Your data is encrypted and securely stored using enterprise-grade cloud security."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-dark font-sans">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                        <Brain size={24} />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">CognitiveCare</span>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="font-semibold text-primary hover:text-blue-700 transition-colors"
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <header className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-blue-50 text-primary rounded-full text-sm font-bold mb-6"
                    >
                        Now with Marathi Language Support
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black leading-tight mb-6"
                    >
                        Early Detection for <span className="text-primary">Better Care.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed"
                    >
                        A simple, non-invasive platform to assess memory and cognitive health from the comfort of your home.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            Get Started Free <ChevronRight size={20} />
                        </button>
                        <button className="bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all">
                            Learn More
                        </button>
                    </motion.div>
                </div>
                <div className="flex-1 w-full max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl" />
                        <img
                            src="https://img.freepik.com/free-vector/human-brain-structure-concept_23-2148754361.jpg"
                            alt="Cognitive Assessment"
                            className="relative rounded-3xl shadow-2xl"
                        />
                    </motion.div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why choose CognitiveCare?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto italic">Designed to be accessible for seniors and powerful for clinicians.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-xl mb-3">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
                <p>&copy; 2026 CognitiveCare Assessment Platform. Built for Public Health.</p>
            </footer>
        </div>
    );
};

export default Landing;