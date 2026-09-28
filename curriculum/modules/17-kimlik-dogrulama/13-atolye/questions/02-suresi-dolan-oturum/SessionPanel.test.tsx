import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { requests, TEST_USER } from '@test-utils'
import { SessionPanel } from '@exercise/SessionPanel'

describe('süresi dolan oturum', () => {
  it('oturum süresi dolunca profil sonsuza dek yüklenmez, otomatik onarılır', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      const user = userEvent.setup()
      render(<SessionPanel sessionMinutes={1} />)
      await user.type(screen.getByLabelText('Kullanıcı adı'), TEST_USER.username)
      await user.type(screen.getByLabelText('Şifre'), TEST_USER.password)
      await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
      expect(await screen.findByText('Merhaba, emilys')).toBeInTheDocument()
      vi.setSystemTime(Date.now() + 61_000)
      await user.click(screen.getByRole('button', { name: 'Profili yenile' }))
      expect(await screen.findByText('Merhaba, emilys')).toBeInTheDocument()
      expect(requests('/auth/refresh'), 'Beklenen: 1 refresh isteği').toHaveLength(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('başarısız girişten sonra doğru bilgilerle tekrar denenince eski hata kalmaz', async () => {
    const user = userEvent.setup()
    render(<SessionPanel />)
    await user.type(screen.getByLabelText('Kullanıcı adı'), TEST_USER.username)
    await user.type(screen.getByLabelText('Şifre'), 'yanlis-sifre')
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    await user.clear(screen.getByLabelText('Şifre'))
    await user.type(screen.getByLabelText('Şifre'), TEST_USER.password)
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
    expect(await screen.findByText('Merhaba, emilys')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
