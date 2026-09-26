---
title: "Eski kodu okuyabilmek"
minutes: 7
kind: concept
---

# Eski kodu okuyabilmek

:::pain[Problem]
Sinema'ya eski bir ekipten "fragman oynatıcı" paketi geldi. İçinde `<MovieData render={(movie) => …} />` ve `withAuth(TrailerPlayer)` var. Bir arkadaşın `withAuth(TrailerPlayer)` satırını bileşenin **içine** taşıdı; şimdi her favori tıklamasında oynatıcı başa sarıyor ve ses seviyesi sıfırlanıyor.
:::

## Render props
Render prop, bir bileşene **fonksiyon** olarak verilen prop'tur. Bileşen veriyi hesaplar, çizimi o fonksiyona bırakır. Aynı fikrin `children` fonksiyonu varyantı da vardır.

```tsx title="Legacy.tsx"
<MovieData id={550} render={(movie) => <h2>{movie.title}</h2>} />
// ya da
<MovieData id={550}>{(movie) => <h2>{movie.title}</h2>}</MovieData>
```

Hook'lardan önce "mantığı paylaş, görünümü çağırana bırak" demenin yolu buydu. Bugün aynı işi bir custom hook yapar:

```tsx check
import { useEffect, useState } from 'react'

export function useMovieTitle(id: number) {
  const [title, setTitle] = useState<string | null>(null)
  useEffect(() => {
    let ignore = false
    fetch(`https://api.themoviedb.org/3/movie/${id}`)
      .then((response) => response.json() as Promise<{ title: string }>)
      .then((movie) => {
        if (!ignore) setTitle(movie.title)
      })
    return () => {
      ignore = true
    }
  }, [id])
  return title
}
```

Render props tamamen ölmedi: bir bileşenin **her öğe için** farklı çizim alması gereken yerlerde (sanal liste satırı, tablo hücresi) hâlâ doğal bir API'dir.

## HOC (Higher-Order Component)
HOC bir bileşen alıp **yeni bir bileşen** döndüren fonksiyondur: `const SafePlayer = withAuth(TrailerPlayer)`. Eski kütüphanelerde yetki, tema, ölçüm eklemek için sık görülür. Okurken şunlara bak: sarılan bileşene hangi prop'lar geçiyor, `ref` aktarılıyor mu, ağaçta kaç katman oluşuyor?

### Tek kural: HOC'u render içinde çağırma
```tsx title="MovieDetails.tsx"
function MovieDetails() {
  const SafePlayer = withAuth(TrailerPlayer) // ❌ her render'da YENİ bileşen tipi
  return <SafePlayer videoKey="_8WFzt_tKAA" />
}
```

React bir önceki render'daki bileşen tipiyle yenisini karşılaştırır. `withAuth(...)` her çağrıda farklı bir fonksiyon döndürür; React bunu "başka bir bileşen" sayar, eskisini **unmount** edip yenisini mount eder. İçindeki state (ses seviyesi, oynatma konumu) sıfırlanır. Çözüm: HOC'u modül seviyesinde, bir kez çağır.

## Modern karşılıklar
| Eski | Bugün |
| --- | --- |
| Render prop ile veri paylaşımı | Custom hook |
| `withAuth(Page)` | Korumalı route layout'u (17. modül) |
| `withTheme(Button)` | Context + hook |

:::mistake
Render props ve HOC "hatalı" değildir. Çalışan eski kodu yalnızca sözdizimi modern görünsün diye yeniden yazma. Önce davranışı testle sabitle, sonra gerçekten bir sorun çözüyorsan taşı.
:::

:::sector
Büyük kod tabanlarında üç nesil React yan yana yaşar: class bileşenler, HOC/render props ve hook'lar. İyi bir geliştirici hepsini okuyabilir, yenisini yazarken modern olanı seçer.
:::
