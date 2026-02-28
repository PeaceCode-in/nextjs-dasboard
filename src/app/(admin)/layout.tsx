'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Bell, ChevronDown,
    LayoutDashboard, BarChart3, GitBranch, Wrench, MessageSquare,
    Activity, Settings, Sparkles, LogOut, Home,
} from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Image from 'next/image'
import { useAuth } from '@/app/lib/AuthContext'
import { Sidebar, SidebarBody, SidebarLink, useSidebar, type SidebarLinkItem } from '@/app/components/ui/sidebar'

const adminSections = [
    {
        category: 'Overview',
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
            { id: 'student-analytics', label: 'Student Analytics', icon: BarChart3, path: '/admin/student-analytics' },
            { id: 'branch-reports', label: 'Branch Reports', icon: GitBranch, path: '/admin/branch-reports' },
        ],
    },
    {
        category: 'Platform',
        items: [
            { id: 'tool-usage', label: 'Tool Usage', icon: Wrench, path: '/admin/tool-usage' },
            { id: 'community-insights', label: 'Community Insights', icon: MessageSquare, path: '/admin/community-insights' },
        ],
    },
    {
        category: 'System',
        items: [
            { id: 'system-health', label: 'System Health', icon: Activity, path: '/admin/system-health' },
            { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
        ],
    },
]

function AdminSidebarContent() {
    const { open } = useSidebar()
    const router = useRouter()
    const pathname = usePathname()
    const { logout } = useAuth()
    const isActive = (path: string) => pathname === path

    return (
        <div className="flex flex-col h-full py-4">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-4">
                {open ? (
                    <div className="flex items-center gap-2 py-3 px-1 mb-4">
                        <Image src="/assets/Untitled (22).png" alt="Peace Code" width={120} height={28} className="h-7 w-auto" />
                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-3 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-200/50">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    {adminSections.map((section) => (
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
                <motion.div animate={{ opacity: open ? 1 : 0, height: open ? 'auto' : 0 }} className="overflow-hidden">
                    <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 mt-2">
                        <LogOut className="w-4 h-4" /><span className="font-medium">Sign Out</span>
                    </button>
                </motion.div>
                {!open ? (
                    <div className="flex justify-center pt-4">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">A</div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 mt-4 p-3 rounded-xl hover:bg-purple-50/60 transition-all duration-300">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0">A</div>
                        <motion.div animate={{ opacity: open ? 1 : 0 }} className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 truncate">Admin Panel</p>
                            <p className="text-[10px] text-gray-400 truncate">University Administrator</p>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) router.push('/login')
    }, [user, isLoading, router])

    if (isLoading || !user) return null

    const notifications = [
        { id: 1, text: 'High anxiety detected in 3rd-year CS batch', time: '2h ago', critical: true },
        { id: 2, text: '5 new posts flagged for moderation', time: '3h ago', critical: false },
        { id: 3, text: 'Monthly report ready for download', time: '5h ago', critical: false },
    ]

    return (
        <div className="min-h-screen bg-[#F4F4FF] font-sans">
            <nav className="sticky top-0 z-50 h-16 px-4 lg:px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-purple-100/50 shadow-[0_4px_30px_rgba(139,138,255,0.07)]">
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2">
                        <button onClick={logout} className="p-2 rounded-xl hover:bg-purple-50 text-gray-400 hover:text-purple-500 transition-all duration-300" title="Back to Home">
                            <Home className="w-[18px] h-[18px]" />
                        </button>
                        <Image src="/assets/Untitled (22).png" alt="Peace Code" width={100} height={28} className="h-7 w-auto" />
                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                    </div>
                </div>
                <div className={`relative transition-all duration-500 ease-out hidden md:block ${searchFocused ? 'w-[500px]' : 'w-[380px]'}`}>
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search for admin tasks..." className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-gray-50/80 border border-purple-100/60 focus:border-purple-300 focus:bg-white outline-none transition-all duration-300 text-sm text-gray-600 placeholder-gray-400" onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 bg-white/90 px-2 py-1 rounded-lg border border-gray-200/80">⌘ K</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false) }} className="relative p-2.5 rounded-xl hover:bg-purple-50 transition-all duration-300">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white" />
                        </button>
                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-purple-50 p-3 z-50">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Notifications</p>
                                    {notifications.map((n) => (
                                        <div key={n.id} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-purple-50/60 transition-colors cursor-pointer">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.critical ? 'bg-red-500 animate-pulse' : 'bg-purple-300'}`} />
                                            <div><p className="text-sm text-gray-700 leading-snug">{n.text}</p><p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p></div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="relative">
                        <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false) }} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-purple-50 transition-all duration-300">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{(user.name || 'A')[0].toUpperCase()}</div>
                            <span className="text-sm font-medium text-gray-600">{user.name || 'Admin'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {showProfile && (
                                <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-purple-50 p-2 z-50">
                                    <div className="px-3 py-2 mb-1"><p className="text-sm font-semibold text-gray-700">{user.name || 'Admin'}</p><p className="text-[11px] text-gray-400">admin@peacecode.in</p></div>
                                    <div className="h-px bg-gray-100 my-1" />
                                    <button onClick={logout} className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"><LogOut className="w-3.5 h-3.5" /> Sign Out</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>
            <div className="flex h-[calc(100vh-4rem)]">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
                    <SidebarBody className="justify-between gap-2 shadow-[4px_0_30px_rgba(139,138,255,0.04)]">
                        <AdminSidebarContent />
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
            {(showProfile || showNotifications) && <div className="fixed inset-0 z-40" onClick={() => { setShowProfile(false); setShowNotifications(false) }} />}
        </div>
    )
}
