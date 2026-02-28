'use client'
import { useAuth } from '@/app/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardComponent from '@/app/components/student/Dashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  return <DashboardComponent onNavigate={(id) => router.push('/' + id)} userName={user?.name || ''} />
}