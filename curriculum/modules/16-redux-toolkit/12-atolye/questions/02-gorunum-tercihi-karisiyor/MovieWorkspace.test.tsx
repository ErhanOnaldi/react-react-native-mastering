import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MovieWorkspace } from '@exercise/MovieWorkspace'

describe('film çalışma alanı - görünüm ve favori', () => {
  it('görünüm değişince film listesi kaybolmaz', async () => {
    const user = userEvent.setup()
    render(<MovieWorkspace />)

    await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')
    await user.click(screen.getByRole('button', { name: 'Kart görünümü' }))
    expect(screen.getByText('Örümcek-Adam: Yepyeni Bir Gün')).toBeInTheDocument()
  })

  it('tür değişip geri dönünce favori işareti doğru filmde kalır', async () => {
    const user = userEvent.setup()
    render(<MovieWorkspace />)

    await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')
    await user.click(screen.getByRole('button', { name: 'Örümcek-Adam: Yepyeni Bir Gün favori' }))
    expect(
      screen.getByRole('button', { name: 'Örümcek-Adam: Yepyeni Bir Gün favori' }),
    ).toHaveAttribute('aria-pressed', 'true')

    await user.selectOptions(screen.getByRole('combobox', { name: 'Tür' }), '35')
    await screen.findByText("Coyote Acme'ye Karşı")

    await user.selectOptions(screen.getByRole('combobox', { name: 'Tür' }), '28')
    await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')
    expect(
      screen.getByRole('button', { name: 'Örümcek-Adam: Yepyeni Bir Gün favori' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })
})
