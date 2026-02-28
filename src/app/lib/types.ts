export interface UserInfo {
    name: string
    role: 'student' | 'admin' | 'therapist'
    college?: string
    email?: string
    speciality?: string
    university?: string
    year?: string
    branch?: string
    phoneNumber?: string
}
