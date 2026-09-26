import { z } from 'zod'
import type { Credentials } from './authSlice'

export const AUTH_STORAGE_KEY = 'sinema-auth'

const credentialsSchema = z.object({
  user: z.object({ id: z.number(), username: z.string() }),
  accessToken: z.string(),
  refreshToken: z.string(),
})

export function readCredentials(): Credentials | null {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!saved) return null
    const result = credentialsSchema.safeParse(JSON.parse(saved))
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function saveCredentials(credentials: Credentials) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(credentials))
  } catch {
    // Private browsing may disable storage; the current session still works.
  }
}
