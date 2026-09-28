---
title: "Sinema’ya gerçek adresler ekle"
minutes: 6
kind: project
---

# Sinema’ya gerçek adresler ekle

:::pain[Problem]
Sinema'da favori seçimi çalışıyor ama sayfaların gerçek adresleri yok. Kullanıcı film detayına doğrudan gelemediği gibi, arama sonucunu yenileyince de ekran başlangıç haline dönüyor.
:::

Bu proje görevi, modülde kurduğun route ağacını Sinema'nın mevcut bileşen ve Context yapısına taşıyor. Önce uygulama girişini router'a bağlayacak, sonra ortak menü ve alt sayfaların sahipliğini belirleyeceksin. Bir sonraki adımda statik film listesini URL'deki sorgu ve kimlikle eşleştirerek ekranları doğrudan açılabilir hale getir.

:::model[URL state ve route kimliği]
URL hangi route zincirini ve görünüm seçimlerini anlatır; route ağacındaki ortak layout gezinirken korunabilir. Film listesi ve favori Context'i gibi veriler URL'nin kendisi değildir. Bu uygulamada adresi ekranı seçmek için kullan, mevcut Context'i ortak React ağacında tut ve sayfaya özel görünümü route'un içinde üret.
:::

## Uygularken

Önce route ağacını kağıt üzerinde sıralamak yararlı olur: ana sayfa, arama, film detayı, favoriler ve tanınmayan adres. Hangi ekranlar aynı menüyü paylaşır? Hangi bileşenlerin state'i route değişince korunmalı? Bu sorular layout sınırını netleştirir.

Sinema bu aşamada statik verilerle çalışır; yeni adresler gerçek ağa giden istek eklemez. Film kartı bir detay adresi açar, arama URL'den sorgusunu okur, favori sayfası mevcut provider'ın state'ini görür. URL'den gelen `id` ve `q` metin değerlerini güvenli biçimde ele al. Geçersiz veya listede bulunmayan id için kullanıcıya anlaşılır durum göster.

İki adresten aynı sayfayı açarak kontrol et: birinde menü üzerinden, diğerinde adresi doğrudan girerek. Arama metnini URL'de değiştirip yenile; ekran ile adresin birlikte kaldığını gözle. Geri/ileri tuşlarını da dene. Bu tür kontrol, yalnızca tıklama yolunun çalıştığını değil, route'un kendi adresinden kurulabildiğini gösterir.

:::sector
Ürün ekipleri route ağacını uygulamanın gezinme sözleşmesi olarak görür. Paylaşılabilir detay ve arama adresleri destek, analitik ve bağlantı paylaşımı için güvenilir birer giriş noktasıdır; ortak layout ise aynı navigasyonun ekranlar arasında tutarlı kalmasını sağlar.
:::

## Özet

- Rota ağacını sayfa sahipliği ve ortak layout'a göre kur.
- URL'den açılışla menü üzerinden gezinmenin aynı içeriği üretmesini sağla.
- URL'de arama ve kimlik gibi görünüm seçimini tut; Context ve statik film verisini kendi sınırında bırak.
- Modül 7'de bu adreslere gerçek HTTP verisi bağlanacak.

**Kendini yokla:** Favorilerin kendisi neden URL'ye yazılmamalı?

*Cevap:* Bu kullanıcı verisi uygulama state'inde yaşar; URL sayfa/filtre seçimini taşır, kayıt listesinin kendisini değil.
