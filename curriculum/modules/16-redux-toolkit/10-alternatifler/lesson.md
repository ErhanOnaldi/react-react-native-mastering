---
title: "Redux, Query ve Zustand arasında seçim"
minutes: 7
kind: review
---

# Redux, Query ve Zustand arasında seçim

Sinema’da her değer aynı yerde yaşamıyor: film bilgisi sunucudan gelir, seçtiğin tema uygulamanın tercihidir, arama adres çubuğunda paylaşılabilir. Önce verinin sahibini bul; sonra o işi üstlenecek aracı seç. Bir kütüphaneyi sırf projede zaten var diye her state’e yayma.

:::model[State sahipliği]
Sunucu yanıtı Query cache’inde yaşar; uygulamanın ortak client tercihi Redux Toolkit store’unda yaşayabilir. Paylaşılabilir navigasyon URL’de, düzenlenmekte olan form değeri React Hook Form’da kalır. Araç seçimi bu sınırları değiştirmek için gerekçe değildir.
:::

## Tek bir sunucu yanıtı için tek cache

Sinema’daki film detayları TanStack Query’den geliyor olsun. `Cache`, daha sonra tekrar kullanılabilsin diye saklanan yanıt kopyasıdır. Aynı cevabı bir de Redux state’ine kopyalarsan iki ayrı cache’in güncel kalmasını sağlaman gerekir.

```ts title="Aynı veriye iki sahip atama"
const queryMovie = useQuery({ queryKey: ['movie', movieId], queryFn: loadMovie })
// Aynı film nesnesini ayrıca Redux state'ine kopyalama.
```

Query yanıtın sahibiyse ekran onu Query’den okur. Redux’a aynı nesneyi kopyalamak ikinci bir cache yaratır; biri yenilenip diğeri eski kalabilir.

## Sunucu ve client state yan yana olabilir

Şimdi kullanıcı tema tercihini de değiştirebiliyor. Bu değer film API’sinden gelmiyor, dolayısıyla Query’nin işi değil; ortak kullanılacaksa client store’da tutulabilir.

```ts title="Farklı sahipler, ayrı değerler"
const movie = useMovieQuery(movieId) // Sunucu verisi
const theme = useAppSelector(state => state.ui.theme) // Kullanıcı tercihi
```

İki araç aynı uygulamada yan yana durur çünkü farklı sorumlulukları var. Query film yanıtının güncelliğini yönetirken store uygulama tercihine sahip olur.

## Paylaşılabilir filtreyi URL’ye bırak

Son olarak kullanıcı film türü filtresini bir arkadaşına göndermek istiyor. Filtrenin URL’de olması bağlantıyı açan kişiye aynı seçimi verir ve geri tuşu önceki seçime döner.

```ts title="Navigasyon seçimi URL'de"
const [params, setParams] = useSearchParams()
const genre = params.get('genre') ?? 'all'
```

Bu örnekte tek ekran bile Query, store ve Router kullanabilir. Her state’i tek store’da toplamak, paylaşım ve cache davranışını kaybettirir.

## Üç kararı karşılaştır

| İhtiyaç | Başlangıç seçimi | Neden? |
| --- | --- | --- |
| Sunucudan gelen film listesi, loading/error ve yenileme | TanStack Query | Yanıtın kaynağı sunucudur |
| Uygulamanın birçok yerinde kullanılan tema | Redux Toolkit | Ortak client state ve açık geçişler gerekir |
| Geri tuşuyla dönülmesi ve bağlantıda paylaşılması gereken tür | Router URL state | Seçim gezinme geçmişinin parçasıdır |
| Küçük bir uygulamada birkaç ortak client değeri | Zustand düşünülebilir | Daha az kurulum yeterli olabilir |

RTK Query, Redux Toolkit içindeki server API cache aracıdır. TanStack Query’den buna geçmek istiyorsan aynı endpoint’lerin cache sahipliğini birlikte taşı; ikisini aynı yanıtın iki ayrı kopyasını tutmak için ekleme.

## Hata: aynı API verisi iki cache’e kopyalanıyor

Belirti: bir ekranda film bilgisi yeniyken, başka ekranda eski kalıyor. Nedeni, TanStack Query ve Redux’un aynı film cevabını bağımsız yönetmesi. Düzeltme: her server endpoint için tek cache sahibi seç; RTK Query’ye geçiş düşünüyorsan geçişi tutarlı tamamla, aynı endpoint’leri iki cache’te sürdürme.

Zustand küçük client state’i daha az kurulumla paylaşmak için bir seçenek olabilir. Redux’un middleware ve DevTools düzenini kendiliğinden sağlamaz; araç seçimini gereken ekip akışına göre yap.

:::info[Derinlemesine (isteğe bağlı)]
Bir mimari kararı yazılı kayda geçirmek için kullanılan kısa belgeye ADR (Architecture Decision Record) denir. Seçimi, gerekçeyi ve gözden geçirme koşulunu not eder; küçük bir uygulamada ayrıca belge açmak şart değildir.
:::

## Özet

- Önce state’in kaynağını ve ömrünü belirle.
- Aynı server yanıtının tek cache sahibi olsun.
- URL paylaşılabilir navigasyon state’i, store ortak client state’i taşır.
- Zustand küçük ve sade client store’u için değerlendirilebilir; seçim bağlama bağlıdır.

**Yeni terimler:**
- `cache`: Sonraki okumada kullanılabilmesi için saklanan veri kopyası.
- `RTK Query`: Redux Toolkit içindeki server API verisini cache’leyen araç.
- `ADR`: Bir mimari kararı ve gerekçesini kaydeden kısa belge.

**Kendini yokla:** Query kullanan bir uygulama Redux Toolkit de kullanabilir mi?  
*Cevap:* Evet; Query server state’i, Redux ise ortak client state’i yönetebilir.

**Kendini yokla:** Tür filtresi geri tuşuyla değişmeli ve bağlantıda paylaşılmalıysa nerede yaşamalı?  
*Cevap:* URL’de.
