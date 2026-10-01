// Sahte Sinema (salt okunur): bu görevin testlerinin gerçek Chromium'da açtığı küçük uygulama.
// Gerçek Sinema'nın sayfalarını, rollerini ve metinlerini taklit eder; React yerine düz DOM kullanır.
// Locator yazarken rolleri ve etiketleri buradan okuyabilirsin (DevTools'ta "Elements"a bakmak gibi).
import type { BrowserContext } from '@playwright/test'

/** Uygulamanın sunulduğu adres: `playwright.config.ts`'teki `baseURL`'in bu platformdaki karşılığı. */
export const APP_ORIGIN = 'https://sinema.test'

/** Testlerin uygulamayı bilerek bozmak için kullandığı anahtarlar. */
export interface AppOptions {
  /** `<h1>` metni */
  title: string
  /** TMDB isteklerine `Authorization: Bearer …` başlığı eklensin mi? */
  sendToken: boolean
  /** Uygulama açılışta çöksün mü? (eksik env gibi) */
  crash: boolean
  /** Arama kutusunun debounce süresi (ms) */
  debounceMs: number
  /** Arama metni URL'ye (`?q=`) yazılsın mı? */
  writeQueryToUrl: boolean
  /** Hata: yeni aramada eski sonuçlar listede kalır */
  keepStaleResults: boolean
  /** Hata: "Aranıyor…" yazısı hiç kalkmaz */
  stuckLoading: boolean
  /** Modülün acısı: `/login` sayfası korumalı grubun içinde */
  loginInsideProtected: boolean
  /** Kart HTML'i: ilk sürüm ya da shadcn'e geçişten sonraki hali */
  markup: 'v1' | 'shadcn'
}

export const defaultAppOptions: AppOptions = {
  title: 'Sinema',
  sendToken: true,
  crash: false,
  debounceMs: 350,
  writeQueryToUrl: true,
  keepStaleResults: false,
  stuckLoading: false,
  loginInsideProtected: false,
  markup: 'v1',
}

/** Sinema'yı verilen adreste sunar: `webServer`'ın bu platformdaki karşılığı. */
export async function serveSinema(
  context: BrowserContext,
  overrides: Partial<AppOptions> = {},
  origin: string = APP_ORIGIN,
) {
  const options = { ...defaultAppOptions, ...overrides }
  const html = `<!doctype html>
<html lang="tr">
  <head><meta charset="utf-8" /><title>${options.title}</title></head>
  <body>
    <div id="root"></div>
    <script>(${sinemaApp.toString()})(${JSON.stringify(options)})</script>
  </body>
</html>`
  await context.route(`${origin}/**`, (route) =>
    route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }),
  )
}

/** Tarayıcıda çalışan uygulama kodu (sayfaya metin olarak gömülür). */
export function sinemaApp(options: AppOptions): void {
  type Movie = {
    id: number
    title: string
    release_date: string
    vote_average: number
    overview: string
    tagline?: string
    runtime?: number
    credits?: { cast: { name: string; character: string }[] }
  }
  type Auth = { user: { id: number; username: string }; accessToken: string; refreshToken: string }
  type Child = Node | string | null | false

  const TMDB = 'https://api.themoviedb.org/3'
  const AUTH_KEY = 'sinema-auth'
  const LISTS_KEY = 'sinema-watchlists'
  const root = document.getElementById('root') as HTMLElement
  const favorites = new Set<number>()
  let renderId = 0

  if (options.crash) throw new Error('VITE_TMDB_TOKEN gerekli')

  function h(tag: string, attrs: Record<string, string> = {}, ...children: Child[]): HTMLElement {
    const el = document.createElement(tag)
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
    for (const child of children) if (child) el.append(child)
    return el
  }

  async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(TMDB + path)
    url.searchParams.set('language', 'tr-TR')
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
    const headers: Record<string, string> = options.sendToken
      ? { Authorization: 'Bearer e2e-sahte-token' }
      : {}
    const response = await fetch(url, { headers })
    const body = await response.json().catch(() => null)
    if (!response.ok) {
      const error = new Error(body?.status_message ?? `HTTP ${response.status}`)
      throw Object.assign(error, { status: response.status })
    }
    return body as T
  }

  function readAuth(): Auth | null {
    try {
      const saved = localStorage.getItem(AUTH_KEY)
      return saved ? (JSON.parse(saved) as Auth) : null
    } catch {
      return null
    }
  }

  function navigate(to: string, state: unknown = null, replace = false) {
    if (replace) history.replaceState(state, '', to)
    else history.pushState(state, '', to)
    render()
  }

  window.addEventListener('popstate', () => render())
  document.addEventListener('click', (event) => {
    const link = (event.target as Element).closest('a')
    if (!link || link.origin !== location.origin) return
    event.preventDefault()
    navigate(link.pathname + link.search)
  })

  function link(to: string, text: string, attrs: Record<string, string> = {}) {
    return h('a', { href: to, ...attrs }, text)
  }

  function header(auth: Auth | null) {
    const nav = h(
      'nav',
      { 'aria-label': 'Ana menü' },
      link('/', 'Ana sayfa'),
      ' · ',
      link('/search', 'Ara'),
      ' · ',
      link('/watchlists', 'İzleme listelerim'),
    )
    let user: HTMLElement
    if (auth) {
      const logout = h('button', { type: 'button' }, 'Çıkış yap')
      logout.addEventListener('click', () => {
        localStorage.removeItem(AUTH_KEY)
        navigate('/')
      })
      user = h('div', {}, h('span', {}, auth.user.username), ' ', logout)
    } else {
      user = h('div', {}, link('/login', 'Giriş yap'))
    }
    return h('header', {}, h('h1', {}, options.title), h('p', {}, 'Bugün ne izlesek?'), nav, user)
  }

  function year(date: string) {
    return date ? date.slice(0, 4) : 'Tarih yok'
  }

  function movieCard(movie: Movie) {
    const pressed = favorites.has(movie.id)
    const button = h(
      'button',
      { type: 'button', 'aria-pressed': String(pressed) },
      pressed ? 'Favorilerden çıkar' : 'Favorilere ekle',
    )
    button.addEventListener('click', () => {
      if (favorites.has(movie.id)) favorites.delete(movie.id)
      else favorites.add(movie.id)
      const now = favorites.has(movie.id)
      button.textContent = now ? 'Favorilerden çıkar' : 'Favorilere ekle'
      button.setAttribute('aria-pressed', String(now))
    })
    const meta = `${year(movie.release_date)} · ★ ${movie.vote_average.toFixed(1)}`
    const details = link(`/movie/${movie.id}`, 'Detay')
    if (options.markup === 'shadcn') {
      button.className = 'inline-flex items-center rounded-md bg-primary px-3 text-sm'
      button.setAttribute('data-slot', 'button')
      return h(
        'li',
        {},
        h(
          'div',
          { 'data-slot': 'card', class: 'bg-card rounded-xl border shadow-sm' },
          h(
            'article',
            {},
            h(
              'div',
              { 'data-slot': 'card-header' },
              h(
                'h3',
                { 'data-slot': 'card-title', class: 'leading-none font-semibold' },
                movie.title,
              ),
              h('p', { class: 'text-muted-foreground text-sm' }, meta),
            ),
            h('div', { 'data-slot': 'card-footer', class: 'flex gap-2' }, details, button),
          ),
        ),
      )
    }
    button.className = 'btn btn-fav'
    return h(
      'li',
      { class: 'movie-card' },
      h(
        'article',
        { class: 'card' },
        h('h3', { class: 'card-title' }, movie.title),
        h('p', { class: 'card-meta' }, meta),
        button,
        ' ',
        details,
      ),
    )
  }

  function homePage(main: HTMLElement, id: number) {
    main.append(h('h2', {}, 'Bu haftanın trend filmleri'))
    const status = h('p', { role: 'status' }, 'Filmler yükleniyor…')
    main.append(status)
    tmdb<{ results: Movie[] }>('/trending/movie/week').then(
      (data) => {
        if (id !== renderId) return
        status.remove()
        main.append(h('ul', { 'aria-label': 'Filmler' }, ...data.results.map(movieCard)))
      },
      (error: Error) => {
        if (id !== renderId) return
        status.remove()
        main.append(h('p', { role: 'alert' }, `Filmler yüklenemedi: ${error.message}`))
      },
    )
  }

  function searchPage(main: HTMLElement, id: number) {
    const input = h('input', { id: 'search-input', type: 'search' }) as HTMLInputElement
    input.value = new URLSearchParams(location.search).get('q') ?? ''
    const output = h('div')
    main.append(
      h('h2', {}, 'Film ara'),
      h('label', { for: 'search-input' }, 'Film ara'),
      ' ',
      input,
      output,
    )
    let timer = 0
    let seq = 0
    let shown: Movie[] = []

    function idle() {
      output.replaceChildren(h('p', { role: 'status' }, 'Aramak için bir film adı yaz.'))
    }

    function run(query: string) {
      const mine = ++seq
      const loading = h('p', { role: 'status' }, 'Aranıyor…')
      const stale = options.keepStaleResults ? [...output.querySelectorAll('section')] : []
      output.replaceChildren(...stale, loading)
      tmdb<{ results: Movie[] }>('/search/movie', { query }).then(
        (data) => {
          if (id !== renderId || mine !== seq) return
          shown = options.keepStaleResults ? [...shown, ...data.results] : data.results
          const items = shown.map((movie) =>
            h('li', {}, link(`/movie/${movie.id}`, movie.title), ` (${year(movie.release_date)})`),
          )
          const section = h(
            'section',
            { 'aria-label': 'Arama sonuçları' },
            h('h3', {}, `“${query}” için ${shown.length} sonuç`),
            items.length ? h('ul', {}, ...items) : h('p', {}, 'Sonuç bulunamadı.'),
          )
          output.replaceChildren(...(options.stuckLoading ? [loading] : []), section)
        },
        (error: Error) => {
          if (id !== renderId || mine !== seq) return
          output.replaceChildren(h('p', { role: 'alert' }, `Arama başarısız: ${error.message}`))
        },
      )
    }

    input.addEventListener('input', () => {
      const text = input.value
      if (options.writeQueryToUrl) {
        const search = text ? `?${new URLSearchParams({ q: text })}` : ''
        history.replaceState(null, '', `/search${search}`)
      }
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (text.trim()) run(text.trim())
        else idle()
      }, options.debounceMs)
    })

    if (input.value.trim()) run(input.value.trim())
    else idle()
  }

  function detailsPage(main: HTMLElement, id: number, movieId: string) {
    const status = h('p', { role: 'status' }, 'Film yükleniyor…')
    main.append(status)
    tmdb<Movie>(`/movie/${movieId}`, { append_to_response: 'credits' }).then(
      (movie) => {
        if (id !== renderId) return
        const cast = movie.credits?.cast ?? []
        status.replaceWith(
          h(
            'article',
            {},
            h('h2', {}, movie.title),
            movie.tagline ? h('p', {}, h('em', {}, movie.tagline)) : null,
            h('p', {}, movie.overview || 'Özet yok.'),
            h('p', {}, `Puan: ${movie.vote_average.toFixed(1)}`),
            movie.runtime ? h('p', {}, `Süre: ${movie.runtime} dk`) : null,
            h('h3', {}, 'Oyuncular'),
            h('ul', {}, ...cast.map((c) => h('li', {}, `${c.name} — ${c.character}`))),
          ),
        )
      },
      (error: Error & { status?: number }) => {
        if (id !== renderId) return
        const text =
          error.status === 404 ? 'Film bulunamadı.' : `Film yüklenemedi: ${error.message}`
        status.replaceWith(h('p', { role: 'alert' }, text))
      },
    )
  }

  function loginPage(main: HTMLElement) {
    const username = h('input', { name: 'username', autocomplete: 'username' }) as HTMLInputElement
    const password = h('input', {
      name: 'password',
      type: 'password',
      autocomplete: 'current-password',
    }) as HTMLInputElement
    const submit = h('button', { type: 'submit' }, 'Giriş yap') as HTMLButtonElement
    const message = h('div')
    const form = h(
      'form',
      {},
      h('label', {}, 'Kullanıcı adı ', username),
      h('label', {}, ' Parola ', password),
      ' ',
      submit,
      message,
    )
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      submit.disabled = true
      message.replaceChildren()
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value }),
      })
      const body = await response.json().catch(() => null)
      submit.disabled = false
      if (!response.ok) {
        message.replaceChildren(h('p', { role: 'alert' }, body?.message ?? 'Giriş başarısız.'))
        return
      }
      const auth: Auth = {
        user: { id: body.id, username: body.username },
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
      const from = (history.state as { from?: unknown } | null)?.from
      navigate(typeof from === 'string' ? from : '/profile', null, true)
    })
    main.append(h('h2', {}, 'Giriş yap'), form)
  }

  function watchlistsPage(main: HTMLElement) {
    const lists = JSON.parse(localStorage.getItem(LISTS_KEY) ?? '[]') as string[]
    const input = h('input', { id: 'watchlist-name' }) as HTMLInputElement
    const message = h('div')
    const saved = h('section', { 'aria-label': 'Kayıtlı listeler' })
    function drawLists() {
      saved.replaceChildren(
        lists.length
          ? h('ul', {}, ...lists.map((name) => h('li', {}, name)))
          : h('p', {}, 'Henüz izleme listen yok.'),
      )
    }
    const form = h(
      'form',
      { 'aria-label': 'Yeni liste' },
      h('label', { for: 'watchlist-name' }, 'Liste adı'),
      ' ',
      input,
      ' ',
      h('button', { type: 'submit' }, 'Kaydet'),
      message,
    )
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const name = input.value.trim()
      if (!name) {
        message.replaceChildren(h('p', { role: 'alert' }, 'Liste adı gerekli.'))
        return
      }
      lists.push(name)
      localStorage.setItem(LISTS_KEY, JSON.stringify(lists))
      input.value = ''
      message.replaceChildren(h('p', { role: 'status' }, 'Liste kaydedildi'))
      drawLists()
    })
    drawLists()
    main.append(h('h2', {}, 'İzleme listelerim'), form, saved)
  }

  function render() {
    const id = ++renderId
    const auth = readAuth()
    const main = h('main')
    root.replaceChildren(header(auth), main)
    const path = location.pathname
    const guarded =
      path === '/watchlists' ||
      path === '/profile' ||
      (options.loginInsideProtected && path === '/login')
    if (guarded && !auth) {
      // Korumalı sayfa: girişe yönlendir, dönüş adresini history.state'te taşı.
      // login de korumalıysa kendi kendine yönlenir ve sayfa boş kalır (modülün acısı).
      if (path !== '/login') navigate('/login', { from: path + location.search }, true)
      return
    }
    const movie = /^\/movie\/(\d+)$/.exec(path)
    if (path === '/') homePage(main, id)
    else if (path === '/search') searchPage(main, id)
    else if (movie) detailsPage(main, id, movie[1] as string)
    else if (path === '/login') loginPage(main)
    else if (path === '/watchlists') watchlistsPage(main)
    else if (path === '/profile' && auth)
      main.append(h('h2', {}, 'Profil'), h('p', {}, `Hoş geldin, ${auth.user.username}`))
    else main.append(h('h2', {}, 'Sayfa bulunamadı'))
  }

  render()
}
