import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge, Card } from '@exercise/UiPieces'
describe('Badge ve Card', () => {
  it('kart içeriği ve puan etiketini birlikte gösterir', () => {
    render(
      <Card>
        <h2>Dövüş Kulübü</h2>
        <Badge>8.4</Badge>
      </Card>,
    )
    expect(screen.getByRole('article')).toContainElement(screen.getByText('8.4'))
  })
  it('badge ve card temel class’larını taşır', () => {
    render(
      <Card>
        <Badge>8.4</Badge>
      </Card>,
    )
    expect(screen.getByRole('article')).toHaveClass('rounded-xl', 'border', 'p-4')
    expect(screen.getByText('8.4')).toHaveClass('rounded-full', 'bg-sky-100', 'px-2')
  })
  it('className override’ı çakışan padding’i değiştirir', () => {
    render(
      <Card className="p-8">
        <Badge className="px-4">8.4</Badge>
      </Card>,
    )
    expect(screen.getByRole('article')).toHaveClass('p-8')
    expect(screen.getByRole('article')).not.toHaveClass('p-4')
    expect(screen.getByText('8.4')).toHaveClass('px-4')
  })
  it('data niteliği doğal öğeye ulaşır', () => {
    render(
      <Card data-state="ready">
        <Badge data-tone="score">8.4</Badge>
      </Card>,
    )
    expect(screen.getByRole('article')).toHaveAttribute('data-state', 'ready')
    expect(screen.getByText('8.4')).toHaveAttribute('data-tone', 'score')
  })
})
