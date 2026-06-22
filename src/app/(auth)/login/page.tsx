'use client'

import SignInPage, { UserInfo } from '@/app/components/SignInPage'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    
    // In a real app, you would log the user in here.
    const handleComplete = (user: UserInfo) => {
        if (user.role === 'admin') {
            router.push('/admin/dashboard')
        } else if (user.role === 'therapist') {
            router.push('/therapist/dashboard')
        } else {
            router.push('/student/dashboard')
        }
    }

    return <SignInPage onSignIn={handleComplete} initialMode="login" />
}
