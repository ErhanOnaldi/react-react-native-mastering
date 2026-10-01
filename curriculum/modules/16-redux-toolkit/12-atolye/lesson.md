---
title: "State sahipliğini farklı ürünlerde uygula"
minutes: 7
kind: practice
---

# State sahipliğini farklı ürünlerde uygula

Bu atölyede Sinema’dan farklı ekranlarda aynı soruyu tekrar soracaksın: bir bilgi nereden geliyor, kim kullanıyor, ne kadar süre yaşamalı? Her şeyi Redux’a taşımak gerekmiyor. Tek ekrana ait seçim yerel state olabilir; ortak kullanıcı tercihi store’da, sunucu yanıtı Query’de, paylaşılabilir gezinme URL’de durabilir.

:::model[State sahipliği]
Server state’i Query yönetir; URL, paylaşılabilir ve geçmişe yazılan navigasyon seçimlerini taşır. Client state kullanıcıya aittir: tek ekranda yerel kalabilir veya birden çok ekrana paylaşılıyorsa Redux store’da yaşayabilir. Form taslağı RHF’nin sorumluluğudur.
:::

:::model[Redux selector ve snapshot]
Action’dan sonra store o anki state’in yeni bir görünümünü, yani `snapshot` üretir. Selector bileşenin ihtiyacı olan değeri seçer; kullanıcı seçimini geçici liste sırasına değil kalıcı kaydın kimliğine bağla ki liste değişince seçim kaybolmasın.
:::

## Önce kaynağı ayır

Katalogdaki film adları sunucudan gelir. Ekranda “yalnız dramları göster” filtresi seçildiğinde sonuç listesi değişir, ama kullanıcı tercihi olan koyu tema değişmez.

```ts title="Kaynağa göre iki değer"
const movies = useMoviesQuery(genre)
const theme = useAppSelector(state => state.ui.theme)
```

İki değer aynı ekranda bulunabilir; farklı kaynak ve yaşam döngülerine sahip oldukları için ayrı okunurlar. Katalog yenilenince tema state’ini sıfırlamak gerekmez.

## Sonra paylaşım ihtiyacını ekle

Kullanıcı seçtiği türü bağlantı olarak göndermek istiyorsa tür URL’de bulunmalı. Böylece aynı bağlantı tekrar açıldığında seçim de gelir.

```ts title="Paylaşılabilir seçim"
const [params, setParams] = useSearchParams()
const genre = params.get('genre') ?? 'all'
```

URL burada yalnız bir metin saklamıyor; geri/ileri gezinmenin de parçası. Bu değer sadece component içinde tutulursa adresi paylaşan kişi aynı filtreyi göremez.

## En son seçimin ömrünü belirle

Kullanıcının görünüm tercihi yalnız bu ekranda kullanılıyorsa component state yeterli olabilir. Tercih birçok ekranda görünüyorsa ortak store’a taşımak anlamlı hale gelir.

```tsx title="Tek ekrana ait görünüm seçimi"
function CatalogView() {
  const [layout, setLayout] = useState<'list' | 'grid'>('list')
  return <button onClick={() => setLayout('grid')}>Kart görünümü</button>
}
```

Bu örnekte tercih tek component’in ömründe yaşıyor; Redux kurmadan da görünüm değişebilir. State’i global yapmak ancak başka ekranların da aynı tercihi okuması gerektiğinde değer katar.

## Filtre ve sonuç sırasını izle

Arama metni değiştiğinde Query başka sonuç getirebilir. Arama ve sayfa URL’ye yazılırsa geri tuşu önceki sorguya döner; Query cache’i de her parametre bileşimini ayrı sonuç olarak tanır.

| Adım | URL’de | Query sonucu | Kullanıcı ne görür? |
| --- | --- | --- | --- |
| 1 | `genre=drama` | Drama kataloğu yüklenir | Drama filmleri |
| 2 | `genre=comedy` | Komedi için sonuç okunur/yüklenir | Komedi filmleri |
| 3 | Geri tuşu: `genre=drama` | Önceki sorgunun cache’i kullanılabilir | Drama seçimi ve sonuçları geri gelir |

`Query key`, sorguyu tanımlayan girdilerin anahtarıdır; arama veya tür değişince farklı sonuç için farklı key gerekir. Query cache, daha önce alınan server yanıtlarının saklandığı yerdir ve bu yanıtları tekrar kullanarak ekranı hızlandırabilir. `staleTime`, verinin ne kadar süre taze kabul edileceğini belirler; bu süre dolmadan aynı sorguya dönmek çoğu zaman yeni istek gerektirmez.

## Gerçek bir state hatasını fark et

Belirti: tür filtresini değiştirince işaretli film kayboluyor. Nedeni favoriyi görünür listedeki sıra numarasıyla eşleştirmek veya filtre değişince favori state’ini sıfırlamaktır. Seçimi kalıcı film kimliğiyle ilişkilendir; liste değişse bile aynı ID yeniden görünür.

Diğer belirti: yalnız kart görünümünü değiştirince ağ isteği başlıyor. Görünüm seçimi sunucu sonucunu değiştirmez; sorgu parametrelerine eklenmemeli. Query key’e yalnız server yanıtını gerçekten değiştiren filtre ve sayfa gibi girdiler girer.

## Atölyede nasıl ilerlersin

İlk ekranlardaki küçük state kararlarında “Redux gerekli mi?” diye açıkça düşün. Sonraki projelerde ürün kataloğu ile kullanıcının sepetini, ya da kullanıcı/gönderi seçimi ile sunucu yanıtlarını ayır. Her akışta loading, error ve boş sonucu da tasarla; ekranın yalnızca başarılı yanıtı göstermesi yetmez.

:::tip[Çalışma sırası]
Her değerin sahibini ve paylaşılma alanını yaz. Sonra filtrele, geri dön ve yenile; seçimlerin kaybolmadığını, URL’nin beklenen yerde değiştiğini ve görünüm tercihlerinin gereksiz istek başlatmadığını gözle.
:::

## Özet

- Her state için kaynak, paylaşılma alanı ve yaşam süresini belirle.
- Query server verisini, URL navigasyon seçimini yönetir.
- Tek ekrana ait client state yerel olabilir; ortak state store’a alınabilir.
- Liste konumu yerine kayıt kimliğiyle ilişkilendirilmiş seçim korunur.
- Loading, error ve boş durumları da ekranın parçasıdır.

**Yeni terimler:**
- `Query key`: Bir server sorgusunun hangi girdilerle tanımlandığını belirten anahtar.
- `staleTime`: Query verisinin taze kabul edildiği süre.
- `snapshot`: Store’un belirli andaki state görünümü.

**Kendini yokla:** Görünüm seçimi yalnız tek ekranda kullanılıyorsa Redux şart mı?  
*Cevap:* Hayır; component state yeterli olabilir.

**Kendini yokla:** Film türü geri tuşuyla değişmeli ve bağlantıda paylaşılmalıysa nerede tutulur?  
*Cevap:* URL’de.
