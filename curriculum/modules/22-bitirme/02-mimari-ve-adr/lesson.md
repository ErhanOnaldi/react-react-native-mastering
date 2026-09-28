---
title: "Mimari kararlar: state haritası ve ADR"
minutes: 14
kind: project
---

# Mimari kararlar: state haritası ve ADR

:::pain[Problem]
Sinema projesini büyütürken favoriler özelliğinin geçirdiği evreleri hatırla: 3. modülde `App` bileşeni içinde tek bir `useState` idi. 5. modülde birden fazla sayfa bu veriyi okumak isteyince `FavoritesContext` çatısına taşındı. 16. modüle gelindiğinde ise Context kaynaklı gereksiz yeniden render maliyetleri ortaya çıkınca bu kez Redux slice'ına taşındı.

Tam **üç büyük taşıma refactor'ı** yaşandı; her seferinde onlarca bileşen, import ve test dosyası baştan yazıldı. Daha da kötüsü: projeye bugün dışarıdan katılan yeni bir yazılımcı "Favoriler neden Redux'ta da son izlenenler başka bir yerde?" sorusunun yanıtını kodda bulamaz. Karar verilmiş ancak **gerekçesi ve kabul edilen bedeli** kaybolmuştur.
:::

Koda başlamadan önce sistemi iki taşıyıcı belgeyle güvenceye alacaksın: uygulamadaki her bilgi parçasının tek bir sahibini ilan eden **state haritası** ve geri dönüşü pahalı mimari kararları gerekçeleriyle arşivleyen **ADR** (Architecture Decision Record) kayıtları.

## State kategorileri ve sahiplik zihinsel modeli

Bir web uygulamasında karşılaştığın hiçbir bilgi havada asılı durmaz. 9. modülde state'i dört temel kategoriye ayırmıştık: **sunucu state'i**, **URL state'i**, **istemci state'i** ve **form state'i**. Bunlara ek olarak, asla saklanmaması gereken **türetilmiş state** kavramı gelir.

:::model[State kategorileri]
Her bilginin yalnızca bir tek gerçek kaynağı (Single Source of Truth) vardır. Sunucu verisi bir API önbelleğinde yaşar ve asenkrondur; URL verisi adres çubuğundadır ve paylaşılabilir; form verisi gönderilene dek geçici bir taslaktır; istemci verisi ise yerel kullanıcı tercihidir. Bir değer mevcut verilerden matematiksel olarak hesaplanabiliyorsa saklanmaz; her render'da türetilir.
:::

![State haritası ve sahiplik ayrımı](diagrams/state-haritasi.svg "State haritası ve sahiplik ayrımı")

Bu zihinsel modeli şu beş kesin kuralla yönetirsin:

1. **Sunucu verisini `useState`'e kopyalama:** Uzak sunucudan gelen liste veya detay verisi senin kontrolünde değildir; bayatlayabilir, ağ hatası alabilir veya başka biri tarafından güncellenebilir. Bu verinin sahibi bir asenkron önbellek katmanıdır (TanStack Query gibi).
2. **Kullanıcının paylaşmak isteyeceği her şeyi URL'e ver:** Arama metni, aktif sayfa numarası, sekme seçimi ve filtreler URL state'idir. Adres çubuğunda olmayan bir sayfa numarası, kullanıcı sayfayı yenilediğinde veya linki bir arkadaşına gönderdiğinde yok olur.
3. **Form state'ini erken dışarı sızdırma:** Kullanıcı input alanına bir şeyler yazarken bu taslak veri genel uygulamanın umurunda değildir. Yalnızca form gönderildiğinde (submit) ve doğrulandığında hedef state'e yazılır.
4. **Türetilmiş değeri asla saklama:** Bir dizinin eleman sayısı (`items.length`), toplam sayfa adedi (`Math.ceil(total / limit)`) ya da seçili butonun pasiflik durumu ayrı bir state olamaz. Ayrı bir `count` state'i tutmak, iki kopyanın günün birinde uyuşmaması riskini garanti eder.
5. **Kalıcılığı sınırda doğrula:** `localStorage` gibi tarayıcı depoları güvenilmezdir. Kullanıcı veriyi elle silebilir, tarayıcı uzantısı bozabilir ya da eski sürümden kalan şema uyumsuzluğu ortaya çıkabilir. Depodan okurken mutlaka Zod gibi bir araçla sınır doğrulaması yapılmalıdır.

## Adım adım state haritası çıkarma

Bir podcast dinleme platformu (`PodcastHub`) tasarladığımızı varsayalım. Gereksinimlerdeki her bilgiyi satır satır analiz ederek haritaya yerleştirelim:

| Bilgi parçası | Kategori | Sahibi (Tek kaynak) | Okuyan bileşenler | Değiştiren eylem | Kalıcılık |
| --- | --- | --- | --- | --- | --- |
| Arama terimi `q` | URL | `/search?q=` | Arama sayfası, Arama kutusu | Form submit | Adres çubuğu |
| Sayfa numarası `page` | URL | `/search?page=` | Sayfalama kontrolleri, Liste | "Sonraki/Önceki" tıklaması | Adres çubuğu |
| Bölüm arama sonuçları | Sunucu | Query Cache `['podcasts', q, page]` | Podcast listesi | API yanıtı | Bellek (5 dk stale süresi) |
| Çalma listesi | İstemci | Playlist Context | Oynatıcı çubuğu, Liste sayfası | "Listeye ekle / Çıkar" | `localStorage` (`hub:playlist`) |
| Bölüm notu taslağı | Form | React Hook Form | Not düzenleme formu | Klavye girdisi | Saklanmaz (gönderilince biter) |
| Toplam liste süresi | **Türetilmiş** | Hesaplanır: `episodes.reduce(...)` | Oynatıcı alt bilgi | — | **Saklanmaz!** |
| Aktif bölüm kimliği | URL | `/episode/:id` | Detay sayfası, Oynatıcı | Link tıklaması | Adres çubuğu |

Tabloya dikkat edersen "Toplam liste süresi" için bir sahip veya yazan eylem tanımlanmamıştır. Çünkü bu değer `episodes` dizisi değiştikçe render sırasında saf bir biçimde türetilir.

## ADR: Kararın arkasındaki gerekçeyi sabitlemek

**ADR** (*Architecture Decision Record*), sistemin geleceğini etkileyen tek bir mimari kararı ve bu kararın **neden** alındığını belgeleyen kısa, odaklanmış bir metindir. Bir projenin `docs/adr/` dizininde numaralı markdown dosyaları (`0001-url-state.md`, `0002-yerel-depolama.md`) olarak tutulur.

Standart bir ADR belgesi beş zorunlu bölümden oluşur:

1. **Durum ve Başlık:** Kararın adı ve durumu (*Önerildi*, *Kabul edildi*, *Terk edildi*, *Yerini 0005 aldı*).
2. **Bağlam (Context):** Çözülmek istenen problem nedir? Hangi iş gereksinimi (K-n) bu kararı zorunlu kıldı? Hangi kısıtlar var?
3. **Karar (Decision):** Seçilen çözümün net, tek cümlelik özeti.
4. **Değerlendirilen alternatifler:** Masaya yatırılan en az iki gerçek seçenek ve bunların neden elendiği.
5. **Sonuçlar (Consequences):** Kararın getirdiği kazanımlar (✅) ve kabul edilen teknik borçlar/bedeller (⚠️).

İyi bir ADR ile zayıf bir ADR arasındaki farkı inceleyelim:

| Kriter | Zayıf ADR | Güçlü ve profesyonel ADR |
| --- | --- | --- |
| Bağlam | "Redux popüler bir kütüphanedir." | "Çalma listesi yalnızca iki bileşende okunuyor, veri hacmi 200 kaydı aşmıyor ve sunucu senkronizasyonu gerekmiyor." |
| Alternatifler | "Başka bir şey düşünmedik." | "Context + useReducer ile Zustand karşılaştırıldı; ek paket bağımlılığı almamak için Context seçildi." |
| Sonuçlar | "Uygulama harika çalışacak." | "✅ Ekstra paket yükü oluşmaz. ⚠️ Liste çok büyürse gereksiz render'ları önlemek için memoizasyon gerekir." |
| Değişim | Eski karar dosyası silinip üzerine yazılır. | Eski karar `0002` "Yerini 0008 aldı" olarak işaretlenir; yeni karar `0008` olarak eklenir. Karar tarihi kaybolmaz. |

## Kod örnekleri: Yanlış ve doğru state kurgusu

### Kırık örnek: Her şeyi tek bir global depoya tıkmak

Aşağıdaki yaklaşım başlangıçta pratik görünse de kısa sürede senkronizasyon felaketine yol açar:

```tsx
// TEHLİKE: URL, sunucu ve form verisi tek bir yerde toplanmış
import { useState } from 'react'

type BrokenAppState = {
  searchQuery: string
  page: number
  serverResults: Array<{ id: string; title: string }>
  playlist: Array<{ id: string; title: string }>
  playlistCount: number // HATA: Türetilmiş değer state'e yazılmış!
  draftNote: string
}

export function useBrokenMusicStore() {
  const [state, setState] = useState<BrokenAppState>({
    searchQuery: '',
    page: 1,
    serverResults: [],
    playlist: [],
    playlistCount: 0,
    draftNote: '',
  })

  // Kullanıcı sayfayı yenileyince arama ve sayfa sıfırlanır!
  // playlist güncellendiğinde playlistCount unutulursa arayüz yalan söyler!
  return { state, setState }
}
```

Bu modelde şu üç büyük arıza kaçınılmazdır:
- Adres çubuğu ile state arasında iki yönlü senkronizasyon kurmaya çalışırken sonsuz döngüler doğar.
- Kullanıcı bir linki paylaştığında karşıdaki kişi boş bir sayfayla karşılaşır.
- `playlist` güncellendiğinde `playlistCount` unutulursa menüdeki sayaç ile liste sayısı uyuşmaz.

### Doğru örnek: Sorumlulukların ayrılması ve türetme

Her bilgiyi doğru katmana dağıtıp türetilmiş değerleri safça hesaplayalım:

```tsx check
import React, { useMemo } from 'react'

// 1. İstemci verisinin tipi
type AudioTrack = {
  id: string
  title: string
  durationSeconds: number
}

type PlaylistContextType = {
  tracks: AudioTrack[]
  totalDurationSeconds: number // Türetilmiş değer
  addTrack: (track: AudioTrack) => void
}

const PlaylistContext = React.createContext<PlaylistContextType | null>(null)

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = React.useState<AudioTrack[]>([])

  const addTrack = (track: AudioTrack) => {
    setTracks((prev) => (prev.some((t) => t.id === track.id) ? prev : [...prev, track]))
  }

  // Türetilmiş değer: State'te tutulmaz, mevcut tracks dizisinden hesaplanır
  const totalDurationSeconds = useMemo(() => {
    return tracks.reduce((total, track) => total + track.durationSeconds, 0)
  }, [tracks])

  return (
    <PlaylistContext.Provider value={{ tracks, totalDurationSeconds, addTrack }}>
      {children}
    </PlaylistContext.Provider>
  )
}
```

Bu yapıda:
- Toplam süre için ayrı bir `useState` tutulmamıştır; senkron kopukluğu imkansızdır.
- Arama ve sayfa parametreleri bu Context'e bulaştırılmamış, URL'e bırakılmıştır.
- Her katman kendi sınırında bağımsız ve test edilebilir kalmıştır.

## Sık karşılaşılan mimari hatalar

:::mistake[Sunucu yanıtını yerel state ile önbelleklemeye çalışmak]
**Belirti:** Bileşende `const [items, setItems] = useState([])` açıp `useEffect` içinde gelen cevabı buraya kaydetmek; ardından sayfa değiştiğinde eski ve yeni verinin karışması.  
**Neden:** Sunucu state'inin yaşam döngüsü (önbellekleme, bayatlama süresi, yarış koşulu iptali, tekrar deneme) `useState` ile yönetilemez.  
**Düzeltme:** Asenkron sunucu verisini `useQuery` gibi bir önbellek motoruna emanet et; sorgu anahtarına (`['items', category, page]`) parametreleri dahil et.
:::

:::mistake[Türetilmiş değeri ayrı bir state yapıp useEffect ile eşitlemek]
**Belirti:** `const [list, setList] = useState([])` varken `const [count, setCount] = useState(0)` açıp bir `useEffect(() => setCount(list.length), [list])` yazmak.  
**Neden:** Bir render fazladan gecikmeli çalışır ve arayüzde bir anlığına eski sayı görünür (flicker).  
**Düzeltme:** `count` state'ini tamamen sil; doğrudan render gövdesinde `const count = list.length` olarak hesapla.
:::

:::mistake[ADR'yi aylar sonra 'şirket prosedürü' diye geriye dönük yazmak]
**Belirti:** Kodlar yazılıp bittikten sonra "Burada neden bu kütüphaneyi seçmiştik?" sorusuna yanıt veremeyen yüzeysel dokümanlar.  
**Neden:** Kararın verildiği andaki alternatifler ve kısıtlar unutulmuştur; belge yalnızca mevcut kodun bir özetine dönüşür.  
**Düzeltme:** ADR karar alındığı anda, tartışma tazeyken 15 dakikada yazılmalıdır.
:::

:::sector[Sektörde RFC ve ADR kültürü]
Büyük teknoloji şirketlerinde ve açık kaynak topluluklarında (örneğin React, Rust, Kubernetes) hiçbir köklü mimari değişiklik tartışılmadan koda dökülmez. Süreç **RFC** (*Request for Comments*) veya **Design Doc** ile başlar. Ekip üyeleri belgedeki alternatifleri ve güvenlik risklerini inceler. Karar bağlandığında ise repoda `docs/adr/` altına kaydedilir. Teknik mülakatlarda bir adaya "Neden Context yerine Zustand seçtin?" diye sorulduğunda, iyi bir aday kütüphane fanatikliği yapmak yerine ADR mantığıyla yanıt verir: "Ölçeğimiz gereği X kısıtımız vardı, Y alternatifini şu bedel yüzünden eledik ve Z'yi seçtik."
:::

## Özet

- State haritası, gereksinim belgesindeki tüm bilgileri 5 kategoriye (Sunucu, URL, İstemci, Form, Türetilmiş) ayırarak her bilginin tek bir sahibini belirler.
- Türetilmiş değerler (sayılar, toplamlar, bayraklar) asla state olarak saklanmaz; render sırasında hesaplanır.
- ADR (*Architecture Decision Record*), geri dönmesi maliyetli kararların bağlamını, elenen alternatiflerini ve kabul edilen teknik bedellerini arşivler.
- Mimari kararlar projenin gereksinim ölçeğine göre savunulmalıdır; gümüş kurşun bir araç yoktur.

### Kendini yokla

1. **Soru:** Bir e-ticaret uygulamasında "Sepetteki ürün adedi" neden state haritasında ayrı bir state olarak tutulmamalıdır?  
   **Cevap:** Çünkü bu sayı `sepet.items` dizisinden `items.reduce((toplam, urun) => toplam + urun.adet, 0)` formülüyle anında türetilebilir. Ayrı bir state açılırsa ürün silindiğinde sayacın güncellenmemesi gibi veri tutarsızlıkları doğar.
2. **Soru:** Bir ADR belgesinde "Sonuçlar" bölümüne yalnızca artıların yazılması neden bir eksikliktir?  
   **Cevap:** Mühendislikte her seçim bir ödünleşimdir (trade-off). Kararın getirdiği olumsuz yönler (örneğin artan bundle boyutu, kütüphanenin öğrenme eğrisi veya tip zorlukları) yazılmazsa, ileride o kararın neden yeniden değerlendirilmesi gerektiği anlaşılamaz.
