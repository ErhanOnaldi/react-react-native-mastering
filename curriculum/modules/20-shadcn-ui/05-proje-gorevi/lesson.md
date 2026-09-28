---
title: "Sinema'ya sahip olduğun UI parçalarını ekle"
minutes: 7
kind: project
---

# Sinema'ya sahip olduğun UI parçalarını ekle

:::pain[Problem]
Sinema'daki fragman penceresi ve film menüsü fareyle çalışıyor; klavye odağını, Escape ile kapanmayı ve doğru focus dönüşünü iki yerde de aynı tutmak zor. Yorum puanları da tek seçim olmasına rağmen beş ayrı düğme gibi davranıyor.
:::

Bu proje Sinema'nın UI katmanını güncel bileşen parçalarına geçirirken uygulama davranışını korumanı ister. İş iki yüzeyde buluşur: film detayındaki dialog ve menü; yorum formundaki puan seçimi, alan hataları ve gönderim sonucu. Kaynak dosyaları ürünün diliyle uyumlu hale getir, sonra detay ekranını fare ve klavyeyle dolaş.

:::model[Compound component ve asChild]
19. modülde compound parçaların ortak davranış bağlamını, `asChild`'ın DOM düğümünü çocuk elemente devretmesini öğrendin. Dialog ve dropdown birden fazla parçayla kullanılır; link eylemi link semantiğini korumalı. Burada yeni olan, primitive'in hazır klavye/focus davranışını senin sahip olduğun kaynak dosyaya bağlaman.
:::

:::model[Tema token'ları]
4. modüldeki tema token'ları rolü ve rengi ayırır. `.dark` sınıfı portal içeriklerini de kapsamalı; bu yüzden ortak DOM kökünde durmalıdır. Sayfa karanlık görünürken dialogun açık kalması, tema kapsamının portalı dışarıda bıraktığını gösterir.
:::

## Çalışırken karar ver

Önce mevcut `components.json`, alias'lar, tema class'ı ve detay sayfasının etkileşimlerini oku. Yeni kaynak dosyalarını eklerken proje içindeki `cn` yardımcısını yeniden kullan; aynı yardımcıyı ikinci kez üretme. Sonra görünür adları Türkçeleştir ve ürün state'iyle etkileşimleri koru.

Yorum formunda her alanın etiketi, kontrolü ve hata açıklaması aynı alana bağlanmalı. Puan seçimi bir gruptur; yön tuşlarıyla hareket edebilmesi ve grubun adının “Puan” olması gerekir. Sunucu hatasında kullanıcının yazdığı metin kalmalı; başarılı gönderimde açık bir sonuç görünmelidir.

:::mistake[Özel görünüm, kaybolan davranış]
Belirti → Dialog görünümü yenilendi ama Escape kapatmıyor veya odağı açan kontrole döndürmüyor. Neden → Yalnız CSS ve görünür panel taşındı, etkileşim primitive'i eksik kaldı. Düzeltme → Trigger, içerik ve kapatma parçalarını birlikte kur; klavye akışını uçtan uca dene.
:::

:::sector
Bir ürün ekibi kopyalanmış UI kaynaklarını kendi bileşenleri gibi sahiplenir. Kod incelemesinde görünüm kadar adlandırma, klavye kullanımı, portal teması ve hata ilişkileri de gözden geçirilir. Görsel olarak doğru duran bir control, erişilebilir adı veya focus sırası yanlışsa tamamlanmış sayılmaz.
:::

## Özet

- Mevcut route ve veri davranışını koruyarak UI parçalarını değiştir.
- Dialog/menu etkileşimlerini klavyeyle dolaş; focus dönüşünü kontrol et.
- Tema sınıfının portalı kapsadığını ve form hatalarının doğru alana bağlandığını doğrula.

Kendini yokla: Menü açıkken yön tuşları çalışmıyorsa yalnız class değiştirmek yeter mi? Cevap: Hayır, etkileşim primitive'inin doğru trigger/content/item parçaları da kullanılmalı.
