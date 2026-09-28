---
title: "Ortam değişkenleri ve istemci sınırı"
minutes: 14
kind: concept
---

# Ortam değişkenleri ve istemci sınırı

:::pain[Problem]
Sinema API'sine bağlanması için token'ı \`src/api.ts\` içine yazdın ve projeyi GitHub'a gönderdin. Bir süre sonra başkaları da senin kota sınırını kullanmaya başladı. Token'ı \`.env\` dosyasına taşıdın; ama uygulama tarayıcıda çalıştığı için hâlâ geliştirici araçlarından okunabiliyor.
:::

## Değişkenin yolu: makineden tarayıcıya

Bir ortam değişkeni, aynı kodu farklı ortamlarda farklı ayarlarla çalıştırmanı sağlar. Geliştirmede yerel API adresi, testte sahte başlık, yayında gerçek uygulama başlığı kullanılabilir. Değişkeni dosyaya taşımak kodu ortama göre düzenlemeyi kolaylaştırır; tek başına gizlilik sağlamaz.

![Vite ortam değerinin kaynak dosyadan tarayıcı çıktısına giden yolu](diagrams/env-siniri.svg)

Vite için şu kurallar geçerlidir:

1. Vite proje kökünde \`.env\`, \`.env.local\` ve moda özel dosyaları okur. Örneğin geliştirme için \`.env.development\`, build için \`.env.production\` kullanılabilir. Aynı anahtarı birden fazla yere koyarsan hangi değerin kullanıldığını kontrol et.
2. İstemci kaynak kodunda yalnızca \`VITE_\` önekli değişkenler \`import.meta.env\` üzerinden açılır. Öneksiz \`DATABASE_PASSWORD\` tarayıcı modülüne aktarılmaz.
3. \`VITE_\` ile başlayan değer gizli değildir. Vite bu değeri geliştirme istemcisine verir ve production build sırasında kodun içine yerleştirir. Kullanıcı JavaScript dosyasını indirip değeri görebilir.
4. Env değerleri metindir. \`VITE_PAGE_SIZE=20\` okunduğunda \`"20"\` gelir; sayı gerekiyorsa dönüştürüp geçerliliğini kontrol et.
5. \`.env\` dosyası kişisel veya ortama özel değerleri taşır; \`.env.example\` gerekli anahtar adlarını örnek değerlerle belgeler. Gerçek \`.env\` repoya eklenmemelidir.

“Env dosyasında” demek “sunucuda saklı” demek değildir. Bir değerin güvenli olup olmadığını belirleyen şey, onun nerede bulunduğu ve istemciye gönderilip gönderilmediğidir.

## Bir değerin izini sürelim

Örneğin uygulamanın görünen adını \`VITE_APP_TITLE\` belirlesin. Geliştirme dosyasında \`VITE_APP_TITLE=Film Defteri\` varsa Vite bunu süreç başında okur. \`import.meta.env.VITE_APP_TITLE\` ifadesi bu değere bağlanır; React başlığı DOM'a yazınca tarayıcıdaki herkes metni görebilir. Dosyayı değiştirdikten sonra çalışan dev sunucusunu yeniden başlatman gerekir; aksi halde bellekte eski ayar kalabilir.

| Zaman | Nerede? | Değer / sonuç |
| --- | --- | --- |
| 1 | \`.env.development\` | \`VITE_APP_TITLE=Film Defteri\` |
| 2 | Vite başlarken | dosyadaki metin okunur |
| 3 | istemci modülü | \`import.meta.env.VITE_APP_TITLE\` → \`"Film Defteri"\` |
| 4 | React render'ı | başlık metni DOM'a eklenir |
| 5 | ziyaretçinin tarayıcısı | aynı metin geliştirici araçlarında görülebilir |

Bir ayar zorunluysa uygulama başlarken eksik olduğunu anlaşılır biçimde bildirmek, birkaç dakika sonra alakasız bir ağ hatası görmekten iyidir. İsteğe bağlı ayara ise açık bir varsayılan ver. Bu ayrımı tek bir config modülünde yapmak, her bileşenin env değişkeni ve varsayılan kararıyla uğraşmasını engeller.

Örnek olarak bilet gişesinin adını okuyan küçük bir modül düşün:

\`\`\`ts check
interface ImportMetaEnv {
  readonly VITE_COUNTER_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const counterName = import.meta.env.VITE_COUNTER_NAME?.trim() || 'Mahalle Gişesi'
export const greeting = \`\${counterName} bilet satışına hazır\`
\`\`\`

Burada \`?.\` eksik değerde \`trim()\` çağrısını atlar. \`||\` ise hem eksik değeri hem boş veya yalnızca boşluk içeren adı varsayılana çevirir. \`??\` yalnızca \`null\` ve \`undefined\` için varsayılan verir; boş string'i olduğu gibi bırakır.

## Önce kırık, sonra güvenli

Kırık yaklaşım, token'ı kaynak koda yazmaktır:

\`\`\`ts
const apiToken = 'gizli-sandigin-deger'
\`\`\`

Bu satır build çıktısına girer ve Git geçmişinde kalır. Sonradan dosyadan silsen bile eski commit'lerde bulunabilir. Token gerçekten gizli bir sırsa onu iptal edip yenisini almak gerekir.

\`.env\` kullanmak sızıntıyı önlemez; yalnızca değeri kaynak koddan ayırır. Tarayıcıda çalışacak Vite uygulaması için bu örnekteki başlık uygundur:

\`\`\`bash title=".env.example"
VITE_APP_TITLE=Film Defteri
VITE_PUBLIC_CATALOG_TOKEN=
\`\`\`

\`\`\`ts check
interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string
  readonly VITE_PUBLIC_CATALOG_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const title = import.meta.env.VITE_APP_TITLE?.trim() || 'Film Defteri'
export const pageHeading = title
\`\`\`

\`VITE_PUBLIC_CATALOG_TOKEN\` adındaki “public” uyarısı önemlidir: üçüncü taraf servislerin tarayıcıda kullanılmak üzere verdiği sınırlı bir anahtar olabilir, ama yine de kullanıcı tarafından kopyalanabilir ve kotası tüketilebilir. Ödeme sağlayıcısı anahtarı, veritabanı parolası veya imzalama sırrı gibi gizli değerleri \`VITE_\` ile açma. Böyle bir çağrıyı kendi backend'in yapmalı.

Tip bildirimi editöre anahtar adlarını tanıtır; çalışma zamanında değer bulunduğunu kanıtlamaz. \`readonly VITE_API_URL: string\` yazmak eksik env'i sihirli biçimde üretmez. Gerçek değer yoksa \`undefined\` gelebilir. Zod ile sınır doğrulamasını ileride daha kapsamlı kuracaksın.

## Mod ve varsayılan değer kararını izleyelim

Aynı anahtar yerel geliştirme ve production build sırasında farklı değer alabilir. Dosya adı yalnızca hangi değer kümesinin yüklendiğini seçer; değerin güvenli olup olmadığını belirlemez. Örneğin VITE_APP_TITLE geliştirmede “Önizleme”, production'da “Katalog” olabilir. Her iki durumda da istemci bu metni alır.

| Adım | Geliştirme | Production |
|---|---|---|
| Vite modu | development | production |
| Kaynak | .env.development | .env.production veya genel .env |
| Kaynakta okunan ifade | import.meta.env.VITE_APP_TITLE | aynı ifade |
| Build çıktısı | dev sunucusunun modül yanıtı | derlenmiş JavaScript içine değer |
| Gizlilik sonucu | ziyaretçi geliştirici araçlarında görebilir | dosyayı indiren herkes değeri bulabilir |

Değer yokken davranış da açık olmalı. İsteğe bağlı metin ayarında boş ve eksik değer ikisi de varsayılanı seçebilir; sayı veya URL gibi zorunlu ayarda sessiz varsayılan yanlış ortama istek gönderebilir. Bu yüzden config modülünde önce varlığı kontrol et, sonra biçimi ve iş aralığını doğrula. Örneğin sayfa boyutu sayı olmalı, pozitif bir tam sayı olmalı ve uygulamanın kabul ettiği üst sınırı aşmamalı. Tip tanımı yalnızca editör ve derleyiciye şekli anlatır; makinedeki .env dosyasını incelemez.

Geliştirme sunucusu başlangıçta dosyaları okur. Dosya değişince eski süreç bellekte eski config ile çalışabilir; yeniden başlatma, hangi dosyanın devrede olduğunu anlamanın ilk kontrolüdür. Build alırken de yerel geliştirme değerinin production çıktısına gömülmediğini kontrol et. Anahtar adlarını .env.example içinde belgele, gerçek değerleri ekleme.

## Sık hatalar

:::mistake[Env dosyasına koyunca sır saklandığını sanmak]
Belirti → Build edilmiş JavaScript dosyasında token metni aranıp bulunuyor.  
Neden → \`VITE_\` değerleri istemci koduna verilir ve kullanıcıya ulaşır.  
Düzeltme → Gizli anahtarı backend'de tut; istemciye yalnızca herkese açık olması tasarlanmış ayarları aç.
:::

:::mistake[Değer değişikliğinin uygulanmadığını görmek]
Belirti → \`.env\` dosyasını düzenledin ama uygulama eski başlıkla açılıyor.  
Neden → Dev sunucusu env değerini başlarken yüklemiştir.  
Düzeltme → Sunucuyu durdurup yeniden başlat; ayrıca doğru moda ait dosyayı değiştirdiğini kontrol et.
:::

:::mistake[Sayı yerine string ile hesaplama yapmak]
Belirti → \`"20" + 1\` sonucu \`"201"\` oluyor.  
Neden → Env değerleri string'dir; tip bildirimi de dönüşüm yapmaz.  
Düzeltme → \`Number(value)\` kullan, ardından \`Number.isInteger(...)\` ve iş kuralını doğrula.
:::

:::sector
Ekipler repoya \`.env.example\` ve değişken açıklamalarını koyar; gerçek değerleri secret store veya CI ortam ayarlarında saklar. Frontend env değişkenlerinin kullanıcıya açık olduğunu kod incelemesinde varsaymak, gizli anahtarın yanlış yere konmasını erken yakalar.
:::

## Özet

- Vite istemciye yalnızca \`VITE_\` önekli env değerlerini açar; bu değerler gizli değildir.
- Env değerleri string olarak gelir; sayısal değerleri dönüştür ve doğrula.
- \`.env\` yerel ayar içindir, \`.env.example\` değişken adlarını belgeler.
- Zorunlu ve isteğe bağlı ayarları tek config sınırında ele al; tip bildirimi runtime doğrulaması değildir.

**Kendini yokla:** \`PAYMENT_SECRET\` yerine \`VITE_PAYMENT_SECRET\` yazarsan sır korunur mu?  
*Cevap:* Hayır. Önek değeri istemciye açar; gizli ödeme anahtarı backend'de kalmalıdır.

**Kendini yokla:** \`VITE_PAGE_SIZE=20\` değerini neden doğrudan sayısal toplama sokamazsın?  
*Cevap:* Env metindir ve \`"20"\` gelir; sayıya çevirmek ve geçerli aralığı kontrol etmek gerekir.
