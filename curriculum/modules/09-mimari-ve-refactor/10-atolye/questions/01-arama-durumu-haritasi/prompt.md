Arama ekranını paylaşan biri aynı metni ve sayfayı görmeli. Geri/ileri ile önceki arama geri gelmeli; açık bilgi paneli gezinince kapanmalı. Sonuç sunucudan gelir ve gerektiğinde yeniden yüklenebilir.

## Giriş ve davranış

Testler `SearchWorkspace.tsx` içindeki `SearchWorkspace` bileşenini bir router içinde açar.

- `Arama` alanı, `Sonraki sayfa`, `Önceki sayfa` ve `Bilgi` düğmeleri olsun.
- URL'de `q` ve `page` bulunsun; ilk sayfa 1'dir. Arama değişince sayfa 1'e dönsün.
- Bilgi paneli açılınca `Arama bilgisi` metni görünsün; URL ile gezinince kapansın.
- Sonuçta film başlıkları, yükleme ve hata durumları okunabilsin. Boş arama istek göndermesin.

Örnek: `?q=Matrix&page=2` → `Dövüş` araması → geri → `Matrix` ve 2. sayfa.
