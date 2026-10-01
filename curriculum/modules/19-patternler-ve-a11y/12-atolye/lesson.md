---
title: "Erişilebilir component sınırları"
minutes: 5
kind: practice
---

# Erişilebilir component sınırları

Bu atölyede seçim kontrolünü iki sayfada kullanacak, sonra onu çağırana hangi API ile sunacağına karar vereceksin. Ortak davranış paylaşılır; her sayfanın seçtiği değer kendi sayfasında kalır.

:::model[Context yayılımı]
Compound component parçaları Context ile ortak değer paylaşabilir. Buradaki seçim paneli `label`, `options`, `value` ve `onChange` props'larıyla da yeniden kullanılabilir; bu biçimde state'i çağıran sayfa yönetir.
:::

## Aynı panel, ayrı seçimler

**Radio group**, tek bir seçeneğin seçili olduğu kontroldür. Seçenekler `radio` rolü, erişilebilir ad ve `aria-checked` durumuyla anlatılır. **Roving tabindex**, Tab ile gruba girildiğinde yalnız seçili seçeneğin durak olmasıdır; ok tuşları, Home ve End grup içinde focus ile seçimi taşır.

Ana Sayfa'da Komedi'yi, Detay sayfasında Puan'ı seçtiğini düşün. Her sayfanın değeri üst component'inde kalırsa sayfa değiştirip dönünce seçimler korunur. Değeri paylaşılan panelin içine koyarsan sayfalar aynı state'i paylaşabilir ya da panel yeniden kurulunca seçim sıfırlanabilir.

Gerçek bir hata: bütün seçeneklere `tabIndex={0}` vermek, Tab'ın her seçenekte durmasına yol açar. Seçili öğeye `0`, diğerlerine `-1` ver; seçenekler arasında ok tuşlarıyla dolaş.

## API seçimini gerekçelendir

Sabit, aynı biçimli seçeneklerde yapılandırma listesine bir öğe eklemek kolaydır. Seçenekler özel içerik veya yerleşim gerektiriyorsa compound parçalar daha esnek olabilir; çağıran taraf JSX'te dizer. Kararını “daha temiz” diye değil, yeni seçenek eklerken kaç yerde değişiklik gerektiğiyle açıkla.

`aria-describedby`, kontrolü açıklama metnine bağlar. Seçim yapılmadan Kaydet'e basılırsa `alert` rolündeki hata ekran okuyucuya duyurulur ve gruba açıklama olarak bağlanır; seçim yapılınca hata kalkar.

:::tip[Çalışma sırası]
Önce sayfaların seçimlerinin ayrı kaldığını, sonra klavye dolaşımını dene. Son olarak boş seçimdeki hatayı ve geçerli seçimden sonra hatanın kalktığını kontrol et.
:::

## Özet

- Görünüş ve klavye davranışı paylaşılır; sayfaya özel seçim değeri sayfada tutulur.
- Roving tabindex Tab duraklarını azaltır, oklar grup içinde dolaşır.
- API tercihini seçenek ekleme maliyeti ve içerik esnekliğiyle açıkla.
- Hata metnini kontrole bağla; seçim geçerli olunca kaldır.

**Yeni terimler**

- **Radio group:** Tek seçeneği seçilebilen ilişkili kontroller grubu.
- **Roving tabindex:** Grupta yalnız bir öğeyi Tab sırasına alma yöntemi.
- **`aria-describedby`:** Kontrolü açıklamasına id üzerinden bağlayan nitelik.
- **`alert` rolü:** Yeni veya değişen önemli mesajı ekran okuyucuya duyurur.
- **Compound API:** Çağıranın birlikte çalışan küçük component'leri JSX'te birleştirdiği API biçimi.

**Kendini yokla:** İki sayfadaki seçim nerede tutulmalı?

*Cevap:* Her sayfanın kendi state'inde; panel değeri prop alıp değişikliği callback ile bildirir.
