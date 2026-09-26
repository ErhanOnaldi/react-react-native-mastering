import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse, OPENLIBRARY_BASE, requests, server } from '@test-utils'
import { renderApp } from './render-app'

const WORK = `${OPENLIBRARY_BASE}/works/:file`

function fakeWork(body: Record<string, unknown>) {
  server.use(
    http.get(WORK, () => HttpResponse.json({ key: '/works/OL1W', title: 'Deneme', ...body })),
  )
}

const coverImages = () =>
  Array.from(document.querySelectorAll('img')).filter((img) =>
    (img.getAttribute('src') ?? '').includes('covers.openlibrary.org'),
  )

describe('Eser detay sayfası (/works/:workId)', () => {
  it('arama sonucundaki başlığa tıklayınca detay sayfasına gider, h1’de eser adı görünür', async () => {
    const { router, user } = renderApp('/search?q=dune')
    await user.click(await screen.findByRole('link', { name: /Chapterhouse Dune/ }))
    expect(router.state.location.pathname).toBe('/works/OL893508W')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Chapterhouse Dune' }),
    ).toBeInTheDocument()
  })

  it('/works/:id.json isteği atar ve açıklamayı gösterir', async () => {
    renderApp('/works/OL893414W')
    expect(await screen.findByRole('heading', { level: 1, name: 'Dune' })).toBeInTheDocument()
    expect(screen.getByText(/Set on the desert planet Arrakis/)).toBeInTheDocument()
    expect(requests('/works/OL893414W.json').length).toBeGreaterThan(0)
  })

  it('yazar adını eserdeki anahtardan ayrı bir istekle (/authors/:id.json) getirir', async () => {
    renderApp('/works/OL893414W')
    expect(await screen.findByText('Frank Herbert')).toBeInTheDocument()
    expect(requests('/authors/OL79034A.json').length).toBeGreaterThan(0)
  })

  it('kapağı covers.openlibrary.org’dan eserin ilk kapak id’siyle yükler', async () => {
    renderApp('/works/OL893414W')
    await screen.findByRole('heading', { level: 1, name: 'Dune' })
    const [cover] = coverImages()
    expect(cover?.getAttribute('src')).toMatch(
      /^https:\/\/covers\.openlibrary\.org\/b\/id\/11481354-[SML]\.jpg$/,
    )
  })

  it('açıklama { type, value } nesnesi olarak gelse de metnini gösterir', async () => {
    fakeWork({ description: { type: '/type/text', value: 'Nesne biçiminde gelen açıklama.' } })
    renderApp('/works/OL1W')
    expect(await screen.findByText('Nesne biçiminde gelen açıklama.')).toBeInTheDocument()
  })

  it('açıklaması olmayan eserde "Açıklama yok." der', async () => {
    renderApp('/works/OL24252290W')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Suç ve Ceza' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/açıklama yok/i)).toBeInTheDocument()
  })

  it('yazar isteği başarısız olsa da sayfa çalışır ve "Yazar bilinmiyor" der', async () => {
    // Sahte Open Library’de OL22242A (Dostoyevski) yazarı yok → 404
    renderApp('/works/OL24252290W')
    await screen.findByRole('heading', { level: 1, name: 'Suç ve Ceza' })
    expect(await screen.findByText('Yazar bilinmiyor')).toBeInTheDocument()
  })

  it('kapak listesinde sadece "kapak yok" işareti (-1) varsa kırık görsel göstermez', async () => {
    fakeWork({ covers: [-1] })
    renderApp('/works/OL1W')
    await screen.findByRole('heading', { level: 1, name: 'Deneme' })
    expect(coverImages()).toEqual([])
    expect(document.querySelector('img[src*="-1-"], img[src*="undefined"]')).toBeNull()
  })

  it('olmayan eserde (404) "Kitap bulunamadı" der', async () => {
    renderApp('/works/OL0W')
    expect(await screen.findByText(/kitap bulunamadı/i, {}, { timeout: 4000 })).toBeInTheDocument()
  })

  it('sunucu hatasında (500) uyarı gösterir; "Tekrar dene" ile eser gelir', async () => {
    let failing = true
    server.use(
      http.get(WORK, () => {
        if (failing) return HttpResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
      }),
    )
    const { user } = renderApp('/works/OL893414W')
    expect(await screen.findByRole('alert', {}, { timeout: 4000 })).toBeInTheDocument()
    expect(screen.queryByText(/kitap bulunamadı/i)).not.toBeInTheDocument()
    failing = false
    await user.click(screen.getByRole('button', { name: 'Tekrar dene' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Dune' })).toBeInTheDocument()
  }, 10_000)

  it('başka bir esere geçince (aynı sayfa bileşeni, yeni id) yeni eseri gösterir', async () => {
    const { router } = renderApp('/works/OL893414W')
    await screen.findByRole('heading', { level: 1, name: 'Dune' })
    await router.navigate('/works/OL24252290W')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Suç ve Ceza' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'Dune' })).not.toBeInTheDocument()
  })
})
