Giriş sayfasında yönlendirme hedefini (`location.state.from` veya `?redirect=`) denetlemeden kullanmak, kullanıcıların giriş yaptıktan sonra harici kötü amaçlı sitelere yönlendirilmesine (açık yönlendirme zafiyeti) yol açar. Dönüş adresini yalnızca uygulama içindeki geçerli mutlak yollarla sınırla.

## Gereksinimler

- `getSafeRedirect` fonksiyonu yalnızca `/` ile başlayan uygulama içi mutlak yolları geçerli kabul etmelidir.
- Harici bir etki alanını işaret edebilecek `//` ile başlayan yollar, ters eğik çizgi (`\`) içeren yollar ve kontrol karakteri barındıran dizgiler reddedilmeli, yerine `fallback` değeri döndürülmelidir.
- Değer `string` tipinde değilse veya geçersizse varsayılan `fallback` değeri döndürülmelidir (varsayılan: `'/profile'`).
- Query string (`?sort=new`) ve hash (`#mine`) içeren geçerli uygulama içi yollar aynen korunmalıdır.
- `LoginPage` bileşeni başarılı giriş sonrasında önce `location.state.from`, ardından URL'deki `redirect` arama parametresini `getSafeRedirect` ile denetleyerek yönlendirme yapmalıdır.

## Örnek

| Girdi | Beklenen Sonuç (varsayılan fallback) |
| --- | --- |
| `"/watchlists"` | `"/watchlists"` |
| `"/watchlists?sort=new#mine"` | `"/watchlists?sort=new#mine"` |
| `"//evil.example/phish"` | `"/profile"` |
| `"https://evil.example"` | `"/profile"` |
| `"profile"` (göreli yol) | `"/profile"` |
| `null` | `"/profile"` |

## Sözleşme

- `src/features/auth/safe-redirect.ts` dosyasından `getSafeRedirect(value: unknown, fallback?: string): string` fonksiyonunu named export et (varsayılan fallback: `'/profile'`).
- `src/pages/LoginPage.tsx` içinde başarılı giriş sonrası hedef yolu `getSafeRedirect` kullanarak belirle ve kullanıcıyı yönlendir.
