---
title: "Kendi kararınla state ve bileşen"
minutes: 5
kind: practice
---

# Kendi kararınla state ve bileşen

:::pain[İşaret sıra değişince yanlış karta gidiyor]
Popüler filmleri sıraladığında favori başka satırda görünmeye başlıyor. Filtre paneli içinse tek bir prop ya da yerleştirilebilir küçük parçalarla iki geçerli API kurabilirsin. Bu atölyede veri kimliği ile görünüm kararını birbirinden ayırıp seçimini gerekçelendireceksin.
:::

## Önce gözlenebilir davranışı sabitle

İlk görevde sıralama değişse de favori aynı filme bağlı kalmalı. Veri id'si öğeyi tanımlar; sıralama yalnız görünüm sırasını değiştirir. Kaynak listeyi değiştirmeden Türkçe başlık sırası üret ve favoriyi id üzerinden takip et.

İkinci görevde filtre paneli için iki API'den birini seç. Sabit ve az sayıda görünüm için tek yapılandırma prop'u daha kısa olabilir. Bir ekran farklı kontroller yerleştirecekse composition parçaları daha fazla esneklik verir. İki yaklaşım da geçerlidir; kod yorumunda seçimin bakım maliyetini ve diğer seçeneğin ödünleşimini açıkla.

:::model[Ağaçta kimlik ve key]
React listede child'ları kararlı key ile eşler; film id'si sıralama ve ters çevirme boyunca değişmez. Yeni bağlamda görünür sıra ve favori state'i aynı bilgi değildir: sıra bir görünüm, favori id'si kullanıcı seçimidir.
:::

## Çalışma sırası

Her görevde önce dosya ve export sözleşmesini, sonra gereksinimleri oku. Önizlemede yalnız bir mutlu adımı değil, ters sıralamayı geri almayı veya input'u temizlemeyi de dene. Kod tasarım kararı istiyorsa gerekçeyi yorumda yaz; dosya içindeki somut davranışla eşleştir.

## Özet

- State'i öğe kimliğine bağla, sıra numarasına değil.
- Sıralama için kaynak diziyi mutasyona uğratma.
- Component API'si seçerken kullanım esnekliği ile yüzey alanı maliyetini tart.

**Kendini yokla:** Filtre panelinin API'si için tek doğru tasarım var mı?  
*Cevap:* Hayır; iki seçenek de gereksinimi karşılayabilir. Kullanım ve genişleme maliyetini açıklamak gerekir.

:::sector
Kod incelemelerinde “çalışıyor mu?” yanında “bu sınırı neden böyle seçtin?” sorusu da önemlidir. Kısa bir gerekçe, sonraki geliştiricinin component API'sini yeni ekrana taşırken kararın bağlamını korumasına yardım eder.
:::
