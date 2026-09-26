Referans testler `curriculum/checkpoints/kitaplik/22/src/**/*.test.ts(x)` ve `e2e/` altında; workflow `.github/workflows/ci.yml` dosyasında.

## Neden böyle?

- Saf Zod/depolama testleri kirli verinin birçok çeşidini hızlı dener. RTL testleri, formun gerçekten alan hatasını ve güncel menü sayısını gösterdiğini doğrular. E2E, router ve `localStorage` yenilemesini gerçek tarayıcıda birleştirir.
- MSW `onUnhandledRequest: 'error'` yanlış URL'yi hemen görünür kılar. `server.use` hata senaryosunu yalnız o teste sınırlar; testler birbirinin sonucuna bağlı kalmaz.
- `page.route` ile E2E sırasında gerçek Open Library'ye gitmemek, hız ve içerik değişimini testten çıkarır. Gerçek servisin erişilebilirliğini ayrıca izlemek gerekebilir; bu, kullanıcı davranışı testinin işi değildir.
- CI temiz kurulumda lint, biçim, tip, test, build ve tarayıcı akışını tekrarlar. Yerelde çalışıp CI'da kırılan bağımlılık/config hatalarını erken bulur.

Alternatif olarak her şeyi Playwright'ta test etmek mümkündür ama kenar durumları pahalı ve yavaş olur. Her şeyi Vitest'te test etmek de sayfalar arası gerçek tarayıcı akışını kaçırır. ADR, bu tercihlerin hangi riskleri açık bıraktığını kaydeder.
