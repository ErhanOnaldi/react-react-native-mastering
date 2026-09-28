---
title: "API sınırında doğrula"
minutes: 14
kind: concept
---

# API sınırında doğrula

:::pain[Problem]
TMDB 200 döndürüyor ama başlık null. Query isteği başarı sayıyor; detay sayfası başlığın harflerini küçültmeye çalışınca bozulmuş veri UI'a kadar ulaşmış oluyor.
:::

## HTTP başarısı ile veri başarısı ayrıdır

Bir HTTP 200 cevabı sunucunun taşıma düzeyinde başarı bildirdiğini söyler. JSON içindeki alanların uygulamanın beklediği biçimde olduğunu söylemez. response.json() bir JavaScript değeri üretir; dönüş tipini generic ile yazmak ya da as Movie demek o değeri kontrol etmez. Bu yüzden API client hem HTTP durumunu hem JSON sözleşmesini ayrı ayrı ele almalıdır.

:::model[Tip derlemede, veri çalışma anında]
TypeScript tipi çalışma zamanında kaybolur; API gövdesini unknown başlat. Önce HTTP katmanını kontrol et, JSON'u oku ve Zod şemasını parse et. Başarılı sonuç tipli veridir; parse hatası ise Query'ye başarı verisi olarak ulaşmaz.
:::

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığını gösteren akış](diagram:zod-sinir)

Client tarafında şu kurallar sıralı uygulanır:

1. İstek tamamlandıktan sonra response.ok kontrol edilir. Fetch, 404/500 cevaplarında Promise'i reddetmez; HTTP hatası için client açıkça hata üretmelidir.
2. HTTP başarısı sonrası cevap gövdesi bir kez okunur. JSON sonucu unknown kabul edilir.
3. Endpoint'e ait Zod şeması gerçek JSON üzerinde parse edilir. Parse başarılı değilse geçerli API çıktısı gibi dönülmez.
4. HTTP hatası ile şema hatası ayrı kökenlerdir. İkisini tek bir genel başarı/boş nesneye dönüştürme; tanı ve arayüzde gereken bağlamı koru.
5. Parse başarısızlığında exception ile reddedilen client Promise'i, onu çağıran query kütüphanesinin hata durumuna geçebilir.

Bu sıralamanın önemli bir ayrıntısı, gövdenin tek seferlik olmasıdır. response.json() body stream'ini tüketir; aynı response'tan önce JSON alıp sonra tekrar JSON okuyamazsın. Cevapta sadece durum kodunu göstermen gerekiyorsa gövdeyi hiç açmamak veya içeriği bir kez saklamak gerekir. 204 No Content gibi gövdesiz yanıtta JSON okumaya çalışmak da parse hatası üretir; endpoint sözleşmen gövde döndürmüyorsa onu farklı ele al.

## Bir cevabı izleyelim

Küçük bir atölye API'si cihaz bilgisini { serial: string, temperature: number } biçiminde döndürüyor. Client akışındaki değerleri tabloyla izleyelim.

| Adım | Kodun yaptığı | raw / sonuç | Sonraki katman |
| --- | --- | --- | --- |
| 1 | fetch tamamlanır | response.status = 200 | henüz veri doğrulanmadı |
| 2 | response.ok kontrolü | true | gövde okunabilir |
| 3 | response.json() | unknown nesne | alanlar hakkında garanti yok |
| 4 | deviceSchema.parse(raw) | serial ve temperature denetlenir | başarıysa tipli çıktı |
| 5a | Parse geçer | { serial: 'A-7', temperature: 22 } | query data olur |
| 5b | Parse kalır | ZodError | query error olur |

Kritik satır, parse'ın client içindeki dönüşten önce çalışmasıdır. Bileşen query data'sı aldığında sınırın sözleşmesinden geçmiş olur. Eğer parse UI render'ında yapılırsa aynı ham cevap cache'e girebilir, birden çok ekran aynı doğrulamayı yazabilir ve hata render sırasında oluşur. API client endpoint verisinin güvenilirliğini tek giriş noktasında kurar.

## Kırık ve doğru yol

Kırık client, HTTP durumunu ve gövde biçimini yok sayar:

```ts
async function getDevice<T>(path: string): Promise<T> {
  const response = await fetch(path)
  return (await response.json()) as T
}
```

200 + { serial: null, temperature: 'yüksek' } bu fonksiyondan başarıyla geçer. Tip iddiası değerleri değiştirmediği için ekran daha sonra hatalı alanı kullandığında çöker. 404 cevabı da JSON gövdesi parse edilebilir durumdaysa T olarak dönebilir.

Doğru yolu cihaz örneğiyle kur:

```ts check
import { z } from 'zod'

const deviceSchema = z.object({
  serial: z.string().min(1),
  temperature: z.number(),
})

async function getDevice(path: string) {
  const response = await fetch(path)
  if (!response.ok) throw new Error('HTTP ' + response.status)
  const raw: unknown = await response.json()
  return deviceSchema.parse(raw)
}
```

Burada HTTP 404 önce kendi hata yoluna gider. HTTP 200 ama yanlış serial ise parse hatası üretir. İkisi de Promise'i reddeder, ancak hata tanısı farklıdır. Query ekranında her ikisine de “Veri yüklenemedi” gibi güvenli bir görünüm sunabilirsin; geliştirici logunda HTTP durumunu veya Zod issue yolunu koru.

## Tanı için doğru hata şekli

Zod 4'te z.prettifyError(error) geliştirici loglarında okunur hata metni üretir. Alan ağacı gerekirse z.treeifyError(error) şemanın iç içe yapısına göre hata bilgisi verir. Bunlar hata politikasının yerine geçmez: kullanıcıya tüm JSON yolu veya servis ayrıntısını göstermek çoğu ürün için gereksizdir. Kullanıcı mesajı kısa kalırken teknik tanı geliştirme/log kanalına yönlendirilebilir.

Hata nesnesini tüm ayrıntısıyla UI'a vermek güvenli olmayabilir ve kullanıcı açısından da yararlı değildir. Öte yandan her Zod hatasını sessizce boş nesneye çevirmek sistemi daha kırılgan yapar, çünkü hatalı kayıt sanki gerçekmiş gibi cache'e girer. Sınırda fail fast davranışı, hatalı veriyi hangi isteğin getirdiğini ve hangi alanın bozulduğunu yakın bağlamda gösterir.

API sözleşmesi değişebilir. Servis yeni, gerçekten opsiyonel bir alan eklediğinde schema'nın bilinçli şekilde onu beklemesi gerekir; tehlikeli biçimde bütün alanları optional yapmak değişime hazırlık değildir. Uygulamanın ihtiyaç duyduğu zorunlu alanları belirle ve gerçek yanıtla karşılaştır.

Liste ve detay cevabı çoğu zaman aynı alanların bire bir kopyası değildir. Liste kartı poster, başlık ve id ister; detay ekranında runtime, genres ve status gibi ek alanlar bulunabilir. Bir endpoint şemasını diğerine körlemesine kopyalamak yerine ortak film temelini belirleyip her yanıtın kendi shape'ini kur. Böylece bir alan bir endpoint'ten kalkınca ilgisiz ekranın sözleşmesi bozulmaz.

Yalnızca ekranda şu anda görünen alanları doğrulamak, kullandığın her alanın tipini ve null durumunu yine de garanti etmelidir. Örneğin sonuç listesinin ilk öğesi doğru görünür ama üçüncü öğede title null ise array'in tamamı parse edilirken hata ortaya çıkar. Bu çoğu zaman iyi sonuçtur: karışık kalitede bir listeyi sessizce render etmek yerine endpoint yanıtının sözleşmesinin ihlal edildiğini bildirir. Kısmi içerik istiyorsan her öğeyi ayrı parse edip geçersizleri ayıklamak ayrıca tasarlanmalı.

Tanı metnini geliştiriciye yöneltirken hassas token veya ham cevap gövdesini loglama. Error path ve endpoint adı çoğu hatayı bulmaya yeter; auth header hiçbir loga eklenmemelidir. Kullanıcıya servis alan isimlerini yığmak yerine eyleme geçirilebilir bir genel mesaj sun. Doğrulama güvenli fail path sağlar; gözlemleme politikası tanı bilgisinin nerede tutulacağını belirler.

## Sık yanılgılar

:::mistake[response.ok değerini veri doğrulaması sanmak]
Belirti → 200 yanıtında null başlık ekrana gelir. Neden → HTTP durum kodu body alanlarının tipini anlatmaz. Düzeltme → HTTP kontrolünden sonra JSON'u endpoint şemasıyla parse et.
:::

:::mistake[404'ün fetch'i reddettiğini varsaymak]
Belirti → Hata yerine beklenmedik JSON verisi dönüyor. Neden → Fetch, HTTP 4xx/5xx yanıtlarını resolve eder. Düzeltme → response.ok false olduğunda durum kodunu taşıyan hatayı kendin üret.
:::

:::mistake[Ham gövdeyi cache'e vermek]
Belirti → Bozuk veri birden fazla ekranda farklı yerde çöküyor. Neden → Doğrulama API sınırında yapılmadı. Düzeltme → Client yalnızca parse edilmiş çıktıyı döndürsün.
:::

:::sector
Ürünlerde API client genellikle her endpoint için şema parametresi alır veya endpoint'e özel fonksiyon içinde şemayı uygular. Bu, server response ile UI arasında tek kontrol noktası kurar. HTTP hataları ve şema hataları kullanıcıya ortak bir hata görünümü verebilir; telemetry tarafında ayrı sınıflandırılmaları operasyon ekibinin sorunu bulmasını hızlandırır.
:::

## Özet

- HTTP 2xx cevabı, JSON alanlarının doğru olduğunu kanıtlamaz.
- Fetch 404/500'te reddetmez; response.ok kontrolü API client'ın işidir.
- JSON gövdesini unknown alıp şemayla parse etmeden UI/cache'e döndürme.
- HTTP hatası ve veri sözleşmesi hatası farklı tanı bilgileri taşır.

**Kendini yokla:** Parse işlemini API client içinde yapmak Query açısından ne sağlar?  
*Cevap:* Bozuk cevabın başarı verisi/cache olarak yayılmasını engeller.

**Kendini yokla:** response.ok === false olduğunda fetch Promise'i her zaman reject olmuş mudur?  
*Cevap:* Hayır; HTTP cevabı resolve olur, client hata üretmelidir.
