import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { GenreCounter } from '@exercise/GenreCounter'

describe('tür sayacı', () => {
  it('birden çok seçimi ve kaldırmayı aynı anda sayar', async () => {
    render(<GenreCounter />)
    expect(screen.getByText('Seçili tür: 0')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('checkbox', { name: 'Aksiyon' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Dram' }))
    expect(screen.getByText('Seçili tür: 2')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('checkbox', { name: 'Dram' }))
    expect(screen.getByText('Seçili tür: 1')).toBeInTheDocument()
  })

  it('temizleme hem seçimleri hem sayıyı sıfırlar', async () => {
    render(<GenreCounter />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Komedi' }))
    await userEvent.click(screen.getByRole('button', { name: 'Temizle' }))
    expect(screen.getByText('Seçili tür: 0')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Komedi' })).not.toBeChecked()
  })
})
