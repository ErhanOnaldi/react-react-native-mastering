import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FormEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { WatchlistButton } from '@exercise/WatchlistButton'

describe('WatchlistButton', () => {
  it('listede olmayan film için ekleme eylemini gösterir', () => {
    render(<WatchlistButton isSaved={false} onToggle={() => {}} />)

    expect(screen.getByRole('button', { name: 'İzleme listeme ekle' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('listede olan film için çıkarma eylemini gösterir', () => {
    render(<WatchlistButton isSaved={true} onToggle={() => {}} />)

    expect(screen.getByRole('button', { name: 'Listemden çıkar' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('tıklanınca değişiklik isteğini bir kez bildirir', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<WatchlistButton isSaved={false} onToggle={onToggle} />)

    await user.click(screen.getByRole('button', { name: 'İzleme listeme ekle' }))

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('form içindeyken submit yerine düğme eylemini çalıştırır', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <WatchlistButton isSaved={false} onToggle={onToggle} />
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'İzleme listeme ekle' }))

    expect(onToggle).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
