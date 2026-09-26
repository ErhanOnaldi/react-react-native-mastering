# ADR 0001 — Sunucu verisi TanStack Query'de, arama durumu URL'de

- **Durum:** Kabul edildi
- **Tarih:** 2026-09-25
- **İlgili gereksinimler:** K-2, K-7, K-8, K-9, K-12

## Bağlam

Kitaplık'ın verisinin büyük kısmı Open Library'den gelir (arama, eser, yazar). Bu veri bizim değil: başkası değiştirir, gecikmeli gelir, hata verebilir. Sinema v1'de aynı tür veriyi `useEffect` + `useState` ile çekmiş, dört sayfada aynı loading/error kodunu tekrar etmiş, geri dönünce aynı isteği yeniden atmıştık.

Arama sorgusu ve sayfa numarası ise kullanıcının "nerede olduğu" bilgisidir: paylaşılabilmeli, geri tuşuyla dönülebilmeli, yenileyince kaybolmamalı (K-2).

## Karar

1. **Sunucu verisi TanStack Query ile yönetilir.** Her kaynak için bir `queryOptions` tarifi `bookQueries` altında toplanır (`search`, `work`, `author`); key'ler parametreleri içerir.
2. **Arama durumu (`q`, `page`) ve liste filtresi (`status`) URL'de tutulur**, `useSearchParams` ile okunur. Başka bir kopyası (state, store) tutulmaz.
3. Sayfalamada `placeholderData: keepPreviousData` kullanılır (K-8).
4. Yazar bilgisi eserden gelen id'lerle **bağımlı sorgu** (`useQueries`) olarak çekilir; biri başarısız olsa da sayfa çalışır (K-11).
5. Route ağacı `createRoutes(queryClient)` fabrikasıyla kurulur; detay route'unun loader'ı veriyi render'dan önce istemeye başlar (prefetch).

## Değerlendirilen alternatifler

| Seçenek                                     | Neden seçilmedi                                                                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `useEffect` + `useState` (Sinema v1)        | Önbellek yok, yarış durumu ve tekrar eden loading/error kodu; Sinema'da bizzat yaşandı.                                                         |
| Redux Toolkit + RTK Query                   | Tek bir kullanıcı özelliği için store, slice ve middleware kurulumu fazla. Sunucu verisi için Query ile aynı işi görür, daha fazla tören ister. |
| Router loader + `useLoaderData` (Query'siz) | Önbellek ve arka planda tazeleme yok; sayfa geçişlerinde aynı veri yeniden çekilir.                                                             |
| Arama durumu `useState`'te                  | Yenileyince kaybolur, link paylaşılamaz (K-2 karşılanmaz).                                                                                      |

## Sonuçlar

- ✅ Aynı arama tekrar açıldığında önbellekten gelir; Open Library gereksiz yere yorulmaz.
- ✅ Loading/error/retry tek bir desenle yönetilir; bileşenler sade kalır.
- ✅ Link paylaşımı ve geri tuşu kendiliğinden çalışır.
- ⚠️ Query key tasarımı hataya açık: parametre key'e girmezse yanlış veri gösterilir. `bookQueries` tek yerde tutularak azaltıldı.
- ⚠️ URL'den okunan değerler güvenilmez (`?page=abc`): her okumada doğrulanır (`readSearchParams`).
