import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ResultPanel } from '@exercise/ResultPanel'
describe('ResultPanel', () => {
  it('başlangıçta hazır durumunu gösterir', () => {
    render(<ResultPanel />)
    expect(screen.getByText('Hazır')).toBeInTheDocument()
  })
  it('yükle ve tamamla olaylarıyla tutarlı durum gösterir', () => {
    render(<ResultPanel />)
    fireEvent.click(screen.getByRole('button', { name: 'Yükle' }))
    expect(screen.getByText('Yükleniyor')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Tamamla' }))
    expect(screen.getByText('3 film')).toBeInTheDocument()
  })
})
