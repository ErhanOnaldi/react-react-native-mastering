---
title: "readConfig şemaya dönüşüyor"
minutes: 8
kind: review
---

# readConfig şemaya dönüşüyor

:::pain[Problem]
Token .env dosyasında var görünüyor ama içeriği yalnızca boşluk. Uygulama başlıyor, ilk istek 401 dönüyor. 0. modülde elle yazdığın readConfig büyüdü; artık eksik, boş ve hatalı değerlerin her biri için ayrı dal gerekiyor.
:::

## Ayar da dış girdidir

Environment değişkenlerinin editörde string olarak görünmesi, çalışma anında doğru olduklarını kanıtlamaz. Bir değer eksik olabilir, boşluk içerebilir veya sayı beklenen yerde geçersiz metin taşıyabilir. 0. modüldeki readConfig bu durumları elle kontrol ediyordu; aynı ilkeleri şema ile düzenli biçimde ifade edebilirsin.

:::model[Tip derlemede, veri çalışma anında]
TypeScript'in import.meta.env bildirimi derleme zamanı bilgisidir. Uygulama açılırken gerçek değerleri Zod ile parse edince doğrulanmış config elde edersin. Bu bağlamda doğrulamanın sonucu çoğunlukla uygulama boyunca paylaşılan tek bir env nesnesidir.
:::

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığını gösteren akış](diagram:zod-sinir)

## Kuralları config'e uygula

Token zorunluysa trim sonrası boş olamaz; bunun için string şeması üzerinde trim ve minimum uzunluk kuralı bulunur. Hata metni \`VITE_TMDB_TOKEN\` adını içerirse eksik ayarı geliştirirken hemen bulursun. Başlık gibi opsiyonel ayar için eksik veya boş değerde \`Sinema\` seçilebilir. Sayfa boyutu metin olarak gelir; önce sayıya çevrilir, sonra pozitif tam sayı olup olmadığı kontrol edilir.

Varsayılan davranışı seçerken \`.default('Sinema')\` yalnızca undefined değerinde çalışır. .env içinde başlık boş string olarak verilmişse bu değer eksik sayılmaz. Trim sonrasındaki boş değeri varsayılan yapmak için transform veya safeParse sonucu üzerinden açık karar gerekir. Aynı şekilde geçersiz sayfa boyutunu sessizce kabul etmek yerine eski sözleşmedeki 20 değerine dönmek bilinçli bir fallback'tir.

## Açılış anındaki sıra

1. Uygulama açılır ve import.meta.env alanları okunur.
2. Ham config şemaya verilir; token zorunlu kuraldan, başlık ve sayfa boyutu kendi dönüşümünden geçer.
3. Token eksik veya boşsa parse hata verir. Uygulama yanlış ayarla istek göndermek yerine erken durur.
4. Başlık veya sayfa boyutu opsiyonel ve hatalıysa seçilen varsayılan çıktı nesnesine yazılır.
5. Uygulamanın geri kalanı yalnızca doğrulanmış env alan adlarını kullanır.

Bu akışta hata türleri farklı ele alınır. Zorunlu token yokluğu çalışmayı durdurmalıdır; varsayılanı olan başlıkta eksik değer kabul edilebilir. Her şeyi fallback yapmak gerçek yapılandırma hatasını saklar. Her şeyi fırlatmak da kullanıcıya değiştirilebilir bir görünüm ayarı yüzünden uygulamayı açtırmaz. Hangi alanın zorunlu olduğunu ürün ve dağıtım sözleşmesi belirler.

## İstemci ayarları gizli değildir

\`VITE_\` önekli değerler Vite tarafından istemci paketine yerleştirilir. Derlenmiş JavaScript'i indiren kişi bu değeri bulabilir; Zod onu doğrular ama gizlemez. TMDB gibi tarayıcıdan yapılan çağrılarda kullanılabilen token bile kullanım ve kota riski taşır. Veritabanı parolası veya ödeme anahtarı gibi gerçek sırlar frontend env içine konmaz; bu çağrılar backend üzerinden yapılır.

Birden fazla dosyanın doğrudan import.meta.env okuması, değer adlarını ve fallback kararlarını uygulamaya yayar. Tek env modülü ise açılışta parse eder, sonuç nesnesini export eder ve başka modüllerin ham değer üzerinde kendi varsayımlarını kurmasını engeller. Bu pattern, config'i kontrol edilebilir bir arayüz yapar.

:::mistake[Boş metni eksik saymamak]
Belirti → Başlık ayarı boş görünür. Neden → Default yalnız undefined değerini ele aldı. Düzeltme → Trim sonrası boş string için ayrıca varsayılan kuralı tanımla.
:::

:::mistake[VITE_ değerini sır sanmak]
Belirti → Token tarayıcı paketinde görülebilir. Neden → İstemci env değeri kullanıcıya gönderilen koda gömülür. Düzeltme → Gizli anahtarı backend'de tut; env şemasını gizlilik aracı gibi kullanma.
:::

:::sector
Üretim uygulamaları zorunlu config'i başlangıçta doğrular ve eksik ayarla yarım çalışmaya başlamaz. Takım, hangi env değerinin public olduğunu ve fallback politikasını .env.example içinde belgeler. İstemci env'sinde gizli değer bulunmadığını CI'da da gözden geçirir.
:::

## Özet

- Environment değerleri de çalışma zamanında doğrulanmalıdır.
- Zorunlu token eksik/boşsa açıklayıcı hata üret; opsiyonel ayarlara bilinçli fallback uygula.
- Default undefined'i ele alır; boş metin için ayrı karar gerekir.
- VITE_ değerleri kullanıcıya giden bundle'da görünür ve secret değildir.

**Kendini yokla:** \`.default('Sinema')\` boş stringi otomatik olarak değiştirir mi?  
*Cevap:* Hayır; undefined dışında boş metin ayrı ele alınır.
