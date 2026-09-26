---
title: Beş state tek akışta
minutes: 8
kind: concept
---

# Beş state tek akışta

:::pain[Problem]
Arama ekranında query, sonuçlar, loading, error ve page ayrı ayrı güncelleniyor; hata yolunda loading açık kalıyor.
:::

## Durum geçişlerini isimlendir

Bir ekranda ilgili birkaç state alanı birlikte değişiyorsa setter çağrıları farklı kombinasyonlar üretebilir. `useReducer`, action denen olaylara göre tek bir fonksiyonun yeni state'i hesaplamasını sağlar. Action tipi hangi geçişin hangi veriye ihtiyaç duyduğunu açıklar; reducer saf kalır ve dış etki yapmaz.

TypeScript'teki discriminated union burada action modeline dönüşür. Sinema aramasındaki yükleniyor, başarı ve hata geçişleri tek yerde görünür. Daha sonra Redux slice reducer'ları aynı temel düşünceyi uygulama düzeyindeki paylaşılan state'e taşıyacak.

## Ne değişiyor?

`useReducer`, ilgili geçişleri tek fonksiyonda toplar. `Action` için `type` alanlı discriminated union kullan; her eylemin payload’ı kendi dalında tiplenir.

## Sinema'da dene

Reducer saf olmalı: fetch, localStorage veya timer burada yapılmaz. Dış sistem effect’te, sonuçlar `dispatch` ile reducer’a gelir.

## Geçiş tablosunu görünür kıl

| Action | Query | Page | Loading | Error |
| --- | --- | --- | --- | --- |
| `query` | yeni metin | 1 | false | temiz |
| `start` | korunur | korunur | true | temiz |
| `success` | korunur | korunur | false | temiz |
| `error` | korunur | korunur | false | yeni mesaj |

Beş setter’ın farklı sırayla çağrılması geçersiz ara durum yaratabilir. Reducer tek action’dan tek yeni state üretir. `Action` union’ında `type: 'success'` dalında `results`, `type: 'error'` dalında `message` bulunur; TypeScript switch içinde doğru alanı daraltır.

```ts
case 'success':
  return { ...state, loading: false, results: action.results, error: null }
```

İlk soru saf reducer’ı, ikinci soru `useReducer` ile düğmelerin ekrana bağlanmasını uygulatır. Ağ isteği reducer içine girmez. İstek effect’te başlar; sonucu action olarak dispatch edilir.

:::mistake[Sık hata]
Reducer içinde mevcut diziyi `push` ile değiştirme. Önceki state snapshot’ı bozulur; yeni nesne/dizi döndür.
:::

:::sector
Durum geçişlerini tek yerde görmek, ileride karmaşık client state’i ayırmayı kolaylaştırır.
:::
