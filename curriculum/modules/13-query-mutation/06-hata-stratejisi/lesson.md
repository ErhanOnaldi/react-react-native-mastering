---
title: "Mutation hatasını doğru yerde göster"
minutes: 16
kind: concept
---

# Mutation hatasını doğru yerde göster

Sinema’da film puanlamak bir yazma işlemidir: arayüz sunucuya puanı gönderir ve cevap bekler. İstek başarısız olursa kullanıcının hangi işlemin aksadığını anlaması gerekir. Bir hata yalnızca puanlama kartını etkileyebilir; başka bir hata için kullanıcı route değiştirdikten sonra da görünen ortak bildirim gerekebilir. Önce hatayı kartta gösterelim, sonra uygulama düzeyindeki ortak katmanı ekleyelim.

## Hata, başladığı kartta görünsün

Bir mutation işlemi `pending`, `success` veya `error` gibi durumlarda olabilir. `pending` sürerken sonuç belli değildir; `error` olduğunda mutation nesnesi hatayı saklar. Bu nesneyi kullanan bileşen, kendi düğmesinin yanında eyleme özel bir mesaj gösterebilir. Böylece kullanıcı “hangi işlem başarısız oldu?” sorusunun cevabını hemen görür.

İlk örnek, bir film için izleme listesine ekleme düğmesidir. `useMutation` yazma isteğini başlatır; `isPending` düğme metnini, `isError` ise karttaki açıklamayı belirler. Bu mesaj yalnız bu bileşene ait olduğu için başka route’taki işlemlerle karışmaz.

```tsx check
import { useMutation } from '@tanstack/react-query'

declare function saveForLater(movieId: number): Promise<void>

export function SaveFilmButton({ movieId }: { movieId: number }) {
  const save = useMutation({ mutationFn: saveForLater })
  return (
    <div>
      <button disabled={save.isPending} onClick={() => save.mutate(movieId)}>
        {save.isPending ? 'Kaydediliyor…' : 'İzleme listeme ekle'}
      </button>
      {save.isError && <p role="alert">Film listeye eklenemedi. Tekrar deneyebilirsin.</p>}
    </div>
  )
}
```

Ne oldu? Düğmeye basınca mutation `pending` olur, düğme işlemi tekrar başlatmaya kapatılır. İstek hata verirse bu mutation `error` olur ve bileşen kendi hata metnini gösterir. Hata başka bir bileşenin mesajını değiştirmez. Bu yaklaşım, kullanıcının aynı kartta düzeltebileceği veya tekrar deneyebileceği işler için uygundur.

Ham `error.message` değerini olduğu gibi ekrana basma. Sunucu hata gövdesinde teknik ayrıntı, HTML veya kullanıcıya gösterilmemesi gereken bilgi olabilir. UI’da güvenli ve eylemi anlatan bir metin seç; hata nesnesini teknik inceleme için ayrı kaydet. Ayrıca `fetch`, HTTP 500 gördüğünde kendiliğinden reject olmaz; kodun `response.ok` kontrol edip hata fırlatması gerekir. Yoksa mutation başarısızlığı sanman gereken yanıt `success` gibi görünebilir.

## Ortak hata karttan sonra da yaşayabilir

Bir hatayı yalnız tıklanan bileşende göstermek her zaman yetmez. Örneğin kullanıcı puanlama kartından başka route’a geçmiştir; uygulama, puan kaydetmenin başarısız olduğunu ortak bir alanda bildirmek isteyebilir. Bu politikanın sahibi **MutationCache**’tir: TanStack Query’nin mutation kayıtlarını ve ortak callback’lerini tuttuğu yerdir. QueryClient oluşturulurken ona bir `MutationCache` verip global `onError` callback’i bağlayabilirsin.

İkinci örnek yalnız ortak teknik kayıt üretir. Logger, hatayı gözlemleme sistemine yollar; kullanıcı mesajı üretme kararı hâlâ ayrı verilebilir. Global callback her başarısız mutation için çalıştığından bunu her düğme render’ında tekrar kurmamalısın.

```ts check
import { MutationCache, QueryClient } from '@tanstack/react-query'

type FailureLog = (error: Error) => void

export function createMovieClient(logFailure: FailureLog) {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error) => logFailure(error),
    }),
  })
}
```

Ne oldu? Uygulamanın bu client’ını kullanan her mutation başarısız olduğunda ortak callback çağrılır. `MutationCache` kullanıcı arayüzü çizmez; yalnız uygulamanın genel politikasını çalıştırır. Client tek uygulama ömrü boyunca kullanılır, bu yüzden bir kere kurulan logger route değişse de erişilebilir kalır.

Birçok uygulamada yerel `onError` ile global callback aynı anda çalışabilir. Örneğin yerel callback optimistic cache değişikliğini geri alırken global callback hatayı kayda geçirir. Bunlar farklı sorumluluklardır. İkisi de aynı toast mesajını gösterirse kullanıcı aynı hatayı iki defa görür; her callback’in ne yaptığı açık olmalı.

## Yerel mesaj ve global kayıt birlikte çalışsın

Üçüncü örnekte puan kaydetme düğmesinin yerel hata metni korunuyor; global katman da hatayı kayıt altına alıyor. Tek yeni unsur sorumlulukların birlikte çalışması: bileşen kullanıcıya kendi işlemini anlatırken client ortak teknik sinyali alır. Global kaydı `QueryClient` fabrikası içinde zaten kurduğumuzu varsayıyoruz.

```tsx
import { useMutation } from '@tanstack/react-query'

declare function rateMovie(input: { movieId: number; value: number }): Promise<void>

export function QuickRate({ movieId }: { movieId: number }) {
  const rate = useMutation({ mutationFn: rateMovie })
  return (
    <section>
      <button onClick={() => rate.mutate({ movieId, value: 8 })}>8 puan ver</button>
      {rate.isError && <p role="alert">Puan kaydedilemedi. Yeniden deneyebilirsin.</p>}
    </section>
  )
}
```

Ne oldu? İstek reddedilince bileşen `isError` üzerinden puanlama mesajını gösterir. Aynı anda QueryClient’a bağlı global `onError` teknik kaydı yazar. Kart mesajı kullanıcıya “hangi eylem?” sorusunu, global callback ise uygulamanın ortak kayıt ihtiyacını karşılar. Bildirim gösterecek global politika eklersen, yerel UI ile aynı mesajı iki kere üretmemesine dikkat et.

Bir `mutate` çağrısı hatayı mutation state’ine yazar; kullanımını ayrıca `await` etmek gerekmez. `mutateAsync` ise sonucu Promise olarak verir ve hata olduğunda reject eder. Handler içinde onu `await` ediyorsan `try/catch` ekle. Catch içinde hatayı sessizce yutmak yeterli değildir: yerel bir mesaj göster veya hatayı uygun üst katmana ilet.

Zaman sırasını aynı film puanlamasında görelim. Bir callback’in görevi ekranın durumunu değiştirmek olabilir; diğeri uygulama düzeyinde kayda geçmek olabilir. Başarılı cevap geldiyse hata callback’leri çalışmaz.

| Zaman | Mutation | Yerel kart | Global callback |
| --- | --- | --- | --- |
| t0 | Henüz başlamadı | “8 puan ver” | Bekliyor |
| t1 | `pending` | İstek sürüyor | Bekliyor |
| t2-hata | `error` | “Puan kaydedilemedi” görünür | Hata bir kez kaydedilir |
| t3-tekrar | Kullanıcı yeniden dener, `pending` | Tekrar deneme sürüyor | Yeni sonuç beklenir |
| t4-başarı | `success` | Hata mesajı kalkar | Yeni hata kaydı oluşmaz |

`mutateAsync` kullanıp reddedilen Promise’i yakalamazsan konsolda unhandled rejection uyarısı görebilirsin. “Butona bastım, ekranda mesaj var” olsa bile yakalanmamış hata geliştirici konsolunda kalabilir. Ya Promise döndürmeyen `mutate` yoluyla mutation state’ini çiz, ya da `mutateAsync` için `try/catch` kullan ve UI mesajını unutma.

:::mistake[İki kere bildirim]
Belirti → Başarısız puanlamada aynı toast iki kez beliriyor. Neden → Mutation’ın yerel `onError` callback’i ve global `MutationCache.onError` aynı bildirimi ayrı ayrı açıyor. Düzeltme → Kullanıcı bildirimini tek katmana ver; diğer callback’i rollback veya teknik kayıt için kullan.
:::

:::mistake[Sunucu metnini doğrudan göstermek]
Belirti → Ekranda API adresi, teknik stack veya HTML görünüyor. Neden → Ham `error.message` kullanıcı metni gibi basılmış. Düzeltme → Hata türüne göre güvenli, yapılacak işi anlatan metin seç; ham hatayı yalnız uygun teknik kayda gönder.
:::

Hata tekrarı da yazma işleminin anlamına bağlıdır. Bir okuma isteğini tekrar etmek çoğu zaman güvenlidir; puan eklemek veya kaydı silmek iki kere uygulanabilir. Mutation için otomatik retry açmadan önce API’nin aynı isteğin tekrarlanmasını nasıl ele aldığını bil. Kullanıcının “Tekrar dene” düğmesi sunucu ilk isteği uyguladıktan sonra cevabın kaybolması durumunu da çözmez.

:::info[Derinlemesine (isteğe bağlı)]
API’nin tekrarlanan yazmayı aynı işlem saymasını sağlayan anahtar veya sözleşmeye **idempotency** denir. Örneğin aynı istek anahtarıyla gelen ikinci puan kaydı yeni bir kayıt üretmeyebilir. Bu sözleşme API ile birlikte tasarlanır; istemcide gelişigüzel bir anahtar üretmek tek başına güvence sağlamaz. Bir bildirimi farklı log kayıtlarıyla eşlemek için kullanılan **correlation id** de destek ekibinin iz sürmesine yarayan bir kimliktir. `meta` ise mutation tanımına uygulamaya özgü ek bilgi koymaya yarar; sessiz mutation gibi global politika ayrımlarında kullanılabilir. Bunlar bu dersteki ortak callback’i kurmak için gerekli değildir.
:::

## Özet

- Yerel mutation state’i, başlatıldığı kartta o eyleme özgü mesaj gösterebilir.
- `MutationCache` QueryClient içindeki mutation kayıtları ve ortak callback’ler için kullanılan yapıdır.
- Global `onError` her başarısız mutation’da çalışabilir; QueryClient oluşturulurken bir kere kurulur.
- Yerel rollback, kullanıcı mesajı ve teknik kayıt farklı işlerdir; aynı toast’ı iki katmanda gösterme.
- `mutateAsync` reject eden Promise döndürür ve `try/catch` ister; `mutate` hatayı mutation state’inde tutar.

**Yeni terimler**

- **MutationCache:** QueryClient’ın mutation kayıtlarını ve onlara ait ortak callback’leri tuttuğu yer.
- **Global `onError`:** Uygulama genelinde her başarısız mutation için çalışan hata callback’i.
- **Idempotency:** Aynı yazma isteği tekrarlanınca etkisinin ikinci kez uygulanmamasını sağlayan API sözleşmesi.
- **Correlation id:** Bir isteği log ve servis kayıtlarında izlemeyi kolaylaştıran ortak kimlik.
- **`meta`:** Mutation tanımında uygulamanın kendi politikasına ayırdığı ek bilgi alanı.

**Kendini yokla:** Global hata callback’i varsa puan kartında neden `isError` mesajı tutulabilir?

Cevap: Global callback ortak kayıt veya bildirim içindir; yerel mesaj hangi eylemin başarısız olduğunu söyler.

**Kendini yokla:** `mutateAsync` çağrısını event handler’da `await` ediyorsan ne eklemelisin?

Cevap: Reject eden Promise’i yakalamak için `try/catch`; ayrıca kullanıcıya uygun hata UI’ı göstermelisin.
