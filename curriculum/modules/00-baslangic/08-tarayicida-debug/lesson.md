---
title: "Tarayıcıda debug"
minutes: 16
kind: concept
---

# Tarayıcıda debug

:::pain[Problem]
Kullanıcı "filtreye tıklıyorum ama liste boş kalıyor" diyor. Kodda hiçbir kırmızı alt çizgi yok; terminalde hiçbir hata basılmıyor. `console.log` ekliyorsun, sayfayı yeniliyorsun, konsola yüzlerce satır dökülüyor; aradığın değişkenin hangi anda, hangi değerle bozulduğunu yakalayana kadar saatler geçiyor.
:::

## Tarayıcı geliştirici araçları bir röntgen cihazıdır

JavaScript kodun son tahlilde kullanıcının tarayıcısında çalışır. Bir uygulamanın iç durumunu anlamak için kodun içine rastgele `console.log` serpiştirmek, karanlık bir odada el fenerini rastgele sallamaya benzer. Modern web platformu, uygulamanın çalışmasını istediğin anda durdurup hafızayı, değişkenleri ve ağ trafiğini inceleyebilmen için gelişmiş bir araç seti sunar: **Chrome DevTools** (ve Firefox/Safari eşlenikleri).

Sağ tıklayıp **İncele** (Inspect) diyerek veya **F12** (macOS'ta **⌥ + ⌘ + I**) kısayoluyla açılan DevTools penceresi, beş ana uzmanlık paneline ayrılır:

1. **Console:** Mesajlar, hatalar ve canlı JavaScript komut satırı.
2. **Sources:** Kod dosyaları, breakpoint'ler (kesme noktaları) ve adım adım yürütme motoru.
3. **Network:** Tarayıcı ile sunucu arasındaki tüm HTTP istekleri, cevap başlıkları ve gövde verileri.
4. **Application:** `localStorage`, çerezler (cookies) ve oturum verileri.
5. **React Developer Tools:** React bileşen ağacı, props, state ve hook durumları (tarayıcı eklentisi).

## Sources panelinde zamanı durdurmak

En güçlü hata ayıklama tekniği, kodun çalışma zamanında **belirli bir satırda dondurulmasıdır**. Kod durduğunda sayfa kilitlenir; o an hafızadaki tüm değişkenler canlı olarak okunabilir.

Bunu sağlamanın üç yolu vardır:
- **Satır Breakpoint'i:** Sources panelinde dosyanı açıp satır numarasına tıklamak. Satırın solunda mavi/kırmızı bir işaret belirir.
- **`debugger;` ifadesi:** Kodunun içine doğrudan `debugger;` yazmak. DevTools açıksa tarayıcı bu satıra ulaştığı an yürütmeyi otomatik olarak duraklatır.
- **Koşullu Breakpoint (Conditional Breakpoint):** Satır numarasına sağ tıklayıp bir koşul girmek (örneğin: `movieId === 550`). Döngü 1.000 kez dönse bile kod yalnızca o şart sağlandığında durur.

Breakpoint tetiklendiğinde Sources paneli şu kritik çalışma alanlarını açar:

![Sources panelinde adım adım hata ayıklama](diagrams/sources-debug.svg "Sources panelinde yürütme kontrolü, Scope ve Call Stack ilişkisi")

Modeli şu temel bileşenlerle kavra:

1. **Yürütme Kontrol Tuşları:**
   - **Devam et (Resume - F8):** Kodu bir sonraki breakpoint'e kadar serbest bırakır.
   - **Adım atla (Step over - F10):** Bulunduğun satırı çalıştırır ve alt satıra geçer; fonksiyon çağrılarının içine girmez.
   - **İçine gir (Step into - F11):** O satırda çağrılan fonksiyonun kaynak kodunun ilk satırına dalar.
   - **Dışına çık (Step out - Shift + F11):** İçinde bulunduğun fonksiyondan çıkıp onu çağıran üst satıra geri döner.
2. **Scope (Kapsam):** O anda hafızada tanımlı yerel (`Local`), closure ve küresel (`Global`) değişkenlerin anlık değerlerini ağaç görünümünde listeler.
3. **Call Stack (Çağrı Yığını):** Bu fonksiyona hangi çağrı zinciriyle gelindiğini gösterir (örneğin: `onClick` → `handleSubmit` → `validateForm`).
4. **Watch (İzleme):** Belirlediğin özel ifadelerin (örneğin `items.length > 0`) güncel değerini her adımda otomatik hesaplar.

:::model[Canlı hafıza incelemesi]
Breakpoint koymak, video kaydını tam şüpheli anda durdurup kare kare ileri sarmaya benzer. Her karede (Step Over) hangi değişkenin değiştiğini Scope panelinde canlı görürsün. Hatanın gerçekleştiği milisaniyeyi doğrudan tespit edersin.
:::

## Adım adım bir hata ayıklama senaryosu

Film listesini popülerlik puanına göre filtreleyen bir fonksiyonumuz olduğunu varsayalım. 7.0 ve üzeri filmleri listelemek istiyoruz ama ekranda hiç film görünmüyor.

Aşağıdaki tabloda satır 4'e bir breakpoint koyup F10 ile ilerlediğimizde hafızanın değişimini izleyelim:

| Adım | İşlem / Satır | Yürütülen Kod | Scope Değerleri | Tespit ve Gözlem |
| --- | --- | --- | --- | --- |
| 1 | Breakpoint'te durdu | `const minScore = 7.0` | `movies: Array(3)`, `minScore: undefined` | Fonksiyon başladı, yerel değişken henüz atanmadı. |
| 2 | Step over (F10) | `return movies.filter(...)` | `minScore: 7.0` | Sınır değeri 7.0 olarak belleğe yazıldı. |
| 3 | Step into (F11) | `m.vote_average > minScore` | `m: { title: "Matrix", vote_average: "8.7" }` | **HATA TESPİTİ:** `vote_average` değeri sayı değil, **string** (`"8.7"`) olarak gelmiş! |
| 4 | Step over (F10) | Karşılaştırma sonucu | `"8.7" > 7.0` | JavaScript string karşılaştırması beklenmedik sonuç üretiyor veya tipler uyuşmuyor. |

Tek bir breakpoint ve iki kez F10/F11 tuşuna basmak, hatanın filtre algoritmasında değil, verinin tipinde (`string` vs `number`) olduğunu saniyeler içinde kanıtladı.

## Diğer panelleri ne zaman kullanırsın?

Hata her zaman JavaScript hesaplamasından kaynaklanmaz. Hangi belirtide hangi panele bakacağını bilmek profesyonel bir refleks gerektirir:

### 1. Console Paneli
Yalnızca `console.log` için değil, gelişmiş biçimlendirmeler için kullanılır:
- `console.table(filmler)`: Dizi veya nesne listesini tarayıcıda okunur bir Excel tablosu gibi çizer.
- `console.warn(...)` ve `console.error(...)`: Hataları sarı ve kırmızı uyarı bloklarıyla ayırır.
- `$0`: Elements panelinde o an fareyle seçtiğin DOM öğesini temsil eder. Konsola `$0` yazıp Enter'a basarak seçili öğenin özelliklerini inceleyebilirsin.

### 2. Network Paneli
Uygulama dış dünyayla konuşurken yaşanan sorunların merkez üssüdür:
- **Durum Kodları:** `401 Unauthorized` (token eksik/hatalı), `404 Not Found` (URL yanlış), `500 Internal Server Error` (sunucu çöktü).
- **Filtreler:** Yalnızca API çağrılarını görmek için `Fetch/XHR` butonuna basılır.
- **Headers & Response:** Sunucuya hangi parametrelerin gittiğini (`Headers`) ve sunucudan dönen gerçek JSON gövdesini (`Response`) gösterir.
- **Throttling (Ağ Yavaşlatma):** Hızlı bağlantılarda fark edilmeyen yüklenme (loading) durumlarını test etmek için ağı `Slow 4G` moduna alabilirsin.

### 3. Application Paneli
Tarayıcının kalıcı hafızasıdır:
- `Storage > Local Storage`: Uygulamanın kaydettiği kullanıcı tercihleri, tema ayarları veya token'lar burada anahtar-değer çifti olarak listelenir. Değerleri çift tıklayarak elle değiştirebilir veya silebilirsin.

### 4. React Developer Tools
Standart DOM ağacı React bileşenlerini göstermez; yalnızca `<div>`, `<span>` gibi etiketleri gösterir. React DevTools eklentisi tarayıcıya iki yeni panel ekler:
- **Components:** Ekranda gördüğün her React bileşenini (`MovieCard`, `AppHeader`) ağaç yapısında listeler. Seçtiğin bileşenin o anki `props`, `state` ve `hooks` değerlerini canlı olarak gösterir; değerleri oradan elle değiştirip ekranın nasıl tepki verdiğini anında görebilirsin.
- **Profiler:** Sayfanın hangi etkileşimlerde ne kadar sürede render edildiğini ölçer.

## Önizleme iframe'inde breakpoint kullanmak

Bu platformda sağ tarafta gördüğün "Canlı Önizleme" penceresi, güvenlik ve yalıtım amacıyla bir **iframe** içerisinde çalışır.

Önizleme içerisindeki bir hatayı ayıklamak istediğinde:
1. Tarayıcının DevTools penceresini aç.
2. Sources sekmesinde sol dosya gezgininde `localhost` kaynakları altında önizleme dosyalarını (örneğin `Preview.tsx` veya üzerinde çalıştığın bileşeni) bul.
3. İstediğin satıra breakpoint koy ve önizleme ekranındaki butona tıkla.
4. Kod hemen duraklayacak ve Scope panelinde bileşenin props değerleri belirecektir.

## Kırık örnek

Aşağıdaki bilet fiyatı hesaplama bileşeninde mantıksal bir hata bulunmaktadır. Kod derlenir ancak ekranda her zaman yanlış tutar görünür:

```tsx
export function calculateTotal(basePrice: number, discountPercent: number): number {
  // Kırık: İndirim düşüleceğine ekleniyor ve yüzdelik oran yanlış hesaplanıyor
  const discountAmount = (basePrice * discountPercent) // Yüzdeye bölünmedi!
  return basePrice + discountAmount // İndirim çıkarılmadı, eklendi!
}
```

Bu fonksiyon çalıştırıldığında 100 ₺'lik bilet ve %20 indirim için `100 - 20 = 80 ₺` beklenirken ekranda `2100 ₺` gibi devasa bir sayı çıkar. Sources panelinde 3. satıra bir breakpoint koyup `discountAmount` değerine baktığında değişkenin `2000` olduğunu görür ve formüldeki `/ 100` eksiğini anında fark edersin.

## Doğru örnek

Breakpoint yardımıyla hesaplama mantığını düzelttiğimiz fonksiyon:

```ts check
export function calculateTotal(basePrice: number, discountPercent: number): number {
  if (discountPercent <= 0) {
    return basePrice
  }
  const discountAmount = (basePrice * discountPercent) / 100
  return Math.max(0, basePrice - discountAmount)
}
```

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Kodda debugger unutup canlıya (production) göndermek]
Belirti → Canlı sitede DevTools açan bir kullanıcının ekranı aniden donuyor.  
Neden → Kodun içinde unutulan `debugger;` satırları, son kullanıcının tarayıcısında DevTools açıldığında da tetiklenir.  
Düzeltme → Hata ayıklama bittiğinde koddaki tüm `debugger;` ifadelerini temizle. CI hattındaki linter'lar (`no-debugger`) bunu otomatik denetlemelidir.
:::

:::mistake[Sık hata: Console.log nesnelerinin bayat değerini görmek]
Belirti → `console.log(movie)` yazıyorsun; konsolda nesneyi açtığında satırın çalıştığı andaki değil, çok sonra güncellenmiş halini görüyorsun.  
Neden → Tarayıcı konsolu nesneleri referansla tutar; oku açtığın an hafızadaki en son durumu okur.  
Düzeltme → O anki anlık görüntüyü (snapshot) görmek için `console.log(JSON.parse(JSON.stringify(movie)))` kullan ya da en doğrusu Sources panelinde breakpoint ile dur.
:::

:::mistake[Sık hata: Network sekmesinde "Disable cache" açık unutulduğunda önbelleği test edememek]
Belirti → HTTP cache kuralları çalışmıyor gibi görünüyor; her yenilemede sunucuya 200 ile yeni istek gidiyor.  
Neden → DevTools açıkken varsayılan olarak "Disable cache" seçeneği işaretli olabilir.  
Düzeltme → Network sekmesinin üst bandındaki "Disable cache" kutucuğunun işaretini kaldır.
:::

:::sector
Kıdemli mühendisler ile yeni başlayanlar arasındaki en belirgin farklardan biri hata ayıklama aracı seçimidir. Deneyimli bir yazılımcı karmaşık bir asenkron hatada `console.log` serpiştirerek 30 dakika kaybetmek yerine 1 dakikada doğru yere bir Conditional Breakpoint koyar, Call Stack'e bakar ve sorunun kök nedenine ulaşır.
:::

## Özet

- Tarayıcı DevTools, uygulamanın çalışma zamanındaki hafızasını, bileşenlerini ve ağ trafiğini inceleyen merkezdir.
- Sources panelinde breakpoint koymak veya `debugger;` yazmak, JavaScript yürütmesini dondurur.
- F10 (Step over) adım adım satırları yürütürken Scope paneli o anki değişkenlerin değerini gösterir.
- Call Stack, duraklatılan fonksiyona hangi çağrı zinciri üzerinden gelindiğini kanıtlar.
- Ağ hataları (401, 404, 500) Network sekmesinde, bileşen props/state durumları React DevTools panelinde, yerel veriler ise Application panelinde incelenir.

**Kendini yokla:** Yüz elemanlı bir dizinin sadece `id === 42` olan elemanında hata ayıklamak istiyorsun. Yüz kez F10'a basmamak için hangi aracı kullanırsın?  
*Cevap:* Satır numarasına sağ tıklayarak `id === 42` koşulunu içeren bir **Conditional Breakpoint** (Koşullu Kesme Noktası) eklersin.

**Kendini yokla:** Uygulamanın yaptığı bir API çağrısının neden `401 Unauthorized` hatası aldığını anlamak için DevTools'un hangi paneline ve sekmesine bakarsın?  
*Cevap:* **Network** paneline gidip ilgili isteği seçer, **Headers** sekmesinde `Authorization` başlığının gönderilip gönderilmediğini kontrol edersin.
