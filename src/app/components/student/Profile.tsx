'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Mail, Building, GraduationCap, Camera, Bell, Shield, Moon, Globe, LogOut,
    ChevronRight, Save, Check, Palette, Lock, Phone, Heart,
    Award, Github, Linkedin, ExternalLink, Activity, Target, Zap, Search,
    Briefcase, FileText, Share2, Eye, Download, Info, Trash2
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import type { UserInfo } from '@/app/lib/types'

interface ProfileProps {
    userInfo: UserInfo
    onNavigate?: (page: string) => void
    onBack?: () => void
}

const CATEGORIES = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
]

export default function Profile({ userInfo, onNavigate, onBack }: ProfileProps) {
    const [activeTab, setActiveTab] = useState('overview')
    const [name, setName] = useState(userInfo.name || '')
    const [email, setEmail] = useState(userInfo.email || '')
    const [college, setCollege] = useState(userInfo.college || '')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('Senior Computer Science student passionate about AI and Mental Health Advocacy.')
    const [year, setYear] = useState('3rd Year')
    const [branch, setBranch] = useState('Computer Science')
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [saved, setSaved] = useState(false)

    // Professional
    const [github, setGithub] = useState('github.com/manna')
    const [linkedin, setLinkedin] = useState('linkedin.com/in/manna')

    // Settings toggles
    const [darkMode, setDarkMode] = useState(true)
    const [notifications, setNotifications] = useState(true)
    const [emailNotifs, setEmailNotifs] = useState(true)
    const [anonymousMode, setAnonymousMode] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const Toggle = ({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc: string }) => (
        <div className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-100">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <button
                onClick={() => onChange(!value)}
                className={cn(
                    "relative w-12 h-6 rounded-full transition-all duration-300",
                    value ? "bg-purple-500" : "bg-gray-700"
                )}
            >
                <motion.div
                    animate={{ x: value ? 26 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                />
            </button>
        </div>
    )

    const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 pb-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8">

                {/* ── Top Profile Header ── */}
                <div className="relative rounded-[2.5rem] bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-white/10 p-8 md:p-12 overflow-hidden mb-10">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] -z-10" />

                    <div className="flex flex-col md:flex-row items-center gap-10">
                        {/* Avatar */}
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-purple-500/20 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-bold">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-[2.5rem] bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <h1 className="text-4xl font-bold tracking-tight text-white">{name}</h1>
                                <span className="px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest w-fit mx-auto md:mx-0 flex items-center gap-2">
                                    <Zap className="w-3 h-3 fill-current" /> Pro Member
                                </span>
                            </div>
                            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl">{bio}</p>

                            <div className="flex items-center gap-6 mt-6 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-pointer">
                                    <Github className="w-5 h-5" />
                                    <span className="text-sm">manna-dev</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors cursor-pointer">
                                    <Linkedin className="w-5 h-5" />
                                    <span className="text-sm">manna-kumar</span>
                                </div>
                                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                            {[
                                { label: 'Streak', value: '42', icon: Zap, color: 'text-orange-500' },
                                { label: 'Karma', value: '1.2k', icon: Award, color: 'text-purple-500' },
                                { label: 'Focus', value: '89h', icon: Target, color: 'text-blue-500' },
                                { label: 'Sessions', value: '24', icon: Activity, color: 'text-emerald-500' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-4 min-w-[120px]">
                                    <div className="flex items-center justify-between mb-2">
                                        <stat.icon className={cn("w-4 h-4", stat.color)} />
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{stat.label}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Navigation Tabs ── */}
                <div className="flex items-center gap-2 mb-12 p-1.5 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] w-fit">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-sm font-semibold transition-all duration-300",
                                activeTab === cat.id
                                    ? "bg-white text-black shadow-lg shadow-white/10 scale-105"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            )}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* ── Main Content Area ── */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Left Column (Forms/Settings) */}
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'overview' && (
                            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10">
                                <SectionHeader title="Basic Information" subtitle="Update your personal profile details" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">College/University</label>
                                        <input value={college} onChange={e => setCollege(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 00000 00000" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button onClick={handleSave} className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                                        {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                        {saved ? "Profile Updated" : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'professional' && (
                            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10">
                                <SectionHeader title="Portfolio & Experience" subtitle="Manage your professional presence" />
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 group">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                                            <FileText className="w-7 h-7 text-purple-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white">Current Resume</p>
                                            <p className="text-sm text-gray-500">Manna_Kumar_CV_2024.pdf (2.4 MB)</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"><Eye className="w-4 h-4" /></button>
                                            <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"><Download className="w-4 h-4" /></button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">GitHub URL</label>
                                            <div className="relative">
                                                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input value={github} onChange={e => setGithub(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-purple-500 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">LinkedIn URL</label>
                                            <div className="relative">
                                                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input value={linkedin} onChange={e => setLinkedin(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-purple-500 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10">
                                <SectionHeader title="App Preferences" subtitle="Customize your experience within PeaceCode" />
                                <div className="space-y-4">
                                    <Toggle value={darkMode} onChange={setDarkMode} label="Global Dark Theme" desc="Optimized for eye comfort and focus" />
                                    <Toggle value={notifications} onChange={setNotifications} label="Push Notifications" desc="Get alerts for sessions and daily goals" />
                                    <Toggle value={emailNotifs} onChange={setEmailNotifs} label="Email Updates" desc="Weekly progress reports and tips" />
                                    <Toggle value={anonymousMode} onChange={setAnonymousMode} label="Incognito Browsing" desc="Hide your profile from search results" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10">
                                <SectionHeader title="Security & Access" subtitle="Manage your account security and connections" />
                                <div className="space-y-4">
                                    <button className="flex items-center justify-between w-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                                                <Lock className="w-6 h-6 text-orange-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">Change Password</p>
                                                <p className="text-sm text-gray-500">Last updated 3 months ago</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                                    </button>

                                    <button className="flex items-center justify-between w-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                <Info className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">Active Sessions</p>
                                                <p className="text-sm text-gray-500">3 devices currently logged in</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                                    </button>

                                    <button className="flex items-center justify-between w-full p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-all group text-left mt-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                                                <Trash2 className="w-6 h-6 text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-rose-500">Deactivate Account</p>
                                                <p className="text-sm text-rose-500/60">Effectively remove all your data permanently</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-rose-500/40 group-hover:text-rose-500" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Badges/Recent) */}
                    <div className="space-y-8">
                        {/* Badge Wall */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
                            <SectionHeader title="Achievements" subtitle="Earned through consistency" />
                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { label: 'Morning Lark', icon: Award, color: 'text-amber-500' },
                                    { label: 'Growth Guru', icon: Award, color: 'text-purple-500' },
                                    { label: 'Focus Master', icon: Award, color: 'text-blue-500' },
                                    { label: 'First Goal', icon: Award, color: 'text-emerald-500' },
                                    { label: 'Karma King', icon: Award, color: 'text-rose-500' },
                                    { label: 'Locked', icon: Info, color: 'text-gray-700' },
                                ].map((badge, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 group cursor-help">
                                        <div className={cn("w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300", badge.color)}>
                                            <badge.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 text-center uppercase leading-tight">{badge.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
                            <SectionHeader title="Actions" subtitle="Quick shortcuts" />
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                                    <span className="text-sm font-semibold">Verify Identity</span>
                                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                                    <span className="text-sm font-semibold">Join Community</span>
                                    <Share2 className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all group" onClick={onBack}>
                                    <span className="text-sm font-semibold text-rose-500">Logout Session</span>
                                    <LogOut className="w-4 h-4 text-rose-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}
