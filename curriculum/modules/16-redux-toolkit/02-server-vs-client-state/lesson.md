---
title: "TMDB verisinin sahibi kim?"
minutes: 8
kind: concept
---

# TMDB verisinin sahibi kim?

:::pain[Sinema’da sorun]
Film detayını Redux’a kopyaladın. Arka planda TanStack Query yeniden veri çekti; detay ekranı yeni, Redux’taki başlık eski kaldı. Şimdi iki kaynak var.
:::

## Verinin sahibi ve ömrü

Server state, uzaktaki sistemin sahibi olduğu ve zamanla yenilenmesi gereken bilgidir. Client state ise kullanıcının bu uygulamada verdiği seçim veya yerel UI durumudur. Hangi kütüphaneyi kullanacağını seçmeden önce bu ayrımı yapmalısın; aynı veriyi iki yerde bağımsız saklamak senkronizasyon yükü yaratır.

Sinema film başlığı TMDB'den gelir ve Query cache'inde yaşar. Favori işareti yerel seçimse Redux'ta yalnız film kimliği tutulabilir. URL'deki arama, RHF'deki form taslağı ve sunucu filmi de ayrı sahiplerinde kalır. Bu harita, sonraki slice tasarımının temelidir.

## Sorunu çöz

TMDB arama sonuçları, detaylar, puanlar ve liste sayfaları server state: TanStack Query cache, refetch, staleTime ve invalidation yönetir. Favoriler, listeler, tema ve son bakılan ID’ler kullanıcıya ait client state: slice’lar için uygun. Arama metni URL’de; formun geçici alanları RHF’de kalır.

## Sinema örneği

550 filminin başlığı Query’den “Dövüş Kulübü” gelir. Favori slice’ı yalnızca `550` ID’sini saklar; ekranda film verisiyle bu ID’yi birleştirirsin.

## Karar tablosu

| Veri | Nereden gelir? | Kim yönetir? | Neden? |
| --- | --- | --- | --- |
| `/movie/550` ve arama sonuçları | TMDB | TanStack Query | Cache, tekrar çekme, hata ve tazelik |
| Favori `550` ID’si | Kullanıcı etkileşimi | Redux slice | Sayfalar arasında ortak client tercih |
| `?q=matrix` | Adres çubuğu | React Router URL state | Link paylaşılabilir ve geri tuşu çalışır |
| Yeni watchlist form taslağı | Kullanıcının yazdığı geçici veri | RHF | Submit/reset/validasyon form yaşam döngüsüne bağlı |

TanStack Query’den gelen film ile store’daki ID’yi ekranda birleştir:

```tsx title="MovieCard.tsx"
const { data: movie } = useQuery(movieQueries.detail(550))
const isFavorite = useAppSelector(state => state.favorites.ids.includes(550))
```

Bu parça önceki modüllerde kurulmuş `movieQueries` ve uygulama hook’unu temsil eder; burada tekrar fetch kodu yazmıyoruz. Favori değişince TMDB verisini invalidate etmek gerekmez. Puan verme gibi sunucu değişimlerinde ise Query invalidation gerekir. Aynı nesneyi Redux’a kopyalarsan iki farklı tazelik saati yaratmış olursun.

:::mistake[Sık hata]
Favori ID’lerinin sunucuda senkronlaşması ileride değişebilir. Sahipliği verinin yaşam döngüsüne göre yeniden düşün, kütüphane adına göre değil.
:::

:::sector[Sektörde]
RTK Query de server cache çözümüdür; mevcut Query yatırımı varken aynı TMDB endpoint’lerini iki cache’e bölme.
:::
