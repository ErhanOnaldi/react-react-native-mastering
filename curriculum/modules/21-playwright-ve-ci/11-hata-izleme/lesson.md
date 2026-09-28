---
title: "Üretimde hata izleme"
minutes: 14
kind: concept
---

# Üretimde hata izleme

:::pain[Kullanıcı boş ekran görüyor, ekipte iz yok]
Sinema’nın son yayını CI’dan geçti. Bir kullanıcı film kartına girince ekran boşalıyor; geliştiricinin bilgisayarında aynı film açılıyor. Konsol hatası yalnızca kullanıcının tarayıcısında kaldı. Ekip hangi sürümde, hangi bileşende ve hangi URL’de koptuğunu bilmiyor. Üretimde hatayı görmek için olayın uygulama dışına küçük, anlamlı bir kayıt olarak çıkması gerekir.
:::

## Hatanın çıktığı yer rapor kanalını belirler

React render hataları, Promise reddi ve sıradan `window` hataları aynı yoldan gelmez. Tek bir genel `try/catch` bütün sayfayı kapsamaz. İzleme kurulumunu, hatanın doğduğu sınırları açıkça ayırarak düşün:

1. **Boundary’nin yakaladığı React hatası:** Bileşen render sırasında hata verir, en yakın Error Boundary yedek UI gösterir. React 19 kökündeki `onCaughtError(error, errorInfo)` çağrılır. `errorInfo.componentStack`, bileşen zincirini tanı için verir.
2. **Yakalanmayan React hatası:** Hiçbir Boundary durduramazsa `onUncaughtError(error, errorInfo)` çağrılır. Kullanıcı ekranı kaybedebilir; kayıt yine gönderilmeye çalışılır.
3. **React’in kurtarabildiği hata:** `onRecoverableError(error, errorInfo)` ayrı bir kanaldır. Bu olayın önem derecesi yakalanmayan çökme ile aynı kabul edilmemelidir.
4. **React dışı senkron hata:** `window` üzerindeki `error` olayı, örneğin bağımsız bir script’teki hata için kullanılabilir. React kök seçeneklerinin yerine geçmez.
5. **İşlenmemiş Promise reddi:** `window` üzerindeki `unhandledrejection` olayı, cevapsız kalan Promise reddini bildirir. Bir fonksiyon zaten hatayı yakalayıp anlamlı UI gösteriyorsa aynı hatayı ikinci kez raporlamamaya dikkat et.

![React ve tarayıcı hata kanallarının ortak rapora akması](diagrams/hata-kanallari.svg "Farklı hata kanalları aynı küçük kayıt biçimine dönüştürülür.")

Bu kurallar “hangi olay nerede gözlenir?” sorusunu çözer. Raporlayıcı ise ayrı bir sorunu çözer: eldeki bilinmeyen hata değerini, kullanıcı akışını bozmadan göndermek. JavaScript’te `throw 'bozuldu'` mümkün olduğu için `error` değeri `unknown` kabul edilir. `instanceof Error` kontrolü olmadan `.message` okumak ikinci bir hata yaratabilir.

Error Boundary’nin kapsamını da doğru çiz. Bir düğmenin olay işleyicisinde başlayan asenkron işin reddi, render sırasında Boundary’nin yakaladığı hata ile aynı yol değildir. O iş zaten `try/catch` ile ele alınıp kullanıcıya “Tekrar dene” gösteriyorsa raporu aynı noktada bilinçli olarak üretirsin. İşlenmemiş reddi ayrıca küresel dinleyicide görürsen çift kayıt üretmemeye dikkat edersin. Hatanın hangi kanalda izlendiği, ekibin gerçek çökme sayısını anlamasını etkiler.

## Bir render hatasını zaman içinde izle

Diyelim bir etkinlik kartı, eksik veride render sırasında `TypeError('Tarih eksik')` fırlattı. En yakın Boundary hatayı yakaladı.

| An | Olay | Kaydın içeriği |
| --- | --- | --- |
| 1 | Kart render edilirken hata fırlatır | `TypeError`, `Tarih eksik` |
| 2 | Boundary yedek UI gösterir | Kullanıcı tamamen boş ekranda kalmaz |
| 3 | React `onCaughtError` çağırır | `componentStack` karta giden bileşen yolunu ekler |
| 4 | Raporlayıcı endpoint’i kontrol eder | Adres yoksa konsola yazar; varsa JSON hazırlar |
| 5 | Kayıt ağdan gönderilir | Release etiketi ve sınırlı bağlam tanıya yardım eder |

Bu tabloda Boundary’nin kullanıcıya gösterdiği sonuç ile raporlayıcının gönderdiği kayıt farklıdır. Kullanıcıya teknik stack göstermek gerekmez; ekibe ise yalnızca “bir hata oldu” demek yetersizdir. Route ve release gibi kısa bağlamlar hatanın tekrar üretilmesini kolaylaştırır. Parola, access token ve tam kullanıcı verisi gibi sırları bağlama koyma.

## Önce kırık: Konsola bırakılan hata

Aşağıdaki küçük örnek, React dışı bir Promise reddini sadece o tarayıcının konsoluna bırakır. Kod teknik olarak çalışır; ekip üretimde hatayı göremez:

```ts check title="src/diagnostics/local-only.ts"
window.addEventListener('unhandledrejection', (event) => {
  console.error('İşlenmemiş Promise', event.reason)
})
```

Doğru örnekte aynı olay küçük bir kayıt olarak raporlayıcıya gider. Etkinlik bileti sayfası için bu örnek yalnızca `fetch` yolunu ve sabit bir uygulama endpoint’ini gösterir. Gerçek uygulamada sayfa kapanışında `sendBeacon` ve gerekirse `keepalive` yedeği de düşünülür.

```ts check title="src/diagnostics/browser-errors.ts"
type BrowserIssue = { kind: string; message: string; route: string }

function describeUnknown(value: unknown): string {
  return value instanceof Error ? value.message : String(value)
}

async function publishIssue(issue: BrowserIssue): Promise<void> {
  try {
    await fetch('/telemetry/browser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issue),
      keepalive: true,
    })
  } catch {
    console.error('Hata kaydı gönderilemedi', issue.kind)
  }
}

window.addEventListener('unhandledrejection', (event) => {
  void publishIssue({
    kind: 'promise',
    message: describeUnknown(event.reason),
    route: location.pathname,
  })
})
```

`keepalive`, sayfa kapanırken isteğin sürmesine yardımcı olur; kesin teslim garantisi vermez. `navigator.sendBeacon(url, body)` kısa tanı kayıtları için tasarlanmıştır ve `true` dönmesi isteğin kuyruğa alınabildiğini gösterir, sunucunun kabul ettiğini değil. Yedek `fetch` yolunda HTTP yanıtı kontrol edilebilir. Hata raporlayan kodun kendi hatası kullanıcı ekranını yeniden çökertecek şekilde dışarı fırlatılmamalıdır.

Küresel olay dinleyicilerini uygulama başlangıcında bir kez kur. Aynı dinleyiciyi her bileşen render’ında eklemek, tek hatanın birden fazla kez gönderilmesine yol açar. Eğer dinleyici bir bileşenin yaşamına bağlıysa kaldırma işini de üstlenmelisin. Kayıt sayısı ile gerçek hata sayısının aynı olmaması, hata oranını yorumlamayı zorlaştırır.

React kökünde seçenekler `createRoot(container, { onCaughtError, onUncaughtError, onRecoverableError })` nesnesine verilir; `.render(...)` içine değil. Her callback `(error, errorInfo)` alır. `componentStack` bilgisini mümkün olduğunca ham ve kısa tut; otomatik olarak bütün props veya form değerlerini rapora eklemek mahremiyet riski taşır.

## Sıkıştırılmış stack’i kaynağa çevir

Yayındaki hata `assets/index-a41c.js:1:9087` gibi görünebilir. Bu, sıkıştırılmış dosyanın konumudur; senin TSX satırın değildir. Build’e ait source map, bu konumu kaynak dosya ve satıra eşler. Önceki dersteki `build.sourcemap: 'hidden'` ayarı map üretir ama JS içine map bağlantısı koymaz. Map’i izleme servisine ilgili release kimliğiyle yükleyip halka açık statik dosya dağıtımından ayırmalısın.

Release etiketi kritik: `index-a41c.js` ile `index-b82d.js` farklı kaynak konumlarına sahip olabilir. En yeni map’i her eski rapora uygulamak yanlış satır gösterebilir. Sentry veya Datadog RUM gibi servisler hata toplama, sürüm eşleme, örnekleme ve kullanıcı bağlamı için hazır araçlar sunar. Burada amaç, bu servislerin iç API’sini ezberlemek değil, hangi verinin neden gerekli olduğunu anlamaktır.

Kayıt içeriğini de tasarım kararı olarak ele al. Route, sürüm ve olay türü genellikle hatayı gruplamaya yeter; form alanlarının tamamı veya kişisel veriler gerekmez. Kullanıcı kimliğine ihtiyaç varsa, ham e-posta yerine erişimi sınırlı bir iç kimlik kullan. Üretimde görünürlük artarken kayıtların kopyalanması, saklanması ve kimlerin açabildiği de denetlenmelidir.

Gruplama için mesajı sonsuz değişken metinle doldurma. Örneğin her seferinde değişen bir kayıt numarasını hata başlığına eklersen aynı kök neden binlerce ayrı hata gibi görünür. Değişken değerleri sınırlı bağlam alanında tut; olay türü, hata sınıfı ve kararlı mesaj gruplama anahtarını oluşturabilir. Sıklık ve etkiyi değerlendirirken örnekleme oranını da hesaba kat: az örneklenen bir olayın görünmemesi, hatanın yaşanmadığını kanıtlamaz.

:::mistake[Boundary hatası görünmüyor]
Belirti → Yedek UI açılıyor ama izleme kaydı yok.  
Neden → Yalnızca `window.error` dinleniyor; Boundary tarafından yakalanan React hatası bu kanala bırakılmadı.  
Düzeltme → React köküne `onCaughtError` ekle ve `componentStack` bağlamını raporla.
:::

:::mistake[Raporlayıcı ikinci kez çöktürüyor]
Belirti → Asıl hatadan sonra `Cannot read properties of undefined (reading 'message')` çıkıyor.  
Neden → Fırlatılan değerin mutlaka `Error` olduğu varsayıldı.  
Düzeltme → Değeri `unknown` al; `instanceof Error` ile ayır, diğerlerini güvenli biçimde metne çevir.
:::

:::mistake[Yanlış kaynak satırı]
Belirti → İzleme aracı hatayı değişmemiş bir TSX satırına bağlıyor.  
Neden → Rapor eski release’den, yüklenen map yeni build’den.  
Düzeltme → Raporu build/release kimliğiyle etiketle ve aynı build’in source map’ini yükle.
:::

:::sector[Sektörde]
Ekipler hata kaydına sürüm, route ve sınırlı kullanıcı bağlamı ekler; sık tekrar eden hataları örnekleyerek gürültüyü azaltır. Yayın sonrası yeni release’de hata oranı artarsa aynı sürümün map’iyle kök nedeni bulur. Raporların içeriği kod incelemesinde gizli veri açısından da kontrol edilir.
:::

## Özet

- React 19 kökü yakalanan, yakalanmayan ve kurtarılabilir hataları ayrı callback’lerle bildirir.
- `window.error` ve `unhandledrejection`, React dışı hata kanallarını tamamlar.
- `unknown` hata değerini güvenle küçük JSON kaydına çevir; gönderim arızası UI’yi kırmasın.
- `sendBeacon` ve `fetch` `keepalive` kapanış sırasında gönderime yardımcı olur, teslim garantisi vermez.
- Source map ile release aynı build’e ait olmalıdır; gizli map dosyalarını halka açık yayınlama.

**Kendini yokla:** Boundary yedek UI gösteriyorsa hangi kök callback’i çalışır?  
*Cevap:* `onCaughtError`; `onUncaughtError` yakalanmayan React hataları içindir.

**Kendini yokla:** Neden yalnızca `app.js:1:9000` konumu yeterli değil?  
*Cevap:* Bu sıkıştırılmış konumdur; özgün TSX satırı için aynı release’in source map’i gerekir.
