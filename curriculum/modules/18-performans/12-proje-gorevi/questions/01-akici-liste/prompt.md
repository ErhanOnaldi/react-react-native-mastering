Sinema aramasında büyük sonuç kümesi input etkileşimini yavaşlatıyor ve her film DOM'da tutuluyor. Arama alanını duyarlı tutarken yalnızca görünür sonuç satırlarını ekranda tut.

## Gereksinimler
- SearchPage gerçek arama sonucunu yeni liste bileşenine vermeli.
- Input yazarken anında güncel kalmalı, büyük liste arayüzü bekletmemeli.
- Arama değeri değişince yalnız eşleşen başlıklar görünmeli.
- 500 filmde 30'dan az role="listitem" bulunmalı.
- Kaydırma alanı yaklaşık 240px yüksekliğinde ve toplam liste yüksekliği kaydırmayı desteklemeli.
- Film id'si satır kimliği olmalı.
- URL state, debounce ve TanStack Query key'leri korunmalı; mevcut API client kullanılmalı.

## Örnek
500 film boş sorguda görünür pencere kadar satır üretir. Dövüş sorgusunda tek Dövüş Kulübü satırı görünür.

## Sözleşme
- src/features/movies/components/VirtualMovieList.tsx → adlı VirtualMovieList export'u.
- Props: movies: { id: number; title: string }[] ve query: string.
- src/pages/SearchPage.tsx gerçek arama sonucunu VirtualMovieList'e bağlar.

## Kısıtlar
- Yeni çıplak fetch çağrısı ekleme; Sinema'nın mevcut API client'ını kullan.
- Film satırlarını indeksle değil film id'siyle tanımla.
