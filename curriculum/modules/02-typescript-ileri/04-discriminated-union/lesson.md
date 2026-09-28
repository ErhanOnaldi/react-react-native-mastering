---
title: "Birbiriyle çelişen durumları modelleme"
minutes: 14
kind: concept
---

# Birbiriyle çelişen durumları modelleme

:::pain[Problem]
Bir rapor ekranında `isLoading = true`, eski `report` nesnesi ve `error = '401'` aynı anda duruyor. Kullanıcı yükleme işaretini görürken eski raporun bir parçası da ekranda kalıyor. Üç değişkenin ayrı setter'ları, bu birleşimin mümkün olup olmadığını anlatmıyor.
:::

## Boolean'ların ürettiği gereksiz olasılıklar

Birbirine bağlı değişkenleri ayrı tutmak, kodun ifade ettiği durum sayısını gereksiz yere büyütür. `loading`, `error` ve `data` üç bağımsız alansa her biri var/yok veya doğru/yanlış gibi kombinasyonlara açılır. Uygulamanın yalnızca “boş”, “yükleniyor”, “başarılı” ve “hatalı” durumları varken bu yapı çok sayıda çelişkili birleşime izin verir.

Discriminated union, geçerli durumların her birini ayrı nesne tipi olarak tanımlar. Her nesnede ortak bir ayırt edici alan (`status`) bulunur. `status` değerini kontrol ettiğinde TypeScript o dalı daraltır ve yalnızca o durumda bulunan alanlara erişmene izin verir.

:::model[Union içinde kontrol akışı]
Önceki modülde union tipini bir olasılık kümesi olarak gördün: `if` veya `switch` kontrolü, o satırda mümkün kalan üyeleri azaltır. Burada her union üyesi ayrı bir işlem durumu. `status` karşılaştırması sadece tipi daraltmaz; hangi verinin var olması gerektiğini de durum sözleşmesine bağlar.
:::

## Dört biçim, dört geçerli durum

![İstek durumlarını gösteren dört ayrı nesne ve success ile error alanları](diagrams/remote-data.svg)

Kesin kurallar:

1. Union üyelerinin hepsinde ortak bir literal alan bulunur; bu örnekte alanın adı `status`.
2. Her durumun taşıdığı alanlar yalnızca o üyede zorunludur. Başarı verisi `data`, hata mesajı `error` dalında yaşar.
3. Kullanılmayan alanı `undefined` yapmak yerine o dalda hiç tanımlamamak, geçersiz birleşimi daha zor ifade edilir kılar.
4. `status` kontrolü ilgili üyeyi seçer; `success` dalında `data` artık opsiyonel değildir.
5. Her dalda ayrı nesne üretmek durum değişimini açık hale getirir. Tip, geçiş mantığının yerine geçmez.
6. Bir durum eklenirse bütün dalları ele alan kodlar güncellenmelidir; `never` bunu derleyiciye kontrol ettirebilir.

```ts check
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; value: T }
  | { status: 'error'; message: string }

function describe<T>(state: LoadState<T>): string {
  switch (state.status) {
    case 'idle': return 'Henüz başlamadı'
    case 'loading': return 'Hazırlanıyor'
    case 'success': return String(state.value)
    case 'error': return state.message
    default: {
      const unreachable: never = state
      return unreachable
    }
  }
}
```

Bu tip, “yükleniyor ama aynı anda başarı verisi var” nesnesini kabul etmez; yükleme dalında `value` yoktur. `success` dalında ise değer zorunludur. `T` generic'i sonucu farklı içerik tipleriyle tekrar kullanmayı sağlar, ama o içeriğin gerçekten dış sistemden doğru geldiğini tek başına doğrulamaz.

## `switch` sırasında tipi izle

`describe(reportState)` çağrısında önce değişken `LoadState<Report>` olarak bilinir. `switch` her dalda olasılıkları kısaltır:

| Satır / dal | Mümkün üyeler | Güvenle okunabilen veri |
| --- | --- | --- |
| `switch (state.status)` öncesi | Dört üye de | Yalnız ortak `status` |
| `case 'idle'` | Idle | `status` |
| `case 'loading'` | Loading | `status` |
| `case 'success'` | Success | `value: Report` |
| `case 'error'` | Error | `message: string` |
| `default` | Yeni eklenmiş ve ele alınmamış üyeler | Derleyici kontrolünde `never` olmalı |

Son üyeye örneğin `cancelled` eklendiğini düşün. `switch` içinde case açılmazsa `default` bölümündeki `state`, artık `never` olmaz; atama hata verir. Bu, enum veya discriminated union büyüdüğünde gözden kaçan UI dalını yakalamanın yoludur.

Boş sonuç ile henüz istek yapılmamış olmayı da ayırt et. `success` dalında `data` boş bir dizi olabilir; bu “istek başarılı oldu, sonuç yok” demektir. `idle` ise henüz başlangıç yapılmadığını anlatır. İkisini tek bir `empty` durumuna indirgersen kullanıcıya “arama yap” çağrısı mı, “eşleşme bulunamadı” mesajı mı göstermeyi bilemezsin.

Benzer biçimde `error` dalında eski başarılı veriyi taşımak her zaman yanlış değildir; bazı arayüzler yenileme sırasında eski veriyi bilinçli olarak gösterir. Fakat böyle bir gereksinim varsa bunu ayrı ve açık bir modelle anlat: örneğin `refreshing` durumu mevcut veriyi de taşıyabilir. `loading` içinde gizli `data?` bırakmak, hangi geçişte eski değerin görünmesi gerektiğini tipten anlaşılmaz hale getirir. Model, gerçek ürün davranışını temsil etmeli; her istek için tek bir genel union zorunlu değildir.

## Önce kırık, sonra doğru

Üç bağımsız alan çelişkili görüntüye izin verir:

```ts
type BrokenState<T> = {
  loading: boolean
  data?: T
  error?: string
}

const impossibleButAccepted: BrokenState<string> = {
  loading: true,
  data: 'Önceki rapor',
  error: 'Yetki yok',
}
```

Derleyici bunu kabul eder; tipte “başarı” ile “hata” aynı anda bulunamaz kuralı yoktur. Durumları ayrı dallara böl:

```ts check
type ReportState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

const loading: ReportState<string> = { status: 'loading' }
const success: ReportState<string> = { status: 'success', data: 'Aylık özet' }
const failure: ReportState<string> = { status: 'error', error: 'Yetki yok' }
```

Artık bir durumun alanları kendi dalında toplanmıştır. Bu tip, reducer veya event handler'ın doğru geçiş ürettiğini garanti etmez; sadece üretilen nesnenin geçerli dallardan birine uymasını şart koşar.

## Guard, `switch` ve exhaustive kontrol

Bir type guard, durumu kontrol eden küçük fonksiyon olabilir. `value is { status: 'success'; data: T }` dönüş tipi, çağıranın if dalında `data` alanını okumasını sağlar. Guard gövdesi gerçek karşılaştırma yapmalıdır; imza tek başına çalışma anında kontrol değildir.

`switch` ise her duruma farklı davranış uygulamak için okunaklıdır. Her yeni durum bir iş kararı doğuruyorsa (başarıyı göster, hatayı açıkla, boş durumu öner) `switch` kullan. Yalnız “başarı mı?” soruluyorsa guard daha küçüktür. İki yaklaşım da aynı `status` alanıyla daraltma yapar.

## Sınırlar ve sık hatalar

:::mistake[Belirti: Hata mesajıyla başarı verisi aynı anda görünür]
Belirti → UI hem başarı kartını hem hata uyarısını render eder.  
Neden → `data` ve `error` aynı nesnede opsiyonel alanlardır; tip bunların birlikte bulunmasını engellemez.  
Düzeltme → Her durumun alanlarını ayrı union üyesine taşı; ekrana göre dal seç.
:::

:::mistake[Belirti: `data` her dalda `T | undefined` olur]
Belirti → Başarı `case`'inde bile `state.data` kontrolü istenir.  
Neden → `data?` tek ortak nesne tipine yazılmıştır.  
Düzeltme → `data` alanını yalnız `{ status: 'success'; data: T }` üyesinde zorunlu tanımla.
:::

:::mistake[Belirti: Yeni durum eklenince UI sessizce boş metin döndürür]
Belirti → `cancelled` eklendi ama metin fonksiyonu hiçbir dalda onu açıklamıyor.  
Neden → Dönüşüm genel bir `default: return ''` ile kapatılmıştır.  
Düzeltme → `never` atamasıyla ele alınmayan üyeyi compile time hatasına çevir.
:::

:::mistake[Belirti: Başarılı durumun içindeki `data` bozuk şekildedir]
Belirti → Durum tipi `Report` diyor ama sunucu hata nesnesi gönderiyor.  
Neden → Discriminated union iç uygulama durumlarını düzenler; ağdaki JSON'u doğrulamaz.  
Düzeltme → Dış sınırda `unknown` veriyi doğrula, ancak ondan sonra `success` oluştur.
:::

:::sector
Frontend ekipleri istek, ödeme, upload ve kimlik doğrulama durumlarını çoğunlukla discriminated union ile ifade eder. Böylece render dalları ile reducer geçişleri aynı durum adlarını paylaşır. Her state değişiminin doğru iş kuralını uygulaması hâlâ kod ve test sorumluluğudur.
:::

## Özet

- Bağımsız boolean ve optional alanlar geçersiz kombinasyonları çoğaltır.
- Discriminated union geçerli her durumu ayrı nesne biçiminde tanımlar.
- `status` kontrolü, dalın alanlarını TypeScript'e daraltır.
- `never` kontrolü yeni durum unutulduğunda derleme hatası verir.
- Durum tipi dış veriyi doğrulamaz ve doğru geçişi kendiliğinden üretmez.

**Kendini yokla:** `status === 'success'` dalında `data` neden `T | undefined` değildir?  
*Cevap:* Union üyesinde `data: T` zorunludur; status kontrolü bu üyeyi seçer.

**Kendini yokla:** `RemoteData<T>` tipini tanımlamak eski veriyi yükleme başlarken siler mi?  
*Cevap:* Hayır. Yeni `loading` nesnesini üreten geçiş kodu eski veriyi taşımamalıdır.
