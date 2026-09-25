---
title: "Giriş: formdan token çiftine"
minutes: 9
kind: concept
---

# Giriş: formdan token çiftine

:::pain[Sinema’da sorun]
Login kutusu yalnız `setLoggedIn(true)` yapıyor. Yanlış parola bile başarılı görünüyor; `/auth/me` ise gerçek access token olmadığı için 401 döndürüyor.
:::

## İlk istek

Önce `fetch` ile `/auth/login` yanıtını işle. `fetch` 400’de kendiliğinden hata fırlatmaz; `response.ok` kontrolünden sonra kullanıcıya anlaşılır mesaj göster. Yanıtın `accessToken` ve `refreshToken` alanlarını ayrı tut.

```ts title="src/features/auth/auth-api.ts"
const response = await fetch('https://dummyjson.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
})
if (!response.ok) {
  const error = await response.json()
  throw new Error(error.message)
}
```

Bu parça bir `async login(username, password)` fonksiyonunun içindedir. `fetch` yalnız ağ hatasında reject olur; HTTP 400’ü sen yorumlarsın.

## Formun işi

İkinci adımda bildiğin RHF `register` / `handleSubmit` ve Zod 4 `zodResolver` ile boş alanları istekten **önce** yakala. Böylece API doğrulaması ile form doğrulaması ayrı kalır. 400 cevabını `setError('root', …)` ile formun genel hatasına yaz; parolayı hata mesajında veya log’da gösterme.

:::tip[Deneme hesabı]
MSW test ortamında `emilys` / `emilyspass` geçerlidir. Gerçek Sinema uygulamasında bu, DummyJSON örnek hesabıdır; TMDB API token’ıyla karıştırma.
:::

:::sector[Sektörde]
Formdaki Zod şeması kullanıcı deneyimini iyileştirir; sunucu yine kendi doğrulamasını yapar. İlk görevdeki JWT çözümleme yalnız süreyi anlamaya yarar.
:::
