'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, Calendar, Users, Clock, Settings, Sparkles, LogOut, Bell, Home, Search
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Image from 'next/image'
import { useAuth } from '@/app/lib/AuthContext'
import { Sidebar, SidebarBody, SidebarLink, useSidebar, type SidebarLinkItem } from '@/app/components/ui/sidebar'

const therapistSections = [
    {
        category: 'Overview',
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/therapist/dashboard' },
            { id: 'schedule', label: 'My Schedule', icon: Calendar, path: '/therapist/schedule' },
            { id: 'students', label: 'Active Students', icon: Users, path: '/therapist/students' },
        ],
    },
    {
        category: 'Management',
        items: [
            { id: 'availability', label: 'Availability', icon: Clock, path: '/therapist/availability' },
            { id: 'settings', label: 'Settings', icon: Settings, path: '/therapist/settings' },
        ],
    },
]

function TherapistSidebarContent() {
    const { open } = useSidebar()
    const router = useRouter()
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const isActive = (path: string) => pathname === path
    const initials = (user?.name || 'T').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="flex flex-col h-full py-4">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-4">
                {open ? (
                    <div className="flex items-center gap-2 py-3 px-1 mb-4">
                        <Image src="/assets/Untitled (22).png" alt="Peace Code" width={120} height={28} className="h-7 w-auto" />
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Therapist</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-3 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    {therapistSections.map((section) => (
                        <div key={section.category}>
                            <motion.p animate={{ opacity: open ? 1 : 0, height: open ? 'auto' : 0 }} className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em] px-3 mb-1.5 overflow-hidden">{section.category}</motion.p>
                            <div className="flex flex-col gap-0.5">
                                {section.items.map((item) => {
                                    const Icon = item.icon; const active = isActive(item.path)
                                    const link: SidebarLinkItem = { label: item.label, id: item.id, icon: <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-white' : 'text-gray-400')} /> }
                                    return <SidebarLink key={item.id} link={link} active={active} onClick={() => router.push(item.path)} />
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="px-4 mt-auto">
                {!open ? (
                    <div className="flex justify-center pt-4">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">{initials}</div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 mt-4 p-3 rounded-xl hover:bg-purple-50/60 transition-all duration-300">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0">{initials}</div>
                        <motion.div animate={{ opacity: open ? 1 : 0 }} className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 truncate">{user?.name || 'Therapist'}</p>
                            <p className="text-[10px] text-gray-400 truncate">{user?.speciality || 'Psychologist'}</p>
                        </motion.div>
                    </div>
                )}
                <motion.div animate={{ opacity: open ? 1 : 0, height: open ? 'auto' : 0 }} className="overflow-hidden">
                    <button onClick={logout} className="w-full mt-2 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300">
                        <LogOut className="w-4 h-4" /><span className="font-medium">Sign Out</span>
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'therapist')) router.push('/login')
    }, [user, isLoading, router])

    if (isLoading || !user) return null
    const initials = (user.name || 'T').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="min-h-screen bg-[#F4F4FF] font-sans">
            <nav className="sticky top-0 z-50 h-16 px-4 lg:px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-purple-100/50 shadow-[0_4px_30px_rgba(139,138,255,0.07)]">
                <div className="hidden md:flex items-center gap-2">
                    <button onClick={logout} className="p-2 rounded-xl hover:bg-purple-50 text-gray-400 hover:text-purple-500 transition-all" title="Sign Out"><Home className="w-[18px] h-[18px]" /></button>
                    <Image src="/assets/Untitled (22).png" alt="Peace Code" width={100} height={28} className="h-7 w-auto" />
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Therapist</span>
                </div>
                <div className={`relative transition-all duration-500 ease-out hidden md:block ${searchFocused ? 'w-[500px]' : 'w-[380px]'}`}>
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search students, sessions..." className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50/80 border border-purple-100/60 focus:border-purple-300 focus:bg-white outline-none transition-all text-sm text-gray-600 placeholder-gray-400" onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative p-2.5 rounded-xl hover:bg-purple-50 transition-all"><Bell className="w-5 h-5 text-gray-500" /><span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white" /></button>
                    <div className="hidden md:flex w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 items-center justify-center text-white text-sm font-bold shadow-lg">{initials}</div>
                </div>
            </nav>
            <div className="flex h-[calc(100vh-4rem)]">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
                    <SidebarBody className="justify-between gap-2 shadow-[4px_0_30px_rgba(139,138,255,0.04)]">
                        <TherapistSidebarContent />
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
        </div>
    )
}
