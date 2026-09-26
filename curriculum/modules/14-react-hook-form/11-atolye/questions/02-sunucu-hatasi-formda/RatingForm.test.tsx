import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { RatingForm } from '@exercise/RatingForm'

describe('puan formu', () => {
  it('sunucu hatasından sonra seçilen puanı korur, düzeltilince gönderimi tamamlar', async () => {
    const user = userEvent.setup()
    let attempt = 0
    server.use(
      http.post(`${TMDB_BASE}/movie/550/rating`, async () => {
        attempt += 1
        if (attempt === 1) return HttpResponse.json({}, { status: 500 })
        return HttpResponse.json(
          { success: true, status_code: 1, status_message: 'ok' },
          { status: 201 },
        )
      }),
    )
    render(<RatingForm />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Puan' })).toBeEnabled())

    await user.selectOptions(screen.getByRole('combobox', { name: 'Puan' }), '9')
    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('kaydedilemedi')
    expect(screen.getByRole('combobox', { name: 'Puan' })).toHaveValue('9')

    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(await screen.findByText('Puan kaydedildi')).toBeInTheDocument()
    await waitFor(() => expect(requests('/3/movie/550/rating')).toHaveLength(2))
  })

  it('geçerli bir denemede formu başarıyla gönderir', async () => {
    const user = userEvent.setup()
    render(<RatingForm />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Puan' })).toBeEnabled())
    await user.selectOptions(screen.getByRole('combobox', { name: 'Puan' }), '7')
    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(await screen.findByText('Puan kaydedildi')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
