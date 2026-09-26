import { z } from 'zod'
import { env } from '@/shared/config/env'
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export type TmdbParams = Record<string, string | number | undefined>

export class ApiError extends Error {
  readonly status: number
  readonly statusCode: number | null

  constructor(status: number, statusCode: number | null, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusCode = statusCode
  }
}

function buildUrl(path: string, params: TmdbParams): string {
  const url = new URL(`${TMDB_BASE_URL}/${path.replace(/^\/+/, '')}`)
  url.searchParams.set('language', 'tr-TR')
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url.toString()
}

async function request<S extends z.ZodType>(
  path: string,
  schema: S,
  params: TmdbParams,
  init?: RequestInit,
): Promise<z.output<S>> {
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      Authorization: `Bearer ${env.tmdbToken}`,
      ...init?.headers,
    },
  })
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const details =
      body && typeof body === 'object'
        ? (body as Record<string, unknown>)
        : null
    const statusCode =
      typeof details?.status_code === 'number' ? details.status_code : null
    const message =
      typeof details?.status_message === 'string'
        ? details.status_message
        : `TMDB isteği başarısız (HTTP ${response.status})`
    throw new ApiError(response.status, statusCode, message)
  }
  const body: unknown = await response.json()
  const result = schema.safeParse(body)
  if (!result.success)
    throw new Error(`TMDB verisi geçersiz: ${z.prettifyError(result.error)}`)
  return result.data
}

export const tmdbClient = {
  get<S extends z.ZodType>(
    path: string,
    schema: S,
    params: TmdbParams = {},
  ): Promise<z.output<S>> {
    return request(path, schema, params)
  },
  post<S extends z.ZodType>(
    path: string,
    body: unknown,
    schema: S,
    params: TmdbParams = {},
  ): Promise<z.output<S>> {
    return request(path, schema, params, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  },
  delete<S extends z.ZodType>(
    path: string,
    schema: S,
    params: TmdbParams = {},
  ): Promise<z.output<S>> {
    return request(path, schema, params, { method: 'DELETE' })
  },
}
