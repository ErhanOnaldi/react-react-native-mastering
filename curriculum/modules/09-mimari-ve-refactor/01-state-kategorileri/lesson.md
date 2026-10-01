---
title: "State'in sahibini bul"
minutes: 17
kind: concept
---

# State'in sahibini bul

Bir film listesini ve favori yıldızlarını ekranda göstermek için ikisini de bir değişkende tutabilirsin. Ama bu iki bilgi aynı yerden gelmez: film listesini TMDB gönderir, yıldızı ise kullanıcı seçer. Bilginin **owner'ı (sahibi)**, onu belirleyen ve değiştiğinde doğru değeri sağlayan yerdir. Owner'ı seçmek önemlidir; çünkü ekranı yenileme, URL'yi paylaşma ve hata gösterme davranışı bu karara bağlıdır.

## Önce iki farklı değere bakalım

İlk örnekte film listesinin nereden geldiği bellidir:

```tsx
type Movie = { id: number; title: string }

function MovieResults({ movies }: { movies: Movie[] }) {
  return <p>{movies.length} film</p>
}
```

Bu component aldığı filmleri gösterir. Liste TMDB cevabından geliyorsa kaynağı sunucudur. React bu listeyi ekrana taşır ama bu yüzden listenin sahibi React olmaz. Cevabın henüz gelmemesi, hata vermesi veya boş gelmesi de aynı sunucu verisini alırken yaşanan farklı durumlardır.

Şimdi kullanıcı bir filme yıldız versin:

```tsx
type Movie = { id: number; title: string }

function FavoriteButton({ movie }: { movie: Movie }) {
  const [isFavorite, setIsFavorite] = useState(false)
  return <button>{isFavorite ? '★' : '☆'} {movie.title}</button>
}
```

Burada değişen `isFavorite` kullanıcının bu ekrandaki seçimi. `useState` bu küçük örnek için yeterli olabilir; uygulama yenilemeden sonra da yıldızı hatırlayacaksa değeri ayrıca saklamak gerekir. Saklama yöntemi owner'ı değiştirmez: favori TMDB'nin verdiği film alanı değil, kullanıcının tercihi olmaya devam eder.

Üçüncü örnekte, seçimin paylaşılmasını istiyoruz. Arama formuna yazılan her harf taslaktır; Enter'a basılmış sorgu ise sayfanın uygulanmış seçimidir. `URL state`, URL'de tutulan ve bağlantıyla paylaşılabilen sayfa seçimidir:

```tsx check
import { useState } from 'react'
import { useSearchParams } from 'react-router'

export function SearchControls() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const [draft, setDraft] = useState(query)

  function submit() {
    const next = new URLSearchParams(params)
    next.set('q', draft)
    next.set('page', '1')
    setParams(next)
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); submit() }}>
      <label>Film ara <input value={draft} onChange={(event) => setDraft(event.target.value)} /></label>
      <p>Uygulanan arama: {query}</p>
      <button type="submit">Ara</button>
    </form>
  )
}
```

`draft` değiştikçe yalnız input güncellenir. Gönderince `q` URL'ye yazılır ve sayfa 1'e alınır; böylece yeni sorgu eski sorgunun ikinci sayfasında başlamaz. Sonuç listesini de bu component'te ayrı state'e kopyalarsan URL seçimiyle listenin hangi sorguya ait olduğunu ayrıca eşitlemen gerekir. İsteği başlatan veri katmanı URL'deki sorguyu kullanabilir.

![Server, client, URL ve form state'in sahibini gösteren karar haritası](diagram:state-kategorileri)

## Matrix aramasını adım adım izle

Şu adresle açıldığını düşün: `?q=Matrix&page=2`. Kullanıcı arama alanına `Dövüş` yazıp henüz göndermemiş olsun.

| An | URL seçimi | Form taslağı | Sunucu verisi | Kullanıcı tercihi |
| --- | --- | --- | --- | --- |
| Sayfa açılır | `q=Matrix`, `page=2` | `Matrix` | Henüz istek yok | Favoriler cihazdan okunur |
| İstek sürer | Aynı seçim | Kullanıcı yazarsa değişebilir | Yükleniyor | Değişmez |
| Kullanıcı `Dövüş` yazar | Aynı seçim | `Dövüş` | Matrix'in 2. sayfası | Değişmez |
| Kullanıcı gönderir | `q=Dövüş`, `page=1` | `Dövüş` | Yeni seçim için istek | Değişmez |
| Cevap gelir | Aynı seçim | `Dövüş` | Yeni film listesi veya hata | Değişmez |

Tabloda `Dövüş` taslağı ile URL'deki `Matrix` bir süre farklıdır; bu hata değildir. Taslak henüz uygulanmadı. Gönderim, bu iki değerin eşitlendiği açık andır. URL yenileme ve geri/ileri gezinme ile kurulabilir; taslak ise genellikle formun geçici parçasıdır. Favori cihazda saklanabilir, film listesi de tekrar istenebilir. Her değerin yenileme sonrası aynı kalması beklenmez.

Yenileme iyi bir düşünme aracıdır: uygulama kapanıp açıldığında bu bilgi nereden geri kurulmalı? `q` ve `page` adres çubuğundaysa bağlantı bunları taşır. Film verisi TMDB'den yeniden istenir. Favoriler ancak ürün bu cihazda saklamayı seçtiyse geri gelir. Gönderilmemiş yorum çoğunlukla kalmaz. “Kalıcı mı?” tek başına kategori seçtirmez; URL gezinmeyle geri alınan seçimi, favori cihaz tercihini, yorum da form taslağını anlatır.

## Formdaki küçük durumlar da formun ömrünü izler

Bir yorum kutusunda kullanıcı "Harika" yazsın, ama henüz göndermesin. Bu metin form state'tir: gönderime kadar input, hata mesajı ve submit bekleyişiyle birlikte yaşar. `touched`, kullanıcının bir alanla etkileşime girdiğini (çoğunlukla alandan çıkınca) belirten işarettir; hata mesajını ilk tuşta değil, alanı gördükten sonra göstermek için kullanılabilir.

Sayfa yenilendiğinde gönderilmemiş yorum kaybolabilir; ürün özellikle taslak saklamıyorsa bu normaldir. Aynı yenilemede favorinin kalması istenebilir, çünkü ürün onu bu cihazdaki tercih olarak saklamıştır. İki değeri yalnızca “ikisi de kullanıcı yazdı” diye aynı kategoriye koyma: yorum bir gönderim akışına, favori ise daha uzun yaşayan tercihe aittir.

## Aynı değeri iki yerde tutunca ne olur?

Şu tasarımda sonuçlar `initialMovies` prop'undan alınıp tekrar React state'ine kopyalanıyor:

```tsx
import { useEffect, useState } from 'react'

type Movie = { id: number; title: string }

function SearchResults({ initialMovies }: { initialMovies: Movie[] }) {
  const [movies, setMovies] = useState(initialMovies)

  useEffect(() => {
    setMovies(initialMovies)
  }, [initialMovies])

  return <p>{movies.length} sonuç</p>
}
```

İlk anda prop ile state aynı listeyi gösterir. Sonra prop değişince effect çalışana kadar state eski liste olabilir; ayrıca iki yerin hep eşit kalması için yeni kural yazmış olduk. Bu kopyayı değiştirmek için ayrı bir kullanıcı düzenleme ihtiyacı yoksa `initialMovies`'ı doğrudan göster. Kopya ancak iki değerin farklı olmasının anlamı varsa yararlıdır; örneğin input taslağı ile son gönderilmiş sorgu.

Bir `Movie` değerini hangi sınıfa koyacağına karar verirken önce kaynağı ve ömrü düşün. **Server state**, dış servisten gelen veri ile isteğin yükleniyor, başarılı veya hatalı olma halidir. **Client state**, bu cihazdaki kullanıcı tercihidir. **URL state**, paylaşılabilir sayfa seçimidir. **Form state**, gönderim bekleyen alan ve etkileşim bilgisidir. Bunlar React API'si değil, sahiplik kararlarıdır; `useState`, URL parametreleri veya veri katmanı o karara göre seçilen araçlardır.

Örneğin favori id'leri client state, favori kartındaki filmin başlığı ise TMDB'den geliyorsa server state olabilir. Aynı kartta görünmeleri aynı owner'a sahip oldukları anlamına gelmez. İki değeri kopyalıyorsan “biri değişince diğeri ne zaman güncellenecek, hata olursa hangisine güveneceğim, sıfırlama ne zaman olacak?” sorularını yanıtla. Net bir yanıt yoksa gereksiz kopya iki farklı doğru görüntü üretmeye başlayabilir.

:::mistake[Belirti: arama alanında Dövüş yazıyor ama sonuçlar Matrix]
**Belirti →** Input'taki metin ile ekrandaki sonuçlar uyuşmuyor. **Neden →** Taslağın değişmesi uygulanmış sorguyu değiştirmez; Enter henüz basılmamıştır. **Düzeltme →** Taslak ve uygulanmış seçimi ayrı düşün. Ürün yazarken arama istiyorsa her değişimde uygula; gönder düğmesi varsa URL'yi gönderimde güncelle.
:::

:::mistake[Belirti: yenilemede adres ikinci sayfayı söylüyor ama ilk sayfa geliyor]
**Belirti →** URL'de `page=2` görünür, ekrandaki sonuçlar 1. sayfaya aittir. **Neden →** Sayfa numarası hem URL'de hem bağımsız component state'inde tutulup farklı değer almıştır. **Düzeltme →** Paylaşılabilir sayfa seçimini URL'den oku ve isteği aynı seçimle başlat.
:::

:::mistake[Belirti: sunucu hatası “sonuç yok” diye gösteriliyor]
**Belirti →** TMDB yanıt vermediğinde boş liste görünür. **Neden →** Boş başarı cevabı ile hata tek `[]` değerine indirgenmiştir. **Düzeltme →** Veri ile isteğin durumunu ayrı göster; boş sonuç ve hata kullanıcıya farklı şey söyler.
:::

## Özet

- State'in owner'ı, değeri belirleyen ve güncelleyen kaynaktır; owner'a göre yenileme ve paylaşma davranışı değişir.
- TMDB listesi server state, cihazdaki yıldız client state, paylaşılabilir arama URL state'tir.
- Gönderilmemiş yorum veya arama metni form state'tir; taslak ile uygulanmış seçim aynı olmak zorunda değildir.
- Bir değeri kopyalamak iki kaynağı eşitleme sorumluluğu yaratır; kopyayı ancak iki ayrı anlam varsa tut.

**Yeni terimler:** `owner` — değeri belirleyen kaynak; `URL state` — URL'de taşınan paylaşılabilir seçim; `touched` — kullanıcının form alanıyla etkileştiğini belirten işaret.

**Kendini yokla:** `?genre=28` adresinde ne bulunmalı: tür seçimi mi, TMDB'nin film listesi mi?  
*Cevap:* Tür seçimi. Film listesi o seçimle sunucudan alınır.

**Kendini yokla:** Kullanıcı yorum yazarken her karakteri URL'ye koymak zorunda mı?  
*Cevap:* Hayır. Gönderilmemiş metin form state'tir; ürün paylaşılmasını istemedikçe URL'ye gerek yoktur.
