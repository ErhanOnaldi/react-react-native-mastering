// Monaco editörü için `@test-utils` tip tanımları (index.ts'in genel API'si).
// index.ts'e yeni bir export eklersen buraya da ekle.
import type { SetupServer } from 'msw/node'

export { delay, http, HttpResponse } from 'msw'

export declare const server: SetupServer
export declare const TMDB_BASE: string

export interface TmdbListMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  genre_ids: number[]
  popularity: number
  vote_average: number
  vote_count: number
  adult: boolean
  original_language: string
  video: boolean
}
export declare const catalog: TmdbListMovie[]

export interface LoggedRequest {
  method: string
  url: string
  path: string
  search: URLSearchParams
}
export declare function requests(filter?: string | RegExp): LoggedRequest[]
export declare function clearRequests(): void
