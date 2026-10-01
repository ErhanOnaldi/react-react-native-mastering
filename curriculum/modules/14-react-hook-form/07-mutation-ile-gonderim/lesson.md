---
title: "Formu mutation ile güvenle gönder"
minutes: 17
kind: concept
---

# Formu mutation ile güvenle gönder

Bir film listesine yeni bir kayıt eklediğini düşün. Formdaki alanlar dolu ve kurallara uygun olabilir; yine de sunucuya giden istek başarısız olabilir. Formun geçerli olması, kaydın sunulduğu anlamına gelmez. Bu iki sonucu ayırınca hem bekleme mesajını hem de formu ne zaman temizleyeceğini doğru seçebilirsin.

## Bir kaydı gönderirken iki ayrı iş var

RHF, form alanlarını ve onların doğrulama durumunu yönetir. TanStack Query'deki `useMutation` ise sunucuya veri yazan isteğin durumunu yönetir. Böyle bir yazma isteğine **mutation** denir. Alan kontrolü “bu metin boş mu?” diye sorar; mutation “sunucu kaydı kabul etti mi?” diye sorar. İkisi farklı sorular olduğu için tek bir başarı durumuna indirgenmemelidir.

### 1. örnek: Sunucuya veri gönder

Önce formu düşünmeden, Sinema'da film listesine kısa bir not gönderen fonksiyona bakalım:

```ts check
type Note = { filmId: number; text: string }

async function sendNote(note: Note): Promise<void> {
  const response = await fetch('/api/film-notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
  if (!response.ok) throw new Error('Not kaydedilemedi')
}
```

Fonksiyon, sunucu cevabına kadar bekler ve başarısız HTTP cevabını hata olarak işaretler. `fetch` 400 veya 500 gibi HTTP durumlarında Promise'i kendiliğinden reddetmez; `response.ok` kontrolü bu yüzden gereklidir. Promise, daha sonra tamamlanacak işi temsil eden değerdir; `await` sonucu gelene kadar bu fonksiyonun devamını bekletir.

### 2. örnek: İsteğin durumunu mutation ile izle

TanStack Query mutation'a isteği verince bekleme, başarı ve hata durumlarını izler. Aşağıdaki hook, aynı not gönderme işini bu yaşam döngüsüne bağlar:

```tsx check
import { useMutation } from '@tanstack/react-query'

type Note = { filmId: number; text: string }

async function sendNote(note: Note): Promise<void> {
  const response = await fetch('/api/film-notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
  if (!response.ok) throw new Error('Not kaydedilemedi')
}

export function useSendNote() {
  return useMutation({ mutationFn: sendNote })
}
```

Bu hook ağ işini ve onun durumunu bir araya getirir. Bileşen `mutate(note)` çağırdığında `isPending` bekleyen istekte, `isSuccess` başarılı cevapta, `isError` hata durumunda true olur. Şimdi bu durumları formun kendi submit durumundan ayrı okuyabiliriz.

### 3. örnek: Formu gönder ve yalnızca başarıda temizle

Film için not alan bir form mutation'ı çağırabilir. Bu örnek, formu düğmeye bağlamayı ve sonuç mesajını göstermeyi ekler:

```tsx check
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

type Note = { filmId: number; text: string }
type NoteFields = { text: string }

async function sendNote(note: Note): Promise<void> {
  const response = await fetch('/api/film-notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
  if (!response.ok) throw new Error('Not kaydedilemedi')
}

export function FilmNoteForm({ filmId }: { filmId: number }) {
  const { register, handleSubmit, reset } = useForm<NoteFields>({
    defaultValues: { text: '' },
  })
  const mutation = useMutation({ mutationFn: sendNote })

  async function save(fields: NoteFields) {
    try {
      await mutation.mutateAsync({ filmId, text: fields.text })
      reset()
    } catch {
      // mutation.isError mesajı gösterir; form değerleri olduğu gibi kalır.
    }
  }

  return (
    <form onSubmit={handleSubmit(save)}>
      <label htmlFor="film-note">Kısa not</label>
      <textarea id="film-note" {...register('text', { required: true })} />
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Kaydediliyor…' : 'Kaydet'}
      </button>
      {mutation.isError && <p role="alert">Not kaydedilemedi; tekrar deneyebilirsin.</p>}
      {mutation.isSuccess && <p role="status">Not kaydedildi.</p>}
    </form>
  )
}
```

`mutateAsync` çağrısı isteğin sonucunu beklenebilir hale getirir; böylece `reset()` yalnızca istek başarılı tamamlanınca çalışır. İstek hata verirse fonksiyon reset satırına ulaşmaz ve kullanıcının yazısı formda kalır. `isPending` düğmeyi ağ isteği boyunca kapatır; bu bekleme bilgisi mutation'dan gelir.

## Gönderimin zaman sırası

Form geçersizken RHF, `save` callback'ini çağırmaz. Geçerliyse callback değerleri alır ve mutation başlar. Başarı ve hata yollarını tabloyla izleyelim:

| An | RHF formu | Mutation | Kullanıcının gördüğü |
|---|---|---|---|
| Form açık | Not alanı boş | Henüz başlamadı | Alan ve Kaydet düğmesi |
| Boş submit | `required` hatası; `save` çalışmaz | Başlamadı | Alan hatası |
| Geçerli submit | `save(fields)` başlar | `isPending` true | “Kaydediliyor…”; düğme kapalı |
| Sunucu 500 döndürür | Callback hata ile biter; alan değeri kalır | `isError` true | Tekrar deneme mesajı |
| Sunucu başarılı cevap verir | Callback `reset()` çağırır | `isSuccess` true | Başarı mesajı; alan temiz |

`formState.isSubmitting` ile `mutation.isPending` aynı işi anlatmaz. RHF'nin callback'i `mutate(values)` çağırıp hemen biterse form submit callback'i de ağdan önce bitebilir. O sırada ağın sürüp sürmediğini `mutation.isPending` söyler. `mutateAsync(values)` beklenirse callback ağ bitene kadar sürer ve `isSubmitting` de bu süreyi kapsar. Düğmeyi hangi durumla kapatacağını seçerken hangi işlemin sürdüğünü düşün.

Bekleme düğmesini kapatmak yalnızca görünüş için değildir. Kullanıcı ikinci kez tıklarsa aynı kayıt için iki istek gidebilir; pending sırasında düğmenin disabled olması bu tekrarın önüne geçer. Durum yazısını da değiştirince bekleyen kişi tıklamasının alındığını anlar. Hata geldikten sonra düğme yeniden açılır, dolayısıyla formu baştan doldurmak yerine tekrar deneyebilir.

Pending göstergesini formun doğrulama hatasıyla karıştırma: ilki ağ işinin sürdüğünü, ikincisi alan değerinin kurala uymadığını söyler. Kullanıcı bir yandan neyin tamamlanmadığını, diğer yandan neyi düzeltmesi gerektiğini ayrı ayrı anlayabilmelidir.

## HTTP hatasını başarı sanma

Gerçek bir hata, form doğru görünse bile yaşanabilir. Örneğin yalnız `return response.json()` yapan bir istek fonksiyonu 500 cevabından da JSON okuyabilir. Fonksiyon başarılı bittiği için mutation başarıya geçer; ekranda yanlış mesaj çıkar. `response.ok` kontrol edip başarısız cevaptan hata üretmek mutation'a doğru sonucu aktarır.

Bir başka hata da `reset()`'i submit'in başında çağırmaktır. Belirti basittir: sunucu hata verince kullanıcı yazdığı metni kaybetmiş olur. Reset'i başarıdan sonra çalıştır; hata yolunda girdiyi koru ki kullanıcı düzeltsin veya tekrar denesin.

:::model[Mutation ve invalidation]
Bir mutation sunucuya yazma isteğini yürütür. Başarıdan sonra, ekranda gösterilen sorgu verisi eskimişse ilgili query cache'i invalidate edebilirsin; bu “bu veriyi yeniden kontrol et” işaretidir. Formu temizlemek de başarı sınırında yapılır, çünkü hata yanıtı kaydın tamamlanmadığını söyler.
:::

![Mutation, sunucu cevabı ve invalidation akışı](diagram:mutation-ve-invalidation)

## İsteğe bağlı cache ayrıntıları

:::info[Derinlemesine (isteğe bağlı)]
Listeyi hemen güncellemek için `setQueryData` ile cache'i doğrudan değiştirebilirsin; buna **optimistic update** denir, çünkü sunucu cevabı gelmeden başarıyı varsayar. İstek başarısız olursa önceki cache değerini geri yüklemek gerekir (rollback). Basit formda başarıdan sonra invalidate etmek daha az hata yüzeyi taşır.

Sunucu alan hatası döndürüyorsa bunu form seviyesi veya ilgili alan hatasına çevirebilirsin; `root.server` RHF'de form geneli hata için kullanılan bir addır. API 204 No Content döndürüyorsa gövde boş olduğundan `response.json()` çağırmamalısın. Bu ayrıntılar temel pending/success/error akışını değiştirmez.
:::

## Özet ve kendini yokla

- RHF alanları ve doğrulamayı, mutation ise sunucuya yazma isteğinin durumunu yönetir.
- `fetch` HTTP hatasını kendi başına hata saymaz; `response.ok` değerini kontrol et.
- Beklerken mutation'ın `isPending` değeriyle düğmeyi kapat; hata sonrası alanı koru.
- `reset()` ve başarı mesajını yalnızca kayıt başarılı olduğunda çalıştır.

**Yeni terimler:**

- **Mutation:** Sunucuda veri oluşturan veya değiştiren istek.
- **Promise:** Daha sonra tamamlanacak bir işlemin sonucunu temsil eden JavaScript değeri.
- **Pending:** İstek başlamış, henüz sonuçlanmamış durum.
- **Invalidate:** Cache verisini eskimiş işaretleyip yeniden sorgulanmasını sağlama.

**Kendini yokla:** `mutate` kullanan callback hemen biterse ağın sürdüğünü hangi durum söyler? `mutation.isPending`. İstek 500 döndürürse not alanını neden temizlemiyoruz? Kullanıcı tekrar deneyebilsin diye girdiyi koruyoruz.
