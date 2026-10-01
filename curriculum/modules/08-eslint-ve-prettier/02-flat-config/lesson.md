---
title: "ESLint flat config dosyaları nasıl seçer?"
minutes: 15
kind: concept
---

# ESLint flat config dosyaları nasıl seçer?

Bir projede `src/movie.ts` ve `src/MovieCard.tsx` dosyaları olabilir. Bir lint kuralını yazmış olman, ESLint’in bu iki dosyayı da incelediği anlamına gelmez. Önce ESLint’e hangi dosyaları ve hangi kurallarla kontrol edeceğini anlatan ayara, yani **config** dosyasına bakalım.

ESLint 10’un güncel config modeli **flat config** olarak adlandırılır. Ayar çoğunlukla `eslint.config.js` dosyasında bir dizi katman halinde yazılır. Her katman belirli dosyaları seçebilir, kurallar ekleyebilir veya önceden tanımlanmış ayarları kullanabilir. Bu modeli öğrenirken dosya eşleşmesini takip etmek yeterli; önce uzun bir kural listesi ezberlemene gerek yok.

## Bir dosya deseni oku

Config’te `files` alanı hangi kaynak yollarının bir katmanla eşleşeceğini söyler. Örneğin şu **glob**, dosya yollarını desenle eşleştiren kısa ifadedir:

```js title="İlk dosya kümesi"
{
  files: ['src/**/*.js'],
  rules: { 'no-unused-vars': 'error' },
}
```

`src/**/*.js`, `src` klasörünün altındaki `.js` dosyalarını seçer. `**/` alt klasörleri de kapsar; `.js` ise dosya uzantısını sınırlar. Bu nedenle `src/views/Queue.js` eşleşir, `src/views/Queue.tsx` eşleşmez. Desen yalnız seçtiği dosyaları denetler; eşleşmeyen dosyalar için “lint temiz” sonucu çıkaramazsın.

Şimdi aynı kaynak klasöründe farklı uzantılı dosyaları düşün:

| Yol | `src/**/*.js` ile eşleşir mi? | Neden? |
| --- | --- | --- |
| `src/App.js` | Evet | Klasör ve uzantı eşleşiyor |
| `src/views/App.js` | Evet | `**/` alt klasörleri kapsıyor |
| `src/views/App.tsx` | Hayır | Uzantı `.tsx`, desen `.js` istiyor |
| `scripts/build.js` | Hayır | Yol `src/` ile başlamıyor |

Buradaki önemli ayrım şu: kuralın doğru olması ve dosyanın denetlenmesi iki ayrı şeydir. Önce config’in dosyayla eşleştiğini, sonra o dosya türünü anlayan parser ve kuralların uygulandığını kontrol et.

## TypeScript için hazır kural grubu

TypeScript dosyalarında ESLint’in TypeScript söz dizimini anlayan bir parser’a ve buna uygun kurallara ihtiyacı vardır. Bunları tek tek eklemek yerine bir **preset**, yani birlikte kullanılmak üzere hazırlanmış ayar grubu, ekleyebilirsin. `typescript-eslint` paketinin önerilen preset’i TypeScript dosyaları için parser ve temel kurallar sağlar.

```js title="Test dosyaları için TypeScript preset'i"
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    files: ['tests/**/*.test.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
  },
])
```

Bu örnek yalnızca `tests` içindeki `.test.ts` ve `.test.tsx` dosyalarına preset’i uygular. Dosya deseni test klasörünü ve iki uzantıyı birlikte seçti; preset TypeScript’i anlamak için gereken ayarları ekledi. Bu sayede dosyaları seçme kararı ile onları inceleme kuralları ayrı ayrı okunabilir.

Preset, bütün olası proje tercihlerini senin yerine yapmaz. ESLint’in genel `no-unused-vars` kuralı ile TypeScript’e özel kullanılmayan ad kuralını aynı anda açarsan tek sorun için yinelenen mesajlar alabilirsin. TypeScript preset’inin kendi kuralını kullanmak bu çakışmayı önler. `rules` alanına yalnızca gerçekten farklı bir tercih ekle; her kuralı elle tekrar yazmak gerekmez.

## Katmanlar bir araya gelince

Bir uygulamada JavaScript araç betikleri, TypeScript yardımcıları ve TSX bileşenleri olabilir. Flat config dizisine dosya kümelerine göre katmanlar eklersin. Bir katman genel kuralı açar, bir sonraki daha dar bir dosya kümesine ek ayar getirebilir. Aynı ayarı birden fazla eşleşen katman değiştirirse dizide daha sonra gelen değer geçerli olur.

![Flat config katmanlarının dosya kümelerine uygulanması](diagrams/flat-config-katmanlari.svg)

Üç dosyanın config içinden geçtiğini adım adım izleyelim:

| Sıra | Dosya | Dosya deseni | Eşleşen katman | Beklenen sonuç |
| --- | --- | --- | --- | --- |
| 1 | `src/views/Queue.js` | JS kaynakları | JavaScript kuralları | JS kuralları çalışır |
| 2 | `src/data/queue.ts` | TS kaynakları | TypeScript preset’i | TS söz dizimi ve kuralları çalışır |
| 3 | `src/views/Queue.tsx` | TSX kaynakları | TS preset’i, ardından React katmanı | TS ve React kuralları çalışır |

Sıra önemlidir, çünkü belirli bir dosya birden çok katmana eşleşebilir. Aşağıdaki örnekte eski arayüz klasörü ilk katmana da, ikinci katmana da girer:

```js title="Dar kapsamlı istisna"
[
  { files: ['src/ui/**/*.jsx'], rules: { 'no-alert': 'warn' } },
  { files: ['src/ui/legacy/**/*.jsx'], rules: { 'no-alert': 'off' } },
]
```

`src/ui/Card.jsx` için `no-alert` warning olur; `src/ui/legacy/Card.jsx` iki desene de uyduğu için sonraki katmandaki `off` değeri geçerli olur. Bu, dar kapsamlı bir istisnanın neden genel ayardan sonra yazıldığını gösterir. Benzer biçimde sonradan gelen Prettier uyum katmanı, ESLint’in Prettier ile çakışan görünüş kurallarını kapatabilir. Bu katman dosyayı biçimlendirmez; biçimlendirme işini yine Prettier yapar.

## Küçük bir config hatasını düzelt

Şimdi `src/views/Queue.tsx` içindeki kullanılmayan bir değişkeni aramak istiyorsun. Config’te yalnızca `src/**/*.js` varsa TSX dosyası seçilmez. Belirti, dosyada yanlış kod olmasına rağmen ESLint’in o kodla ilgili hiç mesaj vermemesidir. Bu, kuralın başarısızlığı değil, dosya kapsamının eksikliğidir.

Düzeltirken önce dosya kümesini genişletip `.ts` ve `.tsx` uzantılarını dahil etmen, sonra TypeScript preset’ini bu katmana eklemen gerekir. İki küçük kararı birbirinden ayır: glob hangi yolları seçiyor, preset seçilen dosyalarda hangi analiz desteğini sağlıyor? Dosyaların kendisini kontrol etmek, yazdığın deseni sezgisel olarak tahmin etmekten daha güvenlidir.

Config’in kapsamını `src` dışındaki dosyalara da bilerek açabilirsin. Örneğin `scripts` içindeki TS dosyalarını da denetlemek istiyorsan onları kapsayan ayrı bir glob ekle. Ama `dist` gibi derlenmiş çıktıları çoğunlukla dışarıda bırakırsın; bu dosyalar kaynak değildir ve binlerce gürültülü mesaj üretebilir. ESLint ignore desenleri config’te yazılır; `.gitignore` dosyasındaki her desenin lint için de otomatik geçerli olduğunu varsayma.

Bir config dosyasının bulunması da tek başına yeterli değildir. ESLint 10, config aramasını lint edilen dosyanın bulunduğu klasörden başlatıp yukarı doğru sürdürür. Birden çok paketli depoda her paketin kendi config’i olabilir. Komutun hangi config’i bulduğundan emin değilsen gerçek hedef dosya yolunu kontrol et.

:::info[Derinlemesine (isteğe bağlı)]
ESLint config’inde `ignores` katmanları, `eslint-config-prettier/flat` sırası ve preset’lerin kendi `files` alanları daha ayrıntılı eşleşme davranışları oluşturabilir. Kuralın neden çalışmadığını incelerken dosya başına hesaplanan config’e bakabilirsin. Tek kök config kullanmak küçük projede çoğu zaman yeterlidir; paket başına config kararı depo yapısına bağlıdır.
:::

## Sık görülen config hataları

:::mistake[Config var, ama TSX dosyası eşleşmiyor]
Belirti → Lint başarılı, fakat TSX içindeki sorunlara mesaj yok. Neden → `files` deseni yalnız `.js` veya `.ts` seçiyor. Düzeltme → Gerçek yolları ve uzantıları kontrol edip glob’u ihtiyaca göre güncelle.
:::

:::mistake[Üretilmiş dosyalar da lint ediliyor]
Belirti → `dist` içindeki sıkıştırılmış dosyalar yüzlerce mesaj veriyor. Neden → Üretilmiş klasörler config’te kapsam dışı değil. Düzeltme → `dist` gibi çıktı klasörlerini ESLint ignore ayarına ekle.
:::

:::mistake[Aynı değişken için iki mesaj]
Belirti → TypeScript değişkeni için benzer iki unused mesajı çıkıyor. Neden → JavaScript temel kuralı ve TypeScript kuralı birlikte çalışıyor. Düzeltme → TypeScript preset’inin uygun kuralını kullanıp çakışanı kapat.
:::

## Özet

- Flat config, dosya kümelerine uygulanan ayar katmanlarından oluşur.
- `files` glob’u hangi yolların denetlendiğini belirler; uzantı eşleşmesini özellikle kontrol et.
- TypeScript preset’i parser ve temel kuralları birlikte sağlar.
- Sonradan eşleşen katman, daha önceki katmanın aynı ayarını değiştirebilir.
- Lint kapsamına giren dosyaları ve üretilmiş klasörleri bilinçli seç.

**Yeni terimler:**

- **Config:** ESLint’e hangi dosya ve kuralları kullanacağını söyleyen ayar.
- **Flat config:** ESLint 10’un katmanlı dosya ayarı modeli.
- **Glob:** Dosya yollarını desenle eşleştiren kısa ifade.
- **Preset:** Birlikte çalışacak hazır ayarlar grubu.
- **Parser:** Kaynak dosya söz dizimini ESLint’in inceleyebileceği biçime çeviren parça.

**Kendini yokla:** `src/**/*.js` neden `src/views/Queue.tsx` dosyasını seçmez?
*Cevap:* Desen `.js` uzantısını ister; `.tsx` farklı bir uzantıdır.

**Kendini yokla:** TypeScript preset’i eklemek hangi sorunu çözer?
*Cevap:* Seçilen TypeScript dosyalarının söz dizimini anlayıp TypeScript’e uygun temel lint kurallarını uygulamaya yardım eder.
