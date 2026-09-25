import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { VoteBoard } from '@exercise/VoteBoard'
describe('VoteBoard', () => {
  it('yalnız seçilen filmin oyunu artırır', async () => {
    const user = userEvent.setup()
    render(<VoteBoard />)
    await user.click(screen.getByRole('button', { name: 'Oy ver: Matrix' }))
    expect(screen.getByText(/Matrix: 51 oy/)).toBeInTheDocument()
    expect(screen.getByText(/Dövüş Kulübü: 100 oy/)).toBeInTheDocument()
  })
  it('iki tıklamayı biriktirir', async () => {
    const user = userEvent.setup()
    render(<VoteBoard />)
    await user.click(screen.getByRole('button', { name: 'Oy ver: Matrix' }))
    await user.click(screen.getByRole('button', { name: 'Oy ver: Matrix' }))
    expect(screen.getByText(/Matrix: 52 oy/)).toBeInTheDocument()
  })
})
