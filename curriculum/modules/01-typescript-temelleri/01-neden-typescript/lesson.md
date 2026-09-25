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

## Hatanın yolunu izle
Önce JS gözlüğüyle bak: `movie.relese_date` bilinmeyen alan olduğu için `undefined` üretir. Ardından `String(movie.relese_date)` yazarsan kartta doğrudan `"undefined"` görürsün. Bazen ilk satır çökmez; hata kullanıcıya ulaşan son satırda belirir. TypeScript nesne şeklini bildiğinde yanlış alanı tam yazdığın yerde işaretler.

Null poster farklı bir sorundur. Alan adı doğrudur, ama değer iki biçimde gelebilir. `poster_path: string | null` yazınca derleyici, `.startsWith()` çağrısından önce null'ı ele almanı ister. Bu iki hata için tek bir sihirli çözüm yok: biri yazım hatası, diğeri gerçek verinin olası durumu.

:::tip[Deneme]
Bir alan adını bilerek yanlış yazdığında `pnpm typecheck` çıktısındaki dosya ve satıra bak. Hatanın kaynağını son kullanıcıdaki boş etiketle ilişkilendir.
:::

## Nerede durur?
TypeScript tipleri JavaScript çıktısında bulunmaz. Sunucu yarın `release_date: null` gönderirse yazdığın `string` tipi sunucuyu durdurmaz. Bu yüzden tip sözleşmesi ile çalışma zamanı kontrolünü iki ayrı güvenlik katmanı olarak düşün. Bu modülde doğru sözleşmeyi ve güvenli kullanımı kuracağız; API doğrulamasını ihtiyaç büyüdüğünde ekleyeceğiz.

## Sektörde
Tip kontrolü, yazım hatasını kullanıcı görmeden yakalar. API verisinin doğruluğu içinse ayrıca çalışma zamanı kontrolü gerekir.
