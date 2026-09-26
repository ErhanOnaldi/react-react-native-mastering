## Durum
Sinema aramasında büyük sonuç kümesi inputu geciktiriyor ve 500 film için 500 DOM satırı var.

## Dosya sözleşmesi
`src/features/movies/components/VirtualMovieList.tsx` içinden adlı `VirtualMovieList` export et. Props: `movies: { id: number; title: string }[]` ve `query: string`. `src/pages/SearchPage.tsx` bu bileşeni gerçek arama sonucuyla kullansın. Yazarken input güncel kalsın, büyük listenin güncellenmesi arayüzü bekletmesin; mevcut URL state, debounce ve TanStack Query anahtarlarını koru.

## Kabul ölçüleri
- Boş sorguda 500 film veri kümesi için DOM'da 30'dan az `role="listitem"` bulunmalı.
- `query="Dövüş"` ile yalnız **Dövüş Kulübü** görünmeli.
- Kaydırma alanı 240 px civarı ve virtualizer toplam yüksekliği korunmalı.
- Film id'si satır kimliği olsun.

Önce React Profiler commit sayısını ve DOM satırını not et, sonra aynı aramayı tekrar ölç. TMDB test ortamı Bearer başlığı ister; mevcut API client'ı kullan, doğrudan çıplak `fetch` ekleme.
