'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Clock, RefreshCw, Video, Calendar } from 'lucide-react'

/* ─── TYPES ─── */

interface Booking {
    id: string
    student: string
    avatar: string
    topic: string
    startHour: number
    startMin: number
    durationMin: number
    color: string
}

/* ─── MOCK DATA ─── */

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

// Bookings keyed by date string "YYYY-MM-DD"
const bookingsData: Record<string, Booking[]> = {
    '2026-02-23': [
        { id: '1', student: 'Rahul S.', avatar: '👨‍🎓', topic: 'Exam Stress Follow-up', startHour: 10, startMin: 0, durationMin: 45, color: '#14B8A6' },
        { id: '2', student: 'Ananya M.', avatar: '👩‍🎓', topic: 'Anxiety Management', startHour: 14, startMin: 0, durationMin: 45, color: '#8B8AFF' },
        { id: '3', student: 'Vikram T.', avatar: '👨‍💻', topic: 'Career Decision Stress', startHour: 16, startMin: 0, durationMin: 45, color: '#F59E0B' },
    ],
    '2026-02-24': [
        { id: '4', student: 'Meera K.', avatar: '👩‍🎨', topic: 'Initial Assessment', startHour: 9, startMin: 0, durationMin: 60, color: '#EC4899' },
        { id: '5', student: 'Priya L.', avatar: '👩‍🔬', topic: 'Peer Relationship Issues', startHour: 11, startMin: 30, durationMin: 45, color: '#14B8A6' },
        { id: '6', student: 'Arjun D.', avatar: '🧑‍🏫', topic: 'Sleep Hygiene', startHour: 15, startMin: 0, durationMin: 45, color: '#8B8AFF' },
    ],
    '2026-02-25': [
        { id: '7', student: 'Sneha R.', avatar: '👩‍💼', topic: 'Self-esteem Building', startHour: 9, startMin: 30, durationMin: 45, color: '#22C55E' },
        { id: '8', student: 'Karan P.', avatar: '👨‍🎓', topic: 'Academic Burnout', startHour: 13, startMin: 0, durationMin: 60, color: '#F59E0B' },
    ],
    '2026-02-26': [
        { id: '9', student: 'Rahul S.', avatar: '👨‍🎓', topic: 'CBT Module Review', startHour: 10, startMin: 0, durationMin: 45, color: '#14B8A6' },
        { id: '10', student: 'Ananya M.', avatar: '👩‍🎓', topic: 'Exposure Therapy', startHour: 14, startMin: 0, durationMin: 45, color: '#8B8AFF' },
    ],
    '2026-02-27': [
        { id: '11', student: 'Vikram T.', avatar: '👨‍💻', topic: 'Career Mapping Session', startHour: 11, startMin: 0, durationMin: 60, color: '#EC4899' },
        { id: '12', student: 'Meera K.', avatar: '👩‍🎨', topic: 'Art Therapy Integration', startHour: 15, startMin: 0, durationMin: 45, color: '#22C55E' },
        { id: '13', student: 'Priya L.', avatar: '👩‍🔬', topic: 'Group Dynamics Debrief', startHour: 17, startMin: 0, durationMin: 45, color: '#F59E0B' },
    ],
    '2026-02-21': [
        { id: '14', student: 'Meera K.', avatar: '👩‍🎨', topic: 'Initial Assessment', startHour: 9, startMin: 0, durationMin: 45, color: '#EC4899' },
        { id: '15', student: 'Rahul S.', avatar: '👨‍🎓', topic: 'Exam Stress Follow-up', startHour: 10, startMin: 0, durationMin: 45, color: '#14B8A6' },
        { id: '16', student: 'Ananya M.', avatar: '👩‍🎓', topic: 'Anxiety Management', startHour: 11, startMin: 30, durationMin: 45, color: '#8B8AFF' },
        { id: '17', student: 'Vikram T.', avatar: '👨‍💻', topic: 'Career Decision Stress', startHour: 14, startMin: 0, durationMin: 45, color: '#F59E0B' },
        { id: '18', student: 'Priya L.', avatar: '👩‍🔬', topic: 'Peer Relationship Issues', startHour: 15, startMin: 30, durationMin: 45, color: '#22C55E' },
        { id: '19', student: 'Arjun D.', avatar: '🧑‍🏫', topic: 'Sleep Hygiene Follow-up', startHour: 17, startMin: 0, durationMin: 45, color: '#8B8AFF' },
    ],
}

/* ─── ANIMATION ─── */

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }

/* ─── HELPERS ─── */

function getWeekDates(refDate: Date): Date[] {
    const d = new Date(refDate)
    const dayOfWeek = d.getDay()
    d.setDate(d.getDate() - dayOfWeek) // go to Sunday
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(d)
        date.setDate(d.getDate() + i)
        return date
    })
}

function formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatTime(hour: number, min: number): string {
    const period = hour >= 12 ? 'PM' : 'AM'
    const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${h}:${String(min).padStart(2, '0')} ${period}`
}

/* ─── MAIN ─── */

export default function MySchedule() {
    const [view, setView] = useState<'week' | 'day'>('week')
    const [refDate, setRefDate] = useState(new Date(2026, 1, 21))
    const [selectedBooking, setSelectedBooking] = useState<{ booking: Booking; date: string } | null>(null)

    const weekDates = getWeekDates(refDate)
    const today = new Date()
    const todayKey = formatDateKey(today)

    const prevWeek = () => { const d = new Date(refDate); d.setDate(d.getDate() - 7); setRefDate(d) }
    const nextWeek = () => { const d = new Date(refDate); d.setDate(d.getDate() + 7); setRefDate(d) }
    const goToday = () => setRefDate(new Date(2026, 1, 21))

    // Day view
    const [dayViewDate, setDayViewDate] = useState(new Date(2026, 1, 21))
    const dayKey = formatDateKey(dayViewDate)
    const dayBookings = bookingsData[dayKey] || []
    const prevDay = () => { const d = new Date(dayViewDate); d.setDate(d.getDate() - 1); setDayViewDate(d) }
    const nextDay = () => { const d = new Date(dayViewDate); d.setDate(d.getDate() + 1); setDayViewDate(d) }

    // Summary stats
    const weekBookingCount = weekDates.reduce((sum, d) => sum + (bookingsData[formatDateKey(d)]?.length || 0), 0)

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-5">
            {/* Header */}
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        My <span className="text-teal-600">Schedule</span> 📅
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all your sessions in one place.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    {(['day', 'week'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${view === v
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-200/50'
                                    : 'bg-white/60 text-gray-500 hover:bg-teal-50 border border-gray-100/60'
                                }`}
                        >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Week Summary Cards */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100/50">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">This Week</p>
                    <p className="text-xl font-black text-gray-800">{weekBookingCount} <span className="text-sm font-medium text-gray-400">sessions</span></p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/50">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Busiest Day</p>
                    <p className="text-xl font-black text-gray-800">Friday <span className="text-sm font-medium text-gray-400">3 slots</span></p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Open Slots</p>
                    <p className="text-xl font-black text-gray-800">12 <span className="text-sm font-medium text-gray-400">available</span></p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100/50">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Avg Duration</p>
                    <p className="text-xl font-black text-gray-800">48 <span className="text-sm font-medium text-gray-400">min</span></p>
                </div>
            </motion.div>

            {/* ──── WEEK VIEW ──── */}
            {view === 'week' && (
                <motion.div variants={fadeUp}>
                    <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 overflow-hidden">

                        {/* Navigation */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100/60 bg-white/40">
                            <button onClick={prevWeek} className="p-2 rounded-xl hover:bg-teal-50 transition-all"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-700">
                                    {MONTH_NAMES[weekDates[0].getMonth()]} {weekDates[0].getDate()} – {weekDates[6].getDate()}, {weekDates[0].getFullYear()}
                                </span>
                                <button onClick={goToday} className="text-[10px] px-2.5 py-1 rounded-full bg-teal-50 text-teal-600 font-semibold hover:bg-teal-100 transition-all">
                                    Today
                                </button>
                            </div>
                            <button onClick={nextWeek} className="p-2 rounded-xl hover:bg-teal-50 transition-all"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[800px]">
                                {/* Day Headers */}
                                <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100/60">
                                    <div className="p-2" /> {/* time gutter */}
                                    {weekDates.map((date, i) => {
                                        const isToday = formatDateKey(date) === todayKey
                                        return (
                                            <div key={i} className={`p-3 text-center border-l border-gray-100/40 ${isToday ? 'bg-teal-50/40' : ''}`}>
                                                <p className={`text-[10px] font-semibold uppercase tracking-wider ${isToday ? 'text-teal-600' : 'text-gray-400'}`}>
                                                    {DAY_SHORT[date.getDay()]}
                                                </p>
                                                <p className={`text-lg font-bold mt-0.5 ${isToday ? 'text-teal-600 bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto' : 'text-gray-700'}`}>
                                                    {date.getDate()}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Time Rows */}
                                {HOURS.map((hour) => (
                                    <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-50/80" style={{ minHeight: '60px' }}>
                                        {/* Time label */}
                                        <div className="p-2 flex items-start justify-end pr-3">
                                            <span className="text-[10px] text-gray-400 font-medium">{formatTime(hour, 0)}</span>
                                        </div>

                                        {/* Day Cells */}
                                        {weekDates.map((date, dayIdx) => {
                                            const dateKey = formatDateKey(date)
                                            const cellBookings = (bookingsData[dateKey] || []).filter(
                                                b => b.startHour === hour || (b.startHour < hour && b.startHour + Math.ceil(b.durationMin / 60) > hour)
                                            )
                                            const isToday = dateKey === todayKey

                                            return (
                                                <div key={dayIdx} className={`relative border-l border-gray-100/40 ${isToday ? 'bg-teal-50/20' : ''}`}>
                                                    {cellBookings.filter(b => b.startHour === hour).map((booking) => {
                                                        const topOffset = (booking.startMin / 60) * 100
                                                        const height = (booking.durationMin / 60) * 60 // 60px per hour
                                                        return (
                                                            <motion.button
                                                                key={booking.id}
                                                                whileHover={{ scale: 1.02, zIndex: 20 }}
                                                                onClick={() => setSelectedBooking({ booking, date: dateKey })}
                                                                className="absolute left-1 right-1 rounded-xl px-2.5 py-1.5 text-left overflow-hidden shadow-md hover:shadow-lg transition-all z-10 cursor-pointer"
                                                                style={{
                                                                    top: `${topOffset}%`,
                                                                    height: `${height}px`,
                                                                    backgroundColor: booking.color + '20',
                                                                    borderLeft: `3px solid ${booking.color}`,
                                                                }}
                                                            >
                                                                <p className="text-[10px] font-bold text-gray-700 truncate">{booking.student}</p>
                                                                <p className="text-[9px] text-gray-500 truncate">{formatTime(booking.startHour, booking.startMin)}</p>
                                                            </motion.button>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ──── DAY VIEW ──── */}
            {view === 'day' && (
                <motion.div variants={fadeUp}>
                    <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 overflow-hidden">
                        {/* Day Nav */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100/60 bg-white/40">
                            <button onClick={prevDay} className="p-2 rounded-xl hover:bg-teal-50 transition-all"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                            <span className="text-sm font-semibold text-gray-700">
                                {DAY_NAMES[dayViewDate.getDay()]}, {MONTH_NAMES[dayViewDate.getMonth()]} {dayViewDate.getDate()}, {dayViewDate.getFullYear()}
                            </span>
                            <button onClick={nextDay} className="p-2 rounded-xl hover:bg-teal-50 transition-all"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                        </div>

                        {/* Time Slots */}
                        <div className="max-w-2xl mx-auto p-5">
                            {HOURS.map((hour) => {
                                const hourBookings = dayBookings.filter(b => b.startHour === hour)
                                return (
                                    <div key={hour} className="flex gap-4 min-h-[70px] border-b border-gray-50/80 py-2">
                                        <div className="w-16 flex-shrink-0 pt-1">
                                            <span className="text-xs text-gray-400 font-medium">{formatTime(hour, 0)}</span>
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            {hourBookings.map((booking) => (
                                                <motion.button
                                                    key={booking.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    onClick={() => setSelectedBooking({ booking, date: dayKey })}
                                                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all hover:shadow-md cursor-pointer"
                                                    style={{ backgroundColor: booking.color + '15', borderLeft: `3px solid ${booking.color}` }}
                                                >
                                                    <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                                                        {booking.avatar}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-700">{booking.student}</p>
                                                        <p className="text-xs text-gray-400">{booking.topic}</p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-xs font-medium text-gray-600">{formatTime(booking.startHour, booking.startMin)}</p>
                                                        <p className="text-[10px] text-gray-400">{booking.durationMin} min</p>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ──── SESSION DETAIL MODAL ──── */}
            <AnimatePresence>
                {selectedBooking && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={() => setSelectedBooking(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold text-gray-800">Session Details</h3>
                                <button onClick={() => setSelectedBooking(null)} className="p-1.5 rounded-xl hover:bg-gray-100 transition-all"><X className="w-4 h-4 text-gray-400" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: selectedBooking.booking.color + '20' }}>
                                        {selectedBooking.booking.avatar}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-gray-800">{selectedBooking.booking.student}</p>
                                        <p className="text-xs text-gray-400">{selectedBooking.booking.topic}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                                    <Calendar className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                    <span>{selectedBooking.date}</span>
                                    <span className="text-gray-300">|</span>
                                    <Clock className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                    <span>{formatTime(selectedBooking.booking.startHour, selectedBooking.booking.startMin)} · {selectedBooking.booking.durationMin} min</span>
                                </div>

                                <div className="p-3 rounded-xl bg-gray-50/60 text-sm text-gray-500 leading-relaxed">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Pre-session Notes</p>
                                    Previous session focused on identifying cognitive distortions. Student reported improvement in journaling consistency.
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-teal-200/50 transition-all hover:shadow-xl flex items-center justify-center gap-2">
                                        <Video className="w-4 h-4" /> Join Session
                                    </button>
                                    <button className="px-4 py-3 rounded-xl border border-amber-200 text-amber-600 text-sm font-semibold hover:bg-amber-50 transition-all flex items-center gap-1.5">
                                        <RefreshCw className="w-3.5 h-3.5" /> Reschedule
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
