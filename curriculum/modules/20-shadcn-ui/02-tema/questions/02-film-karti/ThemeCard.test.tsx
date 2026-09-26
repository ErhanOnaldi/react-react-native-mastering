import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeCard } from '@exercise/ThemeCard'

describe('ThemeCard', () => {
  it('film başlığını kart başlığı olarak gösterir', () => {
    render(<ThemeCard title="Dövüş Kulübü" />)
    expect(screen.getByRole('article')).toContainElement(screen.getByRole('heading', { level: 2, name: 'Dövüş Kulübü' }))
  })

  it('kart yüzeyini anlamsal renk çiftiyle boyar', () => {
    render(<ThemeCard title="Başlangıç" />)
    expect(screen.getByRole('article')).toHaveClass('bg-card', 'text-card-foreground')
  })

  it('dışarıdan gelen köşe sınıfı varsayılanı geçersiz kılar', () => {
    render(<ThemeCard title="Matrix" className="rounded-none" />)
    expect(screen.getByRole('article')).toHaveClass('rounded-none')
    expect(screen.getByRole('article')).not.toHaveClass('rounded-lg')
  })
})
