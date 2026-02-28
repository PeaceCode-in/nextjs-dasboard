"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Brain, Zap, Heart, Shield, Sparkles, Smile, Cloud, Eye,
    Activity, ArrowRight, Play, CheckCircle2, AlertCircle, X,
    RefreshCw, Info, Leaf, Waves, Wind, MousePointer2, Focus, Target,
    Book, Hexagon, Circle, Square, Triangle, Star, Sun, Moon, Music, Coffee, Droplet, Flame, Snowflake,
    BookMarked, PenLine, Puzzle
} from 'lucide-react'

// Game Definitions
type GameCategory = 'CBT' | 'Sensory' | 'Focus' | 'Grounding' | 'Cognitive' | 'Anxiety Relief' | 'Relaxation'

interface GameData {
    id: string
    title: string
    category: GameCategory
    icon: React.ElementType
    color: string
    thumbnail: string // gradient or image
    description: string
    clinicalBenefit: string
    component: React.ReactNode
}

// ----------------------------------------------------------------------
// GAME COMPONENTS (Stubs for now, will be implemented fully)
// ----------------------------------------------------------------------

const GameStub = ({ name, onComplete }: { name: string, onComplete: () => void }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-white/50 rounded-2xl min-h-[300px]">
        <h3 className="text-2xl font-bold mb-4">{name}</h3>
        <p className="text-gray-500 mb-8">Game logic coming soon...</p>
        <button
            onClick={onComplete}
            className="px-6 py-2 bg-purple-500 text-white rounded-xl shadow-lg hover:bg-purple-600 transition"
        >
            Finish Game
        </button>
    </div>
)

// --- Game 1: Cognitive Pop ---
const statementPool = [
    { text: "I'm a failure", isDistortion: true },
    { text: "Everyone is judging me", isDistortion: true },
    { text: "I must be perfect", isDistortion: true },
    { text: "I will never get better", isDistortion: true },
    { text: "I'm worthless", isDistortion: true },
    { text: "If I fail, I'm bad", isDistortion: true },
    { text: "I did my best", isDistortion: false },
    { text: "I am learning", isDistortion: false },
    { text: "It's okay to make mistakes", isDistortion: false },
    { text: "I am safe right now", isDistortion: false },
    { text: "This feeling will pass", isDistortion: false },
    { text: "I am enough", isDistortion: false }
];

interface Bubble {
    id: number;
    text: string;
    isDistortion: boolean;
    x: number;
    y: number;
    speed: number;
    popped: boolean;
}

function CognitivePop({ onComplete }: { onComplete: () => void }) {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setBubbles([]);
        setIsPlaying(true);
    }

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsPlaying(false);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) return;

        // Spawn bubbles
        const spawnInterval = setInterval(() => {
            const statement = statementPool[Math.floor(Math.random() * statementPool.length)];
            const newBubble: Bubble = {
                id: Date.now() + Math.random(),
                text: statement.text,
                isDistortion: statement.isDistortion,
                x: Math.random() * 80 + 10, // 10% to 90%
                y: 110, // Start below screen (percentage)
                speed: Math.random() * 0.5 + 0.3,
                popped: false
            };
            setBubbles(prev => [...prev, newBubble]);
        }, 1500);

        // Move bubbles
        const moveInterval = setInterval(() => {
            setBubbles(prev => prev.map(b => ({ ...b, y: b.y - b.speed })).filter(b => b.y > -20 && !b.popped));
        }, 50);

        return () => {
            clearInterval(spawnInterval);
            clearInterval(moveInterval);
        };
    }, [isPlaying]);

    const popBubble = (b: Bubble) => {
        if (!isPlaying) return;
        setBubbles(prev => prev.map(bubble => bubble.id === b.id ? { ...bubble, popped: true } : bubble));
        if (b.isDistortion) {
            setScore(s => s + 10);
        } else {
            setScore(s => Math.max(0, s - 5)); // Penalize popping truths
        }
    }

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] max-h-[600px] bg-slate-900/80 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden border border-white/10">
            {!isPlaying && timeLeft === 30 && (
                <div className="text-center z-10 flex flex-col items-center justify-center h-full">
                    <h3 className="text-3xl font-bold text-white mb-4">Cognitive Pop</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        Pop the negative distortions (red). Let the positive truths (green) float to the top safely.
                    </p>
                    <button onClick={startGame} className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-lg shadow-pink-500/30 transition text-lg font-bold">
                        Start Popping
                    </button>
                </div>
            )}

            {!isPlaying && timeLeft === 0 && (
                <div className="text-center z-10 flex flex-col items-center justify-center h-full animate-in zoom-in fade-in duration-500">
                    <h3 className="text-3xl font-bold text-white mb-4">Time's Up!</h3>
                    <p className="text-pink-400 text-2xl font-bold mb-8">Score: {score}</p>
                    <button onClick={onComplete} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            )}

            {isPlaying && (
                <>
                    <div className="absolute top-6 left-6 z-10 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
                        <p className="text-slate-300 font-bold">Time: <span className="text-white">{timeLeft}s</span></p>
                    </div>
                    <div className="absolute top-6 right-6 z-10 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
                        <p className="text-slate-300 font-bold">Score: <span className="text-pink-400">{score}</span></p>
                    </div>

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <AnimatePresence>
                            {bubbles.map(b => (
                                !b.popped && (
                                    <motion.div
                                        key={b.id}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, top: `${b.y}%`, left: `${b.x}%` }}
                                        exit={{ scale: 1.5, opacity: 0 }}
                                        transition={{ type: 'tween', duration: 0.1 }}
                                        className={`absolute pointer-events-auto cursor-crosshair px-4 py-3 rounded-full shadow-lg flex items-center justify-center text-sm font-medium border-2 
                      ${b.isDistortion ? 'bg-slate-800/90 border-pink-500/50 text-pink-100 hover:bg-pink-900/50' : 'bg-slate-800/90 border-emerald-500/50 text-emerald-100 hover:bg-emerald-900/50'}
                    `}
                                        onMouseDown={() => popBubble(b)}
                                    >
                                        {b.text}
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    )
}

// --- Game 2: 5-4-3-2-1 Grounding Grid ---
const visualItems = [
    { id: 1, trait: 'blue', icon: Droplet, color: 'text-blue-400 bg-blue-400/10' },
    { id: 2, trait: 'round', icon: Circle, color: 'text-indigo-400 bg-indigo-400/10' },
    { id: 3, trait: 'bright', icon: Sun, color: 'text-yellow-400 bg-yellow-400/10' },
    { id: 4, trait: 'textured', icon: Leaf, color: 'text-emerald-400 bg-emerald-400/10' },
    { id: 5, trait: 'blue', icon: Snowflake, color: 'text-blue-300 bg-blue-300/10' },
    { id: 6, trait: 'round', icon: Moon, color: 'text-slate-300 bg-slate-300/10' },
    { id: 7, trait: 'bright', icon: Star, color: 'text-yellow-300 bg-yellow-300/10' },
    { id: 8, trait: 'textured', icon: Hexagon, color: 'text-orange-400 bg-orange-400/10' },
    { id: 9, trait: 'blue', icon: Cloud, color: 'text-blue-500 bg-blue-500/10' },
    { id: 10, trait: 'round', icon: Smile, color: 'text-yellow-500 bg-yellow-500/10' },
    { id: 11, trait: 'bright', icon: Zap, color: 'text-yellow-400 bg-yellow-400/10' },
    { id: 12, trait: 'textured', icon: Coffee, color: 'text-amber-600 bg-amber-600/10' },
    { id: 13, trait: 'blue', icon: Music, color: 'text-blue-400 bg-blue-400/10' },
    { id: 14, trait: 'round', icon: Heart, color: 'text-rose-400 bg-rose-400/10' },
    { id: 15, trait: 'bright', icon: Flame, color: 'text-orange-500 bg-orange-500/10' },
    { id: 16, trait: 'textured', icon: Square, color: 'text-purple-400 bg-purple-400/10' },
];

const groundingLevels = [
    { targetCount: 5, targetTrait: 'blue', prompt: "Find 5 blue items" },
    { targetCount: 4, targetTrait: 'textured', prompt: "Find 4 things with a rough texture" },
    { targetCount: 3, targetTrait: 'round', prompt: "Find 3 round items" },
    { targetCount: 2, targetTrait: 'bright', prompt: "Find 2 bright or glowing things" },
    { targetCount: 1, targetTrait: 'any', prompt: "Take a deep breath. Click 1 item that makes you feel calm." },
];

function GroundingGrid({ onComplete }: { onComplete: () => void }) {
    const [level, setLevel] = useState(0);
    const [foundIds, setFoundIds] = useState<number[]>([]);
    const [items, setItems] = useState(() => [...visualItems].sort(() => Math.random() - 0.5));
    const [isFinished, setIsFinished] = useState(false);

    const currentLevel = groundingLevels[level];

    const handleItemClick = (item: any) => {
        if (isFinished) return;
        if (foundIds.includes(item.id)) return;

        if (currentLevel.targetTrait === 'any' || item.trait === currentLevel.targetTrait) {
            const newFound = [...foundIds, item.id];
            setFoundIds(newFound);

            if (newFound.length >= currentLevel.targetCount) {
                if (level < groundingLevels.length - 1) {
                    setTimeout(() => {
                        setLevel(level + 1);
                        setFoundIds([]);
                        setItems(prev => [...prev].sort(() => Math.random() - 0.5));
                    }, 600);
                } else {
                    setIsFinished(true);
                }
            }
        }
    }

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border border-white/10">
            {isFinished ? (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Grounding Complete</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        You've successfully brought your mind back to the present moment.
                    </p>
                    <button onClick={onComplete} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            ) : (
                <>
                    <div className="text-center mb-10 w-full animate-in fade-in duration-300" key={level}>
                        <h3 className="text-3xl font-bold text-white mb-3">5-4-3-2-1 Grounding</h3>
                        <p className="text-xl text-emerald-400 font-medium">{currentLevel.prompt}</p>
                        <p className="text-slate-400 mt-2">Found: {foundIds.length} / {currentLevel.targetCount}</p>
                    </div>

                    <div className="grid grid-cols-4 gap-6 w-full max-w-2xl px-4">
                        {items.map(item => {
                            const Icon = item.icon;
                            const isFound = foundIds.includes(item.id);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300
                    ${isFound ? 'opacity-0 scale-50 pointer-events-none' : 'hover:scale-105 hover:-translate-y-1 shadow-lg bg-slate-800 border border-slate-700'}
                  `}
                                >
                                    <Icon className={`w-10 h-10 ${item.color.split(' ')[0]}`} />
                                </button>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

// --- Game 3: Flow State Connector ---
const flowPuzzles = [
    { dots: [{ id: 1, x: 20, y: 30 }, { id: 2, x: 80, y: 30 }, { id: 3, x: 80, y: 70 }, { id: 4, x: 20, y: 70 }] },
    { dots: [{ id: 1, x: 50, y: 20 }, { id: 2, x: 80, y: 80 }, { id: 3, x: 20, y: 80 }] },
    { dots: [{ id: 1, x: 30, y: 30 }, { id: 2, x: 70, y: 30 }, { id: 3, x: 50, y: 50 }, { id: 4, x: 30, y: 70 }, { id: 5, x: 70, y: 70 }] }
]

function FlowConnector({ onComplete }: { onComplete: () => void }) {
    const [level, setLevel] = useState(0);
    const [connected, setConnected] = useState<number[]>([]);
    const [isFinished, setIsFinished] = useState(false);

    const currentPuzzle = flowPuzzles[level];

    const handleDotClick = (id: number) => {
        if (isFinished) return;

        if (connected.length === 0 && id === 1) {
            setConnected([id]);
        } else if (connected.length > 0 && id === connected[connected.length - 1] + 1) {
            const newConn = [...connected, id];
            setConnected(newConn);
            if (newConn.length === currentPuzzle.dots.length) {
                if (level < flowPuzzles.length - 1) {
                    setTimeout(() => {
                        setLevel(level + 1);
                        setConnected([]);
                    }, 800);
                } else {
                    setTimeout(() => {
                        setIsFinished(true);
                    }, 800);
                }
            }
        }
    }

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border border-white/10 overflow-hidden">
            {isFinished ? (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <h3 className="text-3xl font-bold text-white mb-4">Flow State Achieved</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        Your mind is calm and focused.
                    </p>
                    <button onClick={onComplete} className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            ) : (
                <>
                    <div className="text-center z-10 absolute top-8">
                        <h3 className="text-2xl font-bold text-white">Flow State Connector</h3>
                        <p className="text-indigo-400 mt-2 text-sm uppercase tracking-widest font-mono">Pattern {level + 1} / 3</p>
                    </div>

                    <div className="relative w-full max-w-2xl h-[400px] mt-10 rounded-2xl bg-transparent">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            {connected.length > 1 && connected.map((id, index) => {
                                if (index === 0) return null;
                                const prevId = connected[index - 1];
                                const p1 = currentPuzzle.dots.find(d => d.id === prevId);
                                const p2 = currentPuzzle.dots.find(d => d.id === id);
                                if (!p1 || !p2) return null;
                                return (
                                    <motion.line
                                        key={`${p1.id}-${p2.id}`}
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        x1={`${p1.x}%`} y1={`${p1.y}%`}
                                        x2={`${p2.x}%`} y2={`${p2.y}%`}
                                        stroke="#818cf8" strokeWidth="4" strokeLinecap="round"
                                        className="drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]"
                                    />
                                )
                            })}
                        </svg>

                        {currentPuzzle.dots.map((dot) => {
                            const isConn = connected.includes(dot.id);
                            const isActive = (connected.length === 0 && dot.id === 1) || dot.id === (connected[connected.length - 1] || 0) + 1;
                            return (
                                <button
                                    key={dot.id}
                                    onClick={() => handleDotClick(dot.id)}
                                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                    ${isConn ? 'bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.8)] scale-110 border-2 border-indigo-200' : 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600'}
                    ${isActive && !isConn ? 'ring-4 ring-indigo-400/30 animate-pulse' : ''}
                  `}
                                >
                                    {isConn && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                </button>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

// --- Game 4: Word Shift ---
const stressfulWords = ["Deadline", "Exams", "Failure", "Mistake", "Criticism"];

function WordShift({ onComplete }: { onComplete: () => void }) {
    const [word, setWord] = useState(stressfulWords[0]);
    const [input, setInput] = useState("");
    const [associations, setAssociations] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const startGame = () => {
        setWord(stressfulWords[Math.floor(Math.random() * stressfulWords.length)]);
        setAssociations([]);
        setTimeLeft(30);
        setIsFinished(false);
        setIsPlaying(true);
    }

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsPlaying(false);
                    setIsFinished(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !isPlaying) return;
        setAssociations(prev => [input.trim(), ...prev]);
        setInput("");
    }

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border border-white/10">
            {!isPlaying && !isFinished && (
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">Word Shift</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        When a stressful word appears, type as many positive or neutral associations as you can in 30 seconds.
                    </p>
                    <button onClick={startGame} className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Start Challenge
                    </button>
                </div>
            )}

            {isPlaying && (
                <div className="w-full max-w-lg flex flex-col items-center animate-in zoom-in duration-300">
                    <div className="absolute top-6 left-6 z-10 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
                        <p className="text-slate-300 font-bold">Time: <span className="text-orange-400">{timeLeft}s</span></p>
                    </div>

                    <p className="text-slate-400 mb-2 uppercase tracking-widest text-sm font-mono">Reframing Target</p>
                    <h2 className="text-5xl font-bold text-white mb-10 tracking-tight">"{word}"</h2>

                    <form onSubmit={handleSubmit} className="w-full mb-8">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type a positive association & press enter..."
                            className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 text-white px-6 py-4 rounded-2xl outline-none text-xl shadow-inner transition placeholder-slate-500 text-center"
                            autoFocus
                        />
                    </form>

                    <div className="flex flex-wrap justify-center gap-3">
                        <AnimatePresence>
                            {associations.map((assoc, i) => (
                                <motion.div
                                    key={i + assoc}
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full font-medium shadow-sm"
                                >
                                    {assoc}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {isFinished && (
                <div className="text-center animate-in fade-in zoom-in">
                    <h3 className="text-3xl font-bold text-white mb-4">Shift Complete</h3>
                    <p className="text-slate-300 mb-2 text-lg">You reframed the word <strong className="text-white">"{word}"</strong> with {associations.length} new perspectives!</p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto mb-8 mt-6">
                        {associations.map((assoc, i) => (
                            <div key={i} className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-sm">
                                {assoc}
                            </div>
                        ))}
                    </div>
                    <button onClick={onComplete} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            )}
        </div>
    )
}


// --- Game 5: Worry Shredder ---
function WorryShredder({ onComplete }: { onComplete: () => void }) {
    const [worry, setWorry] = useState('');
    const [isShredding, setIsShredding] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const shredWorry = () => {
        if (!worry) return;
        setIsShredding(true);
        setTimeout(() => {
            setIsShredding(false);
            setIsFinished(true);
        }, 3000);
    }

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border border-white/10 overflow-hidden">
            {isFinished ? (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <h3 className="text-3xl font-bold text-white mb-4">Worry Destroyed</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        Letting go can be powerful.
                    </p>
                    <button onClick={onComplete} className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md flex flex-col items-center z-10 text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">Worry Shredder</h3>
                    <p className="text-slate-300 mb-8">
                        Write down a persistent worry taking up space in your mind, then destroy it.
                    </p>

                    <div className="relative w-full h-40 mb-8">
                        {/* The Paper */}
                        <motion.div
                            animate={isShredding ? { y: 150, opacity: 0 } : { y: 0, opacity: 1 }}
                            transition={{ duration: 2.5, ease: "linear" }}
                            className="w-full h-32 bg-yellow-100 p-4 rounded text-gray-800 shadow-md transform -skew-y-1 relative"
                        >
                            <textarea
                                value={worry} onChange={e => setWorry(e.target.value)}
                                disabled={isShredding}
                                className="w-full h-full bg-transparent border-none outline-none resize-none font-sans text-xl text-center font-medium"
                                placeholder="I am worried about..."
                            />
                            {/* Lines */}
                            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #3b82f6 27px, #3b82f6 28px)' }}></div>
                        </motion.div>

                        {/* The Shredder Slot */}
                        <div className={`absolute bottom-0 w-full h-10 bg-slate-800 rounded-lg border-2 border-slate-700 shadow-xl flex items-center justify-center -translate-y-4 z-20 ${isShredding ? 'animate-pulse' : ''}`}>
                            <div className="w-[95%] h-2 bg-black rounded-full shadow-inner" />
                        </div>

                        {/* Confetti (Shreds) */}
                        <AnimatePresence>
                            {isShredding && (
                                <div className="absolute -bottom-20 w-full flex justify-between z-10 px-4">
                                    {[...Array(15)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 0 }}
                                            animate={{ opacity: 1, y: 200 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: 0.5 + Math.random() * 0.5, duration: 1.5 + Math.random() }}
                                            className="w-2 h-16 bg-yellow-100/80 rounded"
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        disabled={!worry || isShredding}
                        onClick={shredWorry}
                        className="px-8 py-3 disabled:opacity-50 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition text-lg font-bold flex items-center gap-2"
                    >
                        <Cloud className="w-5 h-5" /> Shred It
                    </button>
                </div>
            )}
        </div>
    )
}

// --- Game 6: Balloon Release ---
function BalloonRelease({ onComplete }: { onComplete: () => void }) {
    const [thought, setThought] = useState('');
    const [isReleased, setIsReleased] = useState(false);

    const handleRelease = () => {
        if (!thought) return;
        setIsReleased(true);
        setTimeout(() => {
            onComplete();
        }, 4000);
    }

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-gradient-to-b from-blue-400 to-indigo-900 rounded-3xl p-8 flex flex-col items-center justify-end relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>

            <AnimatePresence>
                {!isReleased && (
                    <motion.div exit={{ opacity: 0 }} className="text-center z-10 mb-8 max-w-md w-full">
                        <h3 className="text-3xl font-bold text-white mb-4">Balloon Release</h3>
                        <p className="text-blue-100 mb-6">Type a thought that's weighing you down, and let it go.</p>

                        <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl mb-6 shadow-2xl relative">
                            <textarea
                                value={thought} onChange={e => setThought(e.target.value)}
                                className="w-full bg-transparent border-none outline-none resize-none text-white text-xl placeholder-blue-200 text-center"
                                placeholder="I keep thinking..."
                            />
                        </div>

                        <button
                            disabled={!thought}
                            onClick={handleRelease}
                            className="w-full py-4 disabled:opacity-50 bg-white hover:bg-blue-50 text-blue-600 rounded-2xl shadow-xl transition-all text-xl font-bold flex items-center justify-center gap-2"
                        >
                            <Wind className="w-6 h-6" /> Let Go
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtly animated clouds */}
            <div className="-bottom-10 left-10 absolute pointer-events-none opacity-50 blur-sm">
                <Cloud className="text-white w-40 h-40" />
            </div>
            <div className="top-20 right-20 absolute pointer-events-none opacity-30 blur-sm">
                <Cloud className="text-white w-24 h-24" />
            </div>

            {isReleased && (
                <motion.div
                    initial={{ y: 0, scale: 1 }}
                    animate={{ y: -800, scale: 0.5, x: 100 }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute bottom-20 flex flex-col items-center"
                >
                    <div className="w-32 h-40 bg-red-400 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center text-white p-4 text-center break-words text-sm font-semibold opacity-90 overflow-hidden leading-tight">
                        {thought}
                    </div>
                    {/* Knot and string */}
                    <div className="w-4 h-4 bg-red-400 rotate-45 -mt-2" />
                    <div className="w-1 h-32 border-l-2 border-white/50 border-dashed" />
                </motion.div>
            )}
        </div>
    )
}

// --- Game 7: Zen Sand Garden ---
function ZenSandGarden({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<{ id: number, points: { x: number, y: number }[] }[]>([]);
    const [currentLine, setCurrentLine] = useState<{ x: number, y: number }[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDrawing(true);
        const rect = e.currentTarget.getBoundingClientRect();
        setCurrentLine([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDrawing) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setCurrentLine(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    };

    const handlePointerUp = () => {
        setIsDrawing(false);
        if (currentLine.length > 0) {
            setLines(prev => [...prev, { id: Date.now(), points: currentLine }]);
            setCurrentLine([]);
        }
    };

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-amber-50 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden border-8 border-amber-900 border-l-[16px] border-b-[16px]">
            {/* Visual Sand Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/sand.png')] opacity-40 pointer-events-none"></div>

            <div className="absolute top-4 w-full flex justify-between px-8 z-20 pointer-events-none">
                <h3 className="text-xl font-bold text-amber-900/60 drop-shadow-sm">Zen Sand Garden</h3>
                <button onClick={onComplete} className="pointer-events-auto px-4 py-1.5 bg-amber-900/10 hover:bg-amber-900/20 text-amber-900 rounded-full text-sm font-bold transition">Done</button>
            </div>

            {/* Drawing Canvas Area */}
            <div
                className="absolute inset-0 z-10 cursor-crosshair touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <svg className="w-full h-full">
                    <defs>
                        <filter id="sand-ridge">
                            <feDropShadow dx="-1" dy="2" stdDeviation="1" floodColor="#8B4513" floodOpacity="0.4" />
                            <feDropShadow dx="1" dy="-1" stdDeviation="1" floodColor="#F5DEB3" floodOpacity="0.8" />
                        </filter>
                    </defs>
                    {lines.map((line) => (
                        <polyline
                            key={line.id}
                            points={line.points.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="#C2A878"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#sand-ridge)"
                            className="opacity-80"
                        />
                    ))}
                    {currentLine.length > 0 && (
                        <polyline
                            points={currentLine.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="#C2A878"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#sand-ridge)"
                            className="opacity-80"
                        />
                    )}
                </svg>
            </div>

            {/* Decorative Stones */}
            <div className="absolute top-1/4 left-1/4 w-12 h-10 bg-slate-600 rounded-full shadow-[2px_4px_10px_rgba(0,0,0,0.5)] rotate-12 z-10 pointer-events-none"></div>
            <div className="absolute bottom-1/3 right-1/4 w-16 h-12 bg-slate-700 rounded-full shadow-[2px_4px_10px_rgba(0,0,0,0.5)] -rotate-12 z-10 pointer-events-none"></div>

            {lines.length === 0 && !isDrawing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <p className="text-amber-900/40 text-lg font-medium animate-pulse">Drag your pointer to rake the sand...</p>
                </div>
            )}
        </div>
    )
}

// --- Game 8: Rhythm Tap ---
function RhythmTap({ onComplete }: { onComplete: () => void }) {
    const [taps, setTaps] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleTap = () => {
        if (isFinished) return;
        const now = Date.now();

        // Evaluate rhythm
        if (taps.length > 0) {
            const diff = now - taps[taps.length - 1];
            // Target interval: 1000ms (60 BPM)
            if (diff > 800 && diff < 1200) {
                setScore(s => s + 10);
            } else {
                setScore(s => Math.max(0, s - 5));
            }
        }

        setTaps(prev => [...prev, now]);

        if (taps.length >= 20 && !isFinished) {
            setTimeout(() => setIsFinished(true), 1000);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleTap();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [taps, isFinished]);

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border border-white/10 overflow-hidden" onClick={handleTap}>
            {isFinished ? (
                <div className="text-center animate-in fade-in zoom-in duration-500 z-20">
                    <h3 className="text-3xl font-bold text-white mb-4">Steady Rhythm Maintained</h3>
                    <p className="text-emerald-400 text-2xl font-bold mb-8">Harmony Score: {score}</p>
                    <button onClick={onComplete} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            ) : (
                <div className="text-center z-10 pointer-events-none">
                    <h3 className="text-3xl font-bold text-white mb-4">Rhythm Tap</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-12 text-lg">
                        Tap anywhere or press Spacebar rhythmically like a slow, calm heartbeat (about 1 tap per second).
                    </p>

                    <div className="relative w-40 h-40 mx-auto mb-8">
                        <AnimatePresence>
                            {taps.map((t, i) => (
                                i === taps.length - 1 && (
                                    <motion.div
                                        key={t}
                                        initial={{ scale: 0.5, opacity: 1 }}
                                        animate={{ scale: 2.5, opacity: 0 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="absolute inset-0 bg-emerald-500 rounded-full"
                                    />
                                )
                            ))}
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-slate-800 border-4 border-slate-700 rounded-full flex items-center justify-center shadow-lg">
                            <Heart className={`text-emerald-400 w-16 h-16 ${taps.length % 2 === 0 ? 'scale-110' : 'scale-100'} transition-transform duration-200`} />
                        </div>
                    </div>

                    <p className="text-emerald-500 font-bold text-xl">Score: {score}</p>
                    <p className="text-slate-500 mt-2">{taps.length} / 20 Taps</p>
                </div>
            )}
        </div>
    )
}

// --- Game 9: Pattern Memory (Simon) ---
function PatternMemory({ onComplete }: { onComplete: () => void }) {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSequence, setPlayerSequence] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPattern, setShowPattern] = useState(false);
    const [activePad, setActivePad] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const pads = [
        { id: 1, color: 'bg-red-500', activeColor: 'bg-red-400 border-red-200 shadow-[0_0_30px_rgba(239,68,68,0.8)]' },
        { id: 2, color: 'bg-blue-500', activeColor: 'bg-blue-400 border-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.8)]' },
        { id: 3, color: 'bg-yellow-500', activeColor: 'bg-yellow-400 border-yellow-200 shadow-[0_0_30px_rgba(234,179,8,0.8)]' },
        { id: 4, color: 'bg-emerald-500', activeColor: 'bg-emerald-400 border-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.8)]' },
    ];

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setSequence([Math.floor(Math.random() * 4) + 1]);
        setPlayerSequence([]);
    };

    useEffect(() => {
        if (sequence.length > 0 && isPlaying) {
            playSequence();
        }
    }, [sequence, isPlaying]);

    const playSequence = async () => {
        setShowPattern(true);
        await new Promise(r => setTimeout(r, 800)); // Pause before starting

        for (let i = 0; i < sequence.length; i++) {
            setActivePad(sequence[i]);
            await new Promise(r => setTimeout(r, 600)); // Pad lit time
            setActivePad(null);
            await new Promise(r => setTimeout(r, 200)); // Gap between pads
        }
        setShowPattern(false);
    };

    const handlePadClick = (id: number) => {
        if (showPattern || !isPlaying || isFinished) return;

        setActivePad(id);
        setTimeout(() => setActivePad(null), 200);

        const newPlayerSeq = [...playerSequence, id];
        setPlayerSequence(newPlayerSeq);

        // Check correctness
        const currentIndex = newPlayerSeq.length - 1;
        if (newPlayerSeq[currentIndex] !== sequence[currentIndex]) {
            // Wrong
            setIsFinished(true);
            return;
        }

        // Sequence completed correctly
        if (newPlayerSeq.length === sequence.length) {
            setScore(s => s + 1);
            setPlayerSequence([]);
            setTimeout(() => {
                setSequence(prev => [...prev, Math.floor(Math.random() * 4) + 1]);
            }, 1000);
        }
    };

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border border-white/10 overflow-hidden">
            {!isPlaying && !isFinished && (
                <div className="text-center z-10">
                    <h3 className="text-3xl font-bold text-white mb-4">Pattern Memory</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        Focus your attention. Remember the pattern of lights and repeat it back.
                    </p>
                    <button onClick={startGame} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Start Focus Session
                    </button>
                </div>
            )}

            {isPlaying && !isFinished && (
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Level {score + 1}</h3>
                    <p className="text-slate-400 mb-8 h-6">{showPattern ? "Watch the pattern..." : "Your turn!"}</p>

                    <div className="grid grid-cols-2 gap-4 max-w-[300px] mx-auto p-4 bg-slate-800 rounded-full">
                        {pads.map(pad => (
                            <button
                                key={pad.id}
                                onClick={() => handlePadClick(pad.id)}
                                disabled={showPattern}
                                className={`w-32 h-32 rounded-full border-4 transition-all duration-200 
                   ${activePad === pad.id ? pad.activeColor : `${pad.color} opacity-60 hover:opacity-80 border-slate-700`}
                 `}
                            />
                        ))}
                    </div>
                </div>
            )}

            {isFinished && (
                <div className="text-center animate-in fade-in zoom-in duration-500 z-20">
                    <h3 className="text-3xl font-bold text-white mb-4">Focus Session Complete</h3>
                    <p className="text-blue-400 text-2xl font-bold mb-8">Highest Level Reached: {score}</p>
                    <p className="text-slate-400 mb-8">Excellent work directing your attention.</p>
                    <button onClick={onComplete} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            )}
        </div>
    )
}


// --- Game 10: Breathing Visualizer ---
function BreathingVisualizer({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2' | 'prepare'>('prepare');
    const [timeLeft, setTimeLeft] = useState(0);
    const [cycles, setCycles] = useState(0);
    const targetCycles = 4;

    // 4-7-8 Breathing Technique
    const timings = { inhale: 4, hold1: 7, exhale: 8, hold2: 0 };

    const startBreathing = () => {
        setPhase('inhale');
        setTimeLeft(timings.inhale);
    };

    useEffect(() => {
        if (phase === 'prepare' || cycles >= targetCycles) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    // Switch phase
                    if (phase === 'inhale') {
                        setPhase('hold1');
                        return timings.hold1;
                    } else if (phase === 'hold1') {
                        setPhase('exhale');
                        return timings.exhale;
                    } else if (phase === 'exhale') {
                        setCycles(c => c + 1);
                        if (cycles + 1 >= targetCycles) return 0; // Done
                        setPhase('inhale');
                        return timings.inhale;
                    }
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [phase, cycles]);

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border border-white/10 overflow-hidden">
            {cycles >= targetCycles ? (
                <div className="text-center animate-in fade-in zoom-in duration-500 z-20">
                    <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wind className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Nervous System Reset</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        You've completed 4 cycles of 4-7-8 breathing. Notice how your body feels.
                    </p>
                    <button onClick={onComplete} className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            ) : phase === 'prepare' ? (
                <div className="text-center z-10">
                    <h3 className="text-3xl font-bold text-white mb-4">4-7-8 Breathing</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        A powerful technique to reduce anxiety and help you sleep. We'll do 4 cycles.
                        <br /><br />
                        Inhale for 4s, Hold for 7s, Exhale for 8s.
                    </p>
                    <button onClick={startBreathing} className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Begin Breathing
                    </button>
                </div>
            ) : (
                <div className="text-center z-10 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-slate-400 mb-12 uppercase tracking-widest">Cycle {cycles + 1} of {targetCycles}</h3>

                    <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                        {/* Visualizer Circle */}
                        <motion.div
                            className="absolute rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-20 blur-xl"
                            animate={{
                                scale: phase === 'inhale' ? 2 : phase === 'exhale' ? 1 : phase === 'hold1' ? 2 : 1
                            }}
                            transition={{
                                duration: phase === 'inhale' ? timings.inhale : phase === 'exhale' ? timings.exhale : timings.hold1,
                                ease: "easeInOut"
                            }}
                            style={{ width: '100%', height: '100%' }}
                        />

                        <motion.div
                            className="absolute w-40 h-40 rounded-full border-4 border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                            animate={{
                                scale: phase === 'inhale' ? 1.5 : phase === 'exhale' ? 0.8 : phase === 'hold1' ? 1.5 : 0.8
                            }}
                            transition={{
                                duration: phase === 'inhale' ? timings.inhale : phase === 'exhale' ? timings.exhale : timings.hold1,
                                ease: "easeInOut"
                            }}
                        >
                            <p className="text-4xl font-bold text-white">{timeLeft}</p>
                        </motion.div>
                    </div>

                    <h2 className="text-4xl font-bold text-cyan-400 uppercase tracking-widest">
                        {phase === 'inhale' && "Breathe In"}
                        {phase === 'hold1' && "Hold"}
                        {phase === 'exhale' && "Breathe Out"}
                    </h2>
                </div>
            )}
        </div>
    )
}

// --- Game 11: Emotion Wheel Sorter ---
const wordsToSort = [
    { text: "Frustrated", bucket: "Anger" },
    { text: "Overwhelmed", bucket: "Fear" },
    { text: "Content", bucket: "Joy" },
    { text: "Lonely", bucket: "Sadness" },
    { text: "Anxious", bucket: "Fear" },
    { text: "Hopeful", bucket: "Joy" },
    { text: "Jealous", bucket: "Anger" },
    { text: "Disappointed", bucket: "Sadness" }
];

function EmotionWheelSorter({ onComplete }: { onComplete: () => void }) {
    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const buckets = [
        { name: 'Joy', color: 'bg-yellow-500 hover:bg-yellow-600', icon: Smile },
        { name: 'Sadness', color: 'bg-blue-500 hover:bg-blue-600', icon: Cloud },
        { name: 'Anger', color: 'bg-red-500 hover:bg-red-600', icon: Flame },
        { name: 'Fear', color: 'bg-purple-500 hover:bg-purple-600', icon: Eye },
    ];

    const handleSort = (bucketName: string) => {
        if (isFinished || feedback) return;

        const correct = wordsToSort[currentWordIdx].bucket === bucketName;
        setFeedback(correct ? 'correct' : 'wrong');
        if (correct) setScore(s => s + 1);

        setTimeout(() => {
            setFeedback(null);
            if (currentWordIdx + 1 < wordsToSort.length) {
                setCurrentWordIdx(currentWordIdx + 1);
            } else {
                setIsFinished(true);
            }
        }, 800);
    };

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border border-white/10 overflow-hidden">
            {isFinished ? (
                <div className="text-center animate-in fade-in zoom-in duration-500 z-20">
                    <h3 className="text-3xl font-bold text-white mb-4">Emotional Granularity Built</h3>
                    <p className="text-emerald-400 text-2xl font-bold mb-8">Score: {score} / {wordsToSort.length}</p>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        Accurately naming your emotions reduces their intensity.
                    </p>
                    <button onClick={onComplete} className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-2xl text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Emotion Sorter</h3>
                    <p className="text-slate-400 mb-12">Identify the core emotion behind this nuanced feeling.</p>

                    <div className="mb-16 min-h-[120px] flex items-center justify-center relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentWordIdx}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.2, y: -20, filter: 'blur(10px)' }}
                                className="bg-slate-800 border-2 border-slate-700 px-12 py-6 rounded-2xl shadow-xl"
                            >
                                <p className="text-5xl font-bold tracking-tight text-white">{wordsToSort[currentWordIdx].text}</p>
                            </motion.div>
                        </AnimatePresence>

                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                                className="absolute -top-4 -right-4"
                            >
                                {feedback === 'correct' ?
                                    <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg"><CheckCircle2 className="w-8 h-8" /></div> :
                                    <div className="bg-red-500 text-white p-2 rounded-full shadow-lg"><X className="w-8 h-8" /></div>
                                }
                            </motion.div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {buckets.map(b => (
                            <button
                                key={b.name}
                                onClick={() => handleSort(b.name)}
                                disabled={feedback !== null}
                                className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 ${b.color} disabled:opacity-50 disabled:hover:translate-y-0 text-white`}
                            >
                                <b.icon className="w-8 h-8 mb-2 opacity-80" />
                                <span className="font-bold text-lg tracking-wide">{b.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// --- Game 12: Affirmation Match ---
const affirmationPairs = [
    { id: 1, text: "I am enough", matchId: 1 },
    { id: 2, text: "I am enough", matchId: 1 },
    { id: 3, text: "I choose peace", matchId: 2 },
    { id: 4, text: "I choose peace", matchId: 2 },
    { id: 5, text: "My feelings are valid", matchId: 3 },
    { id: 6, text: "My feelings are valid", matchId: 3 },
    { id: 7, text: "I can try again", matchId: 4 },
    { id: 8, text: "I can try again", matchId: 4 },
    { id: 9, text: "I am growing", matchId: 5 },
    { id: 10, text: "I am growing", matchId: 5 },
    { id: 11, text: "I deserve rest", matchId: 6 },
    { id: 12, text: "I deserve rest", matchId: 6 },
];

function AffirmationMatch({ onComplete }: { onComplete: () => void }) {
    const [cards, setCards] = useState(() => [...affirmationPairs].sort(() => Math.random() - 0.5));
    const [flippedIds, setFlippedIds] = useState<number[]>([]);
    const [matchedIds, setMatchedIds] = useState<number[]>([]);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (flippedIds.length === 2) {
            const card1 = cards.find(c => c.id === flippedIds[0]);
            const card2 = cards.find(c => c.id === flippedIds[1]);

            if (card1 && card2 && card1.matchId === card2.matchId) {
                setMatchedIds(prev => [...prev, flippedIds[0], flippedIds[1]]);
                setFlippedIds([]);
            } else {
                setTimeout(() => setFlippedIds([]), 1000);
            }
        }
    }, [flippedIds, cards]);

    useEffect(() => {
        if (matchedIds.length === cards.length && cards.length > 0) {
            setTimeout(() => setIsFinished(true), 1000);
        }
    }, [matchedIds, cards]);

    const handleCardClick = (id: number) => {
        if (flippedIds.length >= 2 || flippedIds.includes(id) || matchedIds.includes(id)) return;
        setFlippedIds(prev => [...prev, id]);
    };

    return (
        <div className="w-full h-full max-w-4xl min-h-[500px] bg-slate-900/80 rounded-3xl p-8 flex flex-col items-center justify-center relative border border-white/10 overflow-hidden">
            {isFinished ? (
                <div className="text-center animate-in fade-in zoom-in duration-500 z-20">
                    <h3 className="text-3xl font-bold text-white mb-4">Affirmations Internalized</h3>
                    <p className="text-slate-300 max-w-md mx-auto mb-8 text-lg">
                        Your mind has absorbed these positive truths.
                    </p>
                    <button onClick={onComplete} className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-lg transition text-lg font-bold">
                        Finish Session
                    </button>
                </div>
            ) : (
                <div className="w-full">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white">Affirmation Match</h3>
                        <p className="text-slate-400">Find the matching positive statements.</p>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        <AnimatePresence>
                            {cards.map(card => {
                                const isFlipped = flippedIds.includes(card.id) || matchedIds.includes(card.id);
                                const isMatched = matchedIds.includes(card.id);
                                return (
                                    <div key={card.id} className="relative h-24 sm:h-32 perspective-1000 cursor-pointer" onClick={() => handleCardClick(card.id)}>
                                        <motion.div
                                            className="w-full h-full relative preserve-3d transition-all duration-500 rounded-xl"
                                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                                            style={{
                                                boxShadow: isMatched ? '0 0 15px rgba(236, 72, 153, 0.5)' : ''
                                            }}
                                        >
                                            {/* Back (Hidden side initially) */}
                                            <div className="absolute inset-0 backface-hidden bg-slate-800 border-2 border-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-700 transition">
                                                <Sparkles className="text-slate-600 w-8 h-8" />
                                            </div>

                                            {/* Front (Affirmation side) */}
                                            <div className={`absolute inset-0 backface-hidden rounded-xl flex items-center justify-center p-3 text-center rotate-y-180 border-2 
                              ${isMatched ? 'bg-pink-900/50 border-pink-500 text-pink-200' : 'bg-pink-500 border-pink-400 text-white'}
                           `}>
                                                <p className="text-sm sm:text-base font-bold leading-tight">{card.text}</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    )
}

const games: GameData[] = [
    {
        id: 'g1',
        title: 'Cognitive Pop',
        category: 'CBT',
        icon: Zap,
        color: 'from-pink-400 to-rose-400',
        thumbnail: 'bg-gradient-to-br from-pink-400 to-rose-400',
        description: 'Pop negative thought bubbles and let positive truths float to the top.',
        clinicalBenefit: 'Trains the brain to quickly identify and dismiss negative automatic thoughts, a core CBT skill.',
        component: null as any
    },
    {
        id: 'g2',
        title: '5-4-3-2-1 Grounding',
        category: 'Grounding',
        icon: Eye,
        color: 'from-teal-400 to-emerald-400',
        thumbnail: 'bg-gradient-to-br from-teal-400 to-emerald-400',
        description: 'Find visual objects matching sensory criteria in a calming environment.',
        clinicalBenefit: 'Based on the clinical grounding technique to pull users out of an anxiety or panic attack by focusing on sensory details.',
        component: null as any
    },
    {
        id: 'g3',
        title: 'Flow State Connector',
        category: 'Focus',
        icon: Activity,
        color: 'from-indigo-400 to-blue-400',
        thumbnail: 'bg-gradient-to-br from-indigo-400 to-blue-400',
        description: 'Connect the dots without crossing lines in this soothing visual puzzle.',
        clinicalBenefit: 'Induces a mild "flow state" which lowers cortisol levels and acts as a distraction mechanism for rumination.',
        component: null as any
    },
    {
        id: 'g4',
        title: 'Word Shift',
        category: 'CBT',
        icon: ArrowRight,
        color: 'from-orange-400 to-amber-400',
        thumbnail: 'bg-gradient-to-br from-orange-400 to-amber-400',
        description: 'Quickly type positive associations to stressful words before time runs out.',
        clinicalBenefit: 'Promotes cognitive flexibility and breaks tunnel-vision stress patterns by forcing rapid positive reframing.',
        component: null as any
    },
    {
        id: 'g5',
        title: 'Worry Shredder',
        category: 'Cognitive',
        icon: Cloud,
        color: 'from-slate-400 to-slate-600',
        thumbnail: 'bg-gradient-to-br from-slate-400 to-slate-600',
        description: 'Visually destroy a persistent worry.',
        clinicalBenefit: 'Aids in thought defusion by externalizing internal anxieties.',
        component: null as any
    },
    {
        id: 'g6',
        title: 'Balloon Release',
        category: 'Anxiety Relief',
        icon: Wind,
        color: 'from-blue-400 to-indigo-400',
        thumbnail: 'bg-gradient-to-br from-blue-400 to-indigo-400',
        description: 'Watch your intrusive thoughts drift away.',
        clinicalBenefit: 'Promotes psychological distancing from intrusive rumination.',
        component: null as any
    },
    {
        id: 'g7',
        title: 'Zen Sand Garden',
        category: 'Relaxation',
        icon: MousePointer2,
        color: 'from-amber-600 to-yellow-600',
        thumbnail: 'bg-gradient-to-br from-amber-600 to-yellow-600',
        description: 'Draw soothing rake patterns in a digital sandbox.',
        clinicalBenefit: 'Active meditation that engages the somatosensory cortex for grounding.',
        component: null as any
    },
    {
        id: 'g8',
        title: 'Rhythm Tap',
        category: 'Grounding',
        icon: Heart,
        color: 'from-emerald-400 to-green-500',
        thumbnail: 'bg-gradient-to-br from-emerald-400 to-green-500',
        description: 'Maintain a steady, calming heartbeat rhythm.',
        clinicalBenefit: 'Entrains the nervous system to slower rhythms, reducing hyperarousal.',
        component: null as any
    },
    {
        id: 'g9',
        title: 'Pattern Memory',
        category: 'Focus',
        icon: Target,
        color: 'from-blue-500 to-cyan-500',
        thumbnail: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        description: 'Focus your attention to remember increasing light patterns.',
        clinicalBenefit: 'Improves working memory and directs attention away from rumination via high cognitive load.',
        component: null as any
    },
    {
        id: 'g10',
        title: '4-7-8 Breathing',
        category: 'Relaxation',
        icon: Wind,
        color: 'from-cyan-400 to-blue-500',
        thumbnail: 'bg-gradient-to-br from-cyan-400 to-blue-500',
        description: 'Guided breathing visualizer to reset your nervous system.',
        clinicalBenefit: 'Activates the parasympathetic nervous system to quickly lower heart rate and reduce panic.',
        component: null as any
    },
    {
        id: 'g11',
        title: 'Emotion Sorter',
        category: 'Cognitive',
        icon: Puzzle, // Assumed imported or changed to existing icon, will fix imports shortly
        color: 'from-purple-500 to-fuchsia-500',
        thumbnail: 'bg-gradient-to-br from-purple-500 to-fuchsia-500',
        description: 'Categorize nuanced feelings into core emotion buckets.',
        clinicalBenefit: 'Builds emotional granularity, which is proven to reduce the intensity of negative emotions.',
        component: null as any
    },
    {
        id: 'g12',
        title: 'Affirmation Match',
        category: 'CBT',
        icon: Sparkles,
        color: 'from-pink-500 to-rose-500',
        thumbnail: 'bg-gradient-to-br from-pink-500 to-rose-500',
        description: 'Memory matching game using positive truths.',
        clinicalBenefit: 'Combines memory recall with positive self-statements to subtly reinforce self-esteem.',
        component: null as any
    },
    {
        id: 'g13',
        title: 'Tension Release',
        category: 'Sensory',
        icon: Shield,
        color: 'from-rose-500 to-red-500',
        thumbnail: 'bg-gradient-to-br from-rose-500 to-red-500',
        description: 'Visually scan and release bodily tension.',
        clinicalBenefit: 'Adapted from Progressive Muscle Relaxation (PMR) to consciously release somatic grip.',
        component: null as any
    },
    {
        id: 'g14',
        title: 'Ripple Effect',
        category: 'Relaxation',
        icon: Waves,
        color: 'from-cyan-500 to-blue-600',
        thumbnail: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        description: 'Interactive calming water ripples.',
        clinicalBenefit: 'Purely sensory distraction to break rumination loops and provide visual soothing.',
        component: null as any
    },
    {
        id: 'g15',
        title: 'Focus Waterfall',
        category: 'Focus',
        icon: Droplet,
        color: 'from-teal-400 to-emerald-500',
        thumbnail: 'bg-gradient-to-br from-teal-400 to-emerald-500',
        description: 'Watch gentle falling particles to reset your mind.',
        clinicalBenefit: 'ADHD-friendly visual anchoring technique to rebuild attention span gently.',
        component: null as any
    },
    {
        id: 'g16',
        title: 'Color Harmony',
        category: 'Sensory',
        icon: Sun,
        color: 'from-fuchsia-400 to-purple-600',
        thumbnail: 'bg-gradient-to-br from-fuchsia-400 to-purple-600',
        description: 'Blend soft pastel colors to find a calming gradient.',
        clinicalBenefit: 'Engages the creative cortex, inducing mild flow state and emotional regulation.',
        component: null as any
    },
]

// Ensure games don't throw if mapped directly, though we handle it below
games.forEach(g => {
    // legacy attachment, no longer used primarily but kept for safety
    g.component = <GameStub name={g.title} onComplete={() => { }} />
})


export default function MindGym({ userName }: { userName?: string }) {
    const [activeGame, setActiveGame] = useState<string | null>(null)
    const [showDisclaimer, setShowDisclaimer] = useState<string | null>(null) // Game ID
    const [showCelebration, setShowCelebration] = useState(false)
    const [tokens, setTokens] = useState(120)
    const [streak, setStreak] = useState(3)
    const [focusMinutes, setFocusMinutes] = useState(45)

    // Handlers
    const handlePlayClick = (gameId: string) => {
        setShowDisclaimer(gameId)
    }

    const handleStartGame = () => {
        if (showDisclaimer) {
            setActiveGame(showDisclaimer)
            setShowDisclaimer(null)
        }
    }

    const handleFinishGame = () => {
        setActiveGame(null)
        setShowCelebration(true)
        setTokens(prev => prev + 15)
        setFocusMinutes(prev => prev + 5)
    }

    const handleCloseCelebration = (feltBetter: boolean) => {
        setShowCelebration(false)
        // Handle feedback logically if connected to backend
    }

    // --- Render Functions ---

    // 1. Dashboard Mode
    if (!activeGame) {
        return (
            <div className="relative w-full min-h-screen font-sans overflow-hidden pb-32">

                {/* ── Ethereal Background ── */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 30, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-[10%] -right-[10%] w-[60%] h-[70%] bg-indigo-100 rounded-full blur-[140px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, -20, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute bottom-[0%] -left-[10%] w-[50%] h-[60%] bg-purple-100 rounded-full blur-[140px]"
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 space-y-12">

                    {/* ── Header ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-purple-100/30"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center">
                                <Brain className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-1">Mind Gym</h1>
                                <p className="text-sm text-slate-500 font-light">Clinically-informed exercises to train your mind. Choose an activity below.</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-3">
                            {[
                                { label: 'Streak', value: `${streak} Days`, icon: Zap, bg: 'bg-orange-50 text-orange-400' },
                                { label: 'Focus', value: `${focusMinutes}m`, icon: Activity, bg: 'bg-blue-50 text-blue-400' },
                                { label: 'Tokens', value: String(tokens), icon: Sparkles, bg: 'bg-purple-50 text-purple-400' },
                            ].map(s => {
                                const Icon = s.icon
                                return (
                                    <div key={s.label} className="flex items-center gap-3 bg-white/50 backdrop-blur-md border border-white/70 rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}>
                                            <Icon className="w-4 h-4" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
                                            <p className="text-base font-medium text-slate-700">{s.value}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* ── Game Grid ── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-light text-slate-800">Interactive Exercises</h2>
                            <div className="flex gap-2">
                                <span className="text-[10px] px-3 py-1 rounded-full bg-white/60 border border-white/80 text-emerald-600 font-medium tracking-widest uppercase">16 Available</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {games.map(game => (
                                <GameCard key={game.id} game={game} onPlay={() => handlePlayClick(game.id)} />
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* ── Pre-Game Disclaimer Modal ── */}
                <AnimatePresence>
                    {showDisclaimer && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
                                onClick={() => setShowDisclaimer(null)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden max-w-md w-full p-8 md:p-10"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
                                    </div>
                                    <button onClick={() => setShowDisclaimer(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                        <X className="w-5 h-5" strokeWidth={1.5} />
                                    </button>
                                </div>
                                <h3 className="text-2xl font-light text-slate-800 tracking-tight mb-2">Before you begin</h3>
                                <p className="text-sm text-slate-500 font-light leading-relaxed mb-8">
                                    This exercise supports mental wellness and skill-building — it is <strong className="font-medium text-slate-700">not a replacement</strong> for clinical therapy.
                                    <br /><br />
                                    Are you in a safe, quiet space to focus for the next 3–5 minutes?
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowDisclaimer(null)} className="flex-1 py-3 px-4 rounded-full text-slate-500 font-medium hover:bg-slate-50 transition">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleStartGame}
                                        className="flex-[2] py-3 px-4 rounded-full bg-slate-800 text-white font-medium shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.18)] transition flex items-center justify-center gap-2"
                                    >
                                        <Play className="w-4 h-4" strokeWidth={1.5} /> I understand, Start
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* ── Post-Game Celebration Modal ── */}
                <AnimatePresence>
                    {showCelebration && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden max-w-md w-full text-center p-10"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-light text-slate-800 tracking-tight mb-2">Session Complete</h3>
                                <p className="text-sm text-slate-400 font-light mb-8">You earned <strong className="font-medium text-slate-700">+15 Mind Tokens</strong> and completed 5 minutes of focus time.</p>

                                <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left">
                                    <p className="text-sm font-medium text-slate-600 mb-4 text-center">Quick check-in: Do you feel slightly better?</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleCloseCelebration(true)}
                                            className="flex-1 py-3 rounded-full border border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <Smile className="w-4 h-4" strokeWidth={1.5} /> Yes
                                        </button>
                                        <button
                                            onClick={() => handleCloseCelebration(false)}
                                            className="flex-1 py-3 rounded-full border border-slate-200 bg-white text-slate-500 font-medium hover:bg-slate-50 transition shadow-sm"
                                        >
                                            Not really
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        )
    }

    // 2. Active Game Mode
    const game = games.find(g => g.id === activeGame)
    if (!game) return null

    let GameContent = () => <GameStub name={game.title} onComplete={handleFinishGame} />
    if (game.id === 'g1') GameContent = () => <CognitivePop onComplete={handleFinishGame} />
    if (game.id === 'g2') GameContent = () => <GroundingGrid onComplete={handleFinishGame} />
    if (game.id === 'g3') GameContent = () => <FlowConnector onComplete={handleFinishGame} />
    if (game.id === 'g4') GameContent = () => <WordShift onComplete={handleFinishGame} />
    if (game.id === 'g5') GameContent = () => <WorryShredder onComplete={handleFinishGame} />
    if (game.id === 'g6') GameContent = () => <BalloonRelease onComplete={handleFinishGame} />
    if (game.id === 'g7') GameContent = () => <ZenSandGarden onComplete={handleFinishGame} />
    if (game.id === 'g8') GameContent = () => <RhythmTap onComplete={handleFinishGame} />
    if (game.id === 'g9') GameContent = () => <PatternMemory onComplete={handleFinishGame} />
    if (game.id === 'g10') GameContent = () => <BreathingVisualizer onComplete={handleFinishGame} />
    if (game.id === 'g11') GameContent = () => <EmotionWheelSorter onComplete={handleFinishGame} />
    if (game.id === 'g12') GameContent = () => <AffirmationMatch onComplete={handleFinishGame} />
    if (game.id === 'g13') GameContent = () => <TensionReleaseMap onComplete={handleFinishGame} />
    if (game.id === 'g14') GameContent = () => <RippleEffect onComplete={handleFinishGame} />
    if (game.id === 'g15') GameContent = () => <FocusWaterfall onComplete={handleFinishGame} />
    if (game.id === 'g16') GameContent = () => <ColorHarmony onComplete={handleFinishGame} />

    return (
        <div className="h-full flex flex-col bg-slate-900 rounded-3xl overflow-hidden relative">
            <div className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${game.color} shadow-lg`}>
                        <game.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-medium leading-tight">{game.title}</h2>
                        <p className="text-slate-400 text-xs font-light">{game.category}</p>
                    </div>
                </div>
                <button
                    onClick={() => setActiveGame(null)}
                    className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>
            <div className="flex-1 relative overflow-hidden bg-slate-800 flex items-center justify-center p-6">
                <GameContent />
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// GAME CARD COMPONENT
// ----------------------------------------------------------------------
function GameCard({ game, onPlay }: { game: GameData, onPlay: () => void }) {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
        <div className="relative h-80 perspective-1000">
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
                {/* FRONT */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="absolute inset-0 backface-hidden rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.10)] overflow-hidden flex flex-col transition-shadow duration-300"
                >
                    <div className={`h-28 ${game.thumbnail} relative flex items-center justify-center overflow-hidden flex-shrink-0`}>
                        <game.icon className="w-10 h-10 text-white/40 absolute" strokeWidth={1.2} />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/70 border border-white/80 text-slate-500 font-semibold uppercase tracking-widest">
                                {game.category}
                            </span>
                            <button
                                onClick={e => { e.stopPropagation(); setIsFlipped(true) }}
                                className="p-1.5 rounded-full text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition"
                                title="Clinical Info"
                            >
                                <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                        </div>

                        <h3 className="text-base font-medium text-slate-800 mb-1 tracking-tight">{game.title}</h3>
                        <p className="text-xs text-slate-400 font-light line-clamp-2 mb-4 leading-relaxed flex-1">{game.description}</p>

                        <button
                            onClick={onPlay}
                            className="w-full py-2.5 rounded-full bg-slate-800 text-white text-xs font-medium shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Play className="w-3.5 h-3.5" strokeWidth={1.5} /> Play Now
                        </button>
                    </div>
                </motion.div>

                {/* BACK */}
                <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden flex flex-col p-6 rotate-y-180 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-indigo-400" strokeWidth={1.5} />
                            <span className="font-medium text-sm text-slate-200">Clinical Value</span>
                        </div>
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 transition"
                        >
                            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                    </div>
                    <p className="text-slate-400 text-sm font-light leading-relaxed flex-1">{game.clinicalBenefit}</p>
                    <button
                        onClick={() => { setIsFlipped(false); onPlay() }}
                        className="w-full py-2.5 rounded-full border border-slate-600 text-slate-200 text-sm font-medium hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                    >
                        <Play className="w-3.5 h-3.5" strokeWidth={1.5} /> Start Exercise
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
