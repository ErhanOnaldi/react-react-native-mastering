Bir ürün keşfi ekranı kur. Gerçek DummyJSON `/products` verisinden ürünleri göster; arama, kategori filtresi, ürün detayı ve detaydan listeye dönüş çalışsın. Beklerken, sonuç boşken ve servis hata verdiğinde kullanıcı ne olduğunu anlasın.

## İlk kurulum

Repo kökünde sırayla:

```bash
pnpm setup:projects atolye
pnpm install
cd projects/atolye && pnpm dev
```

Çalışmanı `projects/atolye/src/urun-kesfi/` altında kur. Uygulamada açıp gerçek API ile dene. Arama ya da kategori seçiliyken detaya git ve geri dön; önceki seçimin durduğunu gör. Sonra görev sayfasındaki **“AI review prompt'unu kopyala”** düğmesiyle incelet.
