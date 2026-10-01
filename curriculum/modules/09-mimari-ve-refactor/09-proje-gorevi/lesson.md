---
title: "Sinema'nın sınırlarını kur"
minutes: 9
kind: project
---

# Sinema'nın sınırlarını kur

Bu projede Sinema v1'in ekran davranışını koruyarak dosyaların ve isteklerin sorumluluğunu düzenleyeceksin. Küçük egzersizlerde öğrendiğin feature sahipliği, ortak HTTP kapısı ve anlamlı API fonksiyonları şimdi çalışan uygulamada birlikte yer alıyor.

:::model[Feature'dan shared'e bağımlılık]
Feature, kendi alanına ait endpoint anlamını bilir ve ortak HTTP katmanını çağırır. `shared` ortak kuralları sağlar; feature dosyalarını import etmez. Böylece örneğin film ekranı `/movie/...` yolunu seçer, ortak client ise token, dil ve hata kuralını uygular.
:::

## Önce dosyaların yerini belirle

İlk adımda film, arama ve favori kodlarını özelliklerine göre grupla; gerçekten ortak kullanılan puan, tarih ve afiş yardımcılarını ortak alanda tut. Bu ayrımda bir dosyanın sahibi, dosyayı kullanan her ekran değil, onun temsil ettiği davranıştır.

Örneğin aramanın URL seçimini okuyan kod `search` özelliğine yakın durur. Aynı afiş adresi üreticisini arama ve favori kullanıyorsa helper ortak alana taşınır. Bu dosyaları taşıyınca `@/` yollarını hem TypeScript hem Vite aynı `src/` köküne bağlamalı; aksi halde editör yolu tanırken uygulama derlemesi bulamayabilir.

## Sonra ortak HTTP kuralını uygula

İkinci adımda ortak client'a TMDB kök adresi, `language=tr-TR` ve `Authorization: Bearer ...` başlığı gibi HTTP kuralları girer. Bearer, token'ı `Authorization` başlığında taşıyan yetkilendirme biçimidir; URL'ye eklenirse adres geçmişinde ve loglarda açığa çıkabilir.

Bir çağrıyı sırayla izle:

| Sıra | Nerede? | Ne olur? |
|---|---|---|
| 1 | Film feature API'si | Örneğin detay için endpoint yolunu ve film kimliğini seçer |
| 2 | Ortak client | `/3` kökünü, Türkçe dili ve Bearer başlığını ekler |
| 3 | Sunucu cevabı | Başarı verisi döner veya HTTP hatası oluşur |
| 4 | Çağıran ekran | Veriyi gösterir ya da açıklanabilir hata durumunu sunar |

Adımların bu sırada kalması, ekranların token ve URL kurallarını tekrar etmesini önler. HTTP hatasında status ve varsa TMDB hata bilgisini taşıyan `ApiError` kullanılabilir; hata mesajını tek bir kapıda biçimlendirmek ekran davranışını tutarlı tutar.

`get<T>` içindeki `T`, TypeScript'e beklenen cevabın şeklini söyler. Bu bir type hint'tir; sunucudan gelen JSON'u çalışma anında kontrol etmez. Schema doğrulaması, gelen verinin çalışma sırasında beklenen alan ve türlere uyup uymadığını denetlemektir. Projede `get<T>` yazmak tek başına böyle bir doğrulama sağlamaz.

## En son feature API'sini bağla

Son adımda ekranlar ham endpoint adresi yerine `getTrendingMovies`, `searchMovies` veya `getMovieDetails` gibi anlamlı film fonksiyonlarını çağırır. Bu fonksiyonlar film endpoint'ini bilir ve ortak client'ı kullanır. Detay cevabında kadro ile videoyu birlikte istemek ya da aramada sorgu ve sayfayı geçirmek feature API'sinin anlamlı seçimleridir.

Üç adımı sırayla uyguladığında önce import'lar toparlanır, sonra ortak HTTP politikası tek yere girer, ardından ekranlar feature API'ye bağlanır. Her taşıma sonrasında uygulama davranışını kontrol et: ana sayfa, arama, tür filtresi, detay, favori ve URL'den geri kurulan sayfalama aynı sonucu vermeli.

:::mistake[Eski fetch yolunu bırakmak]
**Belirti →** Bir ekran yeni client'ı kullanıyor ama başka bir endpoint hâlâ kendi `fetch` çağrısını yapıyor. **Neden →** Taşıma tamamlanmadan dosya düzeni bitti sayıldı. **Düzeltme →** Ekranların feature API fonksiyonlarını kullandığını, bu fonksiyonların da ortak client'a gittiğini uçtan uca izle.
:::

## Özet

- Dosyayı temsil ettiği özelliğe göre yerleştir; gerçekten ortak yardımcıyı shared'e koy.
- Ekran → feature API → ortak HTTP client sırasını koru.
- Bearer token başlıkta taşınır; `get<T>` cevabı çalışma anında doğrulamaz.
- Küçük taşımalardan sonra mevcut ekran davranışını yeniden kontrol et.

**Yeni terimler:** `Bearer`: Yetkilendirme token'ını `Authorization` başlığında taşıma biçimi. `Schema doğrulaması`: Gelen verinin çalışma sırasında beklenen şekle uyup uymadığını kontrol etme. `Type hint`: Derleme sırasında beklenen tipi anlatan ipucu; runtime kontrolü değildir.

**Kendini yokla:** Film endpoint yolunu hangi katman seçer?
*Cevap:* Film feature API'si; ortak client HTTP kurallarını uygular.

**Kendini yokla:** `get<MovieListResponse>(...)` JSON'un biçimini çalışma anında garanti eder mi?
*Cevap:* Hayır. Bu yalnız TypeScript'e tip ipucu verir; runtime schema doğrulaması gerekir.
