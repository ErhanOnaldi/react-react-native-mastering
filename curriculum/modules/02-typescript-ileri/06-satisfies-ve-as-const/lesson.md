---
title: "Sabit veriyi kontrol et, literal tipini koru"
minutes: 14
kind: concept
---

# Sabit veriyi kontrol et, literal tipini koru

:::pain[Problem]
Uygulamanın navigasyon tablosunda `home` ve `account` rotaları var. Ekip bir kart ekleyip `account: '/acount'` yazıyor; tablo yalnızca `Record<string, string>` ile tanımlı olduğu için yanlış yolu yakalayamıyor. Üstelik geniş string tipi, her rotanın tek tek çıkarılan bilgisini de siliyor.
:::

## Sabit kaynak kodu ile dış veri arasındaki fark

Kaynak koduna yazdığın tabloyu TypeScript derleyicisi inceleyebilir. Beklenen anahtarların hepsi var mı, değerler doğru türde mi diye kontrol etmesini isteyebilirsin. `satisfies`, ifadenin beklenen sözleşmeye uyduğunu denetlerken ifadenin kendi çıkarılan tipini korur. `as const` ise literal değerleri geniş string veya sayı tipine dönüşmekten korur ve alanları readonly yapar.

Önceki `keyof` ve `typeof` modelinde sabit bir değerden tip çıkardın. Burada o değeri oluştururken hem yapıyı denetliyor hem de daha sonra kullanacağın literal bilgiyi tutuyorsun. `satisfies` ve `as const` kaynak koddaki sabitlerle ilgilidir; network JSON'u doğrulamaz, nesneyi `Object.freeze` gibi dondurmaz.

![Kaynak tablonun sözleşmeye uyumunun denetlenmesi ve literal tip çıkarımının korunması](diagrams/satisfies-kontrolu.svg)

## İki operatör, iki ayrı iş

Şöyle bir nesne olduğunu düşün: her rota için anahtar `RouteName`, her değer de string olmalı. Açık tip açıklaması (`const routes: Record<RouteName, string> = ...`) sözleşmeyi denetler ama değerlerin tipi çoğunlukla `string` olarak görülür. Sadece `as const` ise literal'leri tutar ama tabloya eksik anahtar eklemeyi engellemez. İkisini `as const satisfies ...` ile birleştirebilirsin.

Kurallar:

1. `satisfies Shape`, ifadenin `Shape` ile uyumunu derleme zamanında denetler.
2. `satisfies` değişkeni zorla `Shape` tipine dönüştürmez; çıkarılan alan ve literal tipleri korunur.
3. `as const`, literal değerleri daraltır ve nesne/dizi alanlarını readonly yapar.
4. `as const` runtime freeze değildir; derlenmiş JavaScript'te nesne hâlâ değiştirilebilir olabilir.
5. `satisfies` ve `as const` çalışma zamanı verisine kontrol eklemez.
6. `Record<ClosedUnion, Value>` gibi kapalı sözleşmeler beklenen tüm anahtarları kontrol eder.

```ts check
type RouteName = 'home' | 'profile'
const NAVIGATION_PATHS = {
  home: '/',
  profile: '/members/:id',
} as const satisfies Record<RouteName, string>

type ProfileRoute = typeof NAVIGATION_PATHS.profile
const route: ProfileRoute = '/members/:id'
const home: string = NAVIGATION_PATHS.home
```

`ROUTES` tablosunun anahtarları `home` ve `profile`; `profile` değerinin tipi `'/members/:id'` literal'idir. Yalnızca `Record` annotation'ı kullansaydın o alan `string` olurdu. Eksik `profile` anahtarı veya yanlış anahtar adı sözleşme kontrolüne takılır.

## Derleyicinin gördüğünü adım adım izle

| Aşama | Kontrol veya çıkarım | Sonuç |
| --- | --- | --- |
| `RouteName` tanımlanır | İzinli anahtar kümesi `'home' \| 'profile'` | İki anahtar zorunlu |
| Nesne literal'i kurulur | Gerçek değerler görülür | `home` ve `profile` alanları çıkarılır |
| `as const` uygulanır | Literal ve readonly bilgisi korunur | `ROUTES.profile` tipi `'/members/:id'` |
| `satisfies Record<...>` kontrol eder | Beklenen iki anahtar ve string değerler var mı | Uyum varsa derleme devam eder |
| Kod çalışır | Normal JavaScript nesnesi vardır | Runtime değeri string olarak okunur |

Bu sırada compiler tabloyu kontrol eder ama ona runtime davranış eklemez. `ROUTES.profile = '/x'` TypeScript'te readonly nedeniyle reddedilir; JavaScript çıktısındaki nesne ise gerçek anlamda dondurulmuş değildir. Runtime'da değişmezlik gerekiyorsa `Object.freeze` gibi JavaScript API'si gerekir.

## Önce kırık, sonra doğru

Geniş kayıt tipi yazım hatalarını kaçırır ve literal'leri kaybettirir:

```ts
type RouteName = 'home' | 'profile'
const routes: Record<string, string> = {
  home: '/',
  profle: '/members/:id',
}
const profile: string = routes.profile
```

Bu kod `profle` hatasını kabul eder; `routes.profile` runtime'da `undefined` olur. Anahtar kümesini kapalı tut ve çıkarılan değeri koru:

```ts check
type RouteName = 'home' | 'profile'
const routes = {
  home: '/',
  profile: '/members/:id',
} as const satisfies Record<RouteName, string>

const profilePath: '/members/:id' = routes.profile
```

Şimdi zorunlu alan eksik veya fazla yazılmışsa derleme hatası alırsın. `as const` ile yola bağlı literal de kullanıma hazır kalır.

## Sabit tabloya uyan fonksiyonlar

`typeof routes` tablo tipidir; `keyof typeof routes` anahtar union'ını verir. Bu sayede fonksiyon yalnız tanımlı rota isimlerini kabul edebilir:

```ts check
const PATHS = { home: '/', help: '/help' } as const satisfies Record<'home' | 'help', string>
type PageName = keyof typeof PATHS

function pathFor(page: PageName): (typeof PATHS)[PageName] {
  return PATHS[page]
}

const helpPath = pathFor('help')
```

Dönüş tipi iki literal yoldan biri olur. Eğer değeri network'ten alıyorsan `PageName` annotation'ı yeterli değildir; gerçek stringi tablonun anahtarlarıyla runtime'da karşılaştırman gerekir. Kaynak kodundaki sözleşme ile dışarıdan gelen veri arasındaki sınır değişmez.

`satisfies` yazarken beklenen tipi bir kalite kontrolü gibi düşün: ifadeyi dönüştürmez, sadece uygun olmadığında derlemeyi durdurur. Bu yüzden daha sonra `keyof typeof PATHS` ile gerçek anahtarları çıkarabilirsin. Bir değişkene baştan `Record<PageName, string>` tipi verince compiler o değişkeni genel sözleşme üzerinden görür; tablodaki her özgül yol metninin bilgisi kaybolabilir. Literal tipini korumak, o değerin başka bir fonksiyona aktarılırken daha dar doğrulanmasını sağlar.

Bu özellikleri her nesneye eklemek gerekmez. Tablonun eksiksizliği ve literal değerinin sonraki kodda anlamı varsa kullan. Değeri sonradan kullanıcıdan alıp değiştireceğin normal bir nesnede literal'i korumak gereksiz kısıtlama yaratabilir. TypeScript'in amacı her değişkeni mümkün olan en dar tipe kilitlemek değil, iş kuralının gerçekten istediği kesinliği taşımaktır.

`as const` nesne içindeki diziler için de tuple çıkarımı yapar. Örneğin `['home', 'settings']` normal bir değişkende `string[]` olurken, `as const` ile iki literal elemanı sabit uzunluklu readonly tuple olarak korunur. `(typeof tabs)[number]` bu tuple'ın eleman union'ını verir. Bu teknik, navigasyon menüsünü ve izinli sayfa adlarını aynı listeden üretmeye yarar.

Bir tabloda anahtar kümesini `satisfies` ile kontrol edip sonra `keyof typeof table` kullanabilirsin. Fakat `satisfies` yalnızca yazdığın literal ifadesi için denetim yapar; tablo sonradan başka kaynaktan genişletiliyorsa aynı çıkarım ilişkisi kurulmaz. Ayrıca `'home' | 'help'` gibi anahtar sözleşmesini ve değerlerin örneğin `string` olmasını ayrı ayrı düşün. Bir değerin `string` olması onun geçerli bir route olduğuna dair runtime kanıt sağlamaz; kaynak koddaki typo kontrolü ile URL güvenliği farklı sorulardır.

## Sınırlar ve sık hatalar

:::mistake[Belirti: `satisfies` yazdığın halde JSON'da alan eksik]
Belirti → Sunucu `{ home: '/' }` gönderdi ve `profile` yok.  
Neden → `satisfies` yalnızca derlenen kaynak ifadelerini kontrol eder.  
Düzeltme → Dış değeri `unknown` kabul edip runtime guard veya şema ile doğrula.
:::

:::mistake[Belirti: `as const` ile nesne değişmez sanılır]
Belirti → JavaScript consumer `ROUTES.home = '/other'` ataması yapabiliyor.  
Neden → `as const` TypeScript'in tip görünümünü readonly yapar; JavaScript nesnesini dondurmaz.  
Düzeltme → Runtime değişmezliği gerçekten gerekiyorsa `Object.freeze` uygula; bunu ayrıca test et.
:::

:::mistake[Belirti: Tabloya yeni anahtar eklenince başka kodlar string görür]
Belirti → `routes.help` yalnız `string` kabul ediliyor, literal sözleşme kayıp.  
Neden → Değişken doğrudan geniş bir `Record` tipine annotation ile atanmış.  
Düzeltme → Uyum kontrolünü `satisfies` ile yap ve gerekiyorsa literal'leri `as const` ile koru.
:::

:::mistake[Belirti: `Record<string, string>` her tabloyu kabul ediyor]
Belirti → Beklenen birkaç sabit anahtar yerine herhangi bir yazım geçiyor.  
Neden → `string` anahtar kümesi kapalı bir union değildir.  
Düzeltme → `Record<'home' | 'profile', string>` gibi gerçek izin listesini kullan.
:::

:::sector
Kaynakta tutulan route, izin, ikon ve varyant tablolarında `as const satisfies` kullanmak yazım hatalarını erken yakalar ve değerleri otomatik tamamlama için korur. Kaynak kodu tablosuyla API'nin gönderdiği konfigürasyonu karıştırma; ikincisi runtime doğrulama ister.
:::

## Özet

- `satisfies` şekil kontrolü yapar ve değişkenin çıkarılan tipini korur.
- `as const` literal değerleri ve readonly alanları korur.
- Kapalı `Record` anahtar kümesi eksik veya hatalı anahtarı yakalar.
- `as const` runtime freeze değildir.
- Bu ikisi JSON veya URL girdisini doğrulamaz.

**Kendini yokla:** `as const satisfies` ile `const value: Shape = ...` arasındaki temel fark nedir?  
*Cevap:* İlki uygunluğu kontrol ederken literal çıkarımı korur; annotation değişkeni genellikle `Shape` olarak genişletir.

**Kendini yokla:** Kaynaktaki tabloyu `satisfies` ile kontrol etmek API'den gelen tabloyu doğrular mı?  
*Cevap:* Hayır. API verisi runtime'da ayrıca denetlenmelidir.
