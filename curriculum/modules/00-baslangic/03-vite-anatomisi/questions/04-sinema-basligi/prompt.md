Şimdi aynı fikri gerçek projede uygula ve **HMR'ı canlı izle**.

1. Terminalde Sinema'yı başlat:

```bash
cd projects/sinema
pnpm dev
```

2. Tarayıcıda `http://localhost:5174`'ü aç.
3. `src/App.tsx`'te `<main>` içine bir `<header>` ekle:
   - `<h1>`: **Sinema**
   - `<p>`: **Bugün ne izlesek?**
4. Kaydet ve tarayıcıya bak: sayfa yenilenmeden değişmeli.

İstersen Tailwind ile biraz süsle (`text-4xl font-bold` gibi). Bitince testleri çalıştır.

:::tip
Önceki sorudaki `AppHeader` bileşenini buraya taşımak cazip gelebilir — bekle! Projeyi bileşenlere bölmeyi ilerleyen modüllerde, ihtiyaç doğduğunda yapacağız. Şimdilik doğrudan `App.tsx`'e yaz.
:::
