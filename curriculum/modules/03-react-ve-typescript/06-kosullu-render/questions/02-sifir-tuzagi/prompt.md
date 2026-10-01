Favori özeti, sayı sıfırken boş durum mesajını; pozitifken güncel favori sayısını göstermeli. Boş durumda ekranda tek başına `0` görünmemelidir.

## Gereksinimler

- `count` 0 ise “Henüz favori yok” görünmelidir.
- Pozitif sayı için `N favori` görünmelidir.
- Her durumda kullanıcıya yalnız doğru özet gösterilmelidir.

## Örnek

`count={0}` → “Henüz favori yok”; `count={2}` → “2 favori”.

## Sözleşme

- Dosya ve export: `FavoriteSummary.tsx` → named export `FavoriteSummary`
- Props: `{ count: number }`
- Arayüz: özet bir paragraf olarak görünür.
