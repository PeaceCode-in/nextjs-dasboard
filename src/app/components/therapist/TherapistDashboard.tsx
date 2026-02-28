'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Video, FileText, Clock, Users, CalendarDays, CheckCircle2, TrendingUp,
    ArrowUpRight, Smile, Meh, Frown, Brain, Heart, Star,
} from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from 'recharts'

/* ─── MOCK DATA ─── */

const upNext = {
    studentName: 'Rahul S.',
    avatar: '👨‍🎓',
    sessionType: 'Follow-up: Exam Stress',
    startTime: new Date(Date.now() + 4 * 60 * 1000 + 32 * 1000),
    endTime: '10:45 AM',
    notes: 'Previous session discussed CBT techniques for managing exam anxiety. Follow up on homework assignments and thought journal entries.',
    mood: 'improving',
}

const todayAgenda = [
    { id: 1, time: '9:00 – 9:45', student: 'Meera K.', topic: 'Initial Assessment', status: 'completed' as const, avatar: '👩‍🎨', mood: 'neutral' },
    { id: 2, time: '10:00 – 10:45', student: 'Rahul S.', topic: 'Exam Stress Follow-up', status: 'current' as const, avatar: '👨‍🎓', mood: 'improving' },
    { id: 3, time: '11:30 – 12:15', student: 'Ananya M.', topic: 'Anxiety Management', status: 'upcoming' as const, avatar: '👩‍🎓', mood: 'low' },
    { id: 4, time: '2:00 – 2:45', student: 'Vikram T.', topic: 'Career Decision Stress', status: 'upcoming' as const, avatar: '👨‍💻', mood: 'neutral' },
    { id: 5, time: '3:30 – 4:15', student: 'Priya L.', topic: 'Peer Relationship Issues', status: 'upcoming' as const, avatar: '👩‍🔬', mood: 'low' },
    { id: 6, time: '5:00 – 5:45', student: 'Arjun D.', topic: 'Sleep Hygiene Follow-up', status: 'upcoming' as const, avatar: '🧑‍🏫', mood: 'improving' },
]

const weeklySessionsData = [
    { day: 'Mon', sessions: 5, cancelled: 1 },
    { day: 'Tue', sessions: 6, cancelled: 0 },
    { day: 'Wed', sessions: 4, cancelled: 1 },
    { day: 'Thu', sessions: 7, cancelled: 0 },
    { day: 'Fri', sessions: 5, cancelled: 2 },
    { day: 'Sat', sessions: 2, cancelled: 0 },
]

const moodTrendData = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    avgMood: 4.5 + Math.sin(i * 0.5) * 1.5 + Math.random() * 0.8,
    improvements: Math.floor(3 + Math.random() * 4),
}))

const sessionTypes = [
    { name: 'Anxiety', value: 32, color: '#8B8AFF' },
    { name: 'Depression', value: 24, color: '#7170D4' },
    { name: 'Academic', value: 18, color: '#14B8A6' },
    { name: 'Relationship', value: 14, color: '#F59E0B' },
    { name: 'Career', value: 12, color: '#EC4899' },
]

const treatmentProgress = [
    { name: 'CBT Compliance', value: 78, fill: '#14B8A6' },
    { name: 'Homework Done', value: 65, fill: '#8B8AFF' },
    { name: 'Session Attendance', value: 92, fill: '#22C55E' },
]

/* ─── TOOLTIPS ─── */

const GlassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-teal-100 text-sm">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} className="font-semibold" style={{ color: p.color || p.fill || '#14B8A6' }}>
                        {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

/* ─── ANIMATION ─── */

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

/* ─── COUNTDOWN HOOK ─── */

function useCountdown(target: Date) {
    const [remaining, setRemaining] = useState(() => Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000)))

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000)))
        }, 1000)
        return () => clearInterval(interval)
    }, [target])

    const mins = Math.floor(remaining / 60)
    const secs = remaining % 60
    return { mins, secs }
}

/* ─── MOOD ICON ─── */
function MoodIcon({ mood }: { mood: string }) {
    if (mood === 'improving') return <Smile className="w-4 h-4 text-emerald-500" />
    if (mood === 'low') return <Frown className="w-4 h-4 text-red-400" />
    return <Meh className="w-4 h-4 text-amber-400" />
}

/* ─── MAIN ─── */

interface Props { userName?: string }

export default function TherapistDashboard({ userName }: Props) {
    const countdown = useCountdown(upNext.startTime)
    const completedToday = todayAgenda.filter(a => a.status === 'completed').length
    const totalToday = todayAgenda.length
    const [showNotes, setShowNotes] = useState(false)

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-5">
            {/* Greeting */}
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-gray-800">
                    Good morning, <span className="text-teal-600">{userName || 'Doctor'}</span> 🌿
                </h1>
                <p className="text-gray-500 text-sm mt-1">Here's your clinical focus for today — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
            </motion.div>

            {/* ── STAT CARDS ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Sessions Today', value: `${completedToday}/${totalToday}`, sub: `${totalToday - completedToday} remaining`, icon: CalendarDays, color: 'text-teal-500', bg: 'bg-teal-50', gradient: 'from-teal-50 to-emerald-50' },
                    { label: 'Active Caseload', value: '24', sub: '3 need attention', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', gradient: 'from-purple-50 to-indigo-50' },
                    { label: 'This Month', value: '87', sub: '+12% vs last month', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', gradient: 'from-emerald-50 to-green-50' },
                    { label: 'Avg Improvement', value: '68%', sub: 'Based on assessments', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', gradient: 'from-pink-50 to-rose-50' },
                ].map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} border border-gray-100/50`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300" />
                            </div>
                            <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{stat.sub}</p>
                        </div>
                    )
                })}
            </motion.div>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

                {/* LEFT COL — Up Next + Charts */}
                <div className="xl:col-span-8 space-y-5">

                    {/* UP NEXT HERO */}
                    <motion.div variants={fadeUp}>
                        <div className="rounded-3xl bg-gradient-to-br from-white/80 to-teal-50/40 backdrop-blur-xl border border-teal-100/50 shadow-xl shadow-teal-100/20 p-7 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-teal-100/40 to-transparent rounded-bl-full" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-50/30 to-transparent rounded-tr-full" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-[10px] font-bold text-teal-600 bg-teal-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">⚡ Up Next</span>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-5">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-50 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                                            {upNext.avatar}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">{upNext.studentName}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-600 text-xs font-semibold border border-teal-200/60">
                                                    {upNext.sessionType}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs text-emerald-500">
                                                    <MoodIcon mood={upNext.mood} />
                                                    <span className="font-medium">Improving</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Countdown */}
                                    <div className="flex flex-col items-center md:items-end gap-1">
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">Starts in</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-gray-800 tabular-nums">{String(countdown.mins).padStart(2, '0')}</span>
                                            <span className="text-2xl font-bold text-gray-400 animate-pulse">:</span>
                                            <span className="text-4xl font-black text-gray-800 tabular-nums">{String(countdown.secs).padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-base shadow-xl shadow-teal-200/50 hover:shadow-2xl hover:shadow-teal-300/60 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} className="relative z-10">
                                            <Video className="w-6 h-6" />
                                        </motion.div>
                                        <span className="relative z-10">JOIN VIDEO SESSION</span>
                                    </motion.button>
                                    <button onClick={() => setShowNotes(!showNotes)} className="px-5 py-3 rounded-2xl border border-teal-200/60 text-teal-600 text-sm font-semibold hover:bg-teal-50 transition-all duration-200 flex items-center justify-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        {showNotes ? 'Hide Notes' : 'Pre-session Notes'}
                                    </button>
                                </div>

                                {showNotes && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 rounded-2xl bg-white/60 border border-teal-100/50 text-sm text-gray-600 leading-relaxed">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Session Notes</p>
                                        {upNext.notes}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* 2-COL CHARTS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Weekly Sessions Bar Chart */}
                        <motion.div variants={fadeUp}>
                            <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 p-5 h-full">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-gray-500">Weekly Sessions</p>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 font-semibold">This Week</span>
                                </div>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={weeklySessionsData} barCategoryGap="25%">
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                        <Tooltip content={<GlassTooltip />} cursor={false} />
                                        <Bar dataKey="sessions" fill="#14B8A6" radius={[6, 6, 2, 2]} name="Sessions" />
                                        <Bar dataKey="cancelled" fill="#FCA5A5" radius={[6, 6, 2, 2]} name="Cancelled" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Session Types Pie */}
                        <motion.div variants={fadeUp}>
                            <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 p-5 h-full">
                                <p className="text-sm font-semibold text-gray-500 mb-3">Session Types (This Month)</p>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-[130px] h-[130px] flex-shrink-0">
                                        <PieChart width={130} height={130}>
                                            <Pie data={sessionTypes} cx={65} cy={65} innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" strokeWidth={0} animationDuration={1200}>
                                                {sessionTypes.map((entry, idx) => (
                                                    <Cell key={idx} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<GlassTooltip />} />
                                        </PieChart>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-lg font-extrabold text-gray-700">100</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        {sessionTypes.map((t) => (
                                            <div key={t.name} className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                                                <span className="text-xs text-gray-500">{t.name}</span>
                                                <span className="text-xs font-bold text-gray-600 ml-auto">{t.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Student Mood Trend Area Chart */}
                    <motion.div variants={fadeUp}>
                        <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-teal-500" />
                                    <p className="text-sm font-semibold text-gray-500">Caseload Mood Trend</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 font-semibold">Last 14 Days</span>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={moodTrendData}>
                                    <defs>
                                        <linearGradient id="moodGradT" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={1} />
                                    <YAxis domain={[1, 8]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                    <Tooltip content={<GlassTooltip />} />
                                    <Area type="monotone" dataKey="avgMood" stroke="#14B8A6" fill="url(#moodGradT)" strokeWidth={2.5} name="Avg Mood" dot={false} activeDot={{ fill: '#14B8A6', stroke: '#D1FAE5', strokeWidth: 3, r: 5 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT COL — Agenda + Treatment Progress */}
                <div className="xl:col-span-4 space-y-5">

                    {/* Today's Agenda */}
                    <motion.div variants={fadeUp}>
                        <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-teal-500" />
                                    <p className="text-sm font-semibold text-gray-500">Today's Agenda</p>
                                </div>
                                <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
                                    {completedToday}/{totalToday}
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                {todayAgenda.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ x: 4 }}
                                        className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${item.status === 'completed' ? 'opacity-50' : item.status === 'current' ? 'bg-teal-50/60 border border-teal-200/50' : 'hover:bg-gray-50/60'
                                            }`}
                                    >
                                        {item.status === 'completed' ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        ) : item.status === 'current' ? (
                                            <div className="w-4 h-4 rounded-full border-2 border-teal-400 flex items-center justify-center flex-shrink-0">
                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                            </div>
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                                        )}
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-sm flex-shrink-0">
                                            {item.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-gray-700 truncate">{item.student}</span>
                                                <MoodIcon mood={item.mood} />
                                            </div>
                                            <p className="text-[10px] text-gray-400">{item.time} · {item.topic}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Treatment Compliance */}
                    <motion.div variants={fadeUp}>
                        <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4 text-amber-400" />
                                <p className="text-sm font-semibold text-gray-500">Treatment Compliance</p>
                            </div>
                            <ResponsiveContainer width="100%" height={160}>
                                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" barSize={12} data={treatmentProgress} startAngle={90} endAngle={-270}>
                                    <RadialBar background={{ fill: '#F3F4F6' }} dataKey="value" cornerRadius={6} />
                                    <Tooltip content={<GlassTooltip />} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="space-y-1.5 mt-2">
                                {treatmentProgress.map((t) => (
                                    <div key={t.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.fill }} />
                                            <span className="text-xs text-gray-500">{t.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{t.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Motivational Quote */}
                    <motion.div variants={fadeUp}>
                        <div className="rounded-2xl bg-gradient-to-br from-teal-50/60 to-emerald-50/40 border border-teal-100/40 p-5">
                            <p className="text-xs text-teal-800 leading-relaxed italic">
                                "The curious paradox is that when I accept myself just as I am, then I can change."
                            </p>
                            <p className="text-[10px] text-teal-500 font-semibold mt-2">— Carl Rogers</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
