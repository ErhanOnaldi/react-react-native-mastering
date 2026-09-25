import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MoviePicker } from '@exercise/MoviePicker'
describe('MoviePicker', () => {
  it('seçilen filmi aria-pressed ile işaretler', async () => {
    const user = userEvent.setup()
    render(<MoviePicker />)
    await user.click(screen.getByRole('button', { name: 'Matrix seç' }))
    expect(screen.getByRole('button', { name: 'Matrix seç' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
  it('sıralama değişince seçimi aynı filmde tutar', async () => {
    const user = userEvent.setup()
    render(<MoviePicker />)
    await user.click(screen.getByRole('button', { name: 'Dövüş Kulübü seç' }))
    await user.click(screen.getByRole('button', { name: 'Sırayı ters çevir' }))
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Matrix')
    expect(screen.getByRole('button', { name: 'Dövüş Kulübü seç' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
