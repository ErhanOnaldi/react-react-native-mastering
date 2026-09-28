---
title: "Redux, Query ve Zustand arasında seçim"
minutes: 7
kind: review
---

# Redux, Query ve Zustand arasında seçim

:::pain[Sinema’da sorun]
Store kurulduktan sonra yeni ekip arkadaşı TMDB aramalarını da Redux’a taşımayı önerdi. Bir diğeri dört client slice’ı için Zustand’ın daha kısa olacağını söylüyor. İkisi de araç adıyla başlıyor; önce çözmeye çalıştıkları yaşam döngüsünü yazmak gerek.
:::

:::model[State sahipliği]
Sunucunun ürettiği ve zamanla değişen verinin sahibi Query; uygulamadaki ortak kullanıcı tercihinin sahibi Redux olabilir. URL, paylaşılabilir navigasyon state’ini; RHF, düzenlenen form değerlerini taşır. Buradaki karar yeni bir state modeli değil, client store’u için uygun kütüphane seçmektir.
:::

## Aynı işi yapmayan araçlar

TanStack Query server state cache’i, yeniden doğrulama, loading/error ve mutation invalidation için tasarlanmıştır. Redux Toolkit slice’ları ortak client state’i ve action kurallarını düzenler. RTK Query, Redux ekosisteminde server API cache’i sunar. Zustand ise küçük/orta client state yüzeyinde daha az kurulumla store paylaşır.

| Gereksinim | Uygun başlangıç | Seçim işareti |
| --- | --- | --- |
| API cevabını cache’le, arka planda yenile | TanStack Query | Mevcut Query cache’i var; endpoint’i ikinci kez sahiplenme |
| Ekipte ortak action, middleware ve DevTools akışı | Redux Toolkit | Birden çok özellik ve açık geçiş kuralları gerekiyor |
| Küçük client state, az kurulum | Zustand | Redux middleware/DevTools ekosistemine ihtiyaç yok |
| URL ile paylaşılabilir filtre | Router URL state | Geri/ileri ve link davranışı gerekiyor |

Sinema’nın dört ortak client alanı RTK ile birlikte çalışabilir; TMDB sonucu Query’de, arama ve sayfa URL’de kalır. Uygulama daha küçükse Zustand da geçerli bir seçim olabilir. Kütüphane seçimi doğrudan render performansını garanti etmez; selector veya subscription tasarımı önemini korur.

## İki cache’i gerekçesiz kurma

Query’de bulunan TMDB detayını Redux’a kopyalarsan invalidation sonrası iki farklı tazelik saati oluşur. RTK Query’ye geçmek de mümkündür, fakat Query cache’ini “Redux var artık” diye paralel tutmamalısın. Server state katmanını değiştireceksen endpoint’leri, loading/error arayüzlerini ve testleri tek planla taşı.

:::mistake[Belirti → Aynı API cevabının iki farklı sürümü]
Belirti → Bir ekranda yeni fiyat, diğerinde eski fiyat görülüyor.  
Neden → Query ve Redux kopyaları bağımsız güncelleniyor.  
Düzeltme → Tek cache sahibi belirle; migration gerekiyorsa geçişi tamamla ve diğer kopyayı kaldır.
:::

:::mistake[Belirti → “Daha az kütüphane” için URL filtreleri store’a taşındı]
Belirti → Geri tuşu önceki arama filtresini geri getirmiyor.  
Neden → Navigasyon state’i adres çubuğundan çıkarıldı.  
Düzeltme → Paylaşılabilir ve geçmişe yazılması gereken seçimleri URL’de tut.
:::

:::sector
Ekip kararı; geliştirici sayısı, mevcut mimari, middleware/DevTools ihtiyacı ve bakım maliyetine göre verilir. Küçük bir değer için Redux kurmak şart olmadığı gibi, büyük ekipte standartları ve izlenebilirliği tamamen bırakmak da maliyet doğurabilir. Kararı kod tabanında kısa bir ADR ile kayda geçirmek, aynı tartışmanın her feature’da tekrarlanmasını önler.
:::

## Özet

- TanStack Query ve RTK Query server state cache araçlarıdır; Redux Toolkit slice’ları client state içindir.
- Zustand, daha küçük kurulum isteyen client state senaryolarında düşünülebilir.
- Aynı API verisini iki bağımsız cache’te yaşatma.
- URL ve form state’i sırf ortak store var diye taşınmaz.

**Kendini yokla:** Query kullanan uygulama Redux Toolkit de kullanabilir mi?  
*Cevap:* Evet; farklı state sahiplerini yönetebilirler.

**Kendini yokla:** RTK Query kararı en çok ne zaman anlamlı olur?  
*Cevap:* Server cache mimarisini bilinçli olarak RTK Query’ye taşıma ihtiyacı varsa.
