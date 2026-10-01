---
title: "Üretimde hata izleme"
minutes: 14
kind: concept
---

# Üretimde hata izleme

Sinema’nın yerel sürümünde bir film sayfası açılıyor, ama yayındaki bir kullanıcı boş ekran görüyor. Geliştirici araçlarında hata o kullanıcının tarayıcısında kalıyor. Kullanıcının gördüğü sonucu düzeltmek ayrı, hatanın hangi yayında ve hangi bileşende olduğunu öğrenmek ayrı iştir. Burada küçük bir kayıtla ikinci soruya cevap arayacağız.

## Önce hatanın hangi yerde çıktığını bul

Bir React bileşeni render sırasında hata fırlatabilir. En yakın **Error Boundary**, yani alt bileşenlerinin render hatasını yakalayıp yedek arayüz gösterebilen sınır, bu hatayı kullanıcı ekranındaki boşluğun yerine bir hata görünümü koyarak karşılayabilir. React 19, bu olayı kök oluşturulurken verilen `onCaughtError` seçeneğine bildirir.

İlk örnekte bir etkinlik kartında render hatası olduğunu düşün. Boundary yedek görünümü açar; `onCaughtError` ise hatanın bileşen zinciriyle rapora aktarılacağı yerdir. Kullanıcı hatayı yakalamamış gibi görmez, geliştirici de olayı yalnızca kullanıcının konsolunda bırakmaz. `componentStack`, React bileşenlerinin hataya giden sırasını gösterir; sunucudan gelen normal JavaScript stack’inden farklı bir ipucudur.

| Sıra | Ne olur? | Neyi öğrenirsin? |
| --- | --- | --- |
| 1 | Kart render edilirken `TypeError('Tarih eksik')` fırlatır | Hata ve mesaj |
| 2 | En yakın Boundary hatayı yakalar | Kullanıcı yedek UI görür |
| 3 | React `onCaughtError` çağırır | React hatasının yakalandığını bilirsin |
| 4 | Callback, `componentStack` bilgisini rapora ekler | Hatanın bileşen yolu görünür |

Bu sıra, yedek UI’nin gösterilmesiyle raporun gönderilmesinin aynı şey olmadığını gösterir. Boundary kullanıcı arayüzünü toparlar; izleme kaydı ekip için tanı bilgisi taşır. Raporlamazsan sayfa toparlanmış görünse bile üretimdeki hatadan haberin olmayabilir.

![React ve tarayıcı hata kanallarının ortak rapora akması](diagrams/hata-kanallari.svg "Farklı hata kanalları kısa bir hata kaydına dönüşür.")

Kök seçeneklerini `createRoot` çağrısına verirsin. Hata callback’leri `.render(...)` çağrısına değil, kök oluşturma ayarlarına aittir:

```tsx title="src/main.tsx (ilgili bölüm)"
const root = createRoot(container, {
  onCaughtError(error, errorInfo) {
    recordIssue('react-caught', error, errorInfo.componentStack)
  },
  onUncaughtError(error, errorInfo) {
    recordIssue('react-uncaught', error, errorInfo.componentStack)
  },
  onRecoverableError(error, errorInfo) {
    recordIssue('react-recoverable', error, errorInfo.componentStack)
  },
})

root.render(<App />)
```

`errorInfo.componentStack` bileşen yolunu verir. Callback’lerin hepsini tek bir `window.error` dinleyicisine taşımak React’e özgü bu ayrımı kaybettirir; olayın nerede yakalandığını kayıt türünde koru.

## React hatalarının üç farklı sonucu var

`onCaughtError` yakalanan React hataları içindir. Hiçbir Boundary’nin yakalamadığı React hatası `onUncaughtError` ile bildirilir. React’in kurtarabildiği hatalar ise `onRecoverableError` seçeneğine gider. Üç callback’in adları birbirine benzer, ama olayın kullanıcıya etkisi aynı değildir; hata önceliğini değerlendirirken bunları ayrı tut.

İkinci örnekte Boundary eklemediğin bir film detay bileşeni render hatası fırlatsın. Bu kez React hatayı yakalayan bir sınır bulamaz; `onUncaughtError` devreye girer. Yedek arayüz görünmeyebilir, ancak rapor yine de hangi React hatasının yakalanamadığını anlatabilir. Aynı hatayı ayrıca `window` dinleyicisinden de raporlarsan tek olay iki kayıt hâline gelebilir.

React dışındaki hatalar için tarayıcının olayları vardır. `window` üzerindeki `error`, yakalanmamış senkron JavaScript hatalarına; `unhandledrejection`, kodun ele almadığı reddedilmiş Promise’lere işaret eder. Bunlar React kök callback’lerinin yerine geçmez. Düğme tıklamasındaki bir `try/catch` hatayı kullanıcıya “Tekrar dene” olarak gösteriyorsa, onu bilerek raporlamak için o yakalama noktasından raporlayıcıyı çağırırsın.

## Hata değeri her zaman Error değildir

JavaScript’te `throw new Error('Bozuk veri')` yanında `throw 'Bozuk veri'` de mümkündür. Bu yüzden bir callback’ten gelen hata değerini başlangıçta **`unknown`**, yani biçimini henüz güvenle bilmediğin değer, olarak ele al. `.message` alanını hemen okursan hata `Error` değilken raporlayıcının kendisi çöker.

Üçüncü örnek, değeri önce ayırır:

```ts check title="src/diagnostics/describe-failure.ts"
export function describeFailure(value: unknown): { name: string; message: string } {
  if (value instanceof Error) {
    return { name: value.name, message: value.message }
  }

  return { name: 'UnknownError', message: String(value) }
}
```

Burada `TypeError('Bozuk veri')`, `TypeError` ve `Bozuk veri` olarak kayda geçer. Metin fırlatılırsa aynı kontrol geçmez; bu kez güvenli bir genel ad ve metne çevrilmiş değer elde edilir. Böylece tanı bilgisi kaybolmaz ve rapor hazırlarken ikinci bir hata çıkarmazsın.

## Kaydı gönderirken sırayı koru

Bir rapor genellikle olay türü, mesaj, route ve sürüm gibi sınırlı bilgi taşır. Tam form verisini, token’ı veya parolayı ekleme. Bu veriler hatayı çözmeye yardım etmeyebilir ve kullanıcıya ait özel bilgileri açığa çıkarabilir.

Sayfa kapanırken normal bir ağ isteği yarıda kalabilir. `navigator.sendBeacon`, kısa bir kaydı tarayıcı kapanışına uygun biçimde gönderme kuyruğuna almayı dener. `true` dönmesi sunucunun kaydı aldığını garanti etmez; yalnızca tarayıcının göndermeyi kuyruğa alabildiğini söyler. Kuyruğa alamazsa `fetch` için `keepalive: true` yedeği kullanılabilir. Bu sırada yanıtın başarılı HTTP durumu kontrol edilir; ağ hatası veya başarısız durum kodu raporlamanın da başarısız olduğunu gösterir.

Gönderim sırasını küçük bir örnekle izle:

| Adım | Olay | Sonraki işlem |
| --- | --- | --- |
| 1 | Hata, `name`, `message`, `context` alanlarına çevrilir | JSON gövdesi hazırlanır |
| 2 | `sendBeacon` kuyruğa alındığını söyler | İkinci istek atılmaz |
| 3 | `sendBeacon` kuyruğa alamaz | JSON, `fetch` ile POST edilir |
| 4 | Sunucu başarılı HTTP yanıtı verir | Çağırana `true` döner |
| 5 | Sunucu başarısız yanıt verir veya ağ isteği çöker | Çağırana `false` döner |

İkinci örnekteki “aynı hatayı iki kanaldan kaydetme” riski gönderimde de önemlidir. Beacon başarılı göründükten sonra bir de `fetch` atarsan sunucuda iki kayıt oluşabilir. Önce beacon sonucunu değerlendir; yalnızca kuyruk başarısızsa yedek yola geç. `keepalive`, kapanışta isteğin sürme ihtimalini artırır ama teslim garantisi değildir.

## Sıkıştırılmış satırdan kaynak dosyaya dön

Üretim kaydında `assets/app-a41c.js:1:9002` görebilirsin. Bu, build sırasında küçültülmüş JavaScript dosyasındaki konumdur. **Source map**, bu konumu özgün TypeScript veya TSX dosyasındaki satıra eşleyen dosyadır. Yayındaki JavaScript’in map’i yüklenmiş ve erişilebilir olmalı; bazı ekipler map’i halka açık dosya sunucusu yerine izleme servisine yükler.

Dördüncü örnekte aynı `app.js:1:9002` konumunun iki yayında farklı kaynak satırına denk geldiğini düşün. İlk yayın `app-a41c.js`, sonraki yayın `app-b82d.js` üretmiş olsun. Raporla birlikte hangi **release**’ten, yani hangi yayın/build sürümünden geldiğini tutarsın; izleme aracı o sürümün source map’ini seçer. En yeni map’i eski rapora uygularsan yanlış TSX satırına gidebilirsin.

| Hata kaydı | Eşleştirilecek map | Sonuç |
| --- | --- | --- |
| `app-a41c.js:1:9002`, release `a41c` | `a41c` build’inin map’i | İlk build’in kaynak satırı |
| `app-b82d.js:1:9002`, release `b82d` | `b82d` build’inin map’i | Sonraki build’in kaynak satırı |

Önceki yayına alma dersindeki `build.sourcemap: 'hidden'` ayarı, build’in map üretmesini sağlar ama JavaScript’e map adresini eklemez. Map’i doğru build etiketiyle izleme servisine yüklemek gerekir. Sentry veya Datadog RUM gibi hizmetler bu eşleştirmeye yardımcı olabilir; önemli olan servis adı değil, raporun kendi build’inin map’ini kullanmasıdır.

:::mistake[Üretim hatası yanlış satıra gidiyor]
Belirti → İzleme kaydı eski bir TSX satırını işaret ediyor.

Neden → Eski release’in hatası yeni build’in source map’iyle çözümleniyor.

Düzeltme → Her raporu release ile etiketle ve o build’in map’ini kullan.
:::

:::info[Derinlemesine (isteğe bağlı)]
Çok değişken bir hata mesajını gruplama anahtarına koymak, aynı kök nedeni binlerce farklı hata gibi gösterebilir. Değişen kayıt numarası gibi değerleri sınırlı bağlam alanında tut; hata sınıfı ve kararlı mesaj gruplamayı kolaylaştırır. Örnekleme kullanılıyorsa, rapor sayısını yorumlarken yalnızca olayların bir bölümünün gönderildiğini hesaba kat.

`window` üzerindeki `error` ve `unhandledrejection` dinleyicilerini uygulama başlarken bir kez kur. Her render’da tekrar eklemek aynı hatayı birden çok kez raporlayabilir. Bir bileşen ömrü için eklenen dinleyici ise o bileşen kapanırken kaldırılmalıdır.
:::

## Özet

- React’in yakalanan, yakalanmayan ve kurtarılabilir hataları farklı kök callback’lerine gider.
- Error Boundary yedek UI gösterir; raporlama ekibe tanı bilgisi ulaştırır.
- Hata değerini `unknown` kabul et ve `Error` olup olmadığını kontrol et.
- Beacon kuyruğa alamazsa `fetch` yedeğine geç; HTTP ve ağ başarısını çağırana bildir.
- Üretim konumunu kaynak dosyaya çevirmek için rapordaki release ile aynı build’in source map’i gerekir.

**Yeni terimler:**

- **Error Boundary:** Alt React bileşenlerinin render hatasını yakalayıp yedek UI gösterebilen sınır.
- **`unknown`:** TypeScript’te biçimi kontrol edilmeden kullanılamayan değer tipi.
- **`sendBeacon`:** Sayfa kapanırken kısa veri gönderimini kuyruğa almayı deneyen tarayıcı API’si.
- **Source map:** Sıkıştırılmış kod konumunu özgün kaynak dosyaya eşleyen dosya.
- **Release:** Bir uygulama build’ini/yayınını tanımlayan sürüm etiketi.

**Kendini yokla:** Boundary hata yakalayıp yedek UI gösterirse React kökünde hangi seçenek çalışır?

*Cevap:* `onCaughtError`; yakalanmayan React hataları `onUncaughtError` ile bildirilir.

**Kendini yokla:** Neden `app.js:1:9002` konumuna en yeni source map’i doğrudan uygulamazsın?

*Cevap:* Bundle konumları build’e göre değişebilir; doğru kaynak satırı için hatanın release’ine ait map gerekir.
