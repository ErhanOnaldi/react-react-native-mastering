Uygulama ayarlarını verilen environment kaydından doğrula ve tek bir config nesnesi döndür.

## Gereksinimler
- Token zorunlu, trimlenmiş ve boş olmayan değer olmalı; eksik/boş token hatası VITE_TMDB_TOKEN adını içermeli.
- Başlık eksik veya trim sonrası boşsa Sinema, doluysa trimlenmiş değer olmalı.
- Sayfa boyutu pozitif tam sayı olmalı; eksik veya geçersiz girdide 20 kullanılmalı.

## Örnek
Token " abc ", başlık " Film Evi ", sayfa "12" → { tmdbToken: "abc", appTitle: "Film Evi", pageSize: 12 }.

## Sözleşme
- config.ts dosyasında readConfig(env: Record<string, string | undefined>) named export'unu tanımla.
- Dönüş alanları tmdbToken, appTitle ve pageSize olmalı.

