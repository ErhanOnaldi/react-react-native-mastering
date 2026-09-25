---
title: "Sinema tip sözleşmesini büyüt"
minutes: 10
kind: project
---

# Sinema tip sözleşmesini büyüt

:::pain[Problem]
Sinema'nın `src/types/tmdb.ts` dosyası yalnızca liste öğesini biliyor. Detay, kadro ve görseller farklı dosyalarda tahmin edilen tiplerle dolaşıyor; yükleniyor/hata durumu da üç ayrı değişken.
:::

## Sinema'da uygula

Önce TMDB'nin trend ve detay fixture'larını karşılaştır. Detay cevabında liste öğesindeki `genre_ids` yok; onun yerine `genres` var. `credits` ve `videos`, yalnızca ilgili cevap eklendiğinde bulunur.

İki proje görevini sırayla yap: önce `src/types/tmdb.ts` ve `src/lib/tmdb-image.ts`, sonra `src/lib/remote-data.ts`. Tipleri tek kaynaktan türet; URL ve durum yardımcılarında gerçek davranışı testlerle doğrula.

:::tip
`MovieDetails` için `Omit<Movie, 'genre_ids'>` merdivenin yeni basamağıdır. `Paginated<Movie>` ile önceki modülün `MovieListResponse` adını korursun; sonraki modüller bu adı kullanır.
:::

:::sector
Tip tanımları uygulamanın ortak dilidir. Bir sonraki React modülünde kart props'u ve koşullu render bu sözleşmelere dayanacak.
:::
