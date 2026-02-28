'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Timer, Wind, Sprout, TrendingUp } from 'lucide-react'

/* ─── MOCK DATA ─── */

const totalMetrics = [
    { label: 'Total Focus Hours', value: '12,487', icon: Timer, color: 'from-purple-500 to-indigo-500', shadowColor: 'shadow-purple-200/50' },
    { label: 'Total Breaths Taken', value: '89,234', icon: Wind, color: 'from-blue-500 to-cyan-500', shadowColor: 'shadow-blue-200/50' },
    { label: 'Gratitude Seeds', value: '4,823', icon: Sprout, color: 'from-emerald-500 to-teal-500', shadowColor: 'shadow-emerald-200/50' },
]

// Generate 90 days of DAU data per tool
const generateDAU = () => {
    return Array.from({ length: 90 }, (_, i) => ({
        day: `Day ${i + 1}`,
        Breathe: 40 + Math.floor(Math.sin(i * 0.08) * 20 + Math.random() * 15),
        Focus: 55 + Math.floor(Math.cos(i * 0.06) * 18 + Math.random() * 12),
        Gratitude: 30 + Math.floor(Math.sin(i * 0.1) * 12 + Math.random() * 10),
        Journal: 25 + Math.floor(Math.cos(i * 0.07) * 10 + Math.random() * 8),
        Community: 60 + Math.floor(Math.sin(i * 0.05) * 25 + Math.random() * 15),
    }))
}

const dauData = generateDAU()

const toolColors: Record<string, string> = {
    Breathe: '#8B8AFF',
    Focus: '#F59E0B',
    Gratitude: '#22C55E',
    Journal: '#EC4899',
    Community: '#06B6D4',
}

const funnelSteps = [
    { label: 'Started Focus Session', value: 2840, pct: 100 },
    { label: 'Completed 5 min', value: 2350, pct: 82.7 },
    { label: 'Completed 10 min', value: 1820, pct: 64.1 },
    { label: 'Completed 15 min', value: 1340, pct: 47.2 },
    { label: 'Completed 20 min', value: 890, pct: 31.3 },
    { label: 'Full 25-min Pomodoro', value: 620, pct: 21.8 },
]

/* ─── TOOLTIP ─── */

const GlassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-purple-100 text-sm">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} className="font-semibold" style={{ color: p.color }}>
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

/* ─── MAIN COMPONENT ─── */

export default function ToolUsage() {
    const [activeTools, setActiveTools] = useState<string[]>(['Breathe', 'Focus', 'Community'])

    const toggleTool = (tool: string) => {
        setActiveTools(prev => {
            if (prev.includes(tool)) {
                if (prev.length <= 1) return prev
                return prev.filter(t => t !== tool)
            }
            return [...prev, tool]
        })
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-4">
            {/* Header */}
            <motion.div variants={fadeUp} className="mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Tool{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Usage
                    </span>{' '}
                    🛠️
                </h1>
                <p className="text-gray-500 text-sm mt-1">Track ROI and efficacy of platform features</p>
            </motion.div>

            {/* Metrics Row */}
            <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {totalMetrics.map((metric) => {
                        const Icon = metric.icon
                        return (
                            <div key={metric.label} className="rounded-2xl glass-card shadow-lg shadow-purple-50/50 p-5 hover:shadow-xl transition-all duration-300 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg ${metric.shadowColor} flex-shrink-0`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">{metric.label}</p>
                                    <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[11px] text-emerald-500 font-semibold">+14% this month</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </motion.div>

            {/* Tool Toggles */}
            <motion.div variants={fadeUp}>
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-gray-400 font-medium mr-1">Show tools:</span>
                    {Object.keys(toolColors).map(tool => (
                        <button
                            key={tool}
                            onClick={() => toggleTool(tool)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTools.includes(tool)
                                ? 'text-white shadow-md'
                                : 'bg-white/60 text-gray-400 border border-gray-200/60 hover:border-purple-200 line-through'
                                }`}
                            style={activeTools.includes(tool) ? { backgroundColor: toolColors[tool] } : {}}
                        >
                            {tool}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Multi-line DAU Chart */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <p className="text-sm font-semibold text-gray-500 mb-4">Daily Active Users (Last 90 Days)</p>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={dauData}>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={14} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                            <Tooltip content={<GlassTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={8} />
                            {activeTools.map(tool => (
                                <Line
                                    key={tool}
                                    type="monotone"
                                    dataKey={tool}
                                    stroke={toolColors[tool]}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ fill: toolColors[tool], stroke: '#fff', strokeWidth: 2, r: 5 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Session Retention Funnel */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Session Retention Drop-off</p>
                    <p className="text-xs text-gray-400 mb-5">Focus Timer — Start to Full 25-min Pomodoro Completion</p>
                    <div className="space-y-3">
                        {funnelSteps.map((step, i) => {
                            const opacity = 1 - (i * 0.12)
                            return (
                                <div key={step.label} className="flex items-center gap-4">
                                    <span className="text-xs text-gray-500 font-medium w-44 flex-shrink-0">{step.label}</span>
                                    <div className="flex-1 h-8 bg-gray-50 rounded-xl overflow-hidden relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${step.pct}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' as const }}
                                            className="h-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-end pr-3"
                                            style={{ opacity }}
                                        >
                                            <span className="text-xs font-bold text-white">{step.value.toLocaleString()}</span>
                                        </motion.div>
                                    </div>
                                    <span className={`text-xs font-bold w-12 text-right ${step.pct >= 50 ? 'text-emerald-500' : step.pct >= 25 ? 'text-amber-500' : 'text-red-500'}`}>
                                        {step.pct}%
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    <p className="text-xs text-gray-400 mt-4">
                        💡 <span className="font-medium">Insight:</span> 21.8% of students complete a full Pomodoro. Consider adding encouragement notifications at the 15-min mark.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}
