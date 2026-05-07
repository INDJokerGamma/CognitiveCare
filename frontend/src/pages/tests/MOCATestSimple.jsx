// frontend/src/pages/tests/MOCATestSimple.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Brain, ChevronLeft, ChevronRight, CheckCircle, Mic, MicOff, AlertCircle } from 'lucide-react';

const MOCATestSimple = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t, i18n } = useTranslation();

    // Test Flow States
    const [testStarted, setTestStarted] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Mic States
    const [isListening, setIsListening] = useState(false);

    // Clinical MoCA Questions (Simplified for Digital)
    const questions = [
        { id: 1, type: 'memory', question: "Memorize these 5 words: Apple, Velvet, Church, Daisy, Red. Repeat them now.", words: ['Apple', 'Velvet', 'Church', 'Daisy', 'Red'], field: 'memory_reg', maxScore: 5 },
        { id: 2, type: 'naming', question: "Name the animal: A large cat with a mane.", animals: ['Lion'], field: 'naming_1', maxScore: 1 },
        { id: 3, type: 'naming', question: "Name the animal: It has a horn on its nose.", animals: ['Rhino'], field: 'naming_2', maxScore: 1 },
        { id: 4, type: 'attention', question: "Starting from 100, subtract 7. What is the result?", field: 'math_1', maxScore: 1 },
        { id: 5, type: 'attention', question: "Subtract 7 from that result again.", field: 'math_2', maxScore: 1 },
        { id: 6, type: 'language', question: "Repeat this sentence: 'I only know that John is the one to help today.'", field: 'lang_1', maxScore: 2 },
        { id: 7, type: 'recall', question: "What were the 5 words I asked you to remember at the beginning?", words: ['Apple', 'Velvet', 'Church', 'Daisy', 'Red'], field: 'delayed_recall', maxScore: 5 },
        { id: 8, type: 'orientation', question: "What is today's full date (Day, Month, Year)?", field: 'orientation', maxScore: 3 }
    ];

    // --- SPEECH RECOGNITION LOGIC ---
    const toggleMic = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = i18n.language === 'mr' ? 'mr-IN' : 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            toast('Listening...', { icon: '🎤' });
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setAnswers({ ...answers, [currentQuestion]: transcript });
            setIsListening(false);
            toast.success("Voice Captured!");
        };

        recognition.onerror = () => {
            setIsListening(false);
            toast.error("Could not hear clearly. Try again.");
        };

        recognition.start();
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            processFinalResults();
        }
    };

    const processFinalResults = async () => {
        setIsSaving(true);
        let calculatedScore = 0;

        // Simplified Auto-Scoring Logic
        questions.forEach((q, index) => {
            const userAns = (answers[index] || "").toLowerCase().trim();
            if (userAns.length > 2) calculatedScore += q.maxScore; // Basic validation
        });

        setScore(calculatedScore);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/tests/save`, {
                userId: user.uid,
                userEmail: user.email,
                testType: "MoCA Professional Screening",
                score: calculatedScore,
                mentalState: calculatedScore > 15 ? "Stable" : "Evaluation Recommended"
            });
            setTestCompleted(true);
        } catch (err) {
            console.error(err);
            toast.error("Could not save to database.");
            setTestCompleted(true);
        } finally {
            setIsSaving(false);
        }
    };

    // --- UI VIEWS ---

    if (!testStarted) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl bg-white p-10 rounded-[3rem] shadow-2xl text-center border border-slate-100">
                <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Brain size={40} />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">MoCA Screening</h1>
                <p className="text-slate-500 mb-8 text-lg">A comprehensive clinical assessment of memory, language, and logic. This test supports voice input for better accessibility.</p>
                <button onClick={() => setTestStarted(true)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                    Start Professional Test
                </button>
            </motion.div>
        </div>
    );

    if (testCompleted) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md bg-white p-12 rounded-[3rem] shadow-2xl">
                <CheckCircle className="mx-auto text-emerald-500 mb-6" size={80} />
                <h2 className="text-3xl font-black text-slate-900">Assessment Complete</h2>
                <div className="text-8xl font-black text-primary my-8">{score}<span className="text-2xl text-slate-300">/20</span></div>
                <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">
                    Return to Dashboard
                </button>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-3xl w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                    <motion.div
                        className="h-full bg-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <div className="flex justify-between items-center mb-10 mt-2">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Question {currentQuestion + 1} of {questions.length}</span>
                    <span className="bg-purple-50 text-purple-600 px-4 py-1 rounded-full text-xs font-bold">Clinical Module</span>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                    {questions[currentQuestion].question}
                </h2>

                <div className="flex gap-4 items-start mb-10">
                    <textarea
                        className="flex-1 p-6 bg-slate-50 border-none rounded-[2rem] h-40 outline-none focus:ring-2 focus:ring-purple-500/20 text-lg font-medium text-slate-700 placeholder:text-slate-300 transition-all"
                        placeholder="Type your answer here or use the microphone..."
                        value={answers[currentQuestion] || ''}
                        onChange={(e) => setAnswers({ ...answers, [currentQuestion]: e.target.value })}
                    />

                    <button
                        onClick={toggleMic}
                        className={`p-5 rounded-2xl transition-all shadow-lg ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
                    >
                        {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                    </button>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                        className="flex items-center gap-2 font-bold text-slate-400 disabled:opacity-0 transition-all"
                    >
                        <ChevronLeft size={20} /> Previous
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isSaving}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        {currentQuestion === questions.length - 1 ? (isSaving ? "Saving..." : "Finish Test") : "Next Question"}
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="mt-8 flex items-center gap-2 text-slate-400 text-sm italic">
                    <AlertCircle size={16} />
                    <span>The microphone supports both Marathi and English detection.</span>
                </div>
            </div>
        </div>
    );
};

export default MOCATestSimple;