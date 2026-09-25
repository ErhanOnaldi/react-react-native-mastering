import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DeferredSearch } from '@exercise/DeferredSearch'
const titles = ['Dövüş Kulübü', 'Matrix', 'Başlangıç']
describe('DeferredSearch', () => {
  it('input değerini yazılan sorguyla güncel tutar', () => {
    render(<DeferredSearch titles={titles} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Matrix' } })
    expect(screen.getByRole('textbox')).toHaveValue('Matrix')
  })
  it('listeyi son sorguya göre süzer', async () => {
    render(<DeferredSearch titles={titles} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Dövüş' } })
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1))
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
  })
  it('boş sorguda bütün filmleri gösterir', () => {
    render(<DeferredSearch titles={titles} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
