---
title: "Sinema'nın tip sözleşmesini genişlet"
minutes: 7
kind: project
---

# Sinema'nın tip sözleşmesini genişlet

Bu projede Sinema'nın film cevaplarını, poster URL'sini ve uzak veri durumlarını ortak tiplerle ifade edeceksin. Başlamadan önce mevcut `Movie` tipini ve projedeki **fixture** dosyalarını oku: fixture, uygulamanın karşılaşabileceği örnek API cevabını içeren sabit test verisidir.

:::model[Utility type merdiveni]
`Pick` var olan tipten seçilmiş alanları, `Omit` belirtilen alanlar çıkarıldıktan sonraki şekli üretir. Generic tip ortak bir kabuğun içindeki değişken veri tipini taşır. Bunlar yalnızca derleme sırasında çalışır; fixture nesnesinin kendisini değiştirmez.
:::

:::model[Tipler çalışma zamanında silinir]
TypeScript tipleri kod derlenirken kontrol edilir, ama tarayıcıdaki veriyi dönüştürmez veya doğrulamaz. Bu yüzden poster helper'ının null girdi için ne döndüreceğini açıkça belirle; uzak veri guard'ları da runtime'da gerçek değeri incelemelidir.
:::

## Önce mevcut şekli anla

Film liste ve detay fixture'larını yan yana oku. Ortak alanları, yalnızca listede olanları ve ek cevaplarda gelenleri not et. Sonra poster helper'ının girdisini, çıkışını ve null durumunu belirle. Bu küçük notlar tiplerin veriye uyup uymadığını görmeni sağlar.

Uzak veri tipinde her `status` için hangi alanların anlamlı olduğunu ayrı düşün. Guard'lar, yani değerin belirli bir union dalında olup olmadığını çalışma anında kontrol eden yardımcılar, kontrol başarılı olduğunda TypeScript'e o dalın bilgisini de verir. Böylece çağıran kod başarı verisini kontrol etmeden okuyamaz.

:::tip[Uygulama sırası]
Önce fixture'lardan cevap şekillerini çıkar, sonra tipleri tanımla. URL helper'ını girdi, çıktı ve null davranışıyla tamamla. En son her durum için guard'ın hangi sonucu vermesi gerektiğini gözden geçir.
:::

Bu tipler cevapları açıklığa kavuşturur; ağdan gelen JSON'u kendiliğinden doğrulamaz. Runtime doğrulama gerekiyorsa, değeri gerçekten inceleyen bir kontrol ayrıca gerekir.

## Özet

- Fixture'lar beklenen API cevabının şeklini somutlaştırır.
- Utility type'lar ve generics, cevap tiplerini tekrar kullanmayı sağlar.
- TypeScript tipi çalışma anında veriyi doğrulamaz; guard bunu açıkça kontrol eder.

**Yeni terim — fixture:** Uygulamanın karşılaşabileceği örnek cevabı tutan sabit veri.

**Kendini yokla:** Bir tipi `Omit` ile değiştirmek fixture'daki alanı siler mi?  
*Cevap:* Hayır. Yalnızca TypeScript'in o tip üzerinden sunduğu alanları değiştirir.
