---
title: "Dosyaları özelliğe göre yerleştir"
minutes: 8
kind: concept
---

# Dosyaları özelliğe göre yerleştir

:::pain[Problem]
MovieCard’ı değiştirmek için components/, pages/, hooks/ ve lib/ arasında dolaşıyorsun. Favorilere özel bir yardımcıyı genel lib/ içinde bulmak da zorlaştı.
:::

## İhtiyaçtan karar

Bir özelliğin sayfası, bileşeni ve hook’u birlikte yaşayabilir: `features/movies/`, `features/search/`, `features/favorites/`. Birden çok feature’ın gerçekten kullandığı kod `shared/` olur.

## Sinema’da dene

`features/movies/api/movies-api.ts` film endpoint’lerini bilir. `shared/api/tmdb-client.ts` yalnız HTTP, token ve ortak hata davranışını bilir. Arama kutusu yalnız aramaya aitse `features/search/components` içinde kalır.

## Taşıma sırası

```text
src/
  features/
    movies/api/movies-api.ts
    movies/components/MovieCard.tsx
    search/components/SearchBox.tsx
    favorites/hooks/useFavorites.ts
  shared/
    api/tmdb-client.ts
    lib/format.ts
    ui/button.tsx
```

`MovieCard` yalnız film özelliğinin parçasıysa orada kalır. `formatVote` birden fazla özelliğin kullandığı saf biçimleyici olduğu için `shared/lib` uygundur. İkinci gerçek kullanıcı ortaya çıkarsa dosyayı o zaman taşı; en başta bütün kodu `shared` yapmak sahipliği belirsizleştirir.

Taşımayı küçük yap: bir dosyayı taşı, importları güncelle, tip kontrolünü çalıştır. Örneğin `SearchBox` taşındığında yalnız arama ekranının importları değişmeli. Favoriler de değişiyorsa bileşenin gerçekten ortak olup olmadığını yeniden düşün. Bu sorumluluk sınırı sonraki API client görevinde daha önemli hale gelecek.

:::mistake[Sık hata]
Her şeyi shared/ içine erken taşımak yeni bir dev klasör yaratır. İkinci gerçek kullanıcı çıkana kadar kodu kullanan feature yanında tut.
:::

:::sector[Sektörde]
Dosya yolundan kodun sahibi okunabilmeli. Taşıma sırasında import’ları küçük partilerde düzelt ve her adımda typecheck çalıştır.
:::
