---
title: "unknown veriye dar bir kapı"
minutes: 8
kind: concept
---

# unknown veriye dar bir kapı

:::pain[Problem]
TMDB'den gelen JSON'u `Movie` diye varsaydın. 401 cevabı da JSON, ama `title` yerine `status_code` taşıyor; `movie.title.toUpperCase()` çöküyor.
:::

## Önce gerçekten bak

`unknown`, ağ sınırındaki dürüst tiptir. `typeof`, `Array.isArray` ve `in` ile şekli kademeli kontrol et. Tekrar eden kontrolü `value is T` dönen type guard'a taşıyabilirsin.

```ts check
type MovieBrief = { id: number; title: string }
function isMovieBrief(value: unknown): value is MovieBrief {
  if (typeof value !== 'object' || value === null) return false
  if (!('id' in value) || !('title' in value)) return false
  return typeof value.id === 'number' && typeof value.title === 'string'
}
function titleOf(value: unknown): string {
  return isMovieBrief(value) ? value.title : 'Geçersiz film'
}
```

Assertion fonksiyonu (`asserts value is T`) geçersizde hata fırlatır, geçerliyse sonraki satırlarda tipi daraltır. Bu da gerçek kontrol içermeli; boş bir `assert` güvenlik sağlamaz.

:::warning
İki alanı kontrol etmek tam TMDB `Movie` cevabını doğrulamaz. Her iç içe alanı elle doğrulamak yorucu; 15. modülde Zod ile şemayı çalışma zamanında doğrulayacağız.
:::

:::sector
API sınırında küçük bir guard kritik tek alanlar için yararlı. Büyük sözleşmelerde şema kütüphanesi daha sürdürülebilir.
:::
