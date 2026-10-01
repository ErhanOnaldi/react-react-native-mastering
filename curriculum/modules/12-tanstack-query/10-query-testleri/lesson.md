---
title: "Query kullanan arayüzü izole test et"
minutes: 15
kind: concept
---

# Query kullanan arayüzü izole test et

Basit bir component’i daha önce Testing Library ile render edip ekranda metin aradın. `useQuery` kullanan component de test edilebilir; farkı, bir Query provider’ına ve çalışacağı bir cache’e ihtiyaç duymasıdır. Önce görünür durumları, sonra isteğin nasıl kontrol edildiğini, en son testlerin birbirinden nasıl ayrıldığını kuralım.

## İlk olarak ekranda ne göründüğünü doğrula

Query isteği tamamlanana kadar component yükleniyor metni gösterebilir. İlk render senkron gerçekleştiği için bu anlık metni `getByText` ile okuyabilirsin. `getBy...`, o anda DOM’da arar ve öğe yoksa hemen hata verir.

```tsx
function FeaturedFilm() {
  const film = useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: getFeaturedFilm,
  })

  if (film.isPending) return <p>Öne çıkan film yükleniyor</p>
  if (film.isError) return <p role="alert">Film alınamadı</p>
  return <h2>{film.data.title}</h2>
}
```

Bu component’in ilk anda yükleme cümlesi göstermesi, query cevabının henüz gelmemiş olmasından kaynaklanır. Bir testte bu cümleyi render’dan hemen sonra ararsın. Başarılı cevapla gelecek başlık için aynı şeyi yapamazsın; istek ve React güncellemesi henüz tamamlanmamış olabilir.

## Sonradan gelen cevabı bekle

`findBy...`, DOM öğesi görünene kadar bekleyen Testing Library sorgusudur. Önceki örneğe bir test yazdığını düşün: sahte değil, uygulamanın gerçek query function’ı çalışır; HTTP isteğini MSW yakalar. MSW, testte ağ isteğine belirlenmiş cevap döndüren araçtır.

```tsx
render(<FeaturedFilm />, { wrapper: filmQueryWrapper })

expect(screen.getByText('Öne çıkan film yükleniyor')).toBeInTheDocument()
expect(await screen.findByRole('heading', { name: 'Kayıp Balık' })).toBeInTheDocument()
```

İlk assertion render anındaki senkron yükleme metnini okur; ikinci assertion API cevabından sonra oluşacak başlığı bekler. `getByRole` ile başlığı anında ararsan test, istek bitmeden düşebilir. Burada component’i saran `filmQueryWrapper`, Query provider’ını içeriğiyle birlikte render’a verir.

MSW handler’ında cevap olarak `Kayıp Balık` döndürdüğünde gerçek `fetch` isteği dış ağa çıkmaz. Query function, cache ve component yine birlikte çalışır; test yalnızca ağ sınırını kontrol eder. Böylece sadece JSX’e elle hazırlanmış bir sonuç vermek yerine, yükleme ve başarı akışını da gözlersin.

![TanStack Query'nin ağ çağrısını MSW ile yakalanan cevap üzerinden cache'e taşımasını gösteren diyagram](diagram:msw-perdesi)

## Hata yanıtını da kullanıcı davranışı olarak test et

Başarılı cevaba ek olarak API’nin hata döndürdüğü akışı düşün. Testte MSW handler’ı 500 yanıtı verir; component’in kullanıcıya sunduğu uyarıyı ararsın.

```tsx
server.use(
  http.get('/api/movies/featured', () =>
    HttpResponse.json({ message: 'Sunucu hatası' }, { status: 500 }),
  ),
)

render(<FeaturedFilm />, { wrapper: filmQueryWrapper })
expect(await screen.findByRole('alert')).toHaveTextContent('Film alınamadı')
```

Query function başarısız HTTP yanıtında hata üretiyorsa component hata dalına geçer ve `role="alert"` uyarısı görünür. Bu test kullanıcının gördüğü sonucu doğrular. Query’nin içindeki `isError` değerini ayrıca test etmek gerekmez; görünen hata aynı davranışı daha doğrudan anlatır.

## Her testin kendi cache’i olsun

Query client, cache ve query varsayılanlarını yöneten nesnedir. Bir testten ötekine aynı client’ı verirsen önceki cevap yeni teste taşınabilir. Testin dışından bakınca bu, testlerin çalıştırılma sırasına göre başlık ya da istek sayısının değişmesi gibi görünür.

Testlerin sınırında **izolasyon**, yani bir senaryonun verisinin diğerine karışmaması, her testte yeni bir client oluşturarak sağlanır. `QueryClientProvider` bu client’ı component ağacına verir. Teste özel wrapper, `render` sırasında Query isteyen component’i provider içine yerleştiren küçük bir component’tir.

```tsx
const client = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```

Bu parça provider’ı gösteriyor; gerçek test yardımcısında client oluşturmayı dosya seviyesine değil, yardımcının her çağrısına koymalısın. Böylece iki render iki farklı cache alır. Ayrıca test ortamında `retry: false` seçmek, query başarısız olduğunda otomatik tekrar denemeleri beklemeden hatayı görmeni sağlar.

Yardımcı, client’a ek olarak Testing Library `render` sonucunu da korursa test `rerender` ile yeni props verebilir, `unmount` ile component’i kaldırabilir.

İstek, cevap ve ekrandaki değişimi şu sırayla izleyebilirsin:

| Sıra | Ne olur? | Nereden anlarsın? |
|---:|---|---|
| 1 | Test yeni Query client ve provider oluşturur | Önceki testten cache cevabı taşınmaz |
| 2 | Testing Library component’i render eder | Senkron yükleme metni görünür |
| 3 | Query function `fetch` çağırır | İstek MSW handler’ına ulaşır |
| 4 | Handler başarı veya hata cevabı döndürür | Query uygun sonuca geçer |
| 5 | React component’i yeni sonuçla render eder | Başlık ya da alert görünür |
| 6 | Test `findBy...` ile bekler | Asenkron kullanıcı görünümü doğrulanır |

Her adım bir sonrakini tetikler: render isteği başlatır, cevap Query cache’ine yazılır ve React ekrandaki durumu günceller. O yüzden ağın tamamlanmasını beklemeden istek sayısı okumak bazen sıfır görür; önce ekrandaki cevabı bekle, sonra o istek akışıyla ilgili sayımı kontrol et.

Arama sonucundan başka bir görünüme geçince sonuç component’i ağaçtan ayrılabilir. Query cache’i component’ten ayrı yaşar: aynı arama key’iyle geri dönüp sonuç component’i yeniden bağlanırsa, veri `staleTime` içinde tazeyse başlıklar tekrar gösterilir ve yeni istek gerekmez. Arama metni değiştiğinde key de değiştiği için yeni cevap alınır.

| Akış adımı | Query durumu | Beklenen ağ davranışı |
|---|---|---|
| “Dövüş” araması açılır | `['movies', 'search', 'Dövüş']` yüklenir | Bir arama isteği |
| Sonuçtan film bilgisine geçilir | Arama component’i unmount olur; cache kalır | Yeni arama isteği yok |
| Aynı aramaya geri dönülür | Aynı key’e yeniden bağlanır | Veri tazeyse yeni istek yok |
| Arama “Matrix” olur | Farklı key kullanılır | Matrix için yeni istek |

Bu akışta ekranın görünür olup olmamasından çok query key’i ve tazelik önemlidir. Component’in ağaçtan ayrılması cache’i silmez; testte görünüm değişimini ve istek sayısını ayrı ayrı kontrol edebilirsin.

## Sık hata: tek client’ı test dosyasında paylaşmak

Şu client dosyanın tepesinde oluşturulursa bütün testler aynı cache’i kullanır:

```tsx
const sharedClient = new QueryClient()
```

Belirti, ikinci testte başlık hemen görünmesi ve yeni HTTP isteği hiç çıkmaması olabilir. Çünkü aynı key’in cevabı birinci testten kalmıştır. Client’ı her render helper çağrısında üret; testte hata akışını da tahmin edilebilir tutmak için query retry’ını kapat.

Asenkron beklentide de benzer bir tuzak vardır. **Belirti:** `getByRole('heading')` bazen cevap gelmeden hata verir. **Neden:** `getBy...` beklemez. **Düzeltme:** Sonradan beliren başlıkta `findByRole`, ilk anda bulunan yükleme mesajında `getByText` kullan.

## Aklında kalsın

- Query kullanan component testinde provider ve Query client gerekir.
- Her test için yeni client oluştur; böylece cache testler arasında sızmaz.
- Test client’ında retry kapatmak hata akışını beklenebilir kılar.
- MSW gerçek `fetch` çağrısını testte yakalar; test dış API’ye çıkmaz.
- Senkron ilk görünüm için `getBy`, sonradan gelen görünüm için `findBy` kullan.

**Yeni terimler**

- **Test izolasyonu:** Bir testin cache ve ağ senaryosunun başka testi etkilememesi.
- **Wrapper:** Test edilen component’i ihtiyaç duyduğu provider’larla saran component.
- **MSW:** Testte HTTP isteklerini yakalayıp belirlediğin cevabı döndüren araç.
- **`findBy`:** DOM’da sonradan belirecek öğeyi bekleyerek bulan Testing Library sorgusu.

**Kendini yokla:** Başlık API cevabından sonra görünüyorsa `getBy` mı `findBy` mı seçersin? Neden her test için yeni client oluşturursun?

**Yanıt:** `findBy` seçersin; cevap asenkron gelir. Yeni client, önceki testin cache’inin cevabı veya istek davranışını değiştirmesini engeller.

:::info[Derinlemesine (isteğe bağlı)]
`waitFor` birden fazla DOM güncellemesinden sonra bir assertion’ı yeniden denemek için kullanılabilir; içine assertion dışında etkileşim veya yan etki koyma. QueryClient’ı temizlemektense test başına yenisini kurmak, observer ve retry durumlarının da test sınırını aşmamasını sağlar.
:::
