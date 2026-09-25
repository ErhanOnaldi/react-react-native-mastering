---
title: "Film kimliği URL’de"
minutes: 9
kind: concept
---

# Film kimliği URL’de

:::pain[Problem]
Karttan detaya gidiyorsun ama `selectedMovie` state'i yenilemede boşalıyor. `/movie/550` adresini doğrudan açan arkadaşın Dövüş Kulübü'nü göremiyor.
:::

## Dinamik rota

Rota `movie/:id` ise `/movie/550` için `useParams()` içindeki `id` değeri **`'550'` string'idir**. İsteğe sayısal id göndereceksen önce doğrula. TypeScript'in `string | undefined` uyarısı gerçek bir ihtimali gösterir: bileşen yanlış rota altında da render edilebilir.

```tsx title="src/pages/MovieDetailsPage.tsx"
import { useParams } from 'react-router'

export function MovieDetailsPage() {
  const { id } = useParams<'id'>()
  if (!id || !/^\d+$/.test(id)) return <p>Geçersiz film adresi</p>
  const movieId = Number(id)
  return <h1>Film {movieId}</h1>
}
```

`Number('abc')` → `NaN`; `Number('')` → `0`. Bu nedenle önce sözdizimini denetlemek açıklayıcı bir hata sayfası verir. Gerçek TMDB 550 için "Dövüş Kulübü" döndürür; bu modülde Sinema statik örnek veriyi kullanmaya devam eder.

## Tekrar merdiveni

İlk alıştırmada yalnızca id'yi daralt; ikincisinde statik film listesinden bul ve bulunamayan film için ayrı mesaj göster. Sonraki modülde aynı id bir TMDB isteğinin yoluna girecek; `useEffect` bağımlılığında id değişimini izleyeceksin.

:::mistake[Sık hata]
`useParams()` sonucuna körlemesine `as number` yazma. Type assertion çalışma zamanında string'i dönüştürmez.
:::

:::sector
URL'den gelen her değer kullanıcı girdisidir. Tip ve aralık kontrolü, anlamsız id'yi API'ye göndermeden önce yakalar.
:::
