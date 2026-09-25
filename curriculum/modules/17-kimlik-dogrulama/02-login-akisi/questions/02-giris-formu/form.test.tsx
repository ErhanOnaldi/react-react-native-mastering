import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from '@exercise/LoginForm'

describe('giriş formu', () => {
  it('boş alanlarda istek callback’ini çağırmaz ve alan hatası gösterir', async () => {
    const onLogin = vi.fn()
    render(<LoginForm onLogin={onLogin} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Giriş yap' }))
    expect(onLogin).not.toHaveBeenCalled()
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
  })
  it('dolu alanları onLogin callback’ine gönderir', async () => {
    const onLogin = vi.fn()
    render(<LoginForm onLogin={onLogin} />)
    const user = userEvent.setup()
    await user.type(screen.getByRole('textbox', { name: 'Kullanıcı adı' }), 'emilys')
    await user.type(screen.getByLabelText('Parola'), 'emilyspass')
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
    await waitFor(() =>
      expect(onLogin).toHaveBeenCalledWith({ username: 'emilys', password: 'emilyspass' }),
    )
  })
  it('API hatasını genel uyarı olarak gösterir', async () => {
    const onLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
    render(<LoginForm onLogin={onLogin} />)
    const user = userEvent.setup()
    await user.type(screen.getByRole('textbox', { name: 'Kullanıcı adı' }), 'emilys')
    await user.type(screen.getByLabelText('Parola'), 'yanlis')
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')
  })
})
