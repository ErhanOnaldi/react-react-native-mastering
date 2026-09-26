---
title: "React Hooks kuralları"
minutes: 10
kind: concept
---

# React Hooks kuralları

:::pain[Problem]
Adres `/movie/550` iken Dövüş Kulübü açılıyor. `/movie/155`’e geçince URL doğru ama sayfa aynı filmi gösteriyor: effect, `id` değişimini dinlemiyor.
:::

## Hook sırası ve bağımlılık doğruluğu

React Hook'ları her render'da aynı sırayla çağrılmalıdır; koşulun içine konan Hook bu sırayı bozabilir. Effect'in okuduğu reactive değerler de dependency listesinde doğru temsil edilmelidir. ESLint'in React Hooks kuralları bu iki ayrı hatayı kaynakta arar. Uyarı yalnız stil konusu değil, yanlış state veya eski veri gösterebilen davranış problemidir.

Sinema detayında `id` değişince eski filmin kalması önceki effect dersinin somut hatasıydı. Config dersinde kurduğun lint akışı şimdi bu ilişkiyi otomatik izler. Kuralı susturmak yerine senkronize edilen dış sistemin gerçekten hangi değere bağlı olduğunu bul.

## Önce elle izle

```tsx title="MovieDetailsPage.tsx"
const { id } = useParams()
useEffect(() => {
  // id ile yeni film isteği
  loadMovie(id)
}, []) // id değiştiğinde tekrar çalışmaz
```

`id`, render’dan gelen bir değerdir. Boş dependency array “bu effect ilk bağlanmadan sonra tekrar gerekmez” demektir. `react-hooks/exhaustive-deps` bu çelişkiyi işaretler. Düzeltirken `id`’yi array’e ekle; istek sürüyorsa eski isteği cleanup ile iptal et. Böylece yeni film önce, eski film sonra dönse bile eski yanıt ekranı ezmez.

```tsx title="MovieDetailsPage.tsx"
useEffect(() => {
  const controller = new AbortController()
  loadMovie(id, controller.signal)
  return () => controller.abort()
}, [id])
```

Bu parça mevcut `loadMovie` yardımcısının `signal` kabul ettiği bir bağlam içindir. Asıl projede `useFetch` kullanıyorsan URL’yi `id`’den türetip hook’a ver; aynı fikrin başka bağlamıdır.

## Çağrı sırası

`rules-of-hooks` başka bir hatayı yakalar: Hook’u koşulun veya döngünün içinde çağırmak. React her render’da aynı Hook sırasını bekler. “Film yoksa `useEffect` çağırma” düşüncesi iyi niyetli ama yanlış yerdedir; Hook’u üstte çağır, koşulu effect’in içine koy.

## React Compiler kuralları

`eslint-plugin-react-hooks` 7’nin `configs.flat.recommended` ve `recommended-latest` preset’leri temel iki kuralla birlikte Compiler’a yönelik kuralları da içerir. Örneğin `immutability`, props veya state’i doğrudan değiştiren kodu; `set-state-in-render` render sırasında state güncellemesini gösterir. Compiler kuralları yalnızca “Compiler açıldığında” önemli değildir: güvenli React kodunu erken öğretir. Biz yaygın `recommended` preset’i kullanacağız; `recommended-latest` daha yeni kuralları denemek isteyenlere uygundur.

:::mistake[Sık hata]
`// eslint-disable-next-line react-hooks/exhaustive-deps` eklemek eksik `id`’yi tamamlamaz. Lint sustuğu halde stale film kalır. Bağımlılığı ekleyince döngü oluşuyorsa effect içindeki işin gerçekten effect gerektirip gerektirmediğini incele.
:::

:::sector
`eslint-plugin-react-refresh` Vite Fast Refresh için yalnızca bileşen export etmeye ilişkin uyarılar verir. Bu, Hook kurallarının yerini tutmaz; Sinema config’inde ikisini de kullanacağız.
:::
