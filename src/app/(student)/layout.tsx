'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Bell, ChevronDown,
    Bot, CalendarCheck, UserCheck, ClipboardCheck,
    Wind, Crosshair, Heart, PenLine, Activity, Brain,
    Users, BookMarked, Sparkles, Phone, LayoutDashboard,
    Settings, BarChart3, Calendar, FileText, Menu, X, LogOut
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
        category: 'Navigation',
        items: [
            { id: 'dashboard', label: 'Discover', icon: LayoutDashboard, path: '/dashboard' },
            { id: 'counseling', label: 'My Board', icon: CalendarCheck, path: '/counseling' },
            { id: 'resources', label: 'Resume Hub', icon: BookMarked, path: '/resources' },
            { id: 'mood-tracker', label: 'Analytics', icon: BarChart3, path: '/mood-tracker' },
            { id: 'mind-gym', label: 'Pitch Toolkit', icon: Brain, path: '/mind-gym' },
            { id: 'experts', label: 'Pitch Simulator', icon: UserCheck, path: '/experts' },
            { id: 'screening', label: 'Pro Alerts', icon: ClipboardCheck, path: '/screening' }, // Will add crown in the link
            { id: 'community', label: 'Community', icon: Users, path: '/community' },
            { id: 'peace-bot', label: 'Integrations', icon: Bot, path: '/peace-bot' },
            { id: 'profile', label: 'Settings', icon: Settings, path: '/profile' },
        ],
    },
]

function SidebarContent({ userName, userCollege }: { userName?: string; userCollege?: string }) {
    const { open } = useSidebar()
    const router = useRouter()
    const pathname = usePathname()

    const displayName = userName || 'Student'
    const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

    const isActive = (path: string) => pathname === path || pathname.startsWith(path)

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                <div className="flex items-center justify-between mb-10 pt-2">
                    {open ? (
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">PeaceCode</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* User Section at Top (matches screenshot) */}
                <div className={cn("mb-8 transition-all duration-300", open ? "px-1" : "px-0")}>
                    <button onClick={() => router.push('/profile')} className="flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-white/[0.03] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center text-white text-xs font-bold shadow-xl flex-shrink-0 group-hover:scale-105 transition-transform">{initials}</div>
                        <motion.div animate={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }} className="flex-1 min-w-0 text-left overflow-hidden">
                            <p className="text-sm font-semibold text-gray-100 truncate">{displayName}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Free Plan</p>
                        </motion.div>
                    </button>
                    {open && <div className="h-[1px] w-full bg-white/[0.05] mt-4 mx-auto" />}
                </div>

                <div className="flex flex-col gap-1">
                    {sections.map((section) => (
                        <div key={section.category}>
                            <motion.p
                                animate={{ opacity: open ? 1 : 0, height: open ? 'auto' : 0 }}
                                className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-4 mb-4 overflow-hidden"
                            >
                                {section.category}
                            </motion.p>
                            <div className="flex flex-col gap-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon
                                    const active = isActive(item.path)
                                    const isPro = item.label === 'Pro Alerts'
                                    const link: SidebarLinkItem = {
                                        label: item.label,
                                        id: item.id,
                                        icon: <div className="relative">
                                            <Icon className={cn('w-[18px] h-[18px] flex-shrink-0 transition-colors duration-300', active ? 'text-white' : 'text-gray-400 group-hover/sidebar:text-purple-400')} />
                                            {isPro && !open && <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]" />}
                                        </div>,
                                    }
                                    return (
                                        <div key={item.id} className="relative group/item">
                                            <SidebarLink link={link} active={active} onClick={() => router.push(item.path)} />
                                            {isPro && open && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 translate-y-[-50%] pointer-events-none">
                                                    <span className="text-[10px] border border-yellow-500/50 text-yellow-500 rounded px-1.5 py-0.5 font-bold flex items-center gap-1">
                                                        <Sparkles className="w-2.5 h-2.5" /> PRO
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6 space-y-4">
                <AnimatePresence>
                    {open ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 blur-2xl -mr-10 -mt-10" />
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">Upgrade</p>
                                <p className="text-sm font-semibold text-white mb-3 leading-tight">Get full access to all insights</p>
                                <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5" /> Upgrade to PRO
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex justify-center">
                            <button className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black shadow-lg shadow-yellow-500/20 hover:scale-110 transition-transform">
                                <Sparkles className="w-5 h-5 text-black" />
                            </button>
                        </div>
                    )}
                </AnimatePresence>

                <div className="h-[1px] w-full bg-white/[0.05]" />

                <button
                    onClick={() => { /* Logout logic */ }}
                    className={cn(
                        "flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-rose-500/10 group transition-colors",
                        open ? "justify-start px-2" : "justify-center px-0"
                    )}
                >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-rose-500 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </div>
                    {open && <span className="text-sm font-medium text-gray-400 group-hover:text-rose-500 transition-colors">Sign Out</span>}
                </button>
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
        <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-purple-500/30">
            {/* Top Nav - Restyled for dark theme */}
            <nav className="sticky top-0 z-50 h-16 px-6 flex items-center justify-between bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.05]">
                <div className="flex items-center gap-8">
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 transition-colors"><Menu className="w-6 h-6" /></button>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tight">PeaceCode</span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={() => router.push('/dashboard')}>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tight">PeaceCode</span>
                            <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-purple-500 group-hover:w-full transition-all duration-300" />
                        </div>

                        <div className="h-4 w-[1px] bg-white/10" />

                        <div className="flex items-center gap-2">
                            <button onClick={() => router.push('/dashboard')} className={cn('p-2 rounded-xl transition-all duration-300', pathname === '/dashboard' ? 'bg-white/10 text-white shadow-lg' : 'hover:bg-white/5 text-gray-500 hover:text-gray-200')}>
                                <LayoutDashboard className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`relative transition-all duration-500 ease-out hidden md:block ${searchFocused ? 'w-[500px]' : 'w-[400px]'}`}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search dashboard..."
                        className="w-full pl-11 pr-20 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] focus:border-purple-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 text-sm text-gray-200 placeholder-gray-500"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] text-gray-500 bg-black/40 px-2 py-1 rounded-lg border border-white/10 font-bold backdrop-blur-md">
                        <span className="opacity-50">⌘</span> K
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/notifications')}
                        className="relative p-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                        title="Notifications"
                    >
                        <Bell className="w-5 h-5 text-gray-400" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#050505] shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    </button>

                    <div className="h-8 w-[1px] bg-white/10" />

                    <button onClick={() => router.push('/profile')} className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">{initials}</div>
                        <div className="flex flex-col items-start leading-none hidden sm:flex">
                            <span className="text-xs font-bold text-gray-100">{displayName.split(' ')[0]}</span>
                            <span className="text-[10px] text-gray-500 mt-0.5">Settings</span>
                        </div>
                    </button>
                </div>
            </nav>

            {/* Layout */}
            <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
                    <SidebarBody className="justify-between gap-10">
                        <SidebarContent userName={user.name} userCollege={user.college} />
                    </SidebarBody>
                </Sidebar>

                <main className="flex-1 overflow-y-auto relative">
                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] -z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] -z-10 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="p-6 md:p-8"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Sidebar Overlay Blur */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
