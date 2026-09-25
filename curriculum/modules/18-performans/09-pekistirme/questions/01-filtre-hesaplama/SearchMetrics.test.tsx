import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SearchMetrics } from '@exercise/SearchMetrics'
const titles = ['Dövüş Kulübü', 'Matrix', 'Başlangıç']
const filter = vi.fn((items: string[], q: string) =>
  items.filter((x) => x.toLocaleLowerCase('tr').includes(q.toLocaleLowerCase('tr'))),
)
describe('SearchMetrics', () => {
  it('ilgisiz sayaç güncellemesinde pahalı filtreyi yeniden çağırmaz', () => {
    render(<SearchMetrics titles={titles} filter={filter} />)
    const before = filter.mock.calls.length
    fireEvent.click(screen.getByRole('button', { name: /Sayaç/ }))
    expect(filter).toHaveBeenCalledTimes(before)
  })
  it('arama değişince doğru film kalır', async () => {
    render(<SearchMetrics titles={titles} filter={filter} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Matrix' } })
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1))
    expect(screen.getByText('Matrix')).toBeInTheDocument()
  })
})
