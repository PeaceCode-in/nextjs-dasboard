'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Stethoscope, ArrowRight, Clock,
    AlertCircle, Sparkles, X, HeartPulse, BrainCircuit, Activity, Hexagon,
    Moon, Smile, ShieldCheck, Lock, CheckCircle2
} from 'lucide-react'

/* ─── CLINICAL QUESTION DATA ─── */

interface Question {
    id: number
    text: string
    options: { label: string; score: number }[]
}

interface Assessment {
    id: string
    name: string
    shortName: string
    description: string
    questions: Question[]
    gradient: string
    duration: string
    icon: React.ElementType
    scoring: { range: [number, number]; label: string; color: string; description: string }[]
    free: boolean
}

const likert4 = [
    { label: 'Not at all', score: 0 },
    { label: 'Several days', score: 1 },
    { label: 'More than half the days', score: 2 },
    { label: 'Nearly every day', score: 3 },
]

const phq9: Assessment = {
    id: 'phq9', name: 'Patient Health Questionnaire', shortName: 'PHQ-9',
    description: 'A validated 9-item depression screening tool used worldwide. Measures severity of depressive symptoms over the past 2 weeks.',
    questions: [
        { id: 1, text: 'Little interest or pleasure in doing things', options: likert4 },
        { id: 2, text: 'Feeling down, depressed, or hopeless', options: likert4 },
        { id: 3, text: 'Trouble falling/staying asleep, or sleeping too much', options: likert4 },
        { id: 4, text: 'Feeling tired or having little energy', options: likert4 },
        { id: 5, text: 'Poor appetite or overeating', options: likert4 },
        { id: 6, text: 'Feeling bad about yourself', options: likert4 },
        { id: 7, text: 'Trouble concentrating', options: likert4 },
        { id: 8, text: 'Moving or speaking noticeably slower or faster', options: likert4 },
        { id: 9, text: 'Thoughts that you would be better off not being around', options: likert4 },
    ],
    gradient: 'from-blue-100 to-indigo-50 text-indigo-700', duration: '3–4 min', icon: HeartPulse,
    scoring: [
        { range: [0, 4], label: 'Minimal', color: '#10B981', description: 'Your responses suggest minimal depressive symptoms. Keep nurturing your wellbeing!' },
        { range: [5, 9], label: 'Mild', color: '#84CC16', description: 'Mild depressive symptoms detected. Consider building a stronger self-care routine.' },
        { range: [10, 14], label: 'Moderate', color: '#F59E0B', description: 'Moderate symptoms present. Speaking with a counselor could be very beneficial.' },
        { range: [15, 19], label: 'Moderately Severe', color: '#F97316', description: 'Significant symptoms detected. We strongly recommend connecting with a professional.' },
        { range: [20, 27], label: 'Severe', color: '#EF4444', description: 'Your responses indicate severe symptoms. Please reach out to a counselor — you deserve support.' },
    ],
    free: true,
}

const gad7: Assessment = {
    id: 'gad7', name: 'Generalized Anxiety Disorder Scale', shortName: 'GAD-7',
    description: 'A brief 7-item anxiety measure. Screens for generalized anxiety disorder and its severity.',
    questions: [
        { id: 1, text: 'Feeling nervous, anxious, or on edge', options: likert4 },
        { id: 2, text: 'Not being able to stop or control worrying', options: likert4 },
        { id: 3, text: 'Worrying too much about different things', options: likert4 },
        { id: 4, text: 'Trouble relaxing', options: likert4 },
        { id: 5, text: 'Being so restless that it\'s hard to sit still', options: likert4 },
        { id: 6, text: 'Becoming easily annoyed or irritable', options: likert4 },
        { id: 7, text: 'Feeling afraid, as if something awful might happen', options: likert4 },
    ],
    gradient: 'from-purple-100 to-fuchsia-50 text-fuchsia-700', duration: '2–3 min', icon: BrainCircuit,
    scoring: [
        { range: [0, 4], label: 'Minimal', color: '#10B981', description: 'Minimal anxiety levels. Your coping strategies seem to be working well!' },
        { range: [5, 9], label: 'Mild', color: '#84CC16', description: 'Mild anxiety detected. Breathing exercises and mindfulness may help.' },
        { range: [10, 14], label: 'Moderate', color: '#F59E0B', description: 'Moderate anxiety present. Consider speaking with a counselor.' },
        { range: [15, 21], label: 'Severe', color: '#EF4444', description: 'Severe anxiety indicated. We strongly recommend professional support.' },
    ],
    free: true,
}

const asrs: Assessment = {
    id: 'adhd', name: 'ADHD Screening', shortName: 'ASRS',
    description: 'Adult ADHD Self-Report Scale — screens for attention deficit patterns and hyperactivity.',
    questions: [
        { id: 1, text: 'How often do you have trouble wrapping up the final details of a project?', options: likert4 },
        { id: 2, text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?', options: likert4 },
        { id: 3, text: 'How often do you have problems remembering appointments or obligations?', options: likert4 },
    ],
    gradient: 'from-slate-100 to-slate-50 text-slate-700', duration: '5 min', icon: Activity,
    scoring: [
        { range: [0, 4], label: 'Low Risk', color: '#10B981', description: 'Low indication of ADHD symptoms.' },
        { range: [5, 9], label: 'High Risk', color: '#F97316', description: 'High indication of ADHD symptoms. Strongly consider clinical evaluation.' },
    ],
    free: false,
}

const burnout: Assessment = {
    id: 'burnout', name: 'High-Achiever Burnout', shortName: 'Burnout Scale',
    description: 'Custom scale for perfectionism, overwork, and academic exhaustion.',
    questions: [
        { id: 1, text: 'I feel emotionally depleted by my studies/work.', options: likert4 },
        { id: 2, text: 'I feel a lack of personal accomplishment despite working hard.', options: likert4 },
        { id: 3, text: 'I feel disconnected from my peers and friends.', options: likert4 },
    ],
    gradient: 'from-rose-100 to-orange-50 text-rose-700', duration: '4 min', icon: Hexagon,
    scoring: [
        { range: [0, 3], label: 'Optimal', color: '#10B981', description: 'You are managing your energy well.' },
        { range: [4, 9], label: 'Burnout Risk', color: '#EF4444', description: 'High burnout risk. Immediate rest is recommended.' },
    ],
    free: false,
}

const sleep: Assessment = {
    id: 'sleep', name: 'Sleep Quality Index', shortName: 'PSQI',
    description: 'Evaluates sleep quality, duration, and disturbances over the previous month.',
    questions: [
        { id: 1, text: 'How often do you have trouble falling asleep within 30 minutes?', options: likert4 },
        { id: 2, text: 'How often do you wake up in the middle of the night?', options: likert4 },
    ],
    gradient: 'from-indigo-100 to-cyan-50 text-indigo-700', duration: '4 min', icon: Moon,
    scoring: [
        { range: [0, 2], label: 'Good Sleep', color: '#10B981', description: 'Your sleep quality is excellent.' },
        { range: [3, 6], label: 'Poor Sleep', color: '#F59E0B', description: 'Poor sleep routines detected. Consider adjusting your habits.' },
    ],
    free: false,
}

const socialanxiety: Assessment = {
    id: 'social', name: 'Social Anxiety Profile', shortName: 'SPIN',
    description: 'Screens for fear, avoidance, and physiological symptoms in social situations.',
    questions: [
        { id: 1, text: 'I am afraid of people in authority.', options: likert4 },
        { id: 2, text: 'I avoid talking to people I don\'t know.', options: likert4 },
    ],
    gradient: 'from-teal-100 to-emerald-50 text-teal-700', duration: '3 min', icon: Smile,
    scoring: [
        { range: [0, 2], label: 'Mild', color: '#10B981', description: 'Minimal social anxiety.' },
        { range: [3, 6], label: 'Elevated', color: '#F97316', description: 'Elevated social anxiety traits.' },
    ],
    free: false,
}

const coreAssessments = [phq9, gad7]
const premiumTests = [asrs, burnout, sleep, socialanxiety]

/* ─── COMPONENT ─── */

type ViewState = 'hub' | 'terms' | 'premium_gate' | 'test' | 'results'

export default function Screening() {
    const [view, setView] = useState<ViewState>('hub')
    const [activeTest, setActiveTest] = useState<Assessment | null>(null)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])
    const [totalScore, setTotalScore] = useState(0)
    const [advancing, setAdvancing] = useState(false)

    // Select a test from the Hub
    const selectTest = useCallback((test: Assessment) => {
        setActiveTest(test)
        setTermsAccepted(false)
        setView('terms')
    }, [])

    // Accept terms and proceed according to 'free' status
    const handleAcceptTerms = useCallback(() => {
        if (!activeTest) return
        if (activeTest.free) {
            startTest()
        } else {
            setView('premium_gate')
        }
    }, [activeTest])

    const startTest = useCallback(() => {
        setCurrentQ(0)
        setAnswers([])
        setTotalScore(0)
        setAdvancing(false)
        setView('test')
    }, [])

    const handleAnswer = useCallback((score: number) => {
        if (advancing || !activeTest) return
        setAdvancing(true)
        const newAnswers = [...answers, score]
        setAnswers(newAnswers)

        setTimeout(() => {
            if (currentQ + 1 < activeTest.questions.length) {
                setCurrentQ(currentQ + 1)
                setAdvancing(false)
            } else {
                const total = newAnswers.reduce((a, b) => a + b, 0)
                setTotalScore(total)
                setView('results')
                setAdvancing(false)
            }
        }, 400) // fluid delay
    }, [advancing, activeTest, answers, currentQ])

    const resetToHub = useCallback(() => {
        setView('hub')
        setActiveTest(null)
        setTermsAccepted(false)
        setCurrentQ(0)
        setAnswers([])
        setTotalScore(0)
    }, [])

    const getSeverity = useCallback((test: Assessment, score: number) => {
        return test.scoring.find(s => score >= s.range[0] && score <= s.range[1]) || test.scoring[test.scoring.length - 1]
    }, [])

    /* ─── HUB VIEW ─── */
    if (view === 'hub') {
        return (
            <div className="relative w-full min-h-screen font-sans overflow-hidden pb-32">
                {/* Ethereal Background */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' as const }} className="absolute -top-[10%] -right-[10%] w-[60%] h-[70%] bg-blue-100 rounded-full blur-[140px]" />
                    <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }} className="absolute bottom-[0%] -left-[10%] w-[50%] h-[60%] bg-purple-100 rounded-full blur-[140px]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto space-y-12 px-4 md:px-8 pt-10">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-purple-100/30">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center">
                                <Stethoscope className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-1">Clinical Hub</h1>
                                <p className="text-sm text-slate-500 font-light">Confidential, validated assessments to guide your mental wellbeing.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Disclaimer */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 p-5 flex items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <p className="text-sm text-slate-600 font-light leading-relaxed">
                                <strong className="font-medium text-slate-800">Review carefully:</strong> These tools provide a snapshot of your symptoms over the past few weeks. They do not replace a formal clinical diagnosis from a medical professional.
                            </p>
                        </div>
                    </motion.div>

                    {/* Core Assessments */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-light text-slate-800 flex items-center gap-3">
                                Standard Assessments
                            </h2>
                            <span className="text-[10px] px-3 py-1 rounded-full bg-white/60 border border-white/80 text-emerald-600 font-medium tracking-widest uppercase">Included</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {coreAssessments.map((test) => {
                                const Icon = test.icon
                                return (
                                    <motion.div
                                        key={test.id}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => selectTest(test)}
                                        className="rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(167,139,250,0.1)] p-8 transition-all duration-400 cursor-pointer group flex flex-col h-full"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${test.gradient} flex items-center justify-center shadow-inner`}>
                                                <Icon className="w-6 h-6" strokeWidth={1.5} />
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full">
                                                <Clock className="w-3 h-3" strokeWidth={2} /> {test.duration}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-medium text-slate-800 tracking-tight mb-2 group-hover:text-purple-600 transition-colors">{test.name} <span className="text-sm font-light text-slate-400 ml-1">({test.shortName})</span></h3>
                                        <p className="text-sm text-slate-500 font-light leading-relaxed mb-8 flex-1">{test.description}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xs font-medium text-slate-400">{test.questions.length} Questions</span>
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors">
                                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Premium Tools */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                        <div className="flex items-center justify-between mb-6 pt-6 border-t border-purple-100/30">
                            <h2 className="text-xl font-light text-slate-800">Advanced Diagnostics</h2>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-50 rounded-full border border-amber-200/50">
                                <Sparkles className="w-3 h-3 text-amber-500" strokeWidth={2} />
                                <span className="text-[10px] text-amber-700 font-medium tracking-widest uppercase">Premium</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {premiumTests.map((test) => {
                                const Icon = test.icon
                                return (
                                    <motion.div
                                        key={test.id}
                                        whileHover={{ scale: 1.01, y: -2 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => selectTest(test)}
                                        className="rounded-[2rem] bg-white/40 backdrop-blur-xl border border-amber-200/30 shadow-[0_4px_30px_rgba(251,191,36,0.05)] hover:shadow-[0_10px_40px_rgba(251,191,36,0.15)] p-8 transition-all duration-400 cursor-pointer group flex flex-col h-full relative overflow-hidden"
                                    >
                                        {/* Subtle premium gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-transparent pointer-events-none" />

                                        <div className="relative z-10 flex items-start justify-between mb-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${test.gradient} flex items-center justify-center shadow-inner`}>
                                                <Icon className="w-6 h-6" strokeWidth={1.5} />
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-amber-600 font-medium uppercase tracking-widest bg-amber-50/80 px-3 py-1.5 rounded-full border border-amber-100">
                                                <Sparkles className="w-3 h-3" strokeWidth={2} /> Premium
                                            </div>
                                        </div>

                                        <h3 className="relative z-10 text-xl font-medium text-slate-800 tracking-tight mb-2 group-hover:text-amber-600 transition-colors">{test.name} <span className="text-sm font-light text-slate-400 ml-1">({test.shortName})</span></h3>
                                        <p className="relative z-10 text-sm text-slate-500 font-light leading-relaxed mb-8 flex-1">{test.description}</p>

                                        <div className="relative z-10 flex items-center justify-between mt-auto">
                                            <span className="text-xs font-medium text-slate-400">{test.questions.length} Questions</span>
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-amber-200 group-hover:bg-amber-50 transition-colors">
                                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    /* ─── TERMS AND CONDITIONS VIEW ─── */
    if (view === 'terms' && activeTest) {
        return (
            <div className="fixed inset-0 z-50 bg-[#fafafa] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
                >
                    <div className="p-8 md:p-12">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeTest.gradient} flex items-center justify-center shadow-inner`}>
                                <activeTest.icon className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <button onClick={resetToHub} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                <X className="w-5 h-5" strokeWidth={1.5} />
                            </button>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-light text-slate-800 tracking-tight mb-2">Terms & Conditions</h2>
                        <h3 className="text-slate-500 font-medium mb-8">Before you start: <span className="text-slate-700">{activeTest.name}</span></h3>

                        <div className="space-y-6 text-sm text-slate-600 font-light leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex gap-4">
                                <ShieldCheck className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                                <p><strong>Confidentiality:</strong> Your responses to this screening tool are entirely confidential and securely stored.</p>
                            </div>
                            <div className="flex gap-4">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                                <p><strong>Not a Diagnosis:</strong> This tool is designed to identify potential symptoms. It does not provide a formal medical or psychological diagnosis.</p>
                            </div>
                            <div className="flex gap-4">
                                <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                                <p><strong>Accuracy:</strong> For the most accurate result, answer honestly based on your experiences over the specified timeframe.</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`relative flex items-center justify-center w-6 h-6 rounded border ${termsAccepted ? 'bg-purple-600 border-purple-600' : 'bg-white border-slate-300 group-hover:border-purple-400'} transition-colors`}>
                                    <CheckCircle2 className={`w-4 h-4 text-white transition-opacity ${termsAccepted ? 'opacity-100' : 'opacity-0'}`} strokeWidth={2.5} />
                                    <input
                                        type="checkbox"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                </div>
                                <span className="text-sm font-medium text-slate-700 select-none">I understand and accept these terms.</span>
                            </label>
                        </div>

                        <div className="mt-10 flex justify-end gap-4">
                            <button
                                onClick={resetToHub}
                                className="px-6 py-3 rounded-full text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAcceptTerms}
                                disabled={!termsAccepted}
                                className={`px-8 py-3 rounded-full font-medium shadow-lg transition-all ${termsAccepted ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-slate-800/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-transparent'}`}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    /* ─── PREMIUM GATE VIEW ─── */
    if (view === 'premium_gate' && activeTest && !activeTest.free) {
        return (
            <div className="fixed inset-0 z-50 bg-[#fafafa] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden text-center relative"
                >
                    <div className="absolute top-4 right-4 z-10">
                        <button onClick={resetToHub} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                            <X className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-amber-100 to-orange-50 p-8 flex justify-center border-b border-amber-200/50">
                        <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center relative">
                            <Lock className="w-8 h-8 text-amber-500" strokeWidth={2} />
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-2xl font-medium text-slate-800 mb-2">Premium Assessment</h2>
                        <p className="text-sm text-slate-500 font-light mb-8">
                            The <strong>{activeTest.name}</strong> is a specialized advanced diagnostic tool available to Premium members. Unlock Premium to gain deep insights into your mental wellbeing.
                        </p>

                        <div className="space-y-3">
                            <button className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] transition-all hover:-translate-y-0.5 flex justify-center items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Unlock Premium Now
                            </button>
                            <button
                                onClick={resetToHub}
                                className="w-full py-3.5 rounded-full text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Return to Hub
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    /* ─── TEST VIEW (Zen Mode) ─── */
    if (view === 'test' && activeTest) {
        const progress = ((currentQ + (advancing ? 1 : 0)) / activeTest.questions.length) * 100
        const question = activeTest.questions[currentQ]

        return (
            <div className="fixed inset-0 z-50 bg-[#fafafa] flex flex-col">
                {/* Minimalist Global Progress Bar */}
                <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-100 z-50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: 'easeInOut' as const }}
                        className="h-full bg-slate-800"
                    />
                </div>

                {/* Zen Header */}
                <div className="flex items-center justify-between px-6 md:px-12 py-8 mt-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{activeTest.shortName}</p>
                    <button onClick={resetToHub} className="group p-2 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                        <X className="w-5 h-5 text-slate-400 group-hover:text-slate-700" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Question Canvas */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-0 relative overflow-hidden">
                    <AnimatePresence mode="popLayout" custom={advancing}>
                        <motion.div
                            key={currentQ}
                            initial={{ opacity: 0, x: 80, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -80, filter: 'blur(10px)' }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-4xl flex flex-col items-center text-center"
                        >
                            <p className="text-sm font-medium text-slate-400 mb-8 tracking-widest uppercase">
                                Question {currentQ + 1} of {activeTest.questions.length}
                            </p>

                            {/* Massive Typography for Question */}
                            <h2 className="text-3xl md:text-5xl lg:text-5xl font-light text-slate-800 leading-tight md:leading-[1.15] mb-16 max-w-3xl">
                                "{question.text}"
                            </h2>

                            {/* Options */}
                            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-3 md:gap-4 w-full max-w-3xl">
                                {question.options.map((opt, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={advancing}
                                        onClick={() => handleAnswer(opt.score)}
                                        className={`px-8 py-5 rounded-full border transition-all duration-300 ${advancing
                                            ? 'opacity-40 border-slate-200 bg-transparent'
                                            : 'border-slate-300 hover:border-slate-800 hover:bg-slate-800 hover:text-white text-slate-600 font-medium shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]'
                                            }`}
                                    >
                                        {opt.label}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        )
    }

    /* ─── RESULTS VIEW ─── */
    if (view === 'results' && activeTest) {
        const severity = getSeverity(activeTest, totalScore)
        const maxScore = activeTest.questions.length * (activeTest.questions[0].options.length - 1)

        return (
            <div className="relative w-full min-h-[80vh] flex items-center justify-center font-sans overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' as const }}
                    className="max-w-2xl w-full mx-auto px-4"
                >
                    <div className="text-center bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] p-10 md:p-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-8">
                            <activeTest.icon className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">{activeTest.shortName} Results</span>
                        </div>

                        <div className="mb-10">
                            <motion.h1
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
                                className="text-7xl md:text-8xl font-light tracking-tighter mb-4"
                                style={{ color: severity.color }}
                            >
                                {totalScore}
                            </motion.h1>
                            <p className="text-sm text-slate-400 font-light uppercase tracking-widest">Out of {maxScore}</p>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-2xl font-medium text-slate-800 mb-4">{severity.label}</h2>
                            <p className="text-base text-slate-500 font-light leading-relaxed max-w-sm mx-auto">
                                {severity.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto px-10 py-4 rounded-full bg-slate-800 text-white font-medium shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] transition-all duration-300"
                            >
                                Consult an Expert
                            </motion.button>
                            <button
                                onClick={resetToHub}
                                className="w-full sm:w-auto px-10 py-4 rounded-full text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    return null
}
