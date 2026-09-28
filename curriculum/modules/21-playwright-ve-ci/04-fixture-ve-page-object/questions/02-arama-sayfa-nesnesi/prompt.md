Arama sayfasını kullanan senaryolar ortak bir arayüz üzerinden çalışmalı ve yalnızca ilgili sorgunun sonuçları hazır olduğunda devam etmeli.

## Gereksinimler

- Arama alanı Film ara adıyla seçilebilir; sonuçlar Arama sonuçları bölgesinde listelenir.
- Sayfa yolu /search olmalıdır.
- Yeni sorgunun kendi sonuç başlığı hazır olmadan işlem tamamlanmış sayılmamalı. Eski sonuçların görünür olması yeterli değildir.
- Gösterilen film bağlantılarının metinleri bir dizi olarak okunabilir.
- Sonuç bulunmadığında arama tamamlanır ve boş dizi döner.
- Tam adı eşleşen film seçildiğinde detay sayfası açılır ve detay başlığı görünür.

## Örnek

matrix araması iki başlık döndürür. Ardından dövüş araması yalnızca Dövüş Kulübü’nü verir; boş arama sonucu boş dizi olur. Matrix Reloaded açıldığında /movie/604 adresindeki başlık görünür.

## Sözleşme

- Dosya ve export: SearchPage.ts içinden SearchPage sınıfını export et.
- searchBox ve results alanları Playwright Locator’dır.
- results bölgesi Arama sonuçları adlı region; içindeki her film listitem ve film adı linktir.
- Constructor bir Page alır.
- Üyeler: searchBox, results, goto(): Promise<void>, search(query: string): Promise<void>, resultTitles(): Promise<string[]> ve openMovie(title: string): Promise<void>.
