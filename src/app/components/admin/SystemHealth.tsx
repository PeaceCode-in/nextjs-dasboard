'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Cpu, Database, Wifi, Activity, Server, AlertCircle } from 'lucide-react'

/* ─── LIVE DATA GENERATION ─── */

interface DataPoint {
    time: string
    value: number
}

function generateInitial(base: number, variance: number, count: number): DataPoint[] {
    return Array.from({ length: count }, (_, i) => ({
        time: `${i}s`,
        value: base + (Math.random() - 0.5) * variance,
    }))
}

/* ─── TOOLTIP ─── */

const GlassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-purple-100 text-sm">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} className="font-semibold" style={{ color: p.color }}>
                        {p.name}: {p.value.toFixed(1)}
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

/* ─── LIVE CHART COMPONENT ─── */

function LiveChart({
    title,
    icon: Icon,
    color,
    unit,
    baseValue,
    variance,
    warningThreshold,
}: {
    title: string
    icon: React.ElementType
    color: string
    unit: string
    baseValue: number
    variance: number
    warningThreshold: number
}) {
    const [data, setData] = useState<DataPoint[]>(generateInitial(baseValue, variance, 30))
    const tickRef = useRef(30)

    useEffect(() => {
        const interval = setInterval(() => {
            tickRef.current++
            setData(prev => {
                const last = prev[prev.length - 1].value
                const newVal = Math.max(0, Math.min(100, last + (Math.random() - 0.48) * variance * 0.4))
                const newPoint = { time: `${tickRef.current}s`, value: newVal }
                return [...prev.slice(1), newPoint]
            })
        }, 1500)
        return () => clearInterval(interval)
    }, [baseValue, variance])

    const currentValue = data[data.length - 1]?.value || baseValue
    const isWarning = currentValue >= warningThreshold

    return (
        <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isWarning ? 'bg-red-50' : 'bg-purple-50'}`}>
                        <Icon className={`w-4 h-4 ${isWarning ? 'text-red-500' : 'text-purple-500'}`} />
                    </div>
                    <p className="text-sm font-semibold text-gray-500">{title}</p>
                </div>
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-2 h-2 rounded-full ${isWarning ? 'bg-red-500' : 'bg-emerald-500'}`}
                    />
                    <span className={`text-lg font-bold ${isWarning ? 'text-red-500' : 'text-gray-800'}`}>
                        {currentValue.toFixed(1)}{unit}
                    </span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip content={<GlassTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isWarning ? '#EF4444' : color}
                        strokeWidth={2}
                        dot={false}
                        name={title}
                        animationDuration={0}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

/* ─── MAIN COMPONENT ─── */

export default function SystemHealth() {
    const [uptime] = useState('99.97%')
    const [lastIncident] = useState('12 days ago')

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-4">
            {/* Header */}
            <motion.div variants={fadeUp} className="mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    System{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Health
                    </span>{' '}
                    🖥️
                </h1>
                <p className="text-gray-500 text-sm mt-1">Real-time infrastructure monitoring</p>
            </motion.div>

            {/* Status Overview */}
            <motion.div variants={fadeUp}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Platform Status', value: 'Operational', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { label: 'Uptime (30d)', value: uptime, icon: Server, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'Last Incident', value: lastIncident, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Active WebSockets', value: '1,247', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-50' },
                    ].map((item) => {
                        const Icon = item.icon
                        return (
                            <div key={item.label} className="rounded-2xl glass-card shadow-md p-4 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
                                    <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </motion.div>

            {/* Live Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <motion.div variants={fadeUp}>
                    <LiveChart
                        title="CPU Usage"
                        icon={Cpu}
                        color="#8B8AFF"
                        unit="%"
                        baseValue={45}
                        variance={20}
                        warningThreshold={80}
                    />
                </motion.div>
                <motion.div variants={fadeUp}>
                    <LiveChart
                        title="Database Load"
                        icon={Database}
                        color="#F59E0B"
                        unit="%"
                        baseValue={35}
                        variance={15}
                        warningThreshold={75}
                    />
                </motion.div>
                <motion.div variants={fadeUp}>
                    <LiveChart
                        title="WebSocket Connections"
                        icon={Wifi}
                        color="#22C55E"
                        unit=""
                        baseValue={60}
                        variance={25}
                        warningThreshold={85}
                    />
                </motion.div>
            </div>

            {/* Service Status */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <p className="text-sm font-semibold text-gray-500 mb-4">Service Status</p>
                    <div className="space-y-3">
                        {[
                            { name: 'Peace Bot (AI Chat)', status: 'Operational', latency: '120ms', uptime: '99.99%' },
                            { name: 'User Authentication', status: 'Operational', latency: '45ms', uptime: '99.99%' },
                            { name: 'Assessment Engine', status: 'Operational', latency: '200ms', uptime: '99.95%' },
                            { name: 'Community Forum', status: 'Operational', latency: '85ms', uptime: '99.97%' },
                            { name: 'Push Notifications', status: 'Degraded', latency: '450ms', uptime: '98.50%' },
                            { name: 'Video Counseling', status: 'Operational', latency: '180ms', uptime: '99.90%' },
                        ].map((service) => (
                            <div key={service.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50/40 transition-colors">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${service.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                />
                                <span className="text-sm text-gray-700 font-medium flex-1">{service.name}</span>
                                <span className={`text-xs font-semibold ${service.status === 'Operational' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {service.status}
                                </span>
                                <span className="text-xs text-gray-400 w-16 text-right">{service.latency}</span>
                                <span className="text-xs text-gray-400 w-16 text-right">{service.uptime}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
