import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SlotTrigger } from '@exercise/SlotTrigger'
describe('Slot Trigger', () => {
  it('varsayılan durumda tek doğal button gösterir', async () => {
    const open = vi.fn()
    const user = userEvent.setup()
    render(<SlotTrigger onOpen={open}>Fragmanı aç</SlotTrigger>)
    expect(screen.getAllByRole('button')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    expect(open).toHaveBeenCalledTimes(1)
  })
  it('asChild ile tek button bırakır, iki handlerı sırayla çalıştırır', async () => {
    const calls: string[] = []
    const user = userEvent.setup()
    render(
      <SlotTrigger
        asChild
        onOpen={() => calls.push('open')}
        className="trigger"
        aria-label="Fragmanı aç"
      >
        <button className="movie" onClick={() => calls.push('child')}>
          ▶
        </button>
      </SlotTrigger>,
    )
    const button = screen.getByRole('button', { name: 'Fragmanı aç' })
    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(button).toHaveClass('trigger', 'movie')
    await user.click(button)
    expect(calls).toEqual(['child', 'open'])
  })
  it('child kendi erişilebilir adını verirse Trigger adı onun üstüne yazmaz', () => {
    render(
      <SlotTrigger asChild onOpen={() => {}} aria-label="Fragmanı aç">
        <button aria-label="Dövüş Kulübü fragmanını oynat">▶</button>
      </SlotTrigger>,
    )
    expect(
      screen.getByRole('button', { name: 'Dövüş Kulübü fragmanını oynat' }),
    ).toBeInTheDocument()
  })
  it('child preventDefault yapınca açmayı iptal eder', async () => {
    const open = vi.fn()
    const user = userEvent.setup()
    render(
      <SlotTrigger asChild onOpen={open}>
        <button onClick={(e) => e.preventDefault()}>Açma</button>
      </SlotTrigger>,
    )
    await user.click(screen.getByRole('button'))
    expect(open).not.toHaveBeenCalled()
  })
  it('child ve dış refi aynı DOM öğesine bağlar', () => {
    const childRef = createRef<HTMLButtonElement>()
    const outerRef = createRef<HTMLElement>()
    render(
      <SlotTrigger asChild ref={outerRef} onOpen={() => {}}>
        <button ref={childRef}>Fragman</button>
      </SlotTrigger>,
    )
    expect(childRef.current).toBe(screen.getByRole('button'))
    expect(outerRef.current).toBe(childRef.current)
  })
})
