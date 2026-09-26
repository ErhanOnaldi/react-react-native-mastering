---
title: "MSW perdesi kalkıyor"
minutes: 9
kind: concept
---

# MSW perdesi kalkıyor

:::pain[Problem]
Şimdiye dek TMDB testlerinin gerçek ağa çıkmadığı halde Dövüş Kulübü döndürdüğünü gördün. Bu cevap nereden geldi?
:::

## Ağ sınırını uygulama dışından değiştir

Mock Service Worker, HTTP isteklerini uygulamanın `fetch` kodunu değiştirmeden yakalayıp kontrollü cevaplar verir. Böylece gerçek URL, header ve cevap ayrıştırma kodu çalışır; yalnız ağın öteki ucundaki davranış test tarafından seçilir. Fonksiyon mock'undan farkı, bütün HTTP akışının daha gerçekçi bir sınırda sınanmasıdır.

Sinema'nın sahte TMDB sonuçları şimdiye kadar görünmez bir test ortamı gibi çalıştı. Vitest'teki `fetch` mock'unu hatırla: orada global fonksiyon değiştirilmişti. Burada aynı ekran koduyla başarı, 401 ve bozuk cevap senaryolarını kurabileceksin.

## İhtiyaç ve çözüm

Gerçek dosyaları oku: `curriculum/test-env/setup.ts`, `server.listen({ onUnhandledRequest: "error" })` açar; testten sonra `cleanup()`, `server.resetHandlers()` ve `clearRequests()` çağırır. `msw/node.ts`, `setupServer(...handlers)` kurar. `server.events.on("request:start", ({ request }) => recordRequest(request))` isteği kaydeder. MSW 2’de callback tek nesne alır; `requestId` de içindedir.

`msw/tmdb.ts` içindeki ilk `http.all` handler’ı `Authorization: Bearer` ya da `api_key` arar; yoksa 401 verir. Sonraki `http.get` handler’ları fixture döndürür. `request-log.ts`, `requests("/3/movie/550")` sayımını yapar. `index.ts` bunları `@test-utils` olarak dışa açar. `movie-550.json` başlığı Dövüş Kulübü’dür. Bu yüzden fetch’i değiştirmeden ağ akışını test edersin.

## Perdenin arkasını dosya dosya izle

Bu dosyalar önceki modüllerde sessizce senin için çalıştı. Şimdi bir `fetch('https://api.themoviedb.org/3/movie/550', { headers: { Authorization: 'Bearer test-token' } })` isteğinin geçtiği yolu izle:

1. `curriculum/test-env/setup.ts` test başlamadan `server.listen({ onUnhandledRequest: 'error' })` çağırır. Tanımlanmayan istek gerçek ağa kaçmaz.
2. `curriculum/test-env/msw/node.ts`, `setupServer(...handlers)` ile Node sunucusunu kurar. Aynı dosyada `request:start` olayı `recordRequest(request)` çağırır. MSW 2 callback’i `{ request, requestId }` **tek nesne** olarak verir; ikinci argüman bekleyen eski örnekleri kopyalama.
3. `curriculum/test-env/msw/handlers.ts`, TMDB handler’larını listeye koyar. `msw/tmdb.ts` önce Bearer ya da `api_key` arar; eksikse `status_code: 7` ile 401 döner. Film handler’ı 550’yi `fixtures/tmdb/movie-550.json` içinden alır. Oradaki `title` **Dövüş Kulübü**; orijinal başlık Fight Club’dır.
4. `curriculum/test-env/request-log.ts` URL’yi `pathname` ve `searchParams` olarak kaydeder. `requests('/3/movie/550')` tam yolu eşleştirir, query string’i içermez.
5. `curriculum/test-env/index.ts` `server`, `requests`, `TMDB_BASE`, `http`, `HttpResponse` ve `delay` öğelerini `@test-utils` olarak sunar.

```ts title="film.test.ts"
const response = await fetch(`${TMDB_BASE}/movie/550`, {
  headers: { Authorization: 'Bearer test-token' },
})
expect((await response.json()).title).toBe('Dövüş Kulübü')
expect(requests('/3/movie/550')).toHaveLength(1)
```

Bu yalnızca sahte veri değildir: uygulamanın gerçek `fetch` kodu, URL’si, header’ı ve yanıt ayrıştırması çalışır. Sınırda HTTP cevabını MSW üretir. Test bittikten sonra `cleanup()`, `resetHandlers()` ve `clearRequests()` yeni teste temiz sayfa açar.

:::mistake
Handler override yazınca varsayılan yetki handler’ının her zaman çalışacağını sanma. `server.use` yeni handler’ı öne koyar; özel handler’da gerekiyorsa Bearer kontrolünü tekrar kur.
:::

:::sector[Sektörde]
MSW aynı HTTP handler fikrini Node testinde ve tarayıcı önizlemesinde kullanır; uygulamanın fetch kodu değişmez.
:::
