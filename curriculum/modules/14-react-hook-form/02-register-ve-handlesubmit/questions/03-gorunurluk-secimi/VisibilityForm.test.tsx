import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { VisibilityForm } from '@exercise/VisibilityForm'

describe('görünürlük seçimi', () => {
  it('başlangıçta özel liste gönderir', async () => {
    const user = userEvent.setup()
    const save = vi.fn()
    render(<VisibilityForm onSave={save} />)
    await user.type(screen.getByLabelText('Liste adı'), 'Akşam')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(save.mock.calls[0]?.[0]).toEqual({ name: 'Akşam', description: '', isPublic: false })
  })
  it('işaretlenince herkese açık liste gönderir', async () => {
    const user = userEvent.setup()
    const save = vi.fn()
    render(<VisibilityForm onSave={save} />)
    await user.click(screen.getByRole('checkbox', { name: 'Herkese açık' }))
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(save.mock.calls[0]?.[0].isPublic).toBe(true)
  })
})
