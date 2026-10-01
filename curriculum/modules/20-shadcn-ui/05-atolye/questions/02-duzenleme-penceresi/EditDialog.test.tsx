import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EditDialog, type EditDialogRecord } from '@exercise/EditDialog'

const ada: EditDialogRecord = { id: '1', name: 'Ada Lovelace', email: 'ada@example.com' }
const grace: EditDialogRecord = { id: '2', name: 'Grace Hopper', email: 'grace@example.com' }

describe('düzenleme penceresi', () => {
  it('seçili kaydı doldurur ve farklı kayıt gelince günceller', () => {
    const { rerender } = render(
      <EditDialog open record={ada} onOpenChange={vi.fn()} onSave={vi.fn()} />,
    )
    expect(screen.getByRole('textbox', { name: 'Ad' })).toHaveValue('Ada Lovelace')
    expect(screen.getByRole('textbox', { name: 'E-posta' })).toHaveValue('ada@example.com')

    rerender(<EditDialog open record={grace} onOpenChange={vi.fn()} onSave={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: 'Ad' })).toHaveValue('Grace Hopper')
    expect(screen.getByRole('textbox', { name: 'E-posta' })).toHaveValue('grace@example.com')
  })

  it('geçersiz e-postada okunabilir hata gösterir, odağı alana taşır ve kaydetmez', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<EditDialog open record={ada} onOpenChange={vi.fn()} onSave={onSave} />)

    const emailInput = screen.getByRole('textbox', { name: 'E-posta' })
    await user.clear(emailInput)
    await user.type(emailInput, 'gecersiz-eposta')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('e-posta')
    expect(emailInput).toHaveFocus()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('geçerli girişte güncel değerlerle kaydeder ve pencereyi kapatır', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onOpenChange = vi.fn()
    render(<EditDialog open record={ada} onOpenChange={onOpenChange} onSave={onSave} />)

    const nameInput = screen.getByRole('textbox', { name: 'Ad' })
    await user.clear(nameInput)
    await user.type(nameInput, 'Ada King')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))

    expect(onSave).toHaveBeenCalledWith({
      id: '1',
      name: 'Ada King',
      email: 'ada@example.com',
    })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
