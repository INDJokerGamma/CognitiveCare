// frontend/src/pages/tests/MathTest.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const MathTest = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [testStage, setTestStage] = useState('intro');
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [userValue, setUserValue] = useState('');

    const questions = [
        { q: "What is 100 minus 7?", a: 93 },
        { q: "Subtract 7 from that result (93 - 7):", a: 86 },
        { q: "Subtract 7 again (86 - 7):", a: 79 },
        { q: "And once more (79 - 7):", a: 72 },
        { q: "Final one (72 - 7):", a: 65 }
    ];

    const handleSubmitAnswer = (e) => {
        e.preventDefault();
        const isCorrect = parseInt(userValue) === questions[currentQuestion].a;
        const newAnswers = [...answers, isCorrect];
        setAnswers(newAnswers);
        setUserValue('');

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateAndSave(newAnswers);
        }
    };

    const calculateAndSave = async (finalAnswers) => {
        const correctCount = finalAnswers.filter(x => x).length;
        const finalScore = Math.round((correctCount / questions.length) * 100);
        setScore(finalScore);

        try {
            await axios.post('http://localhost:5000/api/tests/save', {
                userId: user.uid,
                userEmail: user.email,
                testType: "Attention & Logic (Serial 7s)",
                score: finalScore,
                mentalState: finalScore > 70 ? "Stable" : "Requires Review"
            });
            toast.success("Score saved!");
            setTestStage('result');
        } catch (error) {
            toast.error("Save failed");
            setTestStage('result');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
                {testStage === 'intro' && (
                    <div className="text-center">
                        <Zap className="mx-auto text-amber-500 mb-6" size={48} />
                        <h2 className="text-3xl font-black mb-4">Serial Subtraction</h2>
                        <p className="text-slate-500 mb-8">This test measures concentration. You will start at 100 and subtract 7 repeatedly.</p>
                        <button onClick={() => setTestStage('active')} className="bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold">Start Math Challenge</button>
                    </div>
                )}

                {testStage === 'active' && (
                    <div className="text-center">
                        <p className="text-slate-400 font-bold mb-2">Question {currentQuestion + 1} of 5</p>
                        <h2 className="text-3xl font-black mb-8">{questions[currentQuestion].q}</h2>
                        <form onSubmit={handleSubmitAnswer}>
                            <input
                                autoFocus
                                type="number"
                                value={userValue}
                                onChange={(e) => setUserValue(e.target.value)}
                                className="w-full text-center text-4xl font-black py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-amber-500/20 mb-6"
                            />
                            <button className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold">Next Question</button>
                        </form>
                    </div>
                )}

                {testStage === 'result' && (
                    <div className="text-center">
                        <CheckCircle className="mx-auto text-emerald-500 mb-6" size={48} />
                        <h2 className="text-3xl font-black mb-2">Well Done!</h2>
                        <div className="text-7xl font-black text-primary my-8">{score}%</div>
                        <button onClick={() => navigate('/dashboard')} className="w-full bg-dark text-white py-4 rounded-2xl font-bold">Back to Dashboard</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MathTest;