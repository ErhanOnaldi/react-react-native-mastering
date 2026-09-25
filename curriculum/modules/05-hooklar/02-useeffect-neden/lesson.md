---
title: Render neden istek yeri değil?
minutes: 9
kind: concept
---

# Render neden istek yeri değil?

:::pain[Problem]
Film kartı `/movie/550` için veriyi render sırasında çekiyor. Her cevap `setState` ile yeni render başlatıyor; önizlemedeki istek sayacı 100’de “Sonsuz istek döngüsü” diye duruyor.
:::

## Ne değişiyor?

Render saf olmalı: aynı props ve state ile aynı ekranı hesaplar. Ağ isteği dış sistemle senkronizasyondur; `useEffect` render tamamlandıktan sonra çalışır.

## Sinema'da dene

`useEffect(() => { ... }, [])` mount sonrası çalışır. Geliştirme `StrictMode` içinde setup ve cleanup yeniden denenebilir; gerçek bir isteğin her koşulda yalnızca bir kez olacağını varsayma. Bu ilk örneğin önizlemesi StrictMode sarmalı kullanmaz.

## Döngüyü gözünle gör

```tsx title="MovieTitle.tsx"
// Kasıtlı hata: render sırasında dış etki!
fetch(`https://api.themoviedb.org/3/movie/${id}`, {
  headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` }
}).then(r => r.json()).then(setMovie)
return <h1>{movie?.title ?? 'Yükleniyor'}</h1>
```

İlk render istek atar. Cevap `setMovie` çağırır. Yeni render tekrar istek atar. Önizleme 100 istekte güvenlik için durur. Testin `Beklenen: 1 istek` mesajı, yalnızca doğru başlığın görünmesinin yeterli olmadığını gösterir. Gerçek uygulamada aynı döngü ağ ve bellek yükünü artırır.

İsteği `useEffect` içine taşı. Effect render commit edildikten sonra dış sistemle eşleşir. İlk denemede yalnızca 550 filmi gösterdiğimiz için akış şöyledir:

```tsx title="MovieTitle.tsx"
const [movie, setMovie] = useState<{ title: string } | null>(null)
useEffect(() => {
  fetch('https://api.themoviedb.org/3/movie/550', {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` }
  }).then(response => response.json())
    .then((data: { title: string }) => setMovie(data))
}, [])
return <h1>{movie?.title ?? 'Yükleniyor'}</h1>
```

İstek bitince `setMovie` yine render başlatır; bu kez yeni render **yeniden fetch çağırmaz**. `useState` ekranı günceller, effect dış sistemi okur. Bu ayrımı “bir kez istek at” kuralından daha iyi hatırla: effect bir senkronizasyon kurar. Bir sonraki derste aynı bileşenin film kimliği değişebilecek ve bu ilk çözüm yetersiz kalacak.

`[]`, bu ilk sabit örnekte mount sonrası çalışması anlamına gelir. İkinci kod sorusunda tek film yerine `/movie/popular` liste cevabının `results` alanını açarsın; aynı ilke farklı cevap biçiminde uygulanır.

:::mistake[Sık hata]
`fetch` çağrısını bir helper fonksiyona taşıyıp helper’ı render’da çağırmak döngüyü çözmez. Sorun kodun yeri ve yaşam döngüsüdür.
:::

:::sector
İstek sayısı testinin amacı gereksiz render isteğini yakalamaktır. Sonraki derste `id` değişirse `[]` artık yeterli gelmeyecek.
:::
