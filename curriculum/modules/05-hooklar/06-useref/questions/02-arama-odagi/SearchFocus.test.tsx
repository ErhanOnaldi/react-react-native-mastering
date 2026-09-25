import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SearchFocus } from '@exercise/SearchFocus'
describe('SearchFocus', () => {
  it('düğmeye basılınca film arama alanına odaklanır', () => {
    render(<SearchFocus />)
    fireEvent.click(screen.getByRole('button', { name: 'Aramaya geç' }))
    expect(screen.getByRole('textbox', { name: 'Film ara' })).toHaveFocus()
  })
})
