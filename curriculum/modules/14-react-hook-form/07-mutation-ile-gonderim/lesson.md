---
title: "Formu mutation ile güvenle gönder"
minutes: 15
kind: concept
---

# Formu mutation ile güvenle gönder

:::pain[Geçerli form, başarısız istek]
Bir kulüp duyurusu formunda başlık ve metin kuralları geçiyor; kullanıcı gönderiyor. API 500 dönüyor, ama ekranda başarı mesajı var ve input'lar temizlenmiş. Formun geçerli olması sunucunun kaydı tamamladığı anlamına gelmiyor.
:::

## Form ile ağ isteğinin sınırı

RHF alanları toplar ve istemci kurallarını çalıştırır. TanStack Query `useMutation` ise yazma isteğinin pending, success ve error yaşam döngüsünü yönetir. Her katmanın tek sorumluluğu olduğunda “alan hatası” ile “sunucu isteği başarısız” ayrılır. Önceki modülde öğrendiğin mutation/invalidation modeli burada form değerinin ne zaman temizleneceğini belirler.

![Mutation, sunucu cevabı ve invalidation akışı](diagram:mutation-ve-invalidation)

:::model[Mutation ve invalidation]
Mutation başlar, sunucu sonucu gelir; başarıdan sonra ilgili cache'i invalidate edebilir, hata durumunda işlemi geri alıp kullanıcıya bildirebilirsin. Bu derste form reset'i aynı başarı sınırına bağlanır: istek kabul edilmeden kullanıcı girdisi silinmez.
:::

Kesin akış:

1. `handleSubmit` alanları doğrular. Geçersiz formda mutation hiç başlamaz.
2. Geçerli değerler mutation fonksiyonuna aktarılır. RHF doğrulaması ile API sözleşmesi ayrı kontrollerdir.
3. Mutation pending iken çift submit'i engelle ve kullanıcıya beklediğini göster.
4. `fetch` için HTTP 4xx/5xx otomatik olarak Promise'i reject etmez. `response.ok` kontrolü yapıp başarısız cevabı kendin hata haline getir.
5. Başarıda olumlu geri bildirim, reset ve gerekiyorsa query invalidation çalışır.
6. Hata durumunda alan değerlerini koru, hata mesajını göster ve yeniden denemeye izin ver.

## İki durum makinesini izleyelim

Bir kulüp duyurusu formunda başlık zorunlu olsun. Form alanı `title` ve mutation durumu birlikte ilerler:

| An | RHF | Mutation | Kullanıcıya görünen |
|---|---|---|---|
| Form boş | required hatası üretmeye hazır | idle | Başlık alanı |
| Geçersiz submit | `onValid` çalışmaz | idle | “Başlık gerekli” |
| Geçerli submit | `onValid` çalışır | pending | “Gönderiliyor…”, düğme kapalı |
| Sunucu 500 | alan değeri korunur | error | “Kaydedilemedi; tekrar dene” |
| Düzeltme ve retry | geçerli değer | pending | İstek sürüyor |
| Sunucu 201 | başarı sonucu | success | “Duyuru eklendi”; sonra reset |

Burada `formState.isSubmitting` ile `mutation.isPending` aynı kavram değildir. `mutate(values)` senkron döndüğü için RHF callback'i ağ bitmeden sona erebilir; bu durumda ağ düğmesini mutation'ın pending bilgisiyle kapat. `await mutation.mutateAsync(values)` kullanırsan callback Promise'i bekler ve RHF submit durumunu da ağ süresince tutar. Birden çok bağımsız işlem varsa hangi bekleme göstergesinin hangi işi kapsadığını seç.

## Önce yanlış başarı, sonra açık hata

HTTP hatasını başarı gibi yorumlayan yalın fonksiyon:

```ts
async function postNotice(values: NoticeValues) {
  const response = await fetch('/api/notices', {
    method: 'POST',
    body: JSON.stringify(values),
  })
  return response.json()
}
```

`fetch` 500 cevabında resolve olduğu için JSON okunur ve mutation başarıya düşebilir. Başarıyı HTTP durumuyla ayır:

```tsx check
import { useMutation } from '@tanstack/react-query'

type NoticeValues = { title: string }

async function sendNotice(values: NoticeValues): Promise<void> {
  const response = await fetch('/api/notices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  if (!response.ok) throw new Error(`Kayıt başarısız: ${response.status}`)
}

export function useNoticeMutation() {
  return useMutation({ mutationFn: sendNotice })
}
```

Bu kod mutation'ı tek başına kurar; formda `handleSubmit((values) => mutation.mutate(values))` ile bağlanır. UI `mutation.isError` ve `mutation.isSuccess` durumlarını metne çevirir. Başarıdan sonra cache gerekiyorsa `onSuccess` içinde uygun key'i invalidate et; her mutation tüm cache'i temizlememeli.

## Reset zamanı ve veri sahipliği

Bir kullanıcı duyuru metnini gönderdiğinde önce form state ile mutation payload'ı ayrılır; payload değişmez bir submit anı fotoğrafıdır. Kullanıcı bekleme sırasında başka bir değer yazabiliyorsa eski isteğin başarısı yeni taslağı yanlışlıkla silebilir. Genellikle pending sırasında submit alanlarını kilitlemek en kolay çözümdür. İzin verilecekse başarı sonrası hangi değerlerin temizleneceğini açıkça karşılaştır.

Mutation hata verdiğinde `reset()` çağırma. Hata metni form alanına ait değilse onu formun üstünde genel `role="alert"` olarak gösterebilirsin; alan hatalarını ayrı tut. Sunucu belirli bir alanı reddediyorsa RHF `setError('title', ...)` veya `root.server` gibi form seviyesi hata kanalı kullanılabilir. Sunucu mesajını kullanıcıya ham biçimde basmak yerine ürün diline uygun, eyleme dönük metne çevir.

## Sık hatalar

:::mistake[500 yanıtı başarı sayılıyor]
**Belirti:** Mutation başarılı görünür ama kayıt oluşmamıştır. → **Neden:** `fetch` HTTP hata durumlarında reject olmaz. → **Düzeltme:** `response.ok` false ise hata fırlat; başarı UI'si yalnız gerçek başarılı yanıtta çalışsın.
:::

:::mistake[Pending sırasında ikinci kayıt gidiyor]
**Belirti:** Hızlı çift tıklamada aynı kayıt iki kez oluşturuluyor. → **Neden:** Submit düğmesi ağ işi sürerken açık kalmış. → **Düzeltme:** `mutation.isPending` ile düğmeyi devre dışı bırak ve pending metnini göster.
:::

:::mistake[Form daha cevap gelmeden temizleniyor]
**Belirti:** Ağ koptu, kullanıcının yazısı kayboldu. → **Neden:** Reset mutation başlamadan ya da Promise sonucunu beklemeden çağrıldı. → **Düzeltme:** Reset'i `onSuccess`'e veya `await mutateAsync` sonrasındaki başarı dalına al.
:::

:::sector
Üretim uygulamalarında kullanıcıya belirsiz hata kodu değil, tekrar denenebilir ve doğru geri bildirim verilir. Takım mutation fonksiyonlarında HTTP durumunu açıkça kontrol eder; başarı sonrası hangi query'lerin invalidate edileceğini domain davranışına göre belirler. Formu silmek de cache'i yenilemek de başarı koşuluna bağlı kalır.
:::

## Gönderim verisi ile cache güncellemesi

Bir mutation başarılı olduğunda ekrandaki liste eski query cache'inden geliyorsa yalnız formu temizlemek yeterli değildir. Yeni yorum veya kayıt mevcut liste görünümüne ekleniyorsa hedef query'yi invalidation ile yenile ya da cevaptan gelen kesin veriyi `setQueryData` ile ekle. Hata olduğunda invalidation çoğu akışta gereksizdir; sunucu yeni kayıt oluşturmadı. Önceki modülde kurduğun mutation/invalidation modelini kullan, tüm query cache'ini gelişigüzel silme.

Optimistic update ancak kullanıcıya anında eklenmiş gibi göstermek gerçekten değerliyse gerekir. Form gönder düğmesini bekleme sırasında kapatmak basit ve güvenlidir; yorum listesini anında güncellemek için optimistic davranış eklemek hata halinde rollback gerektirir. Form başarı sınırı ile cache görünüm sınırı aynı karar değildir: mutation sunucuda başarılı olabilir, ama query refetch ayrıca hata alabilir. Kullanıcıya hangisinin başarısız olduğunu doğru söyle.

Mutation callback'lerinde birden çok form örneği varsa her `mutate` çağrısına ait callback değerlerinin yaşam süresini de dikkate al. `onSuccess` değerleri mutation response ve gönderilen değişkenleri alır; form reset'ini doğru instance'a bağla. Paylaşılan callback'in başka bir açık formu yanlışlıkla temizlemesine izin verme. Basit tek formda callback içinde `await mutateAsync(values)` sonrası reset akışı okunaklıdır.

Bir başka sınır 204 cevabıdır: başarılı HTTP cevabı gövdesiz olabilir. `response.ok` true olsa bile her endpoint'te `response.json()` çağırma. Server'ın gövde sözleşmesine göre parse et; formun başarı mesajı için response body gerekmiyorsa body okumadan başarılı kabul et. Bu, mutation fonksiyonunu endpoint davranışına uygun tutar.

Mutation hata mesajında güvenli bilgi kullan. Sunucu ayrıntılı stack trace, SQL mesajı veya ham HTML döndürse bile bunu doğrudan kullanıcıya göstermemelisin; teknik ayrıntı log/izleme sistemine, kullanıcıya eylem öneren genel metin gider. Ağ offline ise de bir HTTP response olmayabilir; `fetch` reject eder ve aynı error UI'si bu ağ hatasını kapsamalıdır.

Kullanıcı isteği başlatıp ekranı terk ettiğinde mutation devam edebilir. Bileşen unmount olduktan sonra `setState` ile kendi hata/başarı mesajını güncelleme uyarısı alabilecek özel implementasyonlardan kaçın; TanStack Query mutation state'ini cache seviyesinde yönetir. Form component'i başka mutation'ın sonucunu yanlış ekrana yazmamalı. Aynı butona bir kez basma kuralı basit ama çoğu formun doğru varsayılanıdır.

## Özet ve kendini yokla

- RHF istemci alanlarını, mutation ağ yazma işlemini yönetir.
- `fetch` için `response.ok` kontrolü gerekir; 500 kendi başına throw etmez.
- Ağ pending durumunu mutation'dan oku; hata sonrası girdiyi koru, başarıdan sonra reset/invalidation yap.

**Kendini yokla:** `isSubmitting` neden `mutate` isteğinin sonuna kadar true kalmayabilir? `mutate` await edilebilir Promise döndürmez. 500'de neden `throw` gerekir? Aksi halde mutation başarı state'ine geçebilir.
