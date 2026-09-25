---
title: "Puanlama isteği: useMutation"
minutes: 7
kind: concept
---

# Puanlama isteği: useMutation

:::pain[Problem]
Dövüş Kulübü kartında 8,5 yıldızı seçtin. Ekranda sayı değişti, ama `GET /guest_session/.../rated/movies` boş. Sadece React state’i güncelledin; TMDB’ye hiçbir şey yazılmadı.
:::

## Önce gerçek yazma isteği

Önceki modüldeki `useQuery`, sunucudan **okuma** işini cache’ledi. Puanlama bir **yazma**: TMDB önce guest session verir, sonra `POST /movie/550/rating?guest_session_id=...` bekler. `Authorization: Bearer` başlığı iki istekte de gerekir. Gövde `{ "value": 8.5 }` biçimindedir; değer 0,5–10 arasında, 0,5’lik adımlarla olmalı. Geçersiz değer 400, geçersiz oturum 401 döner.

```ts
const session = await getGuestSession()
await rateMovie({ movieId: 550, value: 8.5 })
```

Bu parça akışı gösterir; `getGuestSession` ve `rateMovie` ilk görevde yazılacak. Session kimliğini saklamak gerekir: her tıklamada yeni session açarsan “Puanladıklarım” başka bir oturumu okur.

## Yazma sırasında kullanıcı ne görür?

`useMutation({ mutationFn })` bir yazma işlemini başlatmak için `mutate(variables)` verir. `isPending`, `isError`, `error` ve `isSuccess` durumları aynı butonun yüklenme ve hata metinlerini yönetir. Render sırasında `mutate` çağırma; kullanıcı event’inde çağır.

```tsx
const rating = useMutation({ mutationFn: rateMovie })
<button disabled={rating.isPending} onClick={() => rating.mutate({ movieId: 550, value: 8.5 })}>
  {rating.isPending ? 'Kaydediliyor…' : '8,5 ver'}
</button>
```

Bu örnek bir bileşenin **içinden kesit**; kendi başına derlenen blok değildir. `mutate` sonucu ekrandaki listeyi henüz yenilemez. Bir sonraki derste tam bu eksikliği ölçeceksin.

:::mistake
`fetch` 400/500 aldığında otomatik olarak reject etmez. `response.ok` kontrol edip hata fırlatmazsan mutation `isSuccess` olur; kullanıcıya yanlış başarı mesajı gösterirsin.
:::

:::sector
Yazma işleminin değişkenlerini tek bir nesnede taşımak (`{ movieId, value }`) çağrıyı ve testleri okunur kılar. TypeScript bu nesnenin şeklini mutation fonksiyonundan çıkarır.
:::
