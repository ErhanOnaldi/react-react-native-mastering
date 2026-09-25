---
title: "Yenilemede oturum neden kaybolur?"
minutes: 8
kind: concept
---

# Yenilemede oturum neden kaybolur?

:::pain[Sinema’da sorun]
Girişten sonra profil görünüyor. F5’e basınca Redux store yeniden kuruluyor ve token boş: kullanıcı tekrar girişe gidiyor.
:::

## Üç saklama seçeneği

| Yer | Yenilemeden sonra | Ana risk |
| --- | --- | --- |
| Bellek / Redux store | Kaybolur | Yenilemede yeni oturum gerekir; XSS çalışan sayfada yine token’a erişebilir. |
| `localStorage` | Kalır | Aynı origin’de çalışan kötü amaçlı JavaScript token’ı okuyabilir (XSS). |
| `httpOnly` cookie | Tarayıcı otomatik gönderir | JavaScript okuyamaz; cookie ile yapılan işlemlerde CSRF koruması ve uygun `SameSite` gerekir. |

Sinema’nın DummyJSON sözleşmesi JSON içinde token verir, cookie oturumu kurmaz. Bu alıştırmada yenilemede kalıcılık için localStorage seçebilirsin; XSS riskini açıkça kabul et. Üretimde backend kontrolün varsa `httpOnly`, `Secure`, uygun `SameSite` cookie ve CSRF tasarımı daha uygun olabilir. `httpOnly` tek başına XSS’in tüm zararını engellemez; saldırgan çalışan JavaScript ile kullanıcı adına istek atabilir.

## Daha küçük bir yüzey

İhtiyacın olmayan kullanıcı verisini saklama. Çıkışta saklanan token’ları sil; refresh token rotation sonrası eski çifti yenisiyle **birlikte** değiştir. Bellek ve kalıcı kopya birbirinden koparsa yeni 401’ler başlar.

Örneğin login yanıtını `sinema-auth` anahtarına JSON olarak yazıp uygulama başlarken okuyabilirsin. `JSON.parse` hatasına karşı varsayılan boş oturuma dön; kalıcı kaydı doğrulamadan geçerli oturum sayma. Depodan access token bulunması, sunucunun onu hâlâ kabul edeceği anlamına gelmez: `/auth/me` veya refresh sonucu belirleyicidir.

:::mistake[Sık hata]
`localStorage` bir güvenlik kasası değildir. `btoa` ile gizlemek de şifreleme sağlamaz.
:::
