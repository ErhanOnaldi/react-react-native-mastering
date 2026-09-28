---
title: "Bekleyen işlemde dürüst UI"
minutes: 20
kind: concept
---

# Bekleyen işlemde dürüst UI

:::pain[Problem]
Favori düğmesine bastın. İstek sürerken düğme aynı kaldı; tekrar bastığında ikinci kayıt da başladı. İlk istek başarısız olsa kullanıcı hangi durumun doğru olduğunu anlayamıyor.
:::

## Sunucu gerçeği ile bekleme görünümünü ayır

Asenkron işlemde iki bilgi vardır: sunucunun onayladığı değer ve kullanıcının beklerken gördüğü geçici değer. Bunları tek değişkende toplarsan başarısızlıkta eski değeri geri kurmak zorlaşır. React 19'un Actions, useActionState ve useOptimistic araçları bu zaman aralığını görünür kılar.

:::model[Render → commit → effect]
Event handler kullanıcı etkileşiminden başlar, state güncellemesi yeni render ister ve commit ekrana yazar. Action bu akışta asenkron işi ve pending süresini temsil eder.
:::

![Render, commit ve effect sırasını hatırla](diagram:render-commit)

:::model[State snapshot]
Handler, oluştuğu render'ın değerlerini görür. Hızlı iki tıklama aynı eski değerden hesaplanabilir; pending iken ikinci etkileşimi engellemek çakışmayı önler.
:::

![Her render'ın kendi state fotoğrafı vardır](diagram:state-snapshot)

### Üç kesin kural

1. Onaylanmış state yalnızca başarılı sonuçta güncellenir.
2. Optimistic değer yalnızca bekleme sırasında görünen tahmindir; başarıda temel state ile eşitlenir, hatada temel değere döner.
3. Pending bilgisi işlem süresini temsil eder. Formda useActionState, form olmayan etkileşimde startTransition kullanılabilir.

## Form gönderimini Action olarak modelle

useActionState(action, initialState) son sonucu, forma verilecek fonksiyonu ve isPending değerini sağlar. Action önceki sonucu ve FormData alır. name niteliği olan alanlar FormData içine girer; trim boşluklardan oluşan girdiyi de boş kabul eder.

```tsx check
import { useActionState } from 'react'

async function saveNote(_previous: string, formData: FormData): Promise<string> {
  const note = String(formData.get('note') ?? '').trim()
  return note ? `Kaydedildi: ${note}` : 'Not boş olamaz'
}

export function NoteForm() {
  const [message, formAction, isPending] = useActionState(saveNote, '')
  return (
    <form action={formAction}>
      <label>Not <input name="note" /></label>
      <button disabled={isPending}>Kaydet</button>
      <p role="status">{message}</p>
    </form>
  )
}
```

Pending süresince düğmeyi kapatmak yinelenen gönderimi önler. Sonuç alanı tamamlanınca ne olduğunu söyler. Gerçek ağ hatası için Action hata durumunu da ekranda anlaşılır biçimde ele almalıdır.

## Favori geçişini zaman sırasıyla izle

Form olmayan kalp düğmesinde useOptimistic geçici değeri üretir. Onaylanmış temel state istek çözülene kadar değişmeden kalır.

```tsx
import { startTransition, useOptimistic, useState } from 'react'

export function StarButton({ save }: { save: (next: boolean) => Promise<void> }) {
  const [favorite, setFavorite] = useState(false)
  const [shown, setShown] = useOptimistic(favorite)

  function toggle() {
    const next = !favorite
    startTransition(async () => {
      setShown(next)
      try {
        await save(next)
        setFavorite(next)
      } catch {
        // Temel state değişmediği için geçici görünüm geri alınır.
      }
    })
  }

  return <button type="button" aria-pressed={shown} onClick={toggle}>{shown ? 'Favorilerden çıkar' : 'Favorilere ekle'}</button>
}
```

| An | Temel state | Görünen state | Ekran |
|---|---:|---:|---|
| İlk render | false | false | Favorilere ekle |
| Tıklama, istek başladı | false | true | Favorilerden çıkar |
| Başarı | true | true | Favorilerden çıkar |
| Hata | false | false | Favorilere ekle |

Handler next değerini o render'ın snapshot'ından hesaplar. Transition sırasında setShown(next) geçici görünümü verir. save çözülürse temel state güncellenir. Reddedilirse temel state false kaldığı için React optimistic değeri kaldırır. Hata açıklaması gerekiyorsa ayrıca göster.

### Önce kırık, sonra doğru

Temel state'i isteğin başında değiştirmek hata halinde yanlış kalıcı değer bırakır:

```tsx
async function brokenToggle() {
  setFavorite((value) => !value)
  await save(!favorite)
}
```

İkinci satır da render snapshot'ındaki favorite değerini okur. Hızlı tekrarlar aynı hedefi gönderebilir. Temel değeri başarıda güncelle, bekleme görünümünü ayrı tut ve gerekiyorsa gönderim boyunca düğmeyi devre dışı bırak.

React 19'daki use(promise) başka bir ihtiyaçtır: render sırasında Promise sonucunu okur; Promise bekliyorsa en yakın Suspense sınırına askıya alınır. Promise her render'da yeniden yaratılmamalı, kararlı bir kaynaktan gelmelidir. use, Context okumada koşullu çağrılabilir; bu istisnayı diğer Hook'lara genelleme.

### Aynı işlemin zaman çizelgesini okuyalım

Action'ı “butona basınca çalışan async fonksiyon” diye düşünmek eksik kalır. React'in gördüğü şey, kullanıcı eylemiyle başlayan, devam ederken pending bilgisini taşıyan ve tamamlandığında yeni sonucu ekrana veren bir geçiştir. Bu geçiş sayesinde arayüz, istek henüz sürerken de kullanıcıya anlamlı bir durum gösterebilir.

| An | Olay | Kalıcı state | Geçici görünüm / sonuç |
|---|---|---|---|
| t0 | Form ilk kez çizilir | message = '' | isPending = false, buton açık |
| t1 | Kullanıcı formu gönderir | önceki mesaj korunur | Action başlar, isPending = true |
| t2 | Action FormData içinden note okur | henüz değişmez | kullanıcı bekleme durumunu görür |
| t3 | Action "  " girdisini trim() ile boş bulur | sonuç "Not boş olamaz" olur | React sonucu ve pending bitişini render eder |
| t4 | Yeni ve geçerli gönderim tamamlanır | sonuç "Kaydedildi: Akşam seansı" olur | isPending = false |

useActionState içindeki ilk değer, ilk render'da gösterilecek sonuçtur; action'ın ilk parametresi ise action tekrar çağrıldığında bir önceki sonuçtur. Action yeni sonucu döndürür, setter çağırmaz. Formun action prop'una dönen formAction bağlandığında React bu fonksiyonu submit sırasında çağırır ve pending süresini yönetir. Alanın name değeri yoksa tarayıcı onu FormData içine koymaz; get() bu durumda null döndürür. Bu nedenle String(value ?? '') ve doğrulama birlikte kullanılır.

Şimdi useOptimistic akışını da aynı netlikle ayıralım. favorite sunucunun son onayladığı değerdir; shown ise geçiş devam ederken geçici tahmindir. Başarıda ikisi aynı değere gelir. Hata halinde temel değer hiç değişmediğinden geçici katman kalkar. Görünen değer, kalıcı kaydın kanıtı değildir.

Bu ayrımı kullanıcıya da görünür kıl: düğmenin metni tahmini, erişilebilir durum özeti ise işlemin sürdüğünü anlatabilir. Hata olduğunda sessizce geri dönmek yerine nedenini açıklayan mesaj eklemek çoğu üründe daha anlaşılırdır.

| An | favorite | shown | save sonucu |
|---|---:|---:|---|
| İlk render | false | false | henüz çağrılmadı |
| Tıklama sonrası | false | true | bekleniyor |
| Başarılı yanıt sonrası | true | true | tamamlandı |
| Başarısız yanıt sonrası | false | false | reddedildi |

Bu model tek bir açık/kapalı istekte anlaşılır. Aynı anda birden fazla tersine çevirme kabul edilirse her isteğin hangi temel değere dayandığını ve yanıtların hangi sırayla gelebileceğini ayrıca tanımlamak gerekir. En küçük doğru karar çoğu kez işlem sürerken düğmeyi kapatmaktır. Başka bir seçenek, optimistic reducer'a gelen her eylemi son görünen değere göre uygulamaktır; ancak sunucudan gelen sonuçların sırası hâlâ iş kuralıdır ve React bunu senin adına çözmez.

use() bu Action akışının yerine geçmez. Promise'i render sırasında okumak için kullanılır: Promise bekliyorsa yakın bir Suspense fallback'i görünür, tamamlanınca bileşen değeri okur. Promise her render'da yeniden üretilirse React her defasında yeni bir bekleme kaynağı alabilir. Promise'i üst bileşenden veya kararlı bir cache'ten geçir; use çağrısını event handler'a koyma. Context okunurken koşullu kullanım istisnası, başka Hook'ları koşullu çağırma izni değildir.

### Sınır kararları

:::mistake[Action hatasını başarı mesajı sanmak]
**Belirti:** Ağ isteği reddedildiği halde kullanıcı yalnızca eski başarı metnini görüyor. **Neden:** Başarı sonucu ile ağ hatası aynı state alanı gibi ele alınmış. **Düzeltme:** Action içinde beklenen hata durumunu yakala ve kullanıcıya dönülecek sonucu açıkça modelle; beklenmeyen hataları da uygulamanın error boundary veya hata işleme politikasına bırak.
:::

:::mistake[Form alanının değerini Action'a ulaşır sanmak]
**Belirti:** formData.get('note') sürekli null dönüyor. **Neden:** Alanın name niteliği yok veya input formun dışında. **Düzeltme:** Gönderilecek her form kontrolüne sabit name ver ve gerçek FormData değerini doğrula.
:::

:::mistake[Optimistic sonucu sunucu onayı gibi kullanmak]
**Belirti:** İstek reddedildiği halde sonraki işlem yanlış değer üzerinden hesaplanıyor. **Neden:** shown kalıcı temel değer olarak saklanmış. **Düzeltme:** Sunucu onayını temel state'te tut; optimistic görünümü yalnız pending geçişine bağla.
:::

### Sık hatalar

:::mistake
**Belirti:** kayıt başarısız olsa da kalp dolu kalır. **Neden:** geçici değer temel state yapılmıştır. **Düzeltme:** sunucu onayını temel state'te, tahmini ayrı tut.
:::

:::mistake
**Belirti:** form iki kez gönderilir. **Neden:** pending süresince düğme kullanılabilir kalır. **Düzeltme:** isPending değerini disabled niteliğine bağla.
:::

:::mistake
**Belirti:** Suspense sürekli fallback gösterir. **Neden:** Promise bileşen gövdesinde yeniden yaratılır. **Düzeltme:** Promise'i üst katmandan veya kararlı cache'ten al.
:::

:::sector
Ekipler optimistic davranışı gecikmesi kullanıcıya görünen ve başarısızlıkta geri alınabilen işlemlerde kullanır. Yerel Redux seçimi ağ beklemiyorsa optimistic katman kurma. Sunucu state'i paylaşılacaksa TanStack Query cache'i ile geçici görünümün sorumluluğunu ayır.
:::

## Özet

- Action asenkron işi ve bekleme süresini temsil eder.
- useActionState form sonucunu ve pending durumunu taşır.
- useOptimistic bekleme tahminini onaylanmış state'ten ayırır.
- Başarı temel state'i günceller; hata geçici görünümü geri alır.
- use(promise) Promise'i Suspense sınırında okumak içindir.

### Kendini yokla

**İstek hata verince optimistic değer neden geri döner?** Temel state güncellenmediği için React geçici görünümü kaldırınca eski değer görünür.

**Form submit düğmesi ne zaman kapanır?** Action isPending iken.
