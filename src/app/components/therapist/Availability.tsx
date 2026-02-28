'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Clock, ToggleLeft, ToggleRight, Info, CalendarDays, Users, Zap } from 'lucide-react'

/* ─── CONSTANTS ─── */

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({ length: 12 }, (_, i) => i + 9) // 9AM to 8PM

/* ─── INITIAL SLOTS ─── */

function initSlots(): Record<string, Record<number, 'open' | 'blocked' | 'none'>> {
    const slots: Record<string, Record<number, 'open' | 'blocked' | 'none'>> = {}
    DAYS.forEach((day) => {
        slots[day] = {}
        HOURS.forEach((hour) => {
            if (['Saturday', 'Sunday'].includes(day)) {
                slots[day][hour] = 'none'
            } else if (hour >= 9 && hour <= 16) {
                slots[day][hour] = 'open'
            } else {
                slots[day][hour] = 'none'
            }
        })
    })
    return slots
}

/* ─── ANIMATION ─── */

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }

/* ─── MAIN ─── */

export default function Availability() {
    const [slots, setSlots] = useState(initSlots)
    const [acceptingNew, setAcceptingNew] = useState(true)
    const [isDragging, setIsDragging] = useState(false)
    const [dragPaint, setDragPaint] = useState<'open' | 'blocked'>('open')

    const handleMouseDown = useCallback((day: string, hour: number) => {
        setIsDragging(true)
        const current = slots[day][hour]
        const next = current === 'open' ? 'blocked' : 'open'
        setDragPaint(next)
        setSlots(prev => ({ ...prev, [day]: { ...prev[day], [hour]: next } }))
    }, [slots])

    const handleMouseEnter = useCallback((day: string, hour: number) => {
        if (!isDragging) return
        setSlots(prev => ({ ...prev, [day]: { ...prev[day], [hour]: dragPaint } }))
    }, [isDragging, dragPaint])

    const handleMouseUp = useCallback(() => setIsDragging(false), [])

    const toggleSlot = useCallback((day: string, hour: number) => {
        setSlots(prev => {
            const current = prev[day][hour]
            const next = current === 'open' ? 'blocked' : 'open'
            return { ...prev, [day]: { ...prev[day], [hour]: next } }
        })
    }, [])

    const formatHour = (h: number) => {
        if (h === 12) return '12 PM'
        return h > 12 ? `${h - 12} PM` : `${h} AM`
    }

    // Stats
    const allSlots = DAYS.flatMap(d => HOURS.map(h => slots[d][h]))
    const totalOpen = allSlots.filter(s => s === 'open').length
    const totalBlocked = allSlots.filter(s => s === 'blocked').length
    const totalUnset = allSlots.filter(s => s === 'none').length
    const totalHours = totalOpen // since each slot is 1 hr
    const busiestDay = DAYS.reduce((max, day) => {
        const count = HOURS.filter(h => slots[day][h] === 'open').length
        return count > max.count ? { day, count } : max
    }, { day: '', count: 0 })

    return (
        <motion.div
            variants={container} initial="hidden" animate="show"
            className="w-full mx-auto space-y-5 select-none"
            onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        >
            {/* Header */}
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-gray-800">
                    Set Your <span className="text-teal-600">Availability</span> ⏰
                </h1>
                <p className="text-gray-500 text-sm mt-1">Define when students can book sessions with you.</p>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100/50">
                    <div className="flex items-center gap-2 mb-1">
                        <CalendarDays className="w-3.5 h-3.5 text-emerald-500" />
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Open Slots</p>
                    </div>
                    <p className="text-2xl font-black text-gray-800">{totalOpen}</p>
                    <p className="text-[10px] text-emerald-500 font-medium">{totalHours} hrs/week</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-3.5 h-3.5 text-red-400" />
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Blocked</p>
                    </div>
                    <p className="text-2xl font-black text-gray-800">{totalBlocked}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{totalUnset} unset</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3.5 h-3.5 text-purple-500" />
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Busiest Day</p>
                    </div>
                    <p className="text-lg font-black text-gray-800">{busiestDay.day || '—'}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{busiestDay.count} open slots</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">Utilization</p>
                    </div>
                    <p className="text-2xl font-black text-gray-800">{totalOpen > 0 ? Math.round((totalOpen / (totalOpen + totalBlocked + totalUnset)) * 100) : 0}%</p>
                    <p className="text-[10px] text-gray-400 font-medium">of total capacity</p>
                </div>
            </motion.div>

            {/* Controls */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4">
                {/* Accepting toggle */}
                <button
                    onClick={() => setAcceptingNew(p => !p)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all duration-300 ${acceptingNew
                            ? 'bg-emerald-50 border-emerald-300/60 text-emerald-700 shadow-md shadow-emerald-100/40'
                            : 'bg-red-50 border-red-300/60 text-red-600 shadow-md shadow-red-100/40'
                        }`}
                >
                    {acceptingNew ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    <span className="text-sm font-bold">{acceptingNew ? '✓ Accepting New Students' : '✕ Not Accepting New Students'}</span>
                </button>

                {/* Legend */}
                <div className="flex items-center gap-5 bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-100/60">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-lg bg-emerald-200 border border-emerald-400/50" />
                        <span className="text-[11px] text-gray-500 font-medium">Open</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-lg bg-red-200 border border-red-400/50" />
                        <span className="text-[11px] text-gray-500 font-medium">Blocked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-lg bg-gray-100 border border-gray-300/50" />
                        <span className="text-[11px] text-gray-500 font-medium">Unset</span>
                    </div>
                </div>
            </motion.div>

            {/* Instruction Banner */}
            <motion.div variants={fadeUp} className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100/60">
                <Info className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <p className="text-xs text-teal-700"><strong>Click</strong> a cell to toggle it, or <strong>click & drag</strong> to paint multiple slots at once. Students can only book during green (open) slots.</p>
            </motion.div>

            {/* ── AVAILABILITY GRID ── */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 p-5 overflow-x-auto">
                    <div className="min-w-[720px]">
                        {/* Column Headers */}
                        <div className="grid grid-cols-[70px_repeat(7,1fr)] gap-1 mb-2">
                            <div />
                            {DAY_SHORT.map((day, i) => (
                                <div key={day} className="text-center">
                                    <p className={`text-[11px] font-bold uppercase tracking-wider ${!['Sat', 'Sun'].includes(day) ? 'text-gray-600' : 'text-gray-300'
                                        }`}>{day}</p>
                                    <p className="text-[9px] text-gray-400 mt-0.5">
                                        {HOURS.filter(h => slots[DAYS[i]][h] === 'open').length} open
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Time Rows */}
                        {HOURS.map((hour) => (
                            <div key={hour} className="grid grid-cols-[70px_repeat(7,1fr)] gap-1 mb-1">
                                <div className="flex items-center justify-end pr-3">
                                    <span className="text-[11px] text-gray-400 font-semibold">{formatHour(hour)}</span>
                                </div>
                                {DAYS.map((day) => {
                                    const state = slots[day][hour]
                                    return (
                                        <motion.div
                                            key={`${day}-${hour}`}
                                            whileHover={{ scale: 1.1, zIndex: 10 }}
                                            onMouseDown={(e) => { e.preventDefault(); handleMouseDown(day, hour) }}
                                            onMouseEnter={() => handleMouseEnter(day, hour)}
                                            onClick={() => { if (!isDragging) toggleSlot(day, hour) }}
                                            className={`h-10 rounded-xl border-2 cursor-pointer transition-all duration-150 flex items-center justify-center shadow-sm ${state === 'open'
                                                    ? 'bg-emerald-100/80 border-emerald-300/60 hover:bg-emerald-200 shadow-emerald-100/30'
                                                    : state === 'blocked'
                                                        ? 'bg-red-100/80 border-red-300/60 hover:bg-red-200 shadow-red-100/30'
                                                        : 'bg-gray-50/80 border-gray-200/40 hover:bg-teal-50 hover:border-teal-200/60'
                                                }`}
                                        >
                                            {state === 'open' && <Clock className="w-3.5 h-3.5 text-emerald-500 opacity-60" />}
                                            {state === 'blocked' && <span className="text-red-400 text-sm font-bold">×</span>}
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Auto-save hint */}
            <motion.div variants={fadeUp} className="text-center pb-4">
                <p className="text-xs text-gray-400">✓ Changes are saved automatically.</p>
            </motion.div>
        </motion.div>
    )
}
