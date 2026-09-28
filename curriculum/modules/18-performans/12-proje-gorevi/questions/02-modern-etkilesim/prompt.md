Sinema'da favori kaydı ağ yanıtı beklerken sessiz görünüyor ve film detay kodu ilk yüklemeye dahil oluyor. Bekleyen favoriyi görünür kıl, detay ekranını gerektiğinde yükle ve üretim ayarını tamamla.

## Gereksinimler
- Tıklama anında düğmenin aria-pressed değeri yeni durumu göstermeli.
- Kayıt başarılı olursa yeni durum kalmalı; hata olursa eski duruma dönmeli.
- Aynı kayıt sürerken ikinci tıklama engellenmeli.
- Film detay route kodu gerektiğinde yüklenmeli; path eşlemesi statik kalmalı.
- Derleme yapılandırması React Compiler'ı kararlı Babel eklenti yoluyla etkinleştirmeli.

## Örnek
Başlangıçta pasif düğmeye tıkla: istek beklerken aria-pressed true olur. İstek reddedilirse false'a döner.

## Sözleşme
- src/features/favorites/components/OptimisticFavoriteButton.tsx → adlı OptimisticFavoriteButton export'u.
- Props: initialFavorite: boolean, onSave: (next: boolean) => Promise<void>.
- src/router.tsx film detay route'u.
- vite.config.ts derleme eklenti yapılandırması.

## Kısıtlar
- Sinema projesinde şu geliştirme paketlerini kur: pnpm add -D babel-plugin-react-compiler @rolldown/plugin-babel
- Deneysel compiler: true seçeneğini kullanma.
