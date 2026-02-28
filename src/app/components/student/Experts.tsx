'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Star, Clock, Filter, ChevronDown, Video, Presentation, Stethoscope, ChevronRight, PlayCircle, Calendar, Info, Check, X, ChevronLeft } from 'lucide-react'

/* ─── MOCK DATA ─── */
interface Expert {
    id: string
    name: string
    degree: string
    title: string
    specializations: string[]
    languages: string[]
    rating: number
    reviews: number
    experience: string
    nextSlot: string
    price: string
    gradient: string
    initials: string
    quote: string
}

const allExperts: Expert[] = [
    {
        id: 'e1', name: 'Dr. Ananya Iyer', degree: 'Ph.D. Clinical Psychology',
        title: 'Clinical Psychologist', specializations: ['Placement Anxiety', 'Perfectionism'],
        languages: ['Tamil', 'English'], rating: 4.9, reviews: 127, experience: '8 yrs',
        nextSlot: 'Today, 4:30 PM', price: '₹800/session', gradient: 'from-purple-100 to-indigo-100 text-indigo-700', initials: 'AI',
        quote: "True resilience isn't about never breaking; it's about knowing how to heal."
    },
    {
        id: 'e2', name: 'Dr. Kabir Mehta', degree: 'M.Phil Clinical Psychology',
        title: 'Behavioral Therapist', specializations: ['Academic Burnout'],
        languages: ['Hindi', 'English'], rating: 4.8, reviews: 89, experience: '6 yrs',
        nextSlot: 'Tomorrow, 11:00 AM', price: '₹700/session', gradient: 'from-orange-100 to-amber-100 text-amber-700', initials: 'KM',
        quote: "Burnout is your body's way of saying it needs a new rhythm."
    },
    {
        id: 'e3', name: 'Dr. Priya Nair', degree: 'M.Phil Psychiatric Social Work',
        title: 'Counseling Psychologist', specializations: ['Family Expectations', 'Relationship Counseling'],
        languages: ['Malayalam', 'English'], rating: 4.7, reviews: 63, experience: '5 yrs',
        nextSlot: 'Today, 6:00 PM', price: '₹650/session', gradient: 'from-emerald-100 to-teal-100 text-teal-700', initials: 'PN',
        quote: "Setting boundaries is the highest form of self-respect."
    },
    {
        id: 'e4', name: 'Dr. Arjun Reddy', degree: 'Ph.D. Counseling',
        title: 'Senior Psychologist', specializations: ['Placement Anxiety'],
        languages: ['Telugu', 'English'], rating: 4.9, reviews: 204, experience: '12 yrs',
        nextSlot: 'Feb 21, 10:00 AM', price: '₹1200/session', gradient: 'from-rose-100 to-pink-100 text-pink-700', initials: 'AR',
        quote: "Your career is a marathon, not a sprint. Let's pace it."
    },
    {
        id: 'e5', name: 'Dr. Simran Kaur', degree: 'M.A. Applied Psychology',
        title: 'Wellness Expert', specializations: ['Academic Burnout', 'Relationship Counseling'],
        languages: ['Punjabi', 'Hindi'], rating: 4.6, reviews: 51, experience: '4 yrs',
        nextSlot: 'Today, 8:00 PM', price: '₹500/session', gradient: 'from-blue-100 to-cyan-100 text-cyan-700', initials: 'SK',
        quote: "Small everyday shifts create monumental life changes."
    },
]

const filterTags = ['All', 'Placement Anxiety', 'Academic Burnout', 'Family Expectations', 'Relationship Counseling']

/* ─── ANIMATIONS ─── */
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } }

/* ─── HELPERS ─── */
function getWeekDays(offset: number) {
    const start = new Date()
    start.setDate(start.getDate() + offset * 7)
    start.setDate(start.getDate() - start.getDay() + 1)
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start)
        d.setDate(d.getDate() + i)
        return d
    })
}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const timeSlots = ['9:00 AM', '10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM', '5:30 PM', '7:00 PM']

export default function Experts() {
    const [activeFilter, setActiveFilter] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [bookingExpert, setBookingExpert] = useState<Expert | null>(null)
    const [weekOffset, setWeekOffset] = useState(0)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [booked, setBooked] = useState(false)

    // Layout determining index for asymmetrical grid
    const filtered = allExperts.filter((e) => {
        const matchesFilter = activeFilter === 'All' || e.specializations.includes(activeFilter)
        const matchesSearch = searchQuery === '' || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesFilter && matchesSearch
    })

    const weekDays = getWeekDays(weekOffset)
    const today = new Date()

    const handleBook = () => {
        if (selectedDate && selectedSlot) {
            setBooked(true)
            setTimeout(() => {
                setBooked(false)
                setBookingExpert(null)
                setSelectedDate(null)
                setSelectedSlot(null)
                setWeekOffset(0)
            }, 2500)
        }
    }

    return (
        <div className="relative w-full min-h-screen font-sans pb-24 overflow-hidden">
            {/* Soft Ethereal Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' as const }} className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-100 rounded-full blur-[140px] opacity-60" />
                <motion.div animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, -20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 }} className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] bg-purple-100 rounded-full blur-[140px] opacity-60" />
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-6xl mx-auto space-y-12 px-4 md:px-8 pt-8">

                {/* ── Header & Search ── */}
                <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-light text-slate-800 tracking-tight mb-3">
                            Find Your Guide
                        </h1>
                        <p className="text-slate-500 font-light max-w-md">
                            Browse verified professionals who truly understand the immense pressures of modern academic life.
                        </p>
                    </div>
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, issue..."
                            className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 focus:border-purple-300 focus:bg-white focus:shadow-[0_8px_30px_rgba(167,139,250,0.15)] outline-none text-sm text-slate-700 transition-all duration-300 placeholder:text-slate-400 font-light"
                        />
                    </div>
                </motion.div>

                {/* ── Sticky Segmented Filter Bar ── */}
                <motion.div variants={fadeUp} className="sticky top-20 z-30 flex items-center gap-2 p-1.5 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-x-auto scrollbar-hide">
                    {filterTags.map((tag) => {
                        const isActive = activeFilter === tag;
                        return (
                            <button
                                key={tag}
                                onClick={() => setActiveFilter(tag)}
                                className={`relative shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${isActive ? 'text-purple-700' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeFilter"
                                        className="absolute inset-0 bg-white shadow-sm border border-purple-50 rounded-full"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{tag}</span>
                            </button>
                        )
                    })}
                </motion.div>

                {/* ── Asymmetrical Bento Grid ── */}
                <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-12 gap-6 auto-rows-[minmax(280px,auto)]">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((expert, idx) => {
                            // Asymmetrical logic: Make some cards span more columns/rows based on index
                            const isLarge = idx % 5 === 0;
                            const isMedium = idx % 5 === 3;

                            const colSpan = isLarge ? 'md:col-span-4 xl:col-span-8' : isMedium ? 'md:col-span-3 xl:col-span-6' : 'md:col-span-3 xl:col-span-4';
                            const rowSpan = isLarge ? 'md:row-span-2' : 'md:row-span-1';

                            return (
                                <motion.div
                                    key={expert.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                    whileHover="hover"
                                    transition={{ duration: 0.4, ease: 'easeOut' as const }}
                                    className={`relative rounded-[2rem] bg-white/50 backdrop-blur-lg border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 flex flex-col overflow-hidden group ${colSpan} ${rowSpan}`}
                                >
                                    {/* Elevated hover shadow & background shift */}
                                    <motion.div
                                        variants={{ hover: { opacity: 1, scale: 1.02 } }}
                                        initial={{ opacity: 0, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0 bg-gradient-to-br from-white via-white to-purple-50/30 z-0 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(167,139,250,0.4)]"
                                    />

                                    <div className="relative z-10 flex flex-col h-full">

                                        {/* Top Row: Avatar + Rating */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${expert.gradient} flex items-center justify-center text-xl font-medium shadow-inner`}>
                                                {expert.initials}
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-slate-100 shadow-sm">
                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                    <span className="text-xs font-semibold text-slate-700">{expert.rating}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400">{expert.reviews} reviews</span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <h3 className="text-xl font-medium text-slate-800 tracking-tight mb-1">{expert.name}</h3>
                                            <p className="text-sm text-purple-600 font-medium mb-1">{expert.title}</p>
                                            <p className="text-xs text-slate-400 font-light italic mb-4">{expert.degree}</p>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {expert.specializations.map((s) => (
                                                    <span key={s} className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-medium text-slate-500 shadow-sm">{s}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Hidden/Reveal Quote & Video Intro on Hover */}
                                        <motion.div
                                            variants={{ hidden: { height: 0, opacity: 0 }, hover: { height: 'auto', opacity: 1 } }}
                                            initial="hidden"
                                            className="overflow-hidden mb-6"
                                        >
                                            <div className="pt-4 border-t border-purple-100/30">
                                                <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-2xl border border-purple-100/50 cursor-pointer hover:bg-purple-100/50 transition-colors">
                                                    <PlayCircle className="w-8 h-8 text-purple-400 shrink-0" strokeWidth={1.5} />
                                                    <div>
                                                        <p className="text-xs font-semibold text-purple-900">Watch Intro</p>
                                                        <p className="text-[10px] text-purple-600 line-clamp-1 italic">"{expert.quote}"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Bottom Row: Next Slot & Booking */}
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100/50 group-hover:border-transparent transition-colors">
                                            <div>
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Next Available</p>
                                                <p className="text-sm font-medium text-slate-700">{expert.nextSlot}</p>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => { setBookingExpert(expert); setSelectedDate(null); setSelectedSlot(null); setWeekOffset(0) }}
                                                className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-purple-600 transition-colors group/btn relative overflow-hidden"
                                            >
                                                <Calendar className="w-5 h-5 relative z-10" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                            </motion.button>
                                        </div>

                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && (
                    <motion.div variants={fadeUp} className="text-center py-24">
                        <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" strokeWidth={1} />
                        <h3 className="text-xl font-light text-slate-600 mb-2">No experts found</h3>
                        <p className="text-slate-400 font-light">Try adjusting your filters or search terms.</p>
                    </motion.div>
                )}
            </motion.div>

            {/* ===== BEAUTIFUL SLIDE-OUT SHEET (SHADCN STYLE) ===== */}
            <AnimatePresence>
                {bookingExpert && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                            onClick={() => !booked && setBookingExpert(null)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white/70 backdrop-blur-2xl shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] border-l border-white/60 z-50 flex flex-col p-6 md:p-10"
                        >
                            {booked ? (
                                /* Success State */
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center mb-6 shadow-inner">
                                        <Check className="w-10 h-10 text-emerald-500" strokeWidth={3} />
                                    </motion.div>
                                    <h3 className="text-3xl font-light text-slate-800 tracking-tight mb-2">Session Booked!</h3>
                                    <p className="text-slate-500 font-light text-lg mb-8 max-w-sm">
                                        Your session with {bookingExpert.name} has been securely scheduled.
                                    </p>
                                    <div className="p-6 rounded-2xl bg-white/80 border border-slate-100 shadow-sm w-full">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Time & Date</p>
                                        <p className="text-lg font-medium text-slate-800">{monthNames[selectedDate!.getMonth()]} {selectedDate!.getDate()} at {selectedSlot}</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Sheet Header */}
                                    <div className="flex items-center justify-between mb-10">
                                        <h2 className="text-2xl font-light text-slate-800 tracking-tight">Book a Session</h2>
                                        <button onClick={() => setBookingExpert(null)} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Expert Snippet */}
                                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm mb-10">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bookingExpert.gradient} flex items-center justify-center text-lg font-medium shadow-inner`}>
                                            {bookingExpert.initials}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-800">{bookingExpert.name}</h3>
                                            <p className="text-xs text-slate-500 font-light">{bookingExpert.price} · {bookingExpert.experience}</p>
                                        </div>
                                    </div>

                                    {/* Interactive Calendar Selection */}
                                    <div className="flex-1 overflow-y-auto no-scrollbar">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-sm font-semibold text-slate-700">Select Date</h3>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} disabled={weekOffset === 0} className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 flex items-center">
                                                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                                                </button>
                                                <span className="text-xs font-medium text-slate-500 w-24 text-center">
                                                    {monthNames[weekDays[0].getMonth()]}
                                                </span>
                                                <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-1.5 rounded-md hover:bg-slate-100 flex items-center">
                                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 gap-2 mb-10">
                                            {weekDays.map((day, i) => {
                                                const isToday = day.toDateString() === today.toDateString()
                                                const isPast = day < today && !isToday
                                                const isSelected = selectedDate?.toDateString() === day.toDateString()
                                                return (
                                                    <button
                                                        key={i}
                                                        disabled={isPast}
                                                        onClick={() => { setSelectedDate(day); setSelectedSlot(null) }}
                                                        className={`flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-slate-800 text-white shadow-lg' :
                                                            isPast ? 'opacity-30 cursor-not-allowed' :
                                                                'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                                                            }`}
                                                    >
                                                        <span className="text-[10px] font-medium mb-1">{dayNames[i]}</span>
                                                        <span className={`text-sm ${isSelected ? 'font-bold' : 'font-semibold'}`}>{day.getDate()}</span>
                                                        {isToday && !isSelected && <span className="w-1 h-1 rounded-full bg-purple-500 mt-1" />}
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <AnimatePresence>
                                            {selectedDate && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Available Time</h3>
                                                    <div className="grid grid-cols-2 gap-3 mb-8">
                                                        {timeSlots.map((slot) => {
                                                            const isSelected = selectedSlot === slot
                                                            return (
                                                                <button
                                                                    key={slot}
                                                                    onClick={() => setSelectedSlot(slot)}
                                                                    className={`py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${isSelected ? 'bg-purple-100 text-purple-700 border-2 border-purple-500' :
                                                                        'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
                                                                        }`}
                                                                >
                                                                    {slot}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="pt-6 mt-auto">
                                        <motion.button
                                            whileHover={selectedDate && selectedSlot ? { scale: 1.02 } : {}}
                                            whileTap={selectedDate && selectedSlot ? { scale: 0.98 } : {}}
                                            disabled={!selectedDate || !selectedSlot}
                                            onClick={handleBook}
                                            className={`w-full py-4 rounded-full text-base font-medium flex items-center justify-center gap-2 transition-all duration-300 ${selectedDate && selectedSlot
                                                ? 'bg-slate-800 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-slate-900 group'
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <Video className={`w-5 h-5 ${selectedDate && selectedSlot ? 'text-white' : ''}`} />
                                            {selectedDate && selectedSlot ? 'Confirm Booking' : 'Select Date & Time'}
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
