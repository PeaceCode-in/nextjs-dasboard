'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookMarked, Headphones, PlayCircle, BookOpen,
    Bookmark, Clock, X,
    Search, Sparkles, TrendingUp, Star, ExternalLink,
    Eye, Grid3X3, List, Download,
} from 'lucide-react'

/* ─── TYPES ─── */

interface Resource {
    id: string; title: string; description: string; duration: string
    category: 'listen' | 'watch' | 'read'
    gradient: string; thumbnail: string
    saved: boolean; tag?: string; author: string
    rating: number; views: number; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

/* ─── ART THUMBNAILS (CSS gradient art) ─── */

const thumb = {
    body_scan: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    lofi: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    podcast: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    pmr: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    rain: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    family: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    doom: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    cbt_video: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    imposter: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
    sleep: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    eating: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    culture: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    cbt_read: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    gratitude: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
    study: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)',
    panic: 'linear-gradient(135deg, #fae8ff 0%, #f5d0fe 100%)',
    assertive: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    detox: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
}

/* ─── RESOURCE DATA ─── */

const resources: Resource[] = [
    { id: 'l1', title: 'Guided Body Scan for Exam Anxiety', description: 'A 10-minute guided relaxation to release tension before your paper. Uses progressive scanning to calm the nervous system.', duration: '10 min', category: 'listen', gradient: 'from-violet-100 to-purple-50', thumbnail: thumb.body_scan, saved: false, tag: 'Popular', author: 'Dr. Meera Sharma', rating: 4.8, views: 12400, difficulty: 'Beginner' },
    { id: 'l2', title: 'Lo-Fi Study Beats — Midnight Mix', description: 'Ambient beats for deep focus sessions. No lyrics, no distractions — just the perfect study companion.', duration: '2 hr', category: 'listen', gradient: 'from-indigo-100 to-blue-50', thumbnail: thumb.lofi, saved: false, author: 'PeaceCode Studio', rating: 4.9, views: 28300, difficulty: 'Beginner' },
    { id: 'l3', title: 'Managing Placement Rejection', description: 'Podcast by Dr. Ritu Sharma on building resilience after job rejections. Features real student stories.', duration: '28 min', category: 'listen', gradient: 'from-pink-100 to-rose-50', thumbnail: thumb.podcast, saved: false, tag: 'New', author: 'Dr. Ritu Sharma', rating: 4.7, views: 8900, difficulty: 'Intermediate' },
    { id: 'w1', title: 'The Dopamine Cycle of Doom-Scrolling', description: 'Why you can\'t stop scrolling reels at 2AM and the neuroscience behind breaking the cycle.', duration: '12 min', category: 'watch', gradient: 'from-red-100 to-pink-50', thumbnail: thumb.doom, saved: false, tag: 'Must Watch', author: 'NeuroNerd Labs', rating: 4.9, views: 41000, difficulty: 'Beginner' },
    { id: 'w2', title: 'CBT for Exam Anxiety — Visual Guide', description: 'Animated explainer on how Cognitive Behavioral Therapy can transform your test anxiety.', duration: '8 min', category: 'watch', gradient: 'from-blue-100 to-indigo-50', thumbnail: thumb.cbt_video, saved: false, author: 'PeaceCode Academy', rating: 4.7, views: 19800, difficulty: 'Intermediate' },
    { id: 'r1', title: 'CBT Thought Record Worksheet', description: 'Printable worksheet to identify and challenge negative automatic thoughts. Evidence-based and therapist-approved.', duration: '15 min read', category: 'read', gradient: 'from-emerald-100 to-teal-50', thumbnail: thumb.cbt_read, saved: false, tag: 'Essential', author: 'PeaceCode Team', rating: 4.8, views: 21400, difficulty: 'Intermediate' },
]

const categories = [
    { id: 'all' as const, label: 'All', icon: Grid3X3 },
    { id: 'listen' as const, label: 'Listen', icon: Headphones },
    { id: 'watch' as const, label: 'Watch', icon: PlayCircle },
    { id: 'read' as const, label: 'Read', icon: BookOpen },
]

/* ─── ANIMATIONS ─── */
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }

/* ─── HELPERS ─── */

function formatViews(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return String(n)
}

const difficultyColor: Record<string, string> = {
    Beginner: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Intermediate: 'bg-amber-50 text-amber-600 border-amber-100',
    Advanced: 'bg-red-50 text-red-600 border-red-100',
}

const categoryIcon: Record<string, React.ReactNode> = {
    listen: <Headphones className="w-6 h-6 text-slate-700 opacity-60 mix-blend-multiply" strokeWidth={1.5} />,
    watch: <PlayCircle className="w-6 h-6 text-slate-700 opacity-60 mix-blend-multiply" strokeWidth={1.5} />,
    read: <BookOpen className="w-6 h-6 text-slate-700 opacity-60 mix-blend-multiply" strokeWidth={1.5} />,
}

/* ─── MAIN COMPONENT ─── */

export default function Resources() {
    const [items, setItems] = useState(resources)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<'all' | 'listen' | 'watch' | 'read'>('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

    const toggleSave = (id: string) => setItems(prev => prev.map(r => r.id === id ? { ...r, saved: !r.saved } : r))

    const filtered = items.filter(r => {
        const matchSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase()) || r.author.toLowerCase().includes(searchQuery.toLowerCase())
        const matchCat = activeCategory === 'all' || r.category === activeCategory
        return matchSearch && matchCat
    })

    const savedCount = items.filter(r => r.saved).length

    return (
        <div className="relative w-full min-h-screen font-sans overflow-hidden pb-32">
            {/* Ethereal Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' as const }} className="absolute -top-[10%] -right-[10%] w-[60%] h-[70%] bg-blue-100 rounded-full blur-[140px]" />
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }} className="absolute bottom-[0%] -left-[10%] w-[50%] h-[60%] bg-purple-100 rounded-full blur-[140px]" />
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-5xl mx-auto space-y-10 px-4 md:px-8 pt-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-purple-100/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center">
                            <BookMarked className="w-5 h-5 text-slate-700" strokeWidth={1.2} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-light text-slate-800 tracking-tight mb-0.5">Resource Library</h1>
                            <p className="text-[13px] text-slate-500 font-light">Curated tools and knowledge for your mental wellbeing.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/60 border border-white/80 rounded-full text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                            <Sparkles className="w-3 h-3 text-amber-400" strokeWidth={1.2} /> {resources.length} items
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" strokeWidth={1.2} />
                            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-1.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/80 text-xs text-slate-600 outline-none focus:bg-white/80 transition-all w-48 md:w-64" />
                        </div>
                        {savedCount > 0 && (
                            <span className="text-[10px] font-medium uppercase tracking-widest text-indigo-600 bg-white/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                                <Bookmark className="w-3.5 h-3.5 fill-indigo-500" /> {savedCount} saved
                            </span>
                        )}
                        <div className="flex items-center border border-white/80 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Grid3X3 className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
                        </div>
                    </div>
                </motion.div>

                {/* ── FEATURED BANNER (Light & Elegant) ── */}
                <motion.div variants={fadeUp}>
                    <div className="rounded-[2rem] p-8 md:p-10 bg-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="relative z-10 w-full max-w-xl">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <Sparkles className="w-4 h-4 text-indigo-400" strokeWidth={1.5} />
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Featured Collection</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-light text-slate-800 mb-3 tracking-tight">Placement Season Survival Kit</h2>
                            <p className="text-sm font-light text-slate-500 leading-relaxed mb-6">
                                Meditations, coping strategies, and psychoed videos tailored for the high-stress placement season. Navigating rejection, pressure, and interviews calmly.
                            </p>
                            <button className="px-6 py-2 rounded-xl bg-white/80 backdrop-blur-md text-slate-700 text-[11px] font-medium uppercase tracking-widest hover:bg-white transition-all border border-slate-200/50 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-center gap-2 w-max">
                                Explore Collection <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="hidden md:flex relative shrink-0">
                            <div className="w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-[2rem] shadow-inner border border-white/60 flex items-center justify-center rotate-3 transform hover:rotate-6 transition-all duration-700">
                                <BookOpen className="w-12 h-12 text-indigo-300 mix-blend-multiply opacity-50" strokeWidth={1} />
                            </div>
                            <div className="absolute top-8 -left-12 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-[2rem] shadow-inner border border-white/60 flex items-center justify-center -rotate-6 transform hover:-rotate-3 transition-all duration-700">
                                <Headphones className="w-10 h-10 text-teal-300 mix-blend-multiply opacity-50" strokeWidth={1} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── SEARCH + CATEGORY TABS ── */}
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-purple-100/30 pt-6">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                        {categories.map((cat) => {
                            const Icon = cat.icon
                            const isActive = activeCategory === cat.id
                            return (
                                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-medium uppercase tracking-widest transition-all duration-300 shrink-0 ${isActive
                                        ? 'bg-slate-800 text-white shadow-md'
                                        : 'bg-white/40 backdrop-blur-md text-slate-500 hover:bg-white hover:text-slate-700 border border-white/60'
                                        }`}>
                                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={isActive ? 2 : 1.5} /> {cat.label}
                                </button>
                            )
                        })}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search resources..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/80 focus:border-indigo-300 focus:bg-white/80 outline-none text-sm text-slate-700 transition-all duration-300 placeholder-slate-400 font-light shadow-[0_4px_20px_rgba(0,0,0,0.02)]" />
                    </div>
                </motion.div>

                {/* ── GRID VIEW (Delicate) ── */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((item, idx) => (
                            <motion.div key={item.id} variants={fadeUp} custom={idx}>
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    onClick={() => setSelectedResource(item)}
                                    className="w-full h-full text-left rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(167,139,250,0.1)] transition-all duration-500 flex flex-col cursor-pointer overflow-hidden group"
                                >
                                    {/* Delicate Thumbnail */}
                                    <div className="relative h-40 overflow-hidden flex items-center justify-center border-b border-white/40 transition-transform duration-500 group-hover:scale-[1.02]"
                                        style={{ background: item.thumbnail }}>
                                        <div className="relative z-10 opacity-40 group-hover:scale-110 transition-transform duration-700 ease-out">{categoryIcon[item.category]}</div>

                                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-white/50 backdrop-blur-md border border-white/60 text-slate-700 text-[9px] font-medium uppercase tracking-widest rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                                            <Clock className="w-3 h-3" strokeWidth={1.5} /> {item.duration}
                                        </div>

                                        <motion.button whileTap={{ scale: 0.8 }}
                                            onClick={(e) => { e.stopPropagation(); toggleSave(item.id) }}
                                            className="absolute top-3 right-3 p-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white transition-colors shadow-sm">
                                            <Bookmark className={`w-3.5 h-3.5 transition-all ${item.saved ? 'text-indigo-500 fill-indigo-500' : 'text-slate-400'}`} strokeWidth={item.saved ? 2 : 1.5} />
                                        </motion.button>
                                    </div>

                                    {/* Delicate Body */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[9px] uppercase font-medium tracking-widest px-2 py-0.5 rounded-lg border ${difficultyColor[item.difficulty]}`}>{item.difficulty}</span>
                                            {item.tag && <span className="text-[9px] font-medium uppercase tracking-widest text-slate-500 bg-slate-100/50 px-2 py-0.5 rounded-lg border border-slate-200">{item.tag}</span>}
                                        </div>
                                        <h3 className="text-base font-medium text-slate-800 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.title}</h3>
                                        <p className="text-[13px] font-light text-slate-500 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{item.author}</span>
                                            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> {formatViews(item.views)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ── LIST VIEW ── */}
                {viewMode === 'list' && (
                    <div className="space-y-4">
                        {filtered.map((item) => (
                            <motion.button key={item.id} whileHover={{ x: 4 }} onClick={() => setSelectedResource(item)}
                                className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/40 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white/60 hover:shadow-[0_8px_30px_rgba(167,139,250,0.06)] transition-all duration-300 cursor-pointer text-left group">
                                <div className="w-16 h-16 rounded-[1rem] overflow-hidden shrink-0 flex items-center justify-center relative border border-white/40"
                                    style={{ background: item.thumbnail }}>
                                    <div className="relative z-10 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                        {categoryIcon[item.category]}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{item.title}</h3>
                                        {item.tag && <span className="text-[9px] text-slate-500 font-medium uppercase tracking-widest bg-slate-100/50 border border-slate-200/50 px-2 py-0.5 rounded-md shrink-0">{item.tag}</span>}
                                    </div>
                                    <p className="text-[11px] font-light text-slate-500 truncate">{item.author} · {item.duration}</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0 pl-4">
                                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> {formatViews(item.views)}</span>
                                    <button onClick={(e) => { e.stopPropagation(); toggleSave(item.id) }} className="p-2 rounded-full hover:bg-white transition-colors">
                                        <Bookmark className={`w-4 h-4 transition-all ${item.saved ? 'text-indigo-500 fill-indigo-500' : 'text-slate-400'}`} strokeWidth={item.saved ? 2 : 1.5} />
                                    </button>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-sm font-light text-slate-500">No resources found. Try a different search.</p>
                    </div>
                )}
            </motion.div>

            {/* ═══ MINIMALIST MODAL ═══ */}
            <AnimatePresence>
                {selectedResource && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-50 transition-opacity" onClick={() => setSelectedResource(null)} />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{ duration: 0.3, ease: 'easeOut' as const }}
                            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[85vh] z-50 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white flex flex-col overflow-hidden">

                            <div className="h-48 relative flex items-center justify-center p-6 border-b border-white/60" style={{ background: selectedResource.thumbnail }}>
                                <div className="relative z-10 opacity-30 transform scale-150">{categoryIcon[selectedResource.category]}</div>

                                <button onClick={() => setSelectedResource(null)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-slate-600 hover:bg-white transition-all shadow-sm z-20">
                                    <X className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="p-8 md:p-10 flex-1 overflow-y-auto">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className={`text-[9px] uppercase font-medium tracking-widest px-2.5 py-1 rounded-md border ${difficultyColor[selectedResource.difficulty]}`}>{selectedResource.difficulty}</span>
                                    <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500 bg-white/60 px-2.5 py-1 rounded-md border border-slate-200/50 flex items-center gap-1.5"><Clock className="w-3 h-3" strokeWidth={1.5} /> {selectedResource.duration}</span>
                                </div>

                                <h2 className="text-2xl font-light text-slate-800 mb-2 leading-tight tracking-tight">{selectedResource.title}</h2>
                                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-4">
                                    <span>By {selectedResource.author}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> {formatViews(selectedResource.views)} views</span>
                                </p>
                                <p className="text-[14px] font-light text-slate-600 leading-relaxed mb-10">{selectedResource.description}</p>

                                <div className="flex gap-4">
                                    <button className={`flex-1 py-3 px-6 rounded-2xl font-medium text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 border ${selectedResource.category === 'read'
                                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200/50'
                                        : 'bg-slate-800 text-white border-transparent hover:bg-slate-700 shadow-md'}`}>
                                        {selectedResource.category === 'listen' && <><Headphones className="w-4 h-4" /> Play Audio</>}
                                        {selectedResource.category === 'watch' && <><PlayCircle className="w-4 h-4" /> Watch Video</>}
                                        {selectedResource.category === 'read' && <><BookOpen className="w-4 h-4" /> Read Document</>}
                                    </button>

                                    <button onClick={() => toggleSave(selectedResource.id)}
                                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-300 ${selectedResource.saved ? 'border-indigo-200 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-500 bg-slate-50 hover:bg-white hover:border-slate-300'}`}>
                                        <Bookmark className={`w-4 h-4 ${selectedResource.saved ? 'fill-indigo-500' : ''}`} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
