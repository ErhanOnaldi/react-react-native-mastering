---
title: "Bir teste özel API senaryosu"
minutes: 8
kind: concept
---

# Bir teste özel API senaryosu

:::pain[Problem]
Normal TMDB cevabıyla arama hep yeşil. Sunucu 500 döndürdüğünde hata mesajı kayboluyor; boş listede eski filmler kalıyor.
:::

## İhtiyaç ve çözüm

`server.use(http.get(url, () => HttpResponse.json(body, { status: 500 })))` bir testte varsayılan handler’ın önüne geçer. Ortak setup `afterEach` içinde `server.resetHandlers()` çağırır. Boş liste TMDB biçimini korur: `page`, `results`, `total_pages`, `total_results`.

Yavaş yanıt için handler’da `await delay(150)` kullan. Önce loading’i, sonra sonucu doğrula. Yetki başlığını `request.headers.get("Authorization")` ile kontrol et.

## Üç senaryo, aynı bileşen

Başarılı arama zaten varsayılan fake TMDB’den gelir. Şimdi aynı SearchPage’i değiştirmeden HTTP sınırındaki yanıtı değiştir:

```ts title="SearchPage.test.tsx"
server.use(http.get(`${TMDB_BASE}/search/movie`, () =>
  HttpResponse.json({ status_message: 'Geçici hata' }, { status: 500 }),
))
```

Bileşenin `response.ok` kontrolü varsa alert görünür. Boş sonuç için yalnız `results: []` vermek yerine tam TMDB liste biçimini kullan: `page`, `results`, `total_pages`, `total_results`. Böylece test, üretimde olmayan eksik bir cevapla yanlış güven vermez.

Gecikmeyi handler içinde `await delay(150)` ile kurarsın. Önce loading’i hemen sorgula; sonra `findByRole` ile sonucu bekle. `delay` yalnız test senaryosunun ağ süresini değiştirir, uygulama kodunu değil. `requests()` günlüğü query ve Authorization denetimi için yararlıdır; fakat yalnız istek sayısını sınamak kullanıcıya hata metninin gösterildiğini kanıtlamaz.

:::mistake
`server.use` override’ı testler arasında bırakılırsa test sırası sonucu etkiler. Ortak setup her `afterEach` içinde `server.resetHandlers()` çağırdığı için burada override yalnız kurulduğu testte yaşar.
:::

:::sector[Sektörde]
Sunucu hatası ve boş yanıtı ayrı testlemek, başarı yolunda görünmeyen kullanıcı mesajlarını korur.
:::
