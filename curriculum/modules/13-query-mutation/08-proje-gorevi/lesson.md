---
title: "Sinema: puanlama akışını tamamla"
minutes: 9
kind: project
---

# Sinema: puanlama akışını tamamla

Sinema’da bir filmi puanlayınca “Puanladıklarım” listesinin de güncel kalması gerekir. Bu proje üç parçayı bağlar: session ve rated liste API’si, puan verirken geçici görünüm ve rollback (hata halinde önceki veriyi geri yükleme), film detay route’unda bekleme ve hata sınırları.

:::model[Mutation ve invalidation]
POST/DELETE sunucuyu değiştirir, ama query cache’ini kendi başına güncellemez. Optimistic update geçici sonucu gösterir; hata eski veriyi geri alır, sonra ilgili liste sunucuyla uzlaştırılır. Rated liste session’a bağlı olduğundan, bir oturumun yazması diğerinin cache’ini değiştirmemeli.
:::

## Bir bilgiyi hangi kimlik taşır?

İlk örnekte Sinema’nın puan listesini iki kişi açsın. Her birinin **guest session**’ı (giriş yapmadan API’de işlem yapmayı sağlayan oturum kimliği) farklıysa, `guest-1` ve `guest-2` listeleri de farklı veridir. Query key’e session id katmak, cache’in bu iki cevabı birbirine karıştırmamasını sağlar.

Ne oldu? Session id farklı olduğu için cache’te de iki ayrı liste tutulur. Session zaten saklıysa API tekrar yeni bir session istememeli; aynı id ile ilişkili puanlar korunur.

Şimdi aynı puan listesini açıp puan yazdığını düşün. Başarılı POST, sunucuya yazmanın kabul edildiğini söyler; daha önce alınmış liste cevabı hâlâ eski olabilir. Listeyi doğru session key’iyle yeniden okumak, ekrandaki veriyi sunucunun son kabul ettiği duruma getirir.

Ne oldu? Yazma isteği sunucuyu değiştirdi ama daha önceki okuma cevabını değiştirmedi. İlgili listeyi yeniden kontrol etmek, iki görünümün ayrılığını kapatır; HTTP hata cevabı da Promise’i reddetmeli ki arayüz başarı göstermesin.

Üçüncü örnekte puanı hemen ekranda göstermek istersin. Bu **optimistic update**’tir; geçici görünüm başarılı olursa kalıcı sonuçla aynılaşır, hata olursa önceki verinin kopyası olan snapshot geri yüklenir. Ardından listeyi yeniden almak, geçici tahmini gerçek sunucu cevabıyla uzlaştırır.

Bu üç örnekteki temel ayrım şudur: session id “hangi kullanıcının listesi?” sorusunu, query key “cache’te hangi okuma?” sorusunu, mutation ise “sunucuya hangi yazma?” sorusunu yanıtlar. Bu kimlikler tutarlı olursa bir session’ın puanı diğerinin listesini kirletmez.

Puan akışının beklenen zamanını izleyelim:

| An | Sunucu / cache | Ekran |
| --- | --- | --- |
| t0 | Rated listede önceki puan var | Onaylı puan görünür |
| t1 | POST başlar; optimistic değer cache’e yazılır | Yeni puan hemen görünür |
| t2-başarı | Sunucu kabul eder | İşlem başarılıdır; liste yeniden doğrulanır |
| t2-hata | Sunucu reddeder | Snapshot geri yüklenir ve hata erişilebilir biçimde gösterilir |
| t3 | Rated query sunucudan cevap alır | Son kabul edilen puan görünür |

Bu sırada arayüzde yeni değerin görünmesi, sunucunun onu kabul ettiğini tek başına kanıtlamaz. Hata yolunu da tasarlamak gerekir; aksi halde 500 cevabından sonra geçici değer kalır ve kullanıcı yanlış puana güvenir.

:::model[URL state ve route verisi]
Film kimliği URL’den gelir; loader route görünmeden önce id’yi doğrulayıp query cache’ini hazırlayabilir. Detay bileşeni aynı query kimliğine bağlanır. Böylece URL gezinmenin, Query cache’i ise sunucu verisinin kaynağı olarak kalır.
:::

## Detay sayfasında gezinme ve veri

Bir film detay linkine basınca router hedef route’u bulur. **Data mode**, React Router’ın loader gibi gezinme öncesi veri hazırlama özelliklerini kullandığın çalışma biçimidir. **Loader**, route görünmeden önce çalışan veri hazırlama fonksiyonudur; URL’den gelen id’yi metin olarak alır, geçersizse Query isteği başlamadan hata verir, geçerliyse aynı film query’sini cache’e hazırlar.

`ensureQueryData` seçilen query key cache’te yoksa isteği çalıştırıp sonucu saklar; varsa eldeki veriyi döndürebilir. Detay component’i de aynı query tanımını kullanır. Böylece loader’ın hazırladığı veriyi ayrı bir state’e kopyalamak gerekmez.

| Zaman | Router ve Query | Kullanıcının gördüğü |
| --- | --- | --- |
| t0 | `/movie/550` hedeflenir | Önceki sayfa |
| t1 | Loader id’yi sayıya çevirip doğrular | Geçiş sürer |
| t2 | Query cache boşsa film GET’i başlar | Bekleme arayüzü |
| t3 | Loader tamamlanır, detay ağacı açılır | Film sayfası |
| Hata | Loader veya detay içeriği hata üretir | İlgili route’un hata arayüzü |

Geçersiz id’de GET başlatmamak, `NaN` gibi anlamsız bir değerin API’ye gitmesini önler. Loader bekleme arayüzü route geçişini, Suspense ise render edilen içeriğin beklemesini yönetir. **Error Boundary**, altındaki React ağacında oluşan render hatasını yakalayıp o bölge için hata arayüzü gösteren sınırdır; detay route’una koyarsan diğer sayfalar çalışmaya devam eder.

:::mistake[Geçici puanı onaylı sanmak]
Belirti → POST 500 döndüğü halde yeni puan ekranda kalıyor. Neden → Optimistic cache güncellendi ama başarısızlıkta önceki snapshot geri yüklenmedi. Düzeltme → Hata yolunu da yazma akışının parçası olarak düşün ve sonrasında listeyi sunucuyla uzlaştır.
:::

## Projeyi nasıl yürütebilirsin?

Önce session ile API sözleşmesini kur; sonra rated query’nin aynı session kimliğini kullandığını doğrula. Ardından optimistic görünümün başarı ve hata yollarını tamamla. Son parçada geçersiz URL, bekleyen detay isteği ve detay hatası için kullanıcıya ne gösterileceğini düşün. Bir adım bitince ekranda gördüğün değerle Network’teki isteği birlikte izle.

`deleteRating(movieId)` çağrısı yalnız film kimliği alır; session’ı API katmanı kendi sakladığı değerden bulur. Bu ayrım, proje dosyaları arasında aynı session’ı tutarlı kullanmana yardımcı olur.

Puan seçicisinde yalnız 0,5 artışlarla 0,5–10 aralığını sun ve seçilen değeri erişilebilir kontrol üzerinden aktar. Bekleme ve hata metinleri de klavyeyle ve ekran okuyucuyla anlaşılır olmalı.

:::info[Derinlemesine (isteğe bağlı)]
Bir API’nin aynı yazma isteğinin tekrarlanmasını tek işlem sayması **idempotency** sözleşmesidir. Ağ yanıtı kaybolduğunda tekrar denemenin çift etki üretmemesi için API ile birlikte tasarlanır. Buradaki proje akışını kurmak için ayrıca bir idempotency anahtarı tasarlaman gerekmez.
:::

## Özet

- Session id rated listenin kimliğinin parçasıdır; query key’de de aynı kapsamı koru.
- Optimistic değer geçicidir; hata halinde snapshot’ı geri yükle.
- Başarıdan sonra listeyi sunucuyla uzlaştır.
- Loader URL id’sini doğrular; Suspense beklemeyi, Error Boundary detay ağacındaki render hatasını gösterir.

**Yeni terimler**

- **Guest session:** API’de kullanıcı işlemlerini ilişkilendiren girişsiz oturum kimliği.
- **Optimistic update:** Sunucu cevabından önce geçici sonucu gösteren cache güncellemesi.
- **Data mode:** React Router’ın loader ve veri gezinmesi özelliklerini sağlayan çalışma biçimi.
- **Loader:** Route görünmeden önce gezinme sırasında çalışan veri hazırlama fonksiyonu.
- **Error Boundary:** Alt React ağacındaki render hatasını yakalayıp hata arayüzü gösteren sınır.

**Kendini yokla:** Loader film verisini hazırladıysa detay component’i neden Query hook’u kullanmaya devam eder?

Cevap: Aynı cache kaydına bağlanıp sonraki değişiklikleri ve yenilemeleri takip etmek için.

**Kendini yokla:** Yeni puan hemen görünüyorsa bu, POST’un başarılı olduğunu kanıtlar mı?

Cevap: Hayır. Optimistic değer geçicidir; sunucu reddederse snapshot geri yüklenmelidir.
