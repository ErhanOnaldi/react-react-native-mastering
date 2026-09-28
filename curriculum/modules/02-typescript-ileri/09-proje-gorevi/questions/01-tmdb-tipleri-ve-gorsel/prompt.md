Sinema'nın liste ve detay cevapları farklı alanlar içeriyor; kadro ve görseller de ek cevaplarda geliyor. Ortak şekilleri yeniden kullanılabilir tiplerle açıkla ve kapak yolu için URL üret.

## Gereksinimler

- Mevcut film tipi korunmalı; liste öğesi `genre_ids: number[]` taşır.
- Tür bilgisi sayısal kimlik ve metin ad içerir.
- Kadro oyuncu kaydı kimlik, ad, karakter, nullable profil yolu ve sıra numarası taşır; ekip kaydı kimlik, ad, iş, departman ve nullable profil yolu taşır.
- Video kaydı string kimlik, key, ad, site, tür, boolean resmi bilgisi, sayı boyutu ve yayın tarihi taşır.
- Film ayrıntısı listeye özgü `genre_ids` alanını içermez; runtime nullable, türler listeli, slogan ve durum metin, bütçe ve gelir sayı olmalı.
- Kadro ve video cevapları opsiyoneldir; sayfalama kabuğunun sonuç türü generic olmalıdır.
- Görsel boyutları yalnız `w185`, `w342`, `w500` veya `original` olabilir. Boyut verilmezse `w342`, path null ise sonuç `undefined` olmalı.
- Üretilen URL, TMDB image host'u ve gelen path'i tek slash ile birleştirmeli.

## Örnek

`'/abc.jpg'` için varsayılan URL `https://image.tmdb.org/t/p/w342/abc.jpg`; boyut `w185` ise `https://image.tmdb.org/t/p/w185/abc.jpg`; null yol için sonuç `undefined`.

## Sözleşme

- Dosyalar: `src/types/tmdb.ts` ve yeni `src/lib/tmdb-image.ts`.
- `Movie` tipi ve mevcut import'lar korunur.
- Export tipleri:
  - `Genre = { id: number; name: string }`.
  - `CastMember = { id: number; name: string; character: string; profile_path: string | null; order: number }`.
  - `CrewMember = { id: number; name: string; job: string; department: string; profile_path: string | null }`.
  - `Video = { id: string; key: string; name: string; site: string; type: string; official: boolean; size: number; published_at: string }`.
  - `MovieDetails = Omit<Movie, 'genre_ids'> & { runtime: number | null; genres: Genre[]; tagline: string; status: string; budget: number; revenue: number; credits?: { cast: CastMember[]; crew: CrewMember[] }; videos?: { results: Video[] } }`.
  - `Paginated<T> = { page: number; results: T[]; total_pages: number; total_results: number }`; `MovieListResponse = Paginated<Movie>`.
  - `ImageSize = 'w185' | 'w342' | 'w500' | 'original'`.
- Export fonksiyon: `posterUrl(path: string | null, size?: ImageSize): string | undefined`.

## Kısıtlar

- Görsel host: `https://image.tmdb.org/t/p/`.
- Görsel helper ağ isteği başlatmaz.
