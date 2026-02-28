'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileDown, UserCog, Phone, Wrench, Shield, Bell, Moon,
    ChevronRight, Check, Save,
} from 'lucide-react'

/* ─── ANIMATION ─── */

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

/* ─── TOGGLE COMPONENT ─── */

function Toggle({ enabled, onChange, label, description, icon: Icon }: {
    enabled: boolean
    onChange: () => void
    label: string
    description: string
    icon: React.ElementType
}) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${enabled ? 'bg-purple-500' : 'bg-gray-200'}`}
            >
                <motion.div
                    animate={{ x: enabled ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                />
            </button>
        </div>
    )
}

/* ─── MAIN COMPONENT ─── */

export default function AdminSettings() {
    const [exportReport, setExportReport] = useState(true)
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [emailNotifs, setEmailNotifs] = useState(true)
    const [darkMode, setDarkMode] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showCounselorModal, setShowCounselorModal] = useState(false)

    const hotlines = [
        { name: 'iCall (TISS)', number: '+91 9152987821', active: true },
        { name: 'Vandrevala Foundation', number: '+91 9999666555', active: true },
        { name: 'NIMHANS Helpline', number: '080-46110007', active: true },
        { name: 'Campus Internal', number: '+91 9876543210', active: false },
    ]

    const [hotlineData, setHotlineData] = useState(hotlines)

    const counselors = [
        { name: 'Dr. Priya Sharma', speciality: 'CBT & Anxiety', status: 'Active', slots: 20 },
        { name: 'Dr. Rajesh Kumar', speciality: 'Depression & Trauma', status: 'Active', slots: 18 },
        { name: 'Ms. Anita Das', speciality: 'Career Counseling', status: 'On Leave', slots: 0 },
        { name: 'Dr. Sanjay Gupta', speciality: 'Substance Abuse', status: 'Active', slots: 22 },
    ]

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const toggleHotline = (index: number) => {
        setHotlineData(prev => prev.map((h, i) => i === index ? { ...h, active: !h.active } : h))
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-4 max-w-4xl">
            {/* Header */}
            <motion.div variants={fadeUp} className="mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Admin{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Settings
                    </span>{' '}
                    ⚙️
                </h1>
                <p className="text-gray-500 text-sm mt-1">Configure platform behavior and administrative preferences</p>
            </motion.div>

            {/* General Toggles */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <p className="text-sm font-semibold text-gray-500 mb-3">General Settings</p>
                    <div className="divide-y divide-gray-100">
                        <Toggle
                            enabled={exportReport}
                            onChange={() => setExportReport(!exportReport)}
                            label="Export Monthly Report"
                            description="Automatically generate and email PDF reports on the 1st of each month"
                            icon={FileDown}
                        />
                        <Toggle
                            enabled={emailNotifs}
                            onChange={() => setEmailNotifs(!emailNotifs)}
                            label="Email Notifications"
                            description="Receive critical alerts and weekly digests via email"
                            icon={Bell}
                        />
                        <Toggle
                            enabled={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                            label="Dark Mode (Beta)"
                            description="Switch to dark theme for the admin dashboard"
                            icon={Moon}
                        />
                        <Toggle
                            enabled={maintenanceMode}
                            onChange={() => setMaintenanceMode(!maintenanceMode)}
                            label="Platform Maintenance Mode"
                            description="Temporarily disable student access for system updates"
                            icon={Wrench}
                        />
                    </div>
                    {maintenanceMode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100"
                        >
                            <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
                                ⚠️ Maintenance mode is ON. Students will see a maintenance page.
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Counselor Roster */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <UserCog className="w-4 h-4 text-purple-500" />
                            <p className="text-sm font-semibold text-gray-500">Manage Counselor Roster</p>
                        </div>
                        <button
                            onClick={() => setShowCounselorModal(!showCounselorModal)}
                            className="text-xs text-purple-600 font-semibold hover:text-purple-800 transition-colors flex items-center gap-0.5"
                        >
                            {showCounselorModal ? 'Collapse' : 'View All'} <ChevronRight className={`w-3 h-3 transition-transform ${showCounselorModal ? 'rotate-90' : ''}`} />
                        </button>
                    </div>

                    <AnimatePresence>
                        {showCounselorModal && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2">
                                    {counselors.map((c) => (
                                        <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60 hover:bg-purple-50/40 transition-colors">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {c.name.split(' ').map(w => w[0]).join('')}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-700">{c.name}</p>
                                                <p className="text-[10px] text-gray-400">{c.speciality}</p>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                                                {c.status}
                                            </span>
                                            <span className="text-xs text-gray-400">{c.slots} slots/week</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!showCounselorModal && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{counselors.filter(c => c.status === 'Active').length} active counselors</span>
                            <span>·</span>
                            <span>{counselors.reduce((sum, c) => sum + c.slots, 0)} total weekly slots</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Emergency Hotlines */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <Phone className="w-4 h-4 text-red-500" />
                        <p className="text-sm font-semibold text-gray-500">Campus Emergency Hotlines</p>
                    </div>
                    <div className="space-y-2">
                        {hotlineData.map((h, i) => (
                            <div key={h.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50/40 transition-colors">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${h.active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700">{h.name}</p>
                                    <p className="text-xs text-gray-400">{h.number}</p>
                                </div>
                                <button
                                    onClick={() => toggleHotline(i)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${h.active ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {h.active ? 'Active' : 'Disabled'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Security */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <p className="text-sm font-semibold text-gray-500">Security & Privacy</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { label: 'Data Encryption', value: 'AES-256', status: 'Active' },
                            { label: 'HIPAA Compliance', value: 'Verified', status: 'Active' },
                            { label: 'Anonymization', value: 'SHA-256 Hashing', status: 'Active' },
                            { label: 'Last Audit', value: 'Feb 15, 2026', status: 'Passed' },
                        ].map((item) => (
                            <div key={item.label} className="p-3 rounded-xl bg-gray-50/60">
                                <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm font-semibold text-gray-700">{item.value}</p>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-500 font-semibold">{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Save Button */}
            <motion.div variants={fadeUp} className="pb-8">
                <button
                    onClick={handleSave}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/60 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {saved ? (
                        <>
                            <Check className="w-5 h-5" /> Settings Saved!
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" /> Save All Changes
                        </>
                    )}
                </button>
            </motion.div>
        </motion.div>
    )
}
