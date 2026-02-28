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

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
        </>
    )
}

export const DesktopSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof motion.div>) => {
    const { open, setOpen, animate } = useSidebar()
    return (
        <motion.div
            className={cn(
                'h-full py-4 hidden md:flex md:flex-col bg-white/80 backdrop-blur-xl border-r border-purple-100/40 flex-shrink-0 overflow-hidden',
                className
            )}
            animate={{
                width: animate ? (open ? '260px' : '64px') : '260px',
                paddingLeft: animate ? (open ? '16px' : '8px') : '16px',
                paddingRight: animate ? (open ? '16px' : '8px') : '16px',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            {...props}
        >
            {children}
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
                        transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                        className={cn(
                            'fixed h-full w-full inset-0 bg-white shadow-2xl z-[100] flex flex-col',
                            className
                        )}
                    >
                        {children}
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
                'flex items-center gap-2 group/sidebar py-2.5 rounded-xl transition-all duration-300 w-full text-left relative',
                open ? 'justify-start px-3' : 'justify-center px-0',
                active
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200/60'
                    : 'text-gray-600 hover:bg-purple-50/70 hover:text-purple-700',
                className
            )}
        >
            <span className="flex-shrink-0">{link.icon}</span>
            <motion.span
                animate={{
                    display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className={cn(
                    'text-sm font-medium whitespace-pre inline-block !p-0 !m-0 transition duration-150',
                    active ? 'text-white' : 'text-gray-700 group-hover/sidebar:translate-x-1'
                )}
            >
                {link.label}
            </motion.span>
            {active && (
                <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}
        </button>
    )
}
