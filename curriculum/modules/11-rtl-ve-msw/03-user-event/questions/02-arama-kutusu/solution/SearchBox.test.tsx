import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { SearchBox } from '@impl/SearchBox'

function Harness({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('')
  return <SearchBox value={value} onChange={setValue} onSubmit={onSubmit} />
}

describe('SearchBox', () => {
  it('yazılan metni inputta gösterip onChange ile bildirir', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    function ControlledSearchBox() {
      const [value, setValue] = useState('')
      return (
        <SearchBox
          value={value}
          onChange={(nextValue) => {
            onChange(nextValue)
            setValue(nextValue)
          }}
          onSubmit={vi.fn()}
        />
      )
    }
    render(<ControlledSearchBox />)
    const input = screen.getByRole('searchbox', { name: 'Film ara' })

    await user.type(input, 'Matrix')

    expect(input).toHaveValue('Matrix')
    expect(onChange).toHaveBeenLastCalledWith('Matrix')
  })

  it('Enter ile boşlukları temizleyip aramayı gönderir', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)

    await user.type(screen.getByRole('searchbox', { name: 'Film ara' }), ' Matrix {Enter}')

    expect(onSubmit).toHaveBeenCalledWith('Matrix')
  })

  it('Ara düğmesiyle aramayı gönderir', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)
    await user.type(screen.getByRole('searchbox', { name: 'Film ara' }), 'Matrix')

    await user.click(screen.getByRole('button', { name: 'Ara' }))

    expect(onSubmit).toHaveBeenCalledWith('Matrix')
  })

  it('boş metin için arama göndermez', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Ara' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
