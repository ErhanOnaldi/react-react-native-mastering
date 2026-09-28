---
title: "Kopyalanan davranışı hook’a taşı"
minutes: 14
kind: concept
---

# Kopyalanan davranışı hook’a taşı

:::pain[Problem]
Sinema uygulamasının üç farklı sayfasında aynı tarayıcı mantığı kopyalanmış: bağlantı koptuğunda uyarı vermek için `online`/`offline` olaylarını dinlemek, sayfa başlığını değiştirmek ve bileşen kapandığında eski başlığı geri yüklemek. Bir sayfada temizlik (cleanup) fonksiyonu unutulduğunda bellek sızıntısı oluyor ve aynı hatayı düzeltmek için üç farklı dosyada arama yapmak gerekiyor.
:::

## Custom hook sınırları ve zihinsel model

Custom hook, React'in yerleşik hook'larını (`useState`, `useEffect`, `useRef`, `useReducer`) kullanarak yeniden kullanılabilir bir **durum ve davranış mantığı** paketleyen fonksiyondur.

Bileşenlerden (components) en temel farkı şudur: **Custom hook JSX döndürmek zorunda değildir.** Çağıran bileşene bir veri, bir durum (state), bir eylem fonksiyonu veya sadece bir senkronizasyon davranışı sunar.

![Component, custom hook ve dış sistem arasındaki sınır](diagrams/custom-hook-siniri.svg "Custom hook davranışı toplar; her çağrı kendi state'ine sahiptir.")

Kesin kurallar:

1. **İsim `use` ile başlamalıdır:** `useOnlineStatus`, `useDocumentTitle` gibi. Bu isim React derleyicisine ve linter'a "bu fonksiyon içinde hook çağrısı yapabilir" sinyali verir.
2. **Yalnızca üst seviyede çağrılır:** Hook'lar döngülerin (`for`), koşulların (`if`) veya iç içe fonksiyonların içinde çağrılamaz. React, hook'ların çağrılma sırasına dayanır.
3. **Her çağrı bağımsız state alır:** Bir custom hook iki ayrı bileşende çağrıldığında, o iki bileşen aynı state'i paylaşmaz. Custom hook küresel bir depo (global store) değildir; mantığın kopyalanmasını sağlayan bir şablondur.
4. **Temizlik sorumluluğunu gizler:** Dış sisteme abone olma ve abonelikten çıkma mantığı hook'un içinde paketlenir; çağıran bileşenin bu karmaşıklığı bilmesi gerekmez.
5. **Arayüzden bağımsız sözleşme:** Hook arayüzün nasıl görüneceğini bilmez; yalnızca saf veri ve eylem üretir.

:::model[Effect yaşam döngüsü]
Custom hook içindeki bir `useEffect` de aynı kurulum ve temizlik (cleanup) kurallarına tabidir. Mantığı bir hook dosyasına taşımak yaşam döngüsünü değiştirmez; yalnızca o döngünün sorumluluğunu bileşenin omuzlarından alıp tek bir test edilebilir birime devreder.
:::

## Kırık yaklaşım: Mantığın bileşenlere kopyalanması

Diyelim ki kullanıcının internet bağlantısının kopup kopmadığını takip etmek istiyoruz. Bunu her bileşende elle yaparsak:

```tsx
// Üç farklı bileşende aynı kod kopyalanıyor:
function MovieList() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    function handleOnline() { setIsOnline(true) }
    function handleOffline() { setIsOnline(false) }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // BİR BİLEŞENDE BU CLEANUP'I UNUTURSAN BELLEK SIZINTISI OLUŞUR:
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline) return <p>İnternet bağlantısı kesildi!</p>
  return <div>Film Listesi</div>
}
```

Bu mantık 5 sayfada tekrarlandığında kod tabanı `addEventListener` kalıntılarıyla dolar.

## Doğru yaklaşım: Davranışı hook'a paketlemek

Bu tüm tarayıcı abonelik mantığını bağımsız bir custom hook'a taşıyoruz:

```ts check
import { useEffect, useState } from 'react'

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
```

Artık herhangi bir bileşende bu bilgiyi kullanmak tek bir temiz satıra dönüşür:

```tsx
function MovieList() {
  const isOnline = useOnlineStatus()
  if (!isOnline) return <p>İnternet bağlantısı kesildi!</p>
  return <div>Film Listesi</div>
}
```

Bileşen `window.addEventListener`'dan, event adlarından ve cleanup fonksiyonundan tamamen habersizdir. Yalnızca ihtiyacı olan `boolean` değeri okur.

## İkinci örnek: Sayfa başlığını senkronize eden hook (`useDocumentTitle`)

Sadece state döndüren değil, yalnızca bir yan etkiyi yöneten custom hook'lar da yazılabilir. Örneğin film detayına girildiğinde tarayıcı sekmesinin başlığını değiştiren ve bileşen unmount olduğunda eski başlığı geri yükleyen bir hook tasarlayalım:

```ts check
import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    // 1. Mevcut başlığı sakla
    const previousTitle = document.title

    // 2. Yeni başlığı yaz
    document.title = `${title} | Sinema`

    // 3. Unmount anında veya başlık değiştiğinde eski başlığı geri koy
    return () => {
      document.title = previousTitle
    }
  }, [title])
}
```

Kullanımı son derece zariftir:
```tsx
function MovieDetailsView({ movieTitle }: { movieTitle: string }) {
  useDocumentTitle(movieTitle)
  return <h1>{movieTitle}</h1>
}
```

## Hook'lar durum paylaşır mı? (En kritik yanlış anlama)

Yeni başlayanların en sık düştüğü yanılgı şudur: "İki bileşende `useOnlineStatus()` çağırırsam aynı state'i mi paylaşırlar?"

**Hayır!** Custom hook'lar mantığı paylaşır, bellekteki veriyi değil:

```text
Component A ─── çağırır ───► useOnlineStatus() ───► State A (bellekte bağımsız)
Component B ─── çağırır ───► useOnlineStatus() ───► State B (bellekte bağımsız)
```

Eğer iki bileşenin gerçekten aynı durum verisini paylaşmasını istiyorsan, state'i ortak bir ebeveyne taşımalı ya da Context API kullanmalısın.

## Koşullu hook çağrısı neden yasaktır?

React, bir bileşenin hangi hook'unun hangi değere ait olduğunu isimleriyle değil, **çağrılma sıralarıyla** (call index) takip eder:

```text
1. Render:
  1. useState (isOnline)
  2. useEffect (dinleyici)

2. Render:
  1. useState (isOnline)
  2. useEffect (dinleyici)
```

Eğer bir hook'u `if` bloğu içine koyarsan:

```tsx
// KESİNLİKLE YASAK (React kural ihlali):
if (isLoggedIn) {
  useDocumentTitle("Profilim") // Çağrı sırası kayar ve React çöker!
}
```

Koşullu bir davranış istiyorsan, koşulu hook'un **dışına değil içine parametre olarak** taşımalısın:

```tsx
// DOĞRU YOL:
useDocumentTitle(isLoggedIn ? "Profilim" : "Ziyaretçi")
```

### Bir hook çağrısının render'dan temizliğe izi

Hook'a taşımak, Effect'in ne zaman çalıştığına dair yeni bir kural üretmez. Aşağıdaki sıra, iki render arasındaki farkı gösterir:

| Zaman | Olan | Tarayıcı kaydı |
|---|---|---|
| İlk render | isOnline başlangıç değeri okunur, JSX hazırlanır | henüz listener yok |
| İlk commit sonrası | Effect kurulur ve iki listener eklenir | online/offline dinleyicileri birer kez |
| offline olayı | handler true yerine false state'i ister | React yeni görünüm hazırlar |
| ikinci commit | bileşen bağlantı uyarısını gösterir | aynı listener'lar kalır |
| bileşen kapanır | cleanup iki listener'ı kaldırır | abonelik kalmaz |

Buradaki ilk render ile Effect kurulumu arasındaki kısa aralık önemlidir: tarayıcı durumu render sırasında okunur; olay dinleme ise commit'ten sonra başlar. Bir custom hook bu aralığı ortadan kaldırmaz. Ayrıca Effect bağımlılıkları değişirse React önce eski Effect'in cleanup'ını, sonra yeni Effect'in kurulumunu çalıştırır. Dinlenen kaynağa göre handler referansının aynı kalması gerekir; add ve remove işlemlerine farklı fonksiyon verirsen kaldırma gerçekleşmez.

## Hook mu, bileşen mi, paylaşılan store mu?

Bir parçayı ayırmadan önce çıktısına bak. Ekran öğeleri ve kendi görsel sınırı varsa bileşen; JSX gerektirmeyen, bir bileşenin çağırdığı tekrar kullanılabilir state/Effect mantığı varsa custom hook; birden fazla ağaç dalı arasında tek bir ortak değer senkronize edilecekse Context veya external store düşün. Hook çağrılarının state'i kendiliğinden ortaklaştırmadığını önceki örnek gösterdi. Bu ayrım API tasarımını da sadeleştirir: useOnlineStatus() yalnızca boolean döndürebilir, useDisclosure() ise open, openDialog ve closeDialog gibi açık bir sözleşme sunabilir.

Hook'u gereksiz yere genel hale getirme. İlk kullanımda tek bir sağlam isim ve dönüş tipi belirle; gerçekten farklı tüketiciler çıktının farklı parçalarını istiyorsa API'yi genişlet. Her olası seçeneği boolean parametreye dönüştürmek (useThing(true, false, true)) çağrı yerinde anlamı siler. Nesne parametresi ya da ayrı niyetli fonksiyonlar daha okunurdur.

:::mistake[Hook içine görsel kararları gömmek]
**Belirti:** Bağlantı durumu hook'u kendi içinde belirli bir uyarı metni ve CSS sınıfı döndürüyor. **Neden:** Davranışla sunum aynı sorumlulukta birleşmiş. **Düzeltme:** Hook durum bilgisini döndürsün; metni ve görünümü tüketen bileşen seçsin.
:::

:::mistake[Effect'i taşırken bağımlılıkları sabit bırakmak]
**Belirti:** Parametre değiştiği halde eski değerle çalışan dinleyici kalıyor. **Neden:** Bağımlılık listesi hook'a taşınırken eksik bırakılmış. **Düzeltme:** Effect'in okuduğu reaktif değerleri bağımlılıklara koy; yeni kurulumdan önce eski aboneliğin temizleneceğini hesaba kat.
:::

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Hook fonksiyonunun başına use koymayı unutmak]
Belirti → Fonksiyonda `useState` çağrılıyor ama adı `getOnlineStatus` yapılmış; linter hook kurallarını denetlemiyor.  
Neden → React linter kuralları `use` önekiyle başlayan fonksiyonları tarar. İsim düzeltilmezse yanlışlıkla bir event handler içinde çağrılabilir ve çalışma zamanında çöker.  
Düzeltme → İçinde hook çağrılan her fonksiyona `use` öneki ver (`useOnlineStatus`).
:::

:::mistake[Sık hata: Hook'tan devasa ve ilgisiz nesneler döndürmek]
Belirti → Bir hook'un hem arama metnini, hem kullanıcı profilini, hem tema ayarını tek bir tuple'da dönmesi.  
Neden → Tek sorumluluk ilkesinin (Single Responsibility) unutulması.  
Düzeltme → Her custom hook tek bir işe odaklanmalıdır. İhtiyaç duyulan parçalar bileşende birleştirilir.
:::

:::mistake[Sık hata: localStorage okumasını render'da doğrudan yapmak]
Belirti → Bileşen her render olduğunda `localStorage.getItem` çalışıyor ve arayüz yavaşlıyor.  
Neden → Senkron tarayıcı disk okuması maliyetlidir.  
Düzeltme → Storage okumasını lazy state başlatıcısı (`useState(() => readStorage())`) içinde yalnızca ilk render'da yap.
:::

:::sector
Kurumsal React mimarilerinde "Headless UI" yaklaşımı tamamen custom hook'lara dayanır. Örneğin erişilebilir bir açılır menü (dropdown) veya modal tasarlarken, klavye yönetimi ve açık/kapalı mantığı bir custom hook'ta (`useDropdown`, `useModal`) toplanır; görsel tasarım (HTML/Tailwind) ise tamamen ürünü geliştiren ekibe bırakılır. Bu sayede mantık ve stil birbirinden kusursuzca ayrılır.
:::

## Özet

- Custom hook, React hook'larını kullanarak yeniden kullanılabilir davranış üreten fonksiyondur.
- Adı mutlaka `use` ile başlamalıdır ve koşulsuz olarak en üst seviyede çağrılmalıdır.
- Her custom hook çağrısı kendi bağımsız yerel state'ine sahiptir; global depo değildir.
- Dış sistem bağlantılarını ve temizlik (cleanup) işlerini bileşenden soyutlar.
- Koşullu mantık hook çağrısına değil, hook parametrelerine uygulanır.

**Kendini yokla:** Bir custom hook'u iki farklı bileşende çağırdığımızda ne olur?  
*Cevap:* İki bileşen de aynı mantığı yürütür ancak her biri bellekte kendi bağımsız state kopyasına sahip olur.

**Kendini yokla:** Hook'lar neden `if` koşulu veya döngü içinde çağrılamaz?  
*Cevap:* Çünkü React hook durumlarını isimleriyle değil, render anındaki çağrılma sırasıyla eşleştirir. Koşullu çağrı bu sırayı bozar ve uygulamanın çökmesine yol açar.
