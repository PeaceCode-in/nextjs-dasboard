'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell, Brain, CalendarCheck, BookOpen, Wind, Heart,
    AlertCircle, Sparkles, CheckCircle2, Clock, Trash2,
    GraduationCap, Stethoscope, Dumbbell, MessageCircle,
    BellOff, ChevronRight, X
} from 'lucide-react'

/* ─── TYPES ─── */
type Category = 'all' | 'wellness' | 'academic' | 'sessions' | 'system'

interface Notification {
    id: string
    title: string
    body: string
    time: string
    category: Category
    icon: React.ElementType
    iconBg: string        // tailwind bg + text classes
    read: boolean
    priority?: 'high' | 'normal'
    action?: string
}

/* ─── DATA ─── */
const initialNotifications: Notification[] = [
    {
        id: 'n1',
        title: 'Focus Session Starting Soon',
        body: 'Your scheduled 25-minute deep focus session begins in 10 minutes. Close distractions and get ready.',
        time: '10 min ago',
        category: 'wellness',
        icon: Brain,
        iconBg: 'bg-indigo-50 text-indigo-500',
        read: false,
        priority: 'high',
        action: 'Start Focus',
    },
    {
        id: 'n2',
        title: 'Exams Are Around the Corner',
        body: 'Your semester exams begin in 14 days. Consider scheduling a counselling session to manage exam anxiety.',
        time: '1 hr ago',
        category: 'academic',
        icon: GraduationCap,
        iconBg: 'bg-rose-50 text-rose-500',
        read: false,
        priority: 'high',
        action: 'Book Session',
    },
    {
        id: 'n3',
        title: 'Mindful Breathing Reminder',
        body: 'You haven\'t completed a breathing exercise today. A 4-minute session can reset your focus instantly.',
        time: '2 hrs ago',
        category: 'wellness',
        icon: Wind,
        iconBg: 'bg-cyan-50 text-cyan-500',
        read: false,
        action: 'Start Breathing',
    },
    {
        id: 'n4',
        title: 'Counselling Session Confirmed',
        body: 'Your session with Dr. Anya Sharma is confirmed for tomorrow at 11:00 AM. You\'ll receive a reminder 30 min before.',
        time: '3 hrs ago',
        category: 'sessions',
        icon: CalendarCheck,
        iconBg: 'bg-emerald-50 text-emerald-500',
        read: true,
        action: 'View Details',
    },
    {
        id: 'n5',
        title: 'New Workshop: Sleep Hygiene 101',
        body: 'A new workshop has been added to your feed — "Sleep Hygiene for Students". Only 4 seats remaining.',
        time: '5 hrs ago',
        category: 'academic',
        icon: BookOpen,
        iconBg: 'bg-violet-50 text-violet-500',
        read: true,
        action: 'Reserve Seat',
    },
    {
        id: 'n6',
        title: 'Mood Check-In Pending',
        body: 'You haven\'t logged your mood today. Daily check-ins help us personalise your wellness journey.',
        time: '6 hrs ago',
        category: 'wellness',
        icon: Heart,
        iconBg: 'bg-pink-50 text-pink-500',
        read: true,
        action: 'Log Mood',
    },
    {
        id: 'n7',
        title: 'Mind Gym: New Game Unlocked',
        body: '"Flow State Connector" is now available in your Mind Gym. 5 minutes a day improves focus by 23%.',
        time: 'Yesterday',
        category: 'wellness',
        icon: Dumbbell,
        iconBg: 'bg-amber-50 text-amber-500',
        read: true,
        action: 'Play Now',
    },
    {
        id: 'n8',
        title: 'Peace Bot Check-In',
        body: 'It\'s been 3 days since your last conversation with Peace Bot. She\'s here whenever you need to talk.',
        time: 'Yesterday',
        category: 'wellness',
        icon: MessageCircle,
        iconBg: 'bg-purple-50 text-purple-500',
        read: true,
        action: 'Chat Now',
    },
    {
        id: 'n9',
        title: 'PHQ-9 Screening Available',
        body: 'Your monthly mental health screening is ready. Takes only 3 minutes and is completely confidential.',
        time: '2 days ago',
        category: 'sessions',
        icon: Stethoscope,
        iconBg: 'bg-blue-50 text-blue-500',
        read: true,
        action: 'Begin Screening',
    },
    {
        id: 'n10',
        title: 'System: Privacy Policy Updated',
        body: 'We\'ve updated our privacy policy to better protect your data. No action required — your settings remain unchanged.',
        time: '3 days ago',
        category: 'system',
        icon: AlertCircle,
        iconBg: 'bg-slate-100 text-slate-400',
        read: true,
    },
    {
        id: 'n11',
        title: 'Gratitude Streak — 5 Days!',
        body: 'You\'ve logged gratitude 5 days in a row. Consistent gratitude practice is linked to reduced anxiety.',
        time: '3 days ago',
        category: 'wellness',
        icon: Sparkles,
        iconBg: 'bg-yellow-50 text-yellow-500',
        read: true,
    },
]

const categories: { key: Category; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'wellness', label: 'Wellness' },
    { key: 'academic', label: 'Academic' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'system', label: 'System' },
]

/* ─── COMPONENT ─── */
export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const [activeCategory, setActiveCategory] = useState<Category>('all')
    const [deletedId, setDeletedId] = useState<string | null>(null)

    const unreadCount = notifications.filter(n => !n.read).length

    const filtered = notifications.filter(n =>
        activeCategory === 'all' ? true : n.category === activeCategory
    )

    const markAllRead = () =>
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))

    const markRead = (id: string) =>
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

    const dismiss = (id: string) => {
        setDeletedId(id)
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id))
            setDeletedId(null)
        }, 350)
    }

    return (
        <div className="relative w-full min-h-screen font-sans overflow-hidden pb-32">

            {/* ── Ethereal Background (matches Screening) ── */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 30, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-[10%] -right-[10%] w-[55%] h-[65%] bg-purple-100 rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-[0%] -left-[10%] w-[50%] h-[60%] bg-blue-100 rounded-full blur-[140px]"
                />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 pt-10 space-y-10">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-purple-100/30"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center">
                            <Bell className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-1">
                                Notifications
                            </h1>
                            <p className="text-sm text-slate-500 font-light">
                                {unreadCount > 0
                                    ? <><span className="font-medium text-purple-600">{unreadCount} unread</span> — stay on top of your wellness.</>
                                    : 'You\'re all caught up. Great going!'}
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors px-4 py-2 rounded-full hover:bg-purple-50"
                        >
                            <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                            Mark all read
                        </button>
                    )}
                </motion.div>

                {/* ── Category Filter Pills ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex items-center gap-2 flex-wrap"
                >
                    {categories.map(cat => {
                        const count = cat.key === 'all'
                            ? notifications.filter(n => !n.read).length
                            : notifications.filter(n => n.category === cat.key && !n.read).length

                        return (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.key
                                    ? 'bg-slate-800 text-white shadow-[0_4px_15px_rgba(0,0,0,0.12)]'
                                    : 'bg-white/60 backdrop-blur-md border border-white/80 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                    }`}
                            >
                                {cat.label}
                                {count > 0 && (
                                    <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeCategory === cat.key ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </motion.div>

                {/* ── Notification List ── */}
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filtered.length === 0 && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-24 gap-4"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center">
                                    <BellOff className="w-7 h-7 text-slate-300" strokeWidth={1.5} />
                                </div>
                                <p className="text-sm text-slate-400 font-light">No notifications in this category.</p>
                            </motion.div>
                        )}

                        {filtered.map((n, index) => {
                            const Icon = n.icon
                            const isBeingDeleted = deletedId === n.id

                            return (
                                <motion.div
                                    key={n.id}
                                    layout
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: isBeingDeleted ? 0 : 1, y: isBeingDeleted ? -8 : 0, scale: isBeingDeleted ? 0.97 : 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                    transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                                    onClick={() => markRead(n.id)}
                                    className={`group relative rounded-[1.5rem] border transition-all duration-300 cursor-pointer
                                        ${n.read
                                            ? 'bg-white/40 backdrop-blur-md border-white/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.06)]'
                                            : 'bg-white/70 backdrop-blur-xl border-white/90 shadow-[0_4px_30px_rgba(139,92,246,0.08)] hover:shadow-[0_10px_40px_rgba(139,92,246,0.12)]'
                                        }`}
                                >
                                    {/* Unread indicator stripe */}
                                    {!n.read && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-purple-400 to-indigo-400 rounded-r-full" />
                                    )}

                                    {/* Priority badge */}
                                    {n.priority === 'high' && !n.read && (
                                        <div className="absolute top-4 right-12 flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                            <span className="text-[9px] font-semibold text-rose-500 uppercase tracking-wider">Urgent</span>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4 p-5 md:p-6">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${n.iconBg} shadow-sm`}>
                                            <Icon className="w-5 h-5" strokeWidth={1.5} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className={`text-sm font-medium leading-snug ${n.read ? 'text-slate-600' : 'text-slate-800'}`}>
                                                    {n.title}
                                                </p>
                                            </div>
                                            <p className="text-sm text-slate-400 font-light leading-relaxed mb-3">
                                                {n.body}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-light">
                                                    <Clock className="w-3 h-3" strokeWidth={1.5} />
                                                    {n.time}
                                                </span>
                                                {n.action && (
                                                    <button
                                                        onClick={e => { e.stopPropagation(); markRead(n.id) }}
                                                        className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors group/action"
                                                    >
                                                        {n.action}
                                                        <ChevronRight className="w-3.5 h-3.5 group-hover/action:translate-x-0.5 transition-transform" strokeWidth={2} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Dismiss button */}
                                        <button
                                            onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                                            title="Dismiss"
                                        >
                                            <X className="w-3.5 h-3.5" strokeWidth={2} />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* ── Clear All ── */}
                {filtered.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center pt-4"
                    >
                        <button
                            onClick={() => setNotifications(prev => prev.filter(n =>
                                activeCategory === 'all' ? false : n.category !== activeCategory
                            ))}
                            className="flex items-center gap-2 text-sm font-light text-slate-400 hover:text-rose-500 transition-colors px-5 py-2.5 rounded-full hover:bg-rose-50"
                        >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            Clear {activeCategory === 'all' ? 'all' : activeCategory} notifications
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
