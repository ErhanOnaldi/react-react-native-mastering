export interface Profile {
  id: number
  username: string
}
export async function getProfile(accessToken: string): Promise<Profile> {
  const response = await fetch('https://dummyjson.com/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error(`Profil isteği başarısız: ${response.status}`)
  const profile = (await response.json()) as Profile
  return { id: profile.id, username: profile.username }
}
