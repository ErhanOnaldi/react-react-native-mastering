Arama kutusuna yazı yazıldığında, henüz sorguya bağlı olmayan sabit sonuç panelinin her harfte tekrar çalışmasını engellemek istiyorsun.

## Gereksinimler
- Arama kutusunu kontrollü (controlled) tut: kullanıcının yazdığı metin hemen arama alanında ve "Arama: {sorgu}" metninde görünmelidir.
- Sabit sonuç panelinin render callback'i (`onResultsRender`), yalnızca sonuç paneli gerçekten render edildiğinde çağrılmalıdır.
- Arama metni değiştiğinde sonuç panelinin tekrar render edilmesi engellenmelidir.

## Örnek
Kullanıcı arama kutusuna "Matrix" yazdığında arama kutusunda "Matrix" görünür; ancak sonuç panelinin render sayısı artmaz.

## Sözleşme
- Dosya ve export: `SearchShell.tsx` → `SearchShell({ onResultsRender }: { onResultsRender: () => void })`
- Arayüz: `textbox` rolünde "Film ara" etiketli input, "Arama: {query}" metni, "Film sonuçları hazır" metni.
