import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MovieNotes } from '@exercise/MovieNotes'
describe('MovieNotes', () => {
  it('aynı filmde yazılan notu korur', () => {
    const view = render(<MovieNotes id={550} />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Film notu' }), {
      target: { value: 'İzle' },
    })
    view.rerender(<MovieNotes id={550} />)
    expect(screen.getByRole('textbox')).toHaveValue('İzle')
  })
  it('başka filme geçince notu sıfırlar', () => {
    const view = render(<MovieNotes id={550} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'İzle' } })
    view.rerender(<MovieNotes id={27205} />)
    expect(screen.getByRole('textbox')).toHaveValue('')
  })
})
