'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, RotateCcw, Plus, Check, CloudRain,
  BookOpen, Music, Wind, Flame, SlidersHorizontal,
  AlertTriangle, Target, CheckCircle2, Circle
} from 'lucide-react'

type TimerMode = 'focus25' | 'focus50' | 'short' | 'long'
const modes: Record<TimerMode, { label: string; duration: number; gradient: string }> = {
  focus25: { label: 'Pomodoro 25m', duration: 25 * 60, gradient: 'from-indigo-400 to-purple-500' },
  focus50: { label: 'Deep Work 50m', duration: 50 * 60, gradient: 'from-violet-500 to-fuchsia-500' },
  short: { label: 'Short Break 5m', duration: 5 * 60, gradient: 'from-teal-400 to-emerald-500' },
  long: { label: 'Long Break 15m', duration: 15 * 60, gradient: 'from-amber-400 to-orange-500' },
}

interface SubTask { id: number; text: string; done: boolean }
interface Task { id: number; text: string; done: boolean; subtasks: SubTask[]; estimate: number }

const initialTasks: Task[] = [
  {
    id: 1, text: 'Complete OS Module 4', done: false, estimate: 3,
    subtasks: [{ id: 11, text: 'Read notes', done: true }, { id: 12, text: 'Solve PYQs', done: false }]
  },
  {
    id: 2, text: 'Revise Aptitude Set A', done: false, estimate: 1,
    subtasks: []
  }
]

const soundscapes = [
  { id: 'rain', label: 'Monsoon Rain', icon: CloudRain },
  { id: 'library', label: 'Library Buzz', icon: BookOpen },
  { id: 'brown', label: 'Brown Noise', icon: Music },
  { id: 'wind', label: 'Himalayan Wind', icon: Wind },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } } }

export default function Focus() {
  const [mode, setMode] = useState<TimerMode>('focus25')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)

  // Audio Mixer State
  const [volumes, setVolumes] = useState<Record<string, number>>({ rain: 0, library: 0, brown: 0, wind: 0 })

  // Task State
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [expandedTask, setExpandedTask] = useState<number | null>(null)

  // Distraction Logger
  const [distractions, setDistractions] = useState(0)
  const [recentDistraction, setRecentDistraction] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalTime = modes[mode].duration
  const progress = timeLeft / totalTime
  const radius = 140
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress * circumference)
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setRunning(false)
          if (mode === 'focus25' || mode === 'focus50') {
            setMode('short')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode])

  const switchMode = (m: TimerMode) => { setMode(m); setTimeLeft(modes[m].duration); setRunning(false) }
  const resetTimer = () => { setTimeLeft(modes[mode].duration); setRunning(false) }

  const updateVolume = (id: string, vol: number) => {
    setVolumes(prev => ({ ...prev, [id]: vol }))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    setTasks(p => [...p, { id: Date.now(), text: newTask.trim(), done: false, subtasks: [], estimate: 1 }])
    setNewTask('')
    setShowAdd(false)
  }

  const toggleTask = (id: number) => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const toggleSubtask = (taskId: number, subId: number) => {
    setTasks(p => p.map(t => t.id === taskId ? {
      ...t, subtasks: t.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s)
    } : t))
  }

  const logDistraction = () => {
    setDistractions(d => d + 1)
    setRecentDistraction(true)
    setTimeout(() => setRecentDistraction(false), 2000)
  }

  const completedTasks = tasks.filter(t => t.done).length

  // Simulated Focus Quality Data (Based on distractions and time)
  const chartData = [80, 85, 90, 70, 75, 88, 92, 95] // Focus score out of 100
  const maxData = 100
  const minData = 50

  return (
    <div className="relative w-full min-h-screen font-sans pb-32 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' as const }} className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] bg-indigo-100 rounded-full blur-[140px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }} className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-amber-100 rounded-full blur-[140px]" />
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-7xl mx-auto space-y-8 px-4 md:px-8 pt-10">

        {/* ── Header ── */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-indigo-100/30">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-1">Deep Work Studio</h1>
              <p className="text-sm text-slate-500 font-light">Engineered for absolute concentration. Enter your flow state.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Left Column: Timer & Analytics ── */}
          <div className="lg:col-span-7 space-y-8">

            {/* ── Massive Glowing Timer ── */}
            <motion.div variants={fadeUp} className="rounded-[2.5rem] bg-white/50 backdrop-blur-2xl border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.05)] p-10 flex flex-col items-center relative overflow-hidden">
              {/* Inner ambient glow */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br ${modes[mode].gradient} blur-[100px] opacity-20 transition-all duration-1000`} />

              {/* Mode Selector */}
              <div className="flex bg-slate-100/50 backdrop-blur-md p-1.5 rounded-3xl border border-white/60 shadow-inner mb-12 relative z-10 overflow-x-auto max-w-full scrollbar-hide flex-wrap justify-center gap-y-1">
                {(Object.keys(modes) as TimerMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest transition-colors duration-300 shrink-0 ${mode === m ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {mode === m && (
                      <motion.div
                        layoutId="timerMode"
                        className={`absolute inset-0 bg-gradient-to-r ${modes[m].gradient} shadow-md rounded-full`}
                      />
                    )}
                    <span className="relative z-10">{modes[m].label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Circular SVG Ring */}
              <div className="relative w-[320px] h-[320px] mb-12 z-10">
                <svg width="320" height="320" className="-rotate-90 drop-shadow-2xl">
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={mode === 'focus25' || mode === 'focus50' ? '#6366f1' : '#14b8a6'} />
                      <stop offset="100%" stopColor={mode === 'focus25' || mode === 'focus50' ? '#a855f7' : '#10b981'} />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <circle cx="160" cy="160" r={radius} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
                  <circle cx="160" cy="160" r={radius} fill="none" stroke="url(#ringGrad)" strokeWidth="8"
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    filter="url(#glow)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-7xl font-light text-slate-800 tabular-nums tracking-tighter mb-2">
                    {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                  </p>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">{modes[mode].label}</p>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-4 z-10">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setRunning(!running)}
                  className={`flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r ${modes[mode].gradient} text-white font-medium shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300`}
                >
                  {running ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5" fill="currentColor" />}
                  <span className="text-lg">{running ? 'Pause Work' : timeLeft < totalTime ? 'Resume Work' : 'Start Focus'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="p-5 rounded-full bg-white text-slate-500 shadow-md border border-slate-100 hover:text-indigo-600 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* ── Focus Quality & Distraction Logger ── */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-1">Distraction Logger</h3>
                  <p className="text-xs text-slate-500 font-light mb-6">Lost focus? Log it to build awareness.</p>
                </div>
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                    onClick={logDistraction}
                    className={`w-full py-4 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-2 ${recentDistraction ? 'bg-orange-50 border-orange-300 text-orange-600' : 'bg-white/50 border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                  >
                    <AlertTriangle className={`w-6 h-6 ${recentDistraction ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span className="font-medium">{recentDistraction ? 'Distraction Logged' : 'I Got Distracted'}</span>
                  </motion.button>
                </div>
                <div className="flex items-center justify-between mt-6 px-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Session Total</span>
                  <span className="text-2xl font-light text-slate-800">{distractions}</span>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-6">Focus Quality Trend</h3>
                <div className="h-32 w-full relative">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Generate path dynamically */}
                    <path
                      d={`M 0,100 L ${chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 100
                        const y = 100 - ((d - minData + 5) / (maxData - minData + 10)) * 100
                        return `${x},${y}`
                      }).join(' L ')} L 100,100 Z`}
                      fill="url(#focusGradient)"
                    />

                    <path
                      d={`M ${chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 100
                        const y = 100 - ((d - minData + 5) / (maxData - minData + 10)) * 100
                        return `${x},${y}`
                      }).join(' L ')}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Current Point */}
                    <circle cx="100" cy={100 - ((chartData[chartData.length - 1] - minData + 5) / (maxData - minData + 10)) * 100} r="3" fill="#10b981" />
                  </svg>
                </div>
              </div>
            </motion.div>

          </div>


          {/* ── Right Column: Mixer & Tasks ── */}
          <div className="lg:col-span-5 space-y-8">

            {/* ── Advanced Audio Mixer ── */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-light text-slate-800 flex items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                  Audio Mixer
                </h3>
              </div>

              <div className="space-y-6">
                {soundscapes.map(s => {
                  const Icon = s.icon
                  const vol = volumes[s.id]
                  const isActive = vol > 0

                  return (
                    <div key={s.id} className="flex items-center gap-4 group">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? 'bg-indigo-500 shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium transition-colors ${isActive ? 'text-indigo-900' : 'text-slate-500'}`}>{s.label}</span>
                          <span className="text-[10px] font-semibold text-slate-400">{vol}%</span>
                        </div>
                        {/* Custom Slider */}
                        <div className="relative h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                            style={{ width: `${vol}%` }}
                          />
                          <input
                            type="range"
                            min="0" max="100"
                            value={vol}
                            onChange={(e) => updateVolume(s.id, parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* ── Advanced Tasking (Kanban Lite) ── */}
            <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 flex flex-col h-[500px]">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-light text-slate-800">Mission Control</h3>
                  <p className="text-xs text-slate-500 mt-1">{completedTasks} of {tasks.length} tasks completed</p>
                </div>
                <button
                  onClick={() => setShowAdd(true)}
                  className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  animate={{ width: tasks.length ? `${(completedTasks / tasks.length) * 100}%` : '0%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' as const }}
                />
              </div>

              {/* Add Task Input */}
              <AnimatePresence>
                {showAdd && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="flex gap-2 bg-white p-2 rounded-2xl border border-indigo-100 shadow-sm">
                      <input
                        value={newTask}
                        onChange={e => setNewTask(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                        placeholder="What needs deep work?"
                        autoFocus
                        className="flex-1 px-4 py-2 bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-700"
                      />
                      <button onClick={addTask} className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium text-sm hover:bg-indigo-600 transition-colors">Add</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Task List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                <AnimatePresence>
                  {tasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`rounded-2xl border transition-all duration-500 ${task.done ? 'bg-slate-50/50 border-transparent opacity-60' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                      <div className="p-4 flex items-start gap-4">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${task.done ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 text-transparent hover:border-indigo-400'}`}
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={3} fill="currentColor" />
                        </button>

                        <div className="flex-1 cursor-pointer" onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium transition-all duration-500 ${task.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                              {task.text}
                            </span>
                          </div>

                          {!task.done && (
                            <div className="flex gap-2">
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Flame className="w-3 h-3 text-orange-400" /> {task.estimate} Pomodoros
                              </span>
                              {task.subtasks.length > 0 && (
                                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  Subtasks
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subtasks Accordion */}
                      <AnimatePresence>
                        {expandedTask === task.id && task.subtasks.length > 0 && !task.done && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-slate-50/50 border-t border-slate-100 rounded-b-2xl"
                          >
                            <div className="p-4 pl-12 space-y-2">
                              {task.subtasks.map(sub => (
                                <div key={sub.id} className="flex items-center gap-3">
                                  <button onClick={() => toggleSubtask(task.id, sub.id)}>
                                    {sub.done ? <CheckCircle2 className="w-4 h-4 text-indigo-500" /> : <Circle className="w-4 h-4 text-slate-300" />}
                                  </button>
                                  <span className={`text-xs ${sub.done ? 'line-through text-slate-400' : 'text-slate-600'}`}>{sub.text}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {tasks.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Target className="w-8 h-8 mb-2 opacity-50" strokeWidth={1} />
                    <p className="text-sm font-light">No active missions.</p>
                  </div>
                )}
              </div>

            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
