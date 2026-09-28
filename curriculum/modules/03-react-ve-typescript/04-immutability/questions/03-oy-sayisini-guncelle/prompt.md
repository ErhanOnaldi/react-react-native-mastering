Bir oylama panosunda kullanıcı oy verdiği filmi artırabilmeli. Film başlığı ve güncel oy sayısı ekranda birlikte görünmelidir.

## Gereksinimler

- Dövüş Kulübü 100, Matrix 50 oyla başlamalıdır.
- Her satırda `BAŞLIK: N oy` metni ve o filme ait oy düğmesi görünmelidir.
- Tıklama yalnız seçilen filmin oyunu bir artırmalıdır.
- Aynı filme iki tıklama iki artış olarak birikmelidir.
- Diğer filmin verisi değişmeden kalmalıdır.

## Örnek

Matrix'e iki kez oy ver → `Matrix: 52 oy`; diğer satır `Dövüş Kulübü: 100 oy` kalır.

## Sözleşme

- Dosya ve export: `VoteBoard.tsx` → named export `VoteBoard`
- Props: yok
- Arayüz: her film için `Oy ver: BAŞLIK` adlı button ve başlık/oy metni.
