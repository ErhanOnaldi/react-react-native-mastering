import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/features/auth/authClient'

interface Profile {
  id: number
  username: string
  firstName?: string
  lastName?: string
  email?: string
}

export function ProfilePage() {
  const profile = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authClient.get<Profile>('/auth/me'),
  })
  if (profile.isPending) return <p role="status">Profil yükleniyor…</p>
  if (profile.isError)
    return <p role="alert">Profil yüklenemedi: {profile.error.message}</p>
  return (
    <section>
      <h2 className="text-2xl font-semibold">Profil</h2>
      <p>
        {profile.data.firstName} {profile.data.lastName} (@
        {profile.data.username})
      </p>
      {profile.data.email && <p>{profile.data.email}</p>}
    </section>
  )
}
