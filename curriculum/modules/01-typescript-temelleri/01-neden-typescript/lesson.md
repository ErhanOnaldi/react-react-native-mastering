---
title: TypeScript neden gerekli?
minutes: 7
kind: concept
---

# TypeScript neden gerekli?

:::pain[Problem]
Sinema'da `movie.relese_date` yazdın. JS sessizce `undefined` verdi; yıl etiketi boş kaldı. Bir başka filmde `poster_path` null geldi ve `.startsWith()` sayfayı çökertti.
:::

## Önce bildiğin yöntem
JavaScript ile `movie.release_date.slice(0, 4)` yazabilirsin. Ama alan adını yanlış yazınca editör sessiz kalır. Bu sessizlikte testte yanlış sonucu görürsün.

## Tip neyi çözer?
TypeScript, nesnenin hangi alanları taşıdığını kod çalışmadan denetler. `release_date` tanımlıyken `relese_date` yazarsan `tsc` durur. Önceki modüldeki `typecheck` script'i bu denetimi yapar; Vite'ın ekranda kodu göstermesi tiplerin doğru olduğu anlamına gelmez.

```ts check
type Film = { title: string; release_date: string }
const film: Film = { title: 'Dövüş Kulübü', release_date: '1999-10-15' }
const yil = film.release_date.slice(0, 4)
void yil
```

:::warning[Tip, veri doğrulaması değildir]
API'nin gerçekten `release_date` gönderdiğini TypeScript çalışma zamanında kontrol etmez. `poster_path: string | null` yazmak olasılığı anlatır; null durumunu kodda ele almak yine senin görevin. Gerçek API cevabını doğrulamaya ileride döneceğiz.
:::

## Sektörde
Tip kontrolü, yazım hatasını kullanıcı görmeden yakalar. API verisinin doğruluğu içinse ayrıca çalışma zamanı kontrolü gerekir.
