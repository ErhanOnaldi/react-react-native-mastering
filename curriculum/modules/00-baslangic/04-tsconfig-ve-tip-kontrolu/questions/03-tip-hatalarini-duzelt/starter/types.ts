export interface Movie {
  id: number
  title: string
  /** "1999-10-15" ya da henüz belli değilse "" */
  release_date: string
  vote_average: number
}
