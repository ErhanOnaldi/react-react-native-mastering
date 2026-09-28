---
title: "İstemcide sırlar, açık yönlendirme ve bağımlılıklar"
minutes: 13
kind: concept
---

# İstemcide sırlar, açık yönlendirme ve bağımlılıklar

:::pain[Tarayıcıya sızan anahtar ve sahte yönlendirme]
Prodüksiyona çıkan paketi inceleyen bir güvenlik araştırmacısı, JavaScript dosyalarının içinde ödeme servisi gizli anahtarını bulduğunu bildiriyor. Aynı gün bir kullanıcı, platformun giriş bağlantısına tıklayıp başarıyla oturum açtıktan sonra kendini parolasını çalmaya çalışan sahte bir kopya sitede buluyor. İstemciye giden kodun sınırları bilinmediğinde hem gizli veriler açığa çıkar hem de yönlendirme akışları kötüye kullanılır.
:::

## Ön yüzde sır saklanamaz kuralı

Modern React uygulamaları derlendiğinde (örneğin Vite ile `vite build` çalıştırıldığında), yazdığın TypeScript ve JSX kodları tarayıcının çalıştırabileceği statik JavaScript ve CSS dosyalarına dönüştürülür. Bu dosyalar, uygulamanı ziyaret eden her kullanıcının tarayıcısına indirilir.

1. **`VITE_` öneki koda gömülür:** Vite yalnızca `VITE_` ile başlayan ortam değişkenlerini istemci tarafına aktarır (`import.meta.env.VITE_*`). Ancak bu aktarım çalışma zamanında sunucudan güvenli bir okuma değildir; derleme anında koddaki değişken referansının yerine metnin doğrudan yazılmasıdır.
2. **Bundle herkese açıktır:** Tarayıcı geliştirici araçlarını (DevTools Network veya Sources sekmesi) açan ya da JavaScript dosyasını metin düzenleyicide aratan herhangi biri, paketin içine gömülmüş tüm değerleri anında görebilir.
3. **Genel anahtar ile gizli anahtar farkı:** TMDB API okuma anahtarı ya da Firebase proje kimliği gibi değerler istemciden doğrudan istek atmak üzere tasarlanmış genel belirteçlerdir. Buna karşılık veritabanı parolaları, ödeme ağ geçidi özel anahtarları (`secret_key`), imzalama sertifikaları asla ön yüz paketinde yer alamaz.
4. **Hassas işlemlerin yeri backend'dir:** Gizli anahtar gerektiren veya üçüncü taraf servislerle imtiyazlı iletişim kuran tüm operasyonlar sunucu tarafında (örneğin ASP.NET Core API veya sunucu fonksiyonları) yürütülür; ön yüz bu işlemleri kendi kimliği doğrulanmış API uç noktaları üzerinden tetikler.

## Açık yönlendirme (Open Redirect) mekanizması

Kullanıcı oturum gerektiren bir sayfaya gitmek istediğinde, oturumu yoksa giriş sayfasına aktarılır. Kullanıcı deneyimini kesintisiz kılmak için giriş sayfasına genellikle bir dönüş hedefi (`from` veya `?redirect=/istenen-yol`) eklenir.

Giriş başarılı olduktan sonra uygulama bu adrese yönlendirme yapar. Eğer gelen adres filtrelenmeden doğrudan yönlendirme kütüphanesine veya tarayıcıya iletilirse, açık yönlendirme zafiyeti doğar.

Saldırgan şu bağlantıyı hazırlar ve kullanıcıya e-posta veya mesajla iletir:

```text
https://sinema.example/login?redirect=https://saldirgan.example/sahte-profil
```

Kullanıcı adresi kontrol ettiğinde alan adının güvenilir `sinema.example` olduğunu görür. Parolasını girip oturum açar açmaz uygulama onu `saldirgan.example` sitesine yönlendirir. Kullanıcı hâlâ aynı sitede olduğunu sanarak ek bilgilerini paylaşabilir.

### URL yorumlama kuralları ve tuzaklar

Tarayıcıların URL yorumlama mantığı güvenlik sınırlarını belirlerken dikkat gerektirir:

1. **Mutlak ve göreli yollar:** Uygulama içi rotalar tek bir eğik çizgiyle başlamalıdır (`/watchlists`). Başında eğik çizgi olmayan göreli yollar (`watchlists`) bulunulan rotaya göre beklenmeyen alt yollara gidebilir.
2. **Protokolü devralan (protocol-relative) adresler:** İki eğik çizgiyle başlayan yollar (`//saldirgan.example`), tarayıcı tarafından mevcut protokolü (HTTPS) devralan mutlak bir harici adres olarak yorumlanır. Bu nedenle yalnızca `startsWith('/')` kontrolü yapmak yetersizdir; `//` başlangıcı mutlaka engellenmelidir.
3. **Ters eğik çizgi normalizasyonu:** Bazı tarayıcılar ve ayrıştırıcılar ters eğik çizgiyi (`\`) otomatik olarak düz eğik çizgiye (`/`) çevirir. Örneğin `/\saldirgan.example` ifadesi tarayıcıda `//saldirgan.example` haline gelebilir.
4. **Görünmeyen kontrol karakterleri:** Dizgi içindeki sekme (`\t`), yeni satır (`\n`) veya boş bayt karakterleri URL çözümleme motorlarını yanıltarak filtreleri atlatmak için kullanılabilir.

| Gelen Değer | Neden Tehlikeli? | Güvenli Karar |
| --- | --- | --- |
| `"/movies?sort=top"` | Uygulama içi geçerli yol ve sorgu parametresi | Kabul et (`"/movies?sort=top"`) |
| `"https://evil.example"` | Harici şema ve alan adı | Reddet → Varsayılan yol |
| `"//evil.example/login"` | Protokol devralan harici mutlak adres | Reddet → Varsayılan yol |
| `"/\\evil.example"` | Ters eğik çizgi normalizasyonu ile harici adrese dönüşebilir | Reddet → Varsayılan yol |
| `"watchlists"` | Başında `/` olmayan göreli yol | Reddet → Varsayılan yol |
| `null` / `undefined` | Tip dışı veya tanımsız girdi | Reddet → Varsayılan yol |

## Önce kırık, sonra doğru: Dönüş adresini denetlemek

Önce zafiyete neden olan dikkatsiz yönlendirme kodunu inceleyelim:

```tsx title="src/features/navigation/UnsafeRedirect.tsx"
import { useNavigate, useSearchParams } from 'react-router'

export function UnsafeRedirectHandler() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  function handleLoginSuccess() {
    const target = params.get('returnUrl') ?? '/dashboard'
    // TEHLİKE: target değeri "//evil.example" ise tarayıcı harici siteye çıkar!
    void navigate(target, { replace: true })
  }

  return <button onClick={handleLoginSuccess}>Girişi Tamamla</button>
}
```

Bu kodda `returnUrl` sorgu parametresi doğrulanmadan `navigate` fonksiyonuna verilir. Harici bir etki alanı girildiğinde kullanıcı siteden dışarı yönlendirilir.

Şimdi bu denetimi saf bir doğrulama fonksiyonuyla güvenli hale getirelim:

```ts check title="src/features/navigation/validateReturnPath.ts"
export function validateReturnPath(target: unknown, fallbackPath = '/dashboard'): string {
  if (typeof target !== 'string') {
    return fallbackPath
  }

  // Mutlak uygulama içi yol olmalı, ancak çift slash ile başlamamalı
  if (!target.startsWith('/') || target.startsWith('//')) {
    return fallbackPath
  }

  // Ters eğik çizgi ve kontrol karakterleri bulunmamalı
  if (target.includes('\\') || /[\u0000-\u001f\u007f]/.test(target)) {
    return fallbackPath
  }

  return target
}
```

Doğrulayıcıyı kullanan güvenli yönlendirme bileşeni:

```tsx title="src/features/navigation/SafeRedirectHandler.tsx"
import { useNavigate, useSearchParams } from 'react-router'
import { validateReturnPath } from './validateReturnPath'

export function SafeRedirectHandler() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  function handleSuccess() {
    const rawTarget = params.get('returnUrl')
    const safeTarget = validateReturnPath(rawTarget, '/dashboard')
    void navigate(safeTarget, { replace: true })
  }

  return (
    <button type="button" onClick={handleSuccess}>
      Güvenle Devam Et
    </button>
  )
}
```

## Bağımlılık tedarik zinciri güvenliği

Modern React projeleri yüzlerce üçüncü taraf `npm` paketi kullanır. Bu paketlerin her biri projenin çalışma anında ve derleme sürecinde kod çalıştırabilir. Kötü niyetli bir aktörün popüler bir paketin bakımcısının hesabını ele geçirip zararlı kod yayımlamasına tedarik zinciri (supply chain) saldırısı denir.

Tedarik zincirini güvenceye almak için dört temel savunma hattı kurulur:

1. **Lockfile bütünlüğü:** `pnpm-lock.yaml` dosyası her paketin tam sürümünü ve SHA-512 bütünlük özetini (integrity hash) saklar. Proje versiyon kontrolünde lockfile mutlaka tutulmalıdır.
2. **CI ortamında dondurulmuş kurulum:** Sürekli entegrasyon (CI) sunucularında paketler yüklenirken lockfile'ın değiştirilmesini engellemek için `pnpm install --frozen-lockfile` çalıştırılır. Lockfile ile `package.json` uyumsuzsa işlem anında hata verir.
3. **Kurulum script'lerini kısıtlamak:** Paketlerin `postinstall` veya `preinstall` aşamasında keyfi Node.js script'leri çalıştırması büyük bir risk kaynağıdır. `pnpm 10`, üçüncü taraf paketlerin kurulum script'lerini varsayılan olarak çalıştırmaz; yalnızca `pnpm.onlyBuiltDependencies` listesinde açıkça onay verilmiş paketlerin derleme script'lerine izin verir.
4. **Gecikmeli sürüm kabulü (minimumReleaseAge):** Kötü amaçlı paket sürümleri genellikle ilk 24-48 saat içinde topluluk tarafından fark edilip geri çekilir. `pnpm config set minimumReleaseAge 48h` gibi bir ayar, çok yeni yayımlanmış paketlerin projeye anında indirilmesini engelleyerek inceleme süresi kazandırır.
5. **Düzenli güvenlik taraması:** `pnpm audit` komutu bağımlılık ağacındaki bilinen güvenlik açıklarını listeler ve kritik yamaları uygulamanı sağlar.

## Sık hatalar ve düzeltmeleri

:::mistake[Ters eğik çizgi denetimini atlamak]
**Belirti:** URL filtresi `startsWith('/')` ve `!startsWith('//')` kontrolü yaptığı halde kullanıcı harici bir siteye yönlendirilebiliyor.  
**Neden:** `/\evil.example` girdisi tek eğik çizgiyle başlar ancak bazı tarayıcı motorları ters eğik çizgiyi düz çizgiye normalize ederek adresi `//evil.example` haline getirir.  
**Düzeltme:** Yol içinde ters eğik çizgi (`\`) bulunup bulunmadığını açıkça denetle ve varsa girdiyi reddet.
:::

:::mistake[.env dosyasını sır kasası sanmak]
**Belirti:** Üçüncü taraf SMS veya ödeme servisinin bakiye ve işlem kayıtları çalınıyor; servis paneli API anahtarının kötüye kullanıldığını gösteriyor.  
**Neden:** Gizli API anahtarı `VITE_PAYMENT_SECRET` adıyla `.env` dosyasına yazılmış ve bileşen içinde kullanılmıştır. Vite bu değeri üretim bundle'ına düz metin olarak yerleştirmiştir.  
**Düzeltme:** Gizli anahtarı yalnızca sunucu tarafında tut. İstemciye yalnızca herkese açık genel anahtarları (`VITE_PUBLIC_*`) aç.
:::

:::mistake[Lockfile dosyasını gitignore'a eklemek]
**Belirti:** Geliştiricinin yerel makinesinde çalışan kod, sunucuda veya takım arkadaşının bilgisayarında derleme hatası veriyor ya da farklı paket sürümleri yükleniyor.  
**Neden:** `pnpm-lock.yaml` veya `package-lock.json` dosyası repoya eklenmediği için her ortamda `^` ve `~` sembolleri en son yayımlanan sürümleri çekmiştir.  
**Düzeltme:** Lockfile dosyasını mutlaka versiyon kontrolüne dahil et ve CI ortamında `--frozen-lockfile` bayrağını kullan.
:::

:::sector[Sektör standardı]
Büyük ölçekli ön yüz projelerinde gizli API anahtarlarının koda sızmasını engellemek için CI hattında `git-secrets` veya `trufflehog` gibi statik gizli bilgi tarayıcıları çalıştırılır. Dış yönlendirmelerde ise serbest parametre almak yerine yalnızca önceden tanımlanmış rota anahtarlarını (`enum` veya literal union) eşleyen rota haritaları tercih edilir.
:::

## Özet

- İstemciye indirilen her JavaScript kodu herkese açıktır; `VITE_` değişkenleri derleme anında koda düz metin olarak gömülür, bu yüzden ön yüzde gerçek sır saklanamaz.
- Hassas işlemler ve gizli anahtarlar daima backend üzerinde barındırılmalı, ön yüz bu işlemleri kendi API uç noktalarıyla yürütmelidir.
- Açık yönlendirme (open redirect), giriş sonrası dönüş adresinin denetlenmemesinden kaynaklanır; saldırgan kullanıcıyı güvenilir bir siteden sahte bir platforma taşıyabilir.
- Güvenli yönlendirme için girdinin tek `/` ile başlaması, `//` veya `\` içermemesi ve kontrol karakterlerinden arındırılmış olması gerekir; aksi halde bilinen bir varsayılan sayfaya dönülmelidir.
- Bağımlılık güvenliği için lockfile versiyon kontrolünde tutulmalı, CI'da `--frozen-lockfile` kullanılmalı, kurulum script'leri kısıtlanmalı ve `pnpm audit` düzenli çalıştırılmalıdır.

### Kendini yokla

1. Bir geliştirici `.env` içine `VITE_STRIPE_SECRET_KEY=sk_live_...` yazıp bir React bileşeninde kullandı. Bu anahtar neden güvende değildir?
*Cevap:* Çünkü Vite bu değişkeni derleme sırasında üretim JavaScript dosyalarının içine doğrudan metin olarak gömer. Tarayıcıda sayfayı açan herkes kaynak kodlardan bu anahtarı görebilir.

2. `target.startsWith('/')` kontrolü açık yönlendirmeyi engellemek için neden tek başına yetersizdir?
*Cevap:* Çünkü `//evil.example` gibi protokol devralan harici adresler de `/` ile başlar ancak tarayıcı tarafından harici bir etki alanı olarak çalıştırılır. Ayrıca `/\evil.example` gibi ters eğik çizgi varyasyonları da tek `/` ile başlar.
