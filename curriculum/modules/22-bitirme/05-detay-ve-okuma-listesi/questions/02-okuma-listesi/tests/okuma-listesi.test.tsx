import { screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { openApp, readingListLink, waitForWork } from './render-app'

const KEY = 'kitaplik:reading-list'

beforeEach(() => {
  localStorage.clear()
})

type User = Awaited<ReturnType<typeof openApp>>['user']

/** Detay sayfasındaki formla kitabı listeye ekler */
async function addFromDetails(
  user: User,
  { status, rating, note }: { status: string; rating?: string; note?: string },
) {
  await user.selectOptions(screen.getByLabelText('Durum'), status)
  if (rating) await user.selectOptions(screen.getByLabelText('Puan'), rating)
  if (note) {
    await user.click(screen.getByLabelText('Not'))
    await user.paste(note)
  }
  await user.click(screen.getByRole('button', { name: 'Listeye ekle' }))
}

describe('Detay sayfasındaki okuma listesi formu', () => {
  it('"Durum" (varsayılan "Okumak istiyorum"), "Not" ve "Listeye ekle" var; "Puan" gizli', async () => {
    await openApp('/works/OL893414W')
    await waitForWork('Dune')
    expect(screen.getByLabelText('Durum')).toHaveDisplayValue('Okumak istiyorum')
    expect(screen.getByLabelText('Not')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Listeye ekle' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Puan')).not.toBeInTheDocument()
  })

  it('durum seçenekleri: Okumak istiyorum, Okuyorum, Okudum; "Puan" sadece "Okudum"da görünür', async () => {
    const { user } = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    const options = within(screen.getByLabelText('Durum')).getAllByRole('option')
    expect(options.map((o) => o.textContent)).toEqual(['Okumak istiyorum', 'Okuyorum', 'Okudum'])
    await user.selectOptions(screen.getByLabelText('Durum'), 'Okudum')
    expect(screen.getByLabelText('Puan')).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Durum'), 'Okuyorum')
    expect(screen.queryByLabelText('Puan')).not.toBeInTheDocument()
  })

  it('"Okudum" seçip puan vermeden gönderince hata gösterir ve listeye eklemez', async () => {
    const { user } = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    await addFromDetails(user, { status: 'Okudum' })
    expect(await screen.findByText('Okuduğun kitaba 1–5 arası puan ver.')).toBeInTheDocument()
    expect(readingListLink(0)).toBeInTheDocument()
  })

  it('280 karakterden uzun notu reddeder', async () => {
    const { user } = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    await addFromDetails(user, { status: 'Okuyorum', note: 'a'.repeat(281) })
    expect(await screen.findByText('Not en fazla 280 karakter olabilir.')).toBeInTheDocument()
    expect(readingListLink(0)).toBeInTheDocument()
  })

  it('geçerli form kitabı listeye ekler: menüde "Okuma listem (1)" görünür', async () => {
    const { user } = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    expect(readingListLink(0)).toBeInTheDocument()
    await addFromDetails(user, { status: 'Okudum', rating: '5' })
    expect(await screen.findByRole('link', { name: /okuma listem\s*\(1\)/i })).toBeInTheDocument()
  })

  it('listedeki kitabın formu kayıtlı değerlerle gelir; buton "Güncelle" olur ve sayı artmaz', async () => {
    const { user, router } = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    await addFromDetails(user, { status: 'Okuyorum', note: 'Çöl gezegeni' })
    await router.navigate('/reading-list')
    await router.navigate('/works/OL893414W')
    await waitForWork('Dune')
    expect(screen.getByLabelText('Durum')).toHaveDisplayValue('Okuyorum')
    expect(screen.getByLabelText('Not')).toHaveValue('Çöl gezegeni')

    await user.selectOptions(screen.getByLabelText('Durum'), 'Okudum')
    await user.selectOptions(screen.getByLabelText('Puan'), '4')
    await user.click(screen.getByRole('button', { name: 'Güncelle' }))
    expect(readingListLink(1)).toBeInTheDocument()
    await router.navigate('/reading-list?status=read')
    const link = await screen.findByRole('link', { name: 'Dune' })
    expect(within(link.closest('li')!).getByText(/Puan: 4\/5/)).toBeInTheDocument()
  })
})

describe('Okuma listem sayfası (/reading-list)', () => {
  it('h1 "Okuma listem"; liste boşken "Okuma listen boş" der', async () => {
    await openApp('/reading-list')
    expect(screen.getByRole('heading', { level: 1, name: 'Okuma listem' })).toBeInTheDocument()
    expect(screen.getByText(/okuma listen boş/i)).toBeInTheDocument()
  })

  it('eklenen kitabı detay linki, durum, puan ("Puan: 5/5") ve notla listeler', async () => {
    const { user, router } = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    await addFromDetails(user, { status: 'Okudum', rating: '5', note: 'Baharat akmalı.' })
    await router.navigate('/reading-list')
    const link = await screen.findByRole('link', { name: 'Dune' })
    expect(link).toHaveAttribute('href', '/works/OL893414W')
    const item = link.closest('li')!
    expect(within(item).getByText(/Okudum/)).toBeInTheDocument()
    expect(within(item).getByText(/Puan: 5\/5/)).toBeInTheDocument()
    expect(within(item).getByText('Baharat akmalı.')).toBeInTheDocument()
  })

  it('?status=read yalnızca okunanları, ?status=want yalnızca okunacakları gösterir', async () => {
    const { user, router } = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    await addFromDetails(user, { status: 'Okudum', rating: '5' })
    await router.navigate('/works/OL24252290W')
    await waitForWork('Suç ve Ceza')
    await addFromDetails(user, { status: 'Okumak istiyorum' })

    await router.navigate('/reading-list?status=read')
    expect(await screen.findByRole('link', { name: 'Dune' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Suç ve Ceza' })).not.toBeInTheDocument()

    await router.navigate('/reading-list?status=want')
    expect(await screen.findByRole('link', { name: 'Suç ve Ceza' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Dune' })).not.toBeInTheDocument()
  })

  it('"Dune kitabını listeden çıkar" butonu kitabı çıkarır, menü sayısı azalır', async () => {
    const { user, router } = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    await addFromDetails(user, { status: 'Okuyorum' })
    await router.navigate('/reading-list')
    await user.click(await screen.findByRole('button', { name: 'Dune kitabını listeden çıkar' }))
    expect(screen.queryByRole('link', { name: 'Dune' })).not.toBeInTheDocument()
    expect(readingListLink(0)).toBeInTheDocument()
  })
})

describe('Kalıcılık (localStorage)', () => {
  it('liste "kitaplik:reading-list" anahtarına yazılır', async () => {
    const { user } = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    await addFromDetails(user, { status: 'Okuyorum' })
    await waitFor(() => expect(localStorage.getItem(KEY)).toContain('OL893414W'))
  })

  it('uygulama sıfırdan yüklenince (sayfa yenilenmiş gibi) liste geri gelir', async () => {
    const first = await openApp('/works/OL893414W')
    await waitForWork('Dune')
    await addFromDetails(first.user, { status: 'Okuyorum' })
    await waitFor(() => expect(localStorage.getItem(KEY)).toContain('OL893414W'))
    first.unmount()

    await openApp('/reading-list')
    expect(await screen.findByRole('link', { name: 'Dune' })).toBeInTheDocument()
    expect(readingListLink(1)).toBeInTheDocument()
  })

  it.each([
    ['bozuk JSON', '{bozuk'],
    ['yanlış biçimli kayıt', '[{"kitap":"Dune"}]'],
    ['dizi olmayan değer', '"merhaba"'],
  ])('kayıtlı veri %s ise uygulama çökmez, liste boş başlar', async (_, raw) => {
    localStorage.setItem(KEY, raw)
    await openApp('/reading-list')
    expect(screen.getByRole('heading', { level: 1, name: 'Okuma listem' })).toBeInTheDocument()
    expect(screen.getByText(/okuma listen boş/i)).toBeInTheDocument()
    expect(readingListLink(0)).toBeInTheDocument()
  })
})
