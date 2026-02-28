'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart, MessageCircle, Eye, EyeOff,
    TrendingUp, Coffee, BookOpen, Laugh,
    Send, Clock, Sparkles, Hash,
    ArrowUp, Star, MoreHorizontal, User, Users
} from 'lucide-react'

/* ─── TYPES ─── */

interface Space {
    id: string; name: string; displayName: string; description: string
    members: number; icon: React.ElementType; gradient: string
}

interface Post {
    id: string; spaceId: string; author: string; isAnonymous: boolean
    content: string; timeAgo: string; upvotes: number;
    comments: Comment[]; voted: 'up' | 'down' | null; flair?: string
}

interface Comment {
    id: string; author: string; content: string; timeAgo: string
    likes: number; isAnonymous?: boolean
}

interface LiveMessage {
    id: string; author: string; content: string; time: string; isAnonymous?: boolean
}

/* ─── MOCK DATA ─── */

const spaces: Space[] = [
    { id: 'placement', name: 'c/PlacementPrep', displayName: 'Placement Prep', description: 'Interviews, rejections, offers & everything placement season.', members: 1242, icon: TrendingUp, gradient: 'from-blue-100 to-indigo-50 text-indigo-700' },
    { id: 'hostel', name: 'c/HostelLife', displayName: 'Hostel Life', description: 'Roommate stories, mess food rants & late-night shenanigans.', members: 828, icon: Coffee, gradient: 'from-amber-100 to-orange-50 text-orange-700' },
    { id: 'exam', name: 'c/ExamStress', displayName: 'Exam Season', description: 'GATE, CAT, semester exams — share struggles & study tips.', members: 935, icon: BookOpen, gradient: 'from-rose-100 to-pink-50 text-pink-700' },
    { id: 'wins', name: 'c/DailyWins', displayName: 'Daily Wins', description: 'Celebrate every victory — big or small. Got out of bed? That counts!', members: 1156, icon: Star, gradient: 'from-emerald-100 to-teal-50 text-teal-700' },
    { id: 'general', name: 'c/CampusTalk', displayName: 'Campus Talk', description: 'Random thoughts, memes & vibing with the community.', members: 2084, icon: Laugh, gradient: 'from-purple-100 to-violet-50 text-violet-700' },
    { id: 'support', name: 'c/PeerSupport', displayName: 'Peer Support', description: 'A safe space for deeper conversations and mutual support.', members: 419, icon: Heart, gradient: 'from-pink-100 to-rose-50 text-rose-700' },
]

const allPosts: Post[] = [
    {
        id: 'p1', spaceId: 'placement', author: 'Anonymous Student', isAnonymous: true, content: 'Got rejected from my dream company today after 5 rounds of interviews. Feeling absolutely gutted. Is it even worth trying anymore?', timeAgo: '2h ago', upvotes: 87, voted: null, flair: 'Vent',
        comments: [
            { id: 'c1', author: 'Ravi K.', content: 'Hey, 5 rounds means you were VERY good. The final no is just luck/fit. Keep going, the pipeline is full of opportunities.', timeAgo: '1h ago', likes: 23 },
            { id: 'c2', author: 'Anonymous Peer', content: 'Same happened to me last year. Got a better offer 2 weeks later. Hang in there.', timeAgo: '45m ago', likes: 15, isAnonymous: true },
        ]
    },
    {
        id: 'p2', spaceId: 'placement', author: 'Aditi M.', isAnonymous: false, content: 'Pro tip for TCS NQT: Focus on quantitative aptitude more than programming. The programming section is relatively easier. Dropping my study plan below.', timeAgo: '5h ago', upvotes: 142, voted: null, flair: 'Study Plan',
        comments: [
            { id: 'c3', author: 'Sneha R.', content: 'This is incredibly helpful! Can you share the resource links as well?', timeAgo: '3h ago', likes: 8 },
        ]
    },
    { id: 'p3', spaceId: 'placement', author: 'Anonymous Senior', isAnonymous: true, content: 'My parents keep comparing me to my cousin who got into Google. The pressure is insane. Anyone else dealing with family expectations during placement season?', timeAgo: '8h ago', upvotes: 203, voted: null, flair: 'Discussion', comments: [] },
    {
        id: 'p4', spaceId: 'hostel', author: 'Anonymous Resident', isAnonymous: true, content: "My roommate plays games till 3AM with full volume. I have a GATE mock tomorrow. I've asked nicely 100 times. What is the protocol here?", timeAgo: '1h ago', upvotes: 156, voted: null, flair: 'Help',
        comments: [
            { id: 'c4', author: 'Amit D.', content: "Talk to your warden immediately. You have every right to sleep. If that doesn't work, noise-canceling earplugs are your best friend.", timeAgo: '30m ago', likes: 34 },
        ]
    },
    { id: 'p8', spaceId: 'wins', author: 'Prakash V.', isAnonymous: false, content: "I finally went to the campus counselor today. I was terrified walking in, but she was so kind and validating. If you're thinking about it — just go. It's worth it.", timeAgo: '2h ago', upvotes: 489, voted: null, flair: 'Milestone', comments: [] },
]

const liveMessages: LiveMessage[] = [
    { id: 'm1', author: 'Arjun S.', content: 'Anyone up for a quiet study session tonight? Library 3rd floor?', time: '12:44 PM' },
    { id: 'm2', author: 'Anonymous', content: 'Having a rough day. Just needed to say it out loud somewhere safe.', time: '12:42 PM', isAnonymous: true },
    { id: 'm3', author: 'Priya K.', content: 'Sending virtual chai to everyone studying through the weekend.', time: '12:40 PM' },
    { id: 'm4', author: 'Sneha R.', content: 'The GATE PYQ notes I shared yesterday are pinned in Exam Season.', time: '12:38 PM' },
]

const flairStyles: Record<string, string> = {
    'Vent': 'bg-red-50/50 text-red-600 border-red-100',
    'Discussion': 'bg-blue-50/50 text-blue-600 border-blue-100',
    'Study Plan': 'bg-emerald-50/50 text-emerald-600 border-emerald-100',
    'Help': 'bg-amber-50/50 text-amber-600 border-amber-100',
    'Milestone': 'bg-purple-50/50 text-purple-600 border-purple-100',
}

/* ─── COMPONENT ─── */

export default function Community() {
    const [activeSpace, setActiveSpace] = useState(spaces[0].id)
    const [posts, setPosts] = useState(allPosts)
    const [newPost, setNewPost] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [expandedPost, setExpandedPost] = useState<string | null>(null)
    const [newComment, setNewComment] = useState('')
    const [liveMsg, setLiveMsg] = useState('')
    const [chatMessages, setChatMessages] = useState(liveMessages)
    const chatEndRef = useRef<HTMLDivElement>(null)

    const currentSpace = spaces.find(s => s.id === activeSpace)!
    const spacePosts = posts.filter(p => p.spaceId === activeSpace)

    const vote = (postId: string, dir: 'up' | 'down') => {
        setPosts(prev => prev.map(p => {
            if (p.id !== postId) return p
            if (p.voted === dir) return { ...p, voted: null, upvotes: dir === 'up' ? p.upvotes - 1 : p.upvotes + 1 }
            const delta = p.voted ? 2 : 1
            return { ...p, voted: dir, upvotes: dir === 'up' ? p.upvotes + delta : p.upvotes - delta }
        }))
    }

    const submitPost = () => {
        if (!newPost.trim()) return
        const post: Post = {
            id: `new-${Date.now()}`, spaceId: activeSpace, author: isAnonymous ? 'Anonymous User' : 'You',
            isAnonymous, content: newPost, timeAgo: 'Just now', upvotes: 1, comments: [], voted: 'up',
        }
        setPosts(prev => [post, ...prev]); setNewPost('')
    }

    const addComment = (postId: string) => {
        if (!newComment.trim()) return
        setPosts(prev => prev.map(p => p.id === postId ? {
            ...p, comments: [...p.comments, { id: `c-${Date.now()}`, author: isAnonymous ? 'Anonymous' : 'You', content: newComment, timeAgo: 'Just now', likes: 0, isAnonymous }]
        } : p))
        setNewComment('')
    }

    const sendLiveMsg = () => {
        if (!liveMsg.trim()) return
        setChatMessages(prev => [...prev, { id: `l-${Date.now()}`, author: 'You', content: liveMsg, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }])
        setLiveMsg('')
    }

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

    return (
        <div className="relative w-full min-h-screen font-sans overflow-hidden pb-32">
            {/* Ethereal Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' as const }} className="absolute -top-[10%] -right-[10%] w-[60%] h-[70%] bg-blue-100 rounded-full blur-[140px]" />
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }} className="absolute bottom-[0%] -left-[10%] w-[50%] h-[60%] bg-purple-100 rounded-full blur-[140px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-10 px-4 md:px-8 pt-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-purple-100/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center">
                            <Users className="w-5 h-5 text-slate-700" strokeWidth={1.2} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-light text-slate-800 tracking-tight mb-0.5">Community Hub</h1>
                            <p className="text-[13px] text-slate-500 font-light">An anonymous, secure space to connect and heal together.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">

                    {/* ═══ LEFT SIDEBAR (Spaces) ═══ */}
                    <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-8">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-medium text-slate-400 mb-4 px-2">Active Spaces</p>
                            <div className="space-y-1.5 flex flex-col">
                                {spaces.map(space => {
                                    const Icon = space.icon
                                    const isActive = activeSpace === space.id
                                    return (
                                        <button key={space.id} onClick={() => setActiveSpace(space.id)}
                                            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-[1.25rem] transition-all duration-300 ${isActive ? 'bg-white/60 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/80' : 'hover:bg-white/30 border border-transparent'}`}>
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isActive ? `bg-gradient-to-br ${space.gradient}` : 'bg-slate-100/50 text-slate-400'}`}>
                                                <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                                            </div>
                                            <span className={`text-sm truncate ${isActive ? 'font-medium text-slate-800' : 'font-light text-slate-600'}`}>{space.displayName}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ═══ CENTER (Feed) ═══ */}
                    <div className="lg:col-span-6 space-y-6">

                        {/* Space Context Header */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-[1.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-1.5">
                            <div className="flex items-center gap-3">
                                <currentSpace.icon className="w-4 h-4 text-indigo-400" strokeWidth={1.2} />
                                <h2 className="text-base font-medium text-slate-800 tracking-tight">{currentSpace.displayName}</h2>
                                <span className="text-[8px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full bg-white/60 border border-white/80 text-slate-400">{currentSpace.members} members</span>
                            </div>
                            <p className="text-[13px] font-light text-slate-500 leading-tight">{currentSpace.description}</p>
                        </motion.div>

                        {/* Compose Post */}
                        <div className="p-5 rounded-[1.5rem] bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)}
                                placeholder="Share a thought, ask a question, or just vent..."
                                className="w-full h-16 bg-transparent outline-none resize-none text-slate-700 placeholder-slate-400 font-light text-[14px] leading-relaxed" />
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                                <button onClick={() => setIsAnonymous(!isAnonymous)}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-medium uppercase tracking-widest transition-colors ${isAnonymous ? 'bg-slate-800 text-white' : 'bg-white/60 text-slate-400 border border-slate-200/50 hover:bg-white'}`}>
                                    {isAnonymous ? <EyeOff className="w-3 h-3" strokeWidth={1.2} /> : <Eye className="w-3 h-3" strokeWidth={1.2} />}
                                    {isAnonymous ? 'Incognito' : 'Public'}
                                </button>
                                <button onClick={submitPost} disabled={!newPost.trim()}
                                    className="px-5 py-1.5 rounded-xl text-[10px] font-medium uppercase tracking-widest bg-slate-800 text-white shadow-sm hover:shadow-md hover:bg-slate-700 disabled:opacity-50 transition-all flex items-center gap-2">
                                    Post <Send className="w-3 h-3" strokeWidth={1.2} />
                                </button>
                            </div>
                        </div>

                        {/* Posts List */}
                        <AnimatePresence>
                            {spacePosts.map((post) => (
                                <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-6 rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex gap-4 md:gap-6">

                                    {/* Delicate Vote Column */}
                                    <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
                                        <button onClick={() => vote(post.id, 'up')} className={`p-1.5 rounded-full transition-colors ${post.voted === 'up' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300 hover:text-indigo-500 hover:bg-white/80'}`}>
                                            <ArrowUp className={`w-5 h-5 ${post.voted === 'up' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                                        </button>
                                        <span className={`text-[11px] font-medium uppercase tracking-wider ${post.voted === 'up' ? 'text-indigo-600' : post.voted === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>{post.upvotes}</span>
                                        <button onClick={() => vote(post.id, 'down')} className={`p-1.5 rounded-full rotate-180 transition-colors ${post.voted === 'down' ? 'text-rose-500 bg-rose-50' : 'text-slate-300 hover:text-rose-500 hover:bg-white/80'}`}>
                                            <ArrowUp className={`w-5 h-5 ${post.voted === 'down' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                                        </button>
                                    </div>

                                    {/* Post Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 border border-slate-200 shrink-0">
                                                <User className="w-3 h-3 text-slate-400" strokeWidth={1.2} />
                                            </div>
                                            <span className="text-[13px] font-medium text-slate-800 tracking-tight">{post.author}</span>
                                            {post.isAnonymous && <span className="text-[8px] uppercase tracking-widest font-medium text-slate-400 bg-white/60 px-2 py-0.5 rounded-full border border-slate-100 flex items-center gap-1"><EyeOff className="w-2 h-2" /> incognito</span>}
                                            <span className="text-[8px] uppercase tracking-widest font-medium text-slate-300 flex items-center gap-1 ml-1"><Clock className="w-2 h-2" /> {post.timeAgo}</span>
                                            {post.flair && <span className={`text-[8px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-md border ${flairStyles[post.flair]}`}>{post.flair}</span>}
                                        </div>

                                        <p className="text-[14px] font-light text-slate-700 leading-relaxed tracking-tight mb-5">{post.content}</p>

                                        {/* Delicate Interaction Bar */}
                                        <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-medium text-slate-400">
                                            <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex items-center gap-1.5 hover:text-indigo-500 hover:bg-white/60 px-2 py-1 rounded-lg transition-colors">
                                                <MessageCircle className="w-3 h-3" strokeWidth={1.2} /> {post.comments.length}
                                            </button>
                                            <button className="flex items-center gap-1.5 hover:text-amber-500 hover:bg-white/60 px-2 py-1 rounded-lg transition-colors">
                                                <Star className="w-3 h-3" strokeWidth={1.2} /> Save
                                            </button>
                                            <button className="p-1 hover:bg-white/60 rounded-lg hover:text-slate-600 ml-1">
                                                <MoreHorizontal className="w-3.5 h-3.5" strokeWidth={1.2} />
                                            </button>
                                        </div>

                                        {/* Comments Area */}
                                        <AnimatePresence>
                                            {expandedPost === post.id && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                    <div className="mt-5 pt-5 border-t border-slate-100/50 space-y-5">
                                                        {post.comments.map(c => (
                                                            <div key={c.id} className="flex gap-3">
                                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                                                                    <User className="w-3 h-3 text-slate-400" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-xs font-medium text-slate-700">{c.author}</span>
                                                                        <span className="text-[9px] uppercase tracking-widest font-medium text-slate-300">{c.timeAgo}</span>
                                                                    </div>
                                                                    <p className="text-sm font-light text-slate-600 leading-relaxed">{c.content}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="flex items-center gap-3 pt-2">
                                                            <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)}
                                                                onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                                                                placeholder="Add to the discussion..."
                                                                className="flex-1 bg-white/60 border border-white/80 rounded-xl px-4 py-2.5 text-sm font-light outline-none focus:border-indigo-300 placeholder-slate-400" />
                                                            <button onClick={() => addComment(post.id)} disabled={!newComment.trim()} className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center disabled:opacity-50 shrink-0"><Send className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* ═══ RIGHT SIDEBAR (Live Support Chat) ═══ */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col h-[500px] lg:sticky lg:top-24">
                            <div className="p-4 border-b border-white/60 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs font-medium uppercase tracking-widest text-slate-700">Live Campus Lounge</span>
                                </div>
                                <span className="flex w-2 h-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className="flex gap-2.5">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-100 shrink-0">
                                            <User className="w-3 h-3 text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-[11px] font-medium text-slate-700">{msg.author}</span>
                                                <span className="text-[9px] font-medium text-slate-300">{msg.time}</span>
                                            </div>
                                            <div className="bg-white/60 border border-white/80 px-3 py-2 rounded-xl rounded-tl-sm text-sm font-light text-slate-600 inline-block shadow-sm">
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="p-3 border-t border-white/60 bg-white/30 rounded-b-[2rem]">
                                <div className="flex items-center gap-2">
                                    <input type="text" value={liveMsg} onChange={e => setLiveMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendLiveMsg()}
                                        placeholder="Type a message..." className="flex-1 bg-white/80 border border-white/100 rounded-xl px-3 py-2 text-sm font-light outline-none shadow-sm placeholder-slate-400" />
                                    <button onClick={sendLiveMsg} disabled={!liveMsg.trim()} className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-slate-800 text-white disabled:opacity-50"><Send className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
