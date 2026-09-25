import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TicketCounter } from '@exercise/TicketCounter'
describe('TicketCounter', () => {
  it('bir tıklamada üç bilet ekler', async () => {
    const user = userEvent.setup()
    render(<TicketCounter />)
    await user.click(screen.getByRole('button', { name: 'Bilet: 0' }))
    expect(screen.getByRole('button', { name: 'Bilet: 3' })).toBeInTheDocument()
  })
  it('ardışık iki tıklamada altı bilete ulaşır', async () => {
    const user = userEvent.setup()
    render(<TicketCounter />)
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('button', { name: 'Bilet: 6' })).toBeInTheDocument()
  })
})
