'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowRight, ArrowLeft, User, GraduationCap, ShieldCheck, Heart,
    Mail, Building, Briefcase, CheckCircle2, Sparkles, Lock, Phone
} from 'lucide-react'
const logoImg = '/dashboard/assets/Untitled (22).png'
const mascotSvg = '/dashboard/assets/Untitled design.svg'

/* ─── TYPES ─── */

export interface UserInfo {
    name: string
    role: 'student' | 'admin' | 'therapist'
    college?: string
    email?: string
    speciality?: string
    // New fields for student
    university?: string
    year?: string
    branch?: string
    phoneNumber?: string
}

interface SignInPageProps {
    onSignIn: (user: UserInfo) => void
    initialMode?: 'login' | 'signup'
}

/* ─── ANIMATION VARIANTS ─── */

const fadeSlide = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
    exit: { opacity: 0, x: -24, transition: { duration: 0.25 } },
}

/* ─── ROLES ─── */

const roles = [
    {
        id: 'student' as const,
        label: 'Student',
        description: 'Wellness & support',
        icon: GraduationCap,
        gradient: 'from-purple-400 to-indigo-400',
    },
    {
        id: 'admin' as const,
        label: 'Admin',
        description: 'Analytics & reports',
        icon: ShieldCheck,
        gradient: 'from-indigo-400 to-blue-400',
    },
    {
        id: 'therapist' as const,
        label: 'Psychologist',
        description: 'Sessions & care',
        icon: Heart,
        gradient: 'from-violet-400 to-purple-400',
    },
]

/* ─── BREATHING ORB (3D depth aura) ─── */

function BreathingOrb({ active, hasInput, step }: { active: boolean; hasInput: boolean; step: number }) {
    const colors = step === 1 ? ['#c4b5fd', '#a5b4fc', '#ddd6fe'] : ['#bfdbfe', '#a5f3fc', '#c4b5fd']
    return (
        <div className="relative flex items-center justify-center w-full h-full">
            {/* Outer atmospheric rings */}
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border pointer-events-none"
                    style={{
                        width: `${160 + i * 60}px`,
                        height: `${160 + i * 60}px`,
                        borderColor: `${colors[i - 1]}60`,
                    }}
                    animate={{
                        scale: active ? [1, 1.06, 1] : [1, 1.02, 1],
                        opacity: active ? [0.5, 0.8, 0.5] : [0.2, 0.35, 0.2],
                    }}
                    transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: 'easeInOut' as const, delay: i * 0.4 }}
                />
            ))}

            {/* Main 3D Sphere */}
            <motion.div
                animate={{
                    scale: active ? [1, 1.08, 1] : [1, 1.03, 1],
                    rotateY: [0, 5, 0, -5, 0],
                }}
                transition={{ scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }, rotateY: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const } }}
                style={{ perspective: 800 }}
                className="relative w-36 h-36 z-10 pointer-events-none"
            >
                <div
                    className="w-full h-full rounded-full relative overflow-hidden shadow-2xl"
                    style={{
                        background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${colors[0]} 30%, ${colors[1]} 65%, ${colors[2]} 90%)`,
                        boxShadow: `0 30px 60px ${colors[0]}60, 0 10px 30px ${colors[1]}40, inset 0 -10px 30px ${colors[2]}30`,
                    }}
                >
                    <div className="absolute top-[12%] left-[20%] w-12 h-8 rounded-full bg-white/60 blur-md" />
                    <div className="absolute top-[22%] left-[28%] w-5 h-3 rounded-full bg-white/80 blur-sm" />
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: `radial-gradient(circle at center, ${colors[0]}80 0%, transparent 70%)` }}
                    />
                </div>
                <motion.div
                    animate={{ scaleX: active ? [1, 1.1, 1] : [0.85, 0.95, 0.85], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full blur-xl pointer-events-none"
                    style={{ background: colors[1] }}
                />
            </motion.div>

            {/* Floating leaves / peace symbols */}
            {hasInput && [...Array(6)].map((_, i) => {
                const emojis = ['🌿', '✨', '🕊️', '🌸', '💜', '🌙']
                return (
                    <motion.div
                        key={i}
                        className="absolute text-base select-none pointer-events-none"
                        style={{
                            left: `${15 + (i * 14)}%`,
                            bottom: `${20 + (i % 3) * 20}%`,
                        }}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{
                            opacity: [0, 0.8, 0],
                            y: [-20, -80],
                            scale: [0.5, 1, 0.8],
                            x: [0, (i % 2 === 0 ? 12 : -12)],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' as const, delay: i * 0.5 }}
                    >
                        {emojis[i]}
                    </motion.div>
                )
            })}
        </div>
    )
}

/* ─── MAIN COMPONENT ─── */

export default function SignInPage({ onSignIn, initialMode = 'signup' }: SignInPageProps) {
    const [isLogin, setIsLogin] = useState(initialMode === 'login')
    const [step, setStep] = useState(1)
    const [isSuccess, setIsSuccess] = useState(false)

    // Form fields
    const [name, setName] = useState('')
    const [selectedRole, setSelectedRole] = useState<'student' | 'admin' | 'therapist' | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [college, setCollege] = useState('')
    const [university, setUniversity] = useState('')
    const [year, setYear] = useState('')
    const [branch, setBranch] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [speciality, setSpeciality] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const canProceedStep1 = name.trim().length >= 2 && selectedRole !== null
    const canProceedStep2 = email.trim().length > 3 && password.length >= 6 && password === confirmPassword
    const canProceedStep3 = otp.length === 6
    const hasAnyInput = name.trim().length > 0 || selectedRole !== null || email.trim().length > 0
    const canLogin = email.trim().length > 3 && password.length >= 6

    const handleMockSubmit = () => {
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)
            const userInfo: UserInfo = {
                name: isLogin ? 'Demo User' : name.trim(),
                role: !isLogin && selectedRole ? selectedRole : 'student',
                email: email.trim(),
                college: college.trim() || undefined,
                university: university.trim() || undefined,
                year: year.trim() || undefined,
                branch: branch.trim() || undefined,
                phoneNumber: phoneNumber.trim() || undefined,
                speciality: speciality.trim() || undefined
            }
            setTimeout(() => {
                onSignIn(userInfo)
            }, 1500)
        }, 1000)
    }

    // Handlers for switching mode
    const toggleMode = () => {
        setIsLogin(!isLogin)
        setStep(1) // reset step
        setIsSubmitting(false)
        setFocusedField(null)
    }

    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-[#F8F6FF]">
            {/* Sliding Form Container */}
            <motion.div
                className="absolute lg:fixed top-0 w-full lg:w-1/2 h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 py-12 z-20 bg-[#FAF8FF] shadow-2xl lg:shadow-none overflow-y-auto"
                initial={false}
                animate={{
                    left: isMobile ? '0%' : (isLogin ? '0%' : '50%'),
                    borderTopRightRadius: isLogin ? '0px' : (isMobile ? '0px' : '40px'),
                    borderBottomRightRadius: isLogin ? '0px' : (isMobile ? '0px' : '40px'),
                    borderTopLeftRadius: isLogin ? (isMobile ? '0px' : '40px') : '0px',
                    borderBottomLeftRadius: isLogin ? (isMobile ? '0px' : '40px') : '0px',
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: 'linear-gradient(160deg, #ffffff 0%, #FAF8FF 50%, #F5F0FF 100%)' }}
            >
                {/* Visual decorators for Form side */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', backgroundSize: '26px 26px' }} />

                <AnimatePresence>
                    {hasAnyInput && !isSubmitting && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
                        >
                            <BreathingOrb active={focusedField !== null} hasInput={hasAnyInput} step={step} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {focusedField && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, #ddd6fe40 0%, transparent 70%)' }}
                        />
                    )}
                </AnimatePresence>

                <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 hidden lg:block">
                        <img src={logoImg} alt="Peace Code" className="h-10 w-auto drop-shadow-md" />
                    </motion.div>

                    {/* Dynamic Form Content */}
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div key="success" {...fadeSlide} className="w-full flex flex-col items-center justify-center py-12">
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">
                                    {isLogin ? "Welcome Back!" : "Account Created!"}
                                </h2>
                                <p className="text-sm text-gray-500 text-center mb-8">
                                    {isLogin ? "You have successfully logged in." : "Your account has been created successfully."}
                                </p>
                                <button
                                    className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center text-white transition-all duration-300 opacity-80 cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', boxShadow: '0 12px 30px #c4b5fd60, 0 4px 12px #a78bfa40' }}
                                    disabled
                                >
                                    <Sparkles className="w-5 h-5 animate-spin mr-2" />
                                    Redirecting...
                                </button>
                            </motion.div>
                        ) : isLogin ? (
                            /* ── LOG IN FLOW ── */
                            <motion.div key="login" {...fadeSlide} className="w-full">
                                <h1 className="text-[26px] font-black text-gray-900 mb-1 leading-snug text-center">
                                    Welcome Back
                                </h1>
                                <p className="text-sm text-gray-400 mb-8 font-medium text-center">Sign in to your account</p>

                                <div className="space-y-4 mb-8">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setFocusedField('loginEmail')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="you@example.com"
                                                className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm text-gray-800 placeholder-gray-300 font-medium outline-none transition-all duration-300"
                                                style={{
                                                    background: focusedField === 'loginEmail' ? '#ffffff' : '#FAF8FF',
                                                    border: `2px solid ${focusedField === 'loginEmail' ? '#a78bfa' : '#ede9fe'}`,
                                                    boxShadow: focusedField === 'loginEmail' ? '0 0 0 4px #ddd6fe60, 0 8px 25px #c4b5fd20' : '0 2px 8px #ede9fe40',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* Password */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onFocus={() => setFocusedField('loginPass')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="••••••••"
                                                className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm text-gray-800 placeholder-gray-300 font-medium outline-none transition-all duration-300"
                                                style={{
                                                    background: focusedField === 'loginPass' ? '#ffffff' : '#FAF8FF',
                                                    border: `2px solid ${focusedField === 'loginPass' ? '#a78bfa' : '#ede9fe'}`,
                                                    boxShadow: focusedField === 'loginPass' ? '0 0 0 4px #ddd6fe60, 0 8px 25px #c4b5fd20' : '0 2px 8px #ede9fe40',
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-end mt-2">
                                            <button className="text-[11px] font-bold text-purple-500 hover:text-purple-600">Forgot password?</button>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={canLogin ? { scale: 1.02, y: -2 } : {}}
                                    whileTap={canLogin ? { scale: 0.98 } : {}}
                                    onClick={handleMockSubmit}
                                    disabled={!canLogin || isSubmitting}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300`}
                                    style={canLogin ? {
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                        boxShadow: '0 12px 30px #c4b5fd60, 0 4px 12px #a78bfa40',
                                        color: 'white',
                                    } : {
                                        background: '#F3EEFF',
                                        color: '#c4b5fd',
                                        cursor: 'not-allowed',
                                    }}
                                >
                                    {isSubmitting ? <Sparkles className="w-5 h-5 animate-spin" /> : 'Log In'}
                                </motion.button>

                                <p className="text-sm text-center font-medium text-gray-500 mt-8">
                                    Don't have an account? <button onClick={toggleMode} className="text-purple-600 font-bold hover:underline">Sign Up</button>
                                </p>
                            </motion.div>
                        ) : (
                            /* ── SIGN UP FLOW ── */
                            <div className="w-full flex flex-col items-center">
                                {/* Step Indicator */}
                                <div className="flex items-center gap-2 mb-8 relative z-10">
                                    {[1, 2, 3, 4].map((s) => (
                                        <div key={s} className="flex items-center gap-1">
                                            <motion.div
                                                animate={step === s ? { scale: [1, 1.15, 1] } : {}}
                                                transition={{ duration: 0.4 }}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${step > s
                                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-200/60'
                                                    : step === s
                                                        ? 'bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md shadow-purple-200/60'
                                                        : 'bg-purple-50 text-purple-300 border border-purple-100'
                                                    }`}
                                            >
                                                {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                                            </motion.div>
                                            {s < 4 && <div className={`w-6 h-px rounded-full transition-all duration-500 ${step > s ? 'bg-purple-400' : 'bg-purple-100'}`} />}
                                        </div>
                                    ))}
                                </div>

                                <AnimatePresence mode="wait">
                                    {/* Sign Up Step 1 */}
                                    {step === 1 && (
                                        <motion.div key="step1" {...fadeSlide} className="w-full">
                                            <h1 className="text-[26px] font-black text-gray-900 mb-1 leading-snug">
                                                Create Account
                                            </h1>
                                            <p className="text-sm text-gray-400 mb-7 font-medium">Join us for your personalized workspace.</p>

                                            <div className="mb-5">
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Your Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        onFocus={() => setFocusedField('name')}
                                                        onBlur={() => setFocusedField(null)}
                                                        placeholder="e.g. Arjun..."
                                                        className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm text-gray-800 placeholder-gray-300 font-medium outline-none transition-all duration-300"
                                                        style={{
                                                            background: focusedField === 'name' ? '#ffffff' : '#FAF8FF',
                                                            border: `2px solid ${focusedField === 'name' ? '#a78bfa' : '#ede9fe'}`,
                                                            boxShadow: focusedField === 'name' ? '0 0 0 4px #ddd6fe60, 0 8px 25px #c4b5fd20' : '0 2px 8px #ede9fe40',
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-7">
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">I am a...</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {roles.map((role) => {
                                                        const Icon = role.icon
                                                        const isSelected = selectedRole === role.id
                                                        return (
                                                            <button
                                                                key={role.id}
                                                                onClick={() => setSelectedRole(role.id)}
                                                                className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden`}
                                                                style={{
                                                                    borderColor: isSelected ? '#c4b5fd' : '#ede9fe',
                                                                    background: isSelected ? 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' : '#FAF8FF',
                                                                    boxShadow: isSelected ? '0 8px 24px #ddd6fe60, 0 4px 8px #c4b5fd30' : '0 2px 8px #ede9fe40',
                                                                }}
                                                            >
                                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2`}
                                                                    style={{
                                                                        background: isSelected ? `linear-gradient(135deg, ${role.gradient.includes('purple') ? '#a78bfa' : role.gradient.includes('indigo') ? '#818cf8' : '#c4b5fd'} 0%, #7c3aed 100%)` : '#F3EEFF',
                                                                    }}
                                                                >
                                                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                                                                </div>
                                                                <span className={`text-xs font-bold ${isSelected ? 'text-purple-800' : 'text-gray-500'}`}>{role.label}</span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={canProceedStep1 ? { scale: 1.02, y: -2 } : {}}
                                                whileTap={canProceedStep1 ? { scale: 0.98 } : {}}
                                                onClick={() => canProceedStep1 && setStep(2)}
                                                disabled={!canProceedStep1}
                                                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300`}
                                                style={canProceedStep1 ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', boxShadow: '0 12px 30px #c4b5fd60, 0 4px 12px #a78bfa40', color: 'white' } : { background: '#F3EEFF', color: '#c4b5fd', cursor: 'not-allowed' }}
                                            >
                                                Continue <ArrowRight className="w-4 h-4" />
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    {/* Sign Up Step 2 */}
                                    {step === 2 && (
                                        <motion.div key="step2" {...fadeSlide} className="w-full">
                                            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-600 transition-colors mb-5 font-medium">
                                                <ArrowLeft className="w-3.5 h-3.5" /> Back
                                            </button>
                                            <h1 className="text-[24px] font-black text-gray-900 mb-4">Account Details</h1>

                                            <div className="space-y-4 mb-7">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">{selectedRole === 'student' ? 'College Email' : 'Email Address'}</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder="you@example.edu" className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm text-gray-800 placeholder-gray-300 font-medium outline-none transition-all duration-300" style={{ background: focusedField === 'email' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'email' ? '#a78bfa' : '#ede9fe'}` }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocusedField('pass')} onBlur={() => setFocusedField(null)} placeholder="••••••••" className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm text-gray-800 placeholder-gray-300 font-medium outline-none transition-all duration-300" style={{ background: focusedField === 'pass' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'pass' ? '#a78bfa' : '#ede9fe'}` }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={() => setFocusedField('cpass')} onBlur={() => setFocusedField(null)} placeholder="••••••••" className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm text-gray-800 placeholder-gray-300 font-medium outline-none transition-all duration-300" style={{ background: focusedField === 'cpass' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'cpass' ? '#a78bfa' : '#ede9fe'}` }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={canProceedStep2 ? { scale: 1.02, y: -2 } : {}}
                                                whileTap={canProceedStep2 ? { scale: 0.98 } : {}}
                                                onClick={() => canProceedStep2 && setStep(3)}
                                                disabled={!canProceedStep2}
                                                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300`}
                                                style={canProceedStep2 ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', boxShadow: '0 12px 30px #c4b5fd60, 0 4px 12px #a78bfa40', color: 'white' } : { background: '#F3EEFF', color: '#c4b5fd', cursor: 'not-allowed' }}
                                            >
                                                Send OTP <ArrowRight className="w-4 h-4" />
                                            </motion.button>

                                            <button
                                                onClick={() => setStep(3)}
                                                className="w-full mt-3 text-xs text-gray-400 hover:text-purple-500 transition-colors font-medium text-center"
                                            >
                                                Skip for now
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Sign Up Step 3 (OTP) */}
                                    {step === 3 && (
                                        <motion.div key="step3" {...fadeSlide} className="w-full">
                                            <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-600 transition-colors mb-5 font-medium">
                                                <ArrowLeft className="w-3.5 h-3.5" /> Back
                                            </button>
                                            <h1 className="text-[24px] font-black text-gray-900 mb-2">Verify Email</h1>
                                            <p className="text-sm text-gray-400 mb-7 font-medium">We've sent a 6-digit code to {email}</p>

                                            <div className="mb-7">
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Verification Code</label>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                    <input
                                                        type="text"
                                                        maxLength={6}
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                                        onFocus={() => setFocusedField('otp')}
                                                        onBlur={() => setFocusedField(null)}
                                                        placeholder="123456"
                                                        className="w-full pl-11 pr-4 py-4 rounded-2xl text-2xl tracking-[0.5em] text-center font-bold text-gray-800 placeholder-gray-300 outline-none transition-all duration-300"
                                                        style={{ background: focusedField === 'otp' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'otp' ? '#a78bfa' : '#ede9fe'}` }}
                                                    />
                                                </div>
                                            </div>

                                            <motion.button
                                                whileHover={canProceedStep3 ? { scale: 1.02, y: -2 } : {}}
                                                whileTap={canProceedStep3 ? { scale: 0.98 } : {}}
                                                onClick={() => canProceedStep3 && setStep(4)}
                                                disabled={!canProceedStep3}
                                                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300`}
                                                style={canProceedStep3 ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', boxShadow: '0 12px 30px #c4b5fd60, 0 4px 12px #a78bfa40', color: 'white' } : { background: '#F3EEFF', color: '#c4b5fd', cursor: 'not-allowed' }}
                                            >
                                                Verify <ArrowRight className="w-4 h-4" />
                                            </motion.button>

                                            <button
                                                onClick={() => setStep(4)}
                                                className="w-full mt-3 text-xs text-gray-400 hover:text-purple-500 transition-colors font-medium text-center"
                                            >
                                                Skip for now
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Sign Up Step 4 */}
                                    {step === 4 && (
                                        <motion.div key="step4" {...fadeSlide} className="w-full">
                                            <button onClick={() => setStep(3)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-600 transition-colors mb-5 font-medium">
                                                <ArrowLeft className="w-3.5 h-3.5" /> Back
                                            </button>
                                            <h1 className="text-[24px] font-black text-gray-900 mb-4">Final Details 👋</h1>

                                            <div className="space-y-4 mb-7 max-h-[40vh] overflow-y-auto px-1 hide-scrollbar">
                                                {selectedRole === 'student' && (
                                                    <>
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">College</label>
                                                            <div className="relative">
                                                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                                <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} onFocus={() => setFocusedField('col')} onBlur={() => setFocusedField(null)} placeholder="e.g. IIT Delhi" className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all" style={{ background: focusedField === 'col' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'col' ? '#a78bfa' : '#ede9fe'}` }} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">University</label>
                                                            <div className="relative">
                                                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                                <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} onFocus={() => setFocusedField('uni')} onBlur={() => setFocusedField(null)} placeholder="Enter University" className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all" style={{ background: focusedField === 'uni' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'uni' ? '#a78bfa' : '#ede9fe'}` }} />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Year</label>
                                                                <input type="text" value={year} onChange={(e) => setYear(e.target.value)} onFocus={() => setFocusedField('yr')} onBlur={() => setFocusedField(null)} placeholder="e.g. 2nd Year" className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all" style={{ background: focusedField === 'yr' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'yr' ? '#a78bfa' : '#ede9fe'}` }} />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Branch</label>
                                                                <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} onFocus={() => setFocusedField('br')} onBlur={() => setFocusedField(null)} placeholder="e.g. CSE" className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all" style={{ background: focusedField === 'br' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'br' ? '#a78bfa' : '#ede9fe'}` }} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Phone Number</label>
                                                            <div className="relative">
                                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} onFocus={() => setFocusedField('ph')} onBlur={() => setFocusedField(null)} placeholder="+91 XXXXX XXXXX" className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all" style={{ background: focusedField === 'ph' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'ph' ? '#a78bfa' : '#ede9fe'}` }} />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {selectedRole === 'admin' && (
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Admin Access Code</label>
                                                        <div className="relative">
                                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                            <input type="text" placeholder="Enter your admin code..." onFocus={() => setFocusedField('code')} onBlur={() => setFocusedField(null)} className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm text-gray-800 outline-none transition-all" style={{ background: focusedField === 'code' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'code' ? '#a78bfa' : '#ede9fe'}` }} />
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedRole === 'therapist' && (
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2">Speciality</label>
                                                        <div className="relative">
                                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                                                            <input type="text" value={speciality} onChange={(e) => setSpeciality(e.target.value)} onFocus={() => setFocusedField('spec')} onBlur={() => setFocusedField(null)} placeholder="e.g. CBT, Anxiety..." className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm text-gray-800 outline-none transition-all" style={{ background: focusedField === 'spec' ? '#ffffff' : '#FAF8FF', border: `2px solid ${focusedField === 'spec' ? '#a78bfa' : '#ede9fe'}` }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleMockSubmit}
                                                disabled={isSubmitting}
                                                className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-white transition-all duration-300"
                                                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', boxShadow: '0 12px 30px #c4b5fd60, 0 4px 12px #a78bfa40' }}
                                            >
                                                {isSubmitting ? <Sparkles className="w-5 h-5 animate-spin" /> : 'Complete Sign Up'}
                                            </motion.button>

                                            <button
                                                onClick={handleMockSubmit}
                                                className="w-full mt-3 text-xs text-gray-400 hover:text-purple-500 transition-colors font-medium text-center"
                                            >
                                                Skip for now
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {step === 1 && (
                                    <p className="text-sm text-center font-medium text-gray-500 mt-8">
                                        Already have an account? <button onClick={toggleMode} className="text-purple-600 font-bold hover:underline">Log In</button>
                                    </p>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-[11px] text-gray-300 mt-8 text-center relative z-10 hidden lg:block">
                    Built with 💜 for campus mental wellness · peacecode.in
                </p>
            </motion.div>

            {/* Sliding Image/Branding Container */}
            <motion.div
                className="hidden lg:flex absolute top-0 w-1/2 h-full bg-white p-16 flex-col overflow-hidden z-10"
                initial={false}
                animate={{ left: isLogin ? '50%' : '0%' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-50/50 blur-[100px]" />
                    <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-50/40 blur-[100px]" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="relative z-20 flex items-center gap-3 mb-16">
                    <img src={logoImg} alt="Peace Code" className="h-10 w-auto" />
                    <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Beta Access</span>
                    </div>
                </div>

                <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="max-w-2xl mb-12">
                        <motion.h1
                            key={isLogin ? 'login-text' : 'signup-text'}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl xl:text-5xl font-bold text-slate-900 leading-tight mb-4"
                        >
                            {isLogin ? 'Welcome back to ' : 'Your Journey to '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                {isLogin ? 'Peace Code' : 'Mental Excellence'}
                            </span>
                        </motion.h1>

                        <p className="text-slate-500 text-lg max-w-lg mx-auto transition-opacity duration-300">
                            {isLogin ? 'Pick up right where you left off.' : 'The comprehensive wellness platform built for campus life.'}
                        </p>
                    </div>

                    <div className="relative w-full flex-1 flex flex-col items-center justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative w-[90%] h-[85%] flex items-end justify-center"
                        >
                            <img
                                src={mascotSvg}
                                alt="Wellness Journey"
                                className="w-full h-full object-contain object-bottom select-none pointer-events-none filter drop-shadow-[0_20px_50px_rgba(79,70,229,0.15)]"
                            />

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
                                className={`absolute top-[15%] ${isLogin ? 'right-[5%]' : 'left-[5%]'} p-5 rounded-2xl bg-white/80 backdrop-blur-md shadow-2xl border border-white/50 max-w-[220px] text-left`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Mindset</span>
                                </div>
                                <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                                    "Your presence makes a difference. Start your mindful session today."
                                </p>
                            </motion.div>
                        </motion.div>

                        <div className="w-full relative mt-[-2px]">
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-white flex items-center gap-8 whitespace-nowrap">
                                {[{ text: 'Privacy First', icon: ShieldCheck }, { text: 'Expert Guided', icon: User }, { text: '24/7 Access', icon: Sparkles }].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 group">
                                        <item.icon className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-20 mt-8 pt-6 border-t border-slate-50 flex justify-between items-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.15em]">
                    <span>© 2026 PEACE CODE ECOSYSTEM</span>
                    <div className="flex gap-6">
                        <span className="hover:text-blue-500 cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-blue-500 cursor-pointer transition-colors">Terms</span>
                        <span className="hover:text-blue-500 cursor-pointer transition-colors">Security</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
