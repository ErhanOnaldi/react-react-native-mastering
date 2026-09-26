---
title: "JWT: üç parçalı oturum bileti"
minutes: 8
kind: concept
---

# JWT: üç parçalı oturum bileti

:::pain[Sinema’da sorun]
Sinema’da aynı tarayıcıda oturum açmadan `/watchlists` adresine gidince daha önce kaydedilmiş yerel listeyi görebiliyorsun. Uygulama kimin geldiğini bilmiyor; yalnız `isLoggedIn` boolean’ı da yenilemede kayboluyor.
:::

## Kimlik doğrulama neyi kanıtlar?

Authentication kullanıcının kim olduğunu belirleme, authorization ise hangi kaynağa erişebileceğine karar verme sürecidir. JWT, sunucunun imzaladığı ve istemcinin isteklerde taşıyabildiği bir token biçimidir. Üç bölümden oluşur; payload okunabilir ama yalnız okunması geçerlilik kanıtı değildir. İmzayı ve yetkiyi sunucu denetler.

Sinema'daki yerel izleme listesi ile gerçek kullanıcı oturumu aynı şey değil. Bu modülde DummyJSON'un verdiği access ve refresh token'ları kullanacaksın; TMDB uygulama token'ı başka bir hizmete aittir. Route gizleme kullanıcı deneyimi sağlar, veri güvenliğini tek başına sağlamaz.

## Sunucunun verdiği kanıt

DummyJSON’a `POST /auth/login` ile kullanıcı adı ve parola gönderince `accessToken` ve `refreshToken` gelir. Test hesabı `emilys` / `emilyspass`. Hatalı bilgilerde 400 ve `Invalid credentials` gelir. `accessToken` bir JWT biçimindedir: `header.payload.signature`.

Payload, base64url ile kodlanmış JSON’dur. İçindeki `exp` Unix saniyesidir; `Date.now()` ise milisaniye. İkisini karşılaştırırken `exp * 1000` gerekir. Payload’ı okumak **imzayı doğrulamak değildir**: tarayıcı rol, izin veya kimlik kararı için kendi çözdüğü veriye güvenmemeli; sunucu token’ı doğrulamalı.

Örneğin `exp * 1000 <= Date.now()` doğruysa bildirilen süre dolmuştur. Yalnız bu karşılaştırma token’ın imzasını veya gerçekten o kullanıcıya ait olduğunu kanıtlamaz. İlk kod görevinde payload’ı bozuk token durumunu da ele alarak okuyacaksın.

## İki ayrı token neden var?

Kısa ömürlü access token `/auth/me` gibi isteklerde Bearer olarak gider. Daha uzun ömürlü refresh token yalnız yeni token çifti almak içindir. DummyJSON refresh token’ı bir kez kabul eder; yeni çift geldiğinde eskisini saklamak sonraki yenilemede 403 doğurur.

:::mistake[Sık hata]
`atob(token)` üç parçanın tamamını çözmez. Payload ikinci parçadır; base64url alfabesindeki `-` ve `_` dönüştürülür, eksik padding tamamlanır. Bozuk veri parse hatası verebilir.
:::

:::sector[Sektörde]
JWT okunabilir; gizli veri taşıma yeri değildir. Yetkiyi istemci ekranı değil sunucu uygular. İleride korumalı route yalnız UX katmanını sağlayacak.
:::
