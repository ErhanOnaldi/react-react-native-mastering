---
title: "Sinema: akıcı büyük liste"
minutes: 13
kind: project
---

# Sinema: akıcı büyük liste

Sinema'nın araması, favorileri ve detay sayfası aynı uygulamanın farklı işlerini yapıyor. Projede önce hangi kullanıcı hareketinin yavaş veya sessiz kaldığını yeniden üret; sonra tek bir davranışı değiştirip aynı akışı tekrar dene. Böylece URL, veri cache'i ve var olan API client'ı gibi çalışan parçaları korursun.

:::model[Render nedenleri]
Bir state değişikliği ilgili bileşenleri render eder. Memoization, girdi aynıyken hesabı ya da bileşen çağrısını atlayabilir; yeni sorgu veya seçilen film değiştiğinde güncelleme yine gerekir. Büyük listeyi input state'inden ayrı öncelikte tutmak inputu duyarlı bırakabilir.
:::

![Render nedenlerini ve memo sınırlarını gösteren akış](diagram:render-nedenleri)

:::model[Ağaç ve kimlik]
React yerel state'i bileşenin ağaçtaki konumu ve `key` değeriyle ilişkilendirir. Filtrelenip sıralanan film listesinde key olarak kalıcı film kimliği kullan; sıra numarası değişebilir.
:::

![Ağaç konumu ve key state kimliğini belirler](diagram:agac-ve-kimlik)

## Input ile uzun listeyi ayır

Bir oyuncu listesinde arama yaptığını düşün: yazdığın metin anında görünmeli, ama yüzlerce eşleşmeyi çizmek daha sonra tamamlanabilir. `useDeferredValue`, input state'ini geciktirmeden ağır listenin kullanacağı sorgu değerini ertelemeye yarar.

```tsx check
import { useDeferredValue, useState } from 'react'

export function CastSearch() {
  const [query, setQuery] = useState('')
  const listQuery = useDeferredValue(query)
  return (
    <section>
      <input aria-label="Oyuncu ara" value={query} onChange={(event) => setQuery(event.target.value)} />
      <p>Input: {query}; oyuncu listesi: {listQuery}</p>
    </section>
  )
}
```

`N` yazıldığında input hemen `N` olur; liste sorgusu kısa süre eski değerde kalıp sonra güncellenebilir. İki değeri ayırmak, kullanıcının yazmasını bekletmeden listenin yeni sorguya yetişmesine alan açar.

## Görünür satırları sınırla

Bir film galerisinde sıradan `map` her filmi DOM'a (tarayıcının sayfa öğeleri ağacına) yerleştirir. Sanallaştırma (virtualization), kaydırma alanının toplam boyunu koruyup o an görünür olan satırları ve yakın çevresini DOM'da tutar.

```ts check
const rowHeight = 48
const viewportHeight = 240
const visibleRows = Math.ceil(viewportHeight / rowHeight)
const totalHeight = 500 * rowHeight
// Yaklaşık 5 görünür satır; toplam alan 24000 piksel.
```

Bu listede yaklaşık beş satır aynı anda görünür; toplam yükseklik 24.000 piksel olarak kalır. Sanallaştırıcı kaydırma konumuna göre hangi satırların çizileceğini seçer. Filtreleme sonrası hem satır sayısı hem satır kimliği aynı filtrelenmiş film dizisine dayanmalı; eski indeksleri kullanırsan başlıkla kimlik birbirinden kopabilir.

## Bekleyen işlemi görünür kıl

Şimdi bir oyuncu profilindeki takip düğmesini düşün. İstek bitmeden düğme yeni durumu gösterirse bu **optimistic UI** (sunucu yanıtından önce beklenen sonucu gösteren arayüz) olur. Onaylanmış state ise isteğin başarılı olduğunda kalıcılaşan değerdir. React'te **Action**, async işi React'in bekleme durumuyla ilişkilendirdiğin fonksiyondur; Action sürerken ikinci kaydı engelleyip hata halinde geçici görünümü geri al.

| Adım | İstek | Düğmenin görünümü | Onaylanmış değer |
|---|---|---|---|
| 1 | Başlamadı | Takip edilmiyor | `false` |
| 2 | Bekliyor | Takip ediliyor | `false` |
| 3a | Başarılı | Takip ediliyor | `true` |
| 3b | Hata | Takip edilmiyor | `false` |

Bekleyen görünüm kullanıcıya tıklamanın alındığını hemen anlatır. Sunucu hata verirse onaylanmış değer değişmediğinden görünümü eski haline döndürebilirsin; bekleyen değeri kalıcı state sanmak hatalı kalıcı favori gösterir.

## Uygulamaya küçük adımlarla geç

Bu proje iki ayrı çalışma alanı içeriyor: arama sonucu listesi ve favori/detay akışı. Önce aynı sorguda input yanıtını ve DOM satır sayısını not et; sonra boş sonuçla tek sonuç halinde de dene. İkinci akışta bekleyen, başarılı ve hatalı kayıt anlarını ayrı ayrı gözle. URL state'i, TanStack Query key'lerini ve mevcut API client'ını koru.

Detay sayfasını gerektiğinde yüklemek için **code splitting** (JavaScript'i ayrı parçalara bölüp yalnız ihtiyaç duyulan parçayı yükleme) kullanılabilir. İlk ekranda gereken kod başlangıç paketinde kalır; kullanıcı detay sayfasına gidince o parçanın indirilmesi gerekir. FCP, tarayıcının ilk metin veya görseli gösterdiği ana verilen addır; başlangıçta indirilen kodu azaltmak ilk görünümü etkileyebilir, ama her route geçişini hızlandıracağı anlamına gelmez.

React Compiler için bu projede kararlı Babel eklenti yolunu izle; deneysel `compiler: true` ayarına geçme. Gerekli geliştirme paketleri `babel-plugin-react-compiler` ve `@rolldown/plugin-babel`'dır:

```sh
pnpm add -D babel-plugin-react-compiler @rolldown/plugin-babel
```

Vite yapılandırmasında Rolldown Babel eklentisi üzerinden React Compiler eklentisini bağla. Derleme ayarını değiştirdikten sonra geliştirme görünümünün yanında üretim build'ini de kontrol et.

:::mistake[Liste doğru ama hâlâ ağır]
Arama doğru sonucu verir ama kaydırırken yüzlerce satır varsa, filtreleme yapılmış fakat DOM listesi sınırlandırılmamıştır. Sanallaştırmayı gerçek filtrelenmiş sonuçlara uygula ve toplam kaydırma alanını koru.
:::

:::mistake[Hata sonrası favori açık kalıyor]
İstek reddedildiği halde düğme açık görünüyorsa, bekleyen görünüm onaylanmış state'e yazılmış olabilir. Başlangıç değerini temel al; başarıda kalıcılaştır, hata halinde eski görünüme dön.
:::

## Özet

- Arama inputunun güncel state'ini, ağır liste sorgusundan ayırabilirsin.
- Sanallaştırma DOM'daki satırları azaltırken kaydırma alanının toplam boyunu korur.
- Optimistic UI bekleyen sonucu hemen gösterir; hata durumunda onaylanmamış değişiklik geri alınır.
- Action beklerken ikinci kaydı engelle; başarısızlıkta geçici görünümü geri al.
- Code splitting detay kodunu ihtiyaç anına bırakır; başlangıç paketini küçültmek her etkileşimi otomatik hızlandırmaz.
- Değişikliği aynı kullanıcı akışında ve üretim build'inde yeniden gözle.

**Terimler**

- **Optimistic UI:** Sunucu yanıtından önce beklenen sonucu gösteren geçici arayüz.
- **Action:** React'in async bir işlemi ve onun bekleme durumunu yönetmesine bağlanan fonksiyon.
- **Sanallaştırma:** Uzun listenin görünen satırlarını DOM'da tutma tekniği.
- **Code splitting:** Uygulama kodunu ayrı parçalar halinde yükleme düzeni.
- **FCP:** Tarayıcının ilk metin veya görsel pikselini gösterdiği an.

**Kendini yokla**

1. İstek beklerken yeni favori görünümü göstermek neden işe yarar? **Cevap:** Kullanıcı tıklamasının hemen alındığını görür; hata olursa onaylanmayan görünüm geri alınabilir.
2. Detay kodunu ayrı yüklemek arama filtre hesabını azaltır mı? **Cevap:** Hayır. Başlangıçta yüklenen kod miktarını etkiler; arama hesabı ve DOM satırları ayrı işlerdir.
