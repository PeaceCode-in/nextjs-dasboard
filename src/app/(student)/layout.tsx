'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Bell, ChevronDown,
    Bot, CalendarCheck, UserCheck, ClipboardCheck,
    Wind, Crosshair, Heart, PenLine, Activity, Brain,
    Users, BookMarked, Sparkles, Phone, LayoutDashboard,
    Settings, BarChart3, Calendar, FileText, Menu, X, LogOut, Home
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Image from 'next/image'
import { useAuth } from '@/app/lib/AuthContext'
import { Sidebar, SidebarBody, SidebarLink, useSidebar, type SidebarLinkItem } from '@/app/components/ui/sidebar'

interface SidebarSection {
    category: string
    items: { id: string; label: string; icon: React.ElementType; path: string }[]
}

const sections: SidebarSection[] = [
    {
        category: 'Core Care',
        items: [
            { id: 'peace-bot', label: 'Peace Bot', icon: Bot, path: '/peace-bot' },
            { id: 'counseling', label: 'Counseling', icon: CalendarCheck, path: '/counseling' },
            { id: 'experts', label: 'Experts', icon: UserCheck, path: '/experts' },
            { id: 'screening', label: 'Screening', icon: ClipboardCheck, path: '/screening' },
        ],
    },
    {
        category: 'Wellness Tools',
        items: [
            { id: 'breathe', label: 'Breathe', icon: Wind, path: '/breathe' },
            { id: 'focus', label: 'Focus', icon: Crosshair, path: '/focus' },
            { id: 'gratitude', label: 'Gratitude', icon: Heart, path: '/gratitude' },
            { id: 'journal', label: 'Journal', icon: PenLine, path: '/journal' },
            { id: 'mood-tracker', label: 'Mood Tracker', icon: Activity, path: '/mood-tracker' },
            { id: 'mind-gym', label: 'Mind Gym', icon: Brain, path: '/mind-gym' },
        ],
    },
    {
        category: 'Community & Resources',
        items: [
            { id: 'community', label: 'Community', icon: Users, path: '/community' },
            { id: 'resources', label: 'Resources', icon: BookMarked, path: '/resources' },
        ],
    },
]

const serviceItems = [
    { label: 'Therapy Sessions', path: '/counseling', icon: Calendar, desc: 'Book & manage sessions' },
    { label: 'Wellness Plans', path: '/screening', icon: FileText, desc: 'Personalized pathways' },
    { label: 'Progress Reports', path: '/mood-tracker', icon: BarChart3, desc: 'Track your growth' },
    { label: 'Settings', path: '/profile', icon: Settings, desc: 'Account & preferences' },
]

function SidebarContent({ userName, userCollege }: { userName?: string; userCollege?: string }) {
    const { open } = useSidebar()
    const router = useRouter()
    const pathname = usePathname()

    const displayName = userName || 'Student'
    const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

    const isActive = (path: string) => pathname === path || pathname.startsWith(path)

    return (
        <div className="flex flex-col h-full py-4">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex items-center justify-between mb-8">
                    {open ? (
                        <div className="flex items-center gap-2 py-3 px-1">
                            <Image src="/dashboard/assets/Untitled (22).png" alt="Peace Code" width={120} height={28} className="h-7 w-auto" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-200/50">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    {sections.map((section) => (
                        <div key={section.category}>
                            <motion.p
                                animate={{ opacity: open ? 1 : 0, height: open ? 'auto' : 0 }}
                                className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em] px-3 mb-1.5 overflow-hidden"
                            >
                                {section.category}
                            </motion.p>
                            <div className="flex flex-col gap-0.5">
                                {section.items.map((item) => {
                                    const Icon = item.icon
                                    const active = isActive(item.path)
                                    const link: SidebarLinkItem = {
                                        label: item.label,
                                        id: item.id,
                                        icon: <Icon className={cn('w-[18px] h-[18px] flex-shrink-0 transition-colors duration-300', active ? 'text-white' : 'text-gray-400 group-hover/sidebar:text-purple-500')} />,
                                    }
                                    return (
                                        <SidebarLink key={item.id} link={link} active={active} onClick={() => router.push(item.path)} />
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-auto">
                <motion.div animate={{ opacity: open ? 1 : 0, height: open ? 'auto' : 0 }} className="overflow-hidden">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/50 mt-4">
                        <p className="text-sm font-semibold text-purple-800 mb-1">Need help now?</p>
                        <p className="text-xs text-purple-600/70 mb-3 leading-relaxed">Talk to someone who understands</p>
                        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium shadow-lg shadow-purple-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> Crisis Support
                        </button>
                    </div>
                </motion.div>
                {!open ? (
                    <div className="flex justify-center pt-4">
                        <button onClick={() => router.push('/profile')} className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">{initials}</button>
                    </div>
                ) : (
                    <button onClick={() => router.push('/profile')} className="flex items-center gap-3 mt-4 p-3 rounded-xl hover:bg-purple-50/60 transition-all duration-300 cursor-pointer w-full text-left">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-200/50 flex-shrink-0">{initials}</div>
                        <motion.div animate={{ opacity: open ? 1 : 0 }} className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 truncate">{displayName}</p>
                            <p className="text-[10px] text-gray-400 truncate">{userCollege || 'Student'}</p>
                        </motion.div>
                    </button>
                )}
            </div>
        </div>
    )
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [showServices, setShowServices] = useState(false)

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'student')) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    if (isLoading || !user) return null

    const displayName = user.name || 'Student'
    const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="min-h-screen bg-[#F4F4FF] font-sans">
            {/* Top Nav */}
            <nav className="sticky top-0 z-50 h-16 px-4 lg:px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-purple-100/50 shadow-[0_4px_30px_rgba(139,138,255,0.07)]">
                <div className="flex items-center gap-3">
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-xl hover:bg-purple-50 text-gray-500 transition-colors"><Menu className="w-6 h-6" /></button>
                        <Image src="/dashboard/assets/Untitled (22).png" alt="Peace Code" width={100} height={28} className="h-7 w-auto" />
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <Image src="/dashboard/assets/Untitled (22).png" alt="Peace Code" width={100} height={28} className="h-7 w-auto" />
                        <button onClick={() => router.push('/dashboard')} className={cn('p-2 rounded-xl transition-all duration-300', pathname === '/dashboard' ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-50 text-gray-400 hover:text-purple-500')} title="Dashboard">
                            <LayoutDashboard className="w-[18px] h-[18px]" />
                        </button>
                    </div>
                </div>
                <div className={`relative transition-all duration-500 ease-out hidden md:block ${searchFocused ? 'w-[500px]' : 'w-[380px]'}`}>
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search peacecode.in" className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-gray-50/80 border border-purple-100/60 focus:border-purple-300 focus:bg-white focus:shadow-lg focus:shadow-purple-100/40 outline-none transition-all duration-300 text-sm text-gray-600 placeholder-gray-400" onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-gray-400 bg-white/90 px-2 py-1 rounded-lg border border-gray-200/80 font-medium">⌘ K</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-purple-50 transition-all duration-300 font-medium" onClick={() => setShowServices(!showServices)}>
                        <span className="hidden sm:inline">My Services</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showServices ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {showServices && (
                                <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl shadow-purple-100/40 border border-purple-50 p-2 z-50">
                                    {serviceItems.map((s) => {
                                        const Icon = s.icon; return (
                                            <button key={s.label} className="w-full text-left px-3 py-3 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all duration-200 flex items-center gap-3 group" onClick={() => { router.push(s.path); setShowServices(false) }}>
                                                <div className="w-8 h-8 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors"><Icon className="w-4 h-4 text-purple-500" /></div>
                                                <div><p className="font-semibold text-sm">{s.label}</p><p className="text-[10px] text-gray-400">{s.desc}</p></div>
                                            </button>
                                        )
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={() => { window.location.href = process.env.NODE_ENV === 'production' ? 'https://peacecode.in' : 'http://localhost:3000' }}
                        className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-purple-600 hover:bg-purple-50 font-medium transition-all"
                    >
                        <Home className="w-4 h-4" /> Landing Page
                    </button>
                    <button
                        onClick={logout}
                        className="hidden md:flex p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => router.push('/notifications')}
                        className="relative p-2.5 rounded-xl hover:bg-purple-50 transition-all duration-300"
                        title="Notifications"
                    >
                        <Bell className="w-5 h-5 text-gray-500" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white" />
                    </button>
                    <button onClick={() => router.push('/profile')} className="hidden md:flex w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300" title={displayName}>{initials}</button>
                </div>
            </nav>

            {/* Layout */}
            <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
                    <SidebarBody className="justify-between gap-2 shadow-[4px_0_30px_rgba(139,138,255,0.04)]">
                        <SidebarContent userName={user.name} userCollege={user.college} />
                    </SidebarBody>
                </Sidebar>
                <main className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div key={pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="p-4 md:p-6">
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {showServices && <div className="fixed inset-0 z-40" onClick={() => setShowServices(false)} />}
        </div>
    )
}
