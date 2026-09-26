## Neden böyle?

```ts
export function movieTitles(page: Page) {
  return page.getByRole('list', { name: 'Filmler' }).getByRole('heading')
}

export function movieCard(page: Page, title: string) {
  return page.getByRole('listitem').filter({
    has: page.getByRole('heading', { name: title, exact: true }),
  })
}

export function favoriteButton(page: Page, title: string) {
  return movieCard(page, title).getByRole('button', { name: /^Favori/ })
}
```

- **Rol + ad, class değil:** shadcn sürümünde class’ların hiçbiri aynı değil; `li.movie-card .btn-fav` gibi bir seçici ikinci sürümde hiçbir şey bulmaz. Rol ve erişilebilir ad ise kullanıcının gördüğü şeydir; tasarım değişince değişmez.
- **`has` + `exact: true`, `hasText` değil:** `filter({ hasText: 'Matrix' })` parça eşleşir ve “Matrix Reloaded” kartını da alır. Tıklamada “strict mode violation” alırsın; daha kötüsü, `.first()` ile susturursan sıralama değiştiği gün yanlış kartı tıklarsın. Başlığı tam adla eşleştirmek kartı **kimliğiyle** bulur.
- **Zincirleme:** Butonu sayfada değil, kartın içinde ararsın. Yedi kartın yedi “Favorilere ekle” butonu var; kapsamı daraltmak belirsizliği ortadan kaldırır (RTL’deki `within`).
- **Adı değişen buton:** `name: /^Favori/` iki durumu da tutar. Durumu doğrulamak istediğinde `toHaveAttribute('aria-pressed', 'true')` ya da `toHaveText('Favorilerden çıkar')` kullan.
- **Listenin adı:** `aria-label="Filmler"` bir erişilebilirlik iyiliği olarak eklendi (Modül 19); test için de bölgeyi kesin tarif ediyor. Erişilebilir uygulama, test edilebilir uygulamadır.

## Alternatifler

- `page.getByRole('article').filter({ has: … })` da çalışır; burada `listitem` seçtik çünkü listedeki bir öğe olduğu kullanıcı için daha anlamlı.
- Rolü olmayan, adı olmayan bir öğe için son çare `data-testid`’dir. Kart için gerekmiyor.

## Sonraki adım

Bu fonksiyonlar, 4. dersteki **page object**’in ilk hali. Locator’ları bir sınıfta toplayıp eylemleri de (arama yap, filmi aç) oraya taşıyacağız.
