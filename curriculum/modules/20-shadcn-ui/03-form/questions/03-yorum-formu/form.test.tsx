import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReviewForm } from '@exercise/ReviewForm'

describe('Form parçaları', () => {
  it('etiketleri kontrollere bağlar', () => {
    render(<ReviewForm onSubmit={() => {}} />)
    expect(screen.getByRole('textbox', { name: 'Yorum' })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Puan (1–5)' })).toBeInTheDocument()
  })

  it('hata yokken alan geçersiz görünmez ve açıklaması yoktur', () => {
    render(<ReviewForm onSubmit={() => {}} />)
    const body = screen.getByRole('textbox', { name: 'Yorum' })
    expect(body).not.toHaveAttribute('aria-invalid', 'true')
    expect(body).not.toHaveAttribute('aria-describedby')
  })

  it('boş gönderimde her hatayı görünür yapar ve kendi alanına bağlar', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<ReviewForm onSubmit={onSubmit} />)
    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    const body = screen.getByRole('textbox', { name: 'Yorum' })
    const rating = screen.getByRole('spinbutton', { name: 'Puan (1–5)' })
    expect(await screen.findByText('Yorum gerekli')).toBeVisible()
    expect(body).toHaveAttribute('aria-invalid', 'true')
    expect(body).toHaveAccessibleDescription('Yorum gerekli')
    expect(rating).toHaveAttribute('aria-invalid', 'true')
    expect(rating).toHaveAccessibleDescription('Puan seç')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('hata düzeltilince mesaj kalkar ve alan tekrar geçerli olur', async () => {
    const user = userEvent.setup()
    render(<ReviewForm onSubmit={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    await screen.findByText('Yorum gerekli')
    await user.type(screen.getByRole('textbox', { name: 'Yorum' }), 'Harika')
    expect(screen.queryByText('Yorum gerekli')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Yorum' })).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('aynı sayfadaki iki formun kimlikleri çakışmaz', async () => {
    const user = userEvent.setup()
    render(
      <>
        <ReviewForm onSubmit={() => {}} />
        <ReviewForm onSubmit={() => {}} />
      </>,
    )
    const [firstBody, secondBody] = screen.getAllByRole('textbox', { name: 'Yorum' })
    expect(firstBody.id).not.toBe('')
    expect(firstBody.id).not.toBe(secondBody.id)
    await user.click(screen.getAllByRole('button', { name: 'Gönder' })[0])
    expect(firstBody).toHaveAccessibleDescription('Yorum gerekli')
    expect(secondBody).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('geçerli veriyi temizlenmiş haliyle gönderir', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<ReviewForm onSubmit={onSubmit} />)
    await user.type(screen.getByRole('textbox', { name: 'Yorum' }), '  Harika film  ')
    await user.type(screen.getByRole('spinbutton', { name: 'Puan (1–5)' }), '4')
    await user.click(screen.getByRole('button', { name: 'Gönder' }))
    expect(onSubmit).toHaveBeenCalledWith({ body: 'Harika film', rating: 4 }, expect.anything())
  })
})
