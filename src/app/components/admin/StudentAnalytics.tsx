'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Filter, ChevronDown } from 'lucide-react'

/* ─── MOCK DATA ─── */

const stackedData = [
    { range: '0-4', Normal: 320, Mild: 15, Moderate: 5, Severe: 2 },
    { range: '5-9', Normal: 40, Mild: 245, Moderate: 30, Severe: 8 },
    { range: '10-14', Normal: 10, Mild: 50, Moderate: 180, Severe: 25 },
    { range: '15-19', Normal: 5, Mild: 15, Moderate: 60, Severe: 110 },
    { range: '20-27', Normal: 2, Mild: 5, Moderate: 15, Severe: 45 },
]

const stressorData = [
    { name: 'Placement Pressure', value: 78, color: '#EF4444' },
    { name: 'Academic Backlogs', value: 65, color: '#F59E0B' },
    { name: 'Peer Pressure', value: 52, color: '#8B8AFF' },
    { name: 'Family Expectations', value: 48, color: '#7170D4' },
    { name: 'Financial Stress', value: 42, color: '#A8A8F0' },
    { name: 'Relationship Issues', value: 35, color: '#C4C4FF' },
    { name: 'Sleep Deprivation', value: 58, color: '#F97316' },
    { name: 'Social Media Anxiety', value: 40, color: '#EC4899' },
]

const COLORS = {
    Normal: '#22C55E',
    Mild: '#F59E0B',
    Moderate: '#F97316',
    Severe: '#EF4444',
}

/* ─── TOOLTIPS ─── */

const GlassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-purple-100 text-sm">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} className="font-semibold" style={{ color: p.color || p.fill }}>
                        {p.name}: {p.value}
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
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

/* ─── DROPDOWN ─── */

function Dropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 backdrop-blur-xl border border-purple-100/50 text-sm text-gray-600 hover:border-purple-200 transition-all duration-200 shadow-sm"
            >
                <span className="text-xs text-gray-400">{label}:</span>
                <span className="font-medium">{value}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-xl border border-purple-50 p-1 z-40 min-w-[140px]"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false) }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${value === opt ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    )
}

/* ─── MAIN COMPONENT ─── */

export default function StudentAnalytics() {
    const [semester, setSemester] = useState('All Semesters')
    const [dateRange, setDateRange] = useState('Last 30 Days')
    const [assessmentType, setAssessmentType] = useState('PHQ-9')

    const sortedStressors = [...stressorData].sort((a, b) => b.value - a.value)

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-4">
            {/* Header */}
            <motion.div variants={fadeUp} className="mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Student{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Analytics
                    </span>{' '}
                    📊
                </h1>
                <p className="text-gray-500 text-sm mt-1">Deep-dive into anonymized clinical data across the student body</p>
            </motion.div>

            {/* Filters */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filters:</span>
                </div>
                <Dropdown label="Semester" options={['All Semesters', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']} value={semester} onChange={setSemester} />
                <Dropdown label="Date Range" options={['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year']} value={dateRange} onChange={setDateRange} />
                <Dropdown label="Assessment" options={['PHQ-9', 'GAD-7', 'DASS-21', 'PSS-10']} value={assessmentType} onChange={setAssessmentType} />
            </motion.div>

            {/* Stats Overview */}
            <motion.div variants={fadeUp}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Screenings', value: '2,847', change: '+12%', color: 'text-emerald-500', bg: 'from-emerald-50 to-green-50' },
                        { label: 'Avg Score', value: '8.4', change: '-3%', color: 'text-amber-500', bg: 'from-amber-50 to-orange-50' },
                        { label: 'At-Risk Students', value: '156', change: '+5%', color: 'text-red-500', bg: 'from-red-50 to-pink-50' },
                        { label: 'Improvement Rate', value: '67%', change: '+8%', color: 'text-purple-500', bg: 'from-purple-50 to-indigo-50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bg} border border-gray-100/50`}>
                            <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            <p className={`text-xs font-semibold ${stat.color} mt-0.5`}>{stat.change} from last month</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Stacked Histogram */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Screening Score Distribution</p>
                            <p className="text-xs text-gray-400 mt-0.5">{assessmentType} scores segmented by severity</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {Object.entries(COLORS).map(([key, color]) => (
                                <div key={key} className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-[11px] text-gray-500">{key}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stackedData} barCategoryGap="25%">
                            <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                            <Tooltip content={<GlassTooltip />} />
                            <Bar dataKey="Normal" stackId="a" fill={COLORS.Normal} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Mild" stackId="a" fill={COLORS.Mild} />
                            <Bar dataKey="Moderate" stackId="a" fill={COLORS.Moderate} />
                            <Bar dataKey="Severe" stackId="a" fill={COLORS.Severe} radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Top Stressors */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <p className="text-sm font-semibold text-gray-500 mb-5">Top Stressors (Self-Reported)</p>
                    <div className="space-y-3">
                        {sortedStressors.map((stressor, i) => (
                            <div key={stressor.name} className="flex items-center gap-3">
                                <span className="text-xs text-gray-400 w-4 font-bold">{i + 1}</span>
                                <span className="text-sm text-gray-700 font-medium w-44 flex-shrink-0">{stressor.name}</span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stressor.value}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' as const }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: stressor.color }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-600 w-10 text-right">{stressor.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
