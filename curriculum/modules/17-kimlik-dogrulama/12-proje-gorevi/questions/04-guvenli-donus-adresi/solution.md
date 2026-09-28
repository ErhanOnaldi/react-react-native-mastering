# Güvenli Dönüş Adresi ve Açık Yönlendirme Koruması

Açık yönlendirme (open redirect), kullanıcının güvendiği bir sitede oturum açtıktan sonra parametredeki hedef adrese yönlendirilmesi sırasında ortaya çıkar. Saldırgan `https://sinema.app/login?redirect=https://saldirgan.com` gibi bir bağlantı hazırlayıp kullanıcıyı sahte bir siteye çekebilir.

## Neden `//` kontrolü kritik?

Tarayıcılar `//evil.example` biçimindeki URL'leri "protokolü devralan" (protocol-relative) mutlak URL olarak yorumlar. `value.startsWith('/')` kontrolü tek başına yetersizdir, çünkü `//` de `/` ile başlar. Bu yüzden `value.startsWith('//')` açıkça engellenmelidir.

Ters eğik çizgi (`\`) ise bazı tarayıcılarda eğik çizgiye (`/`) normalize edilir (ör. `/\evil.example` tarayıcıda `//evil.example` haline gelebilir). Kontrol karakterleri de URL ayrıştırıcılarını yanıltabilir.

## LoginPage Entegrasyonu

Giriş sayfasında hedef adres iki kaynaktan gelebilir:
1. `ProtectedRoute`'un `Navigate` bileşeniyle state içine koyduğu `location.state.from` (kullanıcının gitmek istediği korumalı sayfa).
2. URL arama parametresi olan `?redirect=...`.

Her iki değer de `getSafeRedirect` filtresinden geçirilerek güvenli bir hedef belirlenir:
```tsx
const from = (location.state as { from?: unknown } | null)?.from
const queryRedirect = new URLSearchParams(location.search).get('redirect')
const destination = getSafeRedirect(from, getSafeRedirect(queryRedirect))
await navigate(destination, { replace: true })
```
