---
title: "Arama, URL ve önbellek"
minutes: 9
kind: project
---

# Arama, URL ve önbellek

Kitaplık’ta “Dune” arayıp 2. sayfaya geçtin. Sayfayı yenileyince aynı arama ve sayfa açılmalı; geri tuşuyla da önceki sonuçlara dönebilmelisin. Bunun için arama ve sayfa URL’de yaşar, API yanıtları ise sorgu önbelleğinde tutulur.

:::model[URL state]
Paylaşılması veya geçmişte gezinirken korunması gereken bilgi URL’de tutulur. Arama için `q`, sayfa için `page` okunur. URL dışına aynı değerleri ayrıca kopyalarsan ekran ve adres çubuğu zamanla ayrışabilir.
:::

## Bir sorgunun kimliği

TanStack Query’nin **query key**’i, önbellekteki bir isteğin kimliğidir. `['books', 'Dune', 1]` ile `['books', 'Dune', 2]` farklı arama sayfalarıdır; sayfa numarasını anahtara koymazsan Query bu iki isteği aynı sanabilir.

| An | URL | Query key | Ekran |
| --- | --- | --- | --- |
| Aramadan önce | `/search?q=` | Devre dışı | Arama yönergesi |
| “Dune” aranır | `?q=Dune&page=1` | `['books', 'Dune', 1]` | 1. sayfa yüklenir |
| Sonraki sayfaya geçilir | `?q=Dune&page=2` | `['books', 'Dune', 2]` | Yeni sayfa istenir |
| Geri tuşuna basılır | `?q=Dune&page=1` | İlk anahtar | Önbellekteyse sonuç geri gelir |

Bu sırada form gönderimi URL’i değiştirir, URL değişince sorgunun kimliği de değişir. Yeni sayfa gelirken önceki sayfayı tutmak ekrandaki boşalmayı önler.

## İstekleri yalnızca gerektiğinde yap

Boş sorguda istek atma. `enabled` gibi bir koşul sorguyu durdurabilir; TypeScript’te boş değeri API fonksiyonuna vermeden önce korumak için **`skipToken`** da kullanılabilir. `skipToken`, sorgu için geçerli girdi yokken Query’ye çalıştırılabilir bir fonksiyon vermemeni sağlar.

Kitap araması form gönderilince çalıştığı için her harfte istek çıkmaz. **Debouncing**, art arda gelen hızlı olayları kısa süre bekletip sonuncusunu çalıştırma tekniğidir; yazarken canlı arama istenseydi kullanılabilirdi. Bu akışta submit yeterli, ekstra zamanlayıcı gereksizdir.

API verisi de güvenilir kabul edilmez. Gelen başlık, kapak ve yazar alanlarını uygulamanın kullanacağı tek biçime dönüştür; örneğin kapak kimliği yoksa kapak adresi üretme, yer tutucu göster. Bu dönüşüm bileşeni dış API’nin alan isimlerinden ayırır. Zod şeması ham yanıtı sınırda doğrular; uygulama içinde yalnızca güvenli modeli kullanırsın.

![Zod sınır doğrulaması ham veriyi tipli modele dönüştürür ya da hatayı ayırır](diagram:zod-sinir)

:::mistake[Arama ve sayfayı tek query key altında toplamak]
Belirti: Sonraki sayfaya bastığında eski sonuçlar görünür veya farklı aramalar birbirine karışır. Neden: Anahtarda `q` ya da `page` eksiktir. Düzeltme: İsteğin sonucunu değiştiren tüm URL değerlerini query key’in parçası yap.
:::

## Çalışma sırası

Önce URL’den sorgu ve geçerli sayıyı çıkar; boş sorguda isteği kapat. Sonra query key’i ve API’den gelen veri dönüşümünü kur. Son adımda yükleniyor, hata, boş sonuç ve başarı görünümlerini birbirinden ayır. Sayfalama düğmelerinin URL’i değiştirdiğini ve geri tuşunun aynı URL’i geri getirdiğini dene.

## Özet

- Arama sorgusu ve sayfa URL’in sahibidir.
- Query key sorgu sonucunun önbellek kimliğidir; sonucu etkileyen değerleri içerir.
- Boş sorguda istek kapalı kalır; submit tetiklemesi bu uygulama için yeterlidir.
- Dış API verisini bileşenlere vermeden önce güvenli uygulama biçimine dönüştür.

**Yeni terimler:** Query key: önbellekte bir sorguyu tanımlayan anahtar. `skipToken`: geçerli sorgu girdisi yokken sorguyu tip güvenli biçimde devre dışı bırakma değeri. Debouncing: hızlı olaylardan yalnızca sonuncusunu kısa bekleme sonunda çalıştırma.

### Kendini yokla

1. Query key’de `page` yoksa ne ters gidebilir? **Cevap:** Farklı sayfalar aynı sorgu kimliğini paylaşır ve yanlış sayfa önbellekten gelebilir.
2. Form submit edilen aramada debouncing neden şart değil? **Cevap:** İstek her tuş vuruşunda değil, kullanıcı formu gönderdiğinde çalışır.
