---
title: "Sinema için lint ve format kapısı"
minutes: 8
kind: project
---

# Sinema için lint ve format kapısı

Sinema’da şimdiye kadar yazdığın React koduna bu kez ortak kalite kontrolleri ekleyeceksin. İlk görevde ESLint ayarlarını projeye bağlayıp bulduğu gerçek sorunları kaynak kodda düzelt; film detayının kimlik değişince güncel kalmasını da koru. İkinci görevde biçim tercihlerini ortaklaştır, dosya istisnalarını belirle ve yazan komutla yalnızca kontrol eden komutu ayır.

:::model[Effect yaşam döngüsü]
Effect, bağlı olduğu değer değişince önce eski çalışmasının cleanup’ını yapar, sonra yeni değerle yeniden çalışır. Film kimliği değişirken isteğin ve cleanup’ın bu sıraya uyup uymadığını hatırla.
:::

:::model[Yarış koşulu]
İki istek farklı sırada dönebilir: önce başlayan eski isteğin cevabı, yeni isteğin cevabından sonra gelebilir. Ekranın en güncel kimliğe ait sonucu göstermesi için eski cevabın yeni sonucu ezmesini önlemen gerekir.
:::

## Sinema’da çalışma sırası

Önce lint ayarlarının kaynak dosyalara uygulandığını gör ve raporları tek tek oku. Bir uyarıyı kuralı kapatarak gizlemek yerine, kodun niyetine uygun düzeltmeyi yap. Ardından detay sayfasında film kimliği değiştiğinde hangi sonucun ekrana geldiğini düşün.

Sonra biçim tercihlerini ve biçimleme dışında kalacak dosyaları tanımla. Yazma komutunu bir kez çalıştırıp değişiklikleri gözden geçir; kontrol komutunun dosyaları değiştirmeden fark bulup bulmadığını ayrıca dene. Son olarak arama, TMDB ve gezinme davranışlarının hâlâ yerinde olduğunu doğrula.

Bu iki görev sana araç ayarlarını uygulamanın gerçek davranışıyla birlikte ele alıştırıyor. Lint kod hakkında belirli sorunları bildirir; uygulamanın doğru davrandığını tek başına kanıtlamaz. Prettier görünüşü ortaklaştırır, iş mantığını düzeltmez.

## Özet

- ESLint’in bildirdiği gerçek sorunları kaynak kodda çöz.
- Film kimliği değişince en güncel filmin gösterildiğini kontrol et.
- Biçimleme ve biçim kontrolü ayrı işlerdir; kontrolün dosya yazmaması gerekir.
- Araçları ekledikten sonra uygulamanın mevcut davranışını yeniden gözden geçir.

**Kendini yokla:** Lint temiz olsa bile film kimliği değişimini neden ayrıca kontrol etmelisin?
*Cevap:* Lint kuralları kaynak kodu inceler; sayfanın doğru filmi gösterdiğini kanıtlamaz.
