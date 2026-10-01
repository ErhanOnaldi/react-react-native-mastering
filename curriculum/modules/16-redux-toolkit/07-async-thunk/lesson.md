---
title: "Paylaşılan async işlemin durumu"
minutes: 18
kind: concept
---

# Paylaşılan async işlemin durumu

Sinema’da bir kullanıcı izleme listesini dışa aktarmak istediğinde ekranda önce “Hazırlanıyor…”, sonra indirme bağlantısı ya da bir hata görünür. Bu bilgi yalnızca tek bir düğmenin içinde kalmayabilir: başka bir ekran da aynı işlemin sürüp sürmediğini gösterebilir. Redux Toolkit’te bunun için `createAsyncThunk` kullanabiliriz.

Bir **thunk**, dispatch edilebilen ve çalışırken başka action’lar gönderebilen fonksiyondur. `createAsyncThunk`, böyle bir fonksiyonun bekleme, başarı ve hata anlarını action’lara dönüştürür. Asenkron olması tek başına bir API cevabını Redux’a koyma nedeni değildir; TMDB verisinin cache ve yenileme sahibi Query olmaya devam eder. Burada ele aldığımız şey Query’nin yönetmediği, birden fazla yerde görülen uygulama işlemidir.

![Server, client, URL ve form durumlarının sahiplerini gösteren diyagram](diagram:state-kategorileri)

## Önce tek bir asenkron işi düşün

JavaScript’te `Promise`, sonucu hemen hazır olmayan bir işin daha sonra tamamlanacağını anlatır. `async` fonksiyon bir Promise döndürür. Aşağıdaki küçük örnek, henüz Redux’a girmeden, bir rapor hazırlama işinin sonucunu gösteriyor:

```ts check
async function prepareReport(movieIds: number[]) {
  return movieIds.map((id) => id)
}

const report = await prepareReport([550, 603])
void report
```

Fonksiyon aldığı ID’lerden yeni bir dizi üretir; Promise tamamlanınca o dizi sonuç olur. `map` burada diziyi yerinde değiştirmez. Böylece girdiyi saklayan başka bir ekran, bu işlem çalıştı diye elindeki dizinin değiştiğini görmez.

Şimdi aynı işi Redux tarafından başlatılabilir hale getirelim. `payload creator`, `createAsyncThunk` içine verdiğimiz ve asıl işi yapan fonksiyondur. `createAsyncThunk` ona bir ad verir ve çalıştırıldığında otomatik olarak `pending`, `fulfilled` ya da `rejected` action üretir:

```ts check
import { createAsyncThunk } from '@reduxjs/toolkit'

const prepareReport = createAsyncThunk(
  'reports/prepare',
  async (movieIds: number[]) => movieIds.map((id) => id),
)
void prepareReport
```

Burada thunk henüz çağrılmadı; yalnızca nasıl çalışacağını tanımladık. İleride `dispatch(prepareReport([550, 603]))` dediğimizde action akışı başlar. Başarıyla bitince payload creator’ın döndürdüğü yeni dizi, action’ın taşıdığı veri olan `payload` olur.

## Üç action, tek işlem

Component’in bekleme metnini göstermesi için işlemin durumunu bir yerde tutmalıyız. **Lifecycle action**, bir işlemin yaşamındaki aşamayı anlatan action’dır. Aşağıda thunk’ı küçük bir slice’a bağlıyoruz; `extraReducers`, slice’ın kendisinin üretmediği action’lara nasıl tepki vereceğini yazar:

```ts check
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const prepareReport = createAsyncThunk(
  'reports/prepare',
  async (ids: number[]) => ids.map((id) => id),
)
const reportSlice = createSlice({
  name: 'reports',
  initialState: { status: 'idle', ids: [] as number[] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(prepareReport.pending, (state) => { state.status = 'pending' })
      .addCase(prepareReport.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.ids = action.payload
      })
      .addCase(prepareReport.rejected, (state) => { state.status = 'rejected' })
  },
})
void reportSlice
```

`pending` bekleme durumunu, `fulfilled` tamamlanan sonucu, `rejected` hatayı gösterir. Reducer yalnızca bu geçişleri state’e yazar; asıl iş payload creator’da kalır. RTK reducer’ında `state.status = ...` gibi mutasyon görünüşlü yazım güvenlidir, çünkü RTK bunu daha önceki derste gördüğün Immer taslağı üzerinden yeni immutable state’e çevirir.

İşlemin sırasını görünür kılalım. `dispatch` çağrısı Promise’in bitmesini beklemeden pending action’ı yollar:

| Zaman | Olan | Store’daki durum | UI ne gösterebilir? |
| --- | --- | --- | --- |
| Kullanıcı işlemi başlatır | `prepareReport` dispatch edilir | Önceki durum | Düğme henüz değişmedi |
| İş hemen başlar | `prepareReport.pending` gelir | `status: 'pending'` | “Hazırlanıyor…” |
| İş başarıyla biter | `prepareReport.fulfilled` gelir | `status: 'fulfilled'`, yeni `ids` | Sonuç hazır |
| İş hata ile biter | `prepareReport.rejected` gelir | `status: 'rejected'` | Hata mesajı |

Başarı ve hata aynı işin iki olası sonudur; bir işlemde ikisi birden gerçekleşmez. Bekleme bilgisi Redux’ta olduğu için onu seçen birden fazla component aynı durumu görebilir. Sonuç yalnızca küçük bir ekranda kullanılacaksa local state daha az parçalı bir çözüm olabilir; önce gerçekten paylaşım gerekip gerekmediğine bak.

## Sinema servisinden cevap al

Biraz daha gerçekçi örnekte izleme listesinin başlığını bir rapor servisine gönderip servis makbuz numarası alalım. `fulfilled` action’ın taşıdığı veri alanı olan `payload` burada servisten dönen makbuz olur.

```ts check
import { createAsyncThunk } from '@reduxjs/toolkit'

type Receipt = { id: string }
const sendWatchlist = createAsyncThunk<Receipt, { title: string }>(
  'reports/sendWatchlist',
  async ({ title }) => {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return (await response.json()) as Receipt
  },
)
void sendWatchlist
```

Bu örnekte HTTP cevabının başarılı olup olmadığını ayrıca kontrol ediyoruz. `fetch` ağ bağlantısı kurulamaması gibi durumlarda Promise’i reddeder, fakat sunucunun 500 yanıtı Promise’i kendi başına reddetmez. `response.ok` kontrol edilmezse hata cevabı yanlışlıkla `fulfilled` akışına girebilir.

`as Receipt`, TypeScript’e cevabın bu biçimde olduğunu söylediğimiz bir **type assertion**’dır; çalışma zamanında JSON’u doğrulamaz. Gerçek uygulamada dış veriyi güvenilir kabul etme: şemayla doğrula ya da burada yalnızca örneği sade tutmak için kullanılan varsayımın sınırını bil. Ham `Response` nesnesini state’e koyma; reducer’ın ihtiyaç duyduğu küçük ve serileştirilebilir sonucu taşı.

İşlem state’iyle server cache’ini de ayrı düşün. Rapor gönderme işlemi başarılı olabilir ama katalogdaki film verisi değişmiş olmayabilir. Eğer API işlemi bir Query kaynağını değiştiriyorsa başarıdan sonra o Query kaynağını yenile; aynı film listesini Redux’ta ikinci cache olarak tutma.

## Gerçek bir hata ve düzeltmesi

Şöyle bir hata yapman kolay:

```ts title="HTTP hata durumunu atlayan kontrol"
const response = await fetch('/api/reports')
return await response.json()
```

Belirti şudur: Network panelinde 500 görürsün ama store `fulfilled` olur ve UI başarı ekranına geçer. Nedeni, `fetch`’in HTTP status kodlarını Promise hatası saymamasıdır. `response.ok` değerini kontrol edip uygun değilse hata fırlatınca thunk `rejected` action üretir; UI da doğru hata durumunu gösterir.

Beklenen iş hatalarıyla beklenmedik programlama hatalarını ayırmak da gerekir. Örneğin servis “rapor hazır değil” diye anlaşılır bir hata döndürebilir. Bu durumda arayüzün göstereceği mesajı kontrollü biçimde state’e taşımak gerekir; her `action.error.message` kullanıcıya gösterilmeye uygun değildir.

## Sık düşülen tuzaklar

:::mistake[Belirti → İkinci istek ilk sonucu eziyor]
Belirti → Kullanıcı iki kez başlattı; önce başlattığı işlem daha geç tamamlanıp ekrandaki yeni sonucu değiştirdi.
Neden → İki dispatch de bağımsız çalıştı ve reducer her ikisinin de sonucunu kabul etti.
Düzeltme → Önce ürün davranışını belirle. Aynı işlemi başlatmayı UI’da engellemek çoğu durumda yeterlidir; eski sonucu yoksayma ihtiyacı varsa aktif isteği ayrıca takip et.
:::

:::mistake[Belirti → Reddedilen yeni işlemde eski başarı hâlâ güncel görünüyor]
Belirti → Yeni rapor başarısız, ama ekranda önceki rapor “hazır” yazıyor.
Neden → Rejected geçişi status’u güncelleyip önceki sonucu nasıl ele alacağını belirlemedi.
Düzeltme → Her lifecycle geçişinde hangi alanların korunacağını ve hangilerinin temizleneceğini açıkça seç.
:::

:::mistake[Belirti → Film bilgisi iki yerde farklı]
Belirti → Query yenilenmiş ama thunk state’indeki film listesi eski kalmış.
Neden → Aynı server state iki ayrı cache’te tutuluyor.
Düzeltme → Query cache’ini tek sahibi olarak bırak; thunk’ı paylaşılan uygulama işlemi için kullan.
:::

## Özet

- `createAsyncThunk` bir işi tanımlar ve başlama, başarı, hata aşamalarını action’lara dönüştürür.
- Payload creator işi yapar; slice `extraReducers` ile lifecycle action’larını ortak state’e yansıtır.
- Reducer state geçişini hesaplar; ağ isteği payload creator’da kalır.
- `fetch` için HTTP status’unu ayrıca denetle; server cache’ini Query’de tut.

**Yeni terimler:**

- **Thunk:** Çalışırken başka action’lar dispatch edebilen fonksiyon.
- **Payload creator:** Async thunk’ın asıl işi yapan fonksiyonu.
- **Lifecycle action:** İşlemin pending, fulfilled veya rejected aşamasını anlatan action.
- **Payload:** Action’ın taşıdığı veri.
- **Type assertion:** TypeScript’e bir değerin tipini söyleyen ifade; runtime doğrulaması yapmaz.

**Kendini yokla:** Payload creator Promise’i çözüldüğünde dönüş değeri hangi action’da bulunur?  
*Cevap:* `fulfilled` action’ın payload’ında.

**Kendini yokla:** Bir endpoint’i sırf async olduğu için Redux cache’ine taşır mısın?  
*Cevap:* Hayır; cache ve yenileme sahibi Query ise orada kalır.

:::info[Derinlemesine (isteğe bağlı)]
Birden fazla eşzamanlı istek varsa RTK’nin `meta.requestId` alanıyla hangi isteğin hâlâ güncel olduğunu izleyebilirsin. İptal edilebilir bir işte `thunkAPI.signal` değerini `fetch`’e aktarabilir, aynı isteği baştan engellemek için `condition` kullanabilirsin. UI’da dispatch sonucunu başarılı payload ya da hata olarak doğrudan almak için `.unwrap()` vardır. Sunucuda aynı isteğin iki kez uygulanmasını önleme ise idempotency problemidir; yalnızca düğmeyi devre dışı bırakmak her zaman yeterli olmaz.

RTK, thunk’ı `createSlice` tanımının içine alan `buildCreateSlice` ve `asyncThunkCreator` API’lerini de sunar. Bu ayrı kurulum gerektirir; projedeki mevcut biçimi izle. Beklenen bir domain hatasını tipli payload olarak döndürmek için `rejectWithValue` kullanılabilir. Bu ayrıntılar temel üç lifecycle action’ını anlamak için gerekli değildir.
:::
