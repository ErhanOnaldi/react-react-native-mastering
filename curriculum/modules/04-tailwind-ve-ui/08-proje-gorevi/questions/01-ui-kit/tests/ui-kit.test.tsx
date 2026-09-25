import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { cn } from '@project/src/lib/cn'
import { Badge } from '@project/src/components/ui/badge'
import { Button, buttonVariants } from '@project/src/components/ui/button'
import { Card } from '@project/src/components/ui/card'
import { Input } from '@project/src/components/ui/input'
import { Skeleton } from '@project/src/components/ui/skeleton'

const css = readFileSync(join(process.env.RM_PROJECT_DIR!, 'src/index.css'), 'utf8')

describe('Sinema UI kit', () => {
  it('cn koşullu class’ları ve padding çakışmasını çözer', () => {
    expect(cn('p-2', false, { rounded: true }, 'p-4')).toBe('rounded p-4')
  })

  it('Tailwind v4 import, tema ve dark varyantını tanımlar', () => {
    expect(css).toMatch(/@import\s+["']tailwindcss["']/)
    expect(css).toMatch(/@theme\s*\{[\s\S]*--color-brand-/)
    expect(css).toMatch(/@theme\s*\{[\s\S]*--font-/)
    expect(css).toMatch(/@custom-variant\s+dark\s+\(&:where\(\.dark,\s*\.dark\s+\*\)\)/)
  })

  it('Button varsayılan ve üç varyant için ayrı class üretir', () => {
    const primary = buttonVariants({ variant: 'primary' })
    const secondary = buttonVariants({ variant: 'secondary' })
    const ghost = buttonVariants({ variant: 'ghost' })
    expect(new Set([primary, secondary, ghost]).size).toBe(3)
    expect(buttonVariants()).toBe(primary)
  })

  it('Button üç boyut için ayrı class üretir', () => {
    expect(
      new Set(
        ['sm', 'md', 'lg'].map((size) => buttonVariants({ size: size as 'sm' | 'md' | 'lg' })),
      ).size,
    ).toBe(3)
  })

  it('Button erişilebilir adı, disabled ve data props’larını iletir', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled aria-label="Favoriye ekle" data-state="idle" onClick={onClick}>
        Favori
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Favoriye ekle' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-state', 'idle')
    await userEvent.setup().click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('Badge ve Card içeriği, data niteliğini ve className’i taşır', () => {
    render(
      <Card className="p-8" data-state="ready">
        <Badge className="px-5" data-tone="score">
          8.4
        </Badge>
      </Card>,
    )
    expect(screen.getByRole('article')).toHaveAttribute('data-state', 'ready')
    expect(screen.getByRole('article')).toHaveClass('p-8')
    expect(screen.getByText('8.4')).toHaveAttribute('data-tone', 'score')
    expect(screen.getByText('8.4')).toHaveClass('px-5')
  })

  it('Skeleton gizli yer tutucudur; Input doğal props’ları taşır', () => {
    render(
      <>
        <Skeleton data-testid="skeleton" className="h-20" />
        <Input aria-label="Film ara" placeholder="Başlık" disabled />
      </>,
    )
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('skeleton')).toHaveClass('h-20')
    expect(screen.getByRole('textbox', { name: 'Film ara' })).toBeDisabled()
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Başlık')
  })
})
