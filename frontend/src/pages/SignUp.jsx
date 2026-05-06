
// frontend/src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Globe, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const SignUp = () => {
    const navigate = useNavigate();
    const [lang, setLang] = useState('en');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const content = {
        en: { title: "Create Account", subtitle: "Start your cognitive health journey", namePl: "Full Name", emailPl: "Email Address", passPl: "Password", btn: "Sign Up", or: "Or sign up with", footer: "Already have an account?", loginLink: "Sign In" },
        mr: { title: "खाते तयार करा", subtitle: "तुमचा आरोग्य प्रवास सुरू करा", namePl: "पूर्ण नाव", emailPl: "ईमेल पत्ता", passPl: "पासवर्ड", btn: "साइन अप करा", or: "किंवा यासह साइन अप करा", footer: "आधीच खाते आहे?", loginLink: "लॉग इन करा" }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            // Update the user profile with their name
            await updateProfile(userCredential.user, { displayName: formData.name });
            toast.success(lang === 'en' ? "Account created successfully!" : "खाते यशस्वीरित्या तयार झाले!");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            {/* Language Toggle */}
            <button
                onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
                className="absolute top-8 right-8 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all font-medium text-primary border border-slate-100"
            >
                <Globe size={18} />
                {lang === 'en' ? 'मराठी' : 'English'}
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-dark">{content[lang].title}</h1>
                    <p className="text-slate-500 mt-2">{content[lang].subtitle}</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            required
                            type="text"
                            placeholder={content[lang].namePl}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            required
                            type="email"
                            placeholder={content[lang].emailPl}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            required
                            type="password"
                            placeholder={content[lang].passPl}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">{content[lang].or}</span></div>
                </div>

                <button
                    onClick={handleGoogleSignUp}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" className="w-5" />
                    Google
                </button>

                <p className="text-center mt-8 text-slate-500 font-medium">
                    {content[lang].footer} <Link to="/login" className="text-primary font-bold hover:underline">{content[lang].loginLink}</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUp;