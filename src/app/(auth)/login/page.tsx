'use client'

import SignInPage from '@/app/components/SignInPage'
import { useAuth } from '@/app/lib/AuthContext'

export default function LoginPage() {
    const { login } = useAuth()
    return <SignInPage onSignIn={login} />
}
