import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieResult } from '@exercise/MovieResult'

describe('MovieResult', () => {
  it('yüklenirken film yerine yükleme metni gösterir', () => {
    render(<MovieResult state={{ status: 'loading' }} />)
    expect(screen.getByText('Filmler yükleniyor')).toBeInTheDocument()
  })
  it('hata mesajını kullanıcıya gösterir', () => {
    render(<MovieResult state={{ status: 'error', message: 'TMDB kapalı' }} />)
    expect(screen.getByText('Hata: TMDB kapalı')).toBeInTheDocument()
  })
  it('başarılı ama boş cevapta boş durum gösterir', () => {
    render(<MovieResult state={{ status: 'success', movies: [] }} />)
    expect(screen.getByText('Film bulunamadı')).toBeInTheDocument()
  })
  it('başarılı cevapta başlıkları liste öğelerinde gösterir', () => {
    render(
      <MovieResult
        state={{
          status: 'success',
          movies: [
            { id: 550, title: 'Dövüş Kulübü' },
            { id: 603, title: 'Matrix' },
          ],
        }}
      />,
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Matrix')).toBeInTheDocument()
  })
})
