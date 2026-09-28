Bir etkinlik kataloğu statik host üzerinde açılacak. Derin bağlantılar yenilenebilmeli, yeni sürüm zamanında görünmeli ve yalnızca izin verilen API adreslerine tarayıcıdan bağlanılmalı.

## Gereksinimler

- Bilinmeyen uygulama yolları `index.html` içeriğini başarılı yanıtla açar.
- Hash’li asset dosyaları bir yıl boyunca değişmez kabul edilerek cachelenir.
- `index.html` her kullanımda yeniden doğrulanır.
- Sayfanın ağ bağlantıları kendi origin’i ve verilen API origin’leriyle sınırlıdır.

## Örnek

`/konser/42` doğrudan açıldığında uygulama yüklenir; `/assets/app-a1.js` uzun cache alır; HTML yeniden doğrulanır ve ağ izni verilen API origin’ini kapsar.

## Sözleşme

- `hostRules.ts` dosyası `makeHostRules(apiOrigins: string[]): { redirects: string; headers: string }` export eder.
- `redirects` ve `headers`, statik host’un ilgili metin dosyalarına yazılabilecek içeriktir.
