---
title: "İstemcide sırlar, yönlendirme ve bağımlılıklar"
minutes: 15
kind: concept
---

# İstemcide sırlar, yönlendirme ve bağımlılıklar

Bir React uygulamasında kullandığın kod, derlemeden sonra kullanıcının tarayıcısına gider. Bu yüzden ön yüzde bir değeri gizlemek ile sunucuda gizlemek aynı şey değildir. Giriş sonrası dönüş adresinde de benzer bir sınır var: uygulama, kullanıcının verdiği metni güvenli kabul edip doğrudan tarayıcıya yönlendirmemelidir.

## Tarayıcıya giden kod herkese açıktır

Önce bildiğin bir örnek: bileşen içinde kullandığın sabit bir metin tarayıcıda görünür. Vite'ın build işlemi de TypeScript ve JSX dosyalarını tarayıcının indirebildiği JavaScript dosyalarına dönüştürür. Bu JavaScript paketi (bundle), uygulamanın istemciye gönderilen kod dosyalarıdır.

`ts title="src/config.ts"
const apiBaseUrl = import.meta.env.VITE_API_URL
`

`VITE_` ile başlayan ortam değişkenleri build sırasında bu pakete yazılır; `.env` dosyasının içinde olmaları onları gizli yapmaz. URL gibi herkese açık bir ayar burada bulunabilir. Özel API anahtarı veya veritabanı parolası burada bulunmamalıdır; bunları içeren kod sunucuda kalmalıdır.

Biraz farklı örnek: genel bir film API'si istemciden doğrudan çağrılmak üzere tasarlanmış bir public key (herkese açık anahtar) sunabilir. Böyle bir anahtarın açıkça istemci için üretildiği ve kullanımının kısıtlandığı varsayılır. Ödeme sağlayıcısının özel anahtarı ise para hareketi yapma yetkisi taşıyabilir; onu kullanacak işlem sunucuda yapılmalı, arayüz yalnızca senin API'ne istek göndermelidir.

`ts
// Hatalı: VITE_ değeri tarayıcıya giden pakette görünür.
const paymentSecret = import.meta.env.VITE_PAYMENT_SECRET
`

**Ne oldu, neden?** Gizli değişken adını `VITE_` yapmak onu korumaz. Build değeri istemci koduna koyar ve kullanıcı bu dosyayı indirebilir; gizlilik için yetki gerektiren işlemi sunucuya taşımalısın.

## Girişten sonra nereye dönüleceğini sınırla

Korumalı bir film detay sayfasına oturumu olmadan giden kullanıcıyı giriş sayfasına gönderebilirsin. Kullanıcı giriş yapınca da geldiği sayfaya döndürmek için adres çubuğundaki query parametresini, yani URL'nin `?` sonrasındaki ek bilgisini okuyabilirsin. Fakat bu değer dışarıdan geldiği için güvenilir değildir.

En basit kontrol, yalnızca uygulama içi mutlak yolları kabul etmektir:

`ts
function isAppPath(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//')
}
`

`/films` uygulama içi yoldur. `https://fake.example` dış adrestir. `//fake.example` ise iki slash ile başladığı için tarayıcı tarafından harici adres gibi yorumlanabilir; bu yüzden sadece ilk karakteri denetlemek yetmez.

**Ne oldu, neden?** İlk koşul uygulama içi yolları seçiyor; ikinci koşul protokolü devralan `//` adreslerini eliyor. Böylece kullanıcıya beklediği yerel sayfaya dönüş imkânı verilirken dış siteye kaçış engellenir.

Şimdi aynı doğrulamaya bir kenar durum daha ekleyelim. URL ayrıştırıcıları bazı durumlarda ters eğik çizgiyi `/` gibi yorumlayabilir. `'/\\fake.example'` gibi bir değer ilk kontrollerden geçebilir ama adres yorumlanırken dış hedefe dönüşebilir. Kontrol karakterleri de URL'nin nasıl ayrıştırıldığını şaşırtabilir.

`ts
function isSafeAppPath(value: string): boolean {
  return (
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\') &&
    !/[\u0000-\u001f\u007f]/.test(value)
  )
}
`

**Ne oldu, neden?** Ters eğik çizgiyi ve görünmeyen kontrol karakterlerini reddederek, URL'nin tarayıcıda beklenmedik biçimde başka adrese dönüşmesini önledik. Geçersiz değer geldiğinde uygulama bilinen bir iç sayfayı, örneğin `/profile`, kullanmalıdır.

## Giriş dönüşünü sırayla izle

Aşağıdaki örnek `/films/42?tab=cast` yolunu korur; dışarıdan gelen veya bozuk bir değeri `/profile` ile değiştirir. `URLSearchParams` adres çubuğundaki parametreyi okumaya yarar. Bu örnek bir güvenli dönüş yolu seçer, yönlendirme bileşeninin kendisini yazmaz.

`ts
function safeReturnPath(rawValue: unknown): string {
  if (typeof rawValue !== 'string' || rawValue.length === 0) {
    return '/profile'
  }

  const safe = isSafeAppPath(rawValue)
  return safe ? rawValue : '/profile'
}

const requestedPath = new URLSearchParams(window.location.search).get('returnTo')
const destination = safeReturnPath(requestedPath)
`

| Sıra | İşlem | `destination` |
| --- | --- | --- |
| 1 | `returnTo=/films/42?tab=cast` okunur | henüz atanmadı |
| 2 | Değer metin mi ve güvenli uygulama yolu mu diye bakılır | `/films/42?tab=cast` |
| 3 | Başarılı giriş sonrası uygulama bu yolu açar | film detay sayfası |
| 4 | Değer `//fake.example` veya boşsa | `/profile` |

**Ne oldu, neden?** Önce kullanıcı girdisini aldık, sonra tipini ve yol biçimini denetledik, en son güvenli sonucu seçtik. Denetimden önce navigasyona verirsen kullanıcının kendi linki onu Sinema'dan çıkarabilir; buna open redirect (açık yönlendirme) denir.

:::mistake[Başında slash var diye adresi kabul etmek]
**Belirti:** Girişten sonra adres `//fake.example` oluyor ve tarayıcı Sinema dışına çıkıyor. **Neden:** `//fake.example` de `/` ile başlar, ama dış adres olarak yorumlanabilir. **Düzeltme:** Tam olarak uygulama içi yolları kabul et; `//`, ters eğik çizgi ve kontrol karakterlerini reddet, diğer değerlerde sabit bir iç fallback kullan.
:::

## Paket sürümlerini tekrarlanabilir tut

Bir React projesi doğrudan kullandığın paketlerin yanında, onların kullandığı başka paketlere de bağlıdır. Bu paketlerin tümüne bağımlılık ağacı denir. Bir paketin kötü amaçlı sürümü, uygulamaya güvenmediğin kod sokabilir; buna tedarik zinciri saldırısı denir.

Lockfile (kilit dosyası), kurulumda kullanılacak paket sürümlerini ve ilişkilerini kaydeder. Örneğin `pnpm-lock.yaml` dosyasını repoda tutarsan ekipte ve otomatik build ortamında aynı sürüm ağacı kurulabilir. Sürekli entegrasyon (CI), kodu sunucu ortamında otomatik kurup derleyen iş akışıdır; orada `pnpm install --frozen-lockfile` kullanmak, dosya ile `package.json` uyuşmadığında kurulumun farklı sürümler seçmesini engeller ve hata verir.

**Ne oldu, neden?** Lockfile'ı repoya eklemek “paket tamamen güvenlidir” demek değildir. Bu, hangi sürümlerin kurulduğunu görünür ve tekrarlanabilir yapar. Bilinen açıklara karşı `pnpm audit` gibi taramalar da ek sinyal verir; bulguları inceleyip güncelleme kararı vermen gerekir.

:::info[Derinlemesine (isteğe bağlı)]
Paketlerin kurulum sırasında çalıştırdığı script'ler de bilgisayarda kod yürütebilir. Paket yöneticisinin güven ayarlarını gözden geçir, yalnızca gerçekten gereken paketlere izin ver ve otomatik güvenlik taramasının her bulguyu doğru yorumladığını varsayma. Yeni yayımlanan paket sürümünü hemen almak yerine kısa süre bekletmek de bazı saldırılara karşı ek inceleme zamanı sağlayabilir.
:::

## Özet

- Build ile tarayıcıya giden JavaScript kullanıcı tarafından incelenebilir; `VITE_` değişkenine özel sır koyma.
- Yetki taşıyan gizli anahtarları sunucuda tut; istemci güvenli API üzerinden işlem istesin.
- Giriş dönüş adresini dışarıdan gelen girdi say; yalnızca güvenli uygulama içi yolları kabul et, diğerlerinde sabit bir iç sayfaya dön.
- Lockfile kurulan sürümleri kaydeder; CI'da dondurulmuş kurulum farklı paket sürümlerinin sessizce seçilmesini önler.
- `pnpm audit` bilinen güvenlik açıkları için kontrol sağlar; sonuçları incelemek gerekir.

**Yeni terimler**

- **Build / bundle:** Kaynak kodu tarayıcının indirebildiği dosyalara dönüştürme / bu istemci dosyaları.
- **Open redirect:** Denetlenmeyen dönüş adresinin kullanıcıyı uygulama dışına yönlendirmesi.
- **Lockfile:** Kurulumda kullanılacak paket sürümlerini kaydeden kilit dosyası.
- **Bağımlılık ağacı:** Projenin kullandığı paketler ve onların kullandığı diğer paketler.
- **Tedarik zinciri saldırısı:** Güvenilen paket veya dağıtım yoluna zararlı kod sokulması.
- **CI:** Kodun sunucuda otomatik kurulup derlendiği iş akışı.

**Kendini yokla**

1. `VITE_PAYMENT_SECRET` neden `.env` içinde olsa da gizli kalmaz?  
*Cevap:* Vite `VITE_` değerini build sırasında tarayıcıya gönderilen koda koyar; kullanıcı bu dosyayı indirebilir.

2. Neden yalnızca `value.startsWith('/')` kontrolü güvenli yönlendirme için yetmez?  
*Cevap:* `//fake.example` de `/` ile başlar ama dış siteye gidebilir; ters eğik çizgi gibi değerler de URL yorumunu şaşırtabilir.

