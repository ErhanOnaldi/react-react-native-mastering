export interface Profile {
  id: number
  username: string
}
export async function getProfile(accessToken: string): Promise<Profile> {
  return { id: 0, username: '' }
}
