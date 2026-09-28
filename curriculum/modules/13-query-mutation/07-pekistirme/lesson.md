---
title: "Silme akışını sağlamlaştır"
minutes: 6
kind: practice
---

# Silme akışını sağlamlaştır

:::pain[Problem]
Bir etkinlik kaydını sildin. Düğme “Silindi” dedi, ama liste aynı kaydı göstermeye devam etti. Yazma türü `DELETE` oldu; ortak cache’in nasıl uzlaşacağı sorusu değişmedi.
:::

## Silmede ne farklı?

Silme de bir mutation’dır. Kullanıcı olayı isteği başlatır; bekleme ve hata durumu yine görünür olmalıdır. Başarılı silmeden sonra etkilenmiş listeyi sunucudan yeniden almak genellikle en güvenli yoldur. Silinen öğeyi cache’ten doğrudan çıkaracaksan, öğenin seçili listede bulunduğundan ve sayfa/toplam sayacının da güncellendiğinden emin ol.

:::model[Mutation ve invalidation]
Yazma, query cache’ini otomatik değiştirmez. Bu görevlerde yeni bağlam silmedir: doğru kaynak ve doğru kullanıcı oturumuna ait key’i hedefle; başarısız işlemde mevcut listeyi koru. Query key’in tamamını değil yalnız gereken aileyi invalidate et.
:::

## Sıra ve kontrol noktaları

İlk görevde bir puan kaydını DELETE ile kaldırırken session id’yi ve yetkilendirme bilgisini doğru taşı. HTTP 4xx/5xx cevaplarında Promise reject olmalı; yoksa mutation başarıya geçer. İkinci görevde iki farklı oturumun cache listesini hazırla ve silmenin yalnız birine ait sorguyu geçersiz kıldığını doğrula.

TMDB puan silme isteği `DELETE /movie/:id/rating?guest_session_id=...` biçimindedir. Guest session id query parametresinde URL-encode edilir; Bearer token `Authorization` başlığında kalır. Bu endpoint’in başarılı cevabında liste nesnesi dönmesi gerekmez; fonksiyon `Promise<void>` ile tamamlanabilir. `response.ok` false ise hata fırlat ki mutation’ın success callback’i çalışmasın.

Çalışırken şu sırayı kullan:

1. Sunucuya gerçekten DELETE gittiğini gözlemle.
2. Hata cevabında başarı mesajı gösterilmediğini kontrol et.
3. Başarıdan sonra ilişkili rated listesinin yenilendiğini gör.
4. Diğer session’ın cache’inin etkilenmediğini doğrula.

İkinci adımda kullanıcı arayüzü değil, key kapsamı önemlidir. `['ratings', sessionId]` aynı oturumun listesini tanımlar; `['ratings']` bütün oturumları eşleyebilir. Geniş key yalnızca bütün aile gerçekten etkilenecekse uygundur.

:::mistake[Başarılı DELETE, başarısız okuma]
Belirti → Kayıt silindi ama aktif listede görünüyor. Neden → Silme sonrası ilgili query stale yapılmadı. Düzeltme → Başarı callback’inde doğru query key’i invalidate et veya tam cevabı immutable biçimde cache’e yaz.
:::

:::sector
Silme eylemleri geri alınamaz olabileceği için ekipler çoğu zaman onay veya kısa undo penceresi kullanır. Cache tarafında ise UI mesajı ile sunucu gerçeğini ayırır; başarı ancak yazma cevabı geldikten ve görünüm uzlaştıktan sonra kesinleştirilir.
:::

## Özet

- DELETE de event ile başlayan bir mutation’dır.
- HTTP hata cevabı mutation’ı reject etmelidir.
- Başarıdan sonra yalnız etkilenen session/query ailesini yenile.
- Cache’ten doğrudan silerken liste ve toplam bilgilerini birlikte düşün.

**Kendini yokla:** İki session listesinden biri silindiğinde neden yalnız ilgili session key’ini hedeflemelisin?  
Cevap: Diğer oturumun sunucu verisi değişmedi; gereksiz refetch ve cache geçersizliği önlenir.
