'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Sparkles, BrainCircuit, Moon, Target,
  BookOpen, Users, Coffee, Smartphone, ChevronRight
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Abstract Mood Configurations (Zero Emojis)
const moodVariants = [
  { value: 1, label: 'Severely Anxious', color: 'from-rose-500 to-orange-600', shadow: 'shadow-rose-500/50', blob: '20% 80% 30% 70% / 60% 40% 80% 20%', animDur: 1.5, scale: [1, 1.15, 0.9, 1.1] },
  { value: 2, label: 'Drained / Low', color: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-400/50', blob: '40% 60% 50% 50% / 40% 50% 60% 50%', animDur: 4, scale: [1, 1.05, 0.95, 1] },
  { value: 3, label: 'Balanced / Neutral', color: 'from-slate-400 to-slate-500', shadow: 'shadow-slate-400/50', blob: '50% 50% 50% 50% / 50% 50% 50% 50%', animDur: 8, scale: [1, 1.02, 0.98, 1] },
  { value: 4, label: 'Calm / Focused', color: 'from-teal-400 to-emerald-500', shadow: 'shadow-teal-400/50', blob: '45% 55% 40% 60% / 55% 45% 60% 40%', animDur: 6, scale: [1, 1.08, 0.95, 1] },
  { value: 5, label: 'Highly Energized', color: 'from-indigo-500 to-purple-600', shadow: 'shadow-purple-500/50', blob: '30% 70% 70% 30% / 30% 30% 70% 70%', animDur: 3, scale: [1, 1.1, 0.95, 1.05] },
]

// Context Engine Triggers
const triggers = [
  { id: 'sleep', label: 'Sleep Quality', icon: Moon },
  { id: 'prep', label: 'Placement Prep', icon: Target },
  { id: 'academic', label: 'Coursework', icon: BookOpen },
  { id: 'social', label: 'Relationships', icon: Users },
  { id: 'diet', label: 'Diet / Hydration', icon: Coffee },
  { id: 'screen', label: 'Screen Time', icon: Smartphone },
]

// Mock Analytics Data for Area Chart
const analyticsData = [
  { day: 'Mon', mood: 2.5, sleep: 5, focus: 120 },
  { day: 'Tue', mood: 3.0, sleep: 6, focus: 180 },
  { day: 'Wed', mood: 2.0, sleep: 4, focus: 90 },
  { day: 'Thu', mood: 4.5, sleep: 8, focus: 240 },
  { day: 'Fri', mood: 4.0, sleep: 7, focus: 200 },
  { day: 'Sat', mood: 5.0, sleep: 9, focus: 60 },
  { day: 'Sun', mood: 4.5, sleep: 8, focus: 0 },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } } }

// Custom Chart Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-3">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-slate-600 font-medium w-16">{entry.name}</span>
            <span className="text-sm font-bold text-slate-800">{entry.value}{entry.name === 'Focus' ? 'm' : entry.name === 'Sleep' ? 'h' : ''}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function MoodTracker() {
  const [moodLevel, setMoodLevel] = useState(3)
  const [selectedTriggers, setSelectedTriggers] = useState<Set<string>>(new Set())
  const [secondaryMetric, setSecondaryMetric] = useState<'sleep' | 'focus'>('sleep')
  const [logged, setLogged] = useState(false)

  const activeMood = moodVariants.find(m => m.value === moodLevel)!

  const toggleTrigger = (id: string) => {
    setSelectedTriggers(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleLog = () => {
    setLogged(true)
    setTimeout(() => {
      setMoodLevel(3)
      setSelectedTriggers(new Set())
      setLogged(false)
    }, 2500)
  }

  return (
    <div className="relative w-full min-h-screen font-sans pb-32 overflow-hidden bg-[#FAFAFA]">

      {/* Ambient Abstract Background matching the mood */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 transition-all duration-1000 ease-in-out">
        <div className={`absolute inset-0 bg-gradient-to-br ${activeMood.color} opacity-10`} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const }}
          className={`absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full blur-[140px] bg-gradient-to-br ${activeMood.color}`}
        />
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-7xl mx-auto space-y-10 px-4 md:px-8 pt-10">

        {/* ── Header ── */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-sm flex items-center justify-center">
              <Activity className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-1">Emotional Core</h1>
              <p className="text-sm text-slate-500 font-light">Identify patterns between behavior and your internal state.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* ── Left Column: Data Input (Slider & Context) ── */}
          <div className="xl:col-span-4 space-y-6">

            {/* Abstract Fluid Input Card */}
            <motion.div variants={fadeUp} className="rounded-[2.5rem] bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.03)] p-8 relative overflow-hidden flex flex-col items-center">
              <AnimatePresence mode="wait">
                {logged ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-20 text-center w-full"
                  >
                    <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${activeMood.color} rounded-full flex items-center justify-center ${activeMood.shadow} shadow-2xl`}>
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-800 mb-2">State Logged</h3>
                    <p className="text-sm text-slate-500 font-light">Data synchronized with analytics engine.</p>
                  </motion.div>
                ) : (
                  <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">

                    <div className="mb-12 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Internal State Visualizer</p>

                      {/* Primary Organic Visualizer */}
                      <div className="relative w-48 h-48 mx-auto flex items-center justify-center group">
                        {/* Ambient Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${activeMood.color} blur-[40px] opacity-40 transition-colors duration-700`} />

                        {/* The Morphing Blob */}
                        <motion.div
                          className={`absolute w-full h-full bg-gradient-to-br ${activeMood.color} ${activeMood.shadow} shadow-xl transition-colors duration-700`}
                          animate={{
                            borderRadius: activeMood.blob.split(' / ').map(s => s.split(' ').sort(() => Math.random() - 0.5).join(' ')).join(' / '),
                            scale: activeMood.scale,
                            rotate: [0, 90, 180, 270, 360]
                          }}
                          transition={{ duration: activeMood.animDur, repeat: Infinity, ease: 'linear' }}
                          style={{ borderRadius: activeMood.blob }}
                        />
                        <div className="relative z-10 w-32 h-32 bg-white/20 backdrop-blur-md rounded-full shadow-inner border border-white/40 flex items-center justify-center">
                          <span className="text-white font-medium tracking-wide text-sm drop-shadow-md">
                            Level {moodLevel}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-2xl font-light text-slate-800 mt-8 mb-2 transition-colors">{activeMood.label}</h2>
                    </div>

                    {/* Premium Slider */}
                    <div className="mb-10 px-4">
                      <div className="relative w-full h-2 bg-slate-100 rounded-full">
                        <div
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${activeMood.color} rounded-full transition-all duration-300`}
                          style={{ width: `${((moodLevel - 1) / 4) * 100}%` }}
                        />
                        <input
                          type="range"
                          min="1" max="5" step="1"
                          value={moodLevel}
                          onChange={(e) => setMoodLevel(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>

                    {/* Context Engine */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit className="w-4 h-4 text-slate-400" />
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Context Engine</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {triggers.map(trigger => {
                          const Icon = trigger.icon
                          const isActive = selectedTriggers.has(trigger.id)
                          return (
                            <button
                              key={trigger.id}
                              onClick={() => toggleTrigger(trigger.id)}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm transition-all duration-300 ${isActive
                                ? 'bg-slate-800 border-slate-800 text-white shadow-md'
                                : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                                }`}
                            >
                              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                              <span className="font-medium text-xs">{trigger.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <button
                      onClick={handleLog}
                      className="w-full py-4 rounded-2xl bg-slate-800 text-white font-medium text-sm shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 group"
                    >
                      Encode State <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Right Column: Deep Analytics & Overlay Charts ── */}
          <div className="xl:col-span-8 space-y-6">

            {/* Massive Area Chart Container */}
            <motion.div variants={fadeUp} className="rounded-[2.5rem] bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.03)] p-8 md:p-10">

              {/* Chart Header Controls */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <h3 className="text-xl font-light text-slate-800 mb-2">Correlation Engine</h3>
                  <p className="text-sm text-slate-500 font-light">Visualizing the impact of behaviors on emotional baseline.</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-white/50 shadow-inner flex-wrap gap-1">
                  <button
                    onClick={() => setSecondaryMetric('sleep')}
                    className={`flex-1 min-w-[120px] px-3 sm:px-5 py-2 rounded-xl text-[10px] sm:text-xs font-semibold transition-all ${secondaryMetric === 'sleep' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    Overlay: Sleep
                  </button>
                  <button
                    onClick={() => setSecondaryMetric('focus')}
                    className={`flex-1 min-w-[120px] px-3 sm:px-5 py-2 rounded-xl text-[10px] sm:text-xs font-semibold transition-all ${secondaryMetric === 'focus' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    Overlay: Focus
                  </button>
                </div>
              </div>

              {/* Chart Area */}
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="secondGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={secondaryMetric === 'sleep' ? '#38bdf8' : '#34d399'} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={secondaryMetric === 'sleep' ? '#38bdf8' : '#34d399'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                    <YAxis yAxisId="left" domain={[0, 5]} hide />
                    <YAxis yAxisId="right" orientation="right" hide />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />

                    {/* Overlay Metric (Back) */}
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey={secondaryMetric}
                      name={secondaryMetric === 'sleep' ? 'Sleep' : 'Focus'}
                      stroke={secondaryMetric === 'sleep' ? '#38bdf8' : '#34d399'}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#secondGrad)"
                    />

                    {/* Primary Mood Metric (Front) */}
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="mood"
                      name="State"
                      stroke="#6366f1"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#moodGrad)"
                      activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* AI Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <motion.div variants={fadeUp} className="rounded-[2rem] bg-indigo-50/50 border border-indigo-100/50 p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-indigo-200 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest bg-indigo-100/50 px-2 py-1 rounded-md">AI Insight</span>
                  </div>
                  <h4 className="text-lg text-slate-800 font-medium mb-2 leading-tight">Sleep strongly dictates your baseline.</h4>
                  <p className="text-sm text-slate-500 font-light leading-relaxed">
                    Data reveals a severe mood drop (Avg 2.0) on days following {"<"}5 hours of sleep, typically mapping to Wed/Thu. Prioritize Wednesday nights.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="rounded-[2rem] bg-emerald-50/50 border border-emerald-100/50 p-6 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-200 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/50 px-2 py-1 rounded-md">Performance</span>
                  </div>
                  <h4 className="text-lg text-slate-800 font-medium mb-2 leading-tight">High focus yields calm states.</h4>
                  <p className="text-sm text-slate-500 font-light leading-relaxed">
                    On days with 150+ minutes of Deep Work recorded, your emotional baseline shifts significantly toward "Calm / Focused". Flow state serves as regulation.
                  </p>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
