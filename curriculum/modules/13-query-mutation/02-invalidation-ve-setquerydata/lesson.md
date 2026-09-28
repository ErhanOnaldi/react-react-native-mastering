---
title: "Mutation sonrası cache’i uzlaştır"
minutes: 13
kind: concept
---

# Mutation sonrası cache’i uzlaştır

:::pain[Problem]
Bir duyuruya “katılıyorum” dedin; sunucu 201 döndürdü ve toast çıktı. Katılımcı sayfasına geçtiğinde sayı hâlâ 18. Başka ekranda aynı query cache’ten okunduğu için eski cevap görünmeye devam ediyor.
:::

## Sunucuda yazmak cache’i değiştirmez

Query key, bir okumanın kimliğidir. Örneğin `['events', 'attendees', eventId]` belirli bir etkinliğin katılımcı listesini, `['events', 'detail', eventId]` ise etkinliğin ayrıntısını temsil edebilir. Mutation bu key’leri bilmez; yalnızca kendisine verilen fonksiyonu ve değişkenleri bilir. POST başarılı diye Query, hangi cache kayıtlarının artık yanlış olduğunu tahmin etmez.

Burada 12. modülde kurduğun cache yaşam döngüsü önemlidir. Bir query’nin `stale` olması ile ekrandaki verinin değişmesi aynı şey değildir. Aktif observer varsa invalidation yeniden fetch başlatabilir; cache’deki eski değer yeni cevap gelene kadar gösterilebilir. Inactive bir query stale olarak işaretlenir ama o anda ekranda olmadığı için hemen ağ isteği görmeyebilirsin.

Bu derste ortak modelin tam sırası kuruluyor. Mutasyonun başarı cevabından sonra ya etkilenen query’leri invalidation ile sunucuya tekrar sorarsın ya da elindeki kesin cevabı `setQueryData` ile cache’e yazarsın. İkinci yol daha hızlıdır; fakat eksik veya tahmini veri yazarsan cache’i yanlış hale getirirsin.

## Mutation ile okuma arasındaki uzlaşma

![Mutation, sunucu, invalidation ve rollback sırası](diagram:mutation-ve-invalidation)

Kurallar:

1. Mutation yalnızca sunucu yazma işini bilir; etkilenen query key’lerini otomatik çıkarmaz.
2. `invalidateQueries({ queryKey })` eşleşen cache girdilerini stale işaretler. Varsayılan olarak aktif eşleşmeler arka planda yeniden alınır.
3. Key eşleşmesi önek tabanlıdır. `['events']`, bu key ile başlayan liste ve detay sorgularını eşleyebilir; `exact: true` yalnız tam key’i hedefler.
4. İlgisiz query’leri yenilememek için mümkün olan en dar anlamlı key’i seç.
5. `setQueryData(key, updater)` mevcut cache değerini senkron ve immutable biçimde değiştirir. Cache yoksa updater’a `undefined` gelebilir.
6. Sunucu cevabı listeyi eksiksiz ve doğru temsil ediyorsa doğrudan yazmak uygundur. Sıralama, toplam sayfa veya türetilmiş alanlar belirsizse invalidation daha güvenlidir.
7. `onSuccess` içinden invalidation Promise’ini döndürürsen mutation pending durumu yeniden fetch tamamlanana kadar sürer.

Örnek bir başarı callback’i şöyledir:

```ts
onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events', 'attendees', eventId] })
```

`invalidateQueries` tek başına sunucudan “hemen ve her durumda” okuma garantisi değildir. Aktif query’ler yeniden alınır; inactive query’ler sonraki kullanımda stale oldukları için yenilenir. İhtiyaç yalnız cache’i doğru işaretlemekse callback’in await edilmesi şart değildir; düğmenin pending durumunu güncel veri gelene kadar sürdürmek istiyorsan Promise’i döndür.

## Bir başarılı yazmayı zaman içinde izleyelim

Etkinlik kimliği `ev-27`, katılımcı query key’i `['events', 'attendees', 'ev-27']` olsun. Cache’te 18 kişi var.

| Zaman | Sunucu | Query cache | Ekran |
| --- | --- | --- | --- |
| t0 | Yeni istek yok | 18 kişilik sonuç | “18 katılımcı” |
| t1 | POST başlar | Değer hâlâ 18 | Buton pending görünür |
| t2 | POST 201 döner | Hâlâ 18 | Başarı callback’i çalışır |
| t3 | GET başlar | Eski 18 korunabilir | İsteğe göre yenileniyor işareti |
| t4 | GET 19 döner | Yeni sonuç cache’e yazılır | “19 katılımcı” |

Buradaki geçici eski değer hatalı bir kalıcı sonuç değildir; yeni okuma tamamlanana kadar eldeki son cevaptır. Ürünün davranışı bunu saklamalı mı, “yenileniyor” göstermeli mi, yoksa sayacı hemen artırmalı mı karar vermelidir.

## Önce kırık, sonra iki geçerli tercih

Kırık akış yalnızca POST yapar. UI yerel mesaj gösterse de ortak query cache’inde 18 kalır:

```ts
const mutation = useMutation({ mutationFn: joinEvent })
// Başarıda ilişkili query için bir işlem yok.
```

Aktif ekranları sunucuya tekrar sordurmak çoğu zaman daha güvenlidir:

```tsx check
import { useMutation, useQueryClient } from '@tanstack/react-query'

type JoinInput = { clubId: number; memberId: number }
declare function joinClub(input: JoinInput): Promise<void>

export function JoinClubButton({ clubId, memberId }: JoinInput) {
  const client = useQueryClient()
  const join = useMutation({
    mutationFn: joinClub,
    onSuccess: () => client.invalidateQueries({ queryKey: ['clubs', clubId, 'members'] }),
  })
  return <button onClick={() => join.mutate({ clubId, memberId })}>Kulübe katıl</button>
}
```

İşlem cevabı kesin yeni sayıyı taşıyorsa, aynı key’i doğrudan güncellemek ek GET’i kaldırabilir. Ancak nesne ve dizileri yerinde değiştirme:

```ts
client.setQueryData<Member[]>(['clubs', clubId, 'members'], (old) =>
  old ? [...old, confirmedMember] : old,
)
```

`old` yokken boş dizi yaratmadık. Bu query daha önce hiç yüklenmediyse, yalnız mutation’a bakarak eksiksiz liste kurduğumuzu söyleyemeyiz. Aynı kişinin zaten listede bulunması olasıysa ekleme öncesi kimlik kontrolü gerekir. Sayfalı listelerde hangi sayfaya ve toplam sayaca yazılacağı da ayrıca çözülmelidir.

Birden fazla liste aynı kaydı farklı biçimde gösterebilir. Etkinlik sayfası yalnız ilk 20 katılımcıyı, profil ekranı ise kullanıcının bütün etkinliklerini tutabilir. Yeni katılımcıyı iki cache’e aynı şekilde eklemek, sıralama veya filtre koşullarını ihlal edebilir. Bu durumda query key ailesini invalidate etmek daha az yerel kodla doğru sunucu cevabına döner.

Key seçimi veri modelinin parçasıdır. `['events', 'attendees', eventId]` ile `['events', 'attendees', eventId, page]` hiyerarşisi, tek etkinliğin bütün sayfalarını hedeflemeyi mümkün kılar. Fakat `['events']` bütün etkinlik cache’lerini kapsayacağından yalnız tek bir kayıt değişti diye bu kadar geniş invalidation gereksiz istek üretebilir. Key fabrikası kullanıyorsan invalidation da aynı fabrikadan gelen key’i kullanmalı; benzer görünen stringleri elle tekrar yazmak yazım hatasına açıktır.

Invalidation tamamlandığında `invalidateQueries` Promise’i çözülür; aktif eşleşen query’lerin refetch işi bitmiş olur. Bir mutation’ın `isPending` görünümünü bu süreye bağlamak istiyorsan callback’ten Promise’i return et. Callback içinde `void client.invalidateQueries(...)` yazmak beklemeyi koparır. Bu seçimi kullanıcı deneyimine göre yap: kısa güncellemede kaydet düğmesini açık tutmak güven verir, uzun liste yenilemesinde POST tamamlanınca düğmeyi açıp ayrı bir yenileniyor göstergesi vermek daha uygundur.

:::mistake[Her şeyi invalidate etmek]
Belirti → Tek katılım sonrası DevTools’ta film, profil ve arşiv query’leri de GET atıyor. Neden → `invalidateQueries()` filtresiz çağrıldı. Düzeltme → Etkilenen kaynağın key ailesini ver; tüm etkinlik sayfaları etkileniyorsa `['events', eventId]` gibi ortak bir önek seç.
:::

:::mistake[Cache’i yerinde değiştirmek]
Belirti → Bir ekranda sayı güncelleniyor, diğer observer yeni değeri görmüyor. Neden → Mevcut array veya item doğrudan mutate edildi. Düzeltme → Yeni array ve değişen öğe için yeni object üret.
:::

:::mistake[Kesin olmayan cevabı cache’e yazmak]
Belirti → Yeni katılımcı listenin sonunda yanlış sırada veya eksik alanlarla çıkıyor. Neden → POST yalnızca `{ success: true }` döndürürken istemci eksik `Member` nesnesi uydurdu. Düzeltme → Listeyi invalidate et veya API’den listeye uygun tam cevabı al.
:::

:::model[Query cache yaşam döngüsü]
Cache verisi `fresh`, `stale` veya `inactive` olabilir; stale olmak silinmek anlamına gelmez. Invalidation bu yaşam döngüsünde tazelik kararını değiştirir. Aktif query yeni cevabı alana kadar eski veriyi gösterebilir; mutation callback’inin Promise’ini döndürmek pending göstergesini bu yenilemeye bağlar.
:::

:::sector
Ekipler query key fabrikalarını yazma akışlarıyla birlikte tasarlar: bir kaynağın `all`, `list` ve `detail` key’leri varsa hangi yazmanın hangilerini etkilediği code review’da açıkça görülür. Doğrudan cache yazımında immutable güncelleme, idempotency ve sayfalama davranışı ayrıca gözden geçirilir.
:::

## Özet

- Başarılı mutation, ilgili query cache’ini kendiliğinden düzeltmez.
- Invalidation key eşleşmelerini stale yapar ve aktif query’leri yeniden alır.
- `setQueryData` yalnız eldeki veri eksiksiz ve kesin olduğunda uygundur.
- Immutable güncelle; cache yokken eksik kayıt uydurma.
- Callback Promise’ini döndürmek pending süresini yenilemeye bağlar.

**Kendini yokla:** Aktif olmayan query invalidate edilince hemen GET görür müsün?  
Cevap: Genellikle hayır. Stale işaretlenir; yeniden kullanıldığında yenileme yapılır.

**Kendini yokla:** POST yalnız `{ success: true }` döndürüyorsa listeyi doğrudan eklemek neden risklidir?  
Cevap: İstemci listenin tam alanlarını, sırasını ve sayfalama bilgisini bilmiyor olabilir; invalidation sunucu cevabını yeniden alır.
