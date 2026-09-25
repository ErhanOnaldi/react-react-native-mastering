---
title: State ve tipleri hatırla
minutes: 6
kind: review
---

# State ve tipleri hatırla

:::pain[Problem]
Sinema aramasında sonuç henüz gelmediğinde boş liste göstermek, “yükleniyor” ile “sonuç yok” durumunu aynı gösterir.
:::

## Ne değişiyor?

`RemoteData<T>` dört durumu ayrı tutar: `idle`, `loading`, `success`, `error`. `status` alanına bakınca TypeScript ilgili veriyi daraltır.

## Sinema'da dene

Bir event handler içindeki `state` o render’ın snapshot’ıdır. Önceki değere bağlı güncellemede `setState(previous => ...)` kullan.

## Küçük tekrar

```ts
// Film listesi henüz gelmedi: [] başarıyla gelen boş sonuç anlamına gelmez.
type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

`status === 'success'` kontrolünden sonra `data` okunabilir. Hata durumunda `data` alanı yoktur. Bu ayrımı ekranda da koru: “Henüz arama yok”, “Yükleniyor” ve “Sonuç yok” aynı metin değildir.

State snapshot’ını da hatırla. `setCount(count + 1)` aynı event handler içinde üç kez çağrılırsa üç çağrı da aynı `count` değerini görür. Önceki değere bağlı geçişte `setCount(n => n + 1)` yaz. Sonraki derslerde ağ cevabı geldiğinde state güncelleyeceğiz; render’ın yeniden çalışacağını aklında tut.

:::mistake[Sık hata]
`success` içindeki `[]` ile `loading` durumunu eşitleme. Kullanıcı için biri “bekle”, diğeri “eşleşme yok” demektir.
:::

:::sector
Buradaki union, reducer ve `useFetch` dönüş tipinin temelidir.
:::
