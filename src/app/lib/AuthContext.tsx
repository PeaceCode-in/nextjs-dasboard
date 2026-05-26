'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { UserInfo } from './types'

interface AuthContextValue {
    user: UserInfo | null
    isLoading: boolean
    login: (user: UserInfo) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'peacecode_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed: UserInfo = JSON.parse(stored)
                setUser(parsed)
            }
        } catch {
            // invalid storage
        } finally {
            setIsLoading(false)
        }
    }, [])

    const login = useCallback((userInfo: UserInfo) => {
        setUser(userInfo)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo))
        // Write a cookie for middleware to read
        document.cookie = `peacecode_role=${userInfo.role}; path=/; max-age=86400; SameSite=Lax`
        document.cookie = `peacecode_auth=1; path=/; max-age=86400; SameSite=Lax`
        
        if (userInfo.role === 'admin') router.push('/admin/dashboard')
        else if (userInfo.role === 'therapist') router.push('/dashboard') // Therapist might share /dashboard or use their own root
        else router.push('/dashboard')
    }, [router])

    const logout = useCallback(() => {
        setUser(null)
        localStorage.removeItem(STORAGE_KEY)
        document.cookie = 'peacecode_auth=; path=/; max-age=0'
        document.cookie = 'peacecode_role=; path=/; max-age=0'
        const landingPageUrl = process.env.NODE_ENV === 'production' ? 'https://peacecode.in' : 'http://localhost:3000'
        window.location.href = landingPageUrl
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
