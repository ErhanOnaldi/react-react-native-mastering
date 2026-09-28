---
title: "Sinema client state’ini store’a taşı"
minutes: 8
kind: project
---

# Sinema client state’ini store’a taşı

:::pain[Sinema’da sorun]
Favori, izleme listesi, tema ve son bakılanlar beş iç içe Context boyunca taşınıyor. Favori değişirken tema tüketicisi de çalışıyor; yenileme sonrası kullanıcının tercihleri kaybolabiliyor. Uygulamanın ortak client state’ini tek akışta toparla.
:::

:::model[State sahipliği]
Redux’a yalnız uygulamanın ortak client state’i taşınır. TMDB film verisi TanStack Query’de, arama ve sayfa URL’de, form taslağı RHF’de kalır. Store’a film nesneleri kopyalamak Query ile ikinci bir kaynak yaratır.
:::

![Server, client, URL ve form durumlarının sahipleri](diagram:state-kategorileri)

:::model[Context yayılımı]
Context Provider değeri değişince onu kullanan tüketiciler yeni değeri alır; beş Provider olması tek başına performans ölçüsü değildir. Yeni yapıda bileşenlerin ihtiyacı olan store değerini dar seç, sonra favori etkileşimi sırasında ilgisiz bir tüketiciyi Profiler veya render sayacıyla karşılaştır.
:::

:::model[Redux veri akışı]
UI bir action dispatch eder, reducer yeni client state üretir, selector sonucu bileşene döner. Storage yazımı reducer’ın içinde değil, action sonrası listener’da yapılır; her geçişte hangi alanların değiştiğini açık tut.
:::

## Uygulama sırası

1. Mevcut davranışları ve saklanan tercih biçimini not et; önce state sahipliğini doğrula.
2. Client state özelliklerini ayrı slice’larda düzenle ve tek store’a bağla.
3. `RootState`, `AppDispatch` ve tipli hook’ları store’dan türet.
4. Root React ağacına Provider ekle; mevcut Query Provider’ın da çalıştığını koru.
5. Bileşenlerde yalnız ihtiyaç duyulan alanı seç; yenileme sonrası korunması gereken değerleri action sonrası kalıcılaştır.
6. Aynı favori etkileşimini önce ve sonra gözlemle; gereksiz render yayılımı olup olmadığını kontrol et.

Store bağlantısı ve kalıcılık birlikte tamamlanınca görünür davranışların yerinde kalması gerekir: tema değişince liste boşalmamalı, bir filmi listeden çıkarıp yeniden açınca kişisel seçimi kaybolmamalı. Bu iki ihtiyaç aynı state sahipliği kararına dayanır ama farklı katmanlarda uygulanır.

## Tamamlanma ölçütleri

- Favori ekleme ve çıkarma farklı ekranlarda aynı kurala uyar.
- Bir izleme listesi aynı filmi iki kez tutmaz; son bakılanlar güncel sırada kalır.
- Tema, listeler, favoriler ve son bakılanlar birbirinden ayrı state alanlarıdır.
- Query’den gelen film detayları Redux’a kopyalanmaz.
- Kalıcılık yoksa uygulama açılır; bozuk kayıt güvenli varsayılanla karşılanır.
- Favori değişimi ilgisiz tema tüketicisinin render’ını artırmaz.

:::mistake[Belirti → Sayfa açılıyor ama yenilemede tercihler sıfırlanıyor]
Belirti → Önceki oturumdaki tema veya favori yok.  
Neden → Storage yükleme/yazma akışı store yaşam döngüsüne bağlanmamış.  
Düzeltme → Başlangıç kaydını güvenli oku; action sonrasında yeni state’i kalıcılaştır.
:::

:::sector
Birden fazla ekranda kullanılan client tercihlerini feature slice’larında tutmak, ileride oturum temizliği ve yeni ekran eklemeyi kolaylaştırır. Kalıcı kayıt biçimine sürüm koymak, uygulama güncellendiğinde eski kullanıcı verisini güvenle dönüştürmeye imkân verir.
:::

## Özet

- Önce her bilginin sahibini belirle; yalnız ortak client state’i store’a taşı.
- Slice, tipli hook, Provider ve persistence akışını tamamla.
- Dar seçim ve ölçümle alakasız render’ı kontrol et.

**Kendini yokla:** TMDB detayını yeni store’a taşımalı mısın?  
*Cevap:* Hayır; Query’de kalır, store’da gerekiyorsa kullanıcı seçimi/ID’si tutulur.
