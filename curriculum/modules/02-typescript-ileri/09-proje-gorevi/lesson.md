---
title: "Sinema'nın tip sözleşmesini genişlet"
minutes: 7
kind: project
---

# Sinema'nın tip sözleşmesini genişlet

:::pain[Problem]
Sinema liste cevabındaki film alanlarını biliyor ama detay, oyuncu kadrosu ve görseller başka dosyalarda elle tahmin ediliyor. Birkaç yerde farklı tip kullanılması, aynı veriye farklı güven düzeyi veriyor.
:::

## Önce cevapların şeklini karşılaştır

Projedeki liste ve detay fixture'larını okuyup hangi alanların ortak, hangilerinin yalnız belirli cevaplarda bulunduğunu ayır. Listeye özgü alanı detay tipinde varmış gibi taşımamaya dikkat et. Ortak sayfalama yapısını generic tut; değişen sonuç öğesi bu yapının parametresi olsun.

:::model[Utility type merdiveni]
`Pick` görünüm için alan seçer, `Omit` listeye özgü alanı tip görünümünden çıkarır; `Partial` ise güncelleme alanlarını opsiyonel yapar. Bu dönüşümler TypeScript tarafındadır. Yeni bağlamda bunlarla TMDB cevaplarının tiplerini tek kaynaktan türeteceksin; fixture verisi yine runtime gerçeğidir.
:::

İlk görev ayrıca poster yolunu URL'ye dönüştürür. `null` poster için geçerli bir adres uydurma; işlevin dönüş sözleşmesi bu durumda anlamlı boş sonucu vermeli. Boyut seçeneklerini açık literal union olarak sınırla.

## Durumları Sinema'da kullan

İkinci görev, uzak veri durumlarını ortak bir dosyada toplar. Dört status için ayrı dallar kur; success verisini, error mesajını doğru dala koy. Guard'lar status kontrolüyle daraltma yapar ve her guard kendi durumunda true vermelidir.

Bu modülde öğrendiğin tipler sonraki React modülünde component props'larına ve koşullu render'a temel olacak. Proje kodunda dış cevabı doğrulama ile iç uygulama durumunu modellemenin farklı işler olduğunu ayrı tut.

## Özet

- Fixture'lardan liste ve detay şekillerini karşılaştır.
- Tipleri ortak kaynaklardan türet; çalışma zamanı değerlerini utility type değiştirmez.
- Uzak veri union'ı her geçerli durumu ayrı ve eksiksiz tanımlar.

**Kendini yokla:** `MovieDetails` tipinden liste alanını `Omit` etmek fixture nesnesinden de siler mi?  
*Cevap:* Hayır; yalnızca TypeScript'in o tip üzerinden sunduğu görünümü değiştirir.
