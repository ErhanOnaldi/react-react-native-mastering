import { screen, within } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { OPEN_LIBRARY_BASE } from '@/features/books/api/open-library'
import { duneDoc } from '@/test/msw/fixtures'
import { server } from '@/test/msw/server'
import { renderApp } from '@/test/render'

const searchUrl = `${OPEN_LIBRARY_BASE}/search.json`

describe('Arama sayfası', () => {
  it('form gönderilince URL’ye yazar ve sonuçları listeler', async () => {
    const { router, user } = renderApp('/')
    await user.type(screen.getByRole('searchbox', { name: 'Kitap ara' }), '  dune  {Enter}')

    expect(router.state.location.pathname).toBe('/search')
    expect(new URLSearchParams(router.state.location.search).get('q')).toBe('dune')
    const link = await screen.findByRole('link', { name: 'Dune Messiah' })
    expect(link).toHaveAttribute('href', '/works/OL893461W')
    expect(screen.getByText(/2 sonuç/)).toBeInTheDocument()
  })

  it('boş sorguda istek atmadan yönlendirme metnini gösterir', () => {
    let calls = 0
    server.use(
      http.get(searchUrl, () => {
        calls += 1
        return HttpResponse.json({ numFound: 0, docs: [] })
      }),
    )
    renderApp('/search')
    expect(screen.getByText(/aramak için bir kitap adı/i)).toBeInTheDocument()
    expect(calls).toBe(0)
  })

  it('eksik veriyi kırmadan gösterir: kapaksız kitapta görsel yok, yazar "Yazar bilinmiyor"', async () => {
    renderApp('/search?q=suc')
    const item = (await screen.findByRole('link', { name: 'Suc ve ceza' })).closest('li')!
    expect(within(item).getByText('Yazar bilinmiyor')).toBeInTheDocument()
    expect(item.querySelector('img')).toBeNull()
  })

  it('sonraki sayfaya geçerken eski sonuçları ekranda tutar ve page parametresini yollar', async () => {
    const pages: string[] = []
    server.use(
      http.get(searchUrl, async ({ request }) => {
        const page = new URL(request.url).searchParams.get('page') ?? '1'
        pages.push(page)
        if (page === '2') await delay(100)
        return HttpResponse.json({
          numFound: 25,
          docs: [{ ...duneDoc, key: `/works/OL${page}W`, title: `Sayfa ${page} kitabı` }],
        })
      }),
    )
    const { user, router } = renderApp('/search?q=dune')
    await screen.findByText('Sayfa 1 kitabı')
    expect(screen.getByText('Sayfa 1 / 3')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Sonraki' }))
    expect(new URLSearchParams(router.state.location.search).get('page')).toBe('2')
    expect(screen.getByText('Sayfa 1 kitabı')).toBeInTheDocument()
    expect(await screen.findByText('Sayfa 2 kitabı')).toBeInTheDocument()
    expect(pages).toEqual(['1', '2'])
  })

  it('hata olunca uyarı gösterir, "Tekrar dene" ile toparlanır', async () => {
    server.use(http.get(searchUrl, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const { user } = renderApp('/search?q=dune')
    const alert = await screen.findByRole('alert')
    await user.click(within(alert).getByRole('button', { name: 'Tekrar dene' }))
    expect(await screen.findByRole('link', { name: 'Dune' })).toBeInTheDocument()
  })
})
