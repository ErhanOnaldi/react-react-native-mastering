---
title: "Arama ve filtre URL’de"
minutes: 10
kind: concept
---

# Arama ve filtre URL’de

:::pain[Problem]
Sinema'da `q`, `page` ve `genre` üç ayrı `useState`. "Matrix" aramasında 4. sayfaya geldin; aramayı "Dövüş" yapınca hâlâ 4. sayfadasın ve sonuç yok sanıyorsun. Yenileyince tüm filtreler siliniyor.
:::

## URL tek doğru kaynak olsun

`useSearchParams()` mevcut query string'i okur ve adresi günceller. `q` metin, `page` ve `genre` da URL'de **string** gelir. Uygun varsayılanları ver: sayfa yoksa 1, geçersiz veya 1'den küçükse 1. Filtre değişince sayfayı 1'e döndür.

```tsx title="src/pages/SearchPage.tsx"
import { useSearchParams } from 'react-router'

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const rawPage = Number(params.get('page') ?? '1')
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
  function changeQuery(next: string) {
    setParams(previous => {
      const copy = new URLSearchParams(previous)
      if (next.trim()) copy.set('q', next)
      else copy.delete('q')
      copy.delete('page')
      return copy
    })
  }
  return <><input aria-label="Film ara" value={q} onChange={e => changeQuery(e.target.value)} /><p>Sayfa {page}</p></>
}
```

Güncellemeye kopya ile başla; diğer filtreler (`genre`) korunur. `setSearchParams` navigasyon yapar. `q` için ikinci bir state tutarsan input ve adresin ayrışması kolaylaşır. Modül 5'teki debounce gerçek API aramasında kullanılacak; URL'yi kontrol eden input ayrı kalabilir.

:::mistake[Sık hata]
`setParams({ q: next })` tüm diğer anahtarları siler. `page`yi sıfırlamak doğru; `genre`yi kazara silmek değil.
:::

:::sector
Paylaşılabilir filtreler, destek ve ürün analitiği için tekrar üretilebilir ekran sağlar. Back tuşu da önceki filtre durumuna döner.
:::
