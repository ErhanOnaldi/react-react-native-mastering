## Neden böyle?

Composition, MoviePanel’ı belirli bir favori eylemine bağlamaz. Üst bileşen farklı düğme veya bağlantıyı `actions` olarak verebilir. `ReactNode` metin, sayı ve JSX’i kapsar. `actions && ...` yazsaydık sıfır sayısı footer dışında görünürdü; `null` kontrolü bu tuzağı önler. Boş bir footer üretmemek DOM’u daha anlaşılır kılar. Bir sonraki Tailwind modülünde çerçeveye görünüm eklemek kolaylaşır.
