import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OptimisticFavoriteButton } from '@project/src/features/favorites/components/OptimisticFavoriteButton'
import { routes } from '@project/src/router'
import type { RouteObject } from 'react-router'

describe('Sinema optimistic favori düğmesi', () => {
  it('tıklamada kayıt isteğini başlatır ve başarıyı gösterir', async () => {
    const onSave = vi.fn(async () => {})
    render(<OptimisticFavoriteButton initialFavorite={false} onSave={onSave} />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(onSave).toHaveBeenCalledWith(true))
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true'))
  })
  it('istek başarısız olunca geçici favoriden geri döner', async () => {
    const onSave = vi.fn(async () => {
      throw new Error('kayıt başarısız')
    })
    render(<OptimisticFavoriteButton initialFavorite={false} onSave={onSave} />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(onSave).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false'))
  })
})

function flatten(items: RouteObject[]): RouteObject[] {
  return items.flatMap((route) => [route, ...flatten(route.children ?? [])])
}

describe('Sinema detay route', () => {
  it('film detayını lazy route olarak yükler', () => {
    const detail = flatten(routes).find((route) => route.path?.includes('movie/:id'))
    expect(detail, 'Film detay route bulunmalı').toBeDefined()
    expect(detail?.lazy, 'Detay kodu gerektiğinde yüklenmeli').toBeTypeOf('function')
  })
})
