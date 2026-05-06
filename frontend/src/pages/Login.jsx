// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Globe, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [lang, setLang] = useState('en');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const content = {
        en: {
            title: "Welcome Back",
            subtitle: "Sign in to your assessment portal",
            emailPl: "Email Address",
            passPl: "Password",
            btn: "Sign In",
            or: "Or continue with",
            footer: "New to the platform?",
            signupLink: "Create Account"
        },
        mr: {
            title: "पुनरागमन स्वागत आहे",
            subtitle: "तुमच्या पोर्टलमध्ये लॉग इन करा",
            emailPl: "ईमेल पत्ता",
            passPl: "पासवर्ड",
            btn: "लॉग इन करा",
            or: "किंवा यासह पुढे जा",
            footer: "प्लॅटफॉर्मवर नवीन आहात?",
            signupLink: "खाते तयार करा"
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success(lang === 'en' ? "Welcome back!" : "स्वागत आहे!");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            {/* Language Toggle */}
            <button
                onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
                className="absolute top-8 right-8 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all font-bold text-primary border border-slate-100"
            >
                <Globe size={18} />
                {lang === 'en' ? 'मराठी' : 'English'}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-dark tracking-tight">{content[lang].title}</h1>
                    <p className="text-slate-500 mt-2 font-medium">{content[lang].subtitle}</p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            required
                            type="email"
                            placeholder={content[lang].emailPl}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            required
                            type="password"
                            placeholder={content[lang].passPl}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? "..." : content[lang].btn} <ArrowRight size={18} />
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">{content[lang].or}</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" className="w-5" />
                    Google
                </button>

                <p className="text-center mt-10 text-slate-500 font-medium">
                    {content[lang].footer}{' '}
                    <Link to="/signup" className="text-primary font-bold hover:underline">
                        {content[lang].signupLink}
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;