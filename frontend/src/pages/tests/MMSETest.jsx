import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle, ArrowLeft, Brain, CheckCircle, ChevronRight, Clock, RotateCcw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const MEMORY_WORDS = ['Apple', 'Penny', 'Table'];
const SERIAL_SEVENS = [93, 86, 79, 72, 65];
const TOTAL_SCORE = 30;

const normalize = (value) =>
    String(value || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, ' ');

const getSeason = (date) => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
};

const countWordMatches = (expectedWords, userWords = []) =>
    expectedWords.reduce((count, word) => {
        const expected = normalize(word);
        const matched = userWords.some((userWord) => normalize(userWord).includes(expected));
        return matched ? count + 1 : count;
    }, 0);

const scoreWrittenSentence = (value) => {
    const words = String(value || '').trim().split(/\s+/).filter(Boolean);
    return words.length >= 3 ? 1 : 0;
};

const buildQuestions = () => {
    const today = new Date();
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    const season = getSeason(today);

    return [
        {
            id: 'year',
            section: 'Orientation to Time',
            prompt: 'What year is it?',
            inputType: 'select',
            options: Array.from({ length: 7 }, (_, index) => String(year - 3 + index)),
            maxScore: 1,
            score: (value) => (String(value) === String(year) ? 1 : 0)
        },
        {
            id: 'season',
            section: 'Orientation to Time',
            prompt: 'What season is it?',
            inputType: 'select',
            options: ['Spring', 'Summer', 'Autumn', 'Winter'],
            maxScore: 1,
            score: (value) => (value === season ? 1 : 0)
        },
        {
            id: 'date',
            section: 'Orientation to Time',
            prompt: 'What is today\'s date?',
            inputType: 'select',
            options: Array.from({ length: 31 }, (_, index) => String(index + 1)),
            maxScore: 1,
            score: (value) => (String(value) === String(date) ? 1 : 0)
        },
        {
            id: 'day',
            section: 'Orientation to Time',
            prompt: 'What day of the week is it?',
            inputType: 'select',
            options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            maxScore: 1,
            score: (value) => (value === day ? 1 : 0)
        },
        {
            id: 'month',
            section: 'Orientation to Time',
            prompt: 'What month is it?',
            inputType: 'select',
            options: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            maxScore: 1,
            score: (value) => (value === month ? 1 : 0)
        },
        {
            id: 'country',
            section: 'Orientation to Place',
            prompt: 'Which country are you in?',
            inputType: 'text',
            maxScore: 1,
            score: (value) => (normalize(value).length > 0 ? 1 : 0)
        },
        {
            id: 'state',
            section: 'Orientation to Place',
            prompt: 'Which state or province are you in?',
            inputType: 'text',
            maxScore: 1,
            score: (value) => (normalize(value).length > 0 ? 1 : 0)
        },
        {
            id: 'city',
            section: 'Orientation to Place',
            prompt: 'Which city or town are you in?',
            inputType: 'text',
            maxScore: 1,
            score: (value) => (normalize(value).length > 0 ? 1 : 0)
        },
        {
            id: 'building',
            section: 'Orientation to Place',
            prompt: 'What building or place are you in?',
            inputType: 'text',
            maxScore: 1,
            score: (value) => (normalize(value).length > 0 ? 1 : 0)
        },
        {
            id: 'floor',
            section: 'Orientation to Place',
            prompt: 'What floor or room are you in?',
            inputType: 'text',
            maxScore: 1,
            score: (value) => (normalize(value).length > 0 ? 1 : 0)
        },
        {
            id: 'registration',
            section: 'Registration',
            prompt: 'Read these three words, then type them back below.',
            inputType: 'words',
            words: MEMORY_WORDS,
            maxScore: 3,
            score: (value) => countWordMatches(MEMORY_WORDS, value)
        },
        {
            id: 'serial-sevens',
            section: 'Attention',
            prompt: 'Starting at 100, subtract 7 five times.',
            inputType: 'serial',
            maxScore: 5,
            score: (value = []) =>
                value.reduce((count, answer, index) => (
                    Number.parseInt(answer, 10) === SERIAL_SEVENS[index] ? count + 1 : count
                ), 0)
        },
        {
            id: 'recall',
            section: 'Recall',
            prompt: 'What were the three words from earlier?',
            inputType: 'words',
            words: MEMORY_WORDS,
            maxScore: 3,
            score: (value) => countWordMatches(MEMORY_WORDS, value)
        },
        {
            id: 'name-pencil',
            section: 'Language',
            prompt: 'Name this object: pencil.',
            inputType: 'text',
            maxScore: 1,
            score: (value) => (normalize(value).includes('pencil') ? 1 : 0)
        },
        {
            id: 'name-watch',
            section: 'Language',
            prompt: 'Name this object: watch.',
            inputType: 'text',
            maxScore: 1,
            score: (value) => {
                const answer = normalize(value);
                return answer.includes('watch') || answer.includes('clock') ? 1 : 0;
            }
        },
        {
            id: 'repeat',
            section: 'Language',
            prompt: 'Repeat this phrase: No ifs, ands, or buts.',
            inputType: 'text',
            maxScore: 1,
            score: (value) => {
                const answer = normalize(value);
                return ['no', 'ifs', 'ands', 'or', 'buts'].every((word) => answer.includes(word)) ? 1 : 0;
            }
        },
        {
            id: 'command',
            section: 'Language',
            prompt: 'Complete the three-step command.',
            inputType: 'checklist',
            maxScore: 3,
            steps: ['Took the paper in the right hand', 'Folded it in half', 'Put it on the floor'],
            score: (value = {}) => Object.values(value).filter(Boolean).length
        },
        {
            id: 'read',
            section: 'Language',
            prompt: 'Read and follow this instruction: CLOSE YOUR EYES.',
            inputType: 'checkbox',
            maxScore: 1,
            score: (value) => (value ? 1 : 0)
        },
        {
            id: 'write',
            section: 'Language',
            prompt: 'Write one complete sentence.',
            inputType: 'textarea',
            maxScore: 1,
            score: scoreWrittenSentence
        },
        {
            id: 'drawing',
            section: 'Visuospatial',
            prompt: 'Copy the intersecting pentagons.',
            inputType: 'drawing',
            maxScore: 1,
            score: (value) => (value?.hasDrawing ? 1 : 0)
        }
    ];
};

const getMentalState = (rawScore) => {
    if (rawScore >= 24) return 'Stable';
    if (rawScore >= 18) return 'Mild Decline';
    return 'Moderate Concern';
};

const MMSETest = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const questions = useMemo(() => buildQuestions(), []);
    const [stage, setStage] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const updateAnswer = (value) => {
        setAnswers((previous) => ({
            ...previous,
            [question.id]: value
        }));
    };

    const calculateResult = (finalAnswers) => {
        const sectionMap = {};
        let rawScore = 0;

        questions.forEach((item) => {
            const scored = Math.min(item.score(finalAnswers[item.id]), item.maxScore);
            rawScore += scored;

            if (!sectionMap[item.section]) {
                sectionMap[item.section] = { score: 0, maxScore: 0 };
            }

            sectionMap[item.section].score += scored;
            sectionMap[item.section].maxScore += item.maxScore;
        });

        const percentage = Math.round((rawScore / TOTAL_SCORE) * 100);

        return {
            rawScore,
            percentage,
            mentalState: getMentalState(rawScore),
            breakdown: Object.entries(sectionMap).map(([section, values]) => ({
                section,
                ...values
            }))
        };
    };

    const finishTest = async () => {
        setIsSaving(true);
        const finalResult = calculateResult(answers);
        setResult(finalResult);

        try {
            await axios.post(`${API_URL}/api/tests/save`, {
                userId: user.uid,
                userEmail: user.email,
                testType: 'MMSE Cognitive Screening',
                score: finalResult.percentage,
                mentalState: finalResult.mentalState
            });

            toast.success('MMSE result saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Could not save MMSE result. Showing your score here.');
        } finally {
            setIsSaving(false);
            setStage('result');
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((current) => current + 1);
            return;
        }

        finishTest();
    };

    const resetTest = () => {
        setStage('intro');
        setCurrentQuestion(0);
        setAnswers({});
        setResult(null);
        setShowBreakdown(false);
    };

    if (stage === 'intro') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-10 text-center"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary">
                        <Brain size={42} />
                    </div>
                    <p className="text-sm uppercase tracking-widest font-black text-primary mb-3">MMSE Screening</p>
                    <h1 className="text-4xl font-black text-dark tracking-tight mb-4">Mini Mental State Examination</h1>
                    <p className="text-slate-500 text-lg leading-relaxed mb-8">
                        Complete a 30-point cognitive screening across orientation, memory, attention, language, and drawing tasks.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
                        <InfoTile icon={<Clock size={20} />} label="Time" value="10-15 min" />
                        <InfoTile icon={<Activity size={20} />} label="Questions" value={`${questions.length} steps`} />
                        <InfoTile icon={<CheckCircle size={20} />} label="Score" value="30 points" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => setStage('active')}
                            className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            Start MMSE <ChevronRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (stage === 'result' && result) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-3xl w-full bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-10"
                >
                    <div className="text-center">
                        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-secondary" size={50} />
                        </div>
                        <p className="text-sm uppercase tracking-widest font-black text-secondary mb-3">Assessment Complete</p>
                        <h1 className="text-4xl font-black text-dark tracking-tight mb-3">MMSE Result</h1>
                        <div className="my-8">
                            <span className="text-7xl font-black text-primary">{result.rawScore}</span>
                            <span className="text-2xl font-black text-slate-400"> / {TOTAL_SCORE}</span>
                        </div>
                        <p className="text-xl font-bold text-dark mb-1">{result.percentage}%</p>
                        <p className="text-slate-500 mb-8">{result.mentalState}</p>
                    </div>

                    <button
                        onClick={() => setShowBreakdown((value) => !value)}
                        className="w-full bg-slate-50 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-all mb-5"
                    >
                        {showBreakdown ? 'Hide' : 'Show'} Score Breakdown
                    </button>

                    {showBreakdown && (
                        <div className="space-y-3 mb-8">
                            {result.breakdown.map((item) => (
                                <ScoreRow key={item.section} label={item.section} score={item.score} maxScore={item.maxScore} />
                            ))}
                        </div>
                    )}

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex gap-3 text-amber-800">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <p className="text-sm leading-relaxed">
                            MMSE is a screening tool. Scores below 24/30 may need clinical review, especially when symptoms or daily-life concerns are present.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={resetTest}
                            className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={18} /> Retake
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-dark text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 font-bold"
                >
                    <ArrowLeft size={20} /> Dashboard
                </button>

                <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden"
                >
                    <div className="p-6 md:p-8 border-b border-slate-100">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div>
                                <p className="text-sm uppercase tracking-widest font-black text-primary mb-1">{question.section}</p>
                                <p className="text-sm text-slate-400 font-bold">
                                    Question {currentQuestion + 1} of {questions.length}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-400 font-bold">Max score</p>
                                <p className="text-2xl font-black text-dark">{question.maxScore}</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        <h1 className="text-2xl md:text-3xl font-black text-dark tracking-tight mb-8">{question.prompt}</h1>
                        <QuestionInput
                            question={question}
                            value={answers[question.id]}
                            onChange={updateAnswer}
                        />
                    </div>

                    <div className="p-6 md:p-8 bg-slate-50 flex justify-between gap-3">
                        <button
                            onClick={() => setCurrentQuestion((current) => Math.max(0, current - 1))}
                            disabled={currentQuestion === 0 || isSaving}
                            className="px-6 py-3 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isSaving}
                            className="px-6 py-3 rounded-2xl font-bold text-white bg-primary hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all disabled:bg-slate-400 disabled:shadow-none flex items-center gap-2"
                        >
                            {isSaving ? 'Saving...' : currentQuestion === questions.length - 1 ? 'Complete MMSE' : 'Next'}
                            {!isSaving && <ChevronRight size={18} />}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const InfoTile = ({ icon, label, value }) => (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <div className="text-primary mb-3">{icon}</div>
        <p className="text-xs uppercase tracking-widest font-black text-slate-400">{label}</p>
        <p className="font-black text-dark">{value}</p>
    </div>
);

const QuestionInput = ({ question, value, onChange }) => {
    if (question.inputType === 'select') {
        return (
            <select
                value={value || ''}
                onChange={(event) => onChange(event.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-dark"
            >
                <option value="">Select an answer</option>
                {question.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        );
    }

    if (question.inputType === 'words') {
        const words = Array.isArray(value) ? value : ['', '', ''];
        return (
            <div className="space-y-5">
                {question.id === 'registration' && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
                        <p className="text-2xl font-black text-primary tracking-wide">{question.words.join('  ')}</p>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {question.words.map((word, index) => (
                        <input
                            key={word}
                            type="text"
                            value={words[index] || ''}
                            onChange={(event) => {
                                const nextWords = [...words];
                                nextWords[index] = event.target.value;
                                onChange(nextWords);
                            }}
                            placeholder={`Word ${index + 1}`}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-dark"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (question.inputType === 'serial') {
        const values = Array.isArray(value) ? value : ['', '', '', '', ''];
        return (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {SERIAL_SEVENS.map((_, index) => (
                    <input
                        key={index}
                        type="number"
                        value={values[index] || ''}
                        onChange={(event) => {
                            const nextValues = [...values];
                            nextValues[index] = event.target.value;
                            onChange(nextValues);
                        }}
                        placeholder={`Step ${index + 1}`}
                        className="w-full text-center px-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 font-black text-dark text-xl"
                    />
                ))}
            </div>
        );
    }

    if (question.inputType === 'checklist') {
        const checked = value || {};
        return (
            <div className="space-y-3">
                {question.steps.map((step) => (
                    <label key={step} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={Boolean(checked[step])}
                            onChange={(event) => onChange({ ...checked, [step]: event.target.checked })}
                            className="w-5 h-5 accent-blue-600"
                        />
                        <span className="font-bold text-slate-700">{step}</span>
                    </label>
                ))}
            </div>
        );
    }

    if (question.inputType === 'checkbox') {
        return (
            <label className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 cursor-pointer">
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => onChange(event.target.checked)}
                    className="w-5 h-5 accent-blue-600"
                />
                <span className="font-bold text-slate-700">Completed the instruction</span>
            </label>
        );
    }

    if (question.inputType === 'textarea') {
        return (
            <textarea
                value={value || ''}
                onChange={(event) => onChange(event.target.value)}
                rows={4}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-dark resize-none"
                placeholder="Type your sentence here..."
            />
        );
    }

    if (question.inputType === 'drawing') {
        return (
            <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-center">
                    <PentagonSample />
                </div>
                <DrawingBoard value={value} onChange={onChange} />
            </div>
        );
    }

    return (
        <input
            type="text"
            value={value || ''}
            onChange={(event) => onChange(event.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-dark"
            placeholder="Type your answer here..."
        />
    );
};

const PentagonSample = () => (
    <svg width="260" height="150" viewBox="0 0 260 150" role="img" aria-label="Intersecting pentagons drawing">
        <polygon
            points="72,24 130,64 108,130 36,130 14,64"
            fill="none"
            stroke="#0f172a"
            strokeWidth="5"
            strokeLinejoin="round"
        />
        <polygon
            points="150,24 208,64 186,130 114,130 92,64"
            fill="none"
            stroke="#0f172a"
            strokeWidth="5"
            strokeLinejoin="round"
        />
    </svg>
);

const DrawingBoard = ({ onChange }) => {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);

    const getPoint = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: ((event.clientX - rect.left) / rect.width) * canvas.width,
            y: ((event.clientY - rect.top) / rect.height) * canvas.height
        };
    };

    const startDrawing = (event) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const point = getPoint(event);

        isDrawingRef.current = true;
        canvas.setPointerCapture(event.pointerId);
        context.beginPath();
        context.moveTo(point.x, point.y);
    };

    const draw = (event) => {
        if (!isDrawingRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const point = getPoint(event);

        context.lineWidth = 4;
        context.lineCap = 'round';
        context.strokeStyle = '#0f172a';
        context.lineTo(point.x, point.y);
        context.stroke();
        onChange({ hasDrawing: true, dataUrl: canvas.toDataURL('image/png') });
    };

    const stopDrawing = () => {
        isDrawingRef.current = false;
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        onChange({ hasDrawing: false, dataUrl: '' });
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={720}
                height={360}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className="w-full aspect-[2/1] bg-white border-2 border-slate-200 rounded-2xl touch-none cursor-crosshair"
            />
            <button
                type="button"
                onClick={clearCanvas}
                className="mt-3 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
            >
                Clear drawing
            </button>
        </div>
    );
};

const ScoreRow = ({ label, score, maxScore }) => (
    <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between gap-4">
        <span className="font-bold text-slate-600">{label}</span>
        <span className="font-black text-dark">{score}/{maxScore}</span>
    </div>
);

export default MMSETest;
