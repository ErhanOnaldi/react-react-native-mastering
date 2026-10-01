---
title: "Sinema'da tek doğrulama kaynağı"
minutes: 5
kind: project
---

# Sinema'da tek doğrulama kaynağı

Projede Zod'u Sinema'nın üç gerçek girişinde kullanacaksın: TMDB'den gelen film verisi, kullanıcı formları ve uygulama ayarları. Her biri bir veri sınırıdır: uygulamanın henüz güvenmediği girdinin içeri girip kullanıldığı nokta.

:::model[Tip derlemede, veri çalışma anında]
TypeScript tipi gerçek TMDB yanıtını, form alanını veya environment değerini incelemez. Girdiyi geldiği yerde çalışma anında doğrula; uygulamanın sonraki kısmına yalnızca parse edilmiş sonucu ver. Projede değişen şey model değil, doğrulamanın hangi giriş noktasında yapıldığındır.
:::

## Üç girişi sırayla ele al

İlk olarak film listesi ve detay yanıtlarının hangi alanları taşıdığını mevcut TMDB örnekleriyle karşılaştır. Görevdeki tam alan sözleşmesini dikkatle izle; örneğin poster yolu `null` olabilirken film başlığı olamaz.

Sonra API client, form ve config değişikliklerine geç. HTTP başarısı JSON'un doğru şekilli olduğu anlamına gelmez; form doğrulaması da mevcut label, hata ve gönderim davranışını korumalıdır. Ayarları uygulama açılırken kontrol et ve tarayıcıya giden `VITE_` değerlerini gizli bilgi sayma.

İşe başlamadan önce `z.infer`, `zodResolver`, şemadan türetilen alanlar ve environment kurallarını ilgili derslerdeki model kutularından hatırla. Bir sorun çıktığında hangi giriş noktasından geldiğini belirle; o sınırı tek tek tamamlayıp mevcut ekran davranışlarıyla birlikte gözden geçir.

## Özet

- Proje film verisi, formlar ve uygulama ayarlarını kapsar.
- Her girdiyi uygulamanın içine girdiği yerde doğrula.
- Alan sözleşmelerini ve mevcut ekran davranışlarını birlikte koru.

**Kendini yokla:** HTTP 200 yanıtı, JSON'un geçerli film verisi olduğunu kanıtlar mı?

*Cevap:* Hayır. Yanıt gövdesi de şemaya göre doğrulanmalıdır.

**Yeni terim:** Veri sınırı — dış girdinin uygulamaya girip kullanılmaya başladığı nokta.
