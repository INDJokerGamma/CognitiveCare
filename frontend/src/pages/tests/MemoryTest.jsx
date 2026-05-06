// frontend/src/pages/MemoryTest.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

// Updated: 7 words for a "bigger" test
const TEST_WORDS = {
    en: ['Apple', 'Table', 'Coin', 'Train', 'Window', 'Garden', 'Cloud'],
    mr: ['सफरचंद', 'टेबल', 'नाणे', 'ट्रेन', 'खिडकी', 'बाग', 'ढग']
};

const MemoryTest = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [lang] = useState('en'); // Future: could be pulled from user profile

    // Test States
    const [testStage, setTestStage] = useState('intro');
    const [timeLeft, setTimeLeft] = useState(15); // Increased to 15 seconds
    const [userInputs, setUserInputs] = useState(['', '', '', '', '', '', '']); // 7 slots
    const [score, setScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Timer logic
    useEffect(() => {
        let timer;
        if (testStage === 'memorize' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (testStage === 'memorize' && timeLeft === 0) {
            setTestStage('recall');
        }
        return () => clearInterval(timer);
    }, [testStage, timeLeft]);

    const handleInputChange = (index, value) => {
        const newInputs = [...userInputs];
        newInputs[index] = value;
        setUserInputs(newInputs);
    };

    const submitTest = async () => {
        setIsSaving(true);
        const correctWords = TEST_WORDS[lang].map(w => w.toLowerCase());
        let matches = 0;

        // We check if the trimmed input exists anywhere in the correct list
        userInputs.forEach(input => {
            const trimmed = input.toLowerCase().trim();
            if (trimmed && correctWords.includes(trimmed)) {
                matches++;
            }
        });

        // Calculate percentage based on 7 words
        const finalScore = Math.round((matches / TEST_WORDS[lang].length) * 100);
        setScore(finalScore);

        let state = "Stable";
        if (finalScore <= 40) state = "Moderate Concern";
        else if (finalScore <= 70) state = "Mild Decline";

        try {
            await axios.post('http://localhost:5000/api/tests/save', {
                userId: user.uid,
                userEmail: user.email,
                testType: "Extended Memory Recall",
                score: finalScore,
                mentalState: state
            });

            toast.success("Assessment saved successfully!");
            setTestStage('result');
        } catch (error) {
            console.error(error);
            toast.error("Network error: Could not save score.");
            setTestStage('result');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">

                {/* STAGE 1: INSTRUCTIONS */}
                {testStage === 'intro' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary">
                            <Brain size={40} />
                        </div>
                        <h1 className="text-4xl font-black text-dark mb-4 tracking-tight">Memory Assessment</h1>
                        <p className="text-slate-500 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
                            You will see <span className="font-bold text-primary">7 specific words</span>.
                            You have <span className="font-bold text-primary">15 seconds</span> to memorize them before they disappear.
                        </p>
                        <button
                            onClick={() => setTestStage('memorize')}
                            className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-blue-700 transition-all"
                        >
                            Start Assessment
                        </button>
                    </motion.div>
                )}

                {/* STAGE 2: MEMORIZE */}
                {testStage === 'memorize' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                        <div className="inline-flex items-center gap-3 bg-orange-50 text-orange-600 px-6 py-2 rounded-full mb-10 font-bold">
                            <Clock size={20} />
                            <span className="text-xl">00:{timeLeft.toString().padStart(2, '0')}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-400 mb-8 uppercase tracking-widest">Memorize Carefully</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {TEST_WORDS[lang].map((word, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={index}
                                    className="bg-slate-50 px-8 py-5 rounded-2xl text-2xl font-black text-dark border border-slate-100 shadow-sm"
                                >
                                    {word}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STAGE 3: RECALL */}
                {testStage === 'recall' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-dark mb-2">Recall Phase</h2>
                            <p className="text-slate-500 font-medium">Type the 7 words you remember below.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {userInputs.map((input, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={input}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    placeholder={`Word ${index + 1}`}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-dark"
                                />
                            ))}
                        </div>

                        <button
                            onClick={submitTest}
                            disabled={isSaving}
                            className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl transition-all ${isSaving ? "bg-slate-400" : "bg-secondary shadow-secondary/30 hover:bg-emerald-600"
                                }`}
                        >
                            {isSaving ? "Processing Results..." : "Complete Assessment"}
                        </button>
                    </motion.div>
                )}

                {/* STAGE 4: RESULTS */}
                {testStage === 'result' && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="text-secondary" size={48} />
                        </div>
                        <h2 className="text-4xl font-black text-dark mb-2 tracking-tight">Test Complete</h2>
                        <p className="text-slate-500 text-lg mb-10">Your memory performance score:</p>

                        <div className="relative inline-block mb-12">
                            <span className="text-8xl font-black text-primary italic">{score}%</span>
                            <div className="absolute -bottom-2 left-0 w-full h-2 bg-primary/10 rounded-full"></div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-dark text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                            >
                                Return to Dashboard
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-slate-400 font-bold hover:text-primary transition-colors"
                            >
                                Retake Test
                            </button>
                        </div>
                    </motion.div>
                )}

            </div>

            {/* Helpful Hint Footnote */}
            {testStage === 'recall' && (
                <p className="mt-8 text-slate-400 flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={14} /> Spelling matters, but the order of words does not.
                </p>
            )}
        </div>
    );
};

export default MemoryTest;