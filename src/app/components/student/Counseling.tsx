'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar as CalendarIcon, Clock, Video,
    ChevronRight, ChevronLeft, Target,
    Activity, Brain, MessageCircle, CalendarHeart,
    ChevronDown, PenTool, CheckCircle2, Save,
    Search, Globe, Star, FileText
} from 'lucide-react'

/* ─── MOCK DATA ─── */

interface Counselor {
    id: string
    name: string
    title: string
    degree: string
    specialization: string[]
    languages: string[]
    rating: number
    experience: string
    gradient: string
    initials: string
    nextSession?: Date
    nextAvailable?: string
}

interface PastSession {
    id: string
    counselorName: string
    date: string
    duration: string
    summary: string
    tags: string[]
    status: 'upcoming' | 'past'
}

const collegeCounselors: Counselor[] = [
    {
        id: 'c1', name: 'Dr. Meera Sharma', title: 'Campus Psychologist',
        degree: 'M.Phil Clinical Psychology, NIMHANS',
        specialization: ['Academic Stress', 'Career Anxiety'],
        languages: ['Hindi', 'English'],
        rating: 4.9, experience: '8+ years exp', gradient: 'from-purple-400 to-indigo-400', initials: 'MS',
        nextSession: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
    }
]

const externalCounselors: Counselor[] = [
    {
        id: 'e1', name: 'Dr. Rohan Desai', title: 'Clinical Psychologist',
        degree: 'Ph.D. Psychology, DU',
        specialization: ['CBT', 'Depression', 'Relationships'],
        languages: ['English', 'Marathi'],
        rating: 4.8, experience: '12+ years exp', gradient: 'from-sky-400 to-blue-500', initials: 'RD',
        nextAvailable: 'Tomorrow at 4:00 PM'
    },
    {
        id: 'e2', name: 'Aisha Khan', title: 'Therapist & Counselor',
        degree: 'M.A. Counseling Psychology',
        specialization: ['Anxiety', 'LGBTQ+', 'Trauma'],
        languages: ['English', 'Hindi', 'Urdu'],
        rating: 4.9, experience: '5+ years exp', gradient: 'from-rose-400 to-pink-500', initials: 'AK',
        nextAvailable: 'Wed, 10:00 AM'
    },
    {
        id: 'e3', name: 'Dr. Vikram Singh', title: 'Psychiatrist',
        degree: 'MD Psychiatry, AIIMS',
        specialization: ['ADHD', 'Clinical Depression', 'Medication'],
        languages: ['English', 'Punjabi'],
        rating: 4.7, experience: '15+ years exp', gradient: 'from-emerald-400 to-teal-500', initials: 'VS',
        nextAvailable: 'Thu, 2:30 PM'
    }
]

const pastSessions: PastSession[] = [
    { id: 's0', counselorName: 'Dr. Meera Sharma', date: 'Feb 28, 2026', duration: '45 min', summary: 'Upcoming session to review progress on cognitive restructuring and placement interview prep.', tags: ['Placement Prep', 'Check-in'], status: 'upcoming' },
    { id: 's1', counselorName: 'Dr. Meera Sharma', date: 'Feb 14, 2026', duration: '45 min', summary: 'Explored underlying causes of placement anxiety. We worked on cognitive restructuring techniques to challenge catastrophic thinking regarding upcoming interviews. Introduced the 5-4-3-2-1 grounding method.', tags: ['Placement Anxiety', 'Coping Skills', 'CBT'], status: 'past' },
    { id: 's2', counselorName: 'Dr. Meera Sharma', date: 'Feb 7, 2026', duration: '50 min', summary: 'Discussed perfectionism patterns affecting project submissions. Set realistic goals for the week and practiced self-compassion exercises.', tags: ['Perfectionism', 'Goal Setting'], status: 'past' },
    { id: 's3', counselorName: 'Dr. Ravi Kulkarni', date: 'Jan 28, 2026', duration: '40 min', summary: 'Initial intake and assessment session. Outlined academic pressures, family expectations, and sleep disturbances.', tags: ['Assessment', 'Family Dynamics'], status: 'past' },
]

/* ─── ANIMATIONS ─── */
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } } }
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }

/* ─── MINI CALENDAR COMPONENT ─── */
function MiniCalendar({ highlightDate, onRequestSession }: { highlightDate: Date, onRequestSession: (d: Date) => void }) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    // Simple calendar logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

    const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())
    const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth())

    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const isHighlight = (day: number) => {
        return highlightDate.getDate() === day && highlightDate.getMonth() === currentMonth.getMonth() && highlightDate.getFullYear() === currentMonth.getFullYear()
    }

    return (
        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 text-slate-800">
                <h2 className="text-lg font-medium flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-purple-400" />
                    Schedule
                </h2>
                <div className="flex items-center gap-3">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4 text-slate-400" /></button>
                    <span className="text-sm font-semibold w-24 text-center">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm flex-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="p-2" />)}
                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const highlighted = isHighlight(day)
                    return (
                        <div key={day} className="aspect-square flex justify-center items-center p-0.5">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => !highlighted && onRequestSession(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                                className={`w-full h-full rounded-2xl flex items-center justify-center font-semibold transition-all duration-300 ${highlighted
                                    ? 'bg-purple-600 text-white shadow-[0_4px_12px_rgba(147,51,234,0.3)]'
                                    : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600 border border-transparent hover:border-purple-100'
                                    }`}
                                title={highlighted ? "Upcoming Session" : "Request Session"}
                            >
                                {day}
                            </motion.button>
                        </div>
                    )
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Session Booked
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-200" /> Available Slot
                </div>
            </div>
        </div>
    )
}

export default function Counseling() {
    const [viewState, setViewState] = useState<'campus' | 'external'>('campus')
    const [timelineTab, setTimelineTab] = useState<'upcoming' | 'past'>('upcoming')
    const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 })
    const [expandedSession, setExpandedSession] = useState<string | null>(null)
    const [preNotes, setPreNotes] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const activeCounselor = collegeCounselors[0]

    /* Countdown timer */
    useEffect(() => {
        const tick = () => {
            const diff = activeCounselor.nextSession!.getTime() - Date.now()
            if (diff <= 0) { setCountdown({ h: 0, m: 0, s: 0 }); return }
            setCountdown({
                h: Math.floor(diff / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            })
        }
        tick()
        const iv = setInterval(tick, 1000)
        return () => clearInterval(iv)
    }, [activeCounselor])

    const pad = (n: number) => String(n).padStart(2, '0')

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1500)
    }

    const filteredSessions = pastSessions.filter(s => s.status === timelineTab)

    return (
        <div className="relative w-full min-h-screen font-sans overflow-hidden">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const }} className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-200 rounded-full blur-[120px]" />
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }} className="absolute top-[40%] right-[-10%] w-[40%] h-[50%] bg-indigo-200 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto space-y-8 py-6 px-4 md:px-8">

                {/* ── Toggle System (Segmented Control) ── */}
                <div className="flex justify-center mb-2 px-2">
                    <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-full border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex w-full max-w-lg relative">
                        {/* Animated background pill */}
                        <motion.div
                            className="absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] pointer-events-none"
                            initial={false}
                            animate={{
                                left: viewState === 'campus' ? '6px' : '50%',
                                width: 'calc(50% - 6px)'
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => setViewState('campus')}
                            className={`relative px-2 sm:px-6 py-3 text-[11px] sm:text-[13px] font-bold tracking-wide rounded-full z-10 transition-colors duration-300 flex-1 text-center ${viewState === 'campus' ? 'text-purple-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="hidden xs:inline">My </span>Campus<span className="hidden xs:inline"> Psychologist</span>
                        </button>
                        <button
                            onClick={() => setViewState('external')}
                            className={`relative px-2 sm:px-6 py-3 text-[11px] sm:text-[13px] font-bold tracking-wide rounded-full z-10 transition-colors duration-300 flex-1 text-center ${viewState === 'external' ? 'text-purple-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Peace Code<span className="hidden xs:inline"> Psychologists</span>
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {viewState === 'campus' ? (
                        <motion.div
                            key="campus"
                            variants={stagger}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                            className="space-y-8 flex flex-col"
                        >
                            {/* ── Massive Active Counselor Glass Card ── */}
                            <motion.div variants={fadeUp} className="relative rounded-[2.5rem] overflow-hidden bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(167,139,250,0.2)] p-8 md:p-12">
                                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                                    <CalendarHeart className="w-64 h-64 text-purple-400 rotate-12" strokeWidth={0.5} />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
                                    {/* Left: Info */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 shadow-sm mb-6">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Active Counselor</span>
                                        </div>

                                        <h1 className="text-4xl md:text-5xl font-light text-slate-800 tracking-tight mb-2">
                                            {activeCounselor.name}
                                        </h1>
                                        <p className="text-lg text-purple-600 font-medium mb-4">{activeCounselor.title} · {activeCounselor.experience}</p>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                                            {activeCounselor.specialization.map((s) => (
                                                <span key={s} className="px-3 py-1 text-xs font-medium text-slate-600 bg-white/80 border border-white shadow-sm rounded-full flex items-center gap-1.5">
                                                    <Activity className="w-3 h-3 text-purple-400" /> {s}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-center md:justify-start gap-4">
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-full text-sm font-medium shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(167,139,250,0.3)] hover:bg-slate-900 transition-all duration-300">
                                                <Video className="w-4 h-4" /> Join Session
                                            </motion.button>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="p-4 bg-white/80 border border-white shadow-sm text-slate-600 rounded-full hover:bg-white transition-all duration-300">
                                                <MessageCircle className="w-4 h-4 text-purple-600" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Right: Countdown */}
                                    <div className="flex flex-col items-center justify-center w-full md:w-auto">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Next Session Starts In</p>
                                        <div className="flex gap-4">
                                            {[
                                                { val: pad(countdown.h), label: 'HOURS' },
                                                { val: pad(countdown.m), label: 'MINS' },
                                                { val: pad(countdown.s), label: 'SECS' },
                                            ].map((u) => (
                                                <div key={u.label} className="relative flex flex-col items-center">
                                                    <div className="relative w-20 h-24 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.03)] flex items-center justify-center overflow-hidden mb-3">
                                                        <div className="absolute inset-x-0 h-[1px] top-1/2 bg-black/5 z-20" />
                                                        <AnimatePresence mode="popLayout">
                                                            <motion.span
                                                                key={u.val}
                                                                initial={{ opacity: 0, y: 10, rotateX: -90 }}
                                                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                                exit={{ opacity: 0, y: -10, rotateX: 90 }}
                                                                transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                                                                className="text-4xl font-light text-slate-700 tracking-tighter"
                                                                style={{ transformOrigin: "bottom" }}
                                                            >
                                                                {u.val}
                                                            </motion.span>
                                                        </AnimatePresence>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-semibold tracking-widest">{u.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ── 3-Column Middle Section ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-full min-h-[500px]">

                                {/* Column 1: Session Timeline */}
                                <motion.div variants={fadeUp} className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-sm flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-medium text-slate-800 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-purple-400" />
                                            Timeline
                                        </h2>
                                        <div className="flex bg-slate-100/50 p-1 rounded-full border border-slate-100/50">
                                            <button
                                                onClick={() => setTimelineTab('upcoming')}
                                                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-black rounded-full transition-all duration-300 ${timelineTab === 'upcoming' ? 'bg-white text-purple-600 shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Upcoming
                                            </button>
                                            <button
                                                onClick={() => setTimelineTab('past')}
                                                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-black rounded-full transition-all duration-300 ${timelineTab === 'past' ? 'bg-white text-purple-600 shadow-[0_2px_10px_rgba(0,0,0,0.04)]' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Past
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-3 before:w-[1px] before:bg-gradient-to-b before:from-purple-200 before:to-transparent flex-1 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin">
                                        <AnimatePresence mode="popLayout">
                                            {filteredSessions.map((session) => {
                                                const isExpanded = expandedSession === session.id;
                                                const cardGradient = session.status === 'upcoming'
                                                    ? "bg-white border-2 border-purple-200 shadow-[0_4px_15px_rgba(167,139,250,0.1)] hover:shadow-[0_8px_25px_rgba(167,139,250,0.15)]"
                                                    : "bg-white/70 border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]"

                                                return (
                                                    <motion.div key={session.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="relative">
                                                        <div className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-white border ${session.status === 'upcoming' ? 'border-purple-400 shadow-[0_0_10px_rgba(167,139,250,0.3)]' : 'border-purple-200'} shadow-sm flex items-center justify-center -translate-x-1/2 z-10`}>
                                                            <div className={`w-2 h-2 rounded-full ${session.status === 'upcoming' ? 'bg-purple-500 animate-pulse' : 'bg-purple-300'}`} />
                                                        </div>

                                                        <div
                                                            onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                                                            className={`group cursor-pointer block rounded-2xl ${cardGradient} transition-all duration-300 p-4`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1.5">
                                                                        <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">{session.date}</p>
                                                                        {session.status === 'upcoming' && (
                                                                            <span className="flex gap-1 ml-2">
                                                                                <button onClick={(e) => { e.stopPropagation(); alert('Calendar sync triggered.') }} title="Add to Calendar" className="p-1 hover:bg-purple-50 text-slate-300 hover:text-purple-500 rounded transition-colors"><CalendarIcon className="w-3 h-3" /></button>
                                                                                <button onClick={(e) => { e.stopPropagation(); alert('Reschedule dialog opened.') }} title="Reschedule" className="p-1 hover:bg-purple-50 text-slate-300 hover:text-purple-500 rounded transition-colors"><Clock className="w-3 h-3" /></button>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <h3 className="text-[15px] font-bold text-slate-800 leading-tight">{session.duration} Session</h3>
                                                                </div>
                                                                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-500 transition-colors flex-shrink-0">
                                                                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                                                        <ChevronDown className="w-4 h-4" />
                                                                    </motion.div>
                                                                </div>
                                                            </div>

                                                            <AnimatePresence>
                                                                {isExpanded && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="pt-3 mt-3 border-t border-slate-100">
                                                                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-3">
                                                                                {session.summary}
                                                                            </p>
                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                {session.tags.map(tag => (
                                                                                    <span key={tag} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-100 rounded">
                                                                                        {tag}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* Column 2: Interactive Calendar */}
                                <motion.div variants={fadeUp} className="h-[500px]">
                                    <MiniCalendar highlightDate={activeCounselor.nextSession!} onRequestSession={(d) => alert(`Request dialogue for ${d.toDateString()}`)} />
                                </motion.div>

                                {/* Column 3: Action Items & Journal */}
                                <motion.div variants={fadeUp} className="flex flex-col gap-6 h-[500px]">
                                    {/* Counselor Notes / Tasks */}
                                    <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 shadow-sm flex-1 overflow-y-auto scrollbar-thin">
                                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            Action Items
                                        </h2>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-white border border-slate-100 rounded-2xl flex gap-3 items-start shadow-sm border-l-[3px] border-l-purple-400">
                                                <div className="mt-0.5 flex-shrink-0"><FileText className="w-4 h-4 text-purple-400" /></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 leading-tight">Breathing Exercise PDF</p>
                                                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">Attached by Dr. Meera to help with pre-interview grounding.</p>
                                                    <button className="text-[10px] uppercase tracking-widest font-black text-purple-600 mt-2 hover:underline">Download Material</button>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white border border-slate-100 rounded-2xl flex gap-3 items-start shadow-sm border-l-[3px] border-l-emerald-400">
                                                <div className="mt-0.5 flex-shrink-0"><Target className="w-4 h-4 text-emerald-400" /></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 leading-tight">Identify 3 Triggers</p>
                                                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">Note down triggers for anxiety spikes this week in your journal.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Private Journal Segment */}
                                    <div className="bg-gradient-to-br from-[#FAFAFA] to-purple-50/20 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-sm flex-1 flex flex-col relative group">
                                        <div className="flex items-center justify-between mb-3">
                                            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <PenTool className="w-4 h-4 text-indigo-400" /> Private Journal
                                                <span className="text-[9px] text-slate-400 font-medium hidden xs:inline">(Only visible to you)</span>
                                            </h2>
                                            <motion.button onClick={handleSave} className="w-8 h-8 bg-white border border-slate-200 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-center text-indigo-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                                {isSaving ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                            </motion.button>
                                        </div>
                                        <textarea
                                            value={preNotes}
                                            onChange={(e) => setPreNotes(e.target.value)}
                                            placeholder="Jot down thoughts for your next session..."
                                            className="w-full flex-1 p-4 rounded-xl bg-white border border-slate-100 focus:bg-white focus:shadow-[0_0_0_2px_rgba(129,140,248,0.2)] focus:border-transparent outline-none text-[13px] text-slate-700 font-serif leading-relaxed placeholder:font-sans placeholder:text-slate-300 resize-none transition-all duration-300"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="external"
                            variants={stagger}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                            className="space-y-8"
                        >
                            {/* ── Peace Code Psychologists State ── */}

                            {/* Filter Bar */}
                            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                                <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm flex-1 min-w-[200px] focus-within:ring-2 ring-purple-100 transition-all duration-300">
                                    <Search className="w-4 h-4 text-purple-400" />
                                    <input type="text" placeholder="Search by name, issue, or language..." className="w-full text-sm outline-none text-slate-700 placeholder:text-slate-400 bg-transparent font-medium" />
                                </div>
                                <div className="hidden lg:block w-px h-8 bg-slate-200 mx-2" />
                                <div className="flex flex-wrap flex-1 gap-2 justify-end">
                                    {[
                                        { label: 'Specialty', icon: Brain },
                                        { label: 'Language', icon: Globe },
                                        { label: 'Therapy', icon: Video },
                                        { label: 'Availability', icon: CalendarIcon }
                                    ].map((filter) => (
                                        <button key={filter.label} className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-slate-200 hover:border-purple-300 hover:shadow-[0_4px_15px_rgba(167,139,250,0.1)] transition-all duration-300 group text-sm font-semibold text-slate-600">
                                            <filter.icon className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                                            {filter.label}
                                            <ChevronDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-400" />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* External Therapists Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {externalCounselors.map((therapist) => (
                                    <motion.div
                                        key={therapist.id}
                                        variants={fadeUp}
                                        whileHover={{ y: -4 }}
                                        className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(167,139,250,0.12)] transition-all duration-300 flex flex-col group"
                                    >
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="flex gap-4">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${therapist.gradient} flex items-center justify-center text-white text-xl font-light shadow-md shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                                                    <div className="absolute inset-0 bg-white/20" />
                                                    <span className="relative z-10">{therapist.initials}</span>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h3 className="text-lg font-bold text-slate-800 leading-tight truncate">{therapist.name}</h3>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-2 truncate">{therapist.title}</p>
                                                    <div className="flex items-center gap-1.5 bg-amber-50 rounded-full px-2.5 py-1 w-max">
                                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                        <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider p-0.5">{therapist.rating} · {therapist.experience}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {therapist.specialization.map(s => (
                                                <span key={s} className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-purple-100">
                                                    {s}
                                                </span>
                                            ))}
                                            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100 flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> {therapist.languages.join(', ')}
                                            </span>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-slate-100/60 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Next Available</p>
                                                <p className="text-sm font-bold text-slate-800">{therapist.nextAvailable}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`px-6 py-3 rounded-2xl text-white font-bold text-[13px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 bg-gradient-to-br ${therapist.gradient} hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]`}
                                            >
                                                Book Free
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
