'use client'

import SignInPage from '@/app/components/SignInPage'
import { useAuth } from '@/app/lib/AuthContext'

export default function SignupPage() {
    const { login } = useAuth()
    
    return <SignInPage onSignIn={login} initialMode="signup" />
}
