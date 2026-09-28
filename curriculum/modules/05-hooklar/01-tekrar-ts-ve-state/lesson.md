---
title: "State ve tipleri hatırla"
minutes: 8
kind: review
---

# State ve tipleri hatırla

:::pain[Problem]
Sinema aramasında cevap henüz gelmediğinde `[]` gösterirsen kullanıcı "hiç film yok" sanır. Aynı ekranda ağ isteği sürerken, arama hiç başlamamışken ve gerçekten sıfır sonuç gelmişken aynı görüntüyü üretmiş olursun.
:::

## Dört durum, tek kaynak

Bu modülde çok kez "veri var mı?" sorusunu soracağız. Cevap yalnızca `Movie[]` değildir; isteğin hangi aşamada olduğunu da bilmen gerekir. Bu yüzden `RemoteData<T>` gibi discriminated union'lar tekrar sahneye çıkar:

```ts check
type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function castMessage(result: RemoteData<string[]>): string {
  switch (result.status) {
    case 'idle':
      return 'Oyuncuları aç'
    case 'loading':
      return 'Oyuncular yükleniyor'
    case 'error':
      return `Hata: ${result.error}`
    case 'success':
      return result.data.length === 0 ? 'Oyuncu bulunamadı' : `${result.data.length} oyuncu`
  }
}
```

Kurallar kısa ama kesindir:

1. `idle`, istek başlamadı demektir; "boş sonuç" değildir.
2. `loading`, devam eden işi anlatır; bu dalda henüz güvenilir veri yoktur.
3. `success`, dış sistemden geçerli cevap geldi demektir; `data: []` burada gerçek boş cevaptır.
4. `error`, kullanıcıya gösterilecek veya loglanacak hata bilgisini taşır.

:::model[State snapshot]
Her render kendi props ve state fotoğrafını görür. Event handler ya da Promise callback'i hangi render'da oluşturulduysa o render'ın değerlerini kullanır. Bu derste union durumunu doğru ayırıyoruz; sonraki derslerde aynı snapshot fikri, geç gelen ağ cevaplarının neden eski state'e yazabildiğini açıklayacak.
:::

![Render tetikleme, render, commit ve effect sırası](diagram:render-commit)

## Küçük bir iz sürme

Bir oyuncu listesinin durum metnini şu adımlarla izleyebilirsin:

| Girdi | Kontrol | Görünen metin |
| --- | --- | --- |
| `{ status: 'idle' }` | `status === 'idle'` | `Oyuncuları aç` |
| `{ status: 'loading' }` | `status === 'loading'` | `Oyuncular yükleniyor` |
| `{ status: 'success', data: [] }` | success + `length === 0` | `Oyuncu bulunamadı` |
| `{ status: 'success', data: ['A', 'B'] }` | success + `length > 0` | `2 oyuncu` |
| `{ status: 'error', error: 'Bağlantı yok' }` | error | `Hata: Bağlantı yok` |

Bu ayrım küçük görünür, ama Hook derslerinde bütün yüklenme/hata/başarı akışlarının temeli olacak. Reducer dersinde aynı dalları action geçişleriyle yöneteceksin.

## Kırık düşünce, doğru ayrım

Kırık model şudur: "Liste boşsa sonuç yoktur."

```tsx
function CastNotice({ result }: { result: { data?: string[] } }) {
  return <p>{result.data?.length ? `${result.data.length} oyuncu` : 'Oyuncu bulunamadı'}</p>
}
```

Bu kod loading ile gerçek boş sonucu ayıramaz. Doğru modelde önce durum, sonra o duruma ait veri okunur.

```tsx check
type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

export function CastNotice({ result }: { result: RemoteData<string[]> }) {
  if (result.status === 'idle') return <p>Oyuncuları aç</p>
  if (result.status === 'loading') return <p>Oyuncular yükleniyor</p>
  if (result.status === 'error') return <p>Hata: {result.error}</p>

  return <p>{result.data.length === 0 ? 'Oyuncu bulunamadı' : `${result.data.length} oyuncu`}</p>
}
```

:::mistake[Sık hata]
Belirti → Yüklenirken `Sonuç yok` yazıyor. Neden → Boş dizi "istek sürüyor" anlamında kullanılmış. Düzeltme → `loading` durumunu ayrı dal yap; boş dizi yalnızca `success` içinde anlamlı olsun.
:::

:::mistake[Sık hata]
Belirti → TypeScript `data` alanını okuyamazsın diyor. Neden → `status` ile daraltmadan union'ın her dalında olmayan alanı okudun. Düzeltme → `switch(result.status)` veya erken return kullan.
:::

:::sector
Ekiplerde yüklenme/hata/başarı ayrımı çoğu zaman küçük bir tip sözleşmesiyle başlar. "Boş dizi loading demektir" gibi gizli anlaşmalar zamanla kırılır; union ise hem testte hem editörde görünür bir kontrattır.
:::

## Özet

- Görünen liste ile isteğin aşaması aynı bilgi değildir.
- Discriminated union, her duruma ait veriyi güvenli biçimde ayırır.
- `success` içindeki `[]`, "başarıyla sıfır sonuç" demektir.
- State snapshot fikri, Hook callback'lerinin hangi değerleri gördüğünü anlamak için gerekli olacak.

Kendini yokla: `loading` dalında `data` okumak neden hatalıdır?  
Cevap: Çünkü veri henüz güvenilir değildir; `data` yalnızca `success` dalının alanıdır.
