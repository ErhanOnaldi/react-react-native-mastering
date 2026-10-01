---
title: "Çerez güvenliği ve CSRF savunması"
minutes: 14
kind: concept
---

# Çerez güvenliği ve CSRF savunması

Daha önce girişte token'ı nasıl saklayabileceğini gördün. Bir başka seçenek, oturum bilgisini tarayıcı çerezinde tutmaktır. Çerez, sunucunun tarayıcıya verdiği küçük bir bilgidir; tarayıcı bu bilgiyi sonraki uygun isteklere kendisi ekler. Bu otomatik davranış oturumu kullanışlı kılar, ama başka bir sitenin kullanıcının tarayıcısına istek göndermesini de önemli hale getirir.

## Tarayıcının otomatik eklediği bilgi

En küçük örnekte sunucu giriş başarılı olunca yanıta `Set-Cookie` başlığı ekler:

`http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
`

Tarayıcı bu oturum çerezini saklar. Aynı siteye daha sonra istek yaptığında uygun çerezi kendisi gönderir; uygulama kodunun değeri her istekte okuyup `Authorization` başlığına koyması gerekmez. Çerezdeki `HttpOnly`, JavaScript'in çerez değerini `document.cookie` üzerinden okumasını engeller. Tarayıcı yine de çerezi isteğe ekleyebilir.

Buradaki önemli ayrım şu: `HttpOnly` çerezi JavaScript'ten gizler, isteğin kendisini engellemez. Böylece sayfadaki kötü amaçlı JavaScript oturum bilgisini kopyalayıp başka yere götüremez; fakat kullanıcının açık oturumuyla işlem başlatmayı hâlâ deneyebilir.

## Aynı istek, iki farklı bağlam

Şimdi tek bir yeni ayrıntı ekleyelim: çerezin hangi isteklerde gönderileceğini `SameSite` ayarı sınırlar. “Site” burada tarayıcının istek bağlamı için kullandığı site sınırıdır; farklı bir siteden başlayan isteğe çapraz site istek denir.

Kullanıcı Sinema'da oturum açmış olsun. Başka sitedeki bir sayfa Sinema'ya istek başlatınca tarayıcı çerezi otomatik ekleyebilir mi? Yanıt, çerezin `SameSite` değerine ve istek türüne bağlıdır:

| Adım | Olan | Çerez durumu | Sonuç |
| --- | --- | --- | --- |
| 1 | Sinema giriş yanıtı `SameSite=Lax` çerezi verir | Tarayıcı çerezi saklar | Kullanıcı oturum açmıştır |
| 2 | Kullanıcı başka bir siteyi açar | Sinema çerezi o siteye gönderilmez | Başka site çerezi okuyamaz |
| 3 | O sayfa Sinema'ya çapraz site `POST` başlatır | `Lax` çerezi bu isteğe eklenmez | İstek oturumlu görünmez |
| 4 | Kullanıcı başka sitedeki bağlantıyla Sinema'ya `GET` gider | `Lax` çerezi gönderilebilir | Dış bağlantıdan gelen kullanıcı oturumunu koruyabilir |

`Lax`, yaygın başlangıç tercihidir: dış bağlantıyla sayfaya gelişini kolaylaştırırken çapraz site form gönderimi gibi birçok durumu engeller. `Strict` daha kısıtlayıcıdır; dış siteden Sinema'ya geçerken bile çerez gönderilmeyebilir. `None` çerezi çapraz site isteklerde de göndermeye izin verir ve `Secure` ile birlikte kullanılmalıdır. `Secure`, çerezin yalnızca HTTPS bağlantılarında taşınmasını sağlar.

## Bir saldırı isteğini adım adım izleyelim

CSRF, “siteler arası istek sahteciliği” demektir: saldırgan, kullanıcının tarayıcısına o kullanıcının oturumuyla hedef siteye istenmeyen bir istek göndertir. Örneğin Sinema'daki bir `POST` isteği izleme listesini silebiliyorsa, kötü niyetli bir sayfa bunu kullanıcı fark etmeden başlatmayı deneyebilir.

| Sıra | Tarayıcı ne yapıyor? | Sinema'nın gördüğü | Neden? |
| --- | --- | --- | --- |
| 1 | Kullanıcı Sinema'da giriş yapıyor | Sunucu oturum çerezi veriyor | Tarayıcı çerezi saklıyor |
| 2 | Kullanıcı oturumu kapatmadan `tuzak.example` sayfasını açıyor | Henüz Sinema isteği yok | Çerez başka siteye verilmez |
| 3 | Tuzak sayfa Sinema'ya durum değiştiren `POST` gönderiyor | `SameSite=Lax` ise çerez çoğu tarayıcıda bu çapraz site isteğe eklenmiyor | Sunucu oturum bulamayıp isteği reddediyor |
| 4 | Çerez `SameSite=None; Secure` ise aynı istek gönderiliyor | Çerez de sunucuya ulaşabiliyor | Ek CSRF denetimi yoksa istenmeyen işlem gerçekleşebilir |

Bu, “`Lax` kullandım, konu kapandı” anlamına gelmez. Dış bağlantıdan yapılan `GET` isteğinde çerez gelebilir. Sunucu `GET` ile veri silmemeli veya güncellememelidir; `GET` yalnızca okuma yapmalıdır. Durum değiştiren isteklerde sunucu ayrıca bir CSRF token'ı doğrulayabilir. CSRF token, saldırgan sitenin kolayca tahmin edemediği ve isteğe ayrıca eklenmesi gereken bir değerdir. Tarayıcı çerez gibi bu başlığı kendiliğinden eklemez.

## İstemci isteğinde çerez ve başlık

Sinema arayüzü ile API farklı kaynaklardaysa (`origin`, protokol/alan adı/port birleşimidir), `fetch` için çerez gönderimini açıkça etkinleştirmen gerekir. `credentials: 'include'` tarayıcıya çerezleri çapraz kaynak istekte de kullanmasını söyler. Sunucunun da bu kaynağa çerezli isteklere izin verecek biçimde ayarlanması gerekir.

`ts title="src/features/watchlist/addFavorite.ts"
export async function addFavorite(filmId: string, csrfToken: string) {
  const response = await fetch('/api/favorites', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify({ filmId }),
  })

  if (!response.ok) {
    throw new Error('Favori eklenemedi')
  }
}
`

Burada tarayıcı oturum çerezini taşır; uygulama ise CSRF token'ı açıkça başlığa koyar. İstek `POST` olduğu için sunucu tarafında ayrıca doğrulanması gereken bir işlem yapar. İstek başarısızsa bunu sessizce başarılı saymıyoruz: kullanıcıya hata gösterebilmek için fonksiyon hata fırlatıyor.

:::mistake[GET ile işlem yapmak]
**Belirti:** Kullanıcı bir bağlantıya tıklayınca izleme listesindeki film siliniyor. **Neden:** Sunucu silme işlemini `GET` üzerinden çalıştırıyor; dış bağlantılardan gelen `GET` isteklerinde çerez gönderilebilir. **Düzeltme:** `GET` yalnızca veri okusun; silme ve güncelleme gibi işlemleri durum değiştiren yöntemlerle yap ve sunucuda CSRF denetimi uygula.
:::

## Kısa zihinsel model

Çerez oturumu kullanışlıdır çünkü tarayıcı uygun isteğe oturum bilgisini ekler. Bu kolaylık yüzünden çerezi JavaScript'ten gizlemek (`HttpOnly`), yalnızca HTTPS'te taşımak (`Secure`) ve hangi çapraz site isteklerde gideceğini sınırlamak (`SameSite`) ayrı işlerdir. CSRF savunması da sunucunun durum değiştiren isteğin gerçekten uygulamadan geldiğini kontrol etmesini sağlar.

:::info[Derinlemesine (isteğe bağlı)]
Çerezli bir API'ye farklı origin'den erişimde `credentials: 'include'` tek başına yeterli olmayabilir. Tarayıcı, sunucu izin başlıklarını da denetler; kimlik bilgili istekte sunucunun `Access-Control-Allow-Origin` değeri `*` olamaz. Bu, CORS yapılandırmasıdır ve çerez ayarından ayrı bir sunucu iznidir.
:::

## Özet

- Çerez, sunucudan tarayıcıya gelir ve uygun isteklere tarayıcı tarafından eklenir.
- `HttpOnly` JavaScript'in çerezi okumasını engeller; çerezin isteğe eklenmesini engellemez.
- `SameSite` çapraz site isteklerde çerez gönderimini sınırlar; `None` için `Secure` gerekir.
- CSRF, tarayıcının oturum çerezini istenmeyen bir işlemde kullanmaya çalışır; `GET` veri değiştirmemeli, durum değiştiren istekler ek sunucu denetiminden geçmelidir.
- Çerezli çapraz kaynak `fetch` isteğinde `credentials: 'include'` gerekir; CSRF token'ı ise istemci başlığa ayrıca ekler.

**Yeni terimler**

- **Çerez (cookie):** Tarayıcının saklayıp uygun isteklere eklediği küçük bilgi.
- **`HttpOnly`:** Çerez değerinin JavaScript'ten okunmasını engelleyen ayar.
- **`SameSite`:** Çerezlerin çapraz site isteklerde gönderilip gönderilmeyeceğini belirleyen ayar.
- **CSRF:** Başka bir sayfanın, kullanıcının tarayıcısına oturumuyla istenmeyen istek göndertmesi.
- **CSRF token:** Durum değiştiren isteğin meşru uygulamadan geldiğini doğrulamaya yarayan ek değer.

**Kendini yokla**

1. `HttpOnly` çerez, `fetch` isteğine eklenebilir mi?  
*Cevap:* Evet. `HttpOnly` JavaScript'in değeri okumasını engeller; tarayıcının uygun isteğe eklemesini engellemez.

2. Sinema'daki filmi silen endpoint neden `GET` olmamalı?  
*Cevap:* `GET` istekleri bağlantıdan veya başka bir sayfanın tetiklemesiyle gelebilir ve çerez taşıyabilir. Silme gibi bir değişiklik için durum değiştiren yöntem ve CSRF denetimi kullanılmalıdır.

