Sinema'nın ana ve arama sayfalarında aynı navigasyon tutarlı görünmeli. Ortak kabuğu bir kez tanımla ve seçilen çocuk sayfanın içeriğini onun içinde göster.

## Gereksinimler

- Ekranda `Ana menü` adıyla tek bir navigation alanı bulunsun.
- Menüde `Ana sayfa` ve `Ara` bağlantıları bulunsun.
- Çocuk sayfa içeriği `<main>` alanında görünsün.
- `/search` adresinde `Arama` içeriği ve `Ara` bağlantısında `aria-current="page"` görünsün.
- `/search` adresinde `Ana sayfa` bağlantısı etkin işaretlenmesin.

## Örnek

`/` → aynı menü içinde `Filmler`; `/search` → aynı menü içinde `Arama`.

## Sözleşme

- `RootLayout.tsx` içinden `RootLayout` named export edilir.
- Uygulama `/` ve `/search` adreslerinde alt sayfa içeriğini render eder.
