'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Save, Trash2, Expand, Settings2, Hash,
  Bold, Italic, Type, List, CheckSquare, AlignLeft, Search,
  ChevronRight, ChevronLeft, Feather, BrainCircuit, Activity,
  RefreshCw, BookOpen
} from 'lucide-react'

// Indian Student Context Prompts
const prompts = [
  { id: 1, text: "How are you balancing family expectations with your personal career goals today?" },
  { id: 2, text: "Write about a moment during placement prep where you felt overwhelmed, and how you managed it." },
  { id: 3, text: "What does 'success' look like to you beyond just your CGPA and package?" },
  { id: 4, text: "Reflect on a time you compared yourself to a batchmate. How did it affect your peace?" },
  { id: 5, text: "What boundaries do you need to set this week to protect your energy in the hostel?" }
]

// CBT Cognitive Distortions
const cbtTags = [
  { id: 'catastrophizing', label: 'Catastrophizing', color: 'bg-rose-100 text-rose-700' },
  { id: 'all-or-nothing', label: 'All-or-Nothing', color: 'bg-purple-100 text-purple-700' },
  { id: 'imposter-syndrome', label: 'Imposter Syndrome', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'fortune-telling', label: 'Fortune Telling', color: 'bg-amber-100 text-amber-700' },
  { id: 'overgeneralization', label: 'Overgeneralization', color: 'bg-teal-100 text-teal-700' },
  { id: 'burnout', label: 'Burnout Indicator', color: 'bg-slate-200 text-slate-700' },
]

interface JournalEntry {
  id: number
  content: string
  tags: string[]
  date: string
  prompt: string | null
  wordCount: number
}

const sampleEntries: JournalEntry[] = [
  {
    id: 1,
    content: "Today was a mix of intense anxiety and small wins. I finally managed to understand Dynamic Programming states which felt great, but the mock interview schedule for tomorrow is making me feel like I don't know anything at all. I need to remember that one bad mock won't define my career.",
    tags: ['Catastrophizing', 'Imposter Syndrome'],
    date: 'Oct 14, 10:30 PM',
    prompt: null,
    wordCount: 52,
  }
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } } }

export default function Journal() {
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0)
  const [entries, setEntries] = useState<JournalEntry[]>(sampleEntries)
  const [view, setView] = useState<'write' | 'entries'>('write')

  // UI States
  const [isSaving, setIsSaving] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFormatting, setShowFormatting] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  // Prompt Carousel Logic
  const nextPrompt = () => setCurrentPromptIdx((prev) => (prev + 1) % prompts.length)
  const prevPrompt = () => setCurrentPromptIdx((prev) => (prev - 1 + prompts.length) % prompts.length)
  const usePrompt = () => {
    const text = `Q: ${prompts[currentPromptIdx].text}\n\n`
    setContent(text)
    editorRef.current?.focus()
  }

  const toggleTag = (id: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const saveEntry = () => {
    if (!content.trim()) return
    setIsSaving(true)

    setTimeout(() => {
      const now = new Date()
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

      const selectedLabels = cbtTags.filter(t => selectedTags.has(t.id)).map(t => t.label)

      setEntries(prev => [{
        id: Date.now(),
        content: content.trim(),
        tags: selectedLabels,
        date: dateStr,
        prompt: content.startsWith('Q:') ? prompts[currentPromptIdx].text : null,
        wordCount,
      }, ...prev])

      setContent('')
      setSelectedTags(new Set())
      setIsSaving(false)
      setView('entries')
    }, 1200) // Simulate saving delay for premium feel
  }

  const deleteEntry = (id: number) => setEntries(prev => prev.filter(e => e.id !== id))

  // Handle Notion-style floating toolbar simulation
  useEffect(() => {
    const handleSelection = () => {
      const text = window.getSelection()?.toString()
      if (text && text.length > 0) {
        setShowFormatting(true)
      } else {
        setShowFormatting(false)
      }
    }
    document.addEventListener('selectionchange', handleSelection)
    return () => document.removeEventListener('selectionchange', handleSelection)
  }, [])

  return (
    <div className={`relative w-full font-sans transition-all duration-700 ease-in-out ${isFullscreen ? 'fixed inset-0 z-50 bg-[#FAFAFA] min-h-screen pt-4 pb-24 overflow-y-auto' : 'min-h-screen pb-32 overflow-hidden'}`}>

      {/* Ambient Background - only in normal view */}
      {!isFullscreen && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' as const }} className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-100 rounded-full blur-[140px]" />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }} className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[140px]" />
        </div>
      )}

      <motion.div variants={container} initial="hidden" animate="show" className={`relative z-10 mx-auto space-y-8 px-4 md:px-8 ${isFullscreen ? 'max-w-5xl' : 'max-w-7xl pt-10'}`}>

        {/* ── Header ── */}
        {!isFullscreen && (
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-indigo-100/30">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center">
                <Feather className="w-6 h-6 text-purple-500" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-1">Mindful Reflections</h1>
                <p className="text-sm text-slate-500 font-light">Your private, judgment-free cognitive sanctuary.</p>
              </div>
            </div>

            {/* View Toggles */}
            <div className="flex bg-slate-100/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-sm">
              {(['write', 'entries'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${view === v ? 'bg-white text-purple-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {v === 'write' ? 'Editor' : 'Archive'}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Main Content Area ── */}
        <AnimatePresence mode="wait">
          {view === 'write' ? (
            <motion.div key="write" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Editor Column */}
              <div className={`space-y-6 ${isFullscreen ? 'lg:col-span-12' : 'lg:col-span-8'}`}>

                {/* AI Guided Prompts Carousel */}
                {!isFullscreen && (
                  <motion.div variants={fadeUp} className="rounded-2xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-purple-100/50 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 group">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1 bg-purple-100/50 p-1.5 rounded-lg shrink-0">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-semibold text-purple-800/60 uppercase tracking-widest mb-1">Focus Prompt</p>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={currentPromptIdx}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm md:text-base text-slate-700 font-medium line-clamp-2 md:line-clamp-none"
                          >
                            "{prompts[currentPromptIdx].text}"
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex">
                        <button onClick={prevPrompt} className="p-2 text-slate-400 hover:text-purple-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={nextPrompt} className="p-2 text-slate-400 hover:text-purple-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                      </div>
                      <div className="hidden xs:block w-px h-6 bg-slate-200 mx-2" />
                      <button onClick={usePrompt} className="text-xs font-semibold px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100 text-purple-600 hover:bg-purple-50 transition-colors whitespace-nowrap">
                        Write About This
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Main Canvas */}
                <motion.div variants={fadeUp} className="relative rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.03)] flex flex-col transition-all duration-500 overflow-hidden" style={{ minHeight: isFullscreen ? '75vh' : '500px' }}>

                  {/* Editor Toolbar (Minimalist) */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/60 bg-white/40 backdrop-blur-md">
                    <div className="flex items-center gap-4 text-slate-400">
                      <button className="hover:text-slate-700 transition-colors"><Type className="w-4 h-4" /></button>
                      <button className="hover:text-slate-700 transition-colors"><Bold className="w-4 h-4" /></button>
                      <button className="hover:text-slate-700 transition-colors"><Italic className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-slate-200" />
                      <button className="hover:text-slate-700 transition-colors"><List className="w-4 h-4" /></button>
                      <button className="hover:text-slate-700 transition-colors"><CheckSquare className="w-4 h-4" /></button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{wordCount} Words</span>
                      <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-slate-400 hover:text-slate-800 transition-colors">
                        <Expand className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Text Area */}
                  <div className="flex-1 relative p-8 md:p-12">
                    <textarea
                      ref={editorRef}
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      placeholder="Write freely. Your thoughts are encrypted and stored locally."
                      className="w-full h-full bg-transparent text-slate-800 text-lg md:text-xl leading-relaxed outline-none resize-none placeholder:text-slate-300 font-serif"
                    />

                    {/* Floating Format Menu Simulation */}
                    <AnimatePresence>
                      {showFormatting && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-slate-800 text-white rounded-xl shadow-2xl flex items-center px-2 py-1.5 gap-1 z-50 pointer-events-none"
                        >
                          <span className="px-2 py-1 text-xs font-medium hover:bg-slate-700 rounded-lg cursor-pointer pointer-events-auto">B</span>
                          <span className="px-2 py-1 text-xs font-medium hover:bg-slate-700 rounded-lg cursor-pointer italic pointer-events-auto">I</span>
                          <span className="px-2 py-1 text-xs font-medium hover:bg-slate-700 rounded-lg cursor-pointer underline pointer-events-auto">U</span>
                          <div className="w-px h-4 bg-slate-600 mx-1" />
                          <span className="px-2 py-1 text-xs font-medium hover:bg-slate-700 rounded-lg cursor-pointer pointer-events-auto"><AlignLeft className="w-3 h-3" /></span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Action Bar */}
                  <div className="p-6 border-t border-slate-100/60 bg-slate-50/50 flex items-center justify-between">
                    <p className="text-xs text-slate-400 flex items-center gap-1.5"><Save className="w-3 h-3" /> Auto-saving to local cache...</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={saveEntry}
                      disabled={!content.trim() || isSaving}
                      className="px-8 py-3 rounded-xl bg-slate-800 text-white font-medium text-sm shadow-lg disabled:opacity-50 transition-all flex items-center gap-2 hover:bg-slate-900"
                    >
                      {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Feather className="w-4 h-4" />}
                      {isSaving ? 'Encrypting & Saving...' : 'Archive Entry'}
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Context & Tagging Sidebar */}
              {!isFullscreen && (
                <div className="lg:col-span-4 space-y-6">

                  {/* CBT Cognitive Tagging */}
                  <motion.div variants={fadeUp} className="rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <BrainCircuit className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-lg font-medium text-slate-800">Cognitive Frameworks</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-light mb-6 leading-relaxed">
                      Select any cognitive distortions present in your current thoughts to build awareness.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {cbtTags.map(tag => {
                        const isActive = selectedTags.has(tag.id)
                        return (
                          <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border ${isActive
                              ? `${tag.color} border-transparent shadow-sm`
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                              }`}
                          >
                            {tag.label}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>

                  {/* Insights Bar */}
                  <motion.div variants={fadeUp} className="rounded-[2rem] bg-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" /> Insights
                      </h3>
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">Keywords of the Week</p>
                        <div className="flex flex-wrap gap-2">
                          {['Placement', 'Interview', 'Stress', 'Hostel'].map((kw, i) => (
                            <span key={i} className="flex items-center gap-1 text-xs font-medium bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-md border border-slate-600/50">
                              <Hash className="w-3 h-3 text-indigo-400" /> {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="h-px w-full bg-slate-700" />

                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">Emotional Trajectory</p>
                        <p className="text-sm font-light text-slate-300 leading-relaxed">
                          Analysis indicates a 15% increase in <span className="text-indigo-300 font-medium">Imposter Syndrome</span> tags prior to weekend coding assessments.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

            </motion.div>
          ) : (
            <motion.div key="entries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-6 lg:max-w-4xl mx-auto">

              {/* Search and Filter */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search archive..." className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-sm outline-none focus:border-indigo-300 transition-colors" />
                </div>
                <button className="p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-slate-500 hover:text-indigo-600 transition-colors">
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>

              {entries.length === 0 ? (
                <div className="rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 p-16 text-center shadow-sm">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-xl font-medium text-slate-700 mb-2">The archive is empty.</p>
                  <p className="text-sm text-slate-500 font-light">Your reflections will be safely stored here.</p>
                </div>
              ) : (
                entries.map((entry, i) => (
                  <motion.div key={entry.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="rounded-[2rem] bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-8 group relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-300 to-purple-300 opacity-50" />

                    <div className="flex items-start justify-between mb-4 pl-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{entry.date}</p>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {entry.tags.map((t, idx) => (
                              <span key={idx} className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100/50">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pl-4">
                      {entry.prompt && (
                        <p className="text-sm font-medium text-slate-800 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {entry.prompt}
                        </p>
                      )}
                      <p className="text-base text-slate-600 leading-relaxed font-serif">{entry.content}</p>
                      <p className="text-[10px] text-slate-400 mt-6 font-semibold uppercase tracking-widest">{entry.wordCount} words</p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
