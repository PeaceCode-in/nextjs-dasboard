'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Calendar, Video, Clock, Users, ArrowRight } from 'lucide-react'

// --- MOCK DATA ---
const upcomingWorkshops = [
    { id: 1, title: 'Mindful Study Techniques', time: 'Tomorrow, 4:00 PM', attendees: 45, author: 'Dr. Sarah Lee', gradient: 'from-indigo-500 to-purple-500', isLive: false, category: 'Academic' },
    { id: 2, title: 'Stress Management 101', time: 'Next Wed, 2:30 PM', attendees: 120, author: 'Prof. Mark Davis', gradient: 'from-pink-500 to-rose-500', isLive: false, category: 'Anxiety' },
    { id: 3, title: 'Navigating Placement Season', time: 'Nov 2, 5:00 PM', attendees: 310, author: 'Career Cell', gradient: 'from-amber-400 to-orange-500', isLive: false, category: 'Career' },
]

const presentWorkshops = [
    { id: 4, title: 'Live Guided Meditation', time: 'Happening Now', attendees: 84, author: 'PeaceCode Wellness', gradient: 'from-emerald-400 to-teal-500', isLive: true, category: 'Meditation' },
]

const expWorkshops = [
    { id: 5, title: 'Sleep Hygiene Workshop', time: 'Ended (Oct 15)', attendees: 210, author: 'Dr. Emily Chen', gradient: 'from-slate-400 to-gray-500', isLive: false, category: 'Sleep' },
    { id: 6, title: 'CBT for Academic Anxiety', time: 'Ended (Sep 10)', attendees: 140, author: 'Counseling Dept', gradient: 'from-slate-400 to-gray-500', isLive: false, category: 'CBT' },
    { id: 7, title: 'Digital Detox Masterclass', time: 'Ended (Aug 22)', attendees: 95, author: 'Wellness Hub', gradient: 'from-slate-400 to-gray-500', isLive: false, category: 'Lifestyle' },
]

// --- ANIMATION CONFIG ---
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }

export default function Workshops({ onNavigate }: { onNavigate?: (page: string) => void }) {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'present' | 'exp'>('upcoming')

    const getActiveData = () => {
        if (activeTab === 'upcoming') return upcomingWorkshops
        if (activeTab === 'present') return presentWorkshops
        return expWorkshops
    }

    const currentData = getActiveData()

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-16">
            {/* ── HEADER & BACK NAVIGATION ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                <button onClick={() => onNavigate?.('dashboard')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm border border-slate-100 group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-light text-slate-800 tracking-tight">Workshops & Seminars</h1>
                    <p className="text-sm font-medium text-slate-400 tracking-wide mt-1">Live interactive sessions & masterclasses</p>
                </div>
            </motion.div>

            {/* ── HERO BANNER ── */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }} className="relative w-full h-48 md:h-64 rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(99,102,241,0.1)] group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-800" />
                <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-[80px]" />

                <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm mb-4">
                        <Video className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Live Learning</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-light text-white leading-snug tracking-tight max-w-lg drop-shadow-sm">
                        Elevate your mind with <br />expert guidance.
                    </h2>
                </div>
            </motion.div>

            {/* ── TABS ── */}
            <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl w-full max-w-md mx-auto relative z-20 shadow-sm">
                {(['upcoming', 'present', 'exp'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative flex-1 py-2.5 text-sm font-bold uppercase tracking-widest transition-all duration-300 z-10 ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {activeTab === tab && (
                            <motion.div layoutId="workshop-tab" className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] -z-10" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                        )}
                        {tab === 'exp' ? 'Expired' : tab}
                    </button>
                ))}
            </div>

            {/* ── CONTENT GRID ── */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" key={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {currentData.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center flex flex-col items-center">
                            <Calendar className="w-12 h-12 text-slate-200 mb-4" strokeWidth={1} />
                            <p className="text-lg font-light text-slate-500 tracking-tight">No workshops found in this category.</p>
                        </motion.div>
                    ) : (
                        currentData.map((workshop) => (
                            <motion.div key={workshop.id} variants={itemVariants} layout className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_10px_40px_rgba(99,102,241,0.08)] hover:border-indigo-50 transition-all duration-300 group flex flex-col h-full cursor-pointer">
                                <div className={`w-full h-32 rounded-2xl bg-gradient-to-br ${workshop.gradient} mb-6 relative overflow-hidden flex items-center justify-center`}>
                                    <div className="absolute inset-0 bg-white/20" />
                                    {workshop.isLive && (
                                        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" /> Live Now
                                        </div>
                                    )}
                                    <span className="relative z-10 text-white text-xs font-black uppercase tracking-[0.2em] opacity-90">{workshop.category}</span>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <h3 className="text-xl font-light text-slate-800 leading-snug tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                                        {workshop.title}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-400 mb-5 tracking-wide">by {workshop.author}</p>

                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
                                            <Clock className="w-4 h-4 text-indigo-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest">{workshop.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
                                            <Users className="w-4 h-4 text-emerald-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest">{workshop.attendees} Attending</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-4 border-t border-slate-50 flex items-center justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <span className="text-sm font-bold text-indigo-600">
                                        {activeTab === 'exp' ? 'View Recording' : 'Reserve Seat'}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-indigo-600" />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
