---
title: "Query cache’in tazelik ve bellek saatleri"
minutes: 18
kind: concept
---

# Query cache’in tazelik ve bellek saatleri

:::pain[Problem]
Katalogdaki ülke adları beş dakika önce çekilmiş olsa da ikinci ekrana dönünce GET tekrar gidiyor. Başka bir listede saatler önce alınmış veri hâlâ cache’te duruyor ve kullanıcıya yeniymiş gibi görünüyor. Tek başına “cache var” demek ne zaman yenileyeceğini veya ne zaman sileceğini açıklamıyor.
:::

## İki saat, iki ayrı karar

Query cache girdisinin iki ayrı sorusu vardır. **Tazelik saati**: Bu veri ne kadar süre yeni kabul edilsin? **Kullanılmayan veri saati**: Son component aboneliği ayrıldıktan sonra bu girdi ne kadar süre bellekte kalsın? TanStack Query 5’te bunları `staleTime` ve `gcTime` ayarları ifade eder.

:::model[State kategorileri]
API cevabı server state’tir; favori yıldızı client state, arama ifadesi URL state’tir. Cache politikası yalnızca sunucu kopyasına uygulanır. Bu modelde yeni olan, sunucu kopyasının taze sayıldığı zaman ile bellekte tutulduğu zamanı birbirinden ayırmaktır.
:::

![TanStack Query cache girdisinin fetching, fresh, stale, inactive ve gc aşamalarını gösteren diyagram](diagram:query-onbellek-yasam-dongusu)

Kesin kurallar:

1. **Başarılı cevap yaş aldığında stale olur.** Varsayılan `staleTime` sıfırdır; veri geldikten hemen sonra stale sayılır.
2. **Stale olmak silinmek değildir.** Stale cevap ekranda kullanılabilir ve aynı anda arka planda yenilenebilir.
3. **Taze query yeniden abone olunca varsayılan mount refetch’i gerekmez.** Fresh veri anında kullanılabilir.
4. **`gcTime`, yalnızca query’nin observer’ı kalmadığında sayar.** Abone olan ekran varsa cache girdisi kullanılmaktadır ve bu sayaç başlamaz.
5. **`gcTime` bitince inactive girdi garbage collection ile silinir.** Sonraki açılışta artık cache verisi yoktur ve yeni istek gerekir.
6. **İki süre birbirinin yerine geçmez.** Büyük `gcTime` daha taze veri sağlamaz; büyük `staleTime` veriyi bellekte sonsuza dek tutmaz.

Yeni QueryClient varsayılanında `staleTime` `0`, `gcTime` ise beş dakikadır. Sunucu güncellemelerinin görünmesi için stale veri; mount, window focus veya reconnect gibi varsayılan refetch koşullarında yenilenebilir. Bu “her render’da GET” demek değildir: observer aynı girdiye bakar ve refetch politikası belirli olaylarda işler. Ekranda eski veri kalırken `isFetching` true olabilir.

## Zaman çizelgesinde iki süreyi izleyelim

`staleTime: 60_000` ve `gcTime: 300_000` seçilmiş bir feribot tarifesini düşün. Başarılı cevabın geldiği an t=0 olsun. Component 20 saniyede ayrılır; 40 saniye sonra tekrar açılır. Girdi hâlâ fresh ve bellektedir. Beş dakikaya kadar hiç abone olmazsa garbage collection girdiği silebilir. Yedi dakikada açılırsa önceki girdi yoktur; veri yeniden alınır.

| Zaman | Abone var mı? | Veri yaşı | Cache durumu | Muhtemel UI / ağ |
|---|---:|---:|---|---|
| t=0, cevap geldi | Evet | 0 sn | Fresh | Yeni veri gösterilir |
| t=20 sn, ekran ayrıldı | Hayır | 20 sn | Inactive, fresh | `gcTime` sayacı başlar |
| t=40 sn, geri dönüldü | Evet | 40 sn | Fresh, abone var | Cache gösterilir; mount refetch gerekmez |
| t=90 sn, ayrıldı | Hayır | 90 sn | Inactive ve stale | Cache durur; stale girdi hâlâ okunabilir |
| t=110 sn, geri dönüldü | Evet | 110 sn | Stale | Eski değer anında görünebilir, arka planda GET gider |
| 5 dakika boyunca abone yok | Hayır | — | GC | Girdi silinir |

Bu tabloda süreleri ekran kapanınca başlatmadık. `staleTime` cevabın yaşıyla, `gcTime` ise son abonenin ayrılmasıyla ilgilidir. Kullanıcı t=40’ta geri geldiğinde cache’deki değer varsa boş ekrana düşmez. Kullanıcı t=110’da döndüğünde de veri tamamen atılmış değildir; Query önce sonucu sunup ardından yenileme gösterebilir.

### Query cache ile HTTP cache aynı şey değil

Sinema’da browser HTTP cache’i ile Query cache’ini aynı katman sanmak kolaydır. HTTP cache, HTTP yanıt başlıklarıyla tarayıcının istek/cevap alışverişini yönetir; `Cache-Control`, `ETag`, `If-None-Match` ve `304 Not Modified` gibi kurallar burada çalışır. Query cache ise JavaScript çalışma alanında key’lerle veriyi component’ler arasında tutar ve hangi observer’ın hangi girdiye abone olduğunu bilir.

![HTTP cache tazelik ve ETag doğrulama kararını gösteren diyagram](diagram:http-onbellek-karari)

Bir `GET /api/harbors/north` isteğinde Query cache önce kendi `['harbors','north']` girdisine bakar. Stale ise query function `fetch` çağırır. Tarayıcı bu HTTP isteğini kendi HTTP cache kurallarıyla karşılayabilir veya ağa gönderebilir. Yani Query refetch’i başlattı diye mutlaka yeni byte’lar iner demek değildir; HTTP katmanı doğrulama sonucunda 304 alıp saklı gövdeyi kullanabilir. Tersi de geçerli: HTTP cache 200 yanıtını hızla verse bile Query’nin stale kararına göre query function yine çağrılmıştır.

Query’nin `staleTime` değeri `Cache-Control: max-age` başlığını değiştirmez. `gcTime` browser disk cache’ini silmez. İki cache’in anahtarı ve ömrü de farklıdır: HTTP cache HTTP request özelliklerine, Query cache kendi `queryKey` değerine göre sonuç ilişkilendirir. Arama parametresi Query key’de eksikse HTTP cache doğru ayrı URL’leri tutsa bile React component yanlış Query girdisini okuyabilir.

### Kırık örnek: iki süreyi tek ayar san

```ts
const options = {
  queryKey: ['harbors', 'north'],
  queryFn: getHarborReading,
  gcTime: 60_000,
}
```

Bu ayar cache girdisini 60 saniye taze tutmaz. `staleTime` belirtilmediği için cevap hemen stale sayılır. Kullanıcı geri döndüğünde girdi hâlâ bellekte olsa da uygun bir refetch olayı yeni isteği başlatabilir.

### Düzeltilmiş örnek: her süreye gerekçeli değer ver

```ts check
import { queryOptions } from '@tanstack/react-query'

type Tide = { station: string; meters: number }
declare function getTide(station: string): Promise<Tide>

const tideOptions = (station: string) =>
  queryOptions({
    queryKey: ['tides', station] as const,
    queryFn: () => getTide(station),
    staleTime: 45_000,
    gcTime: 240_000,
  })
```

Burada 45 saniye boyunca veri taze kabul edilir. Son abone ayrıldıktan sonra girdi dört dakika bellekte kalabilir. Bunlar ürün kararıdır: gelgit bilgisi ile nadiren değişen liman kodu aynı yenileme hızına sahip olmak zorunda değildir.

## Sınır durumları ve sık hatalar

:::mistake[Stale diye eski veriyi gizlemek]
**Belirti:** Her dönüşte tam sayfa spinner görünür. → **Neden:** Stale “kullanılamaz” diye yorumlanmıştır. → **Düzeltme:** Cache’deki `data` varsa göster; `isFetching` ile arka plan yenilemesini küçük biçimde belirt.
:::

:::mistake[gcTime’ı yenileme aralığı sanmak]
**Belirti:** Ekip `gcTime`’ı artırır ama stale liste mount sırasında yine istek yapar. → **Neden:** Bu ayar inactive girdinin silinmesini geciktirir, tazeliği değiştirmez. → **Düzeltme:** Veri ne kadar süre yeni sayılmalı sorusu için `staleTime` kullan.
:::

:::mistake[Etkin query’nin GC olmasını beklemek]
**Belirti:** Sayfa açıkken süre dolmasına rağmen veri silinmez. → **Neden:** Query’ye abone component vardır; query inactive değildir. → **Düzeltme:** `gcTime` kararını yalnızca abone kalmadığı durum için düşün.
:::

:::mistake[HTTP max-age ile staleTime’ı eşitlemek]
**Belirti:** Header’da `max-age=300` yazdığı hâlde component yeni GET çağrısı yapıyor. → **Neden:** İki ayrı cache ve iki ayrı freshness kuralı karıştırılmıştır. → **Düzeltme:** Network’te uygulama çağrısını ve HTTP cache sonucunu ayrı incele; her katmanın davranışını kendi aracıyla ayarla.
:::

:::sector
Ekipler süreleri rastgele kopyalamak yerine endpoint’in yenilenme ihtiyacını kayda alır. Değişken dashboard verisi için kısa, ayda bir değişen sözlük verisi için uzun `staleTime` uygun olabilir. `gcTime` ise kullanıcı geri döndüğünde bellekte ne kadar süre hızlı dönüş sağlanacağına göre seçilir.
:::

## Özet

- `staleTime` cevap tazeliğini, `gcTime` inactive cache girdisinin bellekte kalmasını belirler.
- Stale veri görünür kalabilir; tazelik refetch kararını, GC ise silme zamanını etkiler.
- Varsayılan `staleTime` sıfır, `gcTime` beş dakikadır.
- Query cache key’leri uygulama verisini tutar; HTTP cache request/response başlıklarıyla çalışır.
- Query refetch’i, browser’ın mutlaka yeni gövde indirdiği anlamına gelmez.

**Kendini yokla:** 90 saniyede geri dönülen veri 60 saniyelik `staleTime`’ı aşmış ama `gcTime` içindeyse ne olabilir? HTTP `304` ile Query cache’te stale olma arasındaki fark nedir?

**Yanıt:** Eski data hemen görünebilir ve arka planda refetch başlayabilir. `304`, HTTP katmanında gövdenin değişmediğini söyler; stale ise Query cache’in veriyi yenileme adayı saydığını belirtir.
