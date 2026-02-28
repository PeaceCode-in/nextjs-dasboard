import { redirect } from 'next/navigation'

// Signup is part of the login page (toggle between login/signup)
export default function SignupPage() {
    redirect('/login')
}
