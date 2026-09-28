Film arama kutusunu klavyeyle kullanan kişi alanı kolayca bulmalı ve yazdığı sorgunun arama ekranına iletildiğini görebilmeli. `SearchBox.test.tsx` içinde bu görünür sözleşmeyi doğrulayan testleri yaz.

## Gereksinimler

- Arama alanı “Film ara” adıyla bulunabilmelidir.
- Alanın başlangıç değeri `query` prop’undaki metindir.
- Kullanıcı alana yazınca `onQueryChange` yeni metinle çağrılmalıdır.
- Alan arama alanı semantiğini korumalıdır (`<input type="search">`).
- Testler doğru bileşende geçmeli ve üç hatalı sürümün her birini en az bir testte yakalamalıdır.

## Örnek

`query="Ma"` ile render edildiğinde alan “Ma” gösterir. Başlangıç sorgusu boşken kullanıcı `Matrix` yazdığında dışarı iletilen son metin `Matrix` olur.

## Sözleşme

- Yazılacak dosya: `SearchBox.test.tsx`
- Import: `@impl/SearchBox` → `SearchBox`
- Props: `{ query: string; onQueryChange: (query: string) => void }`
- Test ortamı: Vitest; `describe`, `expect`, `it` açıkça import edilmeli.
- Arayüz: `searchbox` rolü ve “Film ara” erişilebilir adı

## Kısıtlar

- `impl/` ve `mutants/` altındaki bileşen dosyaları değiştirilemez.
- Ağ isteği gerekmez.
