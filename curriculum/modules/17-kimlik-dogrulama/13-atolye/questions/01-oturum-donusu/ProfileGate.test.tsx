import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { requests, TEST_USER } from '@test-utils'
import { ProfileGate } from '@exercise/ProfileGate'

async function getAccessToken() {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER),
  })
  const data = (await response.json()) as { accessToken: string }
  return data.accessToken
}

describe('oturum dönüşü', () => {
  it('elde jeton varken (sayfa yenilemesi) profili otomatik gösterir ve tek istek atar', async () => {
    const token = await getAccessToken()
    render(<ProfileGate initialToken={token} />)
    expect(await screen.findByText('Merhaba, emilys')).toBeInTheDocument()
    expect(requests('/auth/me'), 'Beklenen: 1 profil isteği').toHaveLength(1)
  })

  it('normal girişte profil görünür ve profil isteği yalnızca bir kez atılır', async () => {
    const user = userEvent.setup()
    render(<ProfileGate />)
    await user.type(screen.getByLabelText('Kullanıcı adı'), TEST_USER.username)
    await user.type(screen.getByLabelText('Şifre'), TEST_USER.password)
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
    expect(await screen.findByText('Merhaba, emilys')).toBeInTheDocument()
    expect(requests('/auth/me'), 'Beklenen: 1 profil isteği').toHaveLength(1)
  })
})
