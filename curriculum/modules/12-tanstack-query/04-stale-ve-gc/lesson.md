---
title: "Query cache’in tazelik ve bellek saatleri"
minutes: 16
kind: concept
---

# Query cache’in tazelik ve bellek saatleri

Bir önceki derste aynı key’in aynı cevabı seçtiğini gördün. Cache’te bir cevap bulunması, onun ne kadar süre yeni sayılacağını veya ekrandan ayrıldıktan sonra ne zaman silineceğini henüz söylemiyor. Bu iki kararı ayrı ayrı vereceğiz.

## Cache’teki cevap hemen eski mi?

Bir film türü listesini `useQuery` ile okuduğunu düşün. TanStack Query’de varsayılan `staleTime` sıfırdır: cevap geldiği anda **stale**, yani yenilenmeye uygun kabul edilir. Stale olmak “ekranda kullanma” demek değildir. Mevcut cevabı gösterip uygun bir olayda arka planda tekrar isteyebilirsin.

```tsx
const movies = useQuery({
  queryKey: ['movies', 'genre', 18],
  queryFn: () => getMoviesByGenre(18),
})
```

İlk isteğin cevabı cache’e geldikten sonra veri gösterilir. Varsayılan `staleTime: 0` yüzünden cevap stale sayılır; component yeniden mount olunca, pencereye dönünce veya bağlantı yeniden kurulunca varsayılan refetch davranışı yeni istek başlatabilir. Bu, her render’da GET atıldığı anlamına gelmez; yenileme belirli olaylara bağlıdır.

## Veriyi bir süre taze tut

Film kataloğu birkaç saniyede bir değişmiyorsa, her dönüşte tekrar istek yapmak gereksiz olabilir. `staleTime`, cevabın alındıktan sonra ne kadar süre taze kabul edileceğini belirtir. Şimdi aynı query’ye 60 saniye ekleyelim:

```tsx
const movies = useQuery({
  queryKey: ['movies', 'genre', 18],
  queryFn: () => getMoviesByGenre(18),
  staleTime: 60_000,
})
```

`60_000` milisaniye, yani 60 saniyedir. Cevap geldikten sonraki ilk 60 saniyede aynı key’e geri dönülürse Query taze cache verisini gösterir ve varsayılan mount refetch’i gerekmez. Süre geçince cevap stale olur; stale cevap yine görünür, ancak refetch için uygun bir olay gerçekleşirse yenileme başlar.

Bir film başlığı yüklenirken bekleme ve yenilemeyi zamanla şöyle okuyabilirsin:

| An | Query cache | Görünür durum | Neden? |
|---|---|---|---|
| İlk açılış | Bu key’de cevap yok | `isPending` doğru olabilir | Henüz gösterilecek data yok |
| İlk istek bitti | Cevap yeni geldi | Data gösterilir, `isFetching` false | Query sonucu hazır |
| 30 saniye sonra geri dönüş | Cevap fresh | Eski cevap anında gösterilir | 60 saniyelik `staleTime` dolmadı |
| 90 saniye sonra geri dönüş | Cevap stale ama var | Eski cevap görünürken `isFetching` true olabilir | Mount’ta arka plan refetch başlar |

Bu tabloda stale cevap silinmedi. Sadece yeni istek gerekip gerekmediğine dair karar değişti. Eski veri varsa içeriği görünür tutabilir, yenilenirken daha küçük bir işaret gösterebilirsin.

## Component gidince bellek süresi başlar

Şimdi başka bir saat var: son observer ayrıldıktan sonra cache girdisi ne kadar süre bellekte kalsın? **Inactive query**, artık kendisini izleyen bir observer’ı olmayan query’dir; yani o key’i kullanan component kalmamıştır. `gcTime`, inactive girdinin bellekte kalma süresidir. GC, “garbage collection” kısaltmasıdır ve burada süresi dolan kullanılmayan girdinin silinmesini anlatır.

Örneğe `gcTime: 300_000` ekleyelim. Bu ayar beş dakika boyunca kullanılmayan cache girdisinin hemen silinmesini önler:

```tsx
const categoryMovies = useQuery({
  queryKey: ['movies', 'category', 'festival'],
  queryFn: () => getCategoryMovies('festival'),
  staleTime: 60_000,
  gcTime: 300_000,
})
```

`gcTime` yalnızca query inactive olduktan sonra işlemeye başlar. Component açık ve key’e bakıyorsa süre dolsa bile query kullanılmaktadır. Ekrandan ayrılıp beş dakika boyunca geri dönmezsen girdi silinir; sonra açılışta cache cevabı yoktur ve yeni istek gerekir. `staleTime` ile `gcTime` birbirinin yerine geçmez: biri “ne zamana kadar taze?”, diğeri “kimse okumazken ne kadar tut?” sorusunu yanıtlar.

Aynı cevabın 60 saniyelik `staleTime` ve beş dakikalık `gcTime` ile zaman çizgisini izleyelim:

| Zaman | Observer var mı? | Cevap yaşı | Cache durumu | Ekran / istek |
|---|---:|---:|---|---|
| t=0, cevap geldi | Evet | 0 sn | Fresh | Yeni cevap gösterilir |
| t=20 sn, ekrandan ayrıldı | Hayır | 20 sn | Inactive, fresh | `gcTime` sayacı başlar |
| t=40 sn, geri döndü | Evet | 40 sn | Fresh, aktif | Cevap gösterilir, mount refetch gerekmez |
| t=90 sn, yeniden ayrıldı | Hayır | 90 sn | Inactive, stale | Cevap bellekte durur, silinmez |
| t=110 sn, geri döndü | Evet | 110 sn | Stale, aktif | Eski cevap görünür, arka planda GET başlayabilir |
| 5 dakika boyunca kimse dönmedi | Hayır | — | GC ile silindi | Sonraki açılış yeni istek yapar |

![TanStack Query cache girdisinin fetching, fresh, stale, inactive ve gc aşamalarını gösteren diyagram](diagram:query-onbellek-yasam-dongusu)

Saatleri ayırmak doğru tahmin yapmanı sağlar. Cache girdisi `staleTime` dolunca silinmez; `gcTime` ise tazelik kazandırmaz. Ekran tekrar açılınca cevap stale olsa bile hemen gösterilebilir, sonra Query yenileme başlatabilir.

## Süreleri içerik türüne göre seç

Ders örneğindeki festival listesi nadiren güncelleniyorsa `staleTime` birkaç dakika olabilir. Bugünün popüler filmleri hızlı değişiyorsa daha kısa süre seçebilirsin. Süreler kütüphanenin sihirli doğruları değildir; kullanıcının eski veriyi ne kadar süre kabul edebileceğine göre verilir.

:::mistake[Stale veriyi kullanılamaz sanmak]
**Belirti:** Ekrana her dönüşte önce tam sayfa yükleme görünümü gelir. → **Neden:** Stale olmayı cache cevabının yok olması gibi yorumladın. → **Düzeltme:** Cache’te data varsa göster; yenilemeyi `isFetching` ile ayrıca belirtebilirsin.
:::

:::mistake[gcTime’ı tazelik süresi sanmak]
**Belirti:** `gcTime` artırıldığı hâlde stale listeye dönünce yeni istek başlar. → **Neden:** `gcTime` sadece inactive girdinin silinmesini geciktirir. → **Düzeltme:** Cevabın ne kadar süre taze kalacağını `staleTime` ile seç.
:::

:::mistake[Aktif query’nin silinmesini beklemek]
**Belirti:** Sayfa açıkken beş dakika geçiyor ama cevap cache’te duruyor. → **Neden:** Query’yi izleyen observer hâlâ vardır; `gcTime` inactive iken işler. → **Düzeltme:** Bellek süresini son observer ayrıldıktan sonraki süre olarak düşün.
:::

:::info[Derinlemesine (isteğe bağlı)]
Browser’ın HTTP cache’i de istekleri saklayabilir, ama kendi başlık ve doğrulama kuralları vardır; Query’nin `staleTime` ayarı onu değiştirmez. HTTP cache doğrulaması ve `ETag`/`304` davranışını ağ katmanı dersinde göreceksin.
:::

![HTTP cache tazelik ve ETag doğrulama kararını gösteren diyagram](diagram:http-onbellek-karari)

## Özet

- `staleTime` başarılı cevabın ne kadar süre taze sayılacağını belirler; varsayılanı sıfırdır.
- Stale cevap cache’te kalabilir ve yenileme sırasında görünmeye devam edebilir.
- `gcTime`, son observer ayrıldıktan sonra inactive girdinin bellekte kalacağı süreyi belirler.
- `gcTime` dolunca kullanılmayan girdi silinir; `staleTime` dolunca yalnızca tazelik kararı değişir.
- Query’nin stale olması her render’da istek atacağı anlamına gelmez; varsayılan refetch belirli olaylarla başlar.

**Yeni terimler:** stale — yenilemeye uygun sayılan cache cevabı; inactive query — observer’ı kalmamış cache girdisi; GC — süresi dolan kullanılmayan girdiyi bellekten silme.

**Kendini yokla:** Cevap 90 saniyelikken `staleTime` 60 saniye ve `gcTime` 5 dakikaysa geri dönen kullanıcı ne görebilir? `gcTime` sayacı ne zaman başlar?

**Yanıt:** Cache silinmediyse eski cevap hemen görünebilir ve arka planda istek başlayabilir. Sayaç son observer ayrıldığında başlar.
