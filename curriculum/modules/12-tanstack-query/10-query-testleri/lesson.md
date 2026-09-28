---
title: "Query kullanan arayüzü izole test et"
minutes: 15
kind: concept
---

# Query kullanan arayüzü izole test et

:::pain[Problem]
Bir test tek başına başarılı, tüm test paketi birlikte çalışınca arama sonucunda başka senaryonun eski verisi çıkıyor. İstek sayısı bazen sıfır, bazen iki oluyor. Testlerin aynı global QueryClient’ı kullanması sonucu test sırası belirliyor.
:::

## Her test kendi cache dünyasını alsın

Query kullanan component’in görünümü cache durumu, query ayarları ve ağ cevabına bağlıdır. Testler arasında aynı QueryClient paylaşılırsa önceki testin cevabı sonrakinde hazır olabilir. Her test için yeni client, beklenebilir cache başlangıcı sağlar. Bu, üretimdeki uygulamanın tek client kullanma ilkesinden farklı değildir; test senaryoları birbirinden yalıtılmış küçük uygulamalardır.

:::model[Query cache yaşam döngüsü]
Cache key’ler veriyi tutar; observer ayrılınca stale/inactive süreleri işlemeye başlar ve ileride GC olabilir. Testte ayrı client yaratmak, bir testin inactive cache’inin öteki testte görünmesini önler. Yeni bağlamda modelin değişen tarafı, cache davranışını tekrarlanabilir ölçmek için ömrünü test sınırına bağlamaktır.
:::

![TanStack Query'nin ağ çağrısını MSW ile yakalanan cevap üzerinden cache'e taşımasını gösteren diyagram](diagram:msw-perdesi)

Test modelinin kuralları:

1. Her test yeni QueryClient ve boş cache ile başlar.
2. Test QueryClient’ında retry kapalıdır; hata senaryosu süresi tahmin edilebilir olur.
3. UI gerçek provider ve query function ile render edilir.
4. MSW yalnız ağ sınırını kontrol eder; assertion kullanıcıya sunulan davranışı doğrular.
5. Asenkron görünüm, DOM’da bulunana kadar beklenir; senkron ilk görünüm anında okunur.

Test, kullanıcının göreceği cümle ve davranışı doğrulasın. Önceki modüllerde `render`, `screen`, `userEvent` ve `findBy` kullandın; burada component’in provider gereksinimini de karşılıyoruz. MSW, uygulamanın gerçek `fetch` isteğini ağ katmanında yakalayıp senin belirlediğin response’u verir. Component yine gerçek query function ile çalışır; test gerçek API’ye çıkmadan UI davranışını görebilir.

## Küçük bir render yardımcısı kur

Tekrarlanan provider kodunu test helper’ında toplayabilirsin. Helper her çağrıda client oluşturmalı ve `QueryClientProvider` altında RTL `render` çağırmalıdır. Testin gerekirse client’ı inceleyebilmesi için `{ client, ...render(...) }` döndürmek yararlı olabilir.

```tsx check title="src/test/renderWithQuery.tsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

export function renderInDataClient(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { client, ...render(ui, { wrapper }) }
}
```

Client’ı helper fonksiyonunun dışında oluşturma. Module seviyesindeki client bütün test dosyası boyunca yaşar; cache’i clear etmek ise eski retry timer’larını, observer’ları veya defaults’ları paylaşma riskini tamamen ortadan kaldırmaz. Yeni client daha yalın sınırdır. Query’de retry varsayılanı üretim deneyimine yardımcı olur ama test hatasında beklemeyi uzatabilir; bu nedenle test client’ında kapatıyoruz. Gerçek kullanımda retry kuralını endpoint ve hata türüne göre ayrıca seçebilirsin.

## Beklemeyi kullanıcı davranışıyla eşleştir

Query async çalışır; `render` biter bitmez success text’in DOM’da olmasını bekleme. `screen.findByRole` veya `findByText` kullanmak, sonuç görünene kadar DOM’u bekler. `getBy...` anlık sorgudur ve metin henüz yoksa hemen hata verir. `waitFor` ise tek bir assertion için birden çok DOM güncellemesini beklemen gerektiğinde yararlıdır; içine yalnız assertion koy.

| Beklenti | Araç | Neden |
|---|---|---|
| İlk yükleme metni şu anda var | `getByText` | İlk render’da senkron metin görünür |
| API cevabı sonrasında başlık gelir | `findByRole` | Promise ve React update beklenir |
| Birkaç koşul sonunda cache’e yazar | `waitFor` | Assertion periyodik yeniden denenir |
| Kullanıcı “Geri”ye basar | `user.click` | Gerçek etkileşim akışına yaklaşır |
| Request sayısı doğrulanır | `requests(path)` | Ağ davranışı doğrudan görünür olur |

Query’nin `isPending`, `isError` veya `data` dalında gösterilen şey de davranışın parçasıdır. 500 response’u MSW ile verildiğinde query function’ın hata fırlatıp fırlatmadığı ve component’in kullanıcıya hangi alert’i sunduğu gözlenebilir. Başarısız network response’unu bileşene enjekte edilmiş sahte bir state ile taklit etme; ağ sınırında kontrol etmek, query’nin hata hattını da gerçekçi çalıştırır.

## İz sürme: render’dan assertion’a

RTL component’i provider wrapper içinde render eder. `useQuery` key’i cache’de boş bulur ve query function’ı başlatır. `fetch` URL’i MSW handler’ına ulaşır; handler Türkçe gözlem cevabı döndürür. Query Promise’i çözer, cevabı cache’e koyar ve component success sonucu ile tekrar render olur. `findByRole` DOM’da başlığı bulana dek bekler. Ardından test `requests('/api/harbors/north')` uzunluğunu kontrol edebilir.

| Sıra | Katman | Olay | Gözlenebilir sonuç |
|---:|---|---|---|
| 1 | Test helper | Yeni client ve wrapper oluşur | Önceden kalmış data yoktur |
| 2 | RTL render | Component hook ile key’e bağlanır | Bekleme metni görünür |
| 3 | Query function | `fetch` MSW’nin yakaladığı URL’e gider | Gerçek ağ kullanılmaz |
| 4 | MSW handler | 200 ya da 500 cevabı döndürür | Query success veya error’a geçer |
| 5 | React render | Query sonucu JSX’e dönüşür | Başlık ya da alert görünür |
| 6 | RTL assertion | `findBy` beklenen metni bulur | Test kullanıcı davranışını doğrular |

İkinci test yeni helper çağrısıyla başka client alır. Bu testin cache’i boş başlar; handler geçmişi de test altyapısında temizlenir. Böylece birinci testin cevabı veya istek sayısı ikinci assertion’a karışmaz. Bu sınır, testin hangi kullanıcı davranışını kanıtladığını okunaklı kılar.

### Kırık örnek: tek client’ı dosya seviyesinde paylaş

```tsx
const client = new QueryClient()

function wrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```

Test 1 `['ports']` key’ini doldurur. Test 2 aynı key’e render olunca `staleTime` veya cache ayarlarına bağlı olarak test 1’in data’sı görünür ve yeni handler hiç çağrılmayabilir. Test 2 tek başına çalışınca geçmesi, birlikte de yalıtılmış olduğu anlamına gelmez.

### Düzeltilmiş yapı: her render çağrısına yeni client

Yukarıdaki `renderInDataClient` helper’ı `new QueryClient()` çağrısını kendi gövdesinde yapar. Testten teste kullanıcı görünümünü doğrudan okuyabilirsin:

```tsx
renderInDataClient(<PortStatus />)
expect(await screen.findByRole('heading', { name: 'Kuzey Limanı' })).toBeInTheDocument()
```

Bu örnek, Vitest, RTL ve jest-dom import’larının test dosyasında açıkça bulunduğu bir ortamı varsayar. Repo test setup’ında yardımcı matchers kayıtlıdır; yeni bir projede setup yapılandırmasını doğrula.

Cache’le ilgili bir davranışı doğrulamak gerekiyorsa helper’ın döndürdüğü `client` üzerinden cache state’ini okuyabilirsin. Ama her assertion’ı `getQueryData` ile yazma. Kullanıcı “başlık görünür mü?” diye soruyorsa DOM assertion doğrudan cevaptır. Cache assertion, aynı key’in ikinci kez fetch olup olmadığını ya da prefetch’in gerçekten cache’e yazdığını anlamak için uygundur.

MSW cevabını test başına değiştirmek de gerçek durumları modellemeye yarar. Bir handler 500 döndürür; component’in alert’i aranır. Başka handler boş `results` döndürür; boş-state metni beklenir. Böylece error ile empty aynı görünmemelidir. Test adı da sonuç cümlesi olsun: “sunucu hata verdiğinde uyarı görünür” gibi. Bir testin hangi cache ayarını kullandığını değil, ürün davranışını anlatır.

## Sınır durumları ve sık hatalar

:::mistake[`getBy` ile asenkron cevabı beklemek]
**Belirti:** Test ilk render’da “Unable to find” ile düşer. → **Neden:** Query cevabı `getBy` çalışmadan önce gelmemiştir. → **Düzeltme:** Veri sonradan geleceği için `findBy...` kullan; senkron pending metni için `getBy...` uygundur.
:::

:::mistake[Retry yüzünden testin uzaması]
**Belirti:** Hata senaryosu birkaç denemeden sonra sonuçlanır. → **Neden:** Test QueryClient’ında retry varsayılanı açıktır. → **Düzeltme:** Test client’ında `queries.retry: false` kullan; üretim retry politikasını ayrı değerlendir.
:::

:::mistake[Response’u assert etmeden önce beklememek]
**Belirti:** Test bazen geçer bazen count sıfır bulur. → **Neden:** Promise’in bitişi beklenmeden ağ çağrısı sayılmıştır. → **Düzeltme:** Önce success görünümünü `findBy` ile bekle, sonra request kaydını oku.
:::

:::mistake[Her şeyi implementation detail olarak test etmek]
**Belirti:** `isSuccess` boolean’ı değişince UI aynı olsa da test kırılır. → **Neden:** Kullanıcının göremeyeceği internal query state doğrulanmıştır. → **Düzeltme:** Görünür pending, error, data ve kullanıcı etkileşimini önceliklendir; cache incelemesini yalnız cache davranışı gereksinim olduğunda ekle.
:::

:::sector
Üretim koduyla aynı provider sınırını testte kur, ama test başına yeni client kullan. MSW’yi gerçek `fetch` çağrısını yakalamak için seç; bu sayede UI, query function ve cache birlikte çalışır. Test adı da “arama sonucu gelir” gibi davranışı anlatsın.
:::

## Özet

- Query component testi provider ve QueryClient gerektirir.
- Her test kendi yeni client’ını kullanır; retry testte kapanabilir.
- MSW gerçek fetch sınırını taklit eder; test gerçek ağa çıkmaz.
- Asenkron data için `findBy`, senkron ilk görünüm için `getBy` kullan.
- Önce kullanıcının gördüğü davranışı, sonra gerçekten gerekliyse cache ayrıntısını doğrula.

**Kendini yokla:** Module seviyesinde QueryClient paylaşmak neden test sırasına bağlanır? Başlık API cevabından sonra çıkıyorsa `getBy` mi `findBy` mi gerekir?

**Yanıt:** Önceki testin cache’i sonraki teste taşınabilir. Sonradan gelen başlık için `findBy` kullanılır.
