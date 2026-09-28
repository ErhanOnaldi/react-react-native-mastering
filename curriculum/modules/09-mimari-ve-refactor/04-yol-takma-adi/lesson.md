---
title: "Import yollarını sabitle"
minutes: 15
kind: concept
---

# Import yollarını sabitle

:::pain[Problem]
Bir kartı üç klasör derine taşıdın. `../../../shared/lib/date` artık yanlış dizine gidiyor; aynı yardımcıyı kullanan beş dosyanın göreli yolunu tek tek düzeltmen gerekiyor. Editör bir import'u buluyor ama Vite tarayıcıda bulamıyor.
:::

## Alias yol kısaltmasıdır, mimari değildir

Göreli import, bulunduğu dosyanın konumuna göre çözülür: `./` aynı klasör, `../` bir üst klasör. Dosyalar yer değiştirince import'un anlamı da değişebilir. Path alias sabit bir köke takma ad verir; `@/shared/lib/date` her kaynak dosyadan aynı `src/shared/lib/date` dosyasını gösterir.

Alias yalnızca yol yazımını değiştirir. `features` ile `shared` arasındaki sahipliği değiştirmez, dosyanın varlığını garanti etmez ve çalışma zamanı kodunu kendi başına yüklemez. TypeScript editörde/tip denetiminde yolları çözer; Vite geliştirme ve build sırasında modülü bulur. İki çözücü aynı kökü bilmelidir.

![TypeScript ve Vite'ın ayrı alias eşlemelerini aynı kaynak köküne bağladığını gösteren diyagram](diagrams/iki-cozucu.svg)

Kesin kurallar:

1. **Tek bir kök belirle.** Bu projede `@/` `src/` klasörünü gösterir; `@/features/movies/...` bu nedenle `src/features/movies/...` yoluna karşılık gelir.
2. **TypeScript eşlemesini `compilerOptions.paths` içinde kur.** TypeScript 6'da `baseUrl` ekleyerek eski çözüm kurallarına dayanma; eşlemenin hedefi config dosyasına göre yazılır: `"@/*": ["./src/*"]`.
3. **Vite'a aynı eşlemeyi ayrıca öğret.** `resolve.alias` içindeki `@` mutlak `src` dizinine işaret etmelidir. TypeScript ve bundler ayrı programlardır; birinin ayarı diğerine aktarılmaz.
4. **Alias sadece app source için kullanılır.** Paket adlarını (`react`, `@tanstack/react-query`) veya `node_modules` yollarını `@` ile yeniden adlandırma.
5. **Alias bağımlılık yönü kuralını iptal etmez.** `@/shared` kullanımı tek başına doğru mimari anlamına gelmez; dosyanın sahibi ve import yönü hâlâ incelenir.

## Editör ile tarayıcıyı ayrı ayrı izle

Bir `@/features/search/components/SearchField` import'u yüklenirken iki araç devrededir:

| Ortam | Ne zaman çalışır? | Hangi ayar? | Eksikse belirti |
| --- | --- | --- | --- |
| TypeScript server | editör, typecheck | `tsconfig.app.json` → `paths` | kırmızı import, TS2307 |
| Vite resolver | dev server, build | `vite.config.ts` → `resolve.alias` | browser console'da module resolve hatası |
| İşletim sistemi | dosya erişimi | gerçek dosya adı ve harf büyüklüğü | macOS'ta gizlenen hata Linux build'de çıkar |

Örneğin `@/shared/lib/format` yazdın. TypeScript config'in alias'ı `src/` köküne eşler ve `src/shared/lib/format.ts` dosyasını bulur. Vite bunu ayrıca bilmiyorsa, tarayıcı build grafiğini kurarken aynı isimdeki import'u çözemeyebilir. Vite ayarı doğru ama `paths` yoksa uygulama dev modunda açılabilir, ancak editör ve `tsc` modülü tanımaz. Her iki ayar aynı köke işaret etmelidir.

Vite konfigürasyonunda proje kökünü config dosyasının URL'sinden mutlak yola çevirmek, terminalin hangi klasörden çalıştırıldığına bağlılığı azaltır:

```ts title="vite.config.ts"
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('./src', import.meta.url))

export const alias = { '@': sourceRoot }
```

Bu, Vite ayar nesnesindeki `resolve.alias` alanına verilecek eşlemenin özüdür. `new URL('./src', import.meta.url)` konfigürasyon dosyasının yanındaki kaynak klasörünü bulur. `process.cwd()` ise komutun hangi klasörden başlatıldığına bağlanabilir. Import path'teki `@/` slash'ı alt yolları eşleştirir; alias'ın kendisi kökü gösterir.

TypeScript `paths` deseni `@/*` içindeki `*` bölümünü hedef desendeki `*` ile değiştirir. Böylece `@/features/search/api` değeri `./src/features/search/api` yoluna çevrilir. Yıldızsız bir `"@"` eşlemesi ise `@/features/...` biçiminin wildcard kısmını karşılamaz. Birden çok eşleşme yazarken en özel alias'ın daha genel bir alias ile çakışmamasını kontrol et; `@/` ve `@shared/` gibi örtüşen kökler okuyan kişiyi yanıltabilir.

Bu ayar TypeScript'e Vite'ın modül grafiğini otomatik olarak yazdırmaz. Vite config'i importları kendi resolver'ından geçirir; build sırasında da aynı ad çözümü gerekir. Benzer şekilde Vite'ın eşlemesi editor language service'e geri bildirim vermez. İki ayarın ayrı olmasının sebebi, aynı dosya adını iki farklı programın yorumlamasıdır. Bir config değişince diğerini unutmak, yerelde sadece bir tarafta görünen hata üretir.

paths TypeScript'in dosyayı nasıl bulacağını tarif eder; emitted JavaScript içindeki import metnini otomatik olarak relative path'e çevirmez. Bu yüzden tsc başarılı olması browser'ın modülü bulacağını garanti etmez. Vite dev server ve production build aynı alias'ı kullanmalı. Bir test runner ayrı resolver konfigürasyonuna sahipse o da kendi eşlemesini ister; bu ayarlar app bundle alias'ıyla aynı kavram olsa bile ayrı programlara aittir.

Wildcard hedefinin sonundaki yıldız önemlidir: eşleşen alt yolun aynı parçası hedefe taşınır. Yanlışlıkla hedefi ./src yazarsan çoklu alt dosya eşleşmeleri beklediğin gibi çözümlenmez. Repo içindeki config dosyasının nerede durduğuna bakıp hedefi ona göre yaz. TS config extends ediyorsa paths değerlerinin hangi config dosyasına göre çözüldüğünü de akılda tut; alias davranışını sadece editor'de tıklayarak değil, uygulama build'inde de gör.

Her kaynak modülünü alias yapmak gerekmez. Aynı klasörde yan yana duran component ve css dosyasına ./styles.css demek kısa ve yerel ilişkiyi açıklar. Alias daha çok dosya derinliği değiştikçe uzayan, birden çok feature tarafından paylaşılan veya proje kökünden bulunması beklenen kaynak yollarında işe yarar. Tüm importları alias'a dönüştürmek mutlak olarak daha okunur bir kod üretmez.

## Önce kırık yol, sonra ortak kök

Klasör derinliği değiştikçe göreli yolun kaç üst dizine çıkacağı değişir:

```ts
// src/features/search/components/SearchField.tsx
import { formatDate } from '../../../shared/lib/formatDate'
```

Dosyayı `src/features/search/components/fields/` altına taşıyınca üç `../` artık `src/`'ye çıkmaz. Hata compile-time'da yakalanabilir; ama PR'da taşınan her dosyada zinciri yeniden hesaplamak emek ister.

Alias kullanan import'un anlamı bulunduğu yere göre değişmez:

```ts check
type DateLabelInput = { value: string }

export function dateLabel(input: DateLabelInput): string {
  return input.value || 'Tarih yok'
}
```

Bu örnek uygulama kodundaki saf fonksiyonu gösteriyor; `@/shared/lib/dateLabel` biçimindeki import yalnızca dosyaya ulaşma yoludur. TypeScript paths hedefi dosyayı bulur; bundler da kendi eşlemesiyle aynı dosyayı resolve eder. Gerçek import uzantısını eklemek ya da eklememek proje module-resolution ayarına uymalıdır.

Bir dosyayı taşıdıktan sonra import'u alias'a çevirmek, path drift'i azaltır. Fakat dosya feature'a aitse yine `@/features/search/...` altında kalır; sırf başka yerden `@/shared/...` ile import etmek kolay diye ortak klasöre çekilmez. Dosya sahipliği dersi bu kararı belirler.

## Sınır durumları ve sık hatalar

:::mistake[Belirti: editör yeşil ama tarayıcı import hatası veriyor]
**Belirti →** TypeScript modülü buluyor, Vite “failed to resolve import” diyor. **Neden →** Yalnız `paths` tanımlanmış; bundler config'i alias'tan habersiz. **Düzeltme →** Vite `resolve.alias` içinde aynı `src/` kökünü tanımla.
:::

:::mistake[Belirti: dev açılıyor ama CI Linux build'i kalıyor]
**Belirti →** `MovieCard.tsx` macOS'ta bulunuyor ama CI dosyayı bulamıyor. **Neden →** Import'taki büyük/küçük harf gerçek dosya adından farklı; bazı dosya sistemleri bu farkı saklar. **Düzeltme →** Harf büyüklüğünü klasör ve dosya adıyla birebir aynı yap.
:::

:::mistake[Belirti: TS 6'da paths beklenmedik yere gidiyor]
**Belirti →** `@/x` yanlış tabana göre aranıyor. **Neden →** Eski `baseUrl` varsayımına göre yıldız hedefi yazılmış. **Düzeltme →** `paths` hedefine `./src/*` gibi config konumuna göre açık yolu yaz ve TypeScript 6 davranışını kullan.
:::

:::mistake[Belirti: alias mimariyi kendi kendine düzeltmedi]
**Belirti →** Kod artık kısa import kullanıyor ama `shared` hâlâ bir feature'a bağımlı. **Neden →** Yol yazımı sahiplik kuralıyla karıştırıldı. **Düzeltme →** Alias'ı mekanik okunurluk için tut; bağımlılık yönünü ayrıca düzelt.
:::

:::mistake[Belirti: alias hedefi proje kökü değişince bozuluyor]
**Belirti →** Repo kökünden çalışınca import bulunuyor ama paket alt dizininden başlatınca bulunmuyor. **Neden →** Vite alias'ı göreli yolu komutun çalışma klasörüne göre çözmüş. **Düzeltme →** Alias hedefini config modülünün konumuna göre mutlak `src/` yoluna bağla.
:::

:::sector
Ekipler alias'ı derin kaynak ağaçlarında taşıma maliyetini azaltmak için kullanır. Kod incelemesinde config değişikliği olduğunda TypeScript ve Vite eşlemelerini birlikte kontrol etmek, yalnız yerel editör deneyimine güvenmekten daha güvenlidir. Monorepo package boundary'lerini alias ile gizleme; dış paketler kendi açık import adlarıyla görünmelidir.
:::

## Özet

- Göreli yol dosya konumuna bağlıdır; alias sabit köke bağlıdır.
- TypeScript `paths` ve Vite `resolve.alias` ayrı ayrı yapılandırılır.
- TypeScript 6 için `baseUrl` yerine açık `./src/*` hedefi kullanılır.
- Alias import'u kısaltır ama dosya sahibi veya bağımlılık yönü belirlemez.
- Dosya adındaki harf büyüklüğünü gerçek yolla aynı tut.

**Kendini yokla:** `@/` editörde çözülüyor, fakat tarayıcı çözemiyor. İlk bakacağın ayar hangisi?  
*Cevap:* Vite `resolve.alias`; `tsconfig.paths` TypeScript çözücüsünü etkiler.

**Kendini yokla:** Alias ile import edebilmek bir modülün `shared/` içinde olması gerektiğini kanıtlar mı?  
*Cevap:* Hayır. Alias yalnız yolu kısaltır; sahiplik gerçek kullanım ve bağımlılıkla belirlenir.
