---
title: "Sinema’da tek doğrulama kaynağı"
minutes: 6
kind: project
---

# Sinema’da tek doğrulama kaynağı

:::pain[Problem]
Detay sayfası kötü TMDB yanıtında hâlâ çökebiliyor; formlar ve env ayrı kurallar taşıyor. Şemaları gerçek Sinema sınırlarına yerleştirip bozuk veriyi uygulama içinde ilerlemeden yakalayacaksın.
:::

:::model[Tip derlemede, veri çalışma anında]
TypeScript tipleri gerçek TMDB cevabını, form alanını veya env değerini incelemez. Her sınırda ham değeri çalışma zamanında doğrula ve sonraki katmana parse edilmiş çıktıyı ver. Bu projede modelin değişen yanı, aynı ilkenin API, form ve başlangıç ayarlarına uygulanmasıdır.
:::

## Sınırları sırayla kur

Önce film verisinin şemalarını gerçek yanıt örneklerine göre tamamla. TMDB posterinin null olabildiğini koru; başlık null ya da boşsa reddet. Sonra API client'ta HTTP durumunu ve JSON şeklinin doğruluğunu ayrı ele al. Hata sınırda oluşursa React bileşeni bozuk veriyi normal kayıt gibi çizmez.

Form şemalarında iş kuralı tek kaynakta olmalı. RHF alan durumunu korurken resolver Zod kurallarını çalıştırır. Kullanıcıya label, alan hatası ve submit davranışı aynı şekilde görünmeye devam etmeli. Dönüşüm varsa ham form değeriyle callback'e giden sonucu karıştırma.

Env ayarını uygulama açılırken parse et. Token gibi zorunlu değer boşsa açıklayıcı hata ver; başlık gibi opsiyonel değer için belirli bir varsayılan seç. Tarayıcıya gönderilen VITE_ değerlerinin gizli olmadığını unutma.

| Sınır | Gözleyeceğin davranış |
| --- | --- |
| TMDB 200 ve title null | Client'tan veri hatası çıkar, UI bozuk başarı verisi almaz |
| Poster null | Film şeması gerçek API değerini kabul eder |
| Boş izleme listesi adı | Alan hatası görünür, kayıt oluşmaz |
| Boş token | Uygulama başlangıcında env adıyla açıklayıcı hata |

## Çalışma sırası

1. Şemaları küçük gerçekçi örneklerle doğrula: null poster geçsin, null başlık kalmalı.
2. Client'ın HTTP ve veri hatası yollarını ayrı tut.
3. Formlarda kural kopyalarını kaldır ve erişilebilir hata gösterimini koru.
4. Env parse'ını uygulamanın tek config girişine taşı.
5. Eski formların görünür davranışları ve dönüşen değer tipleri hâlâ tutarlı mı diye gözden geçir.

Sorun gördüğünde önce sınırın hangisi olduğunu belirle. Hatalı JSON ise film şemasına, HTTP 404 ise client'ın durum kontrolüne, boş kullanıcı adı ise form sözleşmesine bak. Her şeyi ortak bir hata metnine indirmek kullanıcı deneyimini sadeleştirebilir; fakat geliştirici tanısında hata kökenini kaybetme.

:::mistake[Sık hata]
Belirti → Dönüş tipi değişmiş görünür ama bozuk gövde hâlâ ekrana ulaşır. Neden → JSON parse edilmeden yalnızca TypeScript tipi değiştirilmiştir. Düzeltme → Parse çağrısını API client'ın gerçek dönüş yoluna yerleştir.
:::

:::sector
Bu sınırlar güvenilir olunca sonraki Redux ve kimlik doğrulama akışları bozuk TMDB verisini veya boş config'i state'e taşımak zorunda kalmaz. Takım incelemesinde hem şemanın kurallarını hem bu şemanın gerçek giriş noktasında çağrıldığını kontrol et.
:::
