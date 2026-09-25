---
title: "Proje görevi: Sinema'yı canlı veriye bağla"
minutes: 10
kind: project
---

# Sinema'yı canlı veriye bağla

:::pain[Problem]
Ana sayfadaki filmler hâlâ statik. Bir film aradığında veya yeni bir türe geçtiğinde gerçek TMDB kataloğunu görmüyorsun. Şimdi küçük bir HTTP yardımcısı kurup her route'u canlı veriye bağlayacaksın.
:::

## Çalışma sırası

Önce `src/lib/tmdb.ts` ile Bearer başlığı, Türkçe dil ve HTTP hatasını tek yerde hallet. Ardından ana sayfadaki trend isteği ilk görünür başarı olsun. Arama yeni bir twist ekler: `q` URL'dedir ama istek debounce sonrasında gider. Detay sayfası liste öğesinden daha geniş bir cevap (`credits`) kullanır. Tür filtresi ve sayfalama ise aynı URL state'i birden fazla API yoluna dönüştürür.

| Adım | Yeni ihtiyaç | Önceki bilgin |
| --- | --- | --- |
| Yardımcı | Token, dil ve hata | `fetch`, `URLSearchParams`, `Promise<T>` |
| Trend | İlk canlı liste | `useEffect`, loading/error, `MovieGrid` |
| Arama | Yazarken istek sayısı | `useDebounce`, `useSearchParams` |
| Detay | Rota id'si ve kadro | `useParams`, `MovieDetails` |
| Filtre/sayfa | İki URL parametresi | `useSearchParams`, türetilmiş state |

## Gözlem yap

Network sekmesinde `/`, `/search?q=Matrix`, `/movie/550` arasında dolaş. Geri tuşuna basınca hangi GET yeniden gidiyor? Loading ve hata dallarını kaç sayfada yazdın? Şimdilik çalışan saf yöntemi koru; hemen cache veya yeni kütüphane ekleme. Son derste gördüklerini `NOTES.md` içine yazacaksın.

:::mistake
`useEffect` içinde kullandığın `id`, `query` veya `page` değiştiğinde ilgili istek de değişmeli. Dependency array'i kontrol et; eksikse başka filme geçerken eski içerik kalabilir. Bu tür hatayı sonraki modülde lint ile sistemli biçimde yakalayacağız.
:::
