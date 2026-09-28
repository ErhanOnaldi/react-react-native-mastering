---
title: "ESLint 10 flat config katmanları"
minutes: 15
kind: concept
---

# ESLint 10 flat config katmanları

:::pain[Problem]
Bir dosyada ESLint kullanılmayan değişkeni buldu; başka bir `.tsx` dosyasında aynı yanlışlık sessiz kaldı. Kural doğru görünüyor, ancak config’in dosya eşleşmesi sadece `.js` uzantısını seçmiş. Sonuçta “lint temiz” raporu, denetlenmeyen dosyalar hakkında hiçbir şey söylemiyor.
:::

## Config bir dosya eşleştirme listesi

ESLint 10 proje ayarını flat config dosyasından okur. Tipik ad `eslint.config.js` ya da projenin modül biçimine uygun uzantıdır. Eski `.eslintrc` biçimi bu sürümün config modeli değildir. Flat config’i bir kurallar listesi gibi değil, dosya kümelerine sırayla uygulanabilen katmanlar olarak düşün: her nesne hangi dosyalarla eşleştiğini, hangi plugin veya parser’ı açtığını, hangi kuralları değiştirdiğini ve hangi yolları kapsam dışı tuttuğunu söyleyebilir.

`defineConfig` yapılandırmayı yazarken düzenli bir dizi tanımlamaya yardım eder. TypeScript-ESLint’in `configs.recommended` preset’i TypeScript kaynakları için parser ve temel kuralları birlikte getirir. React Hooks preset’i ise hook’lara özgü analizleri ekler. Bir preset’i config dizisine eklemek, hangi dosyalarda etkili olacağını hâlâ doğru belirlemeyi gerektirir.

![Flat config katmanlarının dosya kümelerine uygulanması](diagrams/flat-config-katmanlari.svg)

## Hangi katman hangi dosyaya uygulanır?

Katmanların kapsamını şu sırayla oku:

1. **Ignore katmanı üretilmiş dosyaları dışlar.** `dist/**`, `coverage/**` gibi derleme çıktıları kaynak kod değildir. Bunları gitignore sanıp otomatik dışlanacaklarını varsayma; ESLint ignore kapsamını config’te açıkça tanımla.
2. **JavaScript katmanı `.js` ve `.mjs` dosyalarına eşleşir.** Burada `@eslint/js` önerilen kuralları kullanılabilir. Dosya uzantısı başka kümeye girmiyorsa bu kurallar ona uygulanmaz.
3. **TypeScript katmanı `.ts` ve `.tsx` dosyalarını seçer.** `typescript-eslint` önerilen preset’i tip sözdizimini anlayan parser’ı ve TypeScript’e uygun kuralları getirir. Genel `no-unused-vars` ile TypeScript karşılığını aynı anda açıp iki ayrı mesaj üretme; preset’in kuralını tercih et.
4. **React katmanı TSX bileşenlerine eklenti kurallarını uygular.** Hook sırası ve bağımlılığı gibi kurallar `eslint-plugin-react-hooks` içinden gelir. Refresh eklentisinin bileşen export sınırı gibi kuralları ayrı bir katmandır.
5. **Son katman biçim çakışmalarını kapatır.** `eslint-config-prettier/flat` diğerlerinden sonra yer alır; Prettier’ın sahiplendiği görünüş kurallarının ESLint’le çakışmasını engeller. Bu katman format çalıştırmaz.

Bir dosyaya birden fazla katman eşleşebilir. Bu nedenle dizinin sırası ve preset’lerin hangi dosya glob’unda etkin olduğu önemlidir. `files` belirtmeyen bir katman, ESLint’in config kurallarına göre daha geniş dosya kümesine uygulanabilir; ilk kurulumda kapsamları açık yazmak hangi kuralın nereden geldiğini anlamayı kolaylaştırır.

Katman birleştirmesinde aynı ayarı iki nesne değiştirirse sonraki eşleşen config’in değeri belirleyici olur. Bu davranış, önce ortak kuralları tanımlayıp sonra dar bir klasöre özel istisna koymayı sağlar. Fakat istisnayı beklenmedik yere koyarsan genel kuralı fark etmeden ezebilirsin. Bir dosyanın etkin config’ini incelemek, “bu rule nereden geldi?” sorusuna yanıt verir.

ESLint 10 config aramasını lint edilen dosyanın klasöründen başlatıp yukarı doğru sürdürür. Monorepo’da bu sayede her paket kendi config dosyasına sahip olabilir. Tek kök config kullanıyorsan, paketlerin içinde başka `eslint.config.*` dosyası olmadığını da hesaba kat. Bir komut kökte başarılı diye alt paketin dosyasının beklediğin config’i bulduğunu varsayma; gerçek hedef dosyanın yolu üzerinden kontrol et.

Ignore kararı da config’in bir parçasıdır. Eski `.eslintignore` dosyasına yazılan klasörlerin ESLint 10’da aynı biçimde dışlanacağını düşünme; flat config için ignore desenini config’te ifade et. `dist` gibi klasörleri dışlamak hem gereksiz analiz maliyetini önler hem de minified ya da üretilmiş kodun kaynak kurallarından mesaj yağdırmasını engeller. Buna karşılık tüm `src`’yi dışlayan geniş bir desen “temiz” komut üretir ama gerçek kaynakları da denetimden çıkarır.

Preset’i `extends` içine koymak okunaklı bir bileşim sağlar. Ancak `files` kapsamı üst config ile preset içinde birlikte bulunduğunda eşleşmelerin nasıl kesiştiğini bilmek gerekir. Bir kuralın çalışmadığı durumda yalnız üst nesneye bakma; preset’in kendi dosya kapsamı ve tanımladığı parser ayarlarını da incele. Bu özellikle React Hooks config’i TSX dosyalarını açıkça hedefleyen projelerde önemlidir.

## Bir dosyanın yolunu izleyelim

Projede `src/views/Queue.tsx`, `src/data/queue.ts`, `scripts/make-report.mjs` ve `dist/assets/app.js` olduğunu düşün. Config’i gözünde çalıştır:

| Dosya | Ignore eşleşmesi | Uzantı katmanı | Ek katman | Beklenen denetim |
| --- | --- | --- | --- | --- |
| `src/views/Queue.tsx` | Hayır | TS/TSX | React Hooks, Refresh, Prettier uyumu | TS ve React kuralları |
| `src/data/queue.ts` | Hayır | TS/TSX | Genel React katmanı eşleşmeyebilir | TypeScript kuralları |
| `scripts/make-report.mjs` | Hayır | JS modül | JS önerilen kurallar | JavaScript kuralları |
| `dist/assets/app.js` | Evet | Dosya kapsam dışı | Hiçbiri | Lint edilmez |

Bir TSX dosyasını lint ederken yalnız “errorCount sıfır mı?” diye bakmak eksik olabilir. Dosyanın doğru parser’la okunduğunu, mesajların hangi `ruleId`’den geldiğini ve gerektiğinde `calculateConfigForFile` benzeri inceleme yoluyla etkin config’i kontrol et. Bir TSX dosyasındaki JSX söz dizimi parser’a ulaşmıyorsa hata raporu ya da yanlış parse davranışı görürsün.

## Kapsamı görünür config’e dönüştür

Aşağıdaki küçük config tek bir küme üzerinde temel bir karar gösterir. Eğitim örneğinde hook eklentisi yok; burada önemli olan `files` eşleşmesinin açıkça yazılmasıdır:

```js title="eslint.config.js"
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
  },
])
```

Bu config `src` dışındaki TypeScript dosyalarını bilinçli olarak kapsamıyor. Eğer `scripts` içindeki TS de kontrol edilecekse glob’u genişletmelisin. Scope’u gereğinden fazla büyütmek generated code’u taratabilir; dar tutmak ise kaynak dosya kaçırabilir. Başlangıçta dosya ağacına göre karar ver ve yeni kaynak klasörü eklendiğinde kapsamı tekrar değerlendir.

Kurallar için önem seviyesi `off`, `warn` veya `error` olabilir; sayısal biçimleri de vardır. Kuralı warning’den error’a almak CI’da başarısızlığı değiştirebilir, bu yüzden büyük projede bir anda yüzlerce yeni error açmak yerine kademeli temizleme planı gerekebilir. Küçük projede ise recommended kuralları ve az sayıda açık kural ile başlamak anlaşılırdır.

TypeScript kurallarının amacı derleyiciyi kopyalamak değildir. Örneğin kullanılmayan değişken kontrolü, kodu okuyan kişiye artık katkısı olmayan tanımı gösterir. Daha ileri tip tabanlı analizler ayrı parser hizmeti isteyebilir ve performans maliyeti yaratabilir. İhtiyacın olmayan bütün kuralları açmak, her hata mesajının değerini düşürür.

## Önce kırık, sonra doğru

Kırık config’in yalnız JS’i seçtiğini varsay:

```js title="Kırık kapsam"
export default [{ files: ['src/**/*.js'], rules: { 'no-unused-vars': 'error' } }]
```

Bu kural `src/views/Queue.tsx` dosyasını hiç görmez. Hata, kuralın yanlış yazılması değil, dosya kümesinin eksik olmasıdır. Kapsama TypeScript uzantılarını ve TS parser/preset’ini ekleyen bir katman koy:

```js check
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig({
  files: ['src/**/*.{ts,tsx}'],
  extends: [tseslint.configs.recommended],
})
```

Gerçek projede JS ve TS kapsamları birden fazla nesne olarak ayrılabilir. Bir preset’in kendi `files` alanı ve iç config’leri varsa ESLint’in güncel flat config davranışına göre bunları kontrol et; yalnızca dış nesnenin glob’una güvenip içeridekileri körlemesine birleştirme.

## Sık hatalar

:::mistake[Config dosyası var, ama TSX dışarıda]
Belirti → `eslint .` başarılı; TSX dosyasındaki kullanılmayan tanım için mesaj yok. Neden → `files` glob’u `.tsx` ile eşleşmiyor ya da doğru parser/preset uygulanmıyor. Düzeltme → Kaynak uzantılarını açıkça kapsa ve dosya başına etkin config’i incele.
:::

:::mistake[Generated dosyalar yüzlerce mesaj üretiyor]
Belirti → Lint çıktısında `dist` ya da derlenmiş bundle yolları var. Neden → Üretilmiş klasörler flat config’te kapsam dışında bırakılmadı. Düzeltme → Ignore kararını flat config içinde tanımla ve glob’ların gerçek klasör ağacına uyduğunu kontrol et.
:::

:::mistake[JS ve TS unused kuralları iki mesaj veriyor]
Belirti → Tek değişken için iki farklı unused mesajı. Neden → Genel JavaScript kuralı ile TypeScript’e özel kural aynı anda çalışıyor. Düzeltme → TS için TypeScript preset’inin kuralını kullan; çakışan temel kuralı kapat.
:::

:::sector
Takımlar config dosyasını uygulama kaynak kodu gibi code review’dan geçirir. Bir kural eklendiğinde hangi klasörleri kapsadığı, error mı warning mi olduğu ve eski dosyaların nasıl temizleneceği açıkça görülür. Paket sürümü yükseltildiğinde preset’lerin yeni kural ekleyip eklemediğini de gözden geçirmek gerekir.
:::

## Özet

- ESLint 10 flat config’i sıralı, dosya kapsamı belirlenmiş katmanlar olarak düşün.
- `files` glob’ları denetlenmesi gereken kaynak uzantılarını kapsamalı.
- JS, TS, React ve format uyumu farklı katmanlarda kurulabilir.
- `eslint-config-prettier/flat` sona eklenir; formatter çalıştırmaz.
- Config’in temiz olması için kapsamı dosya bazında doğrula.

**Kendini yokla:** `src/**/*.js` seçen config neden `src/App.tsx` dosyasındaki Hook sorununu bulmayabilir?
*Cevap:* Glob dosyayla eşleşmiyor; TSX için parser ve React Hooks katmanı da gerekebilir.

**Kendini yokla:** Prettier uyum katmanı neden dizinin sonunda yer alır?
*Cevap:* Önceki katmanların biçim kurallarıyla çakışan ESLint kurallarını son aşamada kapatması için.
