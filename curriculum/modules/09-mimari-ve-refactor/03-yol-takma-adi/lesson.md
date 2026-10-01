---
title: "Import yollarını sabitle"
minutes: 15
kind: concept
---

# Import yollarını sabitle

Bir Sinema component'i `src/features/search/components/SearchField.tsx` içinde duruyor. Ortak tarih biçimleyici `src/shared/lib/formatDate.ts` dosyasından geliyorsa göreli import şöyle olabilir:

```ts
import { formatDate } from '../../../shared/lib/formatDate'
```

`./` bulunduğun klasörü, `../` bir üst klasörü anlatır. Bu yol component'in bugünkü konumuna göre hesaplanır. Dosyayı taşıyınca kaç kez yukarı çıkacağını yeniden sayman gerekir. Bu sık değişen yolun sürüklenmesine **path drift** denir; alias bu hesabı sabit bir kaynak kökünden yapar.

## Önce yolu taşıdıktan sonra kontrol et

SearchField'i bir alt klasöre taşıyalım:

```text
features/search/components/SearchField.tsx
                 ↓
features/search/components/fields/SearchField.tsx
```

Eski `../../../shared/...` yolu artık önceki yere çıkmaz. Import bulunamadı hatası alırsın veya yanlış konumdaki eş adlı dosya çözülür. Sorun kodun `formatDate` işini nasıl yaptığı değil, import'un dosyanın bulunduğu yere bağlı yazılmış olmasıdır. Dosya taşıyınca göreli yolu yeniden hesaplamak gerekir.

## Bir köke kısa ad ver

**Path alias**, kaynak ağacındaki bir köke verdiğin kısa addır. Örneğin `@/` her zaman `src/` anlamına gelsin. O zaman aynı import şöyle yazılır:

```ts
import { formatDate } from '@/shared/lib/formatDate'
```

Component başka klasöre taşınsa bile import aynı kalır. Fakat alias dosyayı fiziksel olarak taşımaz ve hangi feature'ın sahibi olduğunu belirlemez. `@/shared/...` yazmak, dosyanın gerçekten ortak olduğunu kanıtlamaz; bunu önceki dersteki gibi kullanım ve sorumluluk belirler.

## İki ayrı araç da aynı kısaltmayı tanımalı

Editörde kırmızı alt çizginin kaybolması uygulamanın da import'u bulacağı anlamına gelmez. TypeScript `paths` ayarı editör ve tip kontrolünde dosyayı bulmaya yardım eder. Vite ise geliştirme ve production build sırasında kendi modül resolver'ıyla dosyayı arar. İkisine de aynı `@/ → src/` eşlemesini vermelisin.

TypeScript 6'da, kökteki `tsconfig.app.json` için hedefi açıkça config dosyasına göre yaz:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`*` işareti, `@/` sonrasındaki alt yolu hedefteki aynı yere koyar. Örneğin `@/features/search/SearchPage` → `./src/features/search/SearchPage`. Bu ayar TypeScript'in dosyayı bulmasını sağlar; Vite henüz eşlemeyi bilmiyor.

Vite'a da `@` kökünü göster:

```ts title="vite.config.ts"
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('./src', import.meta.url))

export default {
  resolve: {
    alias: { '@': sourceRoot },
  },
}
```

`import.meta.url` konfigürasyon dosyasının yerini verir, `new URL('./src', ...)` de yanındaki kaynak klasörünü bulur. Böylece alias, komutu terminalde hangi klasörden çalıştırdığına bağlı kalmaz. TypeScript ile Vite aynı dosyaları farklı zamanlarda aradığı için birinin ayarı diğerine kendiliğinden aktarılmaz.

![TypeScript ve Vite'ın ayrı alias eşlemelerini aynı kaynak köküne bağladığını gösteren diyagram](diagrams/iki-cozucu.svg)

## Import'un hangi aşamada çözüldüğünü izle

`@/features/movies/MovieCard` import'unun yolunu farklı araçlar farklı zamanlarda kontrol eder:

| Aşama | Ne arar? | İlgili ayar | Eksikse belirti |
| --- | --- | --- | --- |
| Editör / TypeScript | Kaynak dosyasını ve tiplerini | `tsconfig` içindeki `paths` | Editörde import hatası |
| Vite dev server veya build | Uygulamanın modül dosyasını | `vite.config.ts` içindeki `resolve.alias` | `failed to resolve import` |
| Dosya sistemi | Gerçek dosya adı | Dosyanın harfleri ve konumu | Bazı makinelerde bulunan yol CI'da bulunmayabilir |

Demek ki editörün yolu bulması tek başına yeterli değil. TypeScript kontrolü geçebilir, ama Vite kendi eşlemesini kurmadıysa uygulama derlenemez. Ya da Vite çalışırken TypeScript ayarı eksik olduğu için editör import'u tanımaz. İki ayar aynı `src/` köküne işaret edince iki araç da aynı dosyayı bulur.

Hata çıktığında önce hangi araçta gördüğünü ayır. Editör dosyayı kırmızı çiziyorsa `paths` eşlemesini ve gerçek dosya yolunu kontrol et. Editör kabul ediyor ama Vite hata veriyorsa `resolve.alias`'a bak. İkisi de dosyayı bulduğu halde import çalışırken sorun çıkıyorsa bu artık yol eşlemesinden farklı bir çalışma zamanı problemidir. Bu ayrım gereksiz yere doğru ayarı tekrar tekrar değiştirmeni önler.

Wildcard'ı küçük bir desen gibi oku: `@/*` içindeki yıldızın eşleştiği bölüm hedefteki `*` yerine gelir. `@/features/movies/MovieCard` için `features/movies/MovieCard` kısmı korunup `./src/` önüne eklenir. Hedefi yalnız `./src` yazarsan yıldızın karşılığı kaybolur; alt dosya yolları beklediğin gibi eşleşmez. `paths` hedefi config dosyasına göre yazıldığı için `tsconfig.app.json` konumunu da hesaba kat.

:::mistake[Belirti: editör yeşil ama Vite import'u bulamıyor]
**Belirti →** TypeScript dosya yolunu kabul ediyor, dev server `failed to resolve import` diyor. **Neden →** `paths` ayarı yapılmış ama Vite alias'ı eksik. **Düzeltme →** `vite.config.ts` içinde aynı `src/` kökünü `resolve.alias` ile göster.
:::

:::mistake[Belirti: macOS'ta çalışıyor, CI Linux'ta bulunamıyor]
**Belirti →** Import `MovieCard` derken dosyanın gerçek adı `Moviecard.tsx`. **Neden →** Dosya sistemleri harf büyüklüğü farkını aynı biçimde ele almayabilir. **Düzeltme →** Import'taki harfleri dosya adıyla birebir eşleştir.
:::

:::info[Derinlemesine (isteğe bağlı)]
TypeScript'in `paths` ayarı dosya bulma kuralını tanımlar; derlenen JavaScript'teki (`emitted JavaScript`, yani TypeScript'ten üretilen JavaScript dosyalarındaki) import metnini otomatik olarak göreli yola dönüştürmez. Bu nedenle çalışan uygulamanın resolver'ı da alias'ı bilmelidir. Monorepo'da, yani birden fazla uygulama veya paketin tek depoda bulunduğu projede, paketlerin kendi sınırları olabilir; uygulamanın `@/` alias'ı bu paket sınırlarını gizlemek için kullanılmamalıdır. Bu ayrıntılar alias'ı temel kullanmak için gerekli değildir.
:::

TypeScript 6 için `paths` hedefinde `./src/*` gibi açık bir yol kullan. Eski örneklerde görülen `baseUrl`'a dayanma: burada önemli olan `paths` hedefinin config'e göre doğru kökü göstermesidir. Yerel component yanındaki `./styles.css` gibi yakın import'ları alias'a çevirmen de şart değil; alias özellikle derin veya taşınması olası kaynak yollarında işe yarar.

## Özet

- Göreli import dosyanın konumuna göre çözülür; dosya taşınınca yol değişebilir.
- Alias (`@/`) bir kaynak köküne sabit kısa ad verir; dosya sahipliğini veya import'un varlığını değiştirmez.
- TypeScript `paths` ve Vite `resolve.alias` ayrı ayrı yapılandırılır ve aynı köke yönelmelidir.
- TypeScript 6'da `paths` hedefini config'e göre açıkça yaz: `"./src/*"`.

**Yeni terimler:** `path drift` — dosya taşındıkça göreli import yolunun yanlış yere kayması; `path alias` — kaynak klasörüne verilen sabit kısa ad; `resolver` — import adını gerçek dosya yoluna çeviren araç.

**Kendini yokla:** Editör `@/` import'unu çözüyor, ama Vite build edemiyor. Hangi ayara bakarsın?  
*Cevap:* `vite.config.ts` içindeki `resolve.alias`; TypeScript `paths` Vite ayarını yapmaz.

**Kendini yokla:** `@/` kullanmak dosyanın `shared/` içinde olması gerektiğini gösterir mi?  
*Cevap:* Hayır. Alias yalnızca yolu kısaltır; dosyanın sahibi kullanımına ve sorumluluğuna göre belirlenir.
