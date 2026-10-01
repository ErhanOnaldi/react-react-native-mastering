---
title: "Storybook ile bileşen durumlarını paylaş"
minutes: 13
kind: concept
---

# Storybook ile bileşen durumlarını paylaş

Sinema'daki bir film kartını uygulama içinde görmek için çoğu zaman doğru sayfaya gitmen, filmleri hazırlaman ve aradığın kartı bulman gerekir. Storybook, bir bileşeni uygulamanın geri kalanından ayrı açıp farklı başlangıç durumlarını gösteren bir araçtır. Böyle bir açılış örneğine **story** denir; ekran görüntüsü değildir, bileşenin kendisini gerçek props'larla çalıştırır.

## Tek bir bileşeni katalogda aç

Önce en küçük story dosyasına bakalım. `GenreChip`, film türünü gösteren küçük bir Sinema bileşeni olsun:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { GenreChip } from './genre-chip'

const meta = { component: GenreChip } satisfies Meta<typeof GenreChip>
export default meta
type Story = StoryObj<typeof meta>

export const Drama: Story = {}
```

Storybook `Drama` örneğini açtığında `GenreChip` bileşenini render eder. Bu ilk örnekte özel prop vermedik; bileşen kendi varsayılanlarıyla görünür. Dosyadaki adın `Drama` olması da katalogda hangi örneği açtığını anlaşılır kılar.

Buradaki dosya düzeninin adı **CSF**'tir (Component Story Format): bileşen bilgisini veren bir `default export` ve katalogda açılan örnekleri veren adlandırılmış `export`'lar kullanır. `Meta` ve `StoryObj`, bu bilgilerin component'in prop tipleriyle uyumlu olup olmadığını TypeScript'e denetletir.

## Ortak varsayılanı bir kez yaz

İlk örneğe bir yenilik ekleyelim: story'lerin paylaşacağı başlangıç props'larını `args` alanında tanımlayalım. `args`, bileşene verilecek örnek girdilerdir; böylece her story aynı ortak değerlerle başlayabilir.

```tsx
const meta = {
  component: GenreChip,
  args: { label: 'Dram' },
} satisfies Meta<typeof GenreChip>
export default meta
type Story = StoryObj<typeof meta>

export const Drama: Story = {}
export const Comedy: Story = { args: { label: 'Komedi' } }
```

`Drama` kendi `args` değerini vermediği için `label` olarak `Dram` alır. `Comedy` ise yalnızca `label` değerini değiştirir. Böylece varsayılanı her story'de kopyalamak gerekmez; örnekler arasındaki fark da görünür olur.

Bu birleşimi `Comedy` için adım adım izleyelim:

| Aşama | `label` değeri | Neden? |
| --- | --- | --- |
| Meta `args` | `Dram` | Bütün örneklerin ortak başlangıcı |
| `Comedy` story `args` | `Komedi` | Bu story ortak değeri değiştiriyor |
| Bileşene giden prop | `Komedi` | Story değeri ortak varsayılanın önüne geçiyor |
| Katalog adı | `Comedy` | Açan kişi hangi örneğe baktığını anlıyor |

Burada bir zamanlama yarışı yok; önemli olan iki kaynaktan gelen props'ların nasıl birleştiği. Story'ye özel değer varsa o değer kullanılır, yoksa meta'daki ortak değer kalır.

## Bir film kartının durumlarını anlat

Sinema'da `FilmBanner` bileşeni bir filmin başlığını ve durum etiketini gösteriyor olsun. Şimdi üçüncü bir yenilik ekleyelim: `argTypes`, Storybook arayüzünde kişinin değiştirebileceği anlamlı prop kontrollerini tanımlar. Örneğin `status` için bir seçim menüsü sunabiliriz.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilmBanner } from './film-banner'

const meta = {
  component: FilmBanner,
  args: { title: 'Kayıp Rota', status: 'now-showing' },
  argTypes: {
    status: { control: 'select', options: ['now-showing', 'coming-soon'] },
  },
} satisfies Meta<typeof FilmBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Vizyonda: Story = {}
export const Yakinda: Story = { args: { status: 'coming-soon' } }
export const UzunBaslik: Story = {
  args: { title: 'Yağmurdan Sonra Uzun Bir Yolculuk', status: 'now-showing' },
}
```

Storybook'ta `Vizyonda` ortak başlık ve durumu gösterir. `Yakinda` aynı filmi koruyup yalnızca durum etiketini değiştirir; `UzunBaslik` ise metnin tasarımı nasıl etkilediğini görmeni sağlar. Bu örnekler üç farklı soruya cevap verir: temel görünüm, başka ürün durumu ve uzun metinde yerleşim.

`argTypes` listesini her prop'u kontrol edilebilir yapmak için doldurma. Tasarımcının gerçekten karşılaştıracağı `status` gibi seçenekleri aç; veri yükleme gibi uygulamanın iç ayrıntılarını kontrol olarak sunma. Story'ler gerçek component API'sini kullanır. Bileşenin kabul etmediği bir prop'u story'ye eklemek örneği belgelemez, olmayan bir kullanım varmış gibi gösterir.

`satisfies`, TypeScript'e nesnenin `Meta<typeof FilmBanner>` biçimine uyup uymadığını kontrol ettirirken nesnenin kendi çıkarılan tipini koruyan bir ifadedir. Burada hem `component` ve `args` alanlarındaki hatalar yakalanır, hem de `StoryObj<typeof meta>` bu meta bilgisinden story tipini çıkarabilir.

![Meta varsayılanlarının named story'lere uygulanıp bileşen durum kataloğunda gösterilmesini anlatan diyagram](diagrams/story-akisi.svg)

## İsim, veri ve çevre de örneğin parçası

`State2` gibi ad, bir örneği açmadan onun neyi gösterdiğini söylemez. `UzunBaslik` gibi ad ise görünüm kararını belirtir; açan kişi bu örneği neden inceleyeceğini bilir. Durum isimlerini görünüş sırasına göre değil, ürün içinde görülen davranışa göre seç: boş sonuç, hata, bekleyen işlem, devre dışı denetim veya uzun içerik.

İyi bir katalog bütün prop birleşimlerini çoğaltmaz. Temel kullanımın yanında tasarım ya da davranış kararı doğuran sınır durumlarını seç. Kayıt formundaki uzun hata metninin satırları kaydırıp kaydırmadığını görmek istiyorsan o başlangıç durumu için `UzunHata` gibi tek bir örnek yeterlidir; aynı formun `Default2` kopyası yeni bir şey göstermez.

Örneğin her açılışta farklı film başlığı seçilirse tasarımcı kartın aynı halini tekrar bulamaz. Sabit örnek verisi, gerekli tema ve gerekiyorsa context sağlayıcısı story'nin tekrar açılabilmesini sağlar. Sağlayıcı, birden çok story'nin paylaştığı tema veya context değerini verir; ihtiyaç yoksa tüm uygulamayı sarmalama, çünkü bu bileşeni çevresinden ayırmayı zorlaştırır.

Storybook içindeki örnek, gerçek uygulamanın gizli route'una, kullanıcının tarayıcı deposundaki eski ayara veya dış servise bağlı olursa başka biri aynı başlangıcı göremeyebilir. Sabit veri ve yalnızca gerekli çevre koşulları bu yüzden önemlidir. Tema için de uygulamanın merkezi CSS token'larını kullan; story'de rastgele inline renk seçmek gerçek ürün temasını göstermez.

## Görüntü, klavye ve erişilebilirlik ayrı ayrı

Storybook bir bileşeni incelemeyi kolaylaştırır, ama tek başına bütün erişilebilirliği kanıtlamaz. Erişilebilirlik ağacı, tarayıcının ekran okuyucu gibi yardımcı teknolojilere sunduğu öğe, rol ve ad yapısıdır. Otomatik bir denetim bu yapıdaki bazı sorunları veya kontrastı bulabilir; menünün Enter ile açıldığını, ok tuşlarının çalıştığını ya da kapandıktan sonra odağın doğru yere döndüğünü tek başına kanıtlayamaz.

Klavye ile menüyü açıp kapatmayı dene ve odağın nereye gittiğine bak. Görsel kontrolün göstermediği şey tam da budur: pikseller aynı kalırken davranış bozulabilir. Önceki modüllerde gördüğün klavye ve erişilebilirlik kontrolleri bu nedenle story kataloğuyla birlikte kullanılabilir.

**Görsel regresyon**, seçilmiş story'lerin yeni görüntülerini önceki görüntülerle karşılaştırıp beklenmeyen piksel değişikliklerini bulma yöntemidir. CSS değişikliği kartı kaydırırsa fark görünür; aynı görüntüdeki bir düğmenin tıklanıp tıklanmadığı ise bu karşılaştırmanın konusu değildir. Görsel karşılaştırma ve davranış kontrolü farklı kanıtlar verir.

Font henüz yüklenmediyse, pencere genişliği değiştiyse ya da animasyon farklı bir karede yakalandıysa görüntü farkı gerçek tasarım değişikliği olmayabilir. Karşılaştırırken aynı viewport ve fontları kullan; animasyon hareketi gerekmeyen örneklerde `reduced-motion` tercihini uygula. Bu tercih, hareketi azaltmak isteyen kişinin sistem ayarına saygı duyan görünümü seçer; animasyon kaynaklı rastgele kare farklarını da azaltabilir.

:::mistake[Story'de sahte prop kullanmak]
Belirti → Katalogdaki `highlighted` seçeneği görünümü değiştiriyor ama uygulamadaki `FilmBanner` böyle bir prop kabul etmiyor. Neden → Story gerçek component API'sinin dışına çıkmış. Düzeltme → Yalnızca bileşenin tanımlı props'larını kullan ve ismi de gerçek davranışı anlatsın.
:::

:::mistake[Otomatik görsel kontrolü davranış testi sanmak]
Belirti → Dropdown'un görüntüsü öncekiyle aynı, ama Enter tuşu menüyü açmıyor. Neden → Görüntü karşılaştırması pikseli kontrol eder, klavye olayını değil. Düzeltme → Görsel karşılaştırmaya ek olarak menüyü klavyeyle kullan.
:::

## Özet

- Storybook bileşeni uygulamadan ayrı gösterir; story, o bileşenin tekrar açılabilir başlangıç örneğidir.
- CSF dosyasında default export meta bilgisini, adlandırılmış export'lar story durumlarını taşır.
- Meta `args` ortak başlangıcı verir; story'nin kendi `args` değeri yalnızca o örnekte farklılaşır.
- Durum adları gerçek bir tasarım veya davranış sorusunu anlatmalı; görsel ve klavye kontrolleri ayrı yapılmalı.

Yeni terimler:

- **CSF:** Storybook'un bileşen meta bilgisini ve adlandırılmış story'leri düzenleme biçimi.
- **args:** Bir story'de bileşene verilen örnek prop değerleri.
- **argTypes:** Storybook arayüzünde hangi prop kontrollerinin sunulacağını tanımlayan ayarlar.
- **satisfies:** Nesnenin bir tipe uyduğunu denetleyip kendi çıkarılan tipini koruyan TypeScript ifadesi.
- **Erişilebilirlik ağacı:** Tarayıcının ekran okuyucu gibi yardımcı teknolojilere sunduğu öğe, rol ve ad yapısı.
- **Görsel regresyon:** Yeni bileşen görüntüsünü eski görüntüyle karşılaştırıp beklenmeyen piksel farklarını bulma.
- **reduced-motion:** Hareketi azaltma tercihini gözeten görünüm seçeneği.

Kendini yokla: Bir story `args` içinde yalnızca `status` verirse başlık nereden gelir? Cevap: Meta'daki ortak `args` değerinden.

Kendini yokla: Aynı dropdown görüntüsü Enter tuşunun çalıştığını kanıtlar mı? Cevap: Hayır; klavye davranışını ayrıca denemelisin.
