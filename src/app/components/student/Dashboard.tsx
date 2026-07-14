'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
  LineChart, Line,
} from 'recharts'
import {
  Flame, ChevronRight, CheckCircle2, Circle,
  AlertTriangle, Moon, Brain, Zap, Heart, Shield, Headphones, Sparkles, MapPin, Search
} from 'lucide-react'

// Mock Assets replacing generic images for premium feel
const WAVE_SVG = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block animate-wave text-amber-500 ml-2">
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12C9.5 14 14.5 14 16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 9.05L8.01 9.04M16 9.05L16.01 9.04" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ─── DATA ─── */

const moodData = [
  { day: 'Mon', score: 7, emoji: '😊' },
  { day: 'Tue', score: 5, emoji: '😐' },
  { day: 'Wed', score: 8, emoji: '😄' },
  { day: 'Thu', score: 6, emoji: '🙂' },
  { day: 'Fri', score: 4, emoji: '😔' },
  { day: 'Sat', score: 9, emoji: '🤩' },
  { day: 'Sun', score: 7, emoji: '😊' },
]

const mindfulnessData = [
  { name: 'Completed', value: 72 },
  { name: 'Remaining', value: 28 },
]

const generateHeatmapData = () => {
  const data: { date: string; count: number }[] = []
  const today = new Date()
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    data.push({ date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count: Math.floor(Math.random() * 8) })
  }
  return data
}
const heatmapData = generateHeatmapData()

const workshops = [
  { title: 'Mindful Study Techniques', time: 'Today, 4:00 PM', attendees: 3 },
  { title: 'Stress Management 101', time: 'Tomorrow, 2:30 PM', attendees: 5 },
  { title: 'Sleep Hygiene Workshop', time: 'Fri, 5:00 PM', attendees: 2 },
]

const timelineSteps = [
  { title: 'Self-Assessment', desc: 'Completed screening', done: true, active: false },
  { title: 'Personalized Plan', desc: 'CBT-based modules', done: true, active: false },
  { title: 'Cognitive Restructuring', desc: 'Week 2 — In progress', done: false, active: true },
  { title: 'Behavioral Activation', desc: 'Upcoming', done: false, active: false },
  { title: 'Maintenance & Growth', desc: 'Final stage', done: false, active: false },
]

const sleepData = [
  { day: 'Mon', sleep: 5.5, gpa: 2.8 },
  { day: 'Tue', sleep: 7, gpa: 3.2 },
  { day: 'Wed', sleep: 4, gpa: 2.5 },
  { day: 'Thu', sleep: 8, gpa: 3.6 },
  { day: 'Fri', sleep: 6, gpa: 3.0 },
  { day: 'Sat', sleep: 9, gpa: 3.8 },
  { day: 'Sun', sleep: 7.5, gpa: 3.4 },
]

const stressData = [
  { week: 'W1', stress: 30 },
  { week: 'W2', stress: 35 },
  { week: 'W3', stress: 45 },
  { week: 'W4', stress: 55 },
  { week: 'W5', stress: 40 },
  { week: 'W6', stress: 70 },
  { week: 'W7', stress: 85 },
  { week: 'Finals', stress: 95 },
]

interface GoalItem { id: number; text: string; done: boolean; type: 'personal' | 'course' }

const initialGoals: GoalItem[] = [
  { id: 1, text: 'Complete daily meditation', done: true, type: 'personal' },
  { id: 2, text: 'Journal before bed', done: false, type: 'personal' },
  { id: 3, text: 'Attend group therapy session', done: true, type: 'personal' },
  { id: 4, text: 'Finish psych assignment', done: false, type: 'course' },
  { id: 5, text: 'Review CBT module 3', done: true, type: 'course' },
  { id: 6, text: 'Submit wellness report', done: false, type: 'course' },
]

const gratitudeWallItems = [
  { id: 1, text: 'My supportive roommate who helped me debug at 2AM 🙏', author: 'Anonymous Panda', emoji: '🐼', hearts: 47, timeAgo: '2h ago' },
  { id: 2, text: 'Free chai at the campus event today ☕', author: 'Sneha R.', emoji: '☕', hearts: 89, timeAgo: '3h ago' },
  { id: 3, text: 'Finally understood recursion in DSA class!', author: 'Anonymous Phoenix', emoji: '🔥', hearts: 134, timeAgo: '5h ago' },
  { id: 4, text: 'My mom called and said she\'s proud of me 💜', author: 'Anonymous Star', emoji: '⭐', hearts: 203, timeAgo: '6h ago' },
  { id: 5, text: 'Kind words from my professor after a tough exam', author: 'Ravi K.', emoji: '📚', hearts: 67, timeAgo: '8h ago' },
  { id: 6, text: 'Sunset from hostel terrace was magical today 🌅', author: 'Anonymous Cloud', emoji: '🌅', hearts: 156, timeAgo: '1d ago' },
  { id: 7, text: 'Got selected for the hackathon team!', author: 'Kiara M.', emoji: '🚀', hearts: 178, timeAgo: '1d ago' },
  { id: 8, text: 'A stranger smiled at me in the library', author: 'Anonymous Owl', emoji: '🦉', hearts: 92, timeAgo: '2d ago' },
]

/* ─── TOOLTIP ─── */

function MoodTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { day: string; score: number; emoji: string } }> }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="liquid-glass-card px-5 py-4 text-center">
        <div className="text-3xl mb-1.5 drop-shadow-sm">{d.emoji}</div>
        <p className="text-xs font-semibold text-[oklch(0.554_0.046_257.417)] uppercase tracking-widest">{d.day}</p>
        <p className="text-2xl font-light text-[oklch(0.208_0.042_265.755)]">{d.score}<span className="text-sm text-[oklch(0.704_0.04_256.788)]">/10</span></p>
      </div>
    )
  }
  return null
}

/* ─── ANIMATION ─── */

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } }

/* ─── CARD WRAPPER ─── */
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-[calc(var(--radius)+16px)] glass-ethereal p-8 ${className}`}>
    {children}
  </div>
)

/* ─── SECTION LABEL ─── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold text-[oklch(0.554_0.046_257.417)] uppercase tracking-[0.12em]">{children}</p>
)

/* ─── DASHBOARD ─── */

interface DashboardProps { onNavigate?: (page: string) => void; userName?: string }

export default function Dashboard({ onNavigate, userName }: DashboardProps) {
  const [goals, setGoals] = useState<GoalItem[]>(initialGoals)
  const [goalFilter, setGoalFilter] = useState<'all' | 'personal' | 'course'>('all')
  const [hoveredHeatmap, setHoveredHeatmap] = useState<number | null>(null)
  const [donutAnimated, setDonutAnimated] = useState(false)

  const nav = (page: string) => onNavigate?.(page)

  useEffect(() => { const t = setTimeout(() => setDonutAnimated(true), 600); return () => clearTimeout(t) }, [])

  const filteredGoals = goals.filter((g) => goalFilter === 'all' || g.type === goalFilter)
  const completedCount = goals.filter((g) => g.done).length
  const progressPct = Math.round((completedCount / goals.length) * 100)
  const toggleGoal = (id: number) => setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)))

  const heatColor = (count: number) => {
    if (count === 0) return 'bg-[oklch(0.97_0.007_260)] border-[oklch(0.929_0.013_255.508)]'
    if (count <= 2) return 'bg-[oklch(0.90_0.025_260)] border-[oklch(0.85_0.03_260)]'
    if (count <= 4) return 'bg-[oklch(0.75_0.06_265)] border-[oklch(0.70_0.07_265)]'
    if (count <= 6) return 'bg-[oklch(0.60_0.10_265)] border-[oklch(0.55_0.12_265)] shadow-[0_0_10px_oklch(0.55_0.12_265/30%)]'
    return 'bg-[oklch(0.45_0.12_265)] border-[oklch(0.40_0.14_265)] shadow-[0_0_15px_oklch(0.45_0.12_265/40%)]'
  }

  /* ─── Chart shared styles ─── */
  const chartTooltipStyle = {
    borderRadius: '16px',
    border: '1px solid oklch(1 0 0 / 50%)',
    boxShadow: '0 12px 32px oklch(0.42 0.06 292 / 10%)',
    fontSize: '11px',
    backdropFilter: 'blur(24px)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    fontWeight: '500' as const,
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-5">

      {/* ─── GREETING ─── */}
      <motion.div variants={fadeUp} className="mb-2 pl-1">
        <h1 className="text-2xl md:text-3xl text-[oklch(0.129_0.042_264.695)] tracking-tight flex items-center" style={{ fontFamily: "'DM Serif Display', 'Fraunces', serif", fontWeight: 400 }}>
          Good morning,{' '}
          <span className="text-[oklch(0.208_0.042_265.755)] ml-2" style={{ fontFamily: "'Instrument Serif', 'Fraunces', serif", fontStyle: 'italic' }}>{userName || 'Jai'}</span>
          {WAVE_SVG}
        </h1>
        <p className="text-[oklch(0.554_0.046_257.417)] text-[13px] mt-1 font-light tracking-tight">Your psychological wellness ecosystem is active.</p>
      </motion.div>

      {/* ═══════════════════════════════════════════════
          ROW 1 — HERO BANNER · STREAK · DONUT
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">

        {/* W1: Premium Hero Banner — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-2 xl:col-span-6">
          <div className="relative h-64 rounded-[calc(var(--radius)+16px)] overflow-hidden cursor-pointer group shadow-[0_12px_32px_oklch(0.42_0.06_292/10%)] hover:shadow-[0_16px_48px_oklch(0.42_0.06_292/18%)] transition-all duration-500">
            <img
              src="/dashboard/assets/banner image.png"
              alt="Wellness Banner"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[oklch(0.129_0.042_264.695/10%)] transition-all duration-500 group-hover:bg-[oklch(0.129_0.042_264.695/0%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.129_0.042_264.695/80%)] via-transparent to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-between p-7 md:p-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-sm mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.82_0.075_305)] shadow-[0_0_8px_oklch(0.82_0.075_305)] animate-pulse" />
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-white/90">Peak State</span>
                </div>
                <h2 className="text-2xl md:text-3xl text-white leading-tight mb-2 tracking-tight" style={{ fontFamily: "'Fraunces', 'Instrument Serif', serif", fontWeight: 300 }}>
                  You've made incredible <br />progress this week.
                </h2>
                <p className="text-white/80 text-[13px] md:text-sm max-w-sm leading-relaxed font-light tracking-tight">
                  Your psychological resilience is building. Keep nurturing your mind and spirit for placements.
                </p>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => nav('gratitude')} className="self-start mt-2 px-6 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[oklch(0.208_0.042_265.755)] text-[11px] font-semibold uppercase tracking-widest shadow-[0_8px_20px_oklch(0_0_0/10%)] hover:bg-white transition-all duration-300 group-hover:-translate-y-0.5">
                Explore Wellness →
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* W5: Meditation Streak — 3 cols */}
        <motion.div variants={fadeUp} className="xl:col-span-3">
          <Card className="h-64 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <SectionLabel>Meditation Streak</SectionLabel>
              <div className="w-8 h-8 rounded-full bg-[oklch(0.95_0.03_75)] flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-500 animate-flame" />
              </div>
            </div>
            <div>
              <p className="text-5xl font-light text-[oklch(0.129_0.042_264.695)] leading-none tracking-tighter">23</p>
              <p className="text-[12px] text-[oklch(0.554_0.046_257.417)] mt-1 font-light tracking-tight">Consecutive Days</p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-semibold text-[oklch(0.554_0.046_257.417)] uppercase tracking-widest">30 Day Milestone</span>
                <span className="text-xs font-semibold text-amber-600">77%</span>
              </div>
              <div className="w-full h-2.5 bg-[oklch(0.968_0.007_247.896)] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '77%' }} transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' as const }} className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* W4: Mindfulness Donut — 3 cols */}
        <motion.div variants={fadeUp} className="xl:col-span-3">
          <Card className="h-64 flex flex-col items-center justify-center relative group">
            <p className="absolute top-7 left-8"><SectionLabel>Mindfulness</SectionLabel></p>
            <div className="relative w-[160px] h-[160px] mt-2 hover:scale-105 transition-transform duration-300">
              <PieChart width={160} height={160}>
                <Tooltip
                  cursor={false}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px oklch(0.42 0.06 292 / 10%)', fontSize: '12px', fontWeight: '500' }}
                  itemStyle={{ color: 'oklch(0.208 0.042 265.755)' }}
                />
                <Pie
                  data={donutAnimated ? mindfulnessData : [{ name: 'Empty', value: 100 }]}
                  cx={80} cy={80}
                  innerRadius={60} outerRadius={76}
                  startAngle={90} endAngle={-270}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0} animationDuration={1200}
                  stroke="none" cornerRadius={10}
                >
                  {(donutAnimated ? mindfulnessData : [{ name: 'Empty', value: 100 }]).map((_, idx) => (
                    <Cell key={idx} fill={donutAnimated ? (idx === 0 ? 'url(#colorBrand)' : 'oklch(0.968 0.007 247.896)') : 'oklch(0.968 0.007 247.896)'} className="outline-none cursor-pointer" />
                  ))}
                </Pie>
                <defs>
                  <linearGradient id="colorBrand" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.45 0.12 265)" />
                    <stop offset="100%" stopColor="oklch(0.208 0.042 265.755)" />
                  </linearGradient>
                </defs>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-light text-[oklch(0.208_0.042_265.755)] tracking-tighter">72%</span>
              </div>
            </div>
            <p className="text-[10px] font-medium text-[oklch(0.554_0.046_257.417)] mt-4 bg-[oklch(0.968_0.007_247.896)] px-3 py-1 rounded-full border border-[oklch(0.929_0.013_255.508)] uppercase tracking-widest">18 / 25 Sessions</p>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          ROW 2 — MOOD CHART · WORKSHOPS
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">

        {/* W3: Weekly Mood Bar Chart — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>Weekly Mood Tracker</SectionLabel>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[oklch(0.968_0.007_247.896)] text-[oklch(0.45_0.08_265)] font-medium border border-[oklch(0.929_0.013_255.508)]">This Week</span>
            </div>
            <div className="flex-1 mt-1 min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={36}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.554 0.046 257.417)' }} padding={{ left: 10, right: 10 }} />
                  <YAxis domain={[0, 10]} hide />
                  <Tooltip content={<MoodTooltip />} cursor={{ fill: 'oklch(0.968 0.007 247.896 / 60%)', radius: 8 }} />
                  <Bar dataKey="score" radius={[8, 8, 4, 4]} animationDuration={1200}>
                    {moodData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.score >= 7 ? 'oklch(0.45 0.12 265)' : entry.score >= 5 ? 'oklch(0.65 0.08 265)' : 'oklch(0.82 0.04 265)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* W2: Upcoming Workshops — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <SectionLabel>Upcoming Wellness Workshops</SectionLabel>
              <button onClick={() => nav('workshops')} className="w-8 h-8 rounded-full bg-[oklch(0.968_0.007_247.896)] flex items-center justify-center hover:bg-[oklch(0.95_0.013_260)] transition-colors group border border-[oklch(0.929_0.013_255.508)]">
                <ChevronRight className="w-4 h-4 text-[oklch(0.554_0.046_257.417)] group-hover:text-[oklch(0.208_0.042_265.755)]" />
              </button>
            </div>
            <div className="space-y-4 pt-1">
              {workshops.map((w, i) => (
                <motion.div key={i} onClick={() => nav('workshops')} whileHover={{ x: 6, backgroundColor: 'oklch(0.968 0.007 247.896 / 60%)' }} className="flex items-center gap-5 p-3 rounded-2xl cursor-pointer transition-colors duration-300 hover:shadow-sm">
                  <div className="w-14 h-14 rounded-[1.2rem] bg-[oklch(0.208_0.042_265.755)] flex items-center justify-center text-white font-light shadow-[0_4px_16px_oklch(0.208_0.042_265.755/20%)] flex-shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10" />
                    <span className="relative z-10 text-xl tracking-tighter" style={{ fontFamily: "'Fraunces', serif", fontWeight: 300 }}>{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg text-[oklch(0.129_0.042_264.695)] truncate leading-snug tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>{w.title}</p>
                    <p className="text-[11px] font-medium text-[oklch(0.554_0.046_257.417)] mt-1 uppercase tracking-widest">{w.time} <span className="mx-1.5 opacity-50">•</span> {w.attendees} attending</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[oklch(0.85_0.02_260)] group-hover:text-[oklch(0.554_0.046_257.417)] flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          ROW 3 — HEATMAP · GOALS
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">

        {/* W6: Community Heatmap — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card className="h-full flex flex-col p-4 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <SectionLabel>Community Pulse</SectionLabel>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[oklch(0.968_0.007_247.896)] rounded-full border border-[oklch(0.929_0.013_255.508)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.45_0.12_265)] animate-pulse" />
                <span className="text-[9px] font-semibold text-[oklch(0.45_0.08_265)] uppercase tracking-widest">Live Flow</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-7 gap-1.5 sm:gap-3 md:gap-4">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => (
                  <div key={i} className="text-center text-[9px] sm:text-[10px] text-[oklch(0.554_0.046_257.417)] font-semibold mb-1 sm:mb-3 tracking-tighter">{d}</div>
                ))}
                {heatmapData.map((cell, i) => (
                  <div key={i} className="relative group flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      className={`w-full aspect-square max-w-[32px] sm:max-w-[42px] rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-500 ${heatColor(cell.count)} flex items-center justify-center relative overflow-hidden`}
                      onMouseEnter={() => setHoveredHeatmap(i)}
                      onMouseLeave={() => setHoveredHeatmap(null)}
                    >
                      {cell.count > 5 && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      )}
                    </motion.div>
                    <AnimatePresence>
                      {hoveredHeatmap === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.9 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[60] bg-[oklch(0.129_0.042_264.695/92%)] backdrop-blur-md text-white px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-2xl shadow-2xl border border-white/10 pointer-events-none w-max max-w-[150px] sm:max-w-none"
                        >
                          <p className="text-[oklch(0.70_0.04_256.788)] text-[9px] font-semibold uppercase tracking-[0.2em] leading-none mb-1.5">{cell.date}</p>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[oklch(0.70_0.08_265)] flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">{cell.count} Interactions</span>
                          </div>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[oklch(0.129_0.042_264.695/92%)] rotate-45 border-r border-b border-white/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[oklch(0.929_0.013_255.508/50%)] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              <div className="flex gap-1.5 items-center">
                <span className="text-[10px] font-medium text-[oklch(0.554_0.046_257.417)]">Low</span>
                <div className="flex gap-1">
                  {[1, 3, 5, 7].map(v => (
                    <div key={v} className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-sm sm:rounded-md ${heatColor(v)} border-none`} />
                  ))}
                </div>
                <span className="text-[10px] font-medium text-[oklch(0.554_0.046_257.417)]">High</span>
              </div>
              <p className="text-[10px] font-semibold text-[oklch(0.45_0.08_265)] uppercase tracking-widest cursor-pointer hover:underline">View Analytics →</p>
            </div>
          </Card>
        </motion.div>

        {/* W7: Wellness Goals Checklist — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <SectionLabel>Growth Checklist</SectionLabel>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 bg-[oklch(0.968_0.007_247.896)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[oklch(0.208_0.042_265.755)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-[oklch(0.45_0.08_265)]">{progressPct}%</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 max-h-[340px] overflow-y-auto pr-2 scrollbar-thin">
              <AnimatePresence>
                {filteredGoals.map((goal) => (
                  <motion.button
                    key={goal.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-full group flex items-center gap-4 p-4 rounded-[1.5rem] text-left transition-all duration-500 border ${goal.done
                      ? 'bg-[oklch(0.968_0.007_247.896/50%)] border-transparent opacity-80'
                      : 'bg-white border-[oklch(0.929_0.013_255.508/60%)] shadow-[0_4px_12px_oklch(0_0_0/2%)] hover:border-[oklch(0.82_0.04_265)] hover:shadow-[0_12px_24px_oklch(0.42_0.06_292/6%)]'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 flex-shrink-0 ${goal.done ? 'bg-emerald-500 text-white rotate-12 scale-90' : 'bg-[oklch(0.968_0.007_247.896)] text-[oklch(0.82_0.04_260)] group-hover:bg-[oklch(0.95_0.013_260)] group-hover:text-[oklch(0.45_0.08_265)]'
                      }`}>
                      {goal.done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 flex-shrink-0" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-[15px] font-medium truncate transition-all ${goal.done ? 'line-through text-[oklch(0.554_0.046_257.417)]' : 'text-[oklch(0.25_0.03_260)]'}`}>
                        {goal.text}
                      </p>
                      <span className={`text-[9px] font-semibold uppercase tracking-[0.15em] ${goal.type === 'personal' ? 'text-[oklch(0.45_0.08_265)]' : 'text-[oklch(0.60_0.15_25)]'}`}>
                        {goal.type}
                      </span>
                    </div>
                    {!goal.done && (
                      <ChevronRight className="w-4 h-4 text-[oklch(0.85_0.02_260)] group-hover:text-[oklch(0.554_0.046_257.417)] transition-colors" />
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex gap-2 p-1.5 bg-[oklch(0.968_0.007_247.896/80%)] backdrop-blur-sm rounded-2xl border border-[oklch(0.929_0.013_255.508)]">
              {(['all', 'personal', 'course'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setGoalFilter(f)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all duration-500 ${goalFilter === f
                    ? 'bg-white text-[oklch(0.208_0.042_265.755)] shadow-md transform -translate-y-0.5'
                    : 'text-[oklch(0.554_0.046_257.417)] hover:text-[oklch(0.35_0.03_260)]'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          ROW 4 — WELLNESS PATH · RESOURCE LIBRARY
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">

        {/* W8: Personalized Wellness Path Timeline — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card>
            <SectionLabel>Personalized Wellness Path</SectionLabel>
            <div className="space-y-0 mt-6">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-medium transition-all duration-300 flex-shrink-0 relative overflow-hidden ${step.done ? 'bg-[oklch(0.208_0.042_265.755)] text-white shadow-[0_4px_15px_oklch(0.208_0.042_265.755/25%)] group-hover:shadow-[0_8px_25px_oklch(0.208_0.042_265.755/35%)] group-hover:-translate-y-0.5' : step.active ? 'bg-white text-[oklch(0.45_0.08_265)] border-2 border-[oklch(0.82_0.04_265)] shadow-[0_0_20px_oklch(0.45_0.12_265/15%)]' : 'bg-[oklch(0.968_0.007_247.896)] text-[oklch(0.554_0.046_257.417)] border border-[oklch(0.929_0.013_255.508)]'}`}>
                      {step.done ? <CheckCircle2 className="w-5 h-5" /> : <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>{i + 1}</span>}
                      {step.active && <span className="absolute inset-0 rounded-2xl ring-4 ring-[oklch(0.90_0.025_265)] animate-pulse pointer-events-none" />}
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div className="flex-1 w-px my-1.5 rounded-full overflow-hidden flex flex-col items-center">
                        {step.done ? (
                          <div className="w-full h-full bg-gradient-to-b from-[oklch(0.208_0.042_265.755)] to-[oklch(0.85_0.02_260)]" />
                        ) : (
                          <div className="h-full border-l-2 border-dashed border-[oklch(0.90_0.025_260)]" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`pb-6 pt-2 transition-transform duration-300 ${step.active ? 'group-hover:translate-x-1' : ''}`}>
                    <p className={`text-base leading-tight ${step.active ? 'text-[oklch(0.45_0.08_265)] drop-shadow-sm' : step.done ? 'text-[oklch(0.25_0.03_260)]' : 'text-[oklch(0.554_0.046_257.417)]'}`} style={{ fontFamily: "'Fraunces', serif", fontWeight: step.active ? 500 : 400 }}>{step.title}</p>
                    <p className={`text-xs mt-1 font-medium ${step.active ? 'text-[oklch(0.65_0.08_265)]' : 'text-[oklch(0.554_0.046_257.417)]'}`}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* W9: Resource Library — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card>
            <SectionLabel>Resource Library Shortcuts</SectionLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {[
                { title: 'Meditation', text: 'text-[oklch(0.45_0.08_265)]', icon: Brain, page: 'breathe' },
                { title: 'Journaling', text: 'text-[oklch(0.55_0.15_15)]', icon: MapPin, page: 'journal' },
                { title: 'Tracker', text: 'text-emerald-600', icon: Search, page: 'mood-tracker' },
                { title: 'Focus Timer', text: 'text-amber-600', icon: Zap, page: 'focus' },
                { title: 'Community', text: 'text-[oklch(0.45_0.12_290)]', icon: Heart, page: 'community' },
                { title: 'Counseling', text: 'text-[oklch(0.50_0.10_240)]', icon: Shield, page: 'counseling' },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => nav(card.page)}
                    className="aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group flex flex-col items-center justify-center border border-[oklch(0.929_0.013_255.508/60%)] transition-all duration-300 shadow-[0_2px_10px_oklch(0_0_0/2%)] hover:shadow-[0_8px_20px_oklch(0.42_0.06_292/6%)] bg-white hover:bg-[oklch(0.968_0.007_247.896)]"
                  >
                    <Icon className={`w-8 h-8 mb-2 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300 ${card.text}`} strokeWidth={1.5} />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[oklch(0.25_0.03_260)] transition-colors">{card.title}</p>
                  </motion.div>
                )
              })}
            </div>
            <button onClick={() => nav('resources')} className="w-full mt-4 py-3 rounded-2xl bg-[oklch(0.968_0.007_247.896)] text-[oklch(0.45_0.08_265)] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[oklch(0.95_0.013_260)] transition-colors border border-[oklch(0.929_0.013_255.508)]">
              Explore Full Library <ChevronRight className="w-4 h-4" />
            </button>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          ROW 5 — DAILY QUOTE (full width)
          ═══════════════════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        <div className="relative h-64 md:h-56 rounded-[calc(var(--radius)+16px)] overflow-hidden cursor-pointer group shadow-[0_12px_40px_oklch(0.208_0.042_265.755/10%)] hover:shadow-[0_16px_50px_oklch(0.208_0.042_265.755/18%)] transition-all duration-500 bg-gradient-to-br from-[oklch(0.18_0.04_265)] via-[oklch(0.208_0.042_265.755)] to-[oklch(0.129_0.042_264.695)]">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay grain-overlay"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[oklch(0.45_0.12_265/15%)] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[oklch(0.55_0.12_290/15%)] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 backdrop-blur-md border border-white/15 text-[oklch(0.82_0.04_260)] shadow-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Daily Insight</span>
            </div>
            <p className="text-white text-xl md:text-2xl leading-relaxed max-w-2xl drop-shadow-md tracking-tight" style={{ fontFamily: "'Fraunces', 'Instrument Serif', serif", fontWeight: 300, fontStyle: 'italic' }}>
              &ldquo;You don&apos;t have to control your thoughts. You just have to stop letting them control you.&rdquo;
            </p>
            <p className="text-[oklch(0.70_0.04_260)] text-sm mt-5 font-semibold tracking-widest uppercase">— Dan Millman</p>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════
          ROW 6 — GRATITUDE / KARMA WALL (full width)
          ═══════════════════════════════════════════════ */}
      <motion.div variants={fadeUp} className="pt-8">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-transparent" />
          <h2 className="text-xl text-[oklch(0.129_0.042_264.695)] tracking-tight flex items-center gap-3" style={{ fontFamily: "'DM Serif Display', 'Fraunces', serif", fontWeight: 400 }}>
            <span className="text-2xl drop-shadow-sm">🌳</span> Karma Garden
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-emerald-100 to-transparent" />
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div onClick={() => nav('gratitude')} className="relative rounded-[calc(var(--radius)+16px)] overflow-hidden cursor-pointer group shadow-[0_12px_32px_oklch(0.50_0.10_165/10%)] hover:shadow-[0_16px_48px_oklch(0.50_0.10_165/18%)] transition-all duration-500 bg-gradient-to-br from-emerald-600 via-teal-600 to-[oklch(0.45_0.10_200)]">
          <div className="absolute inset-0 opacity-15 mix-blend-overlay grain-overlay"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-300/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-200/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
              <div className="flex flex-col items-center gap-5 md:min-w-[220px] text-center">
                <div className="text-center">
                  <p className="text-emerald-50 text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">Community Karma</p>
                  <p className="text-5xl font-light text-white drop-shadow-md tracking-tighter" style={{ fontFamily: "'Fraunces', serif" }}>1,247</p>
                  <p className="text-emerald-100/90 text-sm mt-1.5 font-medium">Seeds of gratitude planted</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); nav('gratitude') }} className="px-8 py-3.5 rounded-full bg-white text-emerald-700 text-sm font-semibold shadow-[0_8px_20px_oklch(0_0_0/10%)] hover:shadow-[0_8px_30px_oklch(1_0_0/20%)] transition-all duration-300 flex items-center gap-2 group-hover:-translate-y-1">
                  Plant Your Seed
                </button>
              </div>

              <div className="flex-1 w-full min-w-0 bg-white/8 backdrop-blur-md rounded-3xl p-6 border border-white/15">
                <p className="text-white text-sm font-semibold mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-yellow-300" /> Live Feed
                </p>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-3 scrollbar-thin">
                  {gratitudeWallItems.map((item) => (
                    <motion.div key={item.id} whileHover={{ scale: 1.01, x: 4 }} className="p-4 rounded-[1.25rem] bg-white/8 hover:bg-white/15 transition-all duration-300 border border-white/5 flex gap-4">
                      <div className="text-2xl pt-1">{item.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-emerald-50 font-medium tracking-wide">{item.author}</span>
                          <span className="text-[10px] text-emerald-100/50 uppercase tracking-wider font-medium">{item.timeAgo}</span>
                        </div>
                        <p className="text-sm text-white font-medium leading-relaxed">{item.text}</p>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <Heart className="w-3.5 h-3.5 text-pink-300 fill-pink-300/50" />
                          <span className="text-xs text-white/80 font-medium">{item.hearts}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════
          SECTION DIVIDER — Beyond Wellness
          ═══════════════════════════════════════════════ */}
      <motion.div variants={fadeUp} className="pt-8">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-1 bg-gradient-to-r from-[oklch(0.45_0.08_265)] to-transparent rounded-full" />
          <h2 className="text-xl text-[oklch(0.129_0.042_264.695)] tracking-tight whitespace-nowrap" style={{ fontFamily: "'DM Serif Display', 'Fraunces', serif", fontWeight: 400 }}>Beyond Wellness</h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[oklch(0.90_0.025_265)] to-transparent rounded-full" />
        </div>
        <p className="text-xs font-medium text-[oklch(0.554_0.046_257.417)] uppercase tracking-widest mt-2 ml-[4.5rem]">Smart insights tailored for your college life</p>
      </motion.div>

      {/* ═══════════════════════════════════════════════
          ROW 7 — SOS · SLEEP vs GPA
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">

        {/* SOS Panic Button — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <div className="h-full rounded-[calc(var(--radius)+16px)] bg-gradient-to-br from-[oklch(0.97_0.02_25/80%)] to-[oklch(0.96_0.015_20/50%)] backdrop-blur-2xl border border-[oklch(0.90_0.05_25/40%)] shadow-[0_8px_30px_oklch(0.577_0.245_27.325/5%)] p-8 hover:shadow-[0_12px_40px_oklch(0.577_0.245_27.325/10%)] transition-all duration-500">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <motion.div animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 0 rgba(225,29,72,0)', '0 0 25px rgba(225,29,72,0.3)', '0 0 0 rgba(225,29,72,0)'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }} className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0 relative">
                <div className="absolute inset-0 rounded-[1.5rem] bg-white text-rose-500 opacity-15 mix-blend-overlay" />
                <AlertTriangle className="w-10 h-10 text-white relative z-10" strokeWidth={2.5} />
              </motion.div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xl text-rose-700 tracking-tight" style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>SOS / Immediate Relief</h3>
                <p className="text-sm text-rose-600/80 mt-2 mb-5 font-medium leading-relaxed">
                  Experiencing an acute panic episode or debilitating placement anxiety? Activate high-priority grounding protocols.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <button onClick={() => { window.open('tel:+919152987821') }} className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-semibold uppercase tracking-widest shadow-[0_4px_15px_rgba(225,29,72,0.25)] hover:shadow-[0_8px_25px_rgba(225,29,72,0.35)] hover:-translate-y-0.5 transition-all duration-300">
                    Call Helpline
                  </button>
                  <button onClick={() => nav('breathe')} className="px-5 py-3 rounded-xl bg-white text-rose-600 text-xs font-semibold uppercase tracking-widest shadow-[0_4px_15px_oklch(0_0_0/3%)] hover:bg-rose-50 border border-rose-100 transition-all duration-300">
                    Breathe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sleep vs Academic Performance — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card className="p-4 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Moon className="w-5 h-5 text-[oklch(0.45_0.08_265)]" />
              <SectionLabel>Sleep vs. Academic Performance</SectionLabel>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={sleepData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.12 265)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="oklch(0.55 0.12 265)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gpaG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'oklch(0.554 0.046 257.417)', fontWeight: '500' }} />
                <YAxis hide />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="sleep" stroke="oklch(0.55 0.12 265)" fill="url(#sleepG)" strokeWidth={2.5} name="Sleep (hrs)" />
                <Area type="monotone" dataKey="gpa" stroke="#10B981" fill="url(#gpaG)" strokeWidth={2.5} name="GPA" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 sm:gap-6 mt-4 justify-center">
              <span className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[oklch(0.554_0.046_257.417)] font-medium uppercase tracking-widest"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[oklch(0.55_0.12_265)] shadow-[0_0_6px_oklch(0.55_0.12_265/40%)]" /> Sleep hrs</span>
              <span className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[oklch(0.554_0.046_257.417)] font-medium uppercase tracking-widest"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" /> GPA</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          ROW 8 — STRESS PREDICTOR · ENERGY LEVELS
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">

        {/* Exam Stress Predictor — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-rose-500" strokeWidth={2} />
                <SectionLabel>Stress Prediction Model</SectionLabel>
              </div>
              <span className="text-[9px] px-3 py-1 rounded-full bg-[oklch(0.97_0.02_25)] text-rose-600 font-semibold uppercase tracking-widest border border-rose-100 shadow-sm animate-pulse">Critical: Finals</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={stressData}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'oklch(0.554 0.046 257.417)', fontWeight: '500' }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="stress" stroke="#E11D48" strokeWidth={2.5} dot={{ fill: '#E11D48', strokeWidth: 0, r: 4 }} activeDot={{ fill: '#E11D48', strokeWidth: 3, stroke: '#FFE4E6', r: 7 }} name="Stress Velocity %" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-[oklch(0.554_0.046_257.417)] mt-4 font-medium leading-relaxed bg-[oklch(0.968_0.007_247.896)] p-3 rounded-xl border border-[oklch(0.929_0.013_255.508)]">
              <span className="text-[oklch(0.45_0.08_265)] font-semibold">INSIGHT:</span> Pattern analysis indicates elevated cortisol load correlating with Week 7. Pre-emptive decompression protocols recommended.
            </p>
          </Card>
        </motion.div>

        {/* Energy Levels — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-amber-500" strokeWidth={2} />
              <SectionLabel>Circadian Energy Map</SectionLabel>
            </div>
            <div className="grid grid-cols-4 gap-4 h-[160px]">
              {[
                { time: 'Morn', level: 85, color: 'from-amber-400 to-orange-400' },
                { time: 'Mid', level: 70, color: 'from-[oklch(0.65_0.08_240)] to-[oklch(0.55_0.10_220)]' },
                { time: 'Aft', level: 45, color: 'from-[oklch(0.65_0.08_265)] to-[oklch(0.45_0.12_265)]' },
                { time: 'Eve', level: 60, color: 'from-[oklch(0.70_0.03_260)] to-[oklch(0.55_0.04_260)]' },
              ].map((block, i) => (
                <div key={i} className="flex flex-col items-center justify-end h-full">
                  <div className="w-full h-full bg-[oklch(0.968_0.007_247.896)] rounded-xl relative overflow-hidden ring-1 ring-[oklch(0.929_0.013_255.508)] flex flex-col justify-end group">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${block.level}%` }}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: 'easeOut' as const }}
                      className={`w-full rounded-t-lg bg-gradient-to-t ${block.color} group-hover:brightness-110 transition-all`}
                    />
                    <div className="absolute top-2 w-full text-center">
                      <p className="text-xs font-medium text-[oklch(0.45_0.03_260/50%)] group-hover:text-[oklch(0.45_0.03_260/80%)] transition-colors">{block.level}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-[oklch(0.554_0.046_257.417)] font-semibold uppercase tracking-widest mt-3">{block.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          ROW 9 — QUICK RELIEF · WEEKLY SUMMARY
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 pb-12">

        {/* Quick Access Tools — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card>
            <SectionLabel>Immediate Relief Tools</SectionLabel>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { icon: Heart, label: 'Self-Compassion', desc: '5 MIN', color: 'from-pink-400 to-rose-500 shadow-rose-200/40', page: 'gratitude' },
                { icon: Shield, label: 'Grounding 5-4-3-2-1', desc: 'SENSORY', color: 'from-emerald-400 to-teal-500 shadow-emerald-200/40', page: 'breathe' },
                { icon: Headphones, label: 'Ambient Focus', desc: 'LO-FI', color: 'from-[oklch(0.60_0.08_240)] to-[oklch(0.50_0.10_220)] shadow-[oklch(0.55_0.12_220/30%)]', page: 'focus' },
                { icon: Brain, label: 'Thought Defusion', desc: 'ACT', color: 'from-[oklch(0.60_0.10_290)] to-[oklch(0.45_0.12_280)] shadow-[oklch(0.50_0.12_290/30%)]', page: 'journal' },
              ].map((tool, i) => {
                const Icon = tool.icon
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => nav(tool.page)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[oklch(0.929_0.013_255.508/60%)] hover:border-[oklch(0.82_0.04_265)] hover:shadow-[0_8px_20px_oklch(0.42_0.06_292/6%)] transition-all duration-300 text-left group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[oklch(0.25_0.03_260)] leading-tight">{tool.label}</p>
                      <p className="text-[9px] font-semibold text-[oklch(0.554_0.046_257.417)] uppercase tracking-widest mt-0.5">{tool.desc}</p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Weekly Summary Stats — 6 cols */}
        <motion.div variants={fadeUp} className="md:col-span-1 xl:col-span-6">
          <Card>
            <SectionLabel>Weekly Synthesis</SectionLabel>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Mindful Mins', value: '127', change: '+18% vs lg', positive: true },
                { label: 'Journal Logs', value: '5', change: '+2 vs lg', positive: true },
                { label: 'Mood Index', value: '6.6', change: '-0.4 vs lg', positive: false },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-3xl bg-[oklch(0.968_0.007_247.896)] border border-[oklch(0.929_0.013_255.508/50%)] flex flex-col justify-center h-full hover:bg-white hover:shadow-[0_4px_15px_oklch(0_0_0/3%)] transition-colors">
                  <p className="text-3xl font-light text-[oklch(0.208_0.042_265.755)] tracking-tighter drop-shadow-sm" style={{ fontFamily: "'Fraunces', serif" }}>{stat.value}</p>
                  <p className="text-[10px] text-[oklch(0.554_0.046_257.417)] font-semibold uppercase tracking-widest mt-2">{stat.label}</p>
                  <div className={`mt-3 inline-flex items-center justify-center py-1 px-2 rounded-lg text-[9px] font-semibold uppercase tracking-wider ${stat.positive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

    </motion.div>
  )
}
