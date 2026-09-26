---
title: "Prefetch ve select"
minutes: 8
kind: concept
---

# Prefetch ve select

:::pain[Problem]
Film kartına tıkladığında detay yüklenene kadar boş ekran var. Fare kartın üstüne geldiğinde kullanıcının niyeti belli; o arada veri getirilebilir.
:::

## İhtiyacı önden hazırlamak, görünümü türetmek

**Prefetch**, kullanıcı henüz sayfaya geçmeden gerekli olabilecek veriyi aynı cache'e getirir. **Select** ise saklanan ham sonuçtan component'in kullanacağı görünümü üretir. İkisi farklı iş yapar: biri isteğin zamanını değiştirir, diğeri okunan verinin biçimini. Cache kimliği tutarlı değilse önden getirilen veri hedef sayfada bulunamaz.

Sinema kartından detaya geçiş, kullanıcı niyetini erken gösteren bir örnek. Query options factory sayesinde hover ve detay ekranı aynı sorguyu tarif eder. `select` kullanınca kart yalnız başlıklara bakabilir; başka ekranlar yine tam cevabı okuyabilir.

## Aynı key ile önceden getir

`queryClient.prefetchQuery(movieQueries.detail(id))` hover sırasında veriyi cache’e koyar. Detay sayfası aynı factory’den gelen aynı key’i kullanırsa taze sonucu ağ isteği olmadan okur. Hover her kartta tetiklenebilir; ölçülü `staleTime` ve anlamlı etkileşim kullan, tüm listeyi bir anda prefetch etme.

## Görünüme uygun seç

`select`, cache’deki ham TMDB cevabından bileşene gereken parçayı türetir: `select: data => data.results.map(movie => movie.title)`. Cache’de ham cevap kalır; başka bileşen farklı bir `select` kullanabilir. Dönüş tipini `queryOptions` ve generic inference taşır.

:::sector
Hover prefetch performansı ağ bağlantısına bağlıdır. `requests('/3/movie/550')` sayısını tıklama öncesi ve sonrası ölç: başarılı prefetch’ten sonra tıklama aynı taze key için yeni GET üretmemeli.
:::
