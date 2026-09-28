---
title: "Arama: URL, önbellek ve kirli veri bir arada"
minutes: 12
kind: project
---

# Arama: URL, önbellek ve kirli veri bir arada

:::pain[Problem]
Kullanıcı arama kutusuna bir kelime yazıp enter'a bastığında liste gelir. Ancak sayfayı yenilediğinde arama kutusu ve sonuçlar sıfırlanır; tarayıcının geri butonuna bastığında hiçbir şey değişmez; 2. sayfaya geçtiğinde ekran anlık beyazlaşıp göz kırpar (flicker). Daha da kötüsü: API'den gelen bazı kayıtlarda görsel adresi boş olduğu için sayfada onlarca kırık resim ikonu patlar.

Bu arızaların nedeni arama mantığının eksikliği değil, **üç bağımsız katmanın** (URL rotası, asenkron önbellek ve veri sınır doğrulaması) birbirine uyumsuz bağlanmasıdır.
:::

Bu derste arama özelliğini rastgele bir `useState` içine hapsetmek yerine, URL'i tek gerçek kaynak kabul eden, TanStack Query ile akıcı sayfalama sunan ve Zod ile kirli dış API verisini filtreleyen profesyonel bir arama mimarisi kuruyorsun.

## URL, Önbellek ve Sınır Doğrulaması Zihinsel Modeli

Arama özelliği üç temel zihinsel modelin kesişim noktasında durur:

:::model[URL state]
Adres çubuğu (`/search?q=terim&page=2`) arama ekranının tek doğruluk kaynağıdır. Bileşen arama durumunu kendi içinde saklamaz; URL'den okur ve URL'e yazar. Bu sayede bağlantı paylaşımı ve tarayıcı geçmişi kendiliğinden kusursuz çalışır.
:::

:::model[Zod sınır doğrulaması]
Dış dünyadan gelen her veri (`fetch` yanıtı veya URL parametresi) TypeScript açısından `unknown` kabul edilmelidir. Veri uygulamanın güvenli sınırlarına girmeden önce doğrulanmalı, eksik alanlar (örneğin kayıp kapak görseli veya tanımsız yazar) güvenli varsayılanlara dönüştürülmelidir.
:::

![Zod sınır doğrulaması ile ham veriden güvenli modele geçiş](diagram:zod-sinir)

Bu mimariyi şu temel kurallarla yönetirsin:

1. **Sorgu ve sayfayı adres çubuğundan oku:** `q` ve `page` parametreleri doğrudan URL'den çözülür. Bileşen içinde `const [page, setPage] = useState(1)` açmak iki başlılık yaratır.
2. **Parametreleri query key içine göm:** Önbellek motoru her aramayı ve her sayfayı bağımsız bir anahtarla (`['search', query, pageNumber]`) saklamalıdır. Böylece kullanıcı 2. sayfadan 1. sayfaya geri döndüğünde yeni bir ağ isteği beklemeden sonuçları anında görür.
3. **Sayfa geçişinde eski veriyi ekranda tut:** Yeni sayfa yüklenirken arayüzü sıfırlayıp spinner göstermek yerine, `placeholderData: keepPreviousData` ile önceki sayfanın verisi ekranda tutulmalı, kullanıcıya kesintisiz bir deneyim sunulmalıdır.
4. **Bozuk URL parametrelerini normalize et:** Kullanıcı URL'e `?page=abc` veya `?page=-5` yazabilir. Sınırda bu değer yakalanmalı, `Math.max(1, Number(page) || 1)` mantığıyla güvenli bir tamsayıya çevrilmelidir.

## Arama ve sayfalama veri akışını izleyelim

Bir makale arama senaryosunda kullanıcının etkileşimini adım adım izleyelim:

| Zaman | Kullanıcı eylemi | URL durumu | Query Key | Ağ durumu | Ekranda görünen |
| --- | --- | --- | --- | --- | --- |
| 0 sn | `/articles` açılır | `?q=&page=1` | Pasif (`enabled: false`) | İstek atılmaz | "Aramak için bir konu yazın" mesajı |
| 2 sn | "React" yazıp "Ara" basar | `?q=react&page=1` | `['articles', 'react', 1]` | `GET /api?q=react&page=1` | Yükleniyor durumu ardından 10 makale |
| 15 sn | "Sonraki sayfa" tıklar | `?q=react&page=2` | `['articles', 'react', 2]` | `GET /api?q=react&page=2` | 1. sayfa sonuçları ekranda kalır, arka planda 2. sayfa yüklenir |
| 16 sn | 2. sayfa cevabı döner | `?q=react&page=2` | Aktif | Tamamlandı | 2. sayfa sonuçları görünür, "Sayfa 2 / 4" güncellenir |
| 20 sn | Tarayıcı "Geri" butonuna basar | `?q=react&page=1` | `['articles', 'react', 1]` | **İstek yok! (Cache)** | 1. sayfa sonuçları sıfır gecikmeyle ekranda belirir |

## Kod örnekleri: Yanlış ve doğru veri akışı

### Kırık örnek: URL'i bypass edip ham veriyi doğrudan basmak

Aşağıdaki kod API'den gelen veriye körü körüne güvenir ve sayfalama durumunu yerel state'te kaybeder:

```tsx
// TEHLİKE: API verisi doğrulanmamış, sayfa URL'e yansıtılmamış
import { useState, useEffect } from 'react'

export function FragileArticleSearch() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1) // HATA: Yenileyince 1'e döner!
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (!query) return
    fetch(`https://api.example.com/items?search=${query}&p=${page}`)
      .then((res) => res.json())
      .then((data) => setResults(data.docs)) // HATA: docs boşsa veya alanlar eksikse çöküş!
  }, [query, page])

  return (
    <div>
      {results.map((item) => (
        <div key={item.id}>
          {/* HATA: item.image null ise kırık resim patlar! */}
          <img src={item.image} alt={item.title} />
          <h3>{item.title}</h3>
        </div>
      ))}
    </div>
  )
}
```

### Doğru örnek: Zod şeması ve güvenli model dönüşümü

API'den gelen kirli veriyi Zod ile karşılayıp temiz bir iç modele dönüştürelim:

```ts check
import { z } from 'zod'

// 1. Dış API'nin kirli ve eksik olabilecek ham şeması
export const RawApiArticleSchema = z.object({
  id: z.string(),
  headline: z.string().default('Başlıksız Makale'),
  authors: z.array(z.string()).nullish().transform((val) => val ?? []),
  thumbnail_id: z.number().nullish().transform((val) => (val && val > 0 ? val : null)),
  year: z.number().nullish(),
})

// 2. Uygulamanın güvenle tüketebileceği tipli model
export type ValidatedArticle = {
  id: string
  title: string
  authorsText: string
  imageUrl: string | null
}

export function parseAndNormalizeArticle(rawInput: unknown): ValidatedArticle {
  const parsed = RawApiArticleSchema.parse(rawInput)

  return {
    id: parsed.id,
    title: parsed.headline,
    authorsText: parsed.authors.length > 0 ? parsed.authors.join(', ') : 'Yazar belirtilmemiş',
    imageUrl: parsed.thumbnail_id
      ? `https://cdn.example.com/covers/${parsed.thumbnail_id}.jpg`
      : null,
  }
}
```

Bu yaklaşımla:
- Görsel kimliği eksikse veya negatifse (`-1`), uygulama içinde kırık URL üretilmez; `null` dönerek yerel yer tutucuya düşer.
- Yazar dizisi boş veya tanımsız geldiğinde arayüz "Yazar belirtilmemiş" güvenli metnini gösterir.
- Bileşen katmanı ham API alan adlarından (`thumbnail_id`, `headline`) tamamen izole edilir.

## Sık karşılaşılan hatalar

:::mistake[Arama kutusuna her harf yazıldığında API'ye istek atmak]
**Belirti:** Hızlı yazı yazarken Network sekmesinin onlarca istekle dolması ve ücretsiz/gönüllü API sunucusunun `429 Too Many Requests` hatasıyla istemciyi engellemesi.  
**Neden:** Arama tetiklemesi `onChange` olayına bağlanmıştır ve debouncing veya form submit kuralı konmamıştır.  
**Düzeltme:** Kitaplık gibi kamuya açık API projelerinde aramayı yalnızca form gönderildiğinde (`onSubmit`, Enter veya "Ara" butonu) tetikle; boş sorgularda istek atma.
:::

:::mistake[Sayfa değişirken önceki veriyi sıfırlayıp tüm ekranı beyazlatmak]
**Belirti:** Kullanıcı "Sonraki" butonuna her bastığında mevcut kitap listesinin kaybolması, ekranın zıplaması ve sayfa başına dönülmesi.  
**Neden:** Yeni sayfanın `isLoading` durumu başladığında liste DOM'dan tamamen kaldırılmıştır.  
**Düzeltme:** TanStack Query sorgusunda `placeholderData: keepPreviousData` seçeneğini aktif et; yeni veriler gelene kadar mevcut liste ekranda kalsın.
:::

:::sector[Sektörde arama ve dayanıklı API sınırları]
Profesyonel arama arayüzlerinde (örneğin GitHub, Amazon veya sahibinden.com) URL'deki parametreler kutsaldır. Bir mühendis sayfayı yenilediğinde filtrelerin kaybolması kabul edilemez bir kusurdur. Benzer şekilde, üçüncü parti bir servisten gelen verinin eksik alanları yüzünden tüm sayfanın beyaz ekrana düşmesi (*Uncaught TypeError: Cannot read properties of undefined*) kabul edilemez. Bu yüzden sektörde Zod sınır doğrulaması mimarinin en kritik savunma hattıdır.
:::

## Özet

- Arama sorgusu ve sayfa numarası URL üzerinde tutulur; yerel state'e kopyalanmaz.
- Sayfa parametresi normalize edilmeli, geçersiz değerler 1 kabul edilmelidir.
- TanStack Query ile sayfalama yapılırken `placeholderData: keepPreviousData` kullanılarak arayüz sıçramaları önlenir.
- Zod şeması API sınırında çalışarak eksik kapak veya yazar gibi kirli verileri UI'a ulaşmadan güvenli varsayılanlara çevirir.

### Kendini yokla

1. **Soru:** Bir kullanıcı `/search?q=dune&page=2` linkini kopyalayıp başka bir tarayıcıda açtığında ne olmalıdır?  
   **Cevap:** Uygulama URL'den `q=dune` ve `page=2` parametrelerini okumalı, arama kutusuna "dune" yazmalı ve doğrudan 2. sayfa sonuçlarını getirip "Sayfa 2 / X" durumunu göstermelidir.
2. **Soru:** Neden dış API'den gelen `author_name` alanını doğrudan `<p>{book.author_name[0]}</p>` şeklinde basmak tehlikelidir?  
   **Cevap:** Çünkü API bazı kitaplar için `author_name` alanını hiç göndermeyebilir ya da boş bir dizi dönebilir. Bu durumda `undefined[0]` ifadesi çalışma zamanında tüm React ağacını çökertir.
