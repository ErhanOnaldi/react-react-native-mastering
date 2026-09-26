import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { delay, DUMMYJSON_BASE, http, HttpResponse, requests, server, TEST_USER } from '@test-utils'
import { LoginPanel } from '@exercise/LoginPanel'

describe('giriş hatası ve düzeltme', () => {
  it('hatalı bilgide okunur hata verir, yazdığın kullanıcı adı kalır', async () => {
    const user = userEvent.setup()
    render(<LoginPanel />)
    await user.type(screen.getByLabelText('Kullanıcı adı'), TEST_USER.username)
    await user.type(screen.getByLabelText('Şifre'), 'yanlis-sifre')
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByLabelText('Kullanıcı adı')).toHaveValue(TEST_USER.username)
  })

  it('bilgiler düzeltilince giriş tamamlanır', async () => {
    const user = userEvent.setup()
    render(<LoginPanel />)
    await user.type(screen.getByLabelText('Kullanıcı adı'), TEST_USER.username)
    await user.type(screen.getByLabelText('Şifre'), 'yanlis-sifre')
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
    await screen.findByRole('alert')
    await user.clear(screen.getByLabelText('Şifre'))
    await user.type(screen.getByLabelText('Şifre'), TEST_USER.password)
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
    expect(await screen.findByText(/emilys/i)).toBeInTheDocument()
  })

  it('istek sürerken ikinci tıklama ek bir istek göndermez', async () => {
    const user = userEvent.setup()
    server.use(
      http.post(`${DUMMYJSON_BASE}/auth/login`, async () => {
        await delay(80)
        return HttpResponse.json({
          accessToken: 'test-token',
          refreshToken: 'test-refresh',
          username: TEST_USER.username,
        })
      }),
    )
    render(<LoginPanel />)
    await user.type(screen.getByLabelText('Kullanıcı adı'), TEST_USER.username)
    await user.type(screen.getByLabelText('Şifre'), TEST_USER.password)
    const button = screen.getByRole('button', { name: 'Giriş yap' })
    await user.click(button)
    await user.click(button)
    expect(await screen.findByText(/emilys/i)).toBeInTheDocument()
    expect(requests('/auth/login'), 'Beklenen: 1 istek').toHaveLength(1)
  })
})
