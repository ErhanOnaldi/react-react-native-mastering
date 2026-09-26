---
title: Eski cevap yeniyi ezmesin
minutes: 9
kind: concept
---

# Eski cevap yeniyi ezmesin

:::pain[Problem]
“Baş” yazıp hemen “Dövüş” yazdın. İlk arama daha yavaş dönünce yeni sonuçları eski sonuçlarla değiştirebiliyor.
:::

## Eski işin sonucu artık geçerli mi?

Asenkron istekler başlatıldıkları sırayla bitmek zorunda değildir. Yeni parametreyle ikinci istek başlamışken eski istek sonradan dönebilir. Cleanup, önceki effect çalışmasının artık ekrana yazma hakkı olmadığını belirtir; `AbortController` desteklenen fetch'i ayrıca iptal edebilir. İki mekanizma aynı amaca farklı yönlerden hizmet eder.

Dependency array yeni Sinema aramasını başlatır, fakat eskisinin Promise'ini kendiliğinden durdurmaz. Bu yüzden ilk arama sonucunun ikinciyi ezmesi mümkündür. Aynı yaşam döngüsü timer ve aboneliklerde de geçerlidir; ileride Query bu yarışların bir kısmını sorgu kimliğiyle yönetir.

## Ne değişiyor?

Her effect çalışması ayrı bir istektir. Cleanup içindeki `ignore = true`, eski isteğin sonucunun state’e yazılmasını önler.

## Sinema'da dene

`AbortController` önceki fetch’i ayrıca iptal eder; `fetch(url, { signal: controller.signal })` ve cleanup’ta `controller.abort()` kullan. `AbortError` kullanıcı hatası değildir.

## İki sorgunun zaman çizgisi

| An | İstek | Cevap |
| --- | --- | --- |
| 0 ms | “Baş” başladı | yavaş |
| 15 ms | “Dövüş” başladı | hızlı |
| 25 ms | — | “Dövüş” ekrana yazıldı |
| 90 ms | — | “Baş” eski sonucu geri getirdi |

Dependency array yeni isteği başlatır ama eski isteğin Promise’ini otomatik susturmaz. İlk çözüm, her effect çalışmasının kendi `ignore` bayrağını taşımasıdır:

```ts
let ignore = false
// cevap gelince: if (!ignore) setResults(data)
return () => { ignore = true }
```

İkinci adım `AbortController`: `fetch(url, { signal: controller.signal })`, cleanup’ta `controller.abort()`.

```tsx title="MovieDetails.tsx"
useEffect(() => {
  const controller = new AbortController()
  fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    signal: controller.signal,
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` }
  }).then(response => response.json()).then(setMovie)
    .catch(error => {
      if (error.name !== 'AbortError') setError(error.message)
    })
  return () => controller.abort()
}, [id])
```

`id` değiştiğinde önceki effect’in cleanup’ı eski controller’ı iptal eder. Yeni effect kendi controller’ıyla başlar. Bileşen ekrandan kalkarsa son controller da iptal edilir. `ignore` daha az yetenekli ama anlaşılır ilk çözüm; abort ayrıca gereksiz işi keser.

İptal nedeniyle oluşan `AbortError` kullanıcıya “ağ bozuldu” diye gösterilmez. İki görev farklı şeyi sınar: önce eski cevabın yazma hakkını, sonra isteğin gerçekten iptalini.

:::mistake[Sık hata]
Tek bir controller’ı bütün render’lar arasında paylaştırma. Her effect çalışmasının kendi isteği ve kendi controller’ı olmalı.
:::

:::sector
Cleanup, dependency değiştiğinde önceki effect için ve unmount sırasında çalışır. Ağ dışındaki timer ve aboneliklerde de aynı yaşam döngüsünü kullanacaksın.
:::
