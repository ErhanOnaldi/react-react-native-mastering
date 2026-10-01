## Neden böyle?

```ts
await page.goto('/')
await expect(page.getByRole('heading', { level: 1, name: 'Sinema' })).toBeVisible()
await expect(page.getByRole('heading', { name: 'Bu haftanın trend filmleri' })).toBeVisible()
await expect(page.getByRole('heading', { name: 'Dövüş Kulübü' })).toBeVisible()
```

- **Göreli adres:** `page.goto('/')` adresi `baseURL`’e göre çözer. Aynı senaryo yerelde, staging’de ve CI’da değişmeden koşar.
- **Veriyi doğrulayan son satır:** 401 alan sürümde iki başlık da ekranda; bozulan tek şey liste. Yalnız başlıklara bakan senaryo bu hatayı yeşil geçirir. E2E testinde “sayfa açıldı” yetmez; kullanıcının **asıl görmesi gerekeni** doğrula.
- **`await expect(...).toBeVisible()`:** Liste ağdan gelir; tıklama anında ekranda değildir. Web-first assertion koşul sağlanana kadar (varsayılan 5 sn) tekrar dener. Kendi `setTimeout`’unu yazmana gerek yok; önceki derste bu bekleyişi gördün.
- **`getByRole` + `name`:** Modül 11’deki RTL önceliği aynen geçerli. `level: 1` sayfada birden çok başlık varken h1’i seçer.

## Alternatifler

- `expect(page.getByText('Dövüş Kulübü')).toBeVisible()` da çalışır; ama film adı açıklamada, yorumda ya da “Son bakılanlar”da da geçebilir. Rol + ad daha kesin.
- `await expect(page).toHaveTitle('Sinema')` sekme başlığını doğrular; kullanıcının gördüğü h1 ayrı bir şeydir.

## Sektörde

Takımlar ilk E2E testine genelde “smoke test” der: uygulama açılıyor mu, ana veri geliyor mu? Her yayından önce ilk bu koşar. Proje görevinde Sinema’nın gerçek smoke testini `e2e/movie-flow.spec.ts`’e yazacaksın.
