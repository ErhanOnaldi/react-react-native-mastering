---
title: Arama akışını birleştir
minutes: 9
kind: practice
---

# Arama akışını birleştir

:::pain[Problem]
Hızlı yazma, geciken sonuç ve aynı anda gelen hata Sinema aramasında birlikte yaşanıyor. Tek tek çalışan çözümler birlikte doğru çalışmalı.
:::

## Ne değişiyor?

Önce query’yi geciktir; ardından effect’te yalnızca gecikmiş değere istek at. Her yeni istekte önceki sonucu geçersiz kıl veya iptal et.

## Sinema'da dene

`useReducer` loading, success ve error geçişlerini birlikte tutar. Boş query’de idle’a dön; geç gelen cevap UI’ı değiştirmesin.

## İki effect, iki sorumluluk

1. `query` değişir; debounce timer’ı eski timer’ı temizler.
2. Gecikmiş query değişir; ağ effect’i eski fetch’i iptal eder.
3. Sonuç veya hata action olarak reducer’a gider.
4. Boş query istek atmaz; state idle’a döner.

Bu sıra tesadüf değil. Timer doğrudan kullanıcının yazdığı metne bağlıdır. Ağ isteği ise yalnızca gecikmiş metne bağlıdır. İkisini tek effect’e sıkıştırmak cleanup ve durum geçişlerini okumayı zorlaştırır.

İlk görev `useMovieSearch` hook’unun sonucunu `renderHook` ile gözlemler; ikinci görev controlled input ve listeyi kullanıcı etkileşimiyle sınar. Önceki derslerdeki `RemoteData` ayrımını hatırla: boş sorgu, boş başarı ve hata farklı görünür.

:::mistake[Sık hata]
Eski istek abort edilmiş olsa bile hata dalında `AbortError`’ı normal hata gibi dispatch etme. Bu, hızlı yazmada yanlış hata metni gösterir.
:::

:::sector
Bu alıştırma 5. modülün effect/deps/cleanup merdiveninin son basamağıdır.
:::
