'use client'
import { useRouter } from 'next/navigation'
import AdminDashboard from '@/app/components/admin/AdminDashboard'

export default function AdminDashboardPage() {
  const router = useRouter()
  return <AdminDashboard onNavigate={(id: string) => router.push('/admin/' + id)} />
}
