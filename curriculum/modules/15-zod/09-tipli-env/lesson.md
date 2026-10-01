---
title: "Environment ayarlarını doğrula"
minutes: 14
kind: concept
---

# Environment ayarlarını doğrula

0. modülde `readConfig` yazarken ayarları elle kontrol etmiştin. Şimdi aynı ihtiyacı Zod şemasıyla karşıla: uygulama açılırken ayarları bir kez kontrol et, geçersiz zorunlu ayar varsa anlaşılır hata ver. **Environment variable**, uygulamanın kod dışında verilen ayarıdır; örneğin API adresi veya ekranda gösterilecek başlık.

Vite'da istemci kodunun okuyabildiği ayarlar `import.meta.env` üzerinden gelir. TypeScript'in bu nesne için bildiği alanlar, o alanların çalıştırma anında dolu ve doğru olduğunu kanıtlamaz. Bu yüzden uygulamanın gerçekten kullanacağı değerleri parse etmelisin.

## Bir ayarı uygulama açılırken kontrol et

Önce başlık ayarını ele alalım. Zod şeması metin bekler; `parse` başarılı olursa doğrulanmış başlık değerini verir, değilse hata fırlatır.

```ts check
import { z } from 'zod'

const titleSchema = z.string().trim().min(1)
const appTitle = titleSchema.parse('  Film Evi  ')
console.log(appTitle)
```

`trim()` baştaki ve sondaki boşlukları kaldırır; `min(1)` geriye en az bir karakter kalmasını ister. Bu örnekte sonuç `Film Evi` olur. Gerçek Vite uygulamasında aynı şemaya `import.meta.env.VITE_APP_TITLE` değerini verirsin. Böylece uygulamanın daha sonra boş başlıkla başlamasını önlersin.

## Zorunlu ayar yanlışsa erken dur

Şimdi API çağrısında kullanılacak bir token zorunlu olsun. Zod'un string kuralı eksik değeri de, boş metni de kabul etmemeli. Aşağıdaki örnekte hata mesajlarını ayar adıyla açıkça belirtiyoruz:

```ts check
import { z } from 'zod'

const tokenSchema = z
  .string({ error: 'VITE_CINEMA_TOKEN gerekli olmalı' })
  .trim()
  .min(1, { error: 'VITE_CINEMA_TOKEN boş olamaz' })

const token = tokenSchema.parse('  sinema-token  ')
console.log(token)
```

Doğru değer trimlenir ve uygulama `sinema-token` kullanır. Değer yoksa ya da yalnızca boşluksa `parse` hata verir; bu hatayı yutmazsan modül yüklenirken uygulama durur ve konsolda alanı gösteren mesajı görürsün. Bu yaklaşım **fail fast** diye anılır: bozuk ayarı ilk kullanıldığı istek anına bırakmak yerine başlangıçta yakalamak.

Uygulama modülleri yüklenirken bu doğrulamayı bir kez yapabilirsin. Sonraki adımın API isteği olması gerekmez; hatalı ayarla boş yere ekran oluşturmak veya belirsiz `401` yanıtı almak yerine ayarı düzeltirsin. Gerçek modülde `parse` sonucunu export edersen her bileşen aynı denetlenmiş değeri okur. Böylece bileşenlerin içine ayrı ayrı `import.meta.env` kontrolleri dağılmaz.

![Environment ayarının doğrulamayla tipli veriye ya da hataya ayrıldığı akış](diagram:zod-sinir)

Vite uygulamasında çağrı, config modülünün yüklenirken değerlendirilir. Aşağıdaki örnekte `appTitle` değişkenine atama, şemanın kontrolünden geçmeden tamamlanamaz:

```ts title="src/config.ts"
import { z } from 'zod'

const appSettingsSchema = z.object({
  VITE_APP_TITLE: z.string().trim().min(1),
})

export const appSettings = appSettingsSchema.parse(import.meta.env)
```

Bu dosyayı kullanan modül `appSettings.VITE_APP_TITLE` değerini hazır bulur. Env hatalıysa import sırasında Zod hatası dışarı çıkar ve uygulamanın açılışı durur. Burada Vite'ın type definitions `import.meta.env` alanını editörde tanır; gerçek değerlerin doğruluğunu ise Zod kontrol eder.

| Sıra | Ne olur? | Gözlenen sonuç |
| --- | --- | --- |
| 1 | `import.meta.env` okunur | Ham ayar değerleri alınır |
| 2 | Değerler Zod şemasına verilir | Alan kuralları çalışır |
| 3a | Zorunlu alan geçerlidir | Parse edilmiş değer config'e konur |
| 3b | Zorunlu alan eksik/boştur | `parse` hata fırlatır; modül yüklenmesi durur |
| 4 | Diğer kod config'i kullanır | Her bileşen ham env'i ayrı ayrı yorumlamaz |

## Eksik olmayan ama boş olan değer

Bir ayara `.default('Sinema')` eklemek yaygın bir çözümdür. Fakat `.default()` yalnızca değer `undefined` olduğunda devreye girer; boş metin hâlâ bir metindir. `catch()` ise doğrulama başarısız olunca yedek değer verir. Başlık eksik veya boşsa aynı görünen varsayılanı kullanmamız gereken örnekte `catch()` uygundur.

```ts check
import { z } from 'zod'

const appTitleSchema = z.string().trim().min(1).catch('Sinema')

console.log(appTitleSchema.parse(undefined))
console.log(appTitleSchema.parse('   '))
console.log(appTitleSchema.parse('  Gece Seansı  '))
```

İlk iki girdi `Sinema` sonucunu verir; üçüncü girdi trimlenip `Gece Seansı` olur. Hata politikasını ayarın önemine göre seç: başlık görünümü için varsayılan makul olabilir, token için aynı şeyi yapmak gizli bir ayar hatasını saklar. Her ayara otomatik yedek değer koyma.

## Metin olarak gelen sayıyı da düşün

Environment değerleri metin olarak okunur. Sayfa boyutunu sayı olarak kullanacaksan önce metni sayıya çevirip sonra pozitif tam sayı olmasını doğrulamalısın. Bir sayısal ayar zorunlu değilse `safeParse` ile geçerliliğine bakıp hatalı girdide yedek seçebilirsin. `safeParse`, hata fırlatmak yerine başarılı/başarısız sonucunu döndürür.

```ts check
import { z } from 'zod'

const pageSizeSchema = z.coerce.number().int().positive()
const result = pageSizeSchema.safeParse('12')
const pageSize = result.success ? result.data : 20

console.log(pageSize)
```

`'12'` önce sayıya çevrilir; tam sayı ve pozitif olduğu için `12` alınır. `'2.5'`, `'0'` veya `'abc'` geçerli sayfa boyutu değildir; o durumda uygulama `20` kullanabilir. Bu karar zorunlu token'dan farklıdır: bozuk sayfa boyutu için varsayılan seçmek işe yarar, token'ın eksik olmasını gizlemek güvenilir değildir.

## Vite öneki gizlilik sağlamaz

Vite istemci tarafında özel environment değişkenlerinden `VITE_` ile başlayanları uygulama koduna açar. Bu önek, “gizli” anlamına gelmez: Vite bu değerleri tarayıcıya gönderilen JavaScript paketine koyar. **Bundle**, tarayıcının indirdiği derlenmiş uygulama dosyalarıdır; kullanıcı geliştirici araçlarıyla içindeki değerleri görebilir.

Bu nedenle ekranda gösterilecek başlık veya herkese açık bir ayar `VITE_` ile başlayabilir. Veritabanı parolası ve ödeme sağlayıcısı gizli anahtarı gibi sırlar frontend ayarında bulunmamalı; tarayıcı bu sırları saklayamaz. Sunucu tarafındaki sırları 17.11'de ayrıca ele alacaksın.

Sık yapılan hata, `.default('Sinema')` ekleyince boşluklardan oluşan başlığın da otomatik düzeleceğini sanmaktır. Belirti başlığın hâlâ boş görünmesidir: `default` boş metinle değil, eksik değerle ilgilenir. Değeri önce `trim()` ve `min(1)` ile denetle; boş ya da hatalı başlık için gerçekten varsayılan istiyorsan `catch()` gibi açık bir kural seç.

Gerçek uygulamada config'i tek bir modülde hazırla ve diğer kodun bu doğrulanmış sonucu kullanmasını sağla. Modülün sonunda `readConfig(import.meta.env)` çağrısı yapmak, env değerlerini uygulama başlarken denetler. Görevlerde `readConfig`'e örnek bir kayıt verilmesi de aynı işlevi kolayca farklı girdilerle denemeni sağlar.

## Özet

- `import.meta.env` gerçek ortam değerlerini verir; TypeScript tipi değerlerin doğru olduğunu kanıtlamaz.
- Zod şemasını başlangıçta parse etmek bozuk zorunlu ayarda erken ve okunur hata verir.
- `.default()` eksik değeri karşılar; boş veya geçersiz değer için ayrı kural gerekir.
- İsteğe bağlı sayı geçersizse `safeParse` sonucuna göre yedek seçebilirsin.
- `VITE_` değerleri tarayıcı paketine gidebilir; içinde sır saklama.

**Yeni terimler:**
- **Environment variable:** Uygulama ayarını kod dışından sağlayan değer.
- **Fail fast:** Hata daha sonraki bir belirtiye dönüşmeden başlangıçta durmak.
- **Bundle:** Tarayıcının indirdiği derlenmiş uygulama dosyaları.
- **`default` / `catch`:** Eksik değere veya doğrulama hatasına yedek değer seçen Zod davranışları.

**Kendini yokla:** `.default('Sinema')` boşluklardan oluşan bir başlığı değiştirir mi?

*Cevap:* Hayır. Önce boşlukları kırpıp boş metni reddetmeli veya uygun bir hata yedeği seçmelisin.
