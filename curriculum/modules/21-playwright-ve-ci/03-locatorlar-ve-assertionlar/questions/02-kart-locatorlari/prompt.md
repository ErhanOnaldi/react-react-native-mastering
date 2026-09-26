## Bağlam

Sinema’nın ana sayfasındaki film kartlarını testlerde tekrar tekrar bulacağız: kartın metnini kontrol etmek, favoriye eklemek, detaya gitmek. Kart bulmayı üç küçük fonksiyonda toplayalım; ama bu sefer **tasarım değişikliğine dayanıklı** olsunlar.

Testler aynı sayfayı iki farklı HTML ile açıyor:

| Sürüm | Kart HTML’i |
| --- | --- |
| İlk sürüm | `<li class="movie-card"><article class="card"><h3 class="card-title">…</h3> … <button class="btn btn-fav">` |
| shadcn sürümü | `<li><div data-slot="card"><article><div data-slot="card-header"><h3 data-slot="card-title">…</h3>…</div><div data-slot="card-footer"><a>Detay</a> <button data-slot="button">` |

Class’lar, sarmalayıcı `div`’ler ve buton/link sırası değişiyor. Değişmeyenler: liste `aria-label="Filmler"`, her kart bir `listitem`, başlık bir `h3`, favori butonunun adı.

## Görev

`locators.ts`’teki üç fonksiyon bir **Locator** döndürsün (hiçbiri `await` etmez, tıklamaz):

| Fonksiyon | Neyi bulur? |
| --- | --- |
| `movieTitles(page)` | Yalnızca film listesindeki kart başlıkları, sırayla (sayfadaki h1/h2 değil) |
| `movieCard(page, title)` | Başlığı **tam olarak** `title` olan kart. `'Matrix'` → yalnızca “Matrix”, “Matrix Reloaded” değil |
| `favoriteButton(page, title)` | O kartın favori butonu. Adı tıklayınca “Favorilere ekle” ↔ “Favorilerden çıkar” diye değişir; ikisinde de bulunmalı |

## Örnek

```ts
await expect(movieTitles(page)).toHaveText(['Dövüş Kulübü', 'Başlangıç', /* … */])
await expect(movieCard(page, 'Matrix')).toHaveCount(1)
await favoriteButton(page, 'Matrix Reloaded').click() // yalnızca o kartın butonu
```

Birden çok öğeye uyan bir locator’la tıklarsan Playwright “strict mode violation” hatası verir; test mesajlarında bunu görürsen locator’ın yeterince kesin değil demektir. Sayfanın HTML’ini `sinema-app.ts`’teki `movieCard` fonksiyonunda görebilirsin.
