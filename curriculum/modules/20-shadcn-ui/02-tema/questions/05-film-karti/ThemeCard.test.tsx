import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeCard } from '@exercise/ThemeCard'

describe('ThemeCard', () => {
  it('film başlığını kart başlığı olarak gösterir', () => {
    render(
      <ThemeCard
        title="Dövüş Kulübü"
        year={1999}
        rating={8.8}
        overview="Bir kulüpte başlayan hikâye."
      />,
    )
    expect(screen.getByRole('article')).toContainElement(
      screen.getByRole('heading', { level: 2, name: 'Dövüş Kulübü' }),
    )
    expect(screen.getByText('1999')).toBeInTheDocument()
    expect(screen.getByText('8.8')).toBeInTheDocument()
    expect(screen.getByText('Bir kulüpte başlayan hikâye.')).toBeInTheDocument()
  })

  it('kart yüzeyini anlamsal renk çiftiyle boyar', () => {
    render(<ThemeCard title="Başlangıç" year={1999} rating={8.8} overview="Kısa açıklama." />)
    expect(screen.getByRole('article')).toHaveClass(
      'bg-card',
      'text-card-foreground',
      'rounded-lg',
      'p-4',
    )
  })

  it('dışarıdan gelen köşe sınıfı varsayılanı geçersiz kılar', () => {
    render(
      <ThemeCard
        title="Matrix"
        year={1999}
        rating={8.7}
        overview="Gerçekliğin sırrı."
        className="rounded-none"
      />,
    )
    expect(screen.getByRole('article')).toHaveClass('rounded-none')
    expect(screen.getByRole('article')).not.toHaveClass('rounded-lg')
  })
})
