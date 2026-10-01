Arama kutusuna yazdığın metin anında güncellensin; sorgudan bağımsız olan sabit sonuç paneli ise her harfte tekrar çalışmasın.

## Gereksinimler
- Arama kutusunu kontrollü (controlled) tut: kullanıcının yazdığı metin hemen arama alanında ve "Arama: {sorgu}" metninde görünmelidir.
- Sabit panelde `Film sonuçları hazır` metni görünmelidir.
- Sabit sonuç panelinin render callback'i (`onResultsRender`), yalnızca sonuç paneli gerçekten render edildiğinde çağrılmalıdır.
- Arama metni değiştiğinde sonuç panelinin tekrar render edilmesi engellenmelidir.

## Örnek
Kullanıcı arama kutusuna "Matrix" yazdığında arama kutusunda "Matrix" görünür; ancak sonuç panelinin render sayısı artmaz.

## Sözleşme
- Dosya ve export: `SearchShell.tsx` → `SearchShell({ onResultsRender }: { onResultsRender: () => void })`
- Arayüz: `textbox` rolünde "Film ara" etiketli input, "Arama: {query}" metni ve "Film sonuçları hazır" metni.
