---
title: "Asenkron belirtileri izle ve düzelt"
minutes: 5
kind: practice
---

# Ekrandaki sırayı takip et

Atölyede Sinema’daki iki asenkron davranışı inceleyeceksin: arama alanı temizlendikten sonra eski sonucun geri gelmesi ve film isteği hata verdiğinde yüklenme ekranının kalması. Önce sorunu kısa bir kullanıcı akışıyla yeniden üret; sonra hangi isteğin hangi ekranda hâlâ etkili olduğunu takip et.

:::model[Yarış koşulu]
Bir yarış koşulu, birden fazla işin farklı sırada tamamlanıp sonucu etkilemesidir. Örneğin eski arama, yeni aramadan sonra cevap verirse artık geçerli olmayan sonuç ekrana yazılabilir. Ekran yeni aramayı temsil ediyorsa eski isteğin sonucu bu state’i değiştirmemeli.
:::

:::model[Asenkron durum]
İstek sürerken loading görünür; başarı veya hata geldiğinde arayüz o sonuca geçer. Her geçişte state’in güncel film ya da aramaya ait olup olmadığını kontrol et. Hata oluştuğunda loading’de kalmak, ekrana hiçbir yeni durumun taşınmadığını gösterir.
:::

İlk akışta arama metnini yazıp hemen sil. Alanın boş olması ve daha önce başlamış isteğin sonradan tamamlanması iki ayrı olasılıktır; ikisini de gözle. İkinci akışta hata cevabından sonra yeniden denemeyi ve başka film kimliğine geçmeyi izle. Böylece eski bir cevabın veya hata mesajının yeni ekranda kalıp kalmadığını görebilirsin.

Her değişiklikten sonra aynı kısa akışı tekrar et. Belirtinin kaybolması yetmez: boş aramada sonuç ve istek davranışının, hata ve yeniden denemede ise ekrandaki güncel durumun tutarlı kaldığını kontrol et. İsteklerin sırasını düşünürken sabit bekleme süresine güvenme; cevabı kontrollü biçimde geciktirip hangi sonucun önce tamamlandığını izle.

## Hatırlayacağın noktalar

- Yeni arama veya film kimliği eski isteğin sonucunu geçersiz kılabilir.
- HTTP hatasında loading sona ermeli ve kullanıcıya uygun durum görünmeli.
- Belirtiyi kısa akışla üret, değişikliği yap, aynı akışla tekrar kontrol et.
