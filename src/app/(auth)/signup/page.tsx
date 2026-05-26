'use client'

import SignInPage from '@/app/components/SignInPage'
import { useAuth } from '@/app/lib/AuthContext'

export default function SignupPage() {
    const { login } = useAuth()
    return <SignInPage initialMode="signup" onSignIn={login} />
}
