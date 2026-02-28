'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, BrainCircuit } from 'lucide-react'

type Phase = 'landing' | 'chat'

interface ChatMessage {
    id: number
    role: 'bot' | 'user'
    text: string
    time: string
}

const now = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const botResponses: Record<string, string> = {
    default: "I hear you. Tell me more about what's going on — I'm here to listen. 🤍",
    exam: "Exam stress is tough, and it's completely valid to feel this way. Let's break it down together. Which subject is worrying you the most right now?",
    breathing: "Let's try a quick breathing exercise. \n\nInhale deeply for 4 seconds.\nHold for 4 seconds.\nExhale slowly for 6 seconds.\n\nTake your time. How does your body feel now?",
    sleep: "Sleep issues can really drain your energy. Let's try establishing a wind-down routine tonight. Have you tried turning off screens 30 mins before bed?",
    placement: "Placement season is an enormous pressure cooker. Remember — your worth isn't defined by which company picks you. What's specifically worrying you about the process?",
}

const suggestionChips = [
    "I'm feeling overwhelmed with exams",
    "Help me calm down right now",
    "I can't sleep lately",
    "Placement anxiety is getting to me",
]

export default function PeaceBot() {
    const [phase, setPhase] = useState<Phase>('landing')
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: 0,
        role: 'bot',
        text: "Hello. I'm Peace Bot. I'm here to listen, support, and guide you through whatever you're feeling right now.",
        time: now()
    }])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (phase === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isTyping, phase])

    const getBotResponse = (text: string): string => {
        const lower = text.toLowerCase()
        if (lower.includes('exam') || lower.includes('study') || lower.includes('stress') || lower.includes('overwhelmed')) return botResponses.exam
        if (lower.includes('breath') || lower.includes('calm') || lower.includes('panic')) return botResponses.breathing
        if (lower.includes('sleep') || lower.includes('night')) return botResponses.sleep
        if (lower.includes('placement') || lower.includes('job') || lower.includes('anxiety')) return botResponses.placement
        return botResponses.default
    }

    const sendMessage = (text: string) => {
        if (!text.trim()) return
        if (phase === 'landing') setPhase('chat')

        const userMsg: ChatMessage = { id: Date.now(), role: 'user', text: text.trim(), time: now() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        setTimeout(() => {
            const botReply: ChatMessage = { id: Date.now() + 1, role: 'bot', text: getBotResponse(text), time: now() }
            setMessages(prev => [...prev, botReply])
            setIsTyping(false)
        }, 1500 + Math.random() * 1000)
    }

    return (
        <div className="relative w-full min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden font-sans">
            {/* Soft Moving Mesh Background (Ethereal Minimalism) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' as const }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40"
                />
            </div>

            <AnimatePresence mode="wait">
                {phase === 'landing' ? (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-6"
                    >
                        {/* Glowing Orb */}
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0 0 40px -10px rgba(167, 139, 250, 0.4)",
                                    "0 0 80px 10px rgba(167, 139, 250, 0.6)",
                                    "0 0 40px -10px rgba(167, 139, 250, 0.4)"
                                ]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-indigo-100 via-purple-50 to-white border border-white/60 shadow-2xl flex items-center justify-center backdrop-blur-md mb-12 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
                            <BrainCircuit className="w-12 h-12 md:w-16 md:h-16 text-purple-400 relative z-10 opacity-80" strokeWidth={1.5} />
                        </motion.div>

                        <h1 className="text-3xl md:text-5xl font-light text-slate-800 tracking-tight text-center mb-4">
                            How are you feeling?
                        </h1>
                        <p className="text-slate-500 text-center text-sm md:text-base mb-12 max-w-md font-light">
                            Whenever you're ready, I'm here to listen. No judgments, just a safe space.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPhase('chat')}
                            className="group relative px-8 py-4 bg-white/70 backdrop-blur-xl border border-white/50 text-slate-700 rounded-full text-sm font-medium shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(167,139,250,0.15)] transition-all duration-500 flex items-center gap-3 overflow-hidden"
                        >
                            <span className="relative z-10">Start Chatting</span>
                            <Sparkles className="w-4 h-4 text-purple-400 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.button>

                        {/* Floating Suggestion Chips */}
                        <div className="mt-16 flex flex-wrap justify-center gap-3 w-full">
                            {suggestionChips.map((chip, idx) => (
                                <motion.button
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        y: [0, -3, 0] // Bobbing effect
                                    }}
                                    transition={{
                                        opacity: { delay: 0.2 + idx * 0.1, duration: 0.5 },
                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay: idx * 0.5 }
                                    }}
                                    whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.2 } }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => sendMessage(chip)}
                                    className="px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-slate-600 text-xs shadow-sm hover:shadow-md hover:bg-white/60 transition-all duration-300 font-light"
                                >
                                    {chip}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex flex-col w-full max-w-3xl h-[85vh] bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(167,139,250,0.15)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 bg-white/40">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-100 to-indigo-50 flex items-center justify-center border border-white">
                                        <Bot className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-slate-800">Peace Bot</h2>
                                    <p className="text-[11px] text-slate-500 font-light">AI Companion</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPhase('landing')}
                                className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5 rounded-full hover:bg-white/50"
                            >
                                Close
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx === messages.length - 1 ? 0.1 : 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                                >
                                    {msg.role === 'bot' && (
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-purple-50 shadow-sm mr-3 flex-shrink-0 mt-1">
                                            <Bot className="w-4 h-4 text-purple-400" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] px-5 py-3.5 text-sm leading-relaxed font-light ${msg.role === 'user'
                                            ? 'bg-slate-800 text-white rounded-2xl rounded-tr-sm shadow-md'
                                            : 'bg-white/80 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm border border-white/50'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Thinking state */}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-purple-50 shadow-sm mr-3 flex-shrink-0 mt-1">
                                        <Bot className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="bg-white/80 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-white/50 flex items-center gap-1.5 h-12">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.4, 1, 0.4],
                                                boxShadow: [
                                                    "0 0 0px 0px rgba(167, 139, 250, 0)",
                                                    "0 0 10px 2px rgba(167, 139, 250, 0.3)",
                                                    "0 0 0px 0px rgba(167, 139, 250, 0)"
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
                                            className="w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-300"
                                        />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} className="h-4" />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/40 border-t border-white/30 backdrop-blur-md">
                            <div className="relative flex items-center group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                                    placeholder="Share what's on your mind..."
                                    className="w-full pl-5 pr-14 py-4 rounded-full bg-white/60 border border-white/80 text-sm outline-none focus:border-purple-200 focus:bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] focus:shadow-[0_4px_20px_rgba(167,139,250,0.08)] transition-all font-light placeholder:text-slate-400"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => sendMessage(input)}
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 p-2.5 rounded-full bg-slate-800 text-white shadow-md disabled:opacity-50 disabled:bg-slate-300 transition-all flex items-center justify-center"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
