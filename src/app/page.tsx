import { redirect } from 'next/navigation'

// Root page handled entirely by middleware
// This file is a fallback – middleware redirects / to /login or /dashboard
export default function RootPage() {
  redirect('/login')
}
