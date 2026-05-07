// frontend/src/pages/tests/MMSETest.jsx
import { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle, ArrowLeft, Brain, CheckCircle, ChevronRight, RotateCcw, Mic, MicOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const MEMORY_WORDS = ['Apple', 'Penny', 'Table'];
const SERIAL_SEVENS = [93, 86, 79, 72, 65];
const TOTAL_SCORE = 30;

const normalize = (value) => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, ' ');

const buildQuestions = () => {
    const today = new Date();
    return [
        { id: 'year', section: 'Orientation to Time', prompt: 'What year is it?', inputType: 'select', options: Array.from({ length: 5 }, (_, i) => String(today.getFullYear() - 2 + i)), maxScore: 1, score: (v) => (String(v) === String(today.getFullYear()) ? 1 : 0) },
        { id: 'season', section: 'Orientation to Time', prompt: 'What season is it?', inputType: 'select', options: ['Spring', 'Summer', 'Autumn', 'Winter'], maxScore: 1, score: (v) => (v.length > 0 ? 1 : 0) },
        { id: 'date', section: 'Orientation to Time', prompt: "What is today's date?", inputType: 'select', options: Array.from({ length: 31 }, (_, i) => String(i + 1)), maxScore: 1, score: (v) => (String(v) === String(today.getDate()) ? 1 : 0) },
        { id: 'day', section: 'Orientation to Time', prompt: 'What day of the week is it?', inputType: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], maxScore: 1, score: (v) => (v.length > 0 ? 1 : 0) },
        { id: 'month', section: 'Orientation to Time', prompt: 'What month is it?', inputType: 'select', options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], maxScore: 1, score: (v) => (v.length > 0 ? 1 : 0) },
        { id: 'country', section: 'Orientation to Place', prompt: 'Which country are you in?', inputType: 'text', maxScore: 1, score: (v) => (normalize(v).length > 0 ? 1 : 0) },
        { id: 'state', section: 'Orientation to Place', prompt: 'Which state or province are you in?', inputType: 'text', maxScore: 1, score: (v) => (normalize(v).length > 0 ? 1 : 0) },
        { id: 'city', section: 'Orientation to Place', prompt: 'Which city or town are you in?', inputType: 'text', maxScore: 1, score: (v) => (normalize(v).length > 0 ? 1 : 0) },
        { id: 'building', section: 'Orientation to Place', prompt: 'What building or place are you in?', inputType: 'text', maxScore: 1, score: (v) => (normalize(v).length > 0 ? 1 : 0) },
        { id: 'floor', section: 'Orientation to Place', prompt: 'What floor or room are you in?', inputType: 'text', maxScore: 1, score: (v) => (normalize(v).length > 0 ? 1 : 0) },
        { id: 'registration', section: 'Registration', prompt: 'Repeat these words: Apple, Penny, Table.', inputType: 'words', words: MEMORY_WORDS, maxScore: 3, score: (v) => (Array.isArray(v) ? v.filter(w => normalize(w).length > 0).length : 0) },
        { id: 'serial-sevens', section: 'Attention', prompt: 'Starting at 100, subtract 7 five times.', inputType: 'serial', maxScore: 5, score: (v = []) => v.reduce((c, a, i) => (Number(a) === SERIAL_SEVENS[i] ? c + 1 : c), 0) },
        { id: 'recall', section: 'Recall', prompt: 'What were the three words from earlier?', inputType: 'words', words: MEMORY_WORDS, maxScore: 3, score: (v) => (Array.isArray(v) ? v.filter(w => normalize(w).length > 0).length : 0) },
        { id: 'name-pencil', section: 'Language', prompt: 'Name this object: Pencil', inputType: 'text', maxScore: 1, score: (v) => (normalize(v).includes('pencil') ? 1 : 0) },
        { id: 'name-watch', section: 'Language', prompt: 'Name this object: Watch', inputType: 'text', maxScore: 1, score: (v) => (normalize(v).includes('watch') || normalize(v).includes('clock') ? 1 : 0) },
        { id: 'repeat', section: 'Language', prompt: 'Repeat: No ifs, ands, or buts.', inputType: 'text', maxScore: 1, score: (v) => (normalize(v).includes('ifs') ? 1 : 0) },
        { id: 'command', section: 'Language', prompt: 'Follow the 3-step command: Take paper, fold it, put it on floor.', inputType: 'checklist', steps: ['Took paper', 'Folded in half', 'Put on floor'], maxScore: 3, score: (v = {}) => Object.values(v).filter(Boolean).length },
        { id: 'read', section: 'Language', prompt: 'Read and follow: CLOSE YOUR EYES.', inputType: 'checkbox', maxScore: 1, score: (v) => (v ? 1 : 0) },
        { id: 'write', section: 'Language', prompt: 'Write one complete sentence.', inputType: 'textarea', maxScore: 1, score: (v) => (v?.trim().split(/\s+/).length >= 3 ? 1 : 0) },
        { id: 'drawing', section: 'Visuospatial', prompt: 'Copy the intersecting pentagons.', inputType: 'drawing', maxScore: 1, score: (v) => (v?.hasDrawing ? 1 : 0) }
    ];
};

const MMSETest = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { i18n } = useTranslation();
    const questions = useMemo(() => buildQuestions(), []);

    const [stage, setStage] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const updateAnswer = (value) => setAnswers(prev => ({ ...prev, [question.id]: value }));

    const toggleMic = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return toast.error("Not supported");
        const rec = new SpeechRecognition();
        rec.lang = i18n.language === 'mr' ? 'mr-IN' : 'en-US';
        rec.onstart = () => setIsListening(true);
        rec.onresult = (e) => { updateAnswer(e.results[0][0].transcript); setIsListening(false); };
        rec.onerror = () => setIsListening(false);
        rec.start();
    };

    const handleNext = async () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setIsSaving(true);
            let rawScore = 0;
            questions.forEach(q => { rawScore += Math.min(q.score(answers[q.id]), q.maxScore); });
            const finalRes = { rawScore, percentage: Math.round((rawScore / TOTAL_SCORE) * 100), mentalState: rawScore >= 24 ? 'Stable' : 'Concern' };
            setResult(finalRes);
            try {
                await axios.post(`${API_URL}/api/tests/save`, { userId: user.uid, userEmail: user.email, testType: 'MMSE', score: finalRes.percentage, mentalState: finalRes.mentalState });
                toast.success('Saved!');
            } catch (e) { toast.error('Saved locally'); }
            setIsSaving(false); setStage('result');
        }
    };

    if (stage === 'intro') return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
                <Brain className="mx-auto text-primary mb-6" size={60} />
                <h1 className="text-4xl font-black mb-4 tracking-tight">MMSE Professional</h1>
                <p className="text-slate-500 mb-10 text-lg leading-relaxed">Full 30-point Mini-Mental State Examination.</p>
                <button onClick={() => setStage('active')} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">Start Test</button>
            </motion.div>
        </div>
    );

    if (stage === 'result') return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md bg-white p-12 rounded-[3rem] shadow-2xl">
                <CheckCircle className="mx-auto text-secondary mb-6" size={80} />
                <div className="text-8xl font-black text-primary my-6">{result?.rawScore}<span className="text-2xl text-slate-300">/30</span></div>
                <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Dashboard</button>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                <div className="mb-10">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                        <span>{question.section}</span>
                        <span>{currentQuestion + 1} / {questions.length}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-10 leading-tight">{question.prompt}</h2>

                <div className="flex gap-4 items-start mb-12">
                    <div className="flex-1">
                        <QuestionInput question={question} value={answers[question.id]} onChange={updateAnswer} />
                    </div>
                    {['text', 'textarea', 'words'].includes(question.inputType) && (
                        <button onClick={toggleMic} className={`p-5 rounded-2xl transition-all shadow-lg ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                        </button>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(currentQuestion - 1)} className="font-bold text-slate-400 disabled:opacity-0 transition-all">Previous</button>
                    <button onClick={handleNext} className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                        {currentQuestion === questions.length - 1 ? (isSaving ? 'Saving...' : 'Finish') : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const QuestionInput = ({ question, value, onChange }) => {
    switch (question.inputType) {
        case 'select':
            return (
                <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-primary/20 font-bold text-lg">
                    <option value="">Select...</option>
                    {question.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            );
        case 'words':
            const words = Array.isArray(value) ? value : ['', '', ''];
            return (
                <div className="grid grid-cols-3 gap-3">
                    {words.map((w, i) => (
                        <input key={i} value={w} onChange={(e) => {
                            const n = [...words]; n[i] = e.target.value; onChange(n);
                        }} placeholder="Word" className="p-5 bg-slate-50 rounded-2xl border-none w-full outline-none focus:ring-2 focus:ring-primary/20 font-bold text-center" />
                    ))}
                </div>
            );
        case 'serial':
            const values = Array.isArray(value) ? value : ['', '', '', '', ''];
            return (
                <div className="grid grid-cols-5 gap-2">
                    {values.map((v, i) => (
                        <input key={i} type="number" value={v} onChange={(e) => {
                            const n = [...values]; n[i] = e.target.value; onChange(n);
                        }} className="p-4 bg-slate-50 rounded-xl border-none w-full text-center outline-none focus:ring-2 focus:ring-primary/20 font-black text-xl" />
                    ))}
                </div>
            );
        case 'checklist':
            const checked = value || {};
            return (
                <div className="space-y-3">
                    {question.steps.map(s => (
                        <label key={s} className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl cursor-pointer">
                            <input type="checkbox" checked={!!checked[s]} onChange={(e) => onChange({ ...checked, [s]: e.target.checked })} className="w-6 h-6 accent-primary" />
                            <span className="font-bold text-slate-700">{s}</span>
                        </label>
                    ))}
                </div>
            );
        case 'checkbox':
            return (
                <label className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl cursor-pointer">
                    <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="w-8 h-8 accent-primary" />
                    <span className="font-bold text-slate-700 text-lg">Task completed successfully</span>
                </label>
            );
        case 'textarea':
            return <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full p-6 bg-slate-50 rounded-[2rem] outline-none focus:ring-2 focus:ring-primary/20 font-bold text-lg resize-none" placeholder="Type here..." />;
        case 'drawing':
            return (
                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex justify-center">
                        <svg width="240" height="120" viewBox="0 0 240 120">
                            <polygon points="50,10 90,40 75,90 25,90 10,40" fill="none" stroke="#0f172a" strokeWidth="4" />
                            <polygon points="110,10 150,40 135,90 85,90 70,40" fill="none" stroke="#0f172a" strokeWidth="4" />
                        </svg>
                    </div>
                    <DrawingBoard onChange={onChange} />
                </div>
            );
        default:
            return <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-primary/20 font-bold text-lg" />;
    }
};

const DrawingBoard = ({ onChange }) => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        const c = canvasRef.current;
        const context = c.getContext('2d');
        context.lineWidth = 4; context.lineCap = 'round'; context.strokeStyle = '#0f172a';
        setCtx(context);
    }, []);

    const start = (e) => {
        setDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const move = (e) => {
        if (!drawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top); ctx.stroke();
        onChange({ hasDrawing: true });
    };

    return (
        <div>
            <canvas ref={canvasRef} width={800} height={400} onMouseDown={start} onMouseMove={move} onMouseUp={() => setDrawing(false)} onMouseLeave={() => setDrawing(false)} className="w-full bg-white rounded-[2rem] border-2 border-dashed border-slate-200 cursor-crosshair touch-none" />
            <button onClick={() => { ctx.clearRect(0, 0, 800, 400); onChange({ hasDrawing: false }); }} className="mt-4 text-sm font-bold text-slate-400 hover:text-primary">Clear Canvas</button>
        </div>
    );
};

export default MMSETest;