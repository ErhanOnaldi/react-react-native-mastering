---
title: "Pekiştirme: film tarayıcısı"
minutes: 7
kind: practice
---

# Pekiştirme: film tarayıcısı

:::pain[Arama temizlenince favori de kayboluyor]
Sinema ekranında bir filmi favoriye ekleyip başka film arıyorsun. Aramayı temizleyince işaret silinmiş; sıralama yaptığında seçim de başka satıra geçmiş. Arama, favori ve sıralama aynı ekranda buluştuğunda her state'in neyi tanımladığı açık olmalı.
:::

## İki akışta kimliği koru

İlk alıştırmada sorgu ile favori id'leri aynı parent state'inde yaşar. Görünür filmler sorgudan türetilir; listeyi ayrıca state'e kopyalamak gereksiz bir eşitleme noktası açar. Arama yap, bir filmi işaretle, sonra sorguyu silerek favorinin neden aynı filmde kaldığını gözle.

İkinci alıştırmada görünür sıra değişir ve bir film seçilir. Sıralama, favori gibi filmin kimliğini değiştirmez. Seçimi satır numarasıyla değil film id'siyle ifade et; sıralama için kaynak diziyi mutasyona uğratma.

:::model[State snapshot ve updater kuyruğu]
Event handler oluşturulduğu render'ın state değerini görür. Bir önceki state'e bağlı favori güncellemesinde updater, art arda tıklamaları kuyruğa güvenli biçimde ekler. Buradaki yeni bağlam, arama sırasında görünmeyen bir filme ait state'in parent'ta yaşamaya devam etmesidir.
:::

:::model[Ağaçta kimlik ve key]
React state'i liste öğesinin ağaçtaki kimliğiyle eşler. Sabit film id'si `key` olduğunda sıra değişse de aynı satır state'i aynı filme bağlı kalır. Görünür sıra ile öğe kimliğini ayrı düşün.
:::

## Nasıl çalış

Önce prompt'un davranış örneğini oku; sonra başlangıç uygulamasında state'in kime ait olduğunu bul. Etkileşim sırasını prompt'taki adımla dene: işaretle, filtrele veya sırala, geri dön. Bir davranış beklediğin gibi değilse referans olarak yalnız ekrana ve erişilebilir durumlara bak; çözümü isimlerden tahmin etme.

## Özet

- Filtrelenmiş görünümü mevcut veri ve sorgudan türet.
- Favori ve seçimi film id'siyle sakla; index sıra konumudur.
- Array güncellemelerinde yeni referans üret ve React key'ini sabit tut.

**Kendini yokla:** Aramada gizlenen film neden favori bilgisini kaybetmemeli?  
*Cevap:* Favori state'i görünür satırın değil, ortak üst bileşenin tuttuğu film kimliğinin bilgisidir.

:::sector
Ürün ekipleri birleştirilmiş akışları sıradan tek tıklamayla değil, arama, temizleme ve sıralama gibi kullanıcı adımlarının farklı sıralarıyla dener. Kimlik ve state sahipliği bu sıralarda korunuyorsa ekran daha dayanıklıdır.
:::
