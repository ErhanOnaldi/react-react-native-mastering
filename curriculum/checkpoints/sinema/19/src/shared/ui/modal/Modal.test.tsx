import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Modal } from './Modal'

function Demo() {
  return (
    <>
      <button>Önce</button>
      <Modal>
        <Modal.Trigger>Fragmanı aç</Modal.Trigger>
        <Modal.Content title="Matrix fragmanı">
          <a href="https://www.youtube.com/watch?v=abc">YouTube'da izle</a>
          <Modal.Close>Kapat</Modal.Close>
          <button disabled>İndir</button>
        </Modal.Content>
      </Modal>
      <button>Sonra</button>
    </>
  )
}

describe('Modal', () => {
  it('adı olan modal dialogu body altında açar ve ilk kontrole focus verir', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    const dialog = screen.getByRole('dialog', { name: 'Matrix fragmanı' })
    expect(dialog.parentElement).toBe(document.body)
    expect(screen.getByRole('link', { name: "YouTube'da izle" })).toHaveFocus()
  })

  it('Tab disabled öğeyi atlayıp dialog içinde döner', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    await user.tab()
    expect(screen.getByRole('button', { name: 'Kapat' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: "YouTube'da izle" })).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Kapat' })).toHaveFocus()
  })

  it('Escape ve arka plan tıklaması kapatır, focus tetikleyiciye döner', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    const trigger = screen.getByRole('button', { name: 'Fragmanı aç' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    const overlay = screen.getByRole('dialog').previousElementSibling
    await user.click(overlay as HTMLElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('parçalar Modal dışında anlaşılır hata verir', () =>
    expect(() => render(<Modal.Close>Kapat</Modal.Close>)).toThrow(
      /<Modal> içinde/,
    ))
})
