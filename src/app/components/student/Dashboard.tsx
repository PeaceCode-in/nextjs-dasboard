'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'
import {
  Flame, ChevronRight, CheckCircle2, Circle,
  AlertTriangle, Moon, Brain, Zap, Heart, Shield, Headphones, Sparkles, Search,
  TrendingUp, Calendar, Clock, ArrowUpRight, Plus, Filter, MoreHorizontal
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

/* ─── MOCK DATA ─── */
const moodData = [
  { day: 'M', score: 7 }, { day: 'T', score: 5 }, { day: 'W', score: 8 },
  { day: 'T', score: 6 }, { day: 'F', score: 4 }, { day: 'S', score: 9 }, { day: 'S', score: 7 },
]

const activityData = [
  { name: 'Meditation', value: 45, color: '#A855F7' },
  { name: 'Focus', value: 30, color: '#6366F1' },
  { name: 'Rest', value: 25, color: '#EC4899' },
]

const upcomingSessions = [
  { title: 'Dr. Arshi - CBT Session', time: '10:30 AM', date: 'Today', type: 'Clinical' },
  { title: 'Mindfulness Workshop', time: '02:00 PM', date: 'Tomorrow', type: 'Group' },
]

/* ─── COMPONENTS ─── */

const GlassCard = ({ children, className, title, subtitle, action }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "relative group rounded-[2.5rem] bg-white/[0.03] border border-white/[0.08] p-8 overflow-hidden hover:bg-white/[0.05] transition-all duration-500",
      className
    )}
  >
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="text-white font-bold text-lg tracking-tight">{title}</h3>
        {subtitle && <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">{subtitle}</p>}
      </div>
      {action && action}
    </div>
    {children}
  </motion.div>
)

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 flex flex-col justify-between group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-2xl bg-white/5 text-gray-400 group-hover:text-white transition-colors", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</span>
    </div>
    <div>
      <h4 className="text-3xl font-bold text-white tracking-tighter">{value}</h4>
      <p className="text-xs text-gray-500 mt-1 font-medium">{sub}</p>
    </div>
  </motion.div>
)

export default function Dashboard({ userName }: { userName?: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 pb-20">

      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">
              Live Overview
            </span>
            <span className="text-gray-500 text-xs font-medium">• March 14, 2026</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">{userName || 'Jai'}</span>
          </h1>
          <p className="text-gray-400 text-lg mt-3 font-medium">Your cognitive resilience is at 84% today. Keep it up.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-sm font-bold shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4 text-white" /> New Log
          </button>
        </div>
      </header>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Mindfulness" value="128" sub="Total minutes this week" icon={Brain} color="group-hover:text-purple-400" />
        <StatCard title="Streak" value="24" sub="Current daily streak" icon={Flame} color="group-hover:text-orange-400" />
        <StatCard title="Recovery" value="92%" sub="Sleep quality index" icon={Moon} color="group-hover:text-blue-400" />
        <StatCard title="Karma" value="1.2k" sub="Community contributions" icon={Heart} color="group-hover:text-pink-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Mood Analysis - 8 cols */}
        <GlassCard
          title="Mood Analytics"
          subtitle="Fluctuation analysis"
          className="lg:col-span-8"
          action={
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" /> +12% from last week
            </div>
          }
        >
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#A855F7' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#A855F7"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorMood)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Activity Distribution - 4 cols */}
        <GlassCard
          title="Distribution"
          subtitle="Wellness split"
          className="lg:col-span-4"
        >
          <div className="h-[240px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-white tracking-tighter">Healthy</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase">Status</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-6">
            {activityData.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <div className="w-1 h-1 rounded-full mb-2" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-400 font-bold uppercase">{item.name}</span>
                <span className="text-white text-xs font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming Sessions - 5 cols */}
        <GlassCard
          title="Upcoming"
          subtitle="Schedule"
          className="lg:col-span-5"
          action={<button className="text-gray-500 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>}
        >
          <div className="space-y-4">
            {upcomingSessions.map((session, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group/item">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm">{session.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold"><Clock className="w-3 h-3" /> {session.time}</span>
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{session.type}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover/item:text-white transition-all transform group-hover/item:translate-x-1 group-hover/item:-translate-y-1" />
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 rounded-2xl bg-white/5 text-gray-400 text-xs font-bold hover:bg-white/10 transition-all">
            View All Schedule
          </button>
        </GlassCard>

        {/* Quick Insights - 7 cols */}
        <GlassCard
          title="Quick Insights"
          subtitle="AI-Powered"
          className="lg:col-span-7 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all group">
              <Zap className="w-6 h-6 text-yellow-400 mb-4" />
              <h5 className="text-white font-bold mb-2">Cognitive Load</h5>
              <p className="text-gray-500 text-sm leading-relaxed">Your brain waves show high focus in the mornings. Plan complex tasks then.</p>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
              <Sparkles className="w-6 h-6 text-indigo-400 mb-4" />
              <h5 className="text-white font-bold mb-2">Sleep Hygiene</h5>
              <p className="text-gray-500 text-sm leading-relaxed">Reducing screen time by 30 mins increased your REM sleep by 12% last night.</p>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  )
}
