'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
    User, Mail, Building, GraduationCap, Camera, Bell, Shield, Moon, Globe, LogOut,
    ChevronRight, Save, Check, Palette, Lock, Phone, Heart,
} from 'lucide-react'
import type { UserInfo } from '@/app/lib/types'

interface ProfileProps {
    userInfo: UserInfo
    onNavigate?: (page: string) => void
    onBack?: () => void
}

export default function Profile({ userInfo, onNavigate, onBack }: ProfileProps) {
    const [name, setName] = useState(userInfo.name || '')
    const [email, setEmail] = useState(userInfo.email || '')
    const [college, setCollege] = useState(userInfo.college || '')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('')
    const [year, setYear] = useState('3rd Year')
    const [branch, setBranch] = useState('Computer Science')
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [saved, setSaved] = useState(false)

    // Settings toggles
    const [darkMode, setDarkMode] = useState(false)
    const [notifications, setNotifications] = useState(true)
    const [emailNotifs, setEmailNotifs] = useState(true)
    const [anonymousMode, setAnonymousMode] = useState(false)
    const [dataSharing, setDataSharing] = useState(true)
    const [language, setLanguage] = useState('English')

    const fileInputRef = useRef<HTMLInputElement>(null)

    const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setProfileImage(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
        <button
            onClick={() => onChange(!value)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? 'bg-slate-700' : 'bg-slate-200'}`}
        >
            <motion.div
                animate={{ x: value ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
            />
        </button>
    )

    const inputClass = "w-full pl-10 pr-4 py-3 rounded-2xl bg-white/50 border border-white/70 focus:border-slate-300 focus:bg-white focus:shadow-lg focus:shadow-slate-100/40 outline-none text-sm text-slate-700 font-light transition-all placeholder-slate-400"
    const cardClass = "rounded-[2rem] bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8"

    return (
        <div className="relative w-full min-h-screen font-sans overflow-hidden pb-32">

            {/* ── Ethereal Background ── */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 30, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-[10%] -right-[10%] w-[60%] h-[70%] bg-violet-100 rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-[0%] -left-[10%] w-[50%] h-[60%] bg-blue-100 rounded-full blur-[140px]"
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-10 space-y-8">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="flex items-center gap-5 pb-6 border-b border-purple-100/30"
                >
                    <div className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-1">Profile & Settings</h1>
                        <p className="text-sm text-slate-500 font-light">Manage your account, preferences, and privacy.</p>
                    </div>
                </motion.div>

                {/* ── Profile Card ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <div className={cardClass}>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar */}
                            <div className="relative group cursor-pointer flex-shrink-0" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-4 ring-white">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-2xl font-light">
                                            {initials}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-5 h-5 text-white" strokeWidth={1.5} />
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-light text-slate-800 tracking-tight">{name || 'Your Name'}</h2>
                                <p className="text-slate-500 text-sm font-light mt-1">{userInfo.role === 'student' ? '🎓 Student' : userInfo.role}</p>
                                <p className="text-slate-400 text-sm font-light mt-0.5">{college || 'Your College'}</p>
                                <div className="flex items-center gap-2 mt-3 justify-center md:justify-start flex-wrap">
                                    <span className="text-[10px] px-3 py-1 rounded-full bg-white/60 border border-white/80 text-slate-500 font-medium tracking-widest uppercase">{year}</span>
                                    <span className="text-[10px] px-3 py-1 rounded-full bg-white/60 border border-white/80 text-slate-500 font-medium tracking-widest uppercase">{branch}</span>
                                </div>
                            </div>

                            {/* Quick stats */}
                            <div className="flex gap-8">
                                {[
                                    { label: 'Streak', value: '23', emoji: '🔥' },
                                    { label: 'Karma', value: '47', emoji: '⭐' },
                                    { label: 'Journals', value: '12', emoji: '📝' },
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <span className="text-xl">{s.emoji}</span>
                                        <p className="text-xl font-light text-slate-800 mt-1">{s.value}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Personal Information ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                    <div className={cardClass}>
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100/60">
                            <div className="w-10 h-10 rounded-xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-lg font-light text-slate-800 tracking-tight">Personal Information</h3>
                                <p className="text-xs text-slate-400 font-light">Update your personal details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[
                                { label: 'Full Name', icon: User, value: name, onChange: setName, placeholder: 'Enter your name', type: 'text' },
                                { label: 'Email', icon: Mail, value: email, onChange: setEmail, placeholder: 'you@college.edu', type: 'email' },
                                { label: 'Phone', icon: Phone, value: phone, onChange: setPhone, placeholder: '+91 98765 43210', type: 'tel' },
                                { label: 'College / University', icon: Building, value: college, onChange: setCollege, placeholder: 'Your college name', type: 'text' },
                            ].map(field => {
                                const Icon = field.icon
                                return (
                                    <div key={field.label}>
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 block">{field.label}</label>
                                        <div className="relative">
                                            <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                                            <input
                                                type={field.type}
                                                value={field.value}
                                                onChange={e => field.onChange(e.target.value)}
                                                className={inputClass}
                                                placeholder={field.placeholder}
                                            />
                                        </div>
                                    </div>
                                )
                            })}

                            <div>
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 block">Year</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                                    <select value={year} onChange={e => setYear(e.target.value)} className={`${inputClass} cursor-pointer appearance-none`}>
                                        {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate'].map(y => <option key={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 block">Branch / Department</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                                    <input value={branch} onChange={e => setBranch(e.target.value)} className={inputClass} placeholder="e.g. Computer Science" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 block">Bio</label>
                            <textarea
                                value={bio} onChange={e => setBio(e.target.value)} rows={3}
                                className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/70 focus:border-slate-300 focus:bg-white outline-none text-sm text-slate-700 font-light transition-all resize-none placeholder-slate-400"
                                placeholder="Tell us a bit about yourself..."
                            />
                        </div>

                        <div className="flex justify-end mt-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                                    ${saved
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-800 text-white hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]'}`}
                            >
                                {saved ? <><Check className="w-4 h-4" strokeWidth={1.5} /> Saved!</> : <><Save className="w-4 h-4" strokeWidth={1.5} /> Save Changes</>}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* ── Preferences ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                    <div className={cardClass}>
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100/60">
                            <div className="w-10 h-10 rounded-xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center">
                                <Palette className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-lg font-light text-slate-800 tracking-tight">Preferences</h3>
                                <p className="text-xs text-slate-400 font-light">Customize your experience</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/40 transition-all">
                                <div className="flex items-center gap-3">
                                    <Moon className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">Dark Mode</p>
                                        <p className="text-xs text-slate-400 font-light">Switch to dark theme</p>
                                    </div>
                                </div>
                                <Toggle value={darkMode} onChange={setDarkMode} />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/40 transition-all">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">Language</p>
                                        <p className="text-xs text-slate-400 font-light">Choose your preferred language</p>
                                    </div>
                                </div>
                                <select
                                    value={language} onChange={e => setLanguage(e.target.value)}
                                    className="px-3 py-1.5 rounded-xl bg-white/60 border border-white/80 text-sm text-slate-600 font-light outline-none cursor-pointer"
                                >
                                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'].map(l => <option key={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Notifications ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
                    <div className={cardClass}>
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100/60">
                            <div className="w-10 h-10 rounded-xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center">
                                <Bell className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-lg font-light text-slate-800 tracking-tight">Notifications</h3>
                                <p className="text-xs text-slate-400 font-light">Control what alerts you receive</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            {[
                                { label: 'Push Notifications', desc: 'Reminders for meditation, journaling & sessions', icon: Bell, value: notifications, onChange: setNotifications },
                                { label: 'Email Notifications', desc: 'Weekly wellness reports & updates', icon: Mail, value: emailNotifs, onChange: setEmailNotifs },
                            ].map(item => {
                                const Icon = item.icon
                                return (
                                    <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/40 transition-all">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                                                <p className="text-xs text-slate-400 font-light">{item.desc}</p>
                                            </div>
                                        </div>
                                        <Toggle value={item.value} onChange={item.onChange} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* ── Privacy & Security ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                    <div className={cardClass}>
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100/60">
                            <div className="w-10 h-10 rounded-xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center">
                                <Shield className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-lg font-light text-slate-800 tracking-tight">Privacy & Security</h3>
                                <p className="text-xs text-slate-400 font-light">Your data, your control</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/40 transition-all">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">Anonymous Mode</p>
                                        <p className="text-xs text-slate-400 font-light">Hide your identity in community forums</p>
                                    </div>
                                </div>
                                <Toggle value={anonymousMode} onChange={setAnonymousMode} />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/40 transition-all">
                                <div className="flex items-center gap-3">
                                    <Heart className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">Wellness Data Sharing</p>
                                        <p className="text-xs text-slate-400 font-light">Share anonymous data to improve services</p>
                                    </div>
                                </div>
                                <Toggle value={dataSharing} onChange={setDataSharing} />
                            </div>

                            {[
                                { label: 'Change Password', desc: 'Update your account password', icon: Shield },
                                { label: 'Download My Data', desc: 'Export all your personal data', icon: Shield },
                            ].map(item => {
                                const Icon = item.icon
                                return (
                                    <button key={item.label} className="flex items-center justify-between w-full p-4 rounded-2xl hover:bg-white/40 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                                                <p className="text-xs text-slate-400 font-light">{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" strokeWidth={1.5} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* ── Quick Links ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
                    <div className={cardClass}>
                        <h3 className="text-lg font-light text-slate-800 tracking-tight mb-6 pb-6 border-b border-slate-100/60">Quick Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {[
                                { label: 'My Therapy Sessions', desc: 'View bookings & history', page: 'counseling', emoji: '📅' },
                                { label: 'Wellness Reports', desc: 'Track your progress', page: 'mood-tracker', emoji: '📊' },
                                { label: 'Community Profile', desc: 'Posts, karma & badges', page: 'community', emoji: '👥' },
                                { label: 'Saved Resources', desc: 'Bookmarked articles', page: 'resources', emoji: '📚' },
                            ].map((link, i) => (
                                <button key={i} onClick={() => onNavigate?.(link.page)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/40 transition-all group text-left w-full">
                                    <span className="text-xl">{link.emoji}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{link.label}</p>
                                        <p className="text-xs text-slate-400 font-light">{link.desc}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" strokeWidth={1.5} />
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── Sign Out ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                    <button
                        onClick={onBack}
                        className="w-full flex items-center justify-center gap-2.5 p-4 rounded-[2rem] border border-rose-100/80 bg-white/40 backdrop-blur-md text-rose-400 font-medium text-sm hover:bg-rose-50/60 hover:border-rose-200 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                    >
                        <LogOut className="w-4 h-4" strokeWidth={1.5} />
                        Sign Out
                    </button>
                </motion.div>

            </div>
        </div>
    )
}
