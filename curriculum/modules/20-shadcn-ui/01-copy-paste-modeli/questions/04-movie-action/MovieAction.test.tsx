import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MovieAction } from '@exercise/MovieAction'

describe('MovieAction', () => {
  it('varsayılan durumda birincil sınıflı gerçek düğme render eder', () => {
    render(<MovieAction>İzle</MovieAction>)
    expect(screen.getByRole('button', { name: 'İzle' })).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('outline variant ve dışarıdan gelen sınıfı birleştirir', () => {
    render(<MovieAction variant="outline" className="mt-2">Listeye ekle</MovieAction>)
    expect(screen.getByRole('button', { name: 'Listeye ekle' })).toHaveClass('border', 'border-input', 'mt-2')
  })

  it('asChild ile linki iç içe düğme üretmeden kullanır', () => {
    render(<MovieAction asChild><a href="/movie/550">Dövüş Kulübü</a></MovieAction>)
    expect(screen.getByRole('link', { name: 'Dövüş Kulübü' })).toHaveAttribute('href', '/movie/550')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('düğme props ve tıklama davranışını korur', async () => {
    const click = vi.fn()
    render(<MovieAction type="submit" onClick={click}>Kaydet</MovieAction>)
    const button = screen.getByRole('button', { name: 'Kaydet' })
    expect(button).toHaveAttribute('type', 'submit')
    await userEvent.setup().click(button)
    expect(click).toHaveBeenCalledOnce()
  })
})
