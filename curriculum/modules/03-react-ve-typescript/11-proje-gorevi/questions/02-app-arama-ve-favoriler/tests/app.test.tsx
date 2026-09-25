import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '@project/src/App'

describe('Sinema App', () => {
  it('statik filmleri ve arama kutusunu gösterir', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /sinema/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Film ara' })).toBeInTheDocument()
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
  })
  it('başlığa göre arar ve sorgu temizlenince listeyi geri getirir', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Film ara' })
    await user.type(input, 'Matrix')
    expect(screen.getByText('Matrix')).toBeInTheDocument()
    expect(screen.queryByText('Dövüş Kulübü')).not.toBeInTheDocument()
    await user.clear(input)
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
  })
  it('favori işaretini arama boyunca korur ve tekrar tıklayınca kaldırır', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Dövüş Kulübü.*favoriye ekle/i }))
    expect(screen.getByRole('button', { name: /Dövüş Kulübü.*favoriden çıkar/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    const input = screen.getByRole('textbox', { name: 'Film ara' })
    await user.type(input, 'Matrix')
    await user.clear(input)
    await user.click(screen.getByRole('button', { name: /Dövüş Kulübü.*favoriden çıkar/i }))
    expect(screen.getByRole('button', { name: /Dövüş Kulübü.*favoriye ekle/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
  it('iki filmi bağımsız favoride tutar', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Dövüş Kulübü.*favoriye ekle/i }))
    await user.click(screen.getByRole('button', { name: /Kara Şövalye.*favoriye ekle/i }))
    await user.click(screen.getByRole('button', { name: /Dövüş Kulübü.*favoriden çıkar/i }))
    expect(screen.getByRole('button', { name: /Kara Şövalye.*favoriden çıkar/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: /Dövüş Kulübü.*favoriye ekle/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
  it('eşleşme yoksa boş sonuç mesajı gösterir', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'zzzyok')
    expect(screen.getByText('Film bulunamadı')).toBeInTheDocument()
  })
})
