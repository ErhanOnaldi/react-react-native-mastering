---
title: "Sinema'da liste ve yorum formları"
minutes: 6
kind: project
---

# Sinema'da liste ve yorum formları

Bu projede iki formu tamamlayacaksın: biri izleme listelerini tarayıcıda saklar, diğeri yorumu sunucuya yollar. İkisi de RHF kullanır; kayıt hedefleri ve başarı koşulları farklıdır. Başlamadan önce form değerinin, kalıcı kaydın ve ağ isteğinin hangi veriye sahip olduğunu ayır.

:::model[Form state ve mutation]
RHF alan değerlerini, doğrulamayı ve form durumunu yönetir. **Mutation**, sunucuda kayıt oluşturan veya değiştiren istektir; bekleme, başarı ve hata bilgisi TanStack Query'den gelir. Yeni örnekte değişen soru şudur: başarıyla bitince hangi veri kaynağını güncellemen gerekiyor?
:::

## Form değerinden kayda ilerle

Önce küçük bir film notu düşün: formda yalnızca `text` vardır, ama tam kayıt `id` ve `createdAt` de taşır. Form değerleri kullanıcının girdisidir; **domain kaydı**, uygulamanın saklayıp başka ekranlarda kullandığı tam nesnedir. Kimlik ve oluşturulma zamanı gibi alanları kayıt oluşturulurken eklemek, kullanıcıdan olmayan veriyi form alanı gibi göstermeni önler.

Şimdi aynı listeye değişken sayıda tür etiketi eklediğini düşün. Etiketleri ekranda satır satır çizmek yetmez; kullanıcı ortadaki satırı sildiğinde kalanların değeri ve sırası korunmalı. `useFieldArray` bu satır işlemlerini RHF formuyla birlikte yönetir; satırın React `key` değeri ise form adresindeki sıra numarasından ayrı bir kimliktir.

Son olarak puan seçilen bir film yorumu düşün. Puan arayüzü özel bir seçim olsa da formun değeri olmalı; yorumu yazan native textarea ise `register` ile bağlanabilir. Gönderim sırasında endpoint'in kabul ettiği alanları seçip **payload**'ı (istekle gönderilen veriyi) kurarsın; arayüzde bulunan her değer otomatik olarak sunucu gövdesine ait değildir.

## Kayıt anını ayır

İzleme listesi tarayıcıda kalıcı saklanır; yorum ağ isteği bekler. **Kalıcı depolama**, sayfa kapandıktan sonra da tarayıcıda kalan veridir. Yorumda ise mutation beklerken düğmeyi kapatmak, başarıda geri bildirim vermek ve hata halinde girdiyi korumak gerekir.

| An | Liste formu | Yorum formu |
|---|---|---|
| Submit öncesi | RHF alanları ve alan hataları | RHF alanları ve alan hataları |
| Gönderim | Değerlerden yeni yerel kayıt hazırlanır | Mutation bekliyor; tekrar gönderim engellenir |
| Başarı | Yerel liste güncellenir, form temizlenir | Başarı görünür, form temizlenebilir |
| Hata | Yerel kayıt eklenmez | Hata görünür, kullanıcının girdisi korunur |

Bir belirtiyle karşılaşırsan doğru katmanı izle: etiket sırası için alan dizisine, liste görünmüyorsa hook durumuna ve tarayıcı kaydına, yorum siliniyorsa mutation sonucuna bağlı reset anına bak. Kalıcı kayıt yapmak ekrandaki listeyi kendi başına güncellemez; ikisini de güncellemen gerekir.

:::model[Alan hatası ve erişilebilir ilişki]
Görünür label alanı adlandırır. Alan geçersizse `aria-invalid` durumunu, `aria-describedby` ile de hata metninin id'sini bağla; `role="alert"` yeni mesajı duyurmaya yardım eder. Hata paragrafı görünse bile id bağlantısı yoksa yardımcı teknoloji hangi alana ait olduğunu bilemeyebilir.
:::

:::mistake[Hata sonrası veri kayboldu]
**Belirti:** Yorum isteği reddedilince metin veya seçim temizlenir. → **Neden:** Form istek sonucunu beklemeden sıfırlanmıştır. → **Düzeltme:** Formu yalnızca başarıdan sonra temizle; hata mesajını gösterip aynı girdiyi tekrar denemeye bırak.
:::

## Çalışma planı

Önce alanları, başlangıç değerlerini ve doğrulamayı kur; hata mesajını ilgili alana bağla. Sonra satır ekleme/silmeyi, yerel kayıtla hook ve tarayıcı deposunun güncellenmesini, ağ kaydında da pending/success/error akışını dene. `Omit` form girdisini tam kayıt tipinden, `Partial` kısmi güncelleme tipini ayırır.

## Özet

- Form girdisi, uygulamanın tam kaydı ve sunucuya giden payload farklı şekillerde olabilir.
- Değişken satırları form değeriyle birlikte yönet; silme sonrası kalan sıra ve değerleri izle.
- Yerel kayıt sonrası uygulama listesini de güncelle; ağ hatasında form girdisini koru.
- Alan hatasını hem görünür kıl hem de ilgili kontrole bağla.

**Terimler:** **Domain kaydı** — uygulamanın kullandığı tam veri nesnesi. **Kalıcı depolama** — sayfa kapandıktan sonra da kalan tarayıcı verisi. **Mutation** — sunucuya veri yazan istek.

**Kendini yokla:** Formda görünen her değer neden isteğe gönderilmez? Çünkü hedef yalnızca kendi sözleşmesindeki alanları kabul eder. Yorum isteği hata verirse alanları ne zaman temizlemelisin? Başarılı cevap geldikten sonra.
