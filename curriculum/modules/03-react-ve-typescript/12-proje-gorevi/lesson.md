---
title: "Sinema: statik arama ve favoriler"
minutes: 7
kind: project
---

# Sinema: statik arama ve favoriler

Bu proje iki adımdan oluşur. Önce hazır TMDB fixture'larından statik film verisini çıkarıp kart, grid ve arama bileşenlerini kurarsın. Ardından `App` arama sorgusu ile favori id'lerinin sahibi olur; ekranda görünen filmler bu değerlerden hesaplanır. Bu aşamada API isteği yok.

:::model[Props aşağı, olay yukarı]
Ortak ebeveyn paylaşılacak state'i tutup props olarak çocuklara verir. Çocuk yeni bilgiyi callback ile yukarı yollar. Burada arama alanı sorguyu, film kartı ise değişen filmin id'sini bildirir.
:::

:::model[Ağaçta kimlik ve key]
Film id'si kaydı tanımlar; sıra veya görünür başlık değildir. Grid satırlarında bu id'yi `key` olarak kullan, favori listesini de id'lerle tut. Böylece aramayla gizlenen kart geri geldiğinde favori durumu aynı filme bağlanır.
:::

## Ekranı sırayla dene

Önce `Dövüş Kulübü` ara ve bir kartı favorile. Başka bir başlık arayıp sorguyu temizlediğinde ilk filmin işareti geri gelmeli. Eşleşme yoksa boş durum mesajı görünmeli. Bu akış sana sorgunun görünür listeyi, favori id'lerinin ise film durumunu yönettiğini gösterir.

İlk adımda poster yolu olmayan kayıt için kırık görsel göstermeyen bir metin kullan. Bileşenlerin değerlerini ve callback'lerini sözleşmelerine göre bağla; ikinci adımda aynı arayüzleri `App` ortak state'iyle çalıştır.

## Özet

- Statik veriyi fixture'lardan çıkar ve `Movie` tipini koru.
- Sorgu ile favori id'lerini `App` içinde tut; filtrelenmiş listeyi state'e kopyalama.
- Favori güncellemesinde yeni dizi üret ve film id'sini `key` yap.

**Kendini yokla:** Kart favori değişikliğinde ortak ebeveyne hangi bilgiyi bildirmeli?
*Cevap:* Durumu değiştirilecek filmin id'sini.
