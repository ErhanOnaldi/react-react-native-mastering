---
title: "Bekleyen işlemde dürüst UI"
minutes: 17
kind: concept
---

# Bekleyen işlemde dürüst UI

React'te bir state değişince ekrandaki metin yenilenir; bunu `useState` ile zaten yaptın. Şimdi Sinema'daki gösterim listesine bir not eklediğini düşün. Kayıt sunucuya giderken ekranda “Kaydedildi” demek doğru olmaz; ama kullanıcıya hiçbir şey söylememek de iyi değildir. Önce formun gerçek sonucunu yönetelim, sonra bekleme sırasında anlık görünümü ele alalım.

## Formun sonucunu Action ile göster

React 19'da forma bağlayabildiğin asenkron fonksiyona **Action** denir. Action form verisini alıp bir sonuç döndürebilir. `<form action>` ile bağlayınca React gönderim sürerken **pending** durumunu da sağlar; pending, işin henüz bitmediği aralıktır.

```tsx
import { useActionState } from 'react'

async function saveScreeningNote(_previous: string, formData: FormData) {
  const note = String(formData.get('note') ?? '').trim()
  return note ? `Not kaydedildi: ${note}` : 'Not boş olamaz'
}

export function ScreeningNoteForm() {
  const [message, formAction, isPending] = useActionState(saveScreeningNote, '')
  return (
    <form action={formAction}>
      <label>Gösterim notu <input name="note" /></label>
      <button disabled={isPending}>Kaydet</button>
      <p role="status">{isPending ? 'Kaydediliyor…' : message}</p>
    </form>
  )
}
```

`useActionState` bize son mesajı, forma verilecek `formAction` fonksiyonunu ve `isPending` değerini verir. Tarayıcı, `name="note"` alanının değerini `FormData` içine koyar; bu nesne form gönderimindeki alan/değer çiftlerini taşır. Alanı kırparak yalnızca boşluklardan oluşan notu da boş kabul ettik. Düğmeyi pending sırasında kapatmak, kullanıcıya kaydın sürdüğünü gösterir ve aynı formu arka arkaya göndermesini önler.

Örnekte mesaj fonksiyonu hemen sonuçlandırılıyor. Gerçek ağ işi için Action içinde `await` ile istek yapılabilir; `isPending` de bu iş bitene kadar true kalır. Bir Action dönüş değeri üretir; bu örnekte React yeni mesajı ekrana taşır. Sunucu hatasını başarı metnine çevirmemeli, kullanıcıya anlaşılır hata sonucu vermelisin.

Bir ağ isteği eklediğimizde sırayı böyle izleriz:

| An | Action ve React ne yapar? | Ekrandaki durum |
|---|---|---|
| İlk çizim | Sonuç boş, `isPending` false | “Kaydet” etkin |
| Gönderim | `formAction` Action'ı başlatır | `isPending` true, “Kaydediliyor…” |
| İstek sürüyor | Action sunucu yanıtını bekler | Düğme devre dışı kalır |
| Başarı veya doğrulama sonucu | Action mesajı döndürür, pending biter | Sonuç mesajı görünür |

Yani Action'ın başlangıcı ve bitişi kullanıcıya ayrı ayrı yansır. Bu ara durumu göstermeseydik yavaş bağlantıda düğme tepkisizmiş gibi görünürdü; `isPending` işin hâlâ sürdüğünü açık eder.

:::model[Render → commit → effect]
Action sonucu state'i değiştirdiğinde React yeni çıktıyı hesaplar, gerekli DOM değişikliklerini commit eder ve ardından effect aşaması gelir.

![Render, commit ve effect sırasını hatırla](diagram:render-commit)
:::

Burada mesajı Action'ın dönüş değerinden alıyoruz; `message` için ayrıca `setMessage` çağırmadık. Bu, formun son sonucunu tek yerden üretir. Örneğin not doğrulaması başarısızsa Action hata metnini döndürebilir; ağ isteği reddedilirse de başarı gibi görünen bir mesaj yerine anlaşılır bir hata sonucu göstermelisin. Kullanıcı formu tekrar gönderebilir ve yeni Action yeni bir sonuç üretir.

Bir şeyi değiştirip izleyelim: Action'a `name` niteliği olmayan bir input koyarsak `formData.get('note')` değer bulamaz ve `null` verir. Bu nedenle form alanını okumak için yalnızca ekranda etiket yazması yetmez; `name` gönderilen verinin anahtarıdır.

## Bekleme sırasında tahmini göster

Bazı kontroller form değildir. Örneğin kullanıcı bir filmi izleme listesine ekleyince ağ yanıtını beklerken düğmenin hemen güncellenmesini isteyebilir. **Optimistic UI**, henüz sunucu onayı gelmeden kullanıcıya geçici olarak beklenen sonucu göstermektir. Onaylanmış state'i ayrı, ekrandaki geçici görünümü ayrı tutarız.

```tsx
import { startTransition, useOptimistic, useState } from 'react'

function WatchlistButton({ save }: { save: (next: boolean) => Promise<void> }) {
  const [saved, setSaved] = useState(false)
  const [shown, setShown] = useOptimistic(saved)

  function addToWatchlist() {
    startTransition(async () => {
      setShown(true)
      try {
        await save(true)
        setSaved(true)
      } catch {
        // Onaylı state false kaldı; geçici görünüm kalkınca düğme geri döner.
      }
    })
  }

  return <button onClick={addToWatchlist}>{shown ? 'İzleme listende' : 'Listeye ekle'}</button>
}
```

Tıklama ile istek arasındaki sırayı tabloda görelim. `saved` sunucunun onayladığı temel değerdir; `shown` beklerken görünen tahmindir.

| An | Olay | `saved` | `shown` | Düğme |
|---|---|---:|---:|---|
| İlk çizim | Sayfa hazır | false | false | Listeye ekle |
| Tıklama | Transition başlar, istek gider | false | true | İzleme listende |
| Başarı | Onay gelir, temel state güncellenir | true | true | İzleme listende |
| Hata | Onay gelmez, geçici görünüm kalkar | false | false | Listeye ekle |

Bu, ilk render'da false olan tek bir ekleme denemesini gösterir. Üçüncü örnekte başlangıçta zaten listede olan filmi çıkaralım. İşlem boyunca aynı prensip geçerli: yeni görünümü beklerken tahmin et; yalnızca istek başarıyla biterse temel state'i değiştir. Başarısızlıkta tahmin katmanı kalkınca eski onaylı değer görünür.

```tsx
function WatchlistToggle({ initial, save }: {
  initial: boolean
  save: (next: boolean) => Promise<void>
}) {
  const [saved, setSaved] = useState(initial)
  const [shown, setShown] = useOptimistic(saved)

  function toggle() {
    const next = !saved
    startTransition(async () => {
      setShown(next)
      try {
        await save(next)
        setSaved(next)
      } catch {
        // Başarısızlıkta saved değişmediği için shown eski değere döner.
      }
    })
  }

  return <button aria-pressed={shown} onClick={toggle}>
    {shown ? 'Listeden çıkar' : 'Listeye ekle'}
  </button>
}
```

`next`, bu render'ın `saved` değerinden hesaplanır. İstek sürerken tekrar tıklamaya izin verirsen iki işlem aynı eski değere göre hesaplanabilir. Basit bir etkileşimde pending sırasında düğmeyi devre dışı bırakmak yararlı olabilir; birden fazla eşzamanlı değişikliğe izin veren arayüzde ise sırayı ve çakışma politikasını ayrıca tasarlamalısın.

:::model[State snapshot]
Her render kendi `saved` değerini görür. Event handler bu render'dan oluştuğu için sonraki render'ın değerini otomatik olarak kullanmaz.

![Her render'ın kendi state fotoğrafı vardır](diagram:state-snapshot)
:::

## Hata görünüyorsa sebebi ara

:::mistake[Kalp ya da düğme hata sonrası da yeni değerde kalıyor]
**Belirti:** Sunucu isteği reddedildi ama UI hâlâ “listende” diyor. **Neden:** Tahmini değer kalıcı state'e istek tamamlanmadan yazıldı. **Düzeltme:** `useOptimistic` görünümünü pending işleme bağla; temel state'i yalnızca başarıdan sonra güncelle.
:::

:::mistake[Form verisi sürekli boş geliyor]
**Belirti:** `formData.get('note')` null dönüyor. **Neden:** Input'ta `name="note"` yok veya alan formun dışında. **Düzeltme:** Gönderilecek input'a doğru `name` ver ve Action içinde bu anahtarı oku.
:::

İki örnek türünde de aynı “bekliyor” kelimesi geçse de görevleri farklıdır: Action formun gönderim ve sonuç akışını yönetir; optimistic state ise form dışı etkileşimde yanıt beklenirken anlık bir görünüm verir. Tahmini gerçek onay gibi saklamadığımız için hata halinde doğru eski değer kendiliğinden görünür.

Ürün kararında şu soruyu sor: kullanıcının yanıtı beklemeden sonucu görmesi anlamlı mı ve hata olursa bu sonucu geri almak anlaşılır mı? İzleme listesine ekleme çoğu zaman evet; ödeme tamamlandı demek ise sunucu onayından önce yanıltıcı olur. Optimistic görünüm yalnızca teknik kolaylık değil, arayüzün neyi bildiğini doğru anlatma kararıdır.

:::info[Derinlemesine (isteğe bağlı)]
React'in `use(promise)` API'si Promise sonucunu render sırasında okur. Promise henüz tamamlanmadıysa yakınındaki `Suspense` sınırına geçici olarak askıya alınır; bu, form Action'ı ya da optimistic UI yerine geçmez. Promise'i her render'da yeniden üretmek yerine kararlı bir kaynaktan al.
:::

## Özet

- Action, form gönderimi gibi bir kullanıcı eylemiyle çalışan fonksiyondur; `useActionState` sonuçla birlikte pending bilgisini verir.
- Form alanının `name` niteliği, değerin `FormData` içinde hangi anahtarla okunacağını belirler.
- Optimistic UI, beklerken tahmini gösterir; sunucu onayı temel state'i günceller.
- İstek başarısızsa geçici görünüm kalkar ve değişmemiş temel değer ekrana döner.

**Yeni terimler**

- **Action:** React formuna bağlanan, gönderim verisini işleyen fonksiyon.
- **FormData:** Form alanlarının ad ve değerlerini taşıyan tarayıcı nesnesi.
- **Pending:** Asenkron işin başlayıp henüz bitmediği durum.
- **Optimistic UI:** Sunucu yanıtı gelmeden geçici beklenen sonucu gösterme.

**Kendini yokla**

1. `formData.get('note')` neden `null` olabilir? Input'un `name="note"` niteliği yoksa veya form içinde değilse o anahtarla veri gönderilmez.
2. Optimistic güncelleme başarısız olunca önceki görünüm neden geri gelir? Temel state'i başarı gelene kadar değiştirmedik; geçici katman kalkınca temel değer görünür.
