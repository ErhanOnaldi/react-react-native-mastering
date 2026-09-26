---
title: Her değişim effect istemez
minutes: 8
kind: concept
---

# Her değişim effect istemez

:::pain[Problem]
Sinema arama kutusunda `filteredMovies` state’i `movies` ve `query` ile ayrı ayrı tutuluyor. Bir render boyunca eski filtre görünüyor.
:::

## Türetilen değer effect istemez

Effect dış sistemle senkronizasyon içindir. Yalnız mevcut props ve state'ten hesaplanan bir değer, render sırasında doğrudan türetilebilir. Onu ayrıca state'e yazıp effect ile güncellersen aynı bilginin iki kopyası oluşur; bir render boyunca eski değer gösterme ihtimali doğar. Event sonucu ise çoğu kez doğrudan handler'da ele alınır.

Sinema'nın filtrelenmiş film listesi `movies` ve `query` ile hesaplanır. Önceki controlled input ve composition dersleri, bu verinin sahibini zaten belirledi. Şimdi hangi değişimin gerçekten dış dünyaya dokunduğunu ayırıyorsun.

## Ne değişiyor?

Var olan props/state’ten hesaplanabilen değer render sırasında türetilir. Kullanıcı tıklamasının sonucu event handler’da yapılır.

## Sinema'da dene

Bir film değişince bileşenin bütün yerel state’ini sıfırlamak istiyorsan `key={movie.id}` ile yeni kimlik ver. `useEffect` içinde koşulsuz state sıfırlamak ek render ve karışık akış yaratır.

## Kaynağı bir tane tut

```tsx
const visibleMovies = movies.filter(movie =>
  movie.title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))
)
```

`movies` ve `query` değiştiğinde bileşen zaten render olur. Filtreyi effect ile ayrı state’e yazmak, önce eski listeyi render edip sonra ikinci render’da düzeltir. Kullanıcının tıklamasıyla favori ekleme gibi işler ise doğrudan event handler’da yapılır; “favori değiştiğini gördüm, şimdi effect ile ekleyeyim” dolambaçlıdır.

Bazen türetmek değil, bütün yerel state’i sıfırlamak istersin. Film 550’nin taslak notu 27205’e taşınmamalıysa alt not bileşenine `key={id}` ver. React farklı key’i yeni kimlik olarak görür. İlk kod görevi türetmeyi, ikinci görev key ile sıfırlamayı sınar.

:::mistake[Sık hata]
Basit `filter` için hemen `useMemo` ekleme. Önce doğru veri akışını kur; ölçülmüş performans ihtiyacını performans modülünde ele alacağız.
:::

:::sector
`useMemo` burada alışkanlık olarak eklenmez; ölçülmüş pahalı hesap için performans modülünde geri döneceğiz.
:::
