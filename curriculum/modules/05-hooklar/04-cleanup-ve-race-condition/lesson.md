---
title: "Eski cevap yeniyi ezmesin"
minutes: 17
kind: concept
---

# Eski cevap yeniyi ezmesin

:::pain[Problem]
Arama kutusuna hızlıca önce `Nolan`, hemen ardından `Tarantino` yazıyorsun. `Tarantino` araması sunucudan hızla (30 ms) dönüyor ve ekranda Tarantino filmleri beliriyor. Aradan yarım saniye geçtikten sonra, internetin derinliklerinde geciken eski `Nolan` cevabı (500 ms) tamamlanıyor ve ekrandaki güncel Tarantino sonuçlarının üstüne yazılıyor! Arama kutusunda "Tarantino" yazarken ekranda "Oppenheimer" listeleniyor.
:::

## Asenkron yarış koşulu (Race condition) modeli

Ağ istekleri gibi asenkron operasyonlarda **başlama sırası ile bitiş sırası aynı olmak zorunda değildir**. İlk atılan istek ağdaki bir tıkanıklıktan, veritabanı sorgusunun karmaşıklığından ya da sunucu gecikmesinden ötürü ikinci istekten daha geç tamamlanabilir.

React, dependency değiştiğinde yeni render'ı üretir ve yeni effect'i çalıştırır; ancak arka planda devam eden eski Promise'leri kendiliğinden iptal edemez ya da susturamaz. Eğer önlem almazsan, eski bir işlem bittiğinde `setState` çağırarak arayüzü geçmişe fırlatır.

![Eski yavaş cevabın yeni hızlı cevabı ezdiği yarış koşulu](diagram:yaris-kosulu)

Yarış koşulunu engellemenin kesin kuralları:

1. **Bağımsız işlem kuralı:** Her effect setup'ı kendine ait bağımsız bir asenkron süreç başlatır.
2. **Cleanup zamanında kapatır:** Dependency değiştiğinde ya da bileşen unmount olduğunda React önce eski effect'in temizlik (cleanup) fonksiyonunu çalıştırır.
3. **Yazma hakkını kaldırmak:** Temizlik fonksiyonu, eski asenkron işlemin sonuçlansa dahi artık ekrana (state'e) yazma hakkını iptal etmelidir.
4. **Tarayıcı seviyesinde iptal (`AbortController`):** Eğer dış sistem bir `fetch` isteğiyse, yalnızca state yazmayı durdurmakla kalmayıp tarayıcı seviyesinde ağ isteğini de abort edebilirsin.
5. **İptal hata değildir:** Bir isteğin kullanıcının yeni bir şey yazması sebebiyle iptal edilmesi olağan bir akıştır; oluşan `AbortError` arayüzde bir arıza gibi gösterilmemelidir.

:::model[Effect yaşam döngüsü]
Bağımlılık değiştiğinde React'in işlettiği kesin sıra şudur:  
**Yeni render → Commit → Eski effect'in cleanup'ı → Yeni effect'in setup'ı.**  
Cleanup'ın yeni setup'tan önce çalışması hayati önem taşır. Bu sayede eski istek tam zamanında etkisizleştirilir ve yeni isteğin yoluna çıkması engellenir.
:::

## Zaman çizelgesinde yarışın anatomisi

Yarış anında arka planda saniyelerin binde birinde neler yaşandığını adım adım izleyelim:

| Zaman | Kullanıcı Eylemi | Ağ / Arka Plan Olayı | Bileşen State'i | Kullanıcının Gördüğü Ekran |
| --- | --- | --- | --- | --- |
| 0 ms | "Nolan" yazdı | İstek 1 (`/search?q=Nolan`) yola çıktı | `query = "Nolan"` | "Yükleniyor..." |
| 50 ms | "Tarantino" yazdı | İstek 2 (`/search?q=Tarantino`) yola çıktı | `query = "Tarantino"` | "Yükleniyor..." |
| 120 ms | Bekliyor | **İstek 2 tamamlandı!** (Hızlı sunucu yanıtı) | `results = [Pulp Fiction...]` | **Tarantino Sonuçları (Doğru)** |
| 450 ms | Bekliyor | **İstek 1 tamamlandı!** (Geciken eski yanıt) | `results = [Inception...]` | **Nolan Sonuçları (BOZUK!)** |

Kullanıcı arama alanında "Tarantino" yazısını görürken, alttaki liste 450. milisaniyede aniden Nolan filmlerine geri döner. İşte buna **race condition** denir.

## Kırık örnek

Aşağıdaki kodda dependency listesi `[query]` doğru verilmiştir; yani yeni sorguda yeni istek tetiklenir. Ancak eski isteğin callback'i korumasız bırakılmıştır:

```tsx
import { useEffect, useState } from 'react'

type SearchResponse = { results: { name: string }[] }

export function DirectorSearch({ query }: { query: string }) {
  const [director, setDirector] = useState('Yükleniyor...')

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((res) => res.json() as Promise<SearchResponse>)
      .then((data) => {
        // TEHLİKE: Bu callback tamamlandığında query çoktan değişmiş olabilir!
        setDirector(data.results[0]?.name ?? 'Bulunamadı')
      })
  }, [query])

  return <p>{director}</p>
}
```

Bu kodda ağ ne kadar hızlıysa hata o kadar gizlenir. Fakat sunucu biraz yavaşladığında veya mobil bağlantıda arayüz kaçınılmaz olarak bozulur.

## 1. Çözüm: Geç cevabı yok saymak (`ignore` bayrağı)

En yalın ve evrensel yöntem, her effect çalışmasına özel yerel bir boolean bayrak (`ignore`) açmaktır:

```tsx check
import { useEffect, useState } from 'react'

type SearchResponse = { results: { name: string }[] }

export function DirectorSearch({ query }: { query: string }) {
  const [director, setDirector] = useState('Yükleniyor...')

  useEffect(() => {
    let ignore = false

    fetch(`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((res) => res.json() as Promise<SearchResponse>)
      .then((data) => {
        // Yalnızca bayrak hâlâ güncelse state güncelle
        if (!ignore) {
          setDirector(data.results[0]?.name ?? 'Bulunamadı')
        }
      })

    // Temizlik fonksiyonu: Bir sonraki render'da veya unmount'ta çalışır
    return () => {
      ignore = true
    }
  }, [query])

  return <p>{director}</p>
}
```

### Bu bayrak nasıl çalışır?
1. Kullanıcı "Nolan" yazdığında Effect 1 çalışır; bellekte `ignore_1 = false` oluşur.
2. Kullanıcı hemen "Tarantino" yazdığında React yeni render yapar.
3. React yeni setup'ı çalıştırmadan ÖNCE Effect 1'in cleanup'ını çağırır: `ignore_1 = true` olur.
4. Ardından Effect 2 çalışır; bellekte yepyeni bir `ignore_2 = false` oluşur.
5. Geciken Nolan cevabı 450 ms sonra gelse bile, closure içindeki `ignore_1` artık `true` olduğu için `setDirector` satırı pas geçilir. Ekrana hiçbir zaman bayat veri yazılmaz.

## 2. Çözüm: Ağ isteğini iptal etmek (`AbortController`)

`ignore` bayrağı state güncellenmesini engeller; ancak tarayıcı arka planda gereksiz veri indirmeye devam eder. Modern web standartlarında `fetch` çağrıları bir `AbortSignal` kabul eder. `AbortController` kullanarak gereksiz hale gelen ağ transferini tarayıcı seviyesinde fişten çekebilirsin:

```tsx check
import { useEffect, useState } from 'react'

type CastResponse = { cast: { name: string }[] }

export function MovieCastPreview({ movieId }: { movieId: number }) {
  const [leadActor, setLeadActor] = useState('Yükleniyor...')

  useEffect(() => {
    const controller = new AbortController()

    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((res) => res.json() as Promise<CastResponse>)
      .then((data) => {
        setLeadActor(data.cast[0]?.name ?? 'Kadro bilgisi yok')
      })
      .catch((error: unknown) => {
        // İptal edilen istek bir hata değildir!
        if ((error as Error).name !== 'AbortError') {
          setLeadActor('Kadro yüklenirken hata oluştu')
        }
      })

    // Temizlik: Yeni istek başladığında veya bileşen kapandığında eski isteği iptal et
    return () => {
      controller.abort()
    }
  }, [movieId])

  return <p>{leadActor}</p>
}
```

`controller.abort()` çağrıldığı anda tarayıcı soketi kapatır, HTTP transferini sonlandırır ve `fetch` Promise'ini bir `DOMException: AbortError` fırlatarak reddeder. Böylece bant genişliği korunur.

## Gerçek dünyada bu yarışı nasıl simüle edersin?

Geliştirme makinen genelde çok hızlı bir internete bağlı olduğu için yarış koşullarını gözle yakalamak zor olabilir. Bunu test etmek için profesyonel araçları kullan:

1. **DevTools Network Throttling:**
   - Chrome veya Edge DevTools'ta **Network** sekmesini aç.
   - **Throttling** açılır menüsünden **Slow 3G** veya **Fast 3G** profilini seç.
   - Arama kutusuna hızlıca bir şeyler yaz. Network sekmesinde kırmızı renkli `(canceled)` etiketli istekler görüyorsan `AbortController` başarıyla devrededir!
2. **Yapay gecikme (DevTools Custom Throttling):**
   - DevTools'ta gecikmeyi 2000 ms olarak ayarla; ilk isteğin dönerken ikinci isteğin çoktan bitmiş olduğu durumları gözünle incele.

## `ignore` mu, `AbortController` mı?

| Kriter | `ignore` Bayrağı | `AbortController` |
| --- | --- | --- |
| Ağ trafiğini keser mi? | Hayır, veri inmeye devam eder | Evet, tarayıcı transferi durdurur |
| Promise dışı API'lerde çalışır mı? | Evet (tüm JS asenkron süreçlerinde) | Hayır, yalnızca sinyal destekleyen API'lerde |
| Hata yönetimi (catch) | Ekstra `catch` filtresi gerektirmez | `AbortError` hatasını ayıklamak zorunludur |
| Kod karmaşıklığı | Çok düşük | Orta |

En sağlam desen, ağ isteklerinde `AbortController` kullanmak ve hata bloğunda `AbortError` kontrolünü asla unutmamaktır.

## Cleanup fonksiyonunun kesin çalışma sırası

React geliştiricilerinin en sık yanıldığı nokta, cleanup'ın yalnızca bileşen sayfadan kaldırılırken (unmount) çalıştığını düşünmeleridir. Oysa dependency array değiştiğinde de cleanup devreye girer.

Sıralamayı tam bir netlikle zihnine yerleştir:

1. **Yeni Render:** Kullanıcı yeni bir tuşa bastı; React yeni bileşen çıktısını hesapladı.
2. **DOM Commit:** React arayüz farklarını DOM'a yazdı.
3. **Paint:** Tarayıcı yeni ekranı kullanıcıya boyadı.
4. **Önceki Effect Cleanup'ı:** React, bir önceki render'dan kalan cleanup fonksiyonunu çalıştırır (`controller.abort()` tetiklenir, `ignore = true` yapılır).
5. **Yeni Effect Setup'ı:** React, yeni render'a ait effect setup'ını başlatır (yeni `fetch` ateşlenir).

Bu sıra sayesinde eski dünya tamamen susturulmadan yeni dünya başlatılmaz.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: AbortError'ı kullanıcıya hata olarak göstermek]
Belirti → Arama kutusuna hızlı yazınca ekranda anlık olarak kırmızı renkle "Bir hata oluştu" yazıp kayboluyor.  
Neden → `catch` bloğu gelen hatanın `error.name === 'AbortError'` olup olmadığını kontrol etmeden genel hata state'ine yazdı.  
Düzeltme → İptal hatalarını yakala ve sessizce yut:
```ts
if (error instanceof Error && error.name === 'AbortError') {
  return // Kullanıcı bilinçli olarak yeni bir işlem yaptı, hata gösterme
}
```
:::

:::mistake[Sık hata: Bayrağı bileşen dışında tanımlamak]
Belirti → Yeni atılan geçerli istekler de bazen cevapsız kalıyor ve ekranda veri görünmüyor.  
Neden → `let ignore = false` değişkeni `useEffect` callback'i içinde değil, dosya ya da bileşen düzeyinde ortak bir değişken olarak tanımlandı. Her yeni render eski bayrağı ezdi.  
Düzeltme → `let ignore = false` satırını MUTLAKA `useEffect` callback'inin ilk satırına yaz. Her effect çağrısının kendi closure değişkeni olmalıdır.
:::

:::mistake[Sık hata: Yanıtın güncelliğini sunucudan gelen veriden anlamaya çalışmak]
Belirti → API cevabındaki timestamp kontrol edilmeye çalışılıyor.  
Neden → Backend genellikle sadece veriyi döner; kullanıcının o an hangi input değerine baktığını bilemez.  
Düzeltme → Zamanlama kararını sunucuya bırakma; React bileşeninin kendi yaşam döngüsü ve cleanup mekanizmasıyla yönet.
:::

:::sector
Arama motorları, e-ticaret filtreleme panelleri ve finansal işlem tabloları gibi verinin anlık değiştiği alanlarda race condition savunması bir zorunluluktur. Büyük ölçekli uygulamalarda bu yönetim çoğunlukla TanStack Query veya RTK Query gibi kütüphanelere devredilir (bu kütüphaneler arka planda otomatik `AbortController` sinyali üretir). Ancak temel seviyede bu mekanizmanın nasıl çalıştığını anlamak, kütüphanelerin yetersiz kaldığı özel entegrasyonlarda hayat kurtarır.
:::

## Özet

- Asenkron işlemler başlama sırasına göre bitmeyebilir; eski yavaş cevap yeni cevabı ezebilir.
- `useEffect` cleanup fonksiyonu yalnızca unmount anında değil, her dependency değişiminde de çalışır.
- `ignore` bayrağı, eski asenkron işlemlerin state'e yazmasını engeller.
- `AbortController`, gereksiz kalan HTTP isteklerini tarayıcı seviyesinde sonlandırarak bant genişliğini korur.
- `AbortError` bir sistem arızası değil, olağan bir iptal işlemidir; arayüzde hata olarak gösterilmemelidir.

**Kendini yokla:** Kullanıcı "A" yazıp hemen ardından "B" yazdığında, React'in effect yaşam döngüsü sırası nasıl işler?  
*Cevap:* Render(B) → Commit(B) → Cleanup(A) → Setup(B).

**Kendini yokla:** `AbortController` kullanıldığında `catch` bloğunda neden `error.name === 'AbortError'` kontrolü yapılır?  
*Cevap:* Çünkü isteği biz iptal ettik; bu kullanıcı hatası veya sunucu arızası değildir. Sessizce karşılanmalıdır.
