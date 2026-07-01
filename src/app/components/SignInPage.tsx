'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Mail, ShieldCheck, User, Sparkles, Building, Hash, GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Playfair_Display } from 'next/font/google'

// Fallback serif font
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'] })

export interface UserInfo {
    name: string
    role: 'student' | 'admin' | 'therapist'
    email?: string
    schoolNumber?: string
    college?: string
    year?: string
}

interface SignInPageProps {
    onSignIn: (user: UserInfo) => void
    initialMode?: 'login' | 'signup'
}

export default function SignInPage({ onSignIn }: SignInPageProps) {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    
    // Step 2 details
    const [name, setName] = useState('')
    const [schoolNumber, setSchoolNumber] = useState('')
    const [college, setCollege] = useState('')
    const [year, setYear] = useState('')
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const canContinueStep1 = email.trim().length > 3 && email.includes('@')
    const canContinueStep2 = name.trim().length > 1 && schoolNumber.trim().length > 0 && college.trim().length > 0

    const handleContinueStep1 = () => {
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            setStep(2)
        }, 600)
    }

    const handleComplete = () => {
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            onSignIn({
                name: name,
                role: 'student',
                email: email,
                schoolNumber: schoolNumber,
                college: college,
                year: year
            })
            router.push('/dashboard')
        }, 1000)
    }

    const handleSkip = () => {
        router.push('/dashboard')
    }

    // Animation variants for aesthetic text reveal
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        })
    }

    return (
        <div className="min-h-[100dvh] lg:min-h-0 lg:h-[100dvh] w-full relative flex flex-col lg:flex-row bg-[#e8f1f8] overflow-y-auto lg:overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <motion.img 
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    src="/dashboard/login-bg-v2.png" 
                    alt="Peaceful background" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Left Content */}
            <div className="relative z-10 w-full lg:w-[55%] flex flex-col justify-between p-6 lg:p-16 h-auto pt-8 lg:pt-16 lg:h-full">
                {/* Logo Area */}
                <motion.div 
                    custom={0} initial="hidden" animate="visible" variants={textVariants}
                    className="flex items-center gap-3"
                >
                    <img 
                        src="/dashboard/nav%20bar%20logo.svg" 
                        alt="Peace Code Logo" 
                        className="w-8 lg:w-10 h-auto brightness-0 opacity-90" 
                    />
                    <span 
                        className="text-xl lg:text-3xl font-medium tracking-wide text-[#162758]" 
                        style={{ fontFamily: "'Juana', serif", letterSpacing: '0.02em' }}
                    >
                        Peace Code
                    </span>
                </motion.div>

                {/* Typography Area */}
                <div className="mt-auto lg:mt-24 xl:mt-32 max-w-md xl:max-w-xl hidden lg:block pr-8">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="text-step-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 
                                    className={`text-5xl xl:text-7xl font-semibold text-[#162758] mb-4 xl:mb-6 leading-[1.15] tracking-tight ${playfair.className}`}
                                    style={{ fontFamily: "'Juana', serif" }}
                                >
                                    Find your <br/>
                                    inner <span className="italic text-[#1e3b8a] font-light">peace.</span>
                                </h1>
                                <p className="text-[#162758]/75 text-lg xl:text-xl font-medium leading-relaxed max-w-md">
                                    A sanctuary to pause, breathe, and reconnect with your true self.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="text-step-2"
                                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 
                                    className={`text-5xl xl:text-7xl font-semibold text-[#162758] mb-4 xl:mb-6 leading-[1.15] tracking-tight ${playfair.className}`}
                                    style={{ fontFamily: "'Juana', serif" }}
                                >
                                    Shape your <br/>
                                    own <span className="italic text-[#1e3b8a] font-light">path.</span>
                                </h1>
                                <p className="text-[#162758]/75 text-lg xl:text-xl font-medium leading-relaxed max-w-md">
                                    Let us personalize your experience as your journey begins.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Left Badge */}
                <motion.div 
                    custom={3} initial="hidden" animate="visible" variants={textVariants}
                    className="mt-auto hidden lg:flex items-center gap-4 bg-white/30 backdrop-blur-md border border-white/40 p-4 rounded-3xl w-max shadow-sm"
                >
                    <div className="w-12 h-12 rounded-full border border-[#1e3b8a]/20 bg-white/40 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-[#1e3b8a]" />
                    </div>
                    <div className="flex flex-col pr-4">
                        <span className="text-[#162758] font-semibold text-sm tracking-wide">Private. Secure. Always.</span>
                        <span className="text-[#162758]/70 text-xs mt-0.5">Your data is safe with us.</span>
                    </div>
                </motion.div>
            </div>

            {/* Right Content (Glass Panel) */}
            <div className="relative z-10 w-full lg:w-[45%] flex items-center justify-center p-4 lg:p-12 pb-8 h-auto flex-1 lg:h-full">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[460px] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_16px_64px_rgba(30,59,138,0.1)] rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 relative flex flex-col max-h-full overflow-y-auto hide-scrollbar"
                >
                    <div className="flex justify-center mb-6 shrink-0">
                        <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center border border-white/50 shadow-sm">
                            <img 
                                src="/dashboard/nav%20bar%20logo.svg" 
                                alt="Peace Code Logo" 
                                className="w-6 h-auto brightness-0 opacity-80" 
                            />
                        </div>
                    </div>
                    
                    <h2 
                        className={`text-2xl lg:text-3xl text-center text-[#162758] font-medium mb-2 shrink-0 ${playfair.className}`}
                        style={{ fontFamily: "'Juana', serif" }}
                    >
                        {step === 1 ? 'Welcome to Peace Code' : 'A few more details'}
                    </h2>
                    <p className="text-center text-[#162758]/70 text-sm mb-8 shrink-0 font-light">
                        {step === 1 
                            ? <span dangerouslySetInnerHTML={{ __html: "Let's begin your journey<br/>towards peace of mind." }} />
                            : 'Help us personalize your dashboard experience.'
                        }
                    </p>

                    {/* Progress indicator */}
                    <div className="mb-8 shrink-0">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-[#1e3b8a] font-medium text-xs">Step {step} of 2</p>
                            <p className="text-[#1e3b8a]/60 text-[10px]">{step === 1 ? 'Email' : 'Details'}</p>
                        </div>
                        <div className="w-full h-1 bg-[#1e3b8a]/10 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-[#1e3b8a] rounded-full"
                                initial={{ width: '50%' }}
                                animate={{ width: step === 1 ? '50%' : '100%' }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto hide-scrollbar shrink-0 mb-4 px-1 pb-1">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-[#162758] font-medium text-sm mb-1.5">Enter your student email ID</h3>
                                    <p className="text-[#162758]/60 text-xs mb-4 font-light">
                                        We'll send you to the next step based on your registration status.
                                    </p>

                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-[#1e3b8a]/40 group-focus-within:text-[#1e3b8a] transition-colors" />
                                        <input 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@university.edu"
                                            className="w-full pl-11 pr-4 py-3 lg:pl-12 lg:py-3.5 rounded-2xl border border-white/60 bg-white/50 text-sm text-[#162758] placeholder-[#162758]/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:bg-white/80 focus:border-[#1e3b8a]/30 focus:ring-4 focus:ring-[#1e3b8a]/10 transition-all duration-300"
                                        />
                                    </div>
                                    
                                    {/* Info Cards (Step 1 only) */}
                                    <div className="mt-6 space-y-3">
                                        <div className="bg-white/40 border border-white/60 rounded-2xl p-4 flex gap-3.5 items-start hover:bg-white/50 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-white/80 border border-white shadow-sm flex items-center justify-center shrink-0">
                                                <User className="w-4 h-4 text-[#1e3b8a]" />
                                            </div>
                                            <div className="mt-0.5">
                                                <h4 className="text-[#162758] font-medium text-xs">Already registered?</h4>
                                                <p className="text-[#162758]/60 text-[11px] mt-1 font-light">You'll be redirected to the login page.</p>
                                            </div>
                                        </div>

                                        <div className="bg-white/40 border border-white/60 rounded-2xl p-4 flex gap-3.5 items-start hover:bg-white/50 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-white/80 border border-white shadow-sm flex items-center justify-center shrink-0">
                                                <Sparkles className="w-4 h-4 text-[#1e3b8a]" />
                                            </div>
                                            <div className="mt-0.5">
                                                <h4 className="text-[#162758] font-medium text-xs">New here?</h4>
                                                <p className="text-[#162758]/60 text-[11px] mt-1 font-light">You'll be guided through a quick sign up.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-[#162758] font-medium text-xs mb-1.5 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1e3b8a]/40 group-focus-within:text-[#1e3b8a] transition-colors" />
                                            <input 
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Aditi Sharma"
                                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/60 bg-white/50 text-sm text-[#162758] placeholder-[#162758]/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:bg-white/80 focus:border-[#1e3b8a]/30 focus:ring-4 focus:ring-[#1e3b8a]/10 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[#162758] font-medium text-xs mb-1.5 ml-1">School / Roll Number</label>
                                        <div className="relative group">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1e3b8a]/40 group-focus-within:text-[#1e3b8a] transition-colors" />
                                            <input 
                                                type="text"
                                                value={schoolNumber}
                                                onChange={(e) => setSchoolNumber(e.target.value)}
                                                placeholder="e.g. 21BCE1234"
                                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/60 bg-white/50 text-sm text-[#162758] placeholder-[#162758]/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:bg-white/80 focus:border-[#1e3b8a]/30 focus:ring-4 focus:ring-[#1e3b8a]/10 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[#162758] font-medium text-xs mb-1.5 ml-1">College / University</label>
                                        <div className="relative group">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1e3b8a]/40 group-focus-within:text-[#1e3b8a] transition-colors" />
                                            <input 
                                                type="text"
                                                value={college}
                                                onChange={(e) => setCollege(e.target.value)}
                                                placeholder="e.g. IIT Delhi"
                                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/60 bg-white/50 text-sm text-[#162758] placeholder-[#162758]/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:bg-white/80 focus:border-[#1e3b8a]/30 focus:ring-4 focus:ring-[#1e3b8a]/10 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[#162758] font-medium text-xs mb-1.5 ml-1">Year of Study</label>
                                        <div className="relative group">
                                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1e3b8a]/40 group-focus-within:text-[#1e3b8a] transition-colors" />
                                            <input 
                                                type="text"
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                                placeholder="e.g. 2nd Year"
                                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/60 bg-white/50 text-sm text-[#162758] placeholder-[#162758]/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:bg-white/80 focus:border-[#1e3b8a]/30 focus:ring-4 focus:ring-[#1e3b8a]/10 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="shrink-0 mt-4">
                        {step === 1 ? (
                            <button
                                onClick={handleContinueStep1}
                                disabled={!canContinueStep1 || isSubmitting}
                                className={`w-full py-3.5 lg:py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                                    canContinueStep1 
                                    ? 'bg-[#1e3b8a] hover:bg-[#162758] hover:shadow-lg hover:shadow-[#1e3b8a]/30 hover:-translate-y-0.5' 
                                    : 'bg-[#1e3b8a]/40 cursor-not-allowed text-white/70'
                                }`}
                            >
                                {isSubmitting ? <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" /> : 'Continue'} 
                                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={!canContinueStep2 || isSubmitting}
                                className={`w-full py-3.5 lg:py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                                    canContinueStep2 
                                    ? 'bg-[#1e3b8a] hover:bg-[#162758] hover:shadow-lg hover:shadow-[#1e3b8a]/30 hover:-translate-y-0.5' 
                                    : 'bg-[#1e3b8a]/40 cursor-not-allowed text-white/70'
                                }`}
                            >
                                {isSubmitting ? <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" /> : 'Enter Dashboard'} 
                                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                            </button>
                        )}
                    </div>

                    <div className="mt-6 flex justify-center shrink-0">
                        {step === 1 ? (
                            <button 
                                onClick={handleSkip}
                                className="text-[#162758]/60 hover:text-[#1e3b8a] text-xs font-medium underline underline-offset-4 transition-colors hover:underline-offset-8"
                            >
                                Skip for now
                            </button>
                        ) : (
                            <button 
                                onClick={() => setStep(1)}
                                className="text-[#162758]/60 hover:text-[#1e3b8a] text-xs font-medium underline underline-offset-4 transition-colors hover:underline-offset-8"
                            >
                                Back to Email
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
