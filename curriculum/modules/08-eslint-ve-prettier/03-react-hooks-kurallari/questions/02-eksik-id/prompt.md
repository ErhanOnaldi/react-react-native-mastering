# Eksik `id` bağımlılığını düzelt

Sinema’da route parametresi değişince detay başlığının da değişmesi gerekir. `detailsSource` string’i testin `MovieDetails.tsx` olarak lint edeceği kaynak kodu tutuyor.

- `useEffect` içindeki `id` kullanımını koru.
- Effect’i yeni `id` geldiğinde tekrar çalışacak hale getir.
- `react-hooks/exhaustive-deps` mesajı **0** olsun.
- Bileşenin `<h1>` çıktısını koru.

Örnek: 550 → 155 geçişinde tarayıcı başlığı da yeni filme ait olmalı.
