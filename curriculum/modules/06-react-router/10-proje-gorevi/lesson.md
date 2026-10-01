---
title: "Sinema’ya gerçek adresler ekle"
minutes: 6
kind: project
---

# Sinema’ya gerçek adresler ekle

Bu projede öğrendiğin route, ortak layout, bağlantı ve URL state fikirlerini Sinema'nın mevcut React ağacına taşıyacaksın. İlk bölümde sayfa adreslerini ve ortak menüyü kur; sonraki bölümde arama, detay ve favori ekranlarının içeriğini doğru kaynaktan üret.

:::model[URL state ve ağaç kimliği]
Adres hangi sayfanın açık olduğunu ve paylaşılabilir filtreleri seçer. Aynı layout içindeki sayfalar değişirken ortak kabuk kalabilir; Context (React ağacında ortak veriyi birden çok component'e ulaştıran mekanizma) içindeki favoriler ise uygulama state'inde yaşar. Bu nedenle URL'yi favori listesinin kopyasına çevirmeden, her bilgiyi kendi kaynağından oku.
:::

## Çalışırken

Route ağacını önce sayfalar ve ortak alanlar olarak çiz. Menü hangi sayfalarda görünmeli? Hangi ekran ana route'un kendi sayfası, hangileri onun altında? Bu harita layout sınırını kurmana yardım eder.

Sonra adresi doğrudan açma, yenileme ve geri/ileri gezinmeyi dene. Ana sayfa ile menüden geçiş aynı route'a ulaşmalı; arama adresi sorgusunu korumalı; film adresi geçersiz kimlikle bulunamayan filmi ayırt etmeli. Favoriler mevcut Context değerini kullanmalı. Bu aşamada filmler statik veridir, yeni bir ağ isteği eklemene gerek yok.

Bir belirti gördüğünde URL'yi, ortak menüyü ve sayfaya ait içeriği ayrı ayrı kontrol et. Böylece sorun route seçiminde mi, layout'ta mı, yoksa sayfanın kendi veriyi bulma işinde mi olduğunu daha kolay görürsün.

## Özet

- Route ağacı sayfa adreslerini ve ortak layout sınırını belirler.
- Paylaşılabilir arama seçimi URL'de; favoriler mevcut Context'te kalır.
- Doğrudan açılış, yenileme ve geri/ileri gezinmede aynı adres aynı görünümü kurmalı.
- Bu modülde sayfa verisi statiktir; ağdan veri alma sonraki modülde gelir.

**Terimler**

- **Layout route:** Alt sayfaların paylaştığı menü ve kabuk gibi görünümü taşıyan route.
- **Context:** React ağacındaki birden çok component'in ortak veriye erişmesini sağlayan mekanizma.

**Kendini yokla:** Arama sorgusu neden URL'de, favori listesi neden mevcut Context'te kalır?

**Cevap:** Sorgu paylaşılmalı ve geri tuşuyla dönmelidir; favoriler ise sayfa seçimi değil, uygulamanın kullanıcı verisidir.
