'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smile, Meh, Frown, Flag, Check, EyeOff, AlertTriangle, TrendingUp } from 'lucide-react'

/* ─── MOCK DATA ─── */

const sentimentData = {
    positive: 62,
    neutral: 25,
    venting: 13,
    total: 8420,
}

const trendingTopics = [
    { text: 'DSA', size: 72, color: '#8B8AFF', x: 20, y: 25 },
    { text: 'TCS Placements', size: 60, color: '#7170D4', x: 55, y: 15 },
    { text: 'Mid-sems', size: 65, color: '#EF4444', x: 35, y: 55 },
    { text: 'Hostel Food', size: 45, color: '#F59E0B', x: 70, y: 50 },
    { text: 'Internship', size: 55, color: '#A8A8F0', x: 10, y: 70 },
    { text: 'Machine Learning', size: 42, color: '#22C55E', x: 80, y: 75 },
    { text: 'Attendance', size: 38, color: '#EC4899', x: 50, y: 80 },
    { text: 'Coding Contest', size: 50, color: '#06B6D4', x: 5, y: 45 },
    { text: 'Hackathon', size: 48, color: '#F97316', x: 65, y: 35 },
    { text: 'CGPA', size: 55, color: '#8B5CF6', x: 85, y: 20 },
    { text: 'Resume', size: 40, color: '#14B8A6', x: 25, y: 90 },
    { text: 'Sleep', size: 35, color: '#6366F1', x: 78, y: 90 },
]

const flaggedPosts = [
    { id: 1, content: 'I feel like giving up on everything. Nothing makes sense anymore...', reason: 'Self-harm risk', time: '15 min ago', severity: 'critical' },
    { id: 2, content: 'This hostel food is literally trying to [REDACTED] us', reason: 'Strong language', time: '1h ago', severity: 'warning' },
    { id: 3, content: 'Anyone else feeling burnt out before placements? The pressure is unbearable.', reason: 'Stress indicator', time: '2h ago', severity: 'info' },
    { id: 4, content: 'Sharing links to [EXTERNAL SITE] for free notes — hurry!', reason: 'Potential spam/phishing', time: '3h ago', severity: 'warning' },
    { id: 5, content: 'My roommate hasn\'t left bed in 3 days... worried about them.', reason: 'Peer concern report', time: '4h ago', severity: 'critical' },
]

/* ─── ANIMATION ─── */

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

/* ─── MAIN COMPONENT ─── */

export default function CommunityInsights() {
    const [posts, setPosts] = useState(flaggedPosts)
    const [actionFeedback, setActionFeedback] = useState<{ id: number; action: string } | null>(null)

    const handleAction = (id: number, action: string) => {
        setActionFeedback({ id, action })
        setTimeout(() => {
            setPosts(prev => prev.filter(p => p.id !== id))
            setActionFeedback(null)
        }, 800)
    }

    const severityColor = (s: string) => {
        if (s === 'critical') return 'text-red-500 bg-red-50 border-red-100'
        if (s === 'warning') return 'text-amber-500 bg-amber-50 border-amber-100'
        return 'text-blue-500 bg-blue-50 border-blue-100'
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-4">
            {/* Header */}
            <motion.div variants={fadeUp} className="mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Community{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Insights
                    </span>{' '}
                    💬
                </h1>
                <p className="text-gray-500 text-sm mt-1">Sentiment analysis, trending topics, and moderation queue</p>
            </motion.div>

            {/* Sentiment Overview */}
            <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Overall Sentiment */}
                    <div className="md:col-span-1 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100/50 p-5 relative overflow-hidden">
                        <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-emerald-200/30 blur-xl" />
                        <p className="text-xs text-gray-400 font-medium mb-2">Overall Sentiment</p>
                        <div className="flex items-center gap-2 mb-1">
                            <Smile className="w-6 h-6 text-emerald-500" />
                            <span className="text-2xl font-bold text-emerald-600">Positive</span>
                        </div>
                        <p className="text-xs text-gray-400">{sentimentData.total.toLocaleString()} posts analyzed</p>
                    </div>

                    {/* Positive */}
                    <div className="rounded-2xl glass-card shadow-lg shadow-purple-50/50 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Smile className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs text-gray-400 font-medium">Positive</span>
                        </div>
                        <p className="text-3xl font-bold text-emerald-500">{sentimentData.positive}%</p>
                        <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${sentimentData.positive}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-emerald-400 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Neutral */}
                    <div className="rounded-2xl glass-card shadow-lg shadow-purple-50/50 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Meh className="w-5 h-5 text-amber-500" />
                            <span className="text-xs text-gray-400 font-medium">Neutral</span>
                        </div>
                        <p className="text-3xl font-bold text-amber-500">{sentimentData.neutral}%</p>
                        <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${sentimentData.neutral}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-amber-400 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Venting */}
                    <div className="rounded-2xl glass-card shadow-lg shadow-purple-50/50 p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Frown className="w-5 h-5 text-red-500" />
                            <span className="text-xs text-gray-400 font-medium">Venting</span>
                        </div>
                        <p className="text-3xl font-bold text-red-500">{sentimentData.venting}%</p>
                        <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${sentimentData.venting}%` }}
                                transition={{ duration: 1, delay: 0.4 }}
                                className="h-full bg-red-400 rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Trending Topics — Bubble Layout */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        <p className="text-sm font-semibold text-gray-500">Trending Topics</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-500 font-semibold ml-auto">Live</span>
                    </div>
                    <div className="relative h-[300px] rounded-2xl bg-gradient-to-br from-purple-50/30 to-indigo-50/30 overflow-hidden">
                        {trendingTopics.map((topic, i) => (
                            <motion.div
                                key={topic.text}
                                className="absolute cursor-pointer"
                                style={{ left: `${topic.x}%`, top: `${topic.y}%` }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -5, 0],
                                }}
                                transition={{
                                    opacity: { duration: 0.5, delay: i * 0.1 },
                                    scale: { duration: 0.5, delay: i * 0.1 },
                                    y: { duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' as const },
                                }}
                                whileHover={{ scale: 1.2 }}
                            >
                                <div
                                    className="rounded-full flex items-center justify-center font-bold text-white shadow-lg px-3 py-1.5 whitespace-nowrap"
                                    style={{
                                        backgroundColor: topic.color,
                                        fontSize: `${Math.max(topic.size / 6, 10)}px`,
                                        boxShadow: `0 4px 15px ${topic.color}40`,
                                    }}
                                >
                                    {topic.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Moderation Queue */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <Flag className="w-4 h-4 text-amber-500" />
                        <p className="text-sm font-semibold text-gray-500">Moderation Queue</p>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold ml-2">
                            {posts.length} pending
                        </span>
                    </div>

                    <AnimatePresence>
                        {posts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8"
                            >
                                <p className="text-4xl mb-2">🎉</p>
                                <p className="text-sm text-gray-500 font-medium">All caught up! No posts to review.</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-3">
                                {posts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        layout
                                        initial={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                        className={`p-4 rounded-2xl border ${severityColor(post.severity)} bg-opacity-50 transition-all duration-300`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${severityColor(post.severity)}`}>
                                                        {post.severity}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">{post.reason}</span>
                                                    <span className="text-[10px] text-gray-400 ml-auto">{post.time}</span>
                                                </div>
                                                <p className="text-sm text-gray-700 leading-relaxed">"{post.content}"</p>

                                                {actionFeedback?.id === post.id ? (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="mt-3 text-sm font-semibold text-purple-600"
                                                    >
                                                        ✓ {actionFeedback.action}
                                                    </motion.div>
                                                ) : (
                                                    <div className="flex gap-2 mt-3">
                                                        <button
                                                            onClick={() => handleAction(post.id, 'Approved')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                                                        >
                                                            <Check className="w-3 h-3" /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(post.id, 'Hidden')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-colors"
                                                        >
                                                            <EyeOff className="w-3 h-3" /> Hide
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(post.id, 'Escalated to Counselor')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                                                        >
                                                            <AlertTriangle className="w-3 h-3" /> Escalate
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    )
}
