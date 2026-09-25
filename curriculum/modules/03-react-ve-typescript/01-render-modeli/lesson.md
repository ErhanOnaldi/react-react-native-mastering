---
title: Render modeli
minutes: 8
kind: concept
---

# Render modeli

:::pain[Problem]
Sinema kartının başlığını değiştirince bileşen tekrar çalışıyor. İçine `console.log` koyunca geliştirmede beklediğinden fazla satır görüyorsun. “React her seferinde bütün DOM’u mu yeniden kuruyor?” sorusu doğuyor.
:::

## Render bir hesaplamadır
React bileşeni, props ve o andaki state ile JSX hesaplayan bir fonksiyondur. Bir render sonucunun DOM’a uygulanması ayrı bir adımdır: **commit**. Yeniden çağrılan fonksiyon, bütün DOM’un baştan yazıldığı anlamına gelmez.

```tsx check
function MovieTitle({ title }: { title: string }) {
  return <h2>{title}</h2>
}
export default MovieTitle
```

Aynı props için aynı JSX’i hesaplamak güvenlidir. Render sırasında dışarıdaki bir diziyi değiştirmek ya da istek başlatmak ise fonksiyonu saf olmaktan çıkarır. Böyle bir işlem, React render’ı tekrar denediğinde birden fazla kez gerçekleşebilir.

## StrictMode neden iki kez çağırır?
Geliştirme ortamındaki `StrictMode`, saf olmayan render ve updater hatalarını görünür kılmak için bazı fonksiyonları fazladan çağırır. Production’da bu geliştirme kontrolü yoktur. Bu yüzden `console.log` satırlarını kullanıcıya görünen render sayısıyla eşitleme. Ayrıca StrictMode her olay işleyicisini iki kez çalıştırıyor diye düşünme: tıklama bir kullanıcı olayıdır.

:::mistake
Render içinde `props.movie.title = ...` yazmak, başka bileşenin elindeki aynı nesneyi de değiştirir. Bileşen props’u okumalı; değişiklik isteğini callback ile üst bileşene bildirmelidir.
:::

:::sector
Saf render, React’in işi durdurup tekrar denemesini güvenli kılar. Ağ isteklerini daha sonra dış sistemlerle senkronizasyon dersinde ele alacağız.
:::
