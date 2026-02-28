'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sparkles, MessageCircleHeart, Leaf, Anchor, ArrowRight, Quote
} from 'lucide-react'

// SVG Tree component that grows with Karma
const LivingTree = ({ karma }: { karma: number }) => {
  const level = Math.min(Math.max(Math.floor(karma / 5), 0), 4) // 0 to 4

  // Abstract geometric SVGs representing growth stages
  const getScale = (targetLevel: number) => level >= targetLevel ? 1 : 0
  const getOpacity = (targetLevel: number) => level >= targetLevel ? 1 : 0

  return (
    <div className="relative w-64 h-64 flex items-end justify-center">
      {/* Ambient Base Glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
        className="absolute bottom-0 w-48 h-20 bg-emerald-400/30 blur-2xl rounded-full"
      />

      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 overflow-visible">
        <defs>
          <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Level 0: Seed/Base */}
        <motion.circle cx="100" cy="180" r="15" fill="url(#trunkGrad)" className="opacity-80" />

        {/* Level 1: Sprout */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: getScale(1), opacity: getOpacity(1) }}
          transition={{ duration: 1.5, ease: "easeOut" as const }}
          d="M 100 180 Q 90 140 100 100"
          fill="none"
          stroke="url(#trunkGrad)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Level 2: Branches */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: getScale(2), opacity: getOpacity(2) }}
          transition={{ duration: 1.5, delay: 0.5 }}
          d="M 98 130 Q 70 110 50 90 M 102 120 Q 130 90 150 70"
          fill="none"
          stroke="url(#trunkGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Level 3: Leaves Main */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: getScale(3), opacity: getOpacity(3) }}
          transition={{ duration: 1, type: "spring", delay: 1 }}
          cx="100" cy="80" r="35"
          fill="url(#leafGrad)"
          filter="url(#glow)"
        />
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: getScale(3), opacity: getOpacity(3) }}
          transition={{ duration: 1, type: "spring", delay: 1.2 }}
          cx="50" cy="80" r="25"
          fill="url(#leafGrad)"
        />
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: getScale(3), opacity: getOpacity(3) }}
          transition={{ duration: 1, type: "spring", delay: 1.4 }}
          cx="150" cy="65" r="28"
          fill="url(#leafGrad)"
        />

        {/* Level 4: Flourish/Blooms */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: getScale(4), opacity: getOpacity(4) }}
          transition={{ duration: 1, type: "spring", delay: 1.6 }}
          cx="100" cy="40" r="20"
          fill="#fb7185"
          filter="url(#glow)"
        />
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: getScale(4), opacity: getOpacity(4) }}
          transition={{ duration: 1, type: "spring", delay: 1.8 }}
          cx="30" cy="70" r="15"
          fill="#fb7185"
        />
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: getScale(4), opacity: getOpacity(4) }}
          transition={{ duration: 1, type: "spring", delay: 2.0 }}
          cx="160" cy="45" r="12"
          fill="#fb7185"
        />
      </svg>

      {/* Floating Karma Seeds */}
      {Array.from({ length: Math.min(karma, 15) }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-emerald-300 blur-[1px]"
          animate={{
            y: [-20, -100 - Math.random() * 50],
            x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut" as const
          }}
          style={{ left: '50%', bottom: '20px' }}
        />
      ))}
    </div>
  )
}

interface GratitudeEntry { id: number; text: string; date: string; tag: string }

const prompts = [
  { text: "What's one good thing that happened in class today?", tag: "Academic" },
  { text: "Who brought a smile to your face recently?", tag: "Social" },
  { text: "What small comfort did you appreciate today?", tag: "Mindfulness" }
]

const kudosData = [
  "Thanks for sharing your notes for OS!",
  "Loved the vibe in the hostel today.",
  "Shoutout to the senior who helped with my resume.",
  "The mess food was actually good today!",
  "Appreciate my project team pulling through.",
  "Grateful for the sunset from the library window."
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } } }

export default function Gratitude() {
  const [karma, setKarma] = useState(12)
  const [entries, setEntries] = useState<GratitudeEntry[]>([
    { id: 1, text: 'Had a breakthrough in my Final Year Project algorithm.', date: 'Today', tag: 'Academic' },
    { id: 2, text: 'Mom sent homemade snacks via courier.', date: 'Yesterday', tag: 'Family' },
    { id: 3, text: 'Cleared a very tough technical mock interview.', date: 'Oct 12', tag: 'Career' },
    { id: 4, text: 'Found a quiet corner in the library to just read.', date: 'Oct 10', tag: 'Mindfulness' },
  ])

  // Guided Reflection State
  const [reflectionStep, setReflectionStep] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')

  // Kudos State
  const [kudosText, setKudosText] = useState('')
  const [kudosSent, setKudosSent] = useState(false)

  const handleReflectionNext = () => {
    if (!currentAnswer.trim()) return

    setEntries(prev => [{
      id: Date.now(),
      text: currentAnswer,
      date: 'Just now',
      tag: prompts[reflectionStep].tag
    }, ...prev])

    setKarma(k => k + 2)
    setCurrentAnswer('')

    if (reflectionStep < prompts.length - 1) {
      setReflectionStep(s => s + 1)
    } else {
      setReflectionStep(0) // Reset or show completed state
    }
  }

  const sendKudos = () => {
    if (!kudosText.trim()) return
    setKudosSent(true)
    setKarma(k => k + 3) // More karma for helping others
    setTimeout(() => { setKudosSent(false); setKudosText('') }, 3000)
  }

  return (
    <div className="relative w-full min-h-screen font-sans pb-32 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 text-emerald-900/5">
        {/* SVG Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const }} className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-emerald-100 rounded-full blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }} className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-rose-50 rounded-full blur-[120px]" />
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-7xl mx-auto space-y-12 px-4 md:px-8 pt-10">

        {/* ── Header ── */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-emerald-100/30">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-500" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-1">Karma Garden</h1>
              <p className="text-sm text-slate-500 font-light">Your sanctuary for reflection. Grow your peace.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-white shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-slate-700 tracking-wide">{karma} <span className="font-light text-slate-500">Karma</span></span>
          </div>
        </motion.div>

        {/* ── Top Section: The Garden & Guided Reflection ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Living Tree Display */}
          <motion.div variants={fadeUp} className="lg:col-span-4 rounded-[2.5rem] bg-white/30 backdrop-blur-2xl border border-white/50 shadow-[0_8px_40px_rgba(0,0,0,0.03)] p-10 flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Hover Spotlight */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0,transparent_50%)]" />

            <h2 className="text-sm font-semibold text-slate-500 tracking-widest uppercase mb-12">Your Garden Status</h2>
            <LivingTree karma={karma} />
            <p className="mt-8 text-sm text-center text-slate-600 font-medium">Level {Math.min(Math.max(Math.floor(karma / 5), 0), 4) + 1} Flora</p>
          </motion.div>

          {/* Guided Premium Reflection Input */}
          <motion.div variants={fadeUp} className="lg:col-span-8 rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.1)] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-[80px] opacity-40 -mr-20 -mt-20 pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reflectionStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" as const }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-[2px] w-8 bg-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-600 tracking-widest uppercase">Daily Reflection {reflectionStep + 1}/3</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light text-slate-800 mb-8 leading-relaxed">
                    {prompts[reflectionStep].text}
                  </h2>

                  <div className="relative group">
                    <textarea
                      value={currentAnswer}
                      onChange={e => setCurrentAnswer(e.target.value)}
                      placeholder="Gently type your thoughts..."
                      rows={2}
                      className="w-full bg-transparent border-0 border-b-2 border-slate-200 focus:border-emerald-400 text-lg md:text-xl text-slate-700 font-light placeholder:text-slate-300 outline-none resize-none pb-4 transition-colors duration-300"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleReflectionNext())}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReflectionNext}
                      disabled={!currentAnswer.trim()}
                      className="absolute right-0 bottom-4 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200 disabled:opacity-0 transition-all duration-300 translate-y-2"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── Campus Vibes Anonymous Kudos Marquee ── */}
        <motion.div variants={fadeUp} className="w-full overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 relative flex items-center">
          <div className="absolute left-6 z-20 flex items-center gap-2 bg-emerald-100/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-200 shadow-sm">
            <MessageCircleHeart className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">Campus Vibes</span>
          </div>

          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-emerald-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-teal-50 to-transparent z-10 pointer-events-none" />

          {/* Infinite Marquee */}
          <div className="flex pl-48 space-x-12 animate-marquee whitespace-nowrap">
            {[...kudosData, ...kudosData].map((kudos, i) => (
              <span key={i} className="text-sm md:text-base font-light text-emerald-900/70 inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> {kudos}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Send Anonymous Kudos Form ── */}
          <motion.div variants={fadeUp} className="lg:col-span-1 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
            <h3 className="text-lg font-medium text-slate-800 mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-500" /> Send Kudos
            </h3>
            <p className="text-xs text-slate-500 font-light mb-6 leading-relaxed">Boost a peers day anonymously. Good energy returns.</p>

            <AnimatePresence mode="wait">
              {kudosSent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-32 flex flex-col items-center justify-center text-center bg-emerald-50/50 rounded-2xl border border-emerald-100"
                >
                  <Sparkles className="w-8 h-8 text-emerald-400 mb-2" />
                  <p className="text-sm font-semibold text-emerald-700">Karma Distributed</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <textarea
                    value={kudosText}
                    onChange={e => setKudosText(e.target.value)}
                    rows={3}
                    placeholder="Thanks for explaining that array logic..."
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all resize-none placeholder:text-slate-300 text-slate-700 mb-4 shadow-inner"
                  />
                  <button
                    onClick={sendKudos}
                    disabled={!kudosText.trim()}
                    className="w-full py-3 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors shadow-md"
                  >
                    Send Anonymously
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Memory Lane: Horizontal Polaroid Carousel ── */}
          <motion.div variants={fadeUp} className="lg:col-span-2 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-rose-400" /> Memory Lane
                </h3>
                <p className="text-xs text-slate-500 font-light mt-1">Your past seeds of positivity</p>
              </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 -mx-2 snap-x scrollbar-hide">
              <AnimatePresence>
                {entries.map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="snap-center shrink-0 w-64 md:w-72 bg-white p-4 pb-6 rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 hover:-translate-y-2 transition-transform duration-500 relative group flex flex-col justify-between min-h-[220px]"
                    style={{ transform: `rotate(${idx % 2 === 0 ? '2deg' : '-2deg'})` }} // subtle polaroid rotation
                  >
                    {/* Tape aesthetic */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-4 bg-white/50 backdrop-blur-sm transform rotate-[-2deg] opacity-70 border border-slate-100 shadow-sm" />

                    <div>
                      <Quote className="w-6 h-6 text-slate-100 mb-3" fill="currentColor" />
                      <p className="text-slate-700 font-serif italic text-lg leading-relaxed px-2">"{entry.text}"</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between px-2 pt-4 border-t border-slate-50">
                      <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">{entry.date}</span>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{entry.tag}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Tailwind Marquee Animation Definition inline for convenience */}
      <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
    </div>
  )
}
