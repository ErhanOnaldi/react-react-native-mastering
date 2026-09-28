---
title: "Eser detayı ve okuma listesi"
minutes: 12
kind: project
---

# Eser detayı ve okuma listesi

:::pain[Problem]
Kullanıcı bir kitabı okudum olarak işaretleyip 5 puan veriyor. Listeye ekle butonuna bastığında arayüzde hiçbir şey değişmiyor; sayfayı yenilediğinde menüdeki sayaç 1 artıyor ama liste sayfasına gittiğinde boş bir ekran çıkıyor. Bir başka gün ise kullanıcı tarayıcı geçmişini temizlerken yanlışlıkla `localStorage`'ı sildiğinde uygulama beyaz ekrana çöküyor: `Uncaught SyntaxError: Unexpected end of JSON input`.

Bu karmaşanın sebebi, form doğrulama mantığı ile kalıcı istemci durumunun birbirine plansız bağlanması ve yerel depolama sınırında hiçbir doğrulama kalkanının bulunmamasıdır.
:::

Bu derste iki önemli kullanıcı akışını birleştiriyorsun: bir yandan asenkron detay ve bağımlı yazar verisini ekrana taşırken, diğer yandan React Hook Form, Zod ve güvenli yerel depolama ile sağlam bir kişisel okuma listesi inşa ediyorsun.

## Form, İstemci Durumu ve Kalıcılık Zihinsel Modeli

Bu özellik, formun geçici dünyası ile uygulamanın kalıcı hafızası arasındaki köprüdür:

:::model[Form state]
Form içindeki değerler (durum seçimi, puan, not taslağı) kullanıcı "Kaydet" veya "Listeye ekle" butonuna basana kadar geçicidir. Bu taslak veriyi her tuş vuruşunda global depoya veya URL'e yazmak gereksiz render fırtınası koparır. Form state'i form içinde izole kalır; doğrulama geçtikten sonra istemci deposuna aktarılır.
:::

:::model[Zod sınır doğrulaması]
Tarayıcının `localStorage` deposu dış dünyadır. Kullanıcı DevTools üzerinden değeri silebilir, değiştirebilir ya da eski bir uygulama sürümünden kalma bozuk JSON bulunabilir. Depodan okuma anında `JSON.parse` güvenli bir `try/catch` içine alınmalı ve Zod şemasıyla kontrol edilmelidir.
:::

![Form doğrulama ve yerel depolamaya güvenli kayıt akışı](diagram:form-state)

Bu mimariyi şu temel kurallarla yönetirsin:

1. **Bağımlı istekleri zincirleme yönet:** Eser kaydı gelmeden yazar kimliği bilinemez. Eser cevabını bekle, yazar anahtarını çıkar ve ikinci isteği ancak anahtar varsa tetikle (`enabled: Boolean(authorKey)`).
2. **Kısmi hatalarda ekranı koru:** Yazar isteği 404 dönse veya ağda kopsa bile ana eser başlığını ve açıklamasını gizleme; arıza alanında "Yazar bilinmiyor" güvenli yer tutucusunu göster.
3. **Koşullu form alanlarını şemada doğrula:** Bir alan (örneğin Puan) yalnızca belirli bir durumda (örneğin "Okudum") görünüyorsa, doğrulama kuralı da bu koşula bağlanmalıdır (`zod.refine` veya `superRefine`).
4. **Depodan okurken hata kalkanı kur:** `localStorage.getItem` sonucu `null` dönerse veya Zod doğrulaması başarısız olursa uygulama çökmek yerine sessizce varsayılan boş listeye (`[]`) dönmelidir.

## Formdan depolamaya adım adım iz sürme

Bir film günlüğü uygulamasında (`CinemaLog`) kullanıcının filmi izleme listesine ekleme adımlarını izleyelim:

| Adım | Kullanıcı eylemi | Form durumu | Doğrulama (Zod) | İstemci Deposu | Depolama (`localStorage`) |
| --- | --- | --- | --- | --- | --- |
| 1 | Detay sayfası açılır | `status: "plan"` | Beklemede | Boş liste (`[]`) | `[]` |
| 2 | "İzlendi" seçer | `status: "watched"` | Puan alanı zorunlu hale gelir | Değişmez | `[]` |
| 3 | Puan seçmeden "Kaydet" basar | Hata | ❌ "1–5 arası puan verin" hatası | Değişmez (yazılmaz) | `[]` |
| 4 | Puana 4 seçer ve basar | Başarılı | ✅ Geçerli veri modeli | `[{ id, status, rating: 4 }]` | `JSON.stringify` ile kaydedilir |
| 5 | Başka sayfaya geçer | Form sıfırlanır | — | Listedeki eleman sayısı: 1 | Menüdeki sayaç `(1)` gösterir |

## Kod örnekleri: Güvenli yerel depolama ve koşullu şema

### Kırık örnek: Korumasız depolama ve kontrolsüz parse

Aşağıdaki fonksiyon depodaki en ufak bir veri kirliliğinde tüm uygulamayı çökertir:

```ts
// TEHLİKE: Depolama verisi doğrulanmamış
export function getBrokenStoredItems() {
  const raw = localStorage.getItem('user:items')
  // HATA: raw null veya bozuk JSON ise JSON.parse doğrudan fırlatır!
  const items = JSON.parse(raw!)
  // HATA: items dizi değilse items.length patlar!
  return items
}
```

### Doğru örnek: Zod şemalı güvenli depolama yöneticisi

Kayıtları hem JSON hatasına hem de şema uyumsuzluğuna karşı koruyalım:

```ts check
import { z } from 'zod'

export const StoredEntrySchema = z.object({
  id: z.string(),
  status: z.enum(['want', 'reading', 'read']),
  rating: z.number().int().min(1).max(5).nullish(),
  note: z.string().max(280).default(''),
})

export const StoredListSchema = z.array(StoredEntrySchema)

export type StoredEntry = z.infer<typeof StoredEntrySchema>

export function loadStoredEntries(storageKey: string): StoredEntry[] {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return []

    const parsedJson: unknown = JSON.parse(raw)
    const result = StoredListSchema.safeParse(parsedJson)

    if (!result.success) {
      // Şema uyuşmuyorsa veya veri bozulmuşsa temiz bir boş listeyle başla
      return []
    }

    return result.data
  } catch {
    // JSON parse hatası durumunda uygulamayı koru
    return []
  }
}
```

Bu fonksiyon sayesinde:
- Kullanıcı tarayıcı konsolundan anahtara rastgele geçersiz bir metin yazsa bile `JSON.parse` hatası yakalanır.
- Eski bir sürümden kalan uyumsuz bir nesne varsa `safeParse` başarısız olur ve uygulama güvenle boş liste ile ayağa kalkar.

## Sık karşılaşılan hatalar

:::mistake[Bağımlı istek başarısız olduğunda tüm ekranı hataya boğmak]
**Belirti:** Bir kitabın yazar bilgisi 404 verdiğinde eser detay sayfasının tamamen beyaz ekrana düşüp "Hata oluştu" uyarısı vermesi.  
**Neden:** Yazar sorgusu eser sorgusuyla aynı hata sınırına bağlanmış ve yazar hatası tüm sayfayı durduracak şekilde ele alınmıştır.  
**Düzeltme:** Yazar isteğini esere ikincil kabul et; yazar hatası durumunda ekranı koruyarak yazar alanına "Yazar bilinmiyor" yazdır.
:::

:::mistake[Menüdeki sayaç için ayrı bir count state'i tutmak]
**Belirti:** Kullanıcı bir kitabı listeden sildiğinde liste sayfasında kitap kaybolurken üst menüdeki sayacın eski sayıyı göstermeye devam etmesi.  
**Neden:** Sayaç için ayrı bir `useState(0)` açılmış ve liste güncellemesinde sayaç artırımı/azaltımı unutulmuştur.  
**Düzeltme:** Ayrı sayaç state'ini tamamen kaldır; mevcut liste dizisinin uzunluğundan (`list.length`) doğrudan türet.
:::

:::sector[Sektörde formlar ve yerel depolama dayanıklılığı]
Sektördeki en zorlayıcı hata türleri "müşterinin tarayıcısında oluşan ama yazılımcının makinesinde tekrarlanamayan" durumlardır. Bu hataların yüzde sekseni yerel depolama uyumsuzluklarından (eski şema kalıntıları) kaynaklanır. Büyük ekipler bu sebeple `localStorage` işlemlerini daima katı Zod şemalarıyla korur ve bozuk veriyi sessizce temizleyip güvenli varsayılana döner.
:::

## Özet

- Detay sayfasında bağımlı istekler (yazar verisi) eserin varlığına bağlanmalı; yazar hataları ana eseri çökertmemelidir.
- Form durumu doğrulama tamamlanana kadar form içinde izole kalmalı; onaylandıktan sonra paylaşılan depoya yazılmalıdır.
- Koşullu doğrulama (yalnızca "Okudum" seçildiğinde puan zorunluluğu) Zod şeması üzerinde `refine` ile yönetilir.
- `localStorage` sınırında Zod doğrulaması ve `try/catch` kalkanı kullanılarak bozuk JSON kaynaklı çökmeler önlenir.

### Kendini yokla

1. **Soru:** Bir eserin açıklaması (`description`) hem düz metin hem `{ type: string, value: string }` nesnesi olarak geliyorsa bu veriyi bileşene ulaşmadan önce nasıl ele almalıyız?  
   **Cevap:** API sınırında bir Zod şeması veya normalizasyon fonksiyonu yazarak `typeof desc === 'string' ? desc : desc?.value ?? 'Açıklama yok.'` mantığıyla tek bir temiz string tipine dönüştürmeliyiz.
2. **Soru:** Kullanıcının okuma listesini `localStorage`'da saklamak neden bir kullanıcı hesabı veya bulut veritabanı yerine geçmez?  
   **Cevap:** Çünkü `localStorage` yalnızca o anki tarayıcıya ve cihaza özgüdür. Kullanıcı telefonundan veya gizli sekmeden girdiğinde listesini göremez; tarayıcı verilerini temizlediğinde kayıtları silinir.
