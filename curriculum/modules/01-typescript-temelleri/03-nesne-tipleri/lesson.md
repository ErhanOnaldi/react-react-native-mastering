---
title: "Nesne tipleri ve arayüzler"
minutes: 13
kind: concept
---

# Nesne tipleri ve arayüzler

:::pain[Eksik alan ile boş alanın karışması]
Kullanıcı profil kartı hazırlıyorsun. Backend bazı kullanıcılarda `bio` alanını hiç göndermiyor (`undefined`), bazılarında ise boş metin (`""`) gönderiyor. Tipi `bio?: string` diye yazdın. Bir süre sonra sunucunun profil fotoğrafı için `avatar_url: null` gönderdiğini gördün. Kodun `avatar_url.startsWith('http')` satırına geldiğinde tarayıcı patladı. Çünkü alanın hiç var olmaması ile alanın `null` değer taşıması iki tamamen farklı durumdur.
:::

## Gerçek dünyada nesnelerin anatomisi

JavaScript uygulamalarının bel kemiği nesnelerdir. API'den gelen veriler, React bileşenlerine iletilen props'lar ve uygulama içi durumlar nesne olarak taşınır. TypeScript'te bir nesnenin şeklini tanımlamak, o nesnenin hangi özelliklere (property) sahip olduğunu ve bu özelliklerin hangi türde değerler taşıyabileceğini önceden ilan etmektir.

Nesne tiplerini tarif etmek için iki temel aracımız vardır: `type` takma adı ve `interface` arayüzü.

```ts check
// 1. type ile nesne şekli tanımlama
type UserBadge = {
  readonly id: number
  username: string
  avatar_url: string | null
  bio?: string
}

// 2. interface ile nesne sözleşmesi tanımlama
interface UserProfile {
  readonly id: number
  username: string
  avatar_url: string | null
  bio?: string
}

const activeUser: UserProfile = {
  id: 101,
  username: 'deniz_yildiz',
  avatar_url: null,
}
void activeUser
```

Bu örnekte yer alan her bir belirtecin çok kesin bir teknik anlamı vardır:

1. `readonly id: number`: `id` alanı bir kez atandıktan sonra TypeScript kod içinde `user.id = 202` gibi yeni bir atama yapılmasına izin vermez. Ancak dikkat: Bu kısıt yalnızca derleme anında geçerlidir; nesneyi çalışma zamanında `Object.freeze()` gibi dondurmaz.
2. `avatar_url: string | null`: Bu alan nesnede **mutlaka bulunmalıdır**, ancak değeri bir metin de olabilir, `null` da olabilir.
3. `bio?: string`: Soru işareti (`?`), bu özelliğin **opsiyonel** olduğunu söyler. Yani nesne oluşturulurken `bio` alanı hiç verilmeyebilir. Bu durumda değeri `undefined` olur.

## Opsiyonel alan (`?`) ile Null olabilen alan (`| null`) farkı

TypeScript'te en çok karıştırılan konulardan biri "alanın yokluğu" ile "alanın boş bir değere sahip olması" arasındaki ayrımdır. Bu iki kavram aynı değildir ve API sözleşmelerinde farklı modellenir:

| Durum | JSON Çıktısı | Doğru TypeScript Tipi | Açıklama |
| --- | --- | --- | --- |
| **Alanın Yokluğu** | `{ "username": "ali" }` | `bio?: string` | `bio` anahtarı nesnede hiç yoktur; okunduğunda `undefined` döner. |
| **Boş Değer (Null)** | `{ "username": "ali", "avatar_url": null }` | `avatar_url: string \| null` | Anahtar nesnede mevcuttur ancak değeri açıkça `null` yapılmıştır. |
| **Boş Metin** | `{ "username": "ali", "website": "" }` | `website: string` | Anahtar vardır ve geçerli bir metin taşır; metnin uzunluğu `0`'dır. |

Bir alana `avatar_url?: string` yazarsan, TypeScript derleyicisi bu alanın `undefined` gelebileceğini düşünür ama `null` değerini kabul etmez. Sunucu `{ "avatar_url": null }` gönderdiğinde tip denetimi uyuşmazlığı doğar. Bu yüzden veri modelini tasarlarken API'nin gerçekte ne gönderdiğini dikkatle incelemelisin.

## Yapısal tipleme (Structural Typing): Şekil uyumu

TypeScript, Java veya C#'taki gibi isim bazlı (nominal) değil, **yapısal (structural / duck typing)** bir tip sistemi kullanır. Yani bir nesnenin bir tipi karşılaması için o tiple açıkça etiketlenmiş olması gerekmez; nesnenin aranan özellikleri taşıması yeterlidir.

Bunu bir adım adım izleme örneğiyle görelim:

```ts check
interface SimpleUser {
  id: number
  username: string
}

function printWelcome(user: SimpleUser): string {
  return `Hoş geldin ${user.username} (#${user.id})`
}

// Tam kapsamlı detaylı kullanıcı nesnesi:
const fullAccount = {
  id: 42,
  username: 'selin',
  email: 'selin@example.com',
  registeredAt: '2026-01-15',
  themePreference: 'dark',
}

// fullAccount içinde fazladan alanlar var, ama SimpleUser sözleşmesini (id ve username) eksiksiz karşılıyor!
const message = printWelcome(fullAccount)
void message
```

`printWelcome` fonksiyonu yalnızca `id` ve `username` alanlarına ihtiyaç duyar. Fonksiyona verilen nesnede fazladan alanların bulunması bir sorun teşkil etmez; TypeScript nesnenin yapısının sözleşmeyi karşıladığını görür ve geçişe izin verir.

## `type` mı yoksa `interface` mi?

Hem `type` hem de `interface` nesne tiplerini modelleyebilir. Peki hangisini ne zaman seçmelisin?

1. **`interface`:** Nesne şekillerini tanımlamak ve özellikle nesneleri birbirine genişletmek (`extends`) için son derece okunaklıdır. Veri modellerinde ve nesne sözleşmelerinde tercih edilir:
   ```ts check
   interface BaseEntity {
     id: number
     createdAt: string
   }

   interface Product extends BaseEntity {
     title: string
     price: number
   }
   ```
2. **`type`:** Çok daha esnektir. Yalnızca nesneleri değil; ilkel tipleri, fonksiyon imzalarını, tuple'ları ve sonraki derslerde göreceğimiz `union` (`'light' | 'dark'`) birleşimlerini tanımlayabilir.

Birbirlerinin yerine kullanılabilirler; ancak kural olarak saf veri nesnelerinde `interface`, birleşim ve takma adlarda `type` kullanmak sektörde yaygın bir teamüldür.

## Bir nesne tipini derleyicide izleyelim

TypeScript'in nesne tipi, JavaScript nesnesine çalışma anında etiket yapıştırmaz. Fonksiyonun beklediği şekli tanımlar ve çağrı noktasındaki değerle bu şekli karşılaştırır. Her alan için iki ayrı soru sor: alan zorunlu mu, değer hangi tiplerde olabilir? Bu iki eksen birbirinden bağımsızdır.

| Bildirim | Anahtar var mı? | Okuma sonucu | Örnek |
|---|---|---|---|
| bio: string | zorunlu | string | bio: '' |
| bio?: string | isteğe bağlı | string veya undefined | anahtar yok |
| photo: string \| null | zorunlu | string veya null | photo: null |
| photo?: string \| null | isteğe bağlı | string, null veya undefined | her iki yokluk biçimi |

Bu ayrım bir API cevabını TypeScript'e aktarırken önemlidir: JSON null değerini taşır ama undefined değerini JSON metnine yazamaz. Eksik anahtarın anlamı ile açık null işareti farklı sözleşmelerdir. Ayrıca null güvenli erişim, eksik alan kontrolünden sonra gelir: if (user.photo !== null) kontrolü, photo opsiyonelse undefined durumunu tek başına çözmez.

Yapısal tiplemede değişken üzerinden gelen daha geniş bir nesne, ihtiyaç duyulan alanları taşıyorsa parametreye verilebilir. Fakat nesne literali doğrudan fonksiyon çağrısına yazıldığında fazladan alan kontrolü yazım hatalarını yakalamak için daha sıkıdır. Bu bir çelişki değildir: kontrolün amacı literal üzerindeki muhtemel yanlış alan adını erken bulmaktır. Tiple uyumu gerçek veri doğrulaması da değildir; dış JSON'u uygulamaya almadan önce çalışma zamanında doğrulamalısın.

readonly da benzer biçimde statik bir kısıttır. Tipi okuyan kod atamayı derlemede reddeder, ancak başka JavaScript kodunun nesneyi değiştirmesini durdurmaz. interface extends ortak nesne sözleşmesine alan ekler; union gerektiğinde type kullanılır. İkisi de React props şekli tanımlayabilir.

:::mistake[Opsiyonel alanı null ile kontrol etmek]
**Belirti:** photo null değil diye içeri giriliyor ama photo undefined olduğundan erişim patlıyor. **Neden:** Opsiyonel alan hem null hem undefined olabilir. **Düzeltme:** Alanın isteğe bağlılığını ve izin verilen değerlerini ayrı ifade et; gerekirse null ve undefined durumlarını ikisini de daralt.
:::

## Sınır durumları ve sık yapılan hatalar

:::mistake[JSON'daki her boş alanı opsiyonel (?) yapmak]
- **Belirti:** `user.bio.trim()` kodunda `TypeError: Cannot read properties of undefined` hatası.
- **Neden:** Backend verisinde `bio: ""` (boş string) geliyorken tipi `bio?: string` tanımlamak. Bu durumda kod alanı eksik sanabilir veya tam tersi, `bio: null` geldiğinde TypeScript'in tip kontrolü bunu fark edemez.
- **Düzeltme:** Gerçek JSON yanıtını incele: Alan anahtarı her zaman geliyorsa `?` koyma; `null` gelebiliyorsa açıkça `string | null` yaz.
:::

:::mistake[readonly ifadesini runtime güvenliği sanmak]
- **Belirti:** `readonly id` olarak tanımlanan bir nesnenin dışarıdan gelen bir JavaScript kütüphanesi tarafından değiştirilip hatanın fark edilmemesi.
- **Neden:** `readonly` yalnızca TypeScript derleyicisini uyarır. Üretilen JavaScript kodunda `readonly` kelimesi silinir; nesne dondurulmuş (`freeze`) değildir.
- **Düzeltme:** Çalışma zamanında mutasyona karşı tam garanti gerekiyorsa nesneyi `Object.freeze()` ile dondur veya kopyalayarak güncelle.
:::

:::mistake[Nesne literali atamasında fazlalık alan hatası (excess property check)]
- **Belirti:** Doğrudan fonksiyon içine süslü parantezle nesne geçerken `Object literal may only specify known properties` hatası almak.
- **Neden:** TypeScript doğrudan tanımlanan nesne literallerinde (değişkene atanmadan verilen) yazım hatalarını yakalamak için fazlalık kontrolü uygular.
- **Düzeltme:** Nesneyi önce bir değişkene ata veya fonksiyona yalnızca arayüzün beklediği alanları ilet.
:::

:::sector[Sektörde nasıl uygulanır?]
Büyük ölçekli ekiplerde API sözleşmeleri genellikle OpenAPI / Swagger şemalarından otomatik olarak TypeScript `interface`'lerine dönüştürülür. Bu sayede backend ekibi bir alanı `null` yapılabilir hale getirdiğinde frontend projesindeki `pnpm typecheck` adımı anında kırmızıya döner.

Ekipler nesne modellerinde gereksiz devasa tipler taşımak yerine, bileşenlerin yalnızca ihtiyaç duydukları alanları isteyen küçük arayüzler (Interface Segregation prensibi) tanımlamasını kurala bağlar.
:::

## Özet

- Nesne tipleri `type` veya `interface` kullanılarak tanımlanır.
- `readonly` belirteci derleme zamanında alanın yeniden atanmasını engeller.
- `bio?: string` alanın hiç bulunmayabileceğini (`undefined`), `avatar: string | null` ise alanın var olup `null` değer taşıyabileceğini anlatır.
- TypeScript yapısal tipleme (structural typing) kullanır; aranan alanları taşıyan daha geniş nesneler sözleşmeyi sağlar.
- `interface`, `extends` sözcüğü ile başka nesne sözleşmelerini genişletebilir.

### Kendini yokla

**Soru 1:** Bir API cevabında `website` anahtarı her zaman var ancak kullanıcı web sitesi girmediğinde değeri `null` geliyor. Bu alanı `website?: string` olarak modellemek neden yanlıştır?  
*Cevap:* Çünkü `?` işareti alanın nesnede hiç bulunmayabileceğini (`undefined`) söyler. Oysa anahtar nesnede mevcuttur ve değeri `null`'dır. Doğru modelleme `website: string | null` olmalıdır.

**Soru 2:** `interface SimpleProduct { id: number; name: string }` bekleyen bir fonksiyona `id`, `name`, `price` ve `stock` alanlarına sahip bir `fullProduct` değişkeni aktarılabilir mi?  
*Cevap:* Evet. TypeScript yapısal tipleme kullandığından, `fullProduct` nesnesi `SimpleProduct` için aranan `id` ve `name` alanlarına sahip olduğu sürece fazladan alanlar taşıması fonksiyona iletilmesini engellemez.
