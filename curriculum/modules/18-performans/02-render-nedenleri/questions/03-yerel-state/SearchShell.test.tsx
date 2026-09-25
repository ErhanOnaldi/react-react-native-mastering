import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SearchShell } from '@exercise/SearchShell'

describe('SearchShell', () => {
  it('controlled input yazılan sorguyu hemen gösterir', () => {
    render(<SearchShell onResultsRender={vi.fn()} />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Film ara' }), {
      target: { value: 'Matrix' },
    })
    expect(screen.getByRole('textbox')).toHaveValue('Matrix')
    expect(screen.getByText('Arama: Matrix')).toBeInTheDocument()
  })
  it('input değişince sabit sonuç panelini yeniden çalıştırmaz', () => {
    const count = vi.fn()
    render(<SearchShell onResultsRender={count} />)
    const before = count.mock.calls.length
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Dövüş' } })
    expect(count, 'Sonuç paneli değişmeyen props ile tekrar çağrılmamalı').toHaveBeenCalledTimes(
      before,
    )
  })
})
