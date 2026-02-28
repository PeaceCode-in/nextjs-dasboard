'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, Info, Volume2, VolumeX,
  Activity, ArrowRight, Sparkles, Wind, BrainCircuit, Waves
} from 'lucide-react'

interface Phase { label: string; duration: number }
interface Technique {
  id: string; name: string; subtitle: string; tags: string[]
  phases: Phase[]; gradient: string; description: string; science: string
  icon: React.ElementType
}

const techniques: Technique[] = [
  {
    id: 'box', name: 'Box Breathing', subtitle: 'Navy SEAL Technique',
    tags: ['Stress Relief', 'Focus'],
    phases: [{ label: 'Inhale', duration: 4 }, { label: 'Hold', duration: 4 }, { label: 'Exhale', duration: 4 }, { label: 'Hold', duration: 4 }],
    gradient: 'from-purple-100 to-indigo-50 text-indigo-700',
    icon: Wind,
    description: 'Equal-ratio breathing used by Navy SEALs to stay calm under pressure. Perfect before exams or vivas.',
    science: 'Down-regulates the sympathetic nervous system, lowering cortisol levels and inducing a state of parasympathetic dominance. The rigid structure forces cognitive hijacking away from anxious thoughts.',
  },
  {
    id: '478', name: '4-7-8 Breathing', subtitle: 'Anxiety Relief',
    tags: ['Anxiety', 'Sleep'],
    phases: [{ label: 'Inhale', duration: 4 }, { label: 'Hold', duration: 7 }, { label: 'Exhale', duration: 8 }],
    gradient: 'from-blue-100 to-cyan-50 text-cyan-700',
    icon: Waves,
    description: "Dr. Andrew Weil's relaxation technique. Ideal for calming anxiety before placements or presentations.",
    science: 'Strongly activates the vagus nerve through the prolonged exhale, signaling the heart to slow down and promoting the deep relaxation necessary for sleep transition or panic cessation.',
  },
  {
    id: 'nadi', name: 'Nadi Shodhana', subtitle: 'Alternate Nostril',
    tags: ['Balance', 'Clarity'],
    phases: [{ label: 'Left Inhale', duration: 4 }, { label: 'Hold', duration: 2 }, { label: 'Right Exhale', duration: 4 }, { label: 'Right Inhale', duration: 4 }, { label: 'Hold', duration: 2 }, { label: 'Left Exhale', duration: 4 }],
    gradient: 'from-emerald-100 to-teal-50 text-teal-700',
    icon: Activity,
    description: 'Ancient pranayama to balance both brain hemispheres. Great between long study sessions.',
    science: 'Synchronizes the autonomic nervous system and balances hemispheric brain activity. Studies show it improves spatial orientation, cognitive focus, and emotional regulation.',
  },
  {
    id: 'resonant', name: 'Resonant Breathing', subtitle: 'Coherent Breathing',
    tags: ['Heart Rate', 'Calm'],
    phases: [{ label: 'Inhale', duration: 5 }, { label: 'Exhale', duration: 5 }],
    gradient: 'from-rose-100 to-pink-50 text-pink-700',
    icon: Activity,
    description: 'Breathe at 5–6 breaths/minute to optimise heart rate variability. Deep restorative calm.',
    science: 'Aligns breathing rate exactly with the bodys baroreflex (blood pressure regulation), maximizing cardiovascular efficiency and heart rate variability (HRV) for systemic physiological coherence.',
  },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } } }

export default function Breathe() {
  const [selected, setSelected] = useState<Technique | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [phaseTimer, setPhaseTimer] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [muted, setMuted] = useState(false)
  const [expandedScience, setExpandedScience] = useState<string | null>(null)

  // SOS State
  const [isSosActive, setIsSosActive] = useState(false)
  const [sosPhase, setSosPhase] = useState<'Inhale' | 'Exhale'>('Inhale')

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sosIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const phase = selected?.phases[phaseIdx]

  const cleanup = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (sosIntervalRef.current) { clearInterval(sosIntervalRef.current); sosIntervalRef.current = null }
  }, [])

  const start = useCallback(() => { setIsActive(true); setIsPaused(false) }, [])
  const reset = useCallback(() => {
    cleanup()
    setIsActive(false)
    setIsPaused(false)
    setPhaseIdx(0)
    setPhaseTimer(0)
    setCycles(0)
    setIsSosActive(false)
  }, [cleanup])

  // Main Technique Logic
  useEffect(() => {
    if (!selected || !isActive || isPaused) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setPhaseTimer(prev => {
        if (prev + 1 >= selected.phases[phaseIdx].duration) {
          setPhaseIdx(pi => { if (pi + 1 >= selected.phases.length) { setCycles(c => c + 1); return 0 } return pi + 1 })
          return 0
        }
        return prev + 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [selected, isActive, isPaused, phaseIdx])

  // SOS Logic (5s Inhale, 5s Exhale)
  useEffect(() => {
    if (!isSosActive) { if (sosIntervalRef.current) clearInterval(sosIntervalRef.current); return }

    let inhale = true;
    setSosPhase('Inhale')

    sosIntervalRef.current = setInterval(() => {
      inhale = !inhale;
      setSosPhase(inhale ? 'Inhale' : 'Exhale')
    }, 5000)

    // Auto stop SOS after 1 minute
    const timeout = setTimeout(() => {
      reset()
    }, 60000)

    return () => {
      if (sosIntervalRef.current) clearInterval(sosIntervalRef.current)
      clearTimeout(timeout)
    }
  }, [isSosActive, reset])

  const toggleScience = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedScience(expandedScience === id ? null : id)
  }

  // Chart Data Generation
  const chartData = [65, 58, 62, 55, 60, 52, 58, 48, 50, 45, 48, 42, 45, 40] // Simulating HR dropping
  const maxData = Math.max(...chartData)
  const minData = Math.min(...chartData)

  /* ── Selection View ── */
  if (!selected && !isSosActive) return (
    <div className="relative w-full min-h-screen font-sans pb-24 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' as const }} className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[140px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }} className="absolute bottom-[0%] left-[10%] w-[60%] h-[60%] bg-purple-100 rounded-full blur-[140px]" />
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-6xl mx-auto space-y-12 px-4 md:px-8 pt-10">

        {/* ── Interactive Hero SOS Pacer ── */}
        <motion.div variants={fadeUp} className="relative w-full rounded-[2.5rem] bg-indigo-900 overflow-hidden shadow-2xl p-8 md:p-14 py-20 md:py-24 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

          {/* Glowing Breathing Halo */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center">
            <Wind className="w-12 h-12 text-indigo-300 mb-6 opacity-80" strokeWidth={1} />
            <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight mb-4">
              Prana <span className="font-semibold text-indigo-200">Pacer</span>
            </h1>
            <p className="text-indigo-200/80 text-base md:text-lg font-light max-w-lg mb-10">
              Find your center instantly. Take a 1-minute SOS breathing session to lower cortisol and reset your nervous system.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSosActive(true)}
              className="px-8 py-4 rounded-full bg-white text-indigo-900 font-medium shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow duration-300 flex items-center gap-3"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Start Quick SOS
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Technique Library (Bento Grid) ── */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Breathing Protocols
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {techniques.map(t => {
                const Icon = t.icon
                const isExpanded = expandedScience === t.id

                return (
                  <motion.div
                    key={t.id}
                    className="rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(167,139,250,0.1)] transition-all duration-500 overflow-hidden flex flex-col relative group"
                  >
                    <div
                      className="p-6 md:p-8 cursor-pointer flex-1 flex flex-col h-full"
                      onClick={() => setSelected(t)}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <button
                          onClick={(e) => toggleScience(t.id, e)}
                          className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-xl font-medium text-slate-800 tracking-tight group-hover:text-purple-700 transition-colors mb-1">{t.name}</h3>
                      <p className="text-sm text-slate-500 font-light mb-4">{t.subtitle}</p>
                      <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-1 line-clamp-2">{t.description}</p>

                      <div className="flex gap-2 mt-auto">
                        {t.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 font-medium bg-white/50">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Science Section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50/80 border-t border-slate-100/50"
                        >
                          <div className="p-6 pt-5">
                            <div className="flex items-center gap-2 mb-2">
                              <BrainCircuit className="w-4 h-4 text-purple-500" />
                              <span className="text-xs font-semibold text-purple-800 uppercase tracking-widest">The Neuroscience</span>
                            </div>
                            <p className="text-sm text-slate-600 font-light leading-relaxed">
                              {t.science}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* ── Respiratory Resilience Widget ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="px-2">
              <h2 className="text-2xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-500" />
                Respiratory Vitals
              </h2>
            </div>

            <div className="rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-8 flex flex-col gap-8">

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100/50">
                  <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest mb-1">Current Streak</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-slate-800">12</span>
                    <span className="text-sm text-slate-500 font-medium">Days</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50">
                  <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest mb-1">Mindful Mins</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-slate-800">145</span>
                    <span className="text-sm text-slate-500 font-medium">Min</span>
                  </div>
                </div>
              </div>

              {/* HR Chart Simulation */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-slate-700">Pre/Post Session HR Drop</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
                    <ArrowRight className="w-3 h-3 rotate-[135deg]" /> -12%
                  </div>
                </div>

                <div className="h-32 w-full relative flex items-end justify-between pt-4">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Generate path dynamically */}
                    <path
                      d={`M 0,100 L ${chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((d - minData + 5) / (maxData - minData + 10)) * 100}`).join(' L ')} L 100,100 Z`}
                      fill="url(#areaGradient)"
                    />

                    <path
                      d={`M ${chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((d - minData + 5) / (maxData - minData + 10)) * 100}`).join(' L ')}`}
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex justify-between mt-2 text-[10px] uppercase font-semibold text-slate-400 tracking-widest">
                  <span>Pre (85 BPM)</span>
                  <span>Post (65 BPM)</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </motion.div>
    </div>
  )

  /* ── Active Session View (SOS or Specific Technique) ── */
  const isSos = isSosActive
  const activeGradient = isSos ? 'from-indigo-400 to-purple-400' : selected!.gradient.replace(' text-', ' from-').replace('100 to-', '400 to-').replace('50', '400').split(' ')[0] + ' ' + selected!.gradient.split(' ')[1].replace('50', '400')
  const activeIconColor = isSos ? 'text-indigo-600' : selected!.gradient.split(' ').pop()

  const currentLabel = isSos ? sosPhase : (isActive ? phase?.label : 'Ready')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="fixed inset-0 z-50 bg-[#fafafa] flex flex-col overflow-hidden">

      {/* Massive breathing background blur */}
      <motion.div
        animate={{
          scale: (isSos || isActive) && !isPaused ? (currentLabel === 'Inhale' || currentLabel === 'Hold' ? 1.2 : 0.8) : 1,
          opacity: (isSos || isActive) ? 0.4 : 0.2
        }}
        transition={{ duration: isSos ? 5 : (phase?.duration || 4), ease: 'easeInOut' as const }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] rounded-full bg-gradient-to-br ${activeGradient} blur-[120px] pointer-events-none`}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-8">
        <button
          onClick={reset}
          className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-slate-400 hover:text-slate-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> End Session
        </button>
        <div className="text-center absolute left-1/2 -translate-x-1/2 top-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{isSos ? 'SOS Pacer' : selected?.subtitle}</p>
          <h2 className="text-lg font-medium text-slate-800">{isSos ? '1-Minute Reset' : selected?.name}</h2>
        </div>
        <button onClick={() => setMuted(!muted)} className="p-3 rounded-full hover:bg-slate-100 transition-colors shadow-sm bg-white border border-slate-200">
          {!muted ? <Volume2 className="w-4 h-4 text-slate-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Central Breathing UI */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">

        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* Expanding Ring */}
          <motion.div
            animate={{
              scale: (isSos || isActive) && !isPaused ? (currentLabel === 'Inhale' || currentLabel === 'Hold' ? 1.5 : 0.8) : 1,
              borderColor: (isSos || isActive) ? 'rgba(139, 92, 246, 0.4)' : 'rgba(226, 232, 240, 1)'
            }}
            transition={{ duration: isSos ? 5 : (phase?.duration || 4), ease: 'easeInOut' as const }}
            className="absolute inset-0 rounded-full border-2 border-slate-200 shadow-[0_0_60px_rgba(0,0,0,0.02)]"
          />

          {/* Core Circle */}
          <motion.div
            animate={{
              scale: (isSos || isActive) && !isPaused ? (currentLabel === 'Inhale' ? 1.3 : currentLabel === 'Hold' ? 1.3 : 1) : 1
            }}
            transition={{ duration: isSos ? 5 : (phase?.duration || 4), ease: 'easeInOut' as const }}
            className="absolute w-40 h-40 md:w-48 md:h-48 rounded-full bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white flex flex-col items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLabel || 'ready'}
                initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <h1 className={`text-2xl md:text-3xl font-light tracking-tight ${activeIconColor}`}>
                  {currentLabel}
                </h1>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Status/Timer */}
        <div className="mt-20 text-center h-24">
          {isSos && (
            <p className="text-slate-500 font-light">Breathe fully. The session will auto-close in 1 min.</p>
          )}
          {!isSos && isActive && phase && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-6xl md:text-7xl font-light text-slate-800 tabular-nums tracking-tighter">
                {phase.duration - phaseTimer}
              </p>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-4">
                Cycle {cycles + 1}
              </p>
            </motion.div>
          )}
        </div>

      </div>

      {/* Footer Controls (For Specific Technique only) */}
      {!isSos && (
        <div className="relative z-10 pb-12 pt-6 px-6 flex flex-col items-center gap-8">
          {/* Phase timeline dots */}
          <div className="flex gap-2">
            {selected?.phases.map((p, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === phaseIdx && isActive ? 'w-8 bg-purple-500' : 'w-2 bg-slate-200'}`}
              />
            ))}
          </div>

          {!isActive ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={start}
              className={`px-12 py-5 rounded-full bg-slate-800 text-white font-medium shadow-xl shadow-slate-200 flex items-center gap-3 text-lg hover:bg-slate-900 transition-colors`}
            >
              <Play className="w-5 h-5" fill="currentColor" /> Begin Session
            </motion.button>
          ) : (
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPaused(!isPaused)}
                className="px-8 py-4 rounded-full bg-slate-800 text-white font-medium shadow-xl flex items-center gap-2 hover:bg-slate-900 transition-colors"
              >
                {isPaused ? <Play className="w-4 h-4" fill="currentColor" /> : <Pause className="w-4 h-4" fill="currentColor" />}
                {isPaused ? 'Resume' : 'Pause'}
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* SOS Active Footer Space */}
      {isSos && <div className="h-32" />}
    </motion.div>
  )
}
