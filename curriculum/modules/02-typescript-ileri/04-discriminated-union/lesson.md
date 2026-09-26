---
title: "İstek durumunu tek modelde tut"
minutes: 8
kind: concept
---

# İstek durumunu tek modelde tut

:::pain[Problem]
Sinema detay sayfasında `loading = true`, `error = 'Hata'` ve eski `movie` aynı anda durabiliyor. Ekran hem spinner hem eski filmi gösteriyor.
:::

## Durumları ayrı seçenekler olarak modelle

Bir ekranda birkaç boolean ve opsiyonel alan tutmak kolay görünür; fakat bu alanların her birleşimi geçerli değildir. Discriminated union, her olası durumu ayrı bir nesne tipi yapar ve ortak bir ayırt edici alanla birbirinden ayırır. Böylece "yükleniyor" durumunda veri, "hata" durumunda başarılı cevap varmış gibi davranamazsın.

Önceki union ve narrowing bilgisi burada birleşir: `status` kontrol edildiğinde TypeScript ilgili dala ait alanları bilir. Sinema'nın istek ekranı bir örnek; aynı model ödeme, dosya yükleme veya oturum açma akışına da uygulanır. Daha sonra React state ve reducer bu tipin geçişlerini yönetecek.

## İmkânsız birleşimleri kaldır

Üç ayrı değişken tüm kombinasyonlara izin verir. `RemoteData<T>` her durumda hangi alanların bulunacağını kesinleştirir.

```ts check
type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function label(state: RemoteData<{ title: string }>): string {
  switch (state.status) {
    case 'idle': return 'Henüz başlamadı'
    case 'loading': return 'Yükleniyor'
    case 'success': return state.data.title
    case 'error': return state.error
    default: {
      const unreachable: never = state
      return unreachable
    }
  }
}
```

`status` ortak ayırt edici alan. `success` dalında `data` güvenle okunur. `never` kontrolü, sonra yeni durum eklenirse unutulan `switch` dalını tip hatası yapar.

:::mistake
`{ status: string; data?: T; error?: string }` yazmak eski sorunu geri getirir: başarıda bile `data` olmayabilir.
:::

:::sector
Bu model React state'inde, reducer'da ve ağ istemcisinde tekrar kullanılacak. Şimdilik saf fonksiyonlarla davranışı öğreniyoruz.
:::
