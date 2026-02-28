'use client'
import { useAuth } from '@/app/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Profile from '@/app/components/student/Profile'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  if (!user) return null
  return <Profile userInfo={user} onNavigate={(id) => router.push('/' + id)} onBack={logout} />
}