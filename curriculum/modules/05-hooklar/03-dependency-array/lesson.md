---
title: Değişen film ve dependency array
minutes: 8
kind: concept
---

# Değişen film ve dependency array

:::pain[Problem]
Detay kutusu önce “Dövüş Kulübü” diyor. `id` 27205 olunca başlık hâlâ eski film: effect yeni `id` ile çalışmadı.
:::

## Effect hangi değere bağlı?

Effect, belirli dış sistemi o andaki props ve state ile eşleştirir. İçinde kullanılan reactive değer değiştiğinde eski eşleşme artık doğru değildir; dependency array React'e ne zaman temizleyip yeniden kuracağını söyler. Bu liste yalnız performans ayarı değildir, effect'in doğruluğunun parçasıdır.

İlk effect dersinde sabit film kimliği için boş liste yeterliydi. Sinema detayında `id` değişince aynı component yeni filmi anlatmalı. Bu ilişkiyi yazmak, ileride Query key'ine parametre koymanın da zihinsel temelini oluşturur.

## Ne değişiyor?

Effect içinde okunan reactive değerler dependency array’de bulunur. `id` değişince eski senkronizasyon biter, yeni film çekilir.

## Sinema'da dene

Her render’da yeniden üretilen nesne veya fonksiyonu dependency yapmak effect’i gereksiz tekrar çalıştırabilir. Primitive `id` veya `query` gibi gerçekten gereken parçayı kullan.

## Yeni kimlik, yeni senkronizasyon

```tsx title="MovieDetails.tsx"
useEffect(() => {
  fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` }
  }).then(/* ... */)
}, [id])
```

Önceki dersteki `[]` ile 550 filmini gördün. Şimdi aynı bileşen korunurken `id` prop’u 27205 oluyor; React bileşeni yeniden render ediyor fakat effect çalışmıyor. Eski başlık kalıyor. `id`’yi dependency’ye eklemek, dış sistemde hangi filmle eşleştiğini açıkça belirtir.

`id=550` iken kurulan effect, `id=27205` için doğru değildir. React yeni render’dan sonra önce eski effect’in cleanup’ını, sonra yeni effect’in setup’ını çalıştırır. Henüz cleanup yazmadıysan bile dependency yeni isteği başlatır; sıradaki ders eski isteğin geç cevabını da ele alır.

`const options = { id }` her render’da yeni nesnedir. `[options]` yazarsan yalnızca `id` değişiminde değil, başka bir state güncellemesinde de effect yeniden çalışabilir. Nesneyi effect içinde kurup dependency’ye `[id]` yazmak daha nettir. Fonksiyonun her render’da yeniden tanımlanması da yeni referans doğurur; fonksiyon yalnızca effect’te kullanılıyorsa orada tanımla. Aynı ilke fonksiyon dependency’leri için de geçerlidir: gerçekten hangi değerin senkronizasyonu belirlediğini bul.

React 19’daki `useEffectEvent`, effect içinde en güncel değeri okumak isteyip o değerin effect’i yeniden başlatmasını istemediğin özel durumlar içindir. Eksik dependency’yi gizleme aracı değildir; burada film kimliği kesinlikle reactive kalmalı.

:::mistake[Sık hata]
Lint uyarısını susturmak için `id`’yi dependency’den silme. Ekrandaki eski film, bunun davranış hatası olduğunu gösterir.
:::

:::sector
Effect’e yeni bir değeri eklemenin sebebi “lint susturmak” değil, dış sistemin o değerle yeniden eşleşmesidir.
:::
