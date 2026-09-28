---
title: "Mutation hatasını doğru yerde göster"
minutes: 13
kind: concept
---

# Mutation hatasını doğru yerde göster

:::pain[Problem]
Bir etkinliğe katılım kaydı 503 ile reddedildi. Katıl düğmesinde kısa bir hata göründü; kullanıcı başka sayfaya gidince mesaj kayboldu. Operasyon ekibi de başarısız yazma sayısının arttığını göremedi.
:::

## Hata mesajının sahibi

Her hatayı tek bir yere koymak doğru değildir. Bir alanın değeri geçersizse düzeltme o alanın yanında istenir. Bir mutation belirli bir kartta başarısızsa yerel `isError` durumu o kartta kalabilir. Kullanıcı route değiştirince de görünmesi gereken genel bağlantı sorunu, ortak bildirim katmanına taşınabilir. Teknik kayıt ise kullanıcı mesajından ayrı tutulur.

TanStack Query mutation’ında `onError`, mutation’a özgü toparlanmayı çalıştırır. Bu callback cache rollback’i yapabilir veya yerel bağlama ait veriyi temizleyebilir. `MutationCache` içindeki global `onError` ise tüm mutation’lardan gelen hatalar için ortak loglama ya da bildirim sınırı sağlar. İki callback de çalışabilir; aynı olayı iki kez toast etmek istemiyorsan global politikanın hangi hataları göstereceğini tanımla.

:::model[Mutation ve invalidation]
Mutation sonucu önce sunucu yazmasını temsil eder; optimistic cache yazısı hata gelirse rollback edilir, ilgili query’ler yeniden doğrulanır. Hata stratejisinde yeni soru şudur: rollback’i hangi callback yapar, kullanıcıya mesajı hangi UI sahibi gösterir, teknik olayı kim kaydeder? Bu sorumlulukları karıştırmak aynı hatayı iki kez göstermeye veya hiç göstermemeye yol açar.
:::

## Yerel hata ile uygulama geneli bildirim

Yerel bileşen, `mutation.isError` ve `mutation.error` üzerinden yalnız kendi işlemini anlatır. Örneğin “Katılım kaydedilemedi. Tekrar dene.” mesajı, kullanıcının hangi eylemin başarısız olduğunu anlamasını sağlar. Hata mesajını doğrudan `error.message` ile göstermek güvenli değildir: sunucu iç sistem bilgisi, URL veya kullanıcıya uygun olmayan bir metin döndürebilir.

Global callback’i `QueryClient` oluşturulurken `MutationCache`’e bağlarsın. `QueryClient` uygulama ömrü boyunca tek olmalı; her render’da yenisini oluşturmak cache ve callback sahipliğini parçalar. Genel callback’te sınıflandırma yapabilirsin: session süresi dolduysa oturum akışını başlat, ağ hatasıysa genel uyarı ver, alan doğrulama hatasını forma bırak.

```ts
const client = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => reportFailure(error),
  }),
})
```

Bu kesitte `MutationCache` ve `QueryClient` import edilmemiştir; gerçek dosya başında `@tanstack/react-query`’den import et. Önemli ayrım, callback’in `QueryClient` kurulurken bir kez tanımlanmasıdır. Her component’te ayrı global callback kurma.

## Bir hatayı izleyelim

Bir etkinliğe katılım için POST gönderiliyor ve sunucu 503 dönüyor. `joinEvent` HTTP hata cevabında `throw` ettiği için mutation reject olur.

| Adım | Mutation | Yerel arayüz | Genel katman |
| --- | --- | --- | --- |
| 1 | `pending` | Düğme “Kaydediliyor…” | Henüz bildirim yok |
| 2 | `error` | Kartta tekrar deneme mesajı | Global logger olayı kaydeder |
| 3 | Kullanıcı retry seçer | Pending yeniden başlar | Eski hata toast’ı temizlenir |
| 4 | İstek başarıyla çözülür | Başarı durumu görünür | Yeni hata kaydı oluşmaz |

Global hata callback’i event’i loglayabilir; ama toast gösterme kararı yerel UI ile çakışabilir. Örneğin route içindeki alan doğrulama mesajı daha açıklayıcıysa global callback onu genel “İşlem başarısız” toast’ıyla örtmemelidir. Uygulamada hata sınıfı veya mutation meta bilgisiyle bu ayrımı kur.

## Promise davranışı ve görünür mesaj

`mutate` hata durumunu mutation nesnesine yazar ve unhandled Promise bırakmaz. `mutateAsync` ise reject olur. Onu event handler’da `await` ediyorsan hatayı yakala:

```tsx
async function submit() {
  try {
    await mutation.mutateAsync(input)
  } catch {
    // Yerel hata mutation nesnesinde; kullanıcı metni render edilir.
  }
}
```

`catch` içinde hatayı sessizce yutmak çözüm değildir; ekranda `mutation.isError` üzerinden mesajı göstermelisin. Alternatif olarak `mutation.mutate(input)` çağırıp Promise zincirini handler’a taşımadan Query durumunu render et. Event handler’ın amacı yalnız kullanıcı eylemini başlatmaksa bu yol daha yalındır.

Toast, form hatası ve log farklı ihtiyaçları karşılar. Toast kısa ve genel olabilir; form mesajı hangi değerin reddedildiğini söyler; log ise hata türü, route ve correlation id gibi destek bilgisini taşır. Token, session id ve kişisel veri log’a gereksiz yere eklenmemelidir. UI mesajı sunucunun ham hata cevabını kopyalamak zorunda değildir.

## Kırık kullanım ve doğru yerleşim

Kırık örnek, reject eden Promise’i yakalamadan event handler’da başlatır:

```tsx
<button onClick={() => mutation.mutateAsync(input)}>Katıl</button>
```

React event callback’i dönen Promise’i otomatik olarak hata UI’ına çevirmez. `mutateAsync` reject olunca console’da yakalanmamış Promise uyarısı çıkabilir. Ya `mutate` kullan ya da `mutateAsync` için `try/catch` ekle. Aşağıda `mutate` ile yerel UI ve bir kez kurulan global logger birlikte kullanılıyor:

```tsx check
import { useMutation, useQueryClient } from '@tanstack/react-query'

type Input = { clubId: string; note: string }
declare function sendInvitation(input: Input): Promise<void>

export function InviteButton({ clubId }: { clubId: string }) {
  const client = useQueryClient()
  const invite = useMutation({
    mutationFn: sendInvitation,
    onError: () => {
      client.setQueryData(['invite-draft', clubId], { failed: true })
    },
  })
  return (
    <div>
      <button
        disabled={invite.isPending}
        onClick={() => invite.mutate({ clubId, note: 'Merhaba' })}
      >
        Davet gönder
      </button>
      {invite.isError && <p role="alert">Davet gönderilemedi. Yeniden deneyebilirsin.</p>}
    </div>
  )
}
```

Burada `onError` cache’te taslak hata işareti tutan örnek sorumluluktur; gerçek uygulamada bu verinin ne zaman temizleneceği de belirlenmelidir. Global bildirimi bu callback’e koymadık; onu QueryClient seviyesinde bir kez kur. Böylece component yalnız kendi mesajını yönetir.

Global `MutationCache` callback’i, her mutation için çalışabilecek bir uygulama politikasıdır. “Her hata için toast” kuralı kullanıcıyı bildirim yağmuruna tutabilir; aynı anda üç arka plan kaydı başarısız olursa tek bir özet bildirim daha iyi olabilir. Mutation’lara `meta` bilgisi ekleyerek sessiz olması gereken arka plan işlerini veya kullanıcı mesajı sorumluluğu yerel formda olan doğrulama isteklerini ayırabilirsin. Global callback için kararları açık yaz; callback’i gizli bir yan etki deposuna dönüştürme.

Hata nesneleri farklı kaynaklardan gelir. Ağ kesintisinde `fetch` reject olur; HTTP 500 için `response.ok` false olur ve uygulama kendisi hata fırlatmalıdır; JSON parse hatası başka bir hata sınıfıdır. Log’da bu ayrım destek ekibine yardımcı olur, fakat kullanıcı mesajı bunların hepsini “Bağlantı kurulamadı” diye yanlış sınıflandırmamalı. API hata tiplerini projede merkezileştirmek, bileşenlerin her biri için ayrı string karşılaştırması yapmasını önler.

Retry politikası da hata stratejisinin parçasıdır. Query okumaları güvenli şekilde tekrar denenebilir; mutation tekrarlandığında yazma iki kez uygulanabilir. Bu nedenle mutation retry’ını API’nin idempotency sözleşmesi olmadan otomatik açma. Kullanıcıya retry düğmesi sunuyorsan önceki isteğin sunucuda işlenmiş ama cevabının kaybolmuş olabileceğini hesaba kat.

:::mistake[İki kez aynı bildirim]
Belirti → Hata olduğunda toast iki defa çıkıyor. Neden → Mutation `onError` ve global `MutationCache.onError` ikisi de aynı toast’ı gösteriyor. Düzeltme → Kullanıcı bildirimini tek katmana ver; diğer callback log veya rollback yapsın.
:::

:::mistake[Promise hatasını saklamak]
Belirti → `mutateAsync` sonrası konsolda unhandled rejection var. Neden → Promise await edildi ama `catch` eklenmedi. Düzeltme → `try/catch` ile hatayı ele al veya UI odaklı akışta `mutate` kullan.
:::

:::mistake[Sunucu metnini doğrudan göstermek]
Belirti → Ekranda teknik stack, HTML veya hassas istek bilgisi çıkıyor. Neden → Ham `error.message` kullanıcıya basıldı. Düzeltme → Hata türünü sınıflandır ve güvenli, eylem belirten metin üret.
:::

:::sector
Ürün ekipleri hata sahipliğini bir tabloda kararlaştırır: form doğrulaması alanın yanında, tek eylem bileşen yanında, bağlantı kopması global toast’ta, beklenmeyen hata izleme sisteminde. Bu ayrım kullanıcıya tekrar yolunu gösterir ve aynı hata için çift bildirimleri önler.
:::

## Özet

- Yerel mutation durumu işlemi başlatan UI’a ait olabilir.
- `MutationCache.onError` ortak loglama/bildirim politikası için QueryClient’ta kurulur.
- `mutateAsync` reject eder; `try/catch` gerekir. `mutate` hatayı mutation durumuna yazar.
- Ham sunucu hata metnini doğrudan göstermek yerine güvenli mesaj seç.
- Rollback, kullanıcı bildirimi ve teknik log farklı sorumluluklardır.

**Kendini yokla:** Global hata callback’i varsa yerel `isError` mesajı gereksiz midir?  
Cevap: Hayır. Global callback ortak sinyal veya log verir; yerel mesaj hangi eylemin başarısız olduğunu anlatır.

**Kendini yokla:** `mutateAsync` çağrısını event handler’da başlatınca neden `try/catch` gerekir?  
Cevap: Bu fonksiyon reject eden Promise döndürür; yakalanmazsa unhandled rejection oluşur.
