'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Search, FileText, Calendar, TrendingUp,
    Phone, Video, ChevronRight, Smile, Meh, Frown, Filter,
} from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

/* ─── TYPES ─── */

interface Student {
    id: number
    name: string
    avatar: string
    age: number
    branch: string
    lastSession: string
    nextSession: string
    status: 'Active' | 'Monitoring' | 'Urgent'
    sessions: number
    mood: 'improving' | 'neutral' | 'declining'
    riskScore: number
    primaryConcern: string
    moodHistory: { week: string; score: number }[]
    notes: { date: string; text: string }[]
}

/* ─── MOCK DATA ─── */

const students: Student[] = [
    {
        id: 1, name: 'Rahul Sharma', avatar: '👨‍🎓', age: 21, branch: 'CS - 3rd Year',
        lastSession: 'Feb 19, 2026', nextSession: 'Feb 23, 2026',
        status: 'Active', sessions: 8, mood: 'improving', riskScore: 32, primaryConcern: 'Exam Anxiety',
        moodHistory: [{ week: 'W1', score: 3 }, { week: 'W2', score: 4 }, { week: 'W3', score: 3.5 }, { week: 'W4', score: 5 }, { week: 'W5', score: 5.5 }, { week: 'W6', score: 6 }, { week: 'W7', score: 6.5 }, { week: 'W8', score: 7 }],
        notes: [
            { date: 'Feb 19', text: 'Session 8: Reviewed thought journal. CBT techniques for exam anxiety showing positive results. Confidence improving.' },
            { date: 'Feb 12', text: 'Session 7: Introduced progressive muscle relaxation. Sleep quality improving to 7hrs avg.' },
            { date: 'Feb 5', text: 'Session 6: Setback — missed 2 homework assignments. Re-aligned goals and simplified exercises.' },
        ],
    },
    {
        id: 2, name: 'Ananya Mishra', avatar: '👩‍🎓', age: 20, branch: 'IT - 2nd Year',
        lastSession: 'Feb 18, 2026', nextSession: 'Feb 23, 2026',
        status: 'Active', sessions: 5, mood: 'improving', riskScore: 40, primaryConcern: 'Social Anxiety',
        moodHistory: [{ week: 'W1', score: 2.5 }, { week: 'W2', score: 3 }, { week: 'W3', score: 3.5 }, { week: 'W4', score: 4 }, { week: 'W5', score: 5 }],
        notes: [
            { date: 'Feb 18', text: 'Session 5: Anxiety levels improved significantly during in-session exposure exercise. Continuing graded exposure.' },
            { date: 'Feb 11', text: 'Session 4: Practiced grounding techniques (5-4-3-2-1). Student reported using them successfully in lecture.' },
        ],
    },
    {
        id: 3, name: 'Vikram Thakur', avatar: '👨‍💻', age: 22, branch: 'ECE - 4th Year',
        lastSession: 'Feb 15, 2026', nextSession: 'Feb 24, 2026',
        status: 'Monitoring', sessions: 12, mood: 'neutral', riskScore: 22, primaryConcern: 'Career Indecision',
        moodHistory: [{ week: 'W1', score: 4 }, { week: 'W2', score: 4.5 }, { week: 'W3', score: 5 }, { week: 'W4', score: 5 }, { week: 'W5', score: 5.5 }, { week: 'W6', score: 5 }, { week: 'W7', score: 5.5 }, { week: 'W8', score: 5.5 }],
        notes: [
            { date: 'Feb 15', text: 'Session 12: Stable. Career mapping exercise completed. Moving to monitoring phase with bi-weekly check-ins.' },
            { date: 'Feb 8', text: 'Session 11: Significant improvement in career-related anxiety. Values clarification complete.' },
        ],
    },
    {
        id: 4, name: 'Priya Lakshmi', avatar: '👩‍🔬', age: 19, branch: 'Biotech - 1st Year',
        lastSession: 'Feb 20, 2026', nextSession: 'Feb 25, 2026',
        status: 'Urgent', sessions: 3, mood: 'declining', riskScore: 72, primaryConcern: 'Social Isolation',
        moodHistory: [{ week: 'W1', score: 5 }, { week: 'W2', score: 4 }, { week: 'W3', score: 3 }],
        notes: [
            { date: 'Feb 20', text: '⚠ Session 3: Reported increased isolation and withdrawal from peers. Escalated to daily check-in protocol. Safety plan reviewed.' },
            { date: 'Feb 13', text: 'Session 2: Peer relationship breakdown discussed. Homesickness exacerbating symptoms.' },
        ],
    },
    {
        id: 5, name: 'Meera Kapoor', avatar: '👩‍🎨', age: 20, branch: 'Design - 2nd Year',
        lastSession: 'Feb 14, 2026', nextSession: 'Feb 26, 2026',
        status: 'Active', sessions: 6, mood: 'improving', riskScore: 28, primaryConcern: 'Perfectionism',
        moodHistory: [{ week: 'W1', score: 3.5 }, { week: 'W2', score: 4 }, { week: 'W3', score: 5 }, { week: 'W4', score: 5.5 }, { week: 'W5', score: 6 }, { week: 'W6', score: 6.5 }],
        notes: [
            { date: 'Feb 14', text: 'Session 6: Positive trajectory. Creative outlets helping manage perfectionist tendencies. Self-compassion exercise effective.' },
        ],
    },
    {
        id: 6, name: 'Arjun Deshpande', avatar: '🧑‍🏫', age: 23, branch: 'ME - 4th Year',
        lastSession: 'Feb 17, 2026', nextSession: 'Feb 25, 2026',
        status: 'Monitoring', sessions: 10, mood: 'improving', riskScore: 18, primaryConcern: 'Insomnia',
        moodHistory: [{ week: 'W1', score: 2 }, { week: 'W2', score: 3 }, { week: 'W3', score: 3.5 }, { week: 'W4', score: 4 }, { week: 'W5', score: 5 }, { week: 'W6', score: 5.5 }, { week: 'W7', score: 6 }, { week: 'W8', score: 6.5 }],
        notes: [
            { date: 'Feb 17', text: 'Session 10: Sleep hygiene greatly improved — 7.5hr avg. Melatonin reduced by half. Moving to maintenance phase.' },
        ],
    },
]

/* ─── STYLES ─── */

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    Active: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    Monitoring: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400' },
    Urgent: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500 animate-pulse' },
}

const moodConfig = {
    improving: { icon: Smile, label: 'Improving', color: 'text-emerald-500' },
    neutral: { icon: Meh, label: 'Stable', color: 'text-amber-400' },
    declining: { icon: Frown, label: 'Declining', color: 'text-red-400' },
}

/* ─── ANIMATION ─── */

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }

/* ─── TOOLTIP ─── */
const GlassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-xl px-3 py-2 rounded-xl shadow-lg border border-teal-100 text-sm">
                <p className="text-gray-500 text-[10px]">{label}</p>
                <p className="font-bold text-teal-600">{payload[0].value.toFixed(1)}</p>
            </div>
        )
    }
    return null
}

/* ─── MAIN ─── */

export default function ActiveStudents() {
    const [selected, setSelected] = useState<Student | null>(null)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    const filtered = students.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.primaryConcern.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === 'All' || s.status === statusFilter
        return matchSearch && matchStatus
    })

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-5">
            {/* Header */}
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-gray-800">
                    Active <span className="text-teal-600">Students</span> 🎓
                </h1>
                <p className="text-gray-500 text-sm mt-1">Your current caseload — {students.length} students across {students.filter(s => s.status === 'Urgent').length} needing urgent attention.</p>
            </motion.div>

            {/* Top Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Total Caseload', value: students.length, color: 'from-teal-50 to-emerald-50' },
                    { label: 'Active', value: students.filter(s => s.status === 'Active').length, color: 'from-emerald-50 to-green-50' },
                    { label: 'Monitoring', value: students.filter(s => s.status === 'Monitoring').length, color: 'from-amber-50 to-orange-50' },
                    { label: 'Urgent', value: students.filter(s => s.status === 'Urgent').length, color: 'from-red-50 to-pink-50' },
                ].map((stat) => (
                    <div key={stat.label} className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} border border-gray-100/50`}>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">{stat.label}</p>
                        <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </motion.div>

            {/* Search & Filter */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or concern..."
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-teal-100/60 focus:border-teal-300 focus:bg-white focus:shadow-lg focus:shadow-teal-100/30 outline-none transition-all duration-300 text-sm text-gray-700 placeholder-gray-400"
                    />
                </div>
                <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-gray-400" />
                    {['All', 'Active', 'Monitoring', 'Urgent'].map((f) => (
                        <button key={f} onClick={() => setStatusFilter(f)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === f ? 'bg-teal-500 text-white shadow-md shadow-teal-200/50' : 'bg-white/60 text-gray-500 hover:bg-teal-50 border border-gray-100/60'}`}
                        >{f}</button>
                    ))}
                </div>
            </motion.div>

            {/* Student Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((student) => {
                    const MoodIcon = moodConfig[student.mood].icon
                    const style = statusStyles[student.status]
                    return (
                        <motion.div key={student.id} variants={fadeUp}>
                            <motion.button
                                whileHover={{ scale: 1.02, y: -4 }}
                                onClick={() => setSelected(student)}
                                className="w-full text-left rounded-3xl glass-card shadow-lg shadow-purple-50/20 hover:shadow-xl hover:shadow-purple-100/30 p-5 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                            >
                                {/* Urgent indicator glow */}
                                {student.status === 'Urgent' && (
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-100/50 to-transparent rounded-bl-full" />
                                )}

                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-xl shadow-sm flex-shrink-0">
                                            {student.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">{student.name}</p>
                                            <p className="text-[10px] text-gray-400">{student.branch} · {student.age}y</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${style.bg} ${style.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                        {student.status}
                                    </span>
                                </div>

                                {/* Concern Tag */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-500 text-[10px] font-semibold border border-gray-100/60">
                                        {student.primaryConcern}
                                    </span>
                                    <div className={`flex items-center gap-1 text-[10px] font-semibold ${moodConfig[student.mood].color}`}>
                                        <MoodIcon className="w-3 h-3" />
                                        {moodConfig[student.mood].label}
                                    </div>
                                </div>

                                {/* Mini Mood Chart */}
                                <div className="h-12 mb-3">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={student.moodHistory}>
                                            <Line type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between text-[10px] text-gray-400">
                                    <span>{student.sessions} sessions · Risk: {student.riskScore}%</span>
                                    <span className="flex items-center gap-1 text-teal-500 font-semibold group-hover:gap-2 transition-all">
                                        View Details <ChevronRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </motion.button>
                        </motion.div>
                    )
                })}
            </div>

            {/* ──── SLIDE-OVER ──── */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/15 backdrop-blur-sm z-50" onClick={() => setSelected(null)} />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50/40 to-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-2xl shadow-sm">
                                        {selected.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{selected.name}</h3>
                                        <p className="text-xs text-gray-400">{selected.branch} · {selected.age} years old</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusStyles[selected.status].bg} ${statusStyles[selected.status].text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[selected.status].dot}`} />
                                                {selected.status}
                                            </span>
                                            {(() => {
                                                const MoodIcon = moodConfig[selected.mood].icon
                                                return (
                                                    <span className={`flex items-center gap-1 text-[10px] font-semibold ${moodConfig[selected.mood].color}`}>
                                                        <MoodIcon className="w-3 h-3" /> {moodConfig[selected.mood].label}
                                                    </span>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Quick Info Cards */}
                            <div className="grid grid-cols-3 gap-2.5 px-6 py-4">
                                <div className="p-3 rounded-xl bg-teal-50/60 text-center">
                                    <p className="text-xl font-black text-gray-800">{selected.sessions}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Sessions</p>
                                </div>
                                <div className="p-3 rounded-xl bg-purple-50/60 text-center">
                                    <p className="text-xl font-black text-gray-800">{selected.riskScore}%</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Risk Score</p>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-50/60 text-center">
                                    <p className="text-[11px] font-bold text-gray-700">{selected.nextSession}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Next Session</p>
                                </div>
                            </div>

                            {/* Mood Progress Chart */}
                            <div className="px-6 pb-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
                                    <p className="text-xs font-semibold text-gray-500">Mood Progress</p>
                                </div>
                                <div className="bg-gray-50/60 rounded-2xl p-3">
                                    <ResponsiveContainer width="100%" height={100}>
                                        <LineChart data={selected.moodHistory}>
                                            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                                            <YAxis domain={[0, 8]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9CA3AF' }} width={20} />
                                            <Tooltip content={<GlassTooltip />} />
                                            <Line type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={2.5} dot={{ fill: '#14B8A6', strokeWidth: 0, r: 3 }} activeDot={{ fill: '#14B8A6', stroke: '#D1FAE5', strokeWidth: 3, r: 5 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Case Notes */}
                            <div className="flex-1 overflow-y-auto px-6 pb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Clinical Notes</p>
                                </div>
                                <div className="space-y-2">
                                    {selected.notes.map((note, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                            className={`p-4 rounded-2xl border text-sm leading-relaxed ${note.text.startsWith('⚠') ? 'bg-red-50/40 border-red-100/60 text-red-700' : 'bg-gray-50/60 border-gray-100/60 text-gray-600'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                <span className="text-[10px] font-semibold text-gray-400">{note.date}</span>
                                            </div>
                                            {note.text}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-5 border-t border-gray-100 flex gap-2.5">
                                <button className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-teal-200/50 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                    <Video className="w-4 h-4" /> Start Session
                                </button>
                                <button className="px-4 py-3 rounded-2xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> Call
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
