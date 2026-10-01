Sinema türlerinin renk ve sayfa yolları sabit konfigürasyon tablolarında tutuluyor. Her zorunlu anahtar bulunmalı ve değerlerin literal bilgisi korunmalı.

## Gereksinimler

- Tür kimlikleri `18`, `53`, `35`; renkleri sırasıyla `indigo`, `rose`, `amber` olmalı.
- Kimlik tipi sabit dizinin elemanlarından türetilmeli.
- Renk tablosu tüm kimlikleri içermeli ve renk literal tiplerini korumalı.
- Eksik veya fazladan bir tür anahtarı derleme sırasında fark edilmeli.
- Rota tablosunda `home: '/'` ve `details: '/movie/:id'` olmalı.
- Rota tablosunda eksik veya fazladan anahtar derleme sırasında fark edilmeli.
- Seçilen tür ve sayfa için ilgili değer dönmeli.

## Örnek

53 numaralı türün rengi `"rose"`; `details` sayfasının yolu `"/movie/:id"` olur.

## Sözleşme

- Dosya: `task.ts`
- Export sabitler: `GENRE_IDS`, `GENRE_COLORS`, `ROUTES`.
- Export tipi: `GenreId`.
- Export fonksiyonlar: `colorFor(id: GenreId): string`, `routeFor(page: 'home' | 'details'): string`.
