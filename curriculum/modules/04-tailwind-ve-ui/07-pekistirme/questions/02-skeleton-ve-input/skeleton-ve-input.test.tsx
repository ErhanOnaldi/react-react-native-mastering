import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input, Skeleton } from '@exercise/LoadingFields'
describe('Skeleton ve Input', () => {
  it('skeleton görsel öğesini erişilebilirlik ağacından gizler', () => {
    const { container } = render(<Skeleton data-testid="loading" />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveClass('animate-pulse', 'rounded-lg')
  })
  it('skeleton dış boyut ve data niteliğini iletir', () => {
    render(<Skeleton data-testid="loading" className="h-20" data-state="loading" />)
    expect(screen.getByTestId('loading')).toHaveClass('h-20')
    expect(screen.getByTestId('loading')).toHaveAttribute('data-state', 'loading')
  })
  it('input erişilebilir adı ve doğal props’ları taşır', () => {
    render(<Input aria-label="Film ara" placeholder="Başlık" disabled />)
    const input = screen.getByRole('textbox', { name: 'Film ara' })
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('placeholder', 'Başlık')
  })
  it('input className ile çakışan padding’i değiştirir', () => {
    render(<Input aria-label="Film ara" className="px-6" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('px-6', 'focus-visible:outline-2')
    expect(input).not.toHaveClass('px-3')
  })
})
