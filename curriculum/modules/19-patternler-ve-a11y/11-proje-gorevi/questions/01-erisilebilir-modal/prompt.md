Sinema'nın film detayında fragman açılınca kullanıcı klavyeden pencerede dolaşabilmeli ve kapandığında kaldığı yere dönebilmelidir. Tekrar kullanılabilir modal parçalarını ve detay sayfasındaki fragman akışını tamamla.

## Gereksinimler

- Modal kapalıyken içeriği DOM'da bulunmasın; tetikleyici click, Enter ve Space ile açsın.
- Açık içerik body altında bulunsun; `dialog` rolü, modal durumu ve görünür başlıktan gelen erişilebilir adı olsun.
- Açılışta ilk focus alabilen kontrol focus alsın. Tab ve Shift+Tab içeride dönsün; `disabled` öğeler atlanıp güncel içerik dikkate alınsın.
- Escape ve kapatma düğmesi kapatsın; focus açan öğeye dönsün. Açan öğe artık DOM'da değilse hata oluşmasın.
- Tetikleyici mevcut bir elementle kullanıldığında tek DOM öğesi üretsin; child click ve ref korunmalı.
- Film videosu varsa fragman düğmesi gösterilsin; önce `Trailer` seçilsin. Video yoksa düğme çıkmasın.
- Dialogda video adı, yeni sekmede açılan güvenli YouTube bağlantısı ve Kapat düğmesi bulunsun.
- Mevcut sayfa export'u, Suspense/Query akışı ve diğer bölümler korunsun.

## Örnek

550 numaralı filmde **Fragmanı aç** dialogu `Dövüş Kulübü fragmanı` adıyla açar ve `Fight Club Trailer HD` başlığını gösterir. Dialog kapanınca focus Fragmanı aç düğmesine döner.

## Sözleşme

- `src/shared/ui/modal/useDisclosure.ts` → named export `useDisclosure(initial = false)`, dönüşü `{ isOpen, open, close, toggle }`; eylem referansları kararlı.
- `src/shared/ui/modal/Modal.tsx` → named export `Modal`; API: `Modal.Trigger`, `Modal.Content({ title })`, `Modal.Close`.
- `src/pages/MovieDetailsPage.tsx` içindeki mevcut named export korunur.
- Dialog rolü `dialog`; video bağlantısının adı `YouTube'da izle`; tetikleyici adı `Fragmanı aç`.
