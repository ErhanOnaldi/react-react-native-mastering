---
title: "State'in sahibini bul"
minutes: 17
kind: concept
---

# State'in sahibini bul

:::pain[Problem]
Sinema'da `?q=Matrix&page=2` bağlantısını arkadaşına gönderiyorsun. O, `Matrix` aramasını açıyor ama ilk sayfayı görüyor; senin ekranında ikinci sayfa açık. Aynı anda favori sayısı sekme yenilenince sıfırlanıyor, TMDB'den gelen hata da boş liste gibi görünüyor. Dört ayrı sorun var çünkü dört farklı bilgi aynı `useState` sepetine atılmış.
:::

## Değerin nereden geldiğini izle

State, arayüz çizilirken gereken ve zaman içinde değişebilen bilgidir. “Her şeyi bir yerde tut” kolay görünür; ama bilginin sahibi değişince senkronizasyon işini de sen üstlenirsin. Bir değerin hangi kategoriye ait olduğunu anlamak için önce şunu sor: Bu bilgiyi kim belirliyor ve ne kadar yaşaması gerekiyor?

![Server, client, URL ve form state'in sahibini gösteren karar haritası](diagram:state-kategorileri)

Karar verirken şu kuralları sırayla uygula:

1. **Kaynağı sunucuysa server state'tir.** TMDB'nin trend listesi, film detayı ve tür kataloğu sunucunun değiştirebildiği verilerdir. İstek sürerken yüklenme, hata ve tekrar çekme halleri de bu verinin yaşam döngüsüne bağlıdır. Sonucu React state'e kopyalamak onu yerel tercih haline getirmez; yalnızca server verisinin bir kopyasını oluşturur.
2. **Kullanıcının bu cihazdaki tercihi client state'tir.** Bu sürümde favori id'leri kullanıcı seçer. Başka biri aynı URL'yi açınca senin favori listenin otomatik paylaşılması gerekmez. Kalıcılık gerekiyorsa localStorage ya da daha sonra sunucu hesabı seçebilirsin; kalıcılık tercihi sahibi değiştirmez.
3. **Paylaşılabilir ve gezinmeyle geri alınabilir seçim URL state'tir.** `q=Matrix`, `page=2` ve `genre=28` sayfanın hangi görünümünü seçtiğini anlatır. URL kopyalanabilir, yenilenebilir ve geçmişte geri alınabilir. Sonuçların kendisi URL'ye değil, bu seçimi kullanarak veri getiren katmana aittir.
4. **Gönderim bekleyen alanlar form state'tir.** Yorum kutusuna yazılmış ama henüz gönderilmemiş metin bir taslaktır. Form hataları, touched durumu ve submit bekleyişi de aynı etkileşimin ömrünü izler. Her karakteri URL'ye ya da server state'e yazmak zorunda değilsin.
5. **Bir değer iki yerde tutuluyorsa ikisinin de neden gerekli olduğunu kanıtla.** Örneğin input'ta anlık taslak, URL'de son gönderilmiş sorgu bulunabilir. Aralarındaki güncelleme anı açık olmalı; yoksa ekran iki farklı doğru iddia eder.

Bu kategoriler birer React API'si değil, sahiplik kararlarıdır. `useState`, Context, URL parametresi ya da Query cache'i araçtır. Önce sahibi seç; sonra o sahibin yaşam döngüsüne uygun aracı belirle. Her yerde Context kullanmak, her yerde URL'ye yazmak ya da her veriyi effect ile çekmek aynı sorunu başka bir biçimde saklar.

## Matrix aramasını zaman içinde izle

Başlangıç adresi `?q=Matrix&page=2` olsun. Uygulama açılırken her katman kendi sorumluluğunda kalır:

| An | URL seçimi | Sunucu verisi | Form taslağı | Yerel tercih |
| --- | --- | --- | --- | --- |
| Sayfa açılır | `q=Matrix`, `page=2` okunur | Henüz istek yok | Arama alanı `Matrix` ile doldurulur | Favoriler cihazdan okunur |
| İstek sürer | Aynı seçim korunur | `loading` | Kullanıcı yazıyorsa taslak değişebilir | Favori değişmez |
| Cevap gelir | Değişmez | Sonuç listesi veya hata | Gönderimden sonra taslak sorguyla eşleşir | Favori değişmez |
| Kullanıcı geri basar | Önceki `q` ve `page` geri gelir | Yeni URL için veri alınır/cache'ten seçilir | Alan URL'den eşitlenir | Favori değişmez |

Örneğin kullanıcı input'a `Dövüş` yazdı. Henüz Enter'a basmadıysa `draftQuery = "Dövüş"`, URL'deki `q = "Matrix"` olabilir. Bu kısa ayrım niyetlidir: taslak, düzenlenmekte olan metindir; URL ise son uygulanmış aramadır. Enter sonrası sayfa `q=Dövüş&page=1` adresine gider. Böylece sorgu değişince eski ikinci sayfa yeni aramaya taşınmaz.

Sayfayı yenilemek de yararlı bir iz sürme testidir. URL'deki arama ve sayfa yeniden kurulabilir; favori ancak uygulama onu sakladıysa geri gelir; gönderilmemiş form taslağı çoğunlukla kaybolur; TMDB sonucu yeniden istenir veya uygun cache'ten alınır. Her değerin yenilemeden sonra aynı davranması gerekmez. Beklenti, bilginin sahibine göre değişir.

Sahipliği seçerken “kalıcı mı?” sorusu tek başına yeterli değildir. URL state kalıcı olmak için değil, gezinmeyle geri alınabilir ve paylaşılabilir olmak için vardır. Client preference localStorage'da kalıcı tutulabilir ama yine de tek kullanıcıya ait olabilir. Server state cache'te birkaç dakika tutulabilir ama kaynağı hâlâ TMDB'dir. Form state submit sonrası temizlenebilir ama storage ile taslak kaydı da isteğe bağlı olabilir. Kalıcılık mekanizması ile state kategorisini birbirine eşitleme.

Bir değeri başka kategoriye kopyalamak bazen bilinçli UX kararıdır. Arama taslağı form state'inde, son gönderilmiş query URL'de durabilir; kullanıcı submit edince iki değer eşitlenir. Favori id'leri client state'te, favori kartlarının içerik alanları server state'ten gelebilir; id listesi ile film detayı farklı bilgilerdir. Her kopya için “ne zaman yenilenir, hata olursa hangisi kalır, reset ne zaman olur?” sorularına yanıt veremiyorsan kopyayı kaldır veya owner'ı birleştir.

State seçimi aynı zamanda sahiplik sınırını test edilebilir yapar. URL değeri URLSearchParams ile değiştiğinde geri/ileri davranışı kontrol edilebilir; server cevabının hata/boş halleri farklı denenebilir; local preference'a reset eylemi uygulanabilir. Bir bütün olarak “sayfa bozulmadı” demek yerine her owner'ın beklenen geçişini tarif etmek, hata mesajını daha anlaşılır hale getirir.

## Yanlış sahipliği önce kır

Aşağıdaki örnek dört ayrı sahiplik kararını tek bileşende karıştırır. Kod derlenebilir; hata davranıştadır: URL değişse bile query state kendiliğinden güncellenmez ve sonuç listesinin kopyası URL seçimiyle yarışır.

```tsx
import { useEffect, useState } from 'react'

type Movie = { id: number; title: string }

function SearchPage({ initialMovies }: { initialMovies: Movie[] }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState(initialMovies)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMovies(initialMovies)
  }, [initialMovies])

  return <p>{query} · {page} · {movies.length} sonuç · {String(loading)}</p>
}
```

Burada `initialMovies` başka bir yerden geliyorsa effect ile kopyalamak iki kaynağı eşzamanlı tutma borcu çıkarır. `query` ve `page` paylaşılabilir olmalıysa yalnız component belleğinde kalmaları geri/ileri gezinmeyi bozacaktır. `loading` ise istek yaşam döngüsünden türetilir; sunucu verisiyle birlikte yönetilmelidir.

Düzeltilmiş tasarım araç isimlerinden önce sözleşmeyi gösterir. URL'den seçimi oku, ağ verisini istek/cache katmanına bırak, yalnız taslağı yerel tut:

```tsx check
import { useState } from 'react'
import { useSearchParams } from 'react-router'

export function SearchControls() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const page = Number(params.get('page') ?? '1')
  const [draft, setDraft] = useState(query)

  function submit() {
    const next = new URLSearchParams(params)
    next.set('q', draft)
    next.set('page', '1')
    setParams(next)
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); submit() }}>
      <label>
        Film ara
        <input value={draft} onChange={(event) => setDraft(event.target.value)} />
      </label>
      <p>Uygulanan sorgu: {query} · sayfa {page}</p>
      <button type="submit">Ara</button>
    </form>
  )
}
```

Uygulamada `draft` URL dışı, geçici form etkileşimidir. URL değişince taslağı eşitlemek gerekiyorsa gezinme değişimini de açıkça ele alırsın; bu karar ürün davranışına bağlıdır. Sonuçları bu bileşene ek state olarak kopyalamıyoruz: arama verisini yükleyen katman URL'deki `query` ve `page` değerleriyle çalışır.

## Sınır durumlarında sahibi koru

:::mistake[Belirti: yenilemeden sonra sonuç ile adres uyuşmuyor]
**Belirti →** Adreste `page=2` yazarken ilk sayfanın sonuçları görünüyor. **Neden →** Sayfa bilgisi hem URL'de hem de bağımsız component state'inde tutulmuş; açılışta iki kaynak farklı. **Düzeltme →** Paylaşılabilir sayfa seçimini URL'den oku ve istek anahtarını aynı değerden üret.
:::

:::mistake[Belirti: arama yazarken geçmişte onlarca kayıt oluşuyor]
**Belirti →** Geri düğmesi her harfi tek tek siliyor. **Neden →** Her tuş vuruşu kalıcı gezinme kaydı olarak push edilmiş. **Düzeltme →** Ürünün beklentisine göre submit anında URL'yi güncelle veya yazma sırasında replace kullan; taslak ile uygulanmış sorguyu ayır.
:::

:::mistake[Belirti: boş liste hata ile aynı görünüyor]
**Belirti →** TMDB kapalıyken ekranda “Sonuç yok” yazıyor. **Neden →** Server state'in loading, success-empty ve error durumları tek `movies: []` değerine indirgenmiş. **Düzeltme →** İstek durumunu veriden ayrı, açık bir union ya da Query durumuyla temsil et.
:::

:::mistake[Belirti: favori iki sekmede farklı]
**Belirti →** Bir sekmede filme yıldız verdin, diğerinde yıldız dolu değil. **Neden →** Tercih yalnız bir component'in yerel state'inde kaldı. **Düzeltme →** Paylaşılması gereken bileşen ağacında ortak bir owner seç; tarayıcılar arası kalıcılık gerekiyorsa storage/server gibi uygun bir sahip belirle.
:::

:::sector
Ürün ekipleri genellikle state kararlarını feature tasarımında açık eder: URL'den geri kurulması gereken filtreler, server cache'inde yaşayan cevaplar ve yalnız formda kalan taslaklar farklı akışlardır. PR incelemesinde “bu değer kimin?” sorusu, “hangi hook'u kullandın?” sorusundan önce gelir. Bir veri kopyalanıyorsa kopyanın ne zaman güncelleneceği de incelemenin parçasıdır.
:::

## Özet

- Server state'i dış servis belirler; istek, hata ve cache ömrü bu sahipliğe dahildir.
- Client state cihazdaki tercihtir; URL state paylaşılabilir gezinme seçimini taşır.
- Form state gönderim bekleyen taslak ve doğrulama durumudur.
- Aynı değerin kopyaları varsa aralarındaki eşitleme anını açıkça tanımla.
- Aracı state'in sahibine ve ömrüne göre seç.

**Kendini yokla:** `?genre=28` hangi bilgiyi taşımalı: tür seçimini mi, TMDB'den gelen film listesini mi?  
*Cevap:* Tür seçimini. Liste server state olarak o seçimle alınır.

**Kendini yokla:** Kullanıcı yorum yazarken her karakteri URL'ye koymak zorunda mı?  
*Cevap:* Hayır. Gönderilmemiş metin form taslağıdır; URL ancak ürün bu metni paylaşmayı özellikle istiyorsa seçilir.
