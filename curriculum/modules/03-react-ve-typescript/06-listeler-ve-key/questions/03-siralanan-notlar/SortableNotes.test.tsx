import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SortableNotes } from '@exercise/SortableNotes'
describe('SortableNotes', () => {
  it('sıralama sonrası notu aynı filme bağlı tutar', async () => {
    const user = userEvent.setup()
    render(<SortableNotes />)
    await user.type(screen.getByRole('textbox', { name: 'Dövüş Kulübü notu' }), 'Güçlü final')
    await user.click(screen.getByRole('button', { name: 'Sırayı ters çevir' }))
    expect(screen.getByRole('textbox', { name: 'Dövüş Kulübü notu' })).toHaveValue('Güçlü final')
    expect(screen.getByRole('textbox', { name: 'Matrix notu' })).toHaveValue('')
  })
  it('ters sıralamayı geri alır', async () => {
    const user = userEvent.setup()
    render(<SortableNotes />)
    await user.click(screen.getByRole('button', { name: 'Sırayı ters çevir' }))
    await user.click(screen.getByRole('button', { name: 'Sırayı ters çevir' }))
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Dövüş Kulübü')
  })
})
