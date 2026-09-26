import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BodyPortal } from '@exercise/BodyPortal'
describe('Portal', () => {
  it('alanı body altında ve kartın dışında kurar', () => {
    const { container } = render(
      <div data-testid="kart">
        <BodyPortal>
          <button>Oynat</button>
        </BodyPortal>
      </div>,
    )
    const region = screen.getByRole('region', { name: 'Fragman alanı' })
    expect(region.parentElement).toBe(document.body)
    expect(container.querySelector('[role="region"]')).toBeNull()
    expect(region).toContainElement(screen.getByRole('button', { name: 'Oynat' }))
  })
  it('portala taşınan düğmenin tıklaması çalışır', async () => {
    const play = vi.fn()
    const user = userEvent.setup()
    render(
      <BodyPortal>
        <button onClick={play}>Oynat</button>
      </BodyPortal>,
    )
    await user.click(screen.getByRole('button', { name: 'Oynat' }))
    expect(play).toHaveBeenCalledTimes(1)
  })
})
