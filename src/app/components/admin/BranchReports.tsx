'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, Legend,
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react'

/* ─── MOCK DATA ─── */

const branchMetrics: Record<string, { sleep: number; focus: number; community: number; mood: number; risk: number }> = {
    'CS': { sleep: 65, focus: 82, community: 90, mood: 72, risk: 55 },
    'IT': { sleep: 72, focus: 75, community: 78, mood: 68, risk: 48 },
    'ECE': { sleep: 58, focus: 70, community: 60, mood: 62, risk: 62 },
    'ME': { sleep: 70, focus: 60, community: 55, mood: 75, risk: 40 },
    'CE': { sleep: 75, focus: 55, community: 50, mood: 78, risk: 35 },
    'EE': { sleep: 62, focus: 68, community: 65, mood: 66, risk: 52 },
}

const allBranches = Object.keys(branchMetrics)

const branchColors: Record<string, string> = {
    CS: '#8B8AFF',
    IT: '#F59E0B',
    ECE: '#EF4444',
    ME: '#22C55E',
    CE: '#EC4899',
    EE: '#06B6D4',
}

const tableData = [
    { branch: 'Computer Science', code: 'CS', users: 187, change: +12, tool: 'Focus Timer' },
    { branch: 'Information Tech', code: 'IT', users: 143, change: +8, tool: 'Journal' },
    { branch: 'Electronics & Comm', code: 'ECE', users: 112, change: -3, tool: 'Breathe' },
    { branch: 'Mechanical Eng', code: 'ME', users: 89, change: +5, tool: 'Community' },
    { branch: 'Civil Engineering', code: 'CE', users: 67, change: -1, tool: 'Gratitude' },
    { branch: 'Electrical Eng', code: 'EE', users: 78, change: +2, tool: 'Mood Tracker' },
]

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

export default function BranchReports() {
    const [selected, setSelected] = useState<string[]>(['CS', 'IT', 'ECE'])
    const [sortField, setSortField] = useState<'users' | 'change'>('users')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

    const radarData = [
        { metric: 'Sleep Quality', ...Object.fromEntries(selected.map(b => [b, branchMetrics[b]?.sleep || 0])) },
        { metric: 'Focus Hours', ...Object.fromEntries(selected.map(b => [b, branchMetrics[b]?.focus || 0])) },
        { metric: 'Community Posts', ...Object.fromEntries(selected.map(b => [b, branchMetrics[b]?.community || 0])) },
        { metric: 'Mood Stability', ...Object.fromEntries(selected.map(b => [b, branchMetrics[b]?.mood || 0])) },
        { metric: 'Screening Risk', ...Object.fromEntries(selected.map(b => [b, branchMetrics[b]?.risk || 0])) },
    ]

    const toggleBranch = (code: string) => {
        setSelected(prev => {
            if (prev.includes(code)) {
                if (prev.length <= 1) return prev
                return prev.filter(b => b !== code)
            }
            if (prev.length >= 3) return [...prev.slice(1), code]
            return [...prev, code]
        })
    }

    const sortedTable = [...tableData].sort((a, b) => {
        const mul = sortDir === 'desc' ? -1 : 1
        return (a[sortField] - b[sortField]) * mul
    })

    const handleSort = (field: 'users' | 'change') => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDir('desc')
        }
    }

    const SortIcon = ({ field }: { field: 'users' | 'change' }) => {
        if (sortField !== field) return <ChevronDown className="w-3 h-3 text-gray-300" />
        return sortDir === 'desc' ? <ChevronDown className="w-3 h-3 text-purple-500" /> : <ChevronUp className="w-3 h-3 text-purple-500" />
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-4">
            {/* Header */}
            <motion.div variants={fadeUp} className="mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Branch{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Reports
                    </span>{' '}
                    🏛️
                </h1>
                <p className="text-gray-500 text-sm mt-1">Compare departments to allocate targeted wellness resources</p>
            </motion.div>

            {/* Branch Selector */}
            <motion.div variants={fadeUp}>
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-gray-400 font-medium mr-1">Compare (max 3):</span>
                    {allBranches.map(code => (
                        <button
                            key={code}
                            onClick={() => toggleBranch(code)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${selected.includes(code)
                                    ? 'text-white shadow-md'
                                    : 'bg-white/60 text-gray-500 border border-gray-200/60 hover:border-purple-200'
                                }`}
                            style={selected.includes(code) ? { backgroundColor: branchColors[code] } : {}}
                        >
                            {code}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Radar Chart */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <p className="text-sm font-semibold text-gray-500 mb-4">Multi-Metric Comparison</p>
                    <ResponsiveContainer width="100%" height={380}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#E6E6FA" />
                            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6B7280' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '14px',
                                    border: '1px solid #D0D0FF',
                                    boxShadow: '0 10px 30px rgba(139,138,255,0.15)',
                                    fontSize: '12px',
                                    backdropFilter: 'blur(10px)',
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" iconSize={8} />
                            {selected.map(code => (
                                <Radar
                                    key={code}
                                    name={code}
                                    dataKey={code}
                                    stroke={branchColors[code]}
                                    fill={branchColors[code]}
                                    fillOpacity={0.15}
                                    strokeWidth={2}
                                />
                            ))}
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Data Table */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 overflow-hidden">
                    <p className="text-sm font-semibold text-gray-500 mb-4">All Branches — Detailed Breakdown</p>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs text-gray-400 font-semibold pb-3 pr-4">Branch</th>
                                    <th
                                        className="text-left text-xs text-gray-400 font-semibold pb-3 pr-4 cursor-pointer hover:text-purple-500 transition-colors"
                                        onClick={() => handleSort('users')}
                                    >
                                        <span className="flex items-center gap-1">Active Users <SortIcon field="users" /></span>
                                    </th>
                                    <th
                                        className="text-left text-xs text-gray-400 font-semibold pb-3 pr-4 cursor-pointer hover:text-purple-500 transition-colors"
                                        onClick={() => handleSort('change')}
                                    >
                                        <span className="flex items-center gap-1">WoW Change <SortIcon field="change" /></span>
                                    </th>
                                    <th className="text-left text-xs text-gray-400 font-semibold pb-3">Primary Tool</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTable.map((row) => (
                                    <motion.tr
                                        key={row.code}
                                        layout
                                        className="border-b border-gray-50 hover:bg-purple-50/40 transition-colors"
                                    >
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                                    style={{ backgroundColor: branchColors[row.code] }}
                                                >
                                                    {row.code}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{row.branch}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="text-sm font-semibold text-gray-800">{row.users}</span>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className={`flex items-center gap-1 text-sm font-semibold ${row.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {row.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                                {row.change >= 0 ? '+' : ''}{row.change}%
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold">
                                                {row.tool}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
