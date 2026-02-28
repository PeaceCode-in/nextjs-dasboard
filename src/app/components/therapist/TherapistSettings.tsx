'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    User, Mail, Phone, Building, Shield, Bell, Save,
    ChevronRight, Lock,
} from 'lucide-react'

/* ─── ANIMATION ─── */

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

/* ─── MAIN COMPONENT ─── */

interface Props {
    userName?: string
}

export default function TherapistSettings({ userName }: Props) {
    const [name, setName] = useState(userName || 'Dr. Therapist')
    const [email, setEmail] = useState('therapist@peacecode.in')
    const [phone, setPhone] = useState('+91 98765 43210')
    const [institution, setInstitution] = useState('IIT Delhi')
    const speciality = 'CBT & Anxiety Disorders'
    const license = 'RCI/CLN/2025/0142'

    const [notifications, setNotifications] = useState({
        newBookings: true,
        cancellations: true,
        reminders: true,
        urgentAlerts: true,
        weeklyDigest: false,
    })

    const toggleNotif = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const [saved, setSaved] = useState(false)
    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="w-full mx-auto space-y-6 max-w-3xl">
            {/* Header */}
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-gray-800">
                    Profile & <span className="text-teal-600">Settings</span> ⚙️
                </h1>
                <p className="text-gray-500 text-sm mt-1">Manage your professional profile and notification preferences.</p>
            </motion.div>

            {/* ── Profile Card ── */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-200/50">
                            {name[0]?.toUpperCase() || 'T'}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{name}</h2>
                            <p className="text-xs text-gray-400">{speciality}</p>
                            <p className="text-[10px] text-teal-500 font-semibold mt-0.5">License: {license}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-teal-100/60 focus:border-teal-300 outline-none transition-all text-sm text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-teal-100/60 focus:border-teal-300 outline-none transition-all text-sm text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-teal-100/60 focus:border-teal-300 outline-none transition-all text-sm text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Institution */}
                        <div>
                            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Affiliated Institution</label>
                            <div className="relative">
                                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-teal-100/60 focus:border-teal-300 outline-none transition-all text-sm text-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Notification Preferences ── */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Bell className="w-4 h-4 text-teal-500" />
                        <h3 className="text-sm font-semibold text-gray-600">Notification Preferences</h3>
                    </div>

                    <div className="space-y-1">
                        {([
                            { key: 'newBookings' as const, label: 'New Booking Alerts', desc: 'Get notified when a student books a slot' },
                            { key: 'cancellations' as const, label: 'Cancellation Alerts', desc: 'Know immediately when a session is cancelled' },
                            { key: 'reminders' as const, label: 'Session Reminders', desc: '15 min before each session' },
                            { key: 'urgentAlerts' as const, label: 'Urgent Student Alerts', desc: 'Critical flags from students in your caseload' },
                            { key: 'weeklyDigest' as const, label: 'Weekly Summary Digest', desc: 'Caseload summary delivered every Monday' },
                        ]).map((item) => (
                            <button
                                key={item.key}
                                onClick={() => toggleNotif(item.key)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/60 transition-all duration-200 text-left"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                                <div className={`w-10 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 ${notifications[item.key] ? 'bg-teal-500' : 'bg-gray-200'
                                    }`}>
                                    <motion.div
                                        animate={{ x: notifications[item.key] ? 16 : 0 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className="w-5 h-5 rounded-full bg-white shadow-sm"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── Security & Privacy ── */}
            <motion.div variants={fadeUp}>
                <div className="rounded-3xl glass-card shadow-lg shadow-purple-50/30 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-4 h-4 text-teal-500" />
                        <h3 className="text-sm font-semibold text-gray-600">Security & Privacy</h3>
                    </div>

                    <div className="space-y-1">
                        {[
                            { label: 'Change Password', desc: 'Last changed 30 days ago', icon: Lock },
                            { label: 'Two-Factor Authentication', desc: 'Enabled via authenticator app', icon: Shield },
                        ].map((item) => {
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.label}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/60 transition-all duration-200 text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                            <p className="text-xs text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </button>
                            )
                        })}
                    </div>
                </div>
            </motion.div>

            {/* Save Button */}
            <motion.div variants={fadeUp} className="pb-8">
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-teal-200/50 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {saved ? (
                        <>✓ Saved!</>
                    ) : (
                        <><Save className="w-4 h-4" /> Save Changes</>
                    )}
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
