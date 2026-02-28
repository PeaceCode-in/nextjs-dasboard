'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    AreaChart, Area,
    LineChart, Line, Legend,
} from 'recharts'
import {
    TrendingUp, Users, AlertTriangle, Server, Zap, Clock, TreePine,
} from 'lucide-react'

/* ─── MOCK DATA ─── */

const moodTrendData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    mood: 55 + Math.sin(i * 0.3) * 15 + Math.random() * 10,
}))

const branchEngagement = [
    { branch: 'CS', users: 187, fill: '#8B8AFF' },
    { branch: 'IT', users: 143, fill: '#A8A8F0' },
    { branch: 'ECE', users: 112, fill: '#B8B8FF' },
    { branch: 'ME', users: 89, fill: '#C4C4FF' },
    { branch: 'CE', users: 67, fill: '#D0D0FF' },
]

const heatmapData: number[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 10))
)
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const toolAdoptionData = [
    { name: 'Breathe', value: 320, color: '#8B8AFF' },
    { name: 'Focus', value: 280, color: '#7170D4' },
    { name: 'Gratitude', value: 210, color: '#A8A8F0' },
    { name: 'Journal', value: 180, color: '#C4C4FF' },
    { name: 'Community', value: 150, color: '#DCDCFF' },
]

const examStressData = [
    { week: 'W1', stress: 28, exams: 0 },
    { week: 'W2', stress: 32, exams: 0 },
    { week: 'W3', stress: 35, exams: 1 },
    { week: 'W4', stress: 48, exams: 0 },
    { week: 'W5', stress: 42, exams: 2 },
    { week: 'W6', stress: 55, exams: 0 },
    { week: 'W7', stress: 68, exams: 3 },
    { week: 'W8', stress: 82, exams: 5 },
    { week: 'Finals', stress: 95, exams: 8 },
]

const counselors = [
    { name: 'Dr. Priya Sharma', booked: 85, total: 20, speciality: 'CBT & Anxiety' },
    { name: 'Dr. Rajesh Kumar', booked: 60, total: 18, speciality: 'Depression & Trauma' },
    { name: 'Ms. Anita Das', booked: 45, total: 15, speciality: 'Career Counseling' },
    { name: 'Dr. Sanjay Gupta', booked: 70, total: 22, speciality: 'Substance Abuse' },
]

const recentAlerts = [
    { id: 1, title: 'High anxiety detected in 3rd-year CS batch', severity: 'critical', time: '2h ago' },
    { id: 2, title: 'Spike in stress levels during mid-sem week', severity: 'warning', time: '5h ago' },
    { id: 3, title: 'Low engagement in ME department', severity: 'info', time: '12h ago' },
    { id: 4, title: 'Community post flagged for harmful content', severity: 'critical', time: '1d ago' },
]

/* ─── CUSTOM TOOLTIPS ─── */

const GlassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-purple-100 text-sm">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} className="font-semibold" style={{ color: p.color || '#8B8AFF' }}>
                        {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

/* ─── GAUGE CHART ─── */

function GaugeChart({ value, max = 100 }: { value: number; max?: number }) {
    const percentage = (value / max) * 100
    const angle = (percentage / 100) * 180
    const getColor = (pct: number) => {
        if (pct <= 33) return '#22C55E'
        if (pct <= 66) return '#F59E0B'
        return '#EF4444'
    }
    const getRiskLabel = (pct: number) => {
        if (pct <= 33) return 'Low'
        if (pct <= 66) return 'Medium'
        return 'High'
    }

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 200 120" className="w-full max-w-[200px]">
                {/* Background arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#F0F0FF"
                    strokeWidth="16"
                    strokeLinecap="round"
                />
                {/* Green zone */}
                <path
                    d="M 20 100 A 80 80 0 0 1 73 30"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="16"
                    strokeLinecap="round"
                    opacity="0.3"
                />
                {/* Yellow zone */}
                <path
                    d="M 73 30 A 80 80 0 0 1 127 30"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="16"
                    opacity="0.3"
                />
                {/* Red zone */}
                <path
                    d="M 127 30 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="16"
                    strokeLinecap="round"
                    opacity="0.3"
                />
                {/* Needle */}
                <motion.line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="30"
                    stroke={getColor(percentage)}
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: angle - 90 }}
                    transition={{ duration: 1.5, ease: 'easeOut' as const }}
                    style={{ transformOrigin: '100px 100px' }}
                />
                <circle cx="100" cy="100" r="6" fill={getColor(percentage)} />
                {/* Labels */}
                <text x="20" y="115" fontSize="10" fill="#9CA3AF" textAnchor="start">Low</text>
                <text x="100" y="18" fontSize="10" fill="#9CA3AF" textAnchor="middle">Medium</text>
                <text x="180" y="115" fontSize="10" fill="#9CA3AF" textAnchor="end">High</text>
            </svg>
            <p className="text-lg font-bold mt-1" style={{ color: getColor(percentage) }}>
                {getRiskLabel(percentage)}
            </p>
            <p className="text-xs text-gray-400">Overall Risk</p>
        </div>
    )
}

/* ─── GRATITUDE TREE ─── */

function GratitudeTree() {
    return (
        <div className="relative flex flex-col items-center justify-center h-full min-h-[220px]">
            {/* Glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
                    className="w-40 h-40 rounded-full bg-emerald-300/30 blur-3xl"
                />
            </div>
            {/* Tree */}
            <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
                className="text-7xl select-none z-10 drop-shadow-lg"
            >
                🌳
            </motion.div>
            <div className="z-10 text-center mt-3">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Gratitude Logs</p>
                <motion.p
                    className="text-3xl font-black text-emerald-700 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    4,823
                </motion.p>
                <p className="text-[11px] text-gray-400 mt-0.5">Seeds planted across campus</p>
            </div>
            {/* Floating leaves */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-lg select-none"
                    style={{ top: `${15 + i * 12}%`, left: `${20 + i * 13}%` }}
                    animate={{ y: [0, -10, 0], rotate: [0, 15, -10, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.6 }}
                >
                    🍃
                </motion.div>
            ))}
        </div>
    )
}

/* ─── ANIMATION VARIANTS ─── */

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

/* ─── MAIN COMPONENT ─── */

interface AdminDashboardProps {
    onNavigate?: (page: string) => void
}

export default function AdminDashboard({ onNavigate: _onNavigate }: AdminDashboardProps) {
    const [riskValue] = useState(52)
    const [hoveredHeatmap, setHoveredHeatmap] = useState<{ row: number; col: number } | null>(null)
    const [donutAnimated, setDonutAnimated] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setDonutAnimated(true), 600)
        return () => clearTimeout(t)
    }, [])

    const heatColor = (v: number) => {
        if (v <= 1) return 'bg-purple-50'
        if (v <= 3) return 'bg-purple-100'
        if (v <= 5) return 'bg-purple-300'
        if (v <= 7) return 'bg-purple-400'
        return 'bg-purple-600'
    }

    const severityColor = (s: string) => {
        if (s === 'critical') return 'text-red-500 bg-red-50'
        if (s === 'warning') return 'text-amber-500 bg-amber-50'
        return 'text-blue-500 bg-blue-50'
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-4">
            {/* Greeting */}
            <motion.div variants={fadeUp} className="mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Campus Wellness{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Control Center
                    </span>{' '}
                    🏫
                </h1>
                <p className="text-gray-500 text-sm mt-1">Aggregate, anonymized insights for your campus</p>
            </motion.div>

            {/* ===== ROW 1 ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* Campus Wellness Overview — Area Chart */}
                <motion.div variants={fadeUp} className="xl:col-span-8">
                    <div className="h-80 rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-500" />
                                <p className="text-sm font-semibold text-gray-500">Campus Wellness Overview</p>
                            </div>
                            <span className="text-[11px] px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-semibold">
                                Last 30 Days
                            </span>
                        </div>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={moodTrendData}>
                                <defs>
                                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B8AFF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B8AFF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={4} />
                                <YAxis domain={[30, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <Tooltip content={<GlassTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="#8B8AFF"
                                    fill="url(#moodGrad)"
                                    strokeWidth={2.5}
                                    name="Avg Mood"
                                    dot={false}
                                    activeDot={{ fill: '#8B8AFF', stroke: '#E6E6FA', strokeWidth: 3, r: 5 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Branch-wise Engagement — Bar Chart */}
                <motion.div variants={fadeUp} className="xl:col-span-4">
                    <div className="h-80 rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-500" />
                                <p className="text-sm font-semibold text-gray-500">Branch-wise Engagement</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={branchEngagement} barCategoryGap="20%">
                                <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <Tooltip content={<GlassTooltip />} cursor={false} />
                                <Bar dataKey="users" radius={[8, 8, 3, 3]} animationDuration={1200} name="Active Users">
                                    {branchEngagement.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* ===== ROW 2 ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
                {/* Community Pulse — Heatmap */}
                <motion.div variants={fadeUp} className="xl:col-span-4">
                    <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                        <p className="text-sm font-semibold text-gray-500 mb-4">Community Pulse</p>
                        <div className="space-y-1">
                            {heatmapData.map((row, rowIdx) => (
                                <div key={rowIdx} className="flex items-center gap-1">
                                    <span className="text-[10px] text-gray-400 w-7 text-right font-medium">{daysOfWeek[rowIdx]}</span>
                                    {row.map((val, colIdx) => (
                                        <div key={colIdx} className="relative">
                                            <div
                                                className={`w-7 h-7 rounded-[4px] cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-purple-400 hover:ring-offset-1 ${heatColor(val)}`}
                                                onMouseEnter={() => setHoveredHeatmap({ row: rowIdx, col: colIdx })}
                                                onMouseLeave={() => setHoveredHeatmap(null)}
                                            />
                                            {hoveredHeatmap?.row === rowIdx && hoveredHeatmap?.col === colIdx && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-gray-800 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none font-medium">
                                                    {daysOfWeek[rowIdx]}: {val} interactions
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Wellness Tool Adoption — Donut Chart */}
                <motion.div variants={fadeUp} className="xl:col-span-4">
                    <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                        <p className="text-sm font-semibold text-gray-500 mb-4">Wellness Tool Adoption</p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="relative w-[140px] h-[140px]">
                                <PieChart width={140} height={140}>
                                    <Pie
                                        data={donutAnimated ? toolAdoptionData : [{ name: 'Empty', value: 100, color: '#EDEDFF' }]}
                                        cx={70}
                                        cy={70}
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={3}
                                        dataKey="value"
                                        animationBegin={0}
                                        animationDuration={1200}
                                        strokeWidth={0}
                                    >
                                        {(donutAnimated ? toolAdoptionData : [{ name: 'Empty', value: 100, color: '#EDEDFF' }]).map((entry, idx) => (
                                            <Cell key={idx} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<GlassTooltip />} />
                                </PieChart>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-extrabold text-purple-700">1,140</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                {toolAdoptionData.map((t) => (
                                    <div key={t.name} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                                        <span className="text-xs text-gray-500">{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Anonymized Screening Summary — Gauge */}
                <motion.div variants={fadeUp} className="xl:col-span-4">
                    <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                        <p className="text-sm font-semibold text-gray-500 mb-2">Anonymized Screening Summary</p>
                        <GaugeChart value={riskValue} />
                        <div className="flex justify-center gap-4 mt-3">
                            <div className="text-center">
                                <p className="text-xs text-gray-400">PHQ-9 Avg</p>
                                <p className="text-sm font-bold text-amber-500">8.4</p>
                            </div>
                            <div className="w-px bg-gray-200" />
                            <div className="text-center">
                                <p className="text-xs text-gray-400">GAD-7 Avg</p>
                                <p className="text-sm font-bold text-amber-500">7.2</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ===== ROW 3 ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
                {/* Gratitude Tree Growth */}
                <motion.div variants={fadeUp} className="xl:col-span-4">
                    <div className="rounded-3xl bg-gradient-to-br from-emerald-50/80 to-green-50/60 backdrop-blur-xl border border-emerald-100/50 shadow-lg shadow-emerald-50/40 p-6 hover:shadow-xl transition-all duration-300">
                        <p className="text-sm font-semibold text-emerald-700 mb-1">Gratitude Tree Growth</p>
                        <GratitudeTree />
                    </div>
                </motion.div>

                {/* System Health & Reports */}
                <motion.div variants={fadeUp} className="xl:col-span-4">
                    <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                        <p className="text-sm font-semibold text-gray-500 mb-4">System Health & Reports</p>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Server Uptime', value: '99.9%', icon: Server, color: 'text-emerald-500 bg-emerald-50' },
                                { label: 'API Latency', value: '142ms', icon: Zap, color: 'text-amber-500 bg-amber-50' },
                                { label: 'Active Sessions', value: '347', icon: Users, color: 'text-purple-500 bg-purple-50' },
                                { label: 'Avg Response', value: '1.2s', icon: Clock, color: 'text-blue-500 bg-blue-50' },
                            ].map((metric) => {
                                const Icon = metric.icon
                                return (
                                    <div key={metric.label} className="p-3 rounded-2xl bg-gray-50/60 border border-gray-100/50">
                                        <div className={`w-8 h-8 rounded-xl ${metric.color} flex items-center justify-center mb-2`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <p className="text-lg font-bold text-gray-800">{metric.value}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{metric.label}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Recent Alerts Table */}
                <motion.div variants={fadeUp} className="xl:col-span-4">
                    <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-semibold text-gray-500">Recent Alerts</p>
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="space-y-2">
                            {recentAlerts.map((alert) => (
                                <motion.div
                                    key={alert.id}
                                    whileHover={{ x: 4 }}
                                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-purple-50/60 transition-all duration-200 cursor-pointer"
                                >
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${severityColor(alert.severity)} flex-shrink-0 mt-0.5`}>
                                        {alert.severity}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-700 leading-snug">{alert.title}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{alert.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ===== ROW 4 (Scrollable Additions) ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 pb-6">
                {/* Exam Season Stress Correlation */}
                <motion.div variants={fadeUp} className="xl:col-span-7">
                    <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-4">
                            <TreePine className="w-4 h-4 text-red-400" />
                            <p className="text-sm font-semibold text-gray-500">Exam Season Stress Correlation</p>
                            <span className="ml-auto text-[10px] px-2.5 py-0.5 rounded-full bg-red-50 text-red-500 font-semibold">
                                ⚠ Finals approaching
                            </span>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={examStressData}>
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={[0, 100]} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={[0, 10]} />
                                <Tooltip content={<GlassTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: '11px' }}
                                    iconType="circle"
                                    iconSize={8}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="stress"
                                    stroke="#EF4444"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#EF4444', strokeWidth: 0, r: 3 }}
                                    activeDot={{ fill: '#EF4444', stroke: '#FEE2E2', strokeWidth: 3, r: 6 }}
                                    name="Stress Level %"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="exams"
                                    stroke="#8B8AFF"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ fill: '#8B8AFF', strokeWidth: 0, r: 3 }}
                                    name="Upcoming Exams"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Counselor Workload Capacity */}
                <motion.div variants={fadeUp} className="xl:col-span-5">
                    <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                        <p className="text-sm font-semibold text-gray-500 mb-4">Counselor Workload Capacity</p>
                        <div className="space-y-4">
                            {counselors.map((c, i) => {
                                const barColor = c.booked >= 80 ? 'from-red-400 to-red-500' : c.booked >= 60 ? 'from-amber-400 to-amber-500' : 'from-emerald-400 to-emerald-500'
                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700">{c.name}</p>
                                                <p className="text-[10px] text-gray-400">{c.speciality}</p>
                                            </div>
                                            <span className={`text-xs font-bold ${c.booked >= 80 ? 'text-red-500' : c.booked >= 60 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                {c.booked}%
                                            </span>
                                        </div>
                                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${c.booked}%` }}
                                                transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: 'easeOut' as const }}
                                                className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
