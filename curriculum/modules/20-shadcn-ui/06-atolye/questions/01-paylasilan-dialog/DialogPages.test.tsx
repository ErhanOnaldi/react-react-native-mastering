import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DialogPages } from '@exercise/DialogPages'

describe('paylaşılan onay penceresi', () => {
  it('düzenleme ekranında Esc pencereyi kapatır ve odağı İptal düğmesine döndürür', async () => {
    const user = userEvent.setup()
    render(<DialogPages />)

    const iptalButton = screen.getByRole('button', { name: 'İptal' })
    await user.click(iptalButton)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(iptalButton).toHaveFocus())
  })

  it('silme ekranında da aynı davranış çalışır: Esc kapatır ve odağı Sil düğmesine döndürür, onaylayınca kayıt silinir', async () => {
    const user = userEvent.setup()
    render(<DialogPages />)
    await user.click(screen.getByRole('button', { name: 'Silme' }))

    const silButtons = screen.getAllByRole('button', { name: 'Sil' })
    expect(silButtons).toHaveLength(2)
    const [ilkSil] = silButtons

    await user.click(ilkSil)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(ilkSil).toHaveFocus())
    expect(screen.getAllByRole('button', { name: 'Sil' })).toHaveLength(2)

    await user.click(ilkSil)
    await user.click(await screen.findByRole('button', { name: 'Evet, sil' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getAllByRole('button', { name: 'Sil' })).toHaveLength(1)
  })
})
