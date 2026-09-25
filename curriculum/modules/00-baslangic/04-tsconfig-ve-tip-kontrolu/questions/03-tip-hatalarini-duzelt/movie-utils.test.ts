import { describe, expect, it } from 'vitest'
import { isHighlyRated, releaseYear, titleById } from '@exercise/movie-utils'

const fightClub = { id: 550, title: 'Dövüş Kulübü', release_date: '1999-10-15', vote_average: 8.4 }
const upcoming = { id: 1, title: 'Gizemli Film', release_date: '', vote_average: 0 }

describe('movie-utils', () => {
  it('yılı tarihten ayıklar', () => {
    expect(releaseYear(fightClub)).toBe('1999')
  })

  it('boş tarihte boş string döner', () => {
    expect(releaseYear(upcoming)).toBe('')
  })

  it('7.5 ve üstünü "çok iyi" sayar', () => {
    expect(isHighlyRated(7.5)).toBe(true)
    expect(isHighlyRated(7.4)).toBe(false)
  })

  it('id ile film adını bulur', () => {
    expect(titleById([fightClub, upcoming], 550)).toBe('Dövüş Kulübü')
    expect(titleById([fightClub, upcoming], 1)).toBe('Gizemli Film')
  })
})
