---
title: "Asenkron iş gerçekten kime ait?"
minutes: 8
kind: concept
---

# Asenkron iş gerçekten kime ait?

:::pain[Sinema’da sorun]
Bir buton “cihaza dışa aktar” işlemi yapıyor; pending/fulfilled/rejected durumunu paylaşman gerekiyor. TMDB detayını da aynı yolla mı çekmelisin?
:::

## Paylaşılan asenkron işlem

Async thunk, bir eylemin bekleme, başarı ve hata aşamalarını action akışına taşıyan araçtır. Özel bir client işleminin sonucunu birkaç yerde takip etmek gerektiğinde yararlı olabilir. Ancak sunucu verisinin cache, tazelik ve tekrar istek yönetimi gerekiyorsa TanStack Query zaten bu işi üstlenir; aynı endpoint'i iki ayrı sistemde yönetmemelisin.

Sinema'da watchlist dışa aktarma bir işlem olarak düşünülebilir. Film detayını okumak ise önceki Query sınırında kalır. Bu karşılaştırma, teknoloji seçimini async sözcüğüne değil verinin yaşam döngüsüne bağlar.

## Sorunu çöz

`createAsyncThunk` özel bir client işleminin pending/fulfilled/rejected action’larını üretir. `create.asyncThunk` için `buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })` gerekir. TMDB detayını Query zaten cache’ler; onu thunk’a taşımak ikinci bir sunucu cache’i yaratır.

## Sinema örneği

Bir watchlist’i dışa aktarma API’sine gönderen thunk, export işleminin durumunu izler. İstek dönerken `pending`, başarıda `fulfilled`, hatada `rejected` olur.

## İki ayrı asenkron yol

| İş | Araç | Gerekçe |
| --- | --- | --- |
| TMDB film detayı | TanStack Query `useQuery` | Cache ve arka plan yenileme |
| TMDB puan gönderimi | TanStack Query `useMutation` | Sunucu mutation + invalidation |
| Kullanıcı watchlist’ini dış servise aktar | `createAsyncThunk` olabilir | Uygulamaya özgü işlem durumu |

```ts title="exportList.ts"
const exportList = createAsyncThunk('watchlists/export', async (ids: number[]) => {
  return [...ids]
})
```

Bu kod görevi ağ çağrısı yapmadan lifecycle’ı ölçer. `pending` hemen, `fulfilled` Promise tamamlanınca gelir. Gerçek dışa aktarma endpoint’i eklenirse payload creator onun isteğini yapar. `create.asyncThunk` biçimi de günceldir ama varsayılan `createSlice` içinde doğrudan kullanılmaz: önce `buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })` kurman gerekir.

:::mistake[Sık hata]
Thunk payload’ına serileştirilemeyen nesneler koyma. Form input’unu RHF’de tut; yalnız onaylanmış veriyle işlemi başlat.
:::

:::sector[Sektörde]
RTK Query seçilse bile aynı endpoint için TanStack Query ve RTK Query’yi birlikte kullanma.
:::
