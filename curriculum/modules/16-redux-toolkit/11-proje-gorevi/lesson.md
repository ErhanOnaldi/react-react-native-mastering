---
title: "Sinema client state’ini store’a taşı"
minutes: 8
kind: project
---

# Sinema client state’ini store’a taşı

Bu proje, önceki Redux derslerinde kurduğun parçaları Sinema’daki gerçek ekran akışına uygulatıyor: ortak client state, store bağlantısı, tipli hook’lar, Provider ve kalıcılık. Yola çıkmadan, hangi bilginin hangi katmana ait olduğunu ayır; ardından küçük adımlarla mevcut davranışı koru.

:::model[State sahipliği]
Sunucudan gelen film verisi TanStack Query’de kalır. Paylaşılabilir arama URL’de, düzenlenen form React Hook Form’da; uygulama çapında kullanılan kullanıcı tercihleri Redux store’unda yaşayabilir. Film nesnesini ikinci kez store’a kopyalamak iki ayrı güncellik kaynağı yaratır.
:::

![Server, client, URL ve form durumlarının sahiplerini gösteren diyagram](diagram:state-kategorileri)

:::model[Redux veri akışı]
UI action dispatch eder, reducer yeni client state üretir, selector gereken alanı UI’ya verir. Kalıcılık reducer’ın içinde değil, state geçişinden sonra çalışan listener’da yapılır; böyle reducer yalnızca state’in nasıl değiştiğini açıklar.
:::

:::model[Context yayılımı]
Context Provider değeri değişince onu kullanan bileşenler yeni değeri alır; Provider sayısı tek başına performans ölçüsü değildir. Favori etkileşiminde ilgisiz bir tüketicinin güncellenip güncellenmediğini render farkıyla gözle.
:::

## Önce küçük bir tercih alanını düşün

Diyelim Sinema’da kullanıcı yan panelin açık olup olmadığını birkaç ekranda görüyor. Bu tercih film API yanıtı değildir; uygulama çapında paylaşılacaksa client state olarak tasarlanabilir.

```ts title="Bir ortak tercihin küçük geçişi"
const initialState = { detailsOpen: false }

function setDetailsOpen(state, open: boolean) {
  state.detailsOpen = open
}
```

Bu örnek, bir değerin UI’dan action’a ve reducer’a nasıl bağlanabileceğini gösterir. Önce yalnız tek bir geçişi düşünmek, büyük store tasarımını daha anlaşılır parçalara böler.

## Sonra bağımsız alanları ayır

Şimdi tema ile panel görünürlüğü farklı ekranlarda kullanılıyor. İkisi de client state olabilir, ama birbirinden bağımsız değişmeli; tema seçimi paneli kendiliğinden kapatmamalı.

```ts title="Bağımsız client alanları"
const uiState = {
  theme: 'light' as 'light' | 'dark',
  detailsOpen: false,
}
```

İki alanı ayrı tutunca her action yalnız kendi değerini değiştirir. Bir değeri değiştirmek diğerini sıfırlıyorsa state sınırları fazla iç içe kurulmuş olabilir.

## En son kalıcılığı ekle

Bir tercih yenilemeden sonra da kalmalıysa storage, state’in kalıcı bir kopyasını tutabilir. Storage okuma başarısız olabilir; başlangıçta güvenli varsayılanla açılabilmek gerekir.

```ts title="Kayıt okunamazsa varsayılanı koru"
function readTheme(): 'light' | 'dark' {
  try {
    const value = localStorage.getItem('cinema:theme')
    return value === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}
```

Bu küçük örnekte bozuk ya da erişilemeyen kayıt uygulamanın açılmasını engellemez. Gerçek state akışında yazma işlemi reducer’ın dışında yapılır; önce state geçişini, sonra kalıcılık bağlantısını kurmak hata ayıklamayı kolaylaştırır.

## Uygulama işini sırala

| Sıra | Ne yaparsın? | Neyi kontrol edersin? |
| --- | --- | --- |
| 1 | Var olan bilgileri kaynak ve paylaşılma alanına göre ayırırsın | Server verisi Query’de, ortak client tercihi store’da kalır |
| 2 | Store ve slice sınırlarını kurarsın | Her alanın geçişi bağımsız ve anlaşılırdır |
| 3 | Store’dan state/dispatch tiplerini ve tipli hook’ları çıkarırsın | Bileşenlerde cast ihtiyacı doğmaz |
| 4 | Provider’ı uygulama ağacına eklersin | Redux ve mevcut Query bağlantısı birlikte çalışır |
| 5 | Gereken tercihleri güvenli biçimde kalıcılaştırırsın | Yenileme ve bozuk kayıt sonrası ekran açılır |

## Sık görülen belirtiyi teşhis et

Belirti: favori değişince tema bileşeni de render oluyor. `render`, React’in bileşen fonksiyonunu yeniden çalıştırmasıdır. Nedeni çoğu zaman bileşenin ihtiyaç duymadığı geniş bir state seçmesi veya Context değerinin tüm tüketicilere yayılmasıdır. Bileşenin kullandığı alanı dar seç ve değişim öncesi/sonrası render farkını ölç. `StrictMode`, geliştirmede bazı işleri ek kez çalıştırabilen React denetim modudur; bu yüzden sabit mutlak render sayısı bekleme.

:::tip[Önce davranış, sonra bağlantı]
Bir özelliği taşırken önce eski davranışı hangi state’in sağladığını bul. Yeni store bağlantısını ekledikten sonra aynı kullanıcı akışını dene; sonra yenileme, bozuk kayıt ve ilgisiz bileşenlerin güncellenmesini ayrı ayrı kontrol et.
:::

## Özet

- Yalnız ortak client state’i store’a taşı; Query verisini kopyalama.
- Slice sınırları bağımsız state geçişlerini görünür kılar.
- Tipli hook’lar ve Provider bileşen bağlantısını kurar.
- Kalıcılık reducer dışında çalışmalı ve okuma hatasında uygulama açılabilmeli.
- Dar selector ve render farkı, ilgisiz güncellemeleri bulmaya yardım eder.

**Yeni terimler:**
- `render`: React’in bileşen fonksiyonunu çalıştırıp arayüzü hesaplaması.
- `persistence` (kalıcılık): State’in uygulama yeniden açıldığında geri yüklenmek üzere saklanması.
- `StrictMode`: Geliştirmede bazı işleri ek kez çalıştırarak sorunları görünür kılan React denetim modu.

**Kendini yokla:** TMDB’den gelen film nesnesini neden Redux’a kopyalamazsın?  
*Cevap:* Film yanıtının sahibi Query’dir; kopya ikinci ve farklı zamanda güncellenebilen bir kaynak yaratır.
