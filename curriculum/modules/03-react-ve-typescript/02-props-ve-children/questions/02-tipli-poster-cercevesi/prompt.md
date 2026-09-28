Bir kapak görünümünde değişken içerik, başlık altı açıklamayla birlikte gösterilmeli. İçeriğin yazı veya JSX olmasına izin ver; açıklama verilmediğinde anlaşılır varsayılanı kullan.

## Gereksinimler

- İçerik bir `figure` içinde görünmelidir.
- Varsa açıklama `figcaption` içinde gösterilmelidir.
- Açıklama verilmediğinde “Afiş yok” metni görünmelidir.
- İçerik olarak metin ve JSX kullanılabilmelidir.

## Örnek

`<CoverFrame><strong>Bir kitap</strong></CoverFrame>` → kitap adı görünür ve “Afiş yok” açıklaması yer alır.

## Sözleşme

- Dosya ve export: `PosterFrame.tsx` → named export `PosterFrame`
- Props: `{ children: ReactNode; caption?: string }`
- Arayüz: içerik `figure` içinde, açıklama `figcaption` içinde görünür.
