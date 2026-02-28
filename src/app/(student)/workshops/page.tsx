'use client'
import { useRouter } from 'next/navigation'
import Workshops from '@/app/components/student/Workshops'

export default function Page() {
  const router = useRouter()
  return <Workshops onNavigate={(id: string) => router.push('/' + id)} />
}
