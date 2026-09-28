import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBox } from '@impl/SearchBox'

describe('SearchBox', () => {
  it('arama alanını Film ara adıyla bulur', () => {
    render(<SearchBox query="" onQueryChange={() => {}} />)

    expect(screen.getByRole('searchbox', { name: 'Film ara' })).toBeInTheDocument()
  })

  it('başlangıç sorgusunu alanda gösterir', () => {
    render(<SearchBox query="Ma" onQueryChange={() => {}} />)

    expect(screen.getByRole('searchbox', { name: 'Film ara' })).toHaveValue('Ma')
  })

  it('yazılan sorguyu üst bileşene iletir', async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()

    function ControlledSearchBox() {
      const [query, setQuery] = useState('')
      return (
        <SearchBox
          query={query}
          onQueryChange={(nextQuery) => {
            onQueryChange(nextQuery)
            setQuery(nextQuery)
          }}
        />
      )
    }

    render(<ControlledSearchBox />)

    await user.type(screen.getByRole('searchbox', { name: 'Film ara' }), 'Matrix')

    expect(onQueryChange).toHaveBeenLastCalledWith('Matrix')
  })

  it('arama alanı rolünü korur', () => {
    render(<SearchBox query="" onQueryChange={() => {}} />)

    expect(screen.getByRole('searchbox', { name: 'Film ara' })).toHaveAttribute('type', 'search')
  })
})
