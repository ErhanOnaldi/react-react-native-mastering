import { createRef } from 'react'
import { act, render, renderHook, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { describe, expect, it, vi } from 'vitest'
import { setupStore } from '@project/src/app/store'
import { MovieDetailsPage } from '@project/src/pages/MovieDetailsPage'
import { Modal } from '@project/src/shared/ui/modal/Modal'
import { useDisclosure } from '@project/src/shared/ui/modal/useDisclosure'
import { renderWithRouter } from '@project/src/test/render'

function Demo() {
  return (
    <>
      <button>Önceki</button>
      <Modal>
        <Modal.Trigger>Fragmanı aç</Modal.Trigger>
        <Modal.Content title="Dövüş Kulübü fragmanı">
          <button>Oynat</button>
          <Modal.Close>Kapat</Modal.Close>
          <button disabled>İndir</button>
        </Modal.Content>
      </Modal>
      <button>Sonraki</button>
    </>
  )
}

function renderDetails(id: number) {
  return renderWithRouter(
    [
      {
        path: '/movie/:id',
        element: (
          <Provider store={setupStore()}>
            <MovieDetailsPage />
          </Provider>
        ),
      },
    ],
    { route: `/movie/${id}` },
  )
}

describe('Sinema Modal', () => {
  it('useDisclosure açar, kapatır, toggle eder ve fonksiyonlarını sabit tutar', () => {
    const { result, rerender } = renderHook(() => useDisclosure())
    const { open, close, toggle } = result.current
    expect(result.current.isOpen).toBe(false)
    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
    rerender()
    expect(result.current.open).toBe(open)
    expect(result.current.close).toBe(close)
    expect(result.current.toggle).toBe(toggle)
  })

  it('kapalıyken içerik yok; açılınca body altında adı olan modal dialog gösterir', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    const dialog = screen.getByRole('dialog', { name: 'Dövüş Kulübü fragmanı' })
    expect(dialog.parentElement).toBe(document.body)
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(within(dialog).getByRole('heading', { name: 'Dövüş Kulübü fragmanı' })).toBeVisible()
  })

  it('açınca ilk kontrole focus verir; Tab disabled öğeyi atlayıp içeride döner', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    expect(screen.getByRole('button', { name: 'Oynat' })).toHaveFocus()
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(screen.getByRole('button', { name: 'Kapat' })).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(screen.getByRole('button', { name: 'Oynat' }), 'Tab dialogdan kaçtı').toHaveFocus()
  })

  it('Kapat düğmesi dialogu kapatır ve odağı açan düğmeye verir', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    await user.click(screen.getByRole('button', { name: 'Kapat' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fragmanı aç' })).toHaveFocus()
  })

  it('klavyeyle açılır, Escape ile kapanır ve focus açan düğmeye döner', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    screen.getByRole('button', { name: 'Fragmanı aç' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fragmanı aç' })).toHaveFocus()
  })

  it('asChild var olan düğmeyi kullanır; child click ve ref’i korunur', async () => {
    const user = userEvent.setup()
    const child = vi.fn()
    const childRef = createRef<HTMLButtonElement>()
    render(
      <Modal>
        <Modal.Trigger asChild>
          <button ref={childRef} onClick={child}>
            Fragmanı aç
          </button>
        </Modal.Trigger>
        <Modal.Content title="Fragman">
          <Modal.Close>Kapat</Modal.Close>
        </Modal.Content>
      </Modal>,
    )
    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(childRef.current).toBe(screen.getByRole('button', { name: 'Fragmanı aç' }))
    await user.click(screen.getByRole('button', { name: 'Fragmanı aç' }))
    expect(child).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('dialog', { name: 'Fragman' })).toBeInTheDocument()
  })

  it('550 detayında gerçek fragmanı modalda açar ve Escape ile odağı geri verir', async () => {
    const user = userEvent.setup()
    renderDetails(550)
    const trigger = await screen.findByRole('button', { name: 'Fragmanı aç' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Dövüş Kulübü fragmanı' })
    expect(dialog).toHaveTextContent('Fight Club Trailer HD')
    expect(within(dialog).getByRole('link', { name: "YouTube'da izle" })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=_8WFzt_tKAA',
    )
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('videosu olmayan filmde fragman düğmesi göstermez', async () => {
    renderDetails(1368337)
    expect(await screen.findByRole('heading', { name: 'Odyssey' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Fragmanı aç' })).not.toBeInTheDocument()
  })
})
