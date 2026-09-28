import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setupStore } from '@project/src/app/store'
import { Button } from '@project/src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@project/src/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@project/src/components/ui/dropdown-menu'
import { MovieDetailsPage } from '@project/src/pages/MovieDetailsPage'
import { renderWithRouter } from '@project/src/test/render'

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

describe('Sinema UI parçaları', () => {
  beforeEach(() => localStorage.clear())

  it('Button asChild film linkini iç içe düğme üretmeden gösterir', () => {
    render(
      <Button asChild variant="outline">
        <a href="/movie/550">Dövüş Kulübü</a>
      </Button>,
    )
    expect(screen.getByRole('link', { name: 'Dövüş Kulübü' })).toHaveAttribute('href', '/movie/550')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('Dialog başlıkla adlandırılır, Türkçe Kapat düğmesi sunar ve Escape ile focus’u geri verir', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Fragmanı aç</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dövüş Kulübü fragmanı</DialogTitle>
          <DialogDescription>Fight Club Trailer HD</DialogDescription>
        </DialogContent>
      </Dialog>,
    )
    const trigger = screen.getByRole('button', { name: 'Fragmanı aç' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Dövüş Kulübü fragmanı' })
    expect(dialog).toHaveAccessibleDescription('Fight Club Trailer HD')
    expect(within(dialog).getByRole('button', { name: 'Kapat' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('DropdownMenu klavyeyle açılır; seçim öğesi durumunu bildirir ve seçilince kapanır', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Film işlemleri</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
            Favori
          </DropdownMenuCheckboxItem>
          <DropdownMenuItem>Paylaş</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    screen.getByRole('button', { name: 'Film işlemleri' }).focus()
    await user.keyboard('{Enter}')
    const favorite = await screen.findByRole('menuitemcheckbox', { name: 'Favori' })
    expect(favorite).toHaveAttribute('aria-checked', 'false')
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Paylaş' })).toHaveFocus()
    await user.keyboard('{ArrowUp}{Enter}')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('550 detayında fragmanı Dialog’da açar ve Escape ile focus’u geri verir', async () => {
    const user = userEvent.setup()
    renderDetails(550)
    const trigger = await screen.findByRole('button', { name: 'Fragmanı aç' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Dövüş Kulübü fragmanı' })
    expect(dialog).toHaveAccessibleDescription('Fight Club Trailer HD')
    expect(within(dialog).getByRole('link', { name: "YouTube'da izle" })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=_8WFzt_tKAA',
    )
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('550 detayında Film işlemleri menüsü favoriyi değiştirir ve TMDB bağlantısı sunar', async () => {
    const user = userEvent.setup()
    renderDetails(550)
    await user.click(await screen.findByRole('button', { name: 'Film işlemleri' }))
    const favorite = await screen.findByRole('menuitemcheckbox', { name: 'Favori' })
    expect(favorite).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('menuitem', { name: "TMDB'de aç" })).toHaveAttribute(
      'href',
      'https://www.themoviedb.org/movie/550',
    )
    await user.click(favorite)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Film işlemleri' }))
    expect(await screen.findByRole('menuitemcheckbox', { name: 'Favori' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })
})
