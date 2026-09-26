import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { delay, http, HttpResponse, OPENLIBRARY_BASE, requests, server } from '@test-utils'
import {
  currentParams,
  isInactive,
  pageControl,
  renderApp,
  resultItem,
  searchInput,
} from './render-app'

const SEARCH = `${OPENLIBRARY_BASE}/search.json`
const searchRequests = () => requests('/search.json')

/** Kontrollü sahte cevap: her sayfada tek kitap, toplam `total` sonuç */
function pagedSearch(total: number, slowPage?: string) {
  server.use(
    http.get(SEARCH, async ({ request }) => {
      const page = new URL(request.url).searchParams.get('page') ?? '1'
      if (page === slowPage) await delay(300)
      return HttpResponse.json({
        numFound: total,
        start: 0,
        docs: [{ key: `/works/OL${page}00W`, title: `Sayfa ${page} kitabı` }],
      })
    }),
  )
}

describe('Arama formu ve URL', () => {
  it('ana sayfada "Kitap ara" kutusu ve "Ara" butonu var', () => {
    renderApp('/')
    expect(searchInput()).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ara' })).toBeInTheDocument()
  })

  it('Enter’a basınca /search?q=… adresine gider; sorgunun baş/son boşlukları atılır', async () => {
    const { router, user } = renderApp('/')
    await user.type(searchInput(), '  dune  {Enter}')
    expect(router.state.location.pathname).toBe('/search')
    expect(currentParams(router).get('q')).toBe('dune')
  })

  it('Türkçe karakterli sorguyu bozmadan URL’ye ve isteğe taşır', async () => {
    const { router, user } = renderApp('/')
    await user.type(searchInput(), 'Suç ve Ceza')
    await user.click(screen.getByRole('button', { name: 'Ara' }))
    expect(currentParams(router).get('q')).toBe('Suç ve Ceza')
    expect(await screen.findByText('Ortaçağ Türk devletlerinde suç ve ceza')).toBeInTheDocument()
    expect(searchRequests().at(-1)?.search.get('q')).toBe('Suç ve Ceza')
  })

  it('yazarken istek atmaz: arama sadece form gönderilince yapılır', async () => {
    const { user } = renderApp('/')
    await user.type(searchInput(), 'dune')
    await new Promise((resolve) => setTimeout(resolve, 700))
    expect(searchRequests(), 'Beklenen: 0 istek (henüz Enter’a basılmadı)').toHaveLength(0)
  })

  it('boş ya da sadece boşluk içeren aramada istek atmaz', async () => {
    const { user } = renderApp('/')
    await user.type(searchInput(), '   {Enter}')
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(searchRequests()).toHaveLength(0)
  })

  it('/search sorgusuz açılınca yönlendirme metni gösterir ve istek atmaz', async () => {
    renderApp('/search')
    expect(screen.getByText(/aramak için bir kitap adı ya da yazar yaz/i)).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(searchRequests()).toHaveLength(0)
  })

  it('URL’deki sorgu arama kutusunda görünür (link paylaşılınca da)', async () => {
    renderApp('/search?q=dune')
    expect(searchInput()).toHaveValue('dune')
  })
})

describe('Sonuç listesi', () => {
  it('Open Library’ye q, page=1 ve limit=10 ile tek istek atar', async () => {
    renderApp('/search?q=dune')
    await screen.findByText(/Chapterhouse Dune/)
    expect(searchRequests(), 'Beklenen: 1 istek').toHaveLength(1)
    const { search } = searchRequests()[0]!
    expect(search.get('q')).toBe('dune')
    expect(search.get('page')).toBe('1')
    expect(search.get('limit')).toBe('10')
  })

  it('her sonucu liste öğesi olarak gösterir; başlık /works/:id detayına link verir', async () => {
    renderApp('/search?q=dune')
    const link = await screen.findByRole('link', { name: /Chapterhouse Dune/ })
    expect(link).toHaveAttribute('href', '/works/OL893508W')
    expect(link.closest('li')).not.toBeNull()
  })

  it('yazarları virgülle ayırır ve ilk yayın yılını gösterir', async () => {
    renderApp('/search?q=dune')
    await screen.findByText(/Sandworms of Dune/)
    expect(
      within(resultItem('OL14961045W')).getByText(/Kevin J\. Anderson, Brian Herbert/),
    ).toBeInTheDocument()
    expect(within(resultItem('OL893414W')).getByText(/1965/)).toBeInTheDocument()
  })

  it('kapağı covers.openlibrary.org’dan orta (-M) boyutta yükler', async () => {
    renderApp('/search?q=dune')
    await screen.findByText(/Chapterhouse Dune/)
    const img = resultItem('OL893414W').querySelector('img')
    expect(img).toHaveAttribute('src', 'https://covers.openlibrary.org/b/id/11481354-M.jpg')
  })

  it('kapağı olmayan kitapta kırık görsel yerine yer tutucu gösterir', async () => {
    renderApp('/search?q=suc ve ceza')
    await screen.findByText(/Ortaçağ Türk devletlerinde/)
    // /works/OL12943962W → "Suc ve ceza" (1984): cover_i yok
    const item = resultItem('OL12943962W')
    expect(
      item.querySelector(
        'img[src*="covers.openlibrary.org"], img[src*="undefined"], img[src*="null"]',
      ),
    ).toBeNull()
  })

  it('yazar bilgisi olmayan kitapta "Yazar bilinmiyor" yazar', async () => {
    server.use(
      http.get(SEARCH, () =>
        HttpResponse.json({
          numFound: 1,
          start: 0,
          docs: [{ key: '/works/OL1W', title: 'Adsız Defter' }],
        }),
      ),
    )
    renderApp('/search?q=defter')
    await screen.findByText('Adsız Defter')
    expect(within(resultItem('OL1W')).getByText('Yazar bilinmiyor')).toBeInTheDocument()
  })

  it('toplam sonuç sayısını Türkçe biçimde gösterir (48.232 sonuç)', async () => {
    pagedSearch(48232)
    renderApp('/search?q=dune')
    expect(await screen.findByText(/48\.232 sonuç/)).toBeInTheDocument()
  })

  it('sonuç yoksa "sonuç bulunamadı" der', async () => {
    renderApp('/search?q=qwxz')
    expect(await screen.findByText(/sonuç bulunamadı/i)).toBeInTheDocument()
  })
})

describe('Sayfalama', () => {
  it('"Sayfa 1 / 2" gösterir; ilk sayfada "Önceki" pasiftir', async () => {
    renderApp('/search?q=herbert')
    expect(await screen.findByText('Sayfa 1 / 2')).toBeInTheDocument()
    expect(isInactive(pageControl('Önceki'))).toBe(true)
    expect(isInactive(pageControl('Sonraki'))).toBe(false)
  })

  it('"Sonraki" ile 2. sayfaya geçer: URL’de ve istekte page=2', async () => {
    const { router, user } = renderApp('/search?q=herbert')
    await screen.findByText('Sayfa 1 / 2')
    await user.click(pageControl('Sonraki')!)
    expect(await screen.findByText('Sayfa 2 / 2')).toBeInTheDocument()
    expect(currentParams(router).get('page')).toBe('2')
    expect(currentParams(router).get('q')).toBe('herbert')
    expect(searchRequests().at(-1)?.search.get('page')).toBe('2')
    // 11 sonuç, sayfa başı 10 → 2. sayfada tek kitap
    expect(await screen.findByText(/The Butlerian Jihad/)).toBeInTheDocument()
    expect(screen.queryByText(/Chapterhouse Dune/)).not.toBeInTheDocument()
    expect(isInactive(pageControl('Sonraki'))).toBe(true)
  })

  it('link ile açılan 2. sayfa doğrudan 2. sayfayı ister', async () => {
    renderApp('/search?q=herbert&page=2')
    expect(await screen.findByText(/The Butlerian Jihad/)).toBeInTheDocument()
    expect(searchRequests()[0]?.search.get('page')).toBe('2')
  })

  it('bozuk page değerinde 1. sayfaya düşer', async () => {
    renderApp('/search?q=herbert&page=abc')
    expect(await screen.findByText('Sayfa 1 / 2')).toBeInTheDocument()
    expect(searchRequests()[0]?.search.get('page')).toBe('1')
  })

  it('yeni arama sayfayı 1’e sıfırlar', async () => {
    const { router, user } = renderApp('/search?q=herbert&page=2')
    await screen.findByText(/The Butlerian Jihad/)
    await user.clear(searchInput())
    await user.type(searchInput(), 'dune{Enter}')
    await waitFor(() => expect(currentParams(router).get('q')).toBe('dune'))
    expect(currentParams(router).get('page') ?? '1').toBe('1')
  })

  it('sonraki sayfa yüklenirken önceki sonuçlar ekranda kalır (liste boşalmaz)', async () => {
    pagedSearch(25, '2')
    const { user } = renderApp('/search?q=dune')
    await screen.findByText('Sayfa 1 kitabı')
    await user.click(pageControl('Sonraki')!)
    // 2. sayfa 300 ms gecikmeli: bu arada eski liste görünmeli
    expect(screen.getByText('Sayfa 1 kitabı')).toBeInTheDocument()
    expect(await screen.findByText('Sayfa 2 kitabı')).toBeInTheDocument()
  })
})

describe('Hata durumu', () => {
  it('Open Library hata verirse uyarı gösterir; "Tekrar dene" ile sonuçlar gelir', async () => {
    let failing = true
    server.use(
      http.get(SEARCH, () => {
        // Cevap dönmezsen MSW varsayılan (sahte Open Library) handler’ına düşer
        if (failing) return HttpResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
      }),
    )
    const { user } = renderApp('/search?q=dune')
    expect(await screen.findByRole('alert', {}, { timeout: 4000 })).toBeInTheDocument()
    failing = false
    await user.click(screen.getByRole('button', { name: 'Tekrar dene' }))
    expect(await screen.findByText(/Chapterhouse Dune/)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  }, 10_000)
})
