import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { catalog } from '@test-utils'
import { MovieCard } from '@project/src/components/MovieCard'
import { SearchBox } from '@project/src/components/SearchBox'
import { buttonVariants } from '@project/src/components/ui/button'

const movie = catalog.find((item) => item.id === 550)!

describe('UI kit ile MovieCard', () => {
  it('Türkçe film başlığını ve puanı gösterir', () => {
    render(<MovieCard movie={movie} isFavorite={false} onToggleFavorite={vi.fn()} />)
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(screen.getByText(/8[.,]4/)).toBeInTheDocument()
  })

  it('favori düğmesi erişilebilir ad ve basılı durumu bildirir', () => {
    render(<MovieCard movie={movie} isFavorite={true} onToggleFavorite={vi.fn()} />)
    const button = screen.getByRole('button', { name: 'Favorilerden çıkar', pressed: true })
    const buttonClass = buttonVariants({ variant: 'ghost' }).split(' ')[0]
    expect(button).toHaveClass(buttonClass)
  })

  it('favori düğmesi filmi değiştirmek için callback çağırır', async () => {
    const onToggleFavorite = vi.fn()
    render(<MovieCard movie={movie} isFavorite={false} onToggleFavorite={onToggleFavorite} />)
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Favoriye ekle', pressed: false }))
    expect(onToggleFavorite).toHaveBeenCalledWith(550)
  })

  it('arama kutusu controlled değer ve değişimi korur', async () => {
    const onChange = vi.fn()
    render(<SearchBox value="Dövüş" onChange={onChange} />)
    const input = screen.getByRole('textbox', { name: 'Film ara' })
    expect(input).toHaveValue('Dövüş')
    await userEvent.setup().type(input, ' K')
    expect(onChange).toHaveBeenCalled()
  })
})
