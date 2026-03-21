'use client'

import { cn } from '@/app/lib/utils'
import React, { useState, createContext, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface SidebarContextProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    animate: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
    const context = useContext(SidebarContext)
    if (!context) throw new Error('useSidebar must be used within a SidebarProvider')
    return context
}

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}: {
    children: React.ReactNode
    open?: boolean
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    animate?: boolean
}) => {
    const [openState, setOpenState] = useState(false)
    const open = openProp !== undefined ? openProp : openState
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate,
}: {
    children: React.ReactNode
    open?: boolean
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    animate?: boolean
}) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    )
}

export const SidebarBody = (props: {
    className?: string
    children: React.ReactNode
} & Omit<React.ComponentProps<typeof motion.div>, 'children'>) => {
    return (
        <>{/* @ts-ignore */}
            <DesktopSidebar {...props} />
            <MobileSidebar {...(props as any)} />
        </>
    )
}

export const DesktopSidebar = ({
    className,
    children,
    ...props
}: {
    className?: string
    children: React.ReactNode
} & Omit<React.ComponentProps<typeof motion.div>, 'children'>) => {
    const { open, setOpen, animate } = useSidebar()
    return (
        <motion.div
            className={cn(
                'h-full py-6 hidden md:flex md:flex-col bg-[#0F0F12] border-r border-white/[0.05] flex-shrink-0 overflow-hidden relative',
                className
            )}
            animate={{
                width: animate ? (open ? '280px' : '80px') : '280px',
            }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            {...props}
        >
            {/* Subtle Glows */}
            <div className="absolute top-0 -left-10 w-40 h-40 bg-purple-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 -right-10 w-40 h-40 bg-indigo-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full px-4">
                {children}
            </div>
        </motion.div>
    )
}

export const MobileSidebar = ({
    className,
    children,
}: React.ComponentProps<'div'>) => {
    const { open } = useSidebar()
    return (
        <div className="md:hidden">
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-100%', opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className={cn(
                            'fixed h-full w-[280px] inset-0 bg-[#0F0F12] shadow-2xl z-[100] flex flex-col border-r border-white/[0.05]',
                            className
                        )}
                    >
                        <div className="flex flex-col h-full p-6">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export interface SidebarLinkItem {
    label: string
    id: string
    icon: React.JSX.Element | React.ReactNode
}

export const SidebarLink = ({
    link,
    active,
    className,
    onClick,
}: {
    link: SidebarLinkItem
    active?: boolean
    className?: string
    onClick?: () => void
}) => {
    const { open, animate } = useSidebar()
    return (
        <button
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 group/sidebar py-3 rounded-2xl transition-all duration-300 w-full text-left relative overflow-hidden',
                open ? 'justify-start px-4' : 'justify-center px-0',
                active
                    ? 'bg-white/[0.03] text-white shadow-[0_0_20px_rgba(255,255,255,0.02)] border border-white/[0.05]'
                    : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-200',
                className
            )}
        >
            {active && (
                <motion.div
                    layoutId="sidebarActiveIndicatorBg"
                    className="absolute left-0 w-1 h-6 bg-gradient-to-v from-purple-500 to-indigo-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}

            <span className={cn(
                "flex-shrink-0 transition-all duration-300",
                active ? "scale-110 text-white" : "group-hover/sidebar:scale-110"
            )}>
                {link.icon}
            </span>

            <motion.span
                animate={{
                    display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
                    opacity: animate ? (open ? 1 : 0) : 1,
                    x: open ? 0 : -10
                }}
                className={cn(
                    'text-sm font-medium whitespace-pre inline-block !p-0 !m-0 transition-colors duration-300',
                    active ? 'text-white' : 'text-gray-400 group-hover/sidebar:text-gray-200'
                )}
            >
                {link.label}
            </motion.span>

            {active && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                />
            )}
        </button>
    )
}
