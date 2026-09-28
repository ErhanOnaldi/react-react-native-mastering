---
title: "Paylaşılan async işlemin durumu"
minutes: 14
kind: concept
---

# Paylaşılan async işlemin durumu

:::pain[Sinema’da sorun]
Kullanıcı bir raporu dışa aktarırken düğme “gönderiliyor” göstermeli; tamamlanınca indirme adresi, hata olunca açıklama görünmeli. İşlem birden fazla ekranda izleniyor. Her component kendi `pending` state’ini tutarsa aynı işlem için üç ayrı durum oluşuyor. Öte yandan TMDB film detayını da bir thunk’a taşımak Query cache’ini ikinci kez kurmak demek.
:::

## Async thunk hangi işi anlatır?

Async thunk bir uygulama işleminin başla/başarılı/başarısız geçişlerini Redux action’larına dönüştürür. `createAsyncThunk` payload creator’ı çağırır ve otomatik `pending`, `fulfilled`, `rejected` action türleri üretir. Bir slice bu action’ları `extraReducers` içinde dinleyip ortak işlem state’ini güncelleyebilir.

:::model[Server ve client state sahipliği]
Sunucu verisinin cache, tazelik ve tekrar çekme sahibi Query’dir; kullanıcıya ait ortak işlem veya tercih Redux’ta tutulabilir. Async olması tek başına veriyi store’a taşımak için gerekçe değildir. Bu derste yeni bağlam, Query’nin yönetmediği uygulama işleminin yaşam döngüsünü action’larla görünür kılmaktır.
:::

![Server state ve client state sahipliğinin ayrımını gösteren diyagram](diagram:state-kategorileri)

1. **İşlemi başlatan payload creator’dır.** Parametre alır; Promise döndürebilir.
2. **Pending hemen dispatch edilir.** UI bekleme durumunu ortak store’dan okuyabilir.
3. **Promise çözülürse fulfilled gelir.** Dönen değer action payload’ı olur.
4. **Promise reddedilirse rejected gelir.** Hata bilgisi action’da bulunur; kullanıcıya gösterilecek metni kontrollü belirle.
5. **Reducer yalnız lifecycle state’i günceller.** Ağ çağrısı payload creator’da; state geçişi reducer’da kalır.
6. **İşlem sonucu server cache değildir.** Bir API kaynağını cache, retry, pagination ve invalidation ile yönetmek gerekiyorsa Query’nin sahipliği korunur.

`createAsyncThunk` işlemin kendisini başlatır, ama bütün asenkron mimariyi senin yerine çözmez. Aynı işlemin iki kez başlamasını engelleme, iptal, hata mesajı ve eski sonuçları ele alma gereksinimini ayrıca tasarlarsın. `thunkAPI.signal`, payload creator içinde iptal edilebilir `fetch` çağrısına bağlanabilir.

## Üç aşamayı zaman içinde izle

Bir masaüstü dış servisine rapor listesi gönderildiğini düşün. `sendReport` pending action’ı oluşturur; Promise sonunda servis kayıt numarası döndürür.

| Zaman | Action | Store durumu | UI mesajı |
| --- | --- | --- | --- |
| Kullanıcı tıklar | `sendReport.pending` | `status: 'pending'` | “Gönderiliyor…” |
| Cevap başarılı | `sendReport.fulfilled` | `status: 'fulfilled'`, `receipt: 'R-42'` | “R-42 alındı” |
| Cevap hatalı | `sendReport.rejected` | `status: 'rejected'`, `error: ...` | “Gönderilemedi” |

Pending state’i aynı action’ı izleyen bütün bileşenler okuyabilir. Başarı sonucu yalnız bir sayfada gösterilecekse global store’a koymak yerine yerel state daha basit olabilir. Paylaşım ihtiyacı işlemin hangi owner’da yaşaması gerektiğini belirler.

## `createAsyncThunk` ile lifecycle

```ts check
import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type Receipt = { id: string }
type DeliveryState = { status: 'idle' | 'pending' | 'fulfilled' | 'rejected'; receipt: Receipt | null }

export const sendDigest = createAsyncThunk<Receipt, string>(
  'delivery/sendDigest',
  async (message) => {
    const response = await fetch('/api/digest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return (await response.json()) as Receipt
  },
)

const deliverySlice = createSlice({
  name: 'delivery',
  initialState: { status: 'idle', receipt: null } as DeliveryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendDigest.pending, (state) => { state.status = 'pending' })
      .addCase(sendDigest.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.receipt = action.payload
      })
      .addCase(sendDigest.rejected, (state) => { state.status = 'rejected' })
  },
})

export const store = configureStore({ reducer: { delivery: deliverySlice.reducer } })
```

HTTP 500 yanıtı `fetch` Promise’ini otomatik reddetmez. `response.ok` kontrolü yapılmazsa thunk fulfilled olabilir ve hata cevabı başarı gibi işlenir. Bu, HTTP modülünde öğrendiğin istek/cevap ayrımının Redux işlemine taşınmasıdır. Dış servis yoksa saf bir async payload creator da Promise ile lifecycle’ı gösterebilir; ama gerçek çağrıda status ve gövdeyi ayrıca ele al.

İkinci bir dispatch aynı anda gelebilir. `createAsyncThunk` her çağrı için `meta.requestId` üretir. Eski isteğin geç gelen cevabının yenisini ezmesini engellemek gerekiyorsa reducer’da aktif request id’yi takip et veya payload creator’daki abort signal’ını kullan. Basit tek işlemde bu mekanizmayı eklemek gereksiz karmaşıklıktır; race ihtiyacını belirtiyle doğrula.

## `createSlice` ile birlikte `create.asyncThunk`

RTK ayrıca thunk lifecycle’ını slice tanımında bir araya getirmek için `buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })` API’sini sunar. Bu biçim `createSlice`’ın standart export’unda doğrudan aktif değildir; özel `createAppSlice` kurulumunu gerektirir. `reducers: (create) => ({ ... })` callback’i içinde `create.asyncThunk` ve `pending`/`fulfilled`/`rejected` callback’leri tanımlarsın.

İki biçimin de lifecycle action’ları aynı kavramı taşır. Kod tabanında mevcut standardı izle; sırf daha kısa görünüyor diye iki yaklaşımı aynı özellikte karıştırma. TypeScript’te thunk’ın argüman ve dönüş tiplerini açık yazmak çoğu kez çıkarımı güçlendirir.

### Hata bilgisini bilinçli taşı

Bir payload creator normal `Error` fırlatırsa rejected action’da `action.error` bulunur. Bu alan serileştirilebilir, fakat uygulamanın kullanıcıya göstereceği API hata gövdesinin tamamını taşımayabilir. Bir domain hatasını state’e koyman gerekiyorsa `rejectWithValue` ile kontrollü ve tipli bir payload döndürebilirsin. Reducer’da `action.payload` olup olmadığını ayır; `action.error.message` her zaman kullanıcıya uygun metin değildir.

Örneğin sunucu “ürün artık teslim edilemiyor” gibi beklenen bir iş hatası döndürürse bu, beklenmedik programlama exception’ından farklıdır. Beklenen hata için payload union veya `rejectWithValue` UI’ye anlaşılır mesaj verir. Beklenmedik hata ise loglanabilir ve genel bir hata mesajına çevrilebilir. Ham response nesnesini store’a koyma; Response body tüketilebilir ve JSON dışı değerler serializable değildir.

### Aynı işin iki kez başlaması

Async thunk her dispatch çağrısında yeni bir request id üretir. Kullanıcı aynı düğmeye hızlıca iki kez basarsa iki işlem başlar; bu davranışı `condition` callback’iyle başlamadan engelleyebilir veya component’te pending sırasında düğmeyi devre dışı bırakabilirsin. Hangi katmanın doğru olduğu ürün davranışına bağlıdır: aynı raporun iki kez gönderilmesi tehlikeliyse yalnız UI kilidi yeterli olmayabilir; server idempotency anahtarı gerekebilir.

İptal ve stale cevap da ayrı sorunlardır. Sayfa kapanınca devam etmemesi gereken işte dispatch promise’inin `abort()` metodu ve `thunkAPI.signal` kullanılabilir. Yeni istek eski isteği geçersiz kılıyorsa reducer aktif `requestId` değerini kontrol ederek eski cevabı yoksayabilir. Bu mekanizmaları her thunk’a eklemek yerine kullanıcıya görünen race veya çift gönderim riski varsa uygula.

### İşlem sonucu ile kaynağın sonucu

İşlemin fulfilled olması, uygulamadaki tüm server state’in güncel olduğu anlamına gelmez. Bir dışa aktarma başarılı olabilir ama katalog Query cache’i değişmemiştir. İşlem bir sunucu kaynağını değiştiriyorsa başarılı sonuçtan sonra ilgili Query key’ini invalidate et veya dönen kaynak verisini cache’e yaz. Bu, iki cache kurmadan mutation sonucunu mevcut server state sahibine duyurur.

`createAsyncThunk` ayrıca dispatch edilen thunk’ın promise’ini döndürür. Bu promise genellikle lifecycle action’ı ile tamamlanır; `unwrap()` kullanırsan fulfilled payload’ı alabilir veya rejected hatayı throw olarak yakalayabilirsin. UI event handler içinde bu davranışla işlem sonrası gezinme ya da toast göstermek mümkündür. Aynı sonucu store’da da tutuyorsan tek kullanım yerini seç; aksi halde component state’i ile Redux state’i tekrar ayrışabilir.

## Sınır durumları

:::mistake[Belirti → HTTP hata cevabı başarılı görünüyor]
Belirti → Sunucu 500 döndürdü ama store `fulfilled` oldu.  
Neden → `fetch` yalnız ağ hatalarında reject olur; 4xx/5xx status’u kontrol edilmedi.  
Düzeltme → `response.ok` kontrol et ve uygun hata yolu için throw et veya açık bir result union döndür.
:::

:::mistake[Belirti → TMDB verisi iki yerde farklı]
Belirti → Query yenilenmiş ama thunk reducer’ındaki film listesi eski.  
Neden → Server state iki bağımsız cache’te tutuluyor.  
Düzeltme → TMDB sorgu/cache yaşam döngüsünü Query’de bırak; thunk’ı Query’nin yönetmediği uygulama işlemi için kullan.
:::

:::mistake[Belirti → Hata durumunda önceki başarı bilgisi yanlış gösteriliyor]
Belirti → Yeni istek reddedildi ama eski makbuz “güncel” gibi duruyor.  
Neden → Rejected geçişi `status` veya ilgili sonucu temizlememiş.  
Düzeltme → Lifecycle state’inin her geçişte hangi alanları koruyup hangilerini sıfırladığını açıkça tanımla.
:::

:::mistake[Belirti → Ekran kapansa da istek sürüyor]
Belirti → Kullanıcı başka sayfaya geçti, eski işlem hâlâ çalışıyor.  
Neden → İptal edilebilir işte thunk signal’ı isteğe aktarılmamış.  
Düzeltme → İptal gereksinimi varsa `thunkAPI.signal` ile `fetch` çağrısını bağla; her işlemde iptal desteği varsayma.
:::

:::sector
Async thunk; rapor gönderme, dışa aktarma veya birden fazla ekranda görülen kullanıcı işlemi gibi Redux action akışında izlenmesi gereken işlerde değerlidir. Server state’i Query ile yönetiyorsan thunk’ı endpoint cache’ine dönüştürme. Ekipler işlem state’ini `idle/pending/fulfilled/rejected` gibi açık bir union’la tutup loading ve hata görünümünü bu geçişlere bağlar.
:::

## Özet

- `createAsyncThunk` payload creator çalıştırır, pending/fulfilled/rejected action’ları üretir.
- Slice bu lifecycle’ı `extraReducers` ile ortak state’e yansıtır.
- `fetch` 4xx/5xx’te reject olmaz; `response.ok` kontrolü gerekir.
- Sunucu cache ihtiyacı Query’ye, paylaşılan uygulama işlemi lifecycle’ı Redux’a ait olabilir.
- RTK’nin `create.asyncThunk` kullanımı `buildCreateSlice` ile özel kurulum gerektirir.

**Kendini yokla:** Bir thunk Promise’i çözüldüğünde dönüş değeri hangi action’a gider?  
*Cevap:* `fulfilled` action’ın payload’ına.

**Kendini yokla:** Bir endpoint’in cevabını sırf async olduğu için Redux’a taşır mısın?  
*Cevap:* Hayır; cache ve yenileme yaşam döngüsünü hangi aracın yönettiğine göre karar verirsin.
