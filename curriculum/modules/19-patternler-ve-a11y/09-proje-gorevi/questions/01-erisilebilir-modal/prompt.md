Kod alıştırmasındaki fragman penceresini yeniden kullanılabilir bir `Modal` bileşenine dönüştürüp Sinema'nın detay sayfasına bağlıyorsun.

## Dosya ve export sözleşmesi
- `src/shared/ui/modal/useDisclosure.ts` → named export `useDisclosure(initial = false)` → `{ isOpen, open, close, toggle }`. Fonksiyonların referansı render'lar arasında sabit kalsın.
- `src/shared/ui/modal/Modal.tsx` → named export `Modal` (compound):

```tsx
<Modal>
  <Modal.Trigger>Fragmanı aç</Modal.Trigger>
  <Modal.Content title="Dövüş Kulübü fragmanı">
    …
    <Modal.Close>Kapat</Modal.Close>
  </Modal.Content>
</Modal>
```

- `Modal` kökü `useDisclosure`'ı kullanıp durumu Context ile parçalara versin.
- `Modal.Trigger` varsayılan olarak `<button type="button">` render etsin. `asChild` verilirse **tek** child elementini kullansın: iç içe düğme yok; child'ın `onClick`'i ve `ref`'i korunsun.
- `Modal.Close` `<button type="button">` render edip modalı kapatsın.

## Modal davranışı
1. Kapalıyken içerik DOM'da yok. Trigger (tık, Enter, Space) açar.
2. İçerik `createPortal` ile `document.body` altında; `role="dialog"`, `aria-modal="true"`, adı `title` prop'undan gelen **görünür** başlık (`aria-labelledby` + `useId`).
3. Açılışta içerideki ilk focus alabilen kontrol focus alır.
4. Tab / Shift+Tab içeride döner. Focus alabilen kontrolleri her tuşta yeniden bul; `disabled` olanları atla.
5. Escape ve `Modal.Close` kapatır; kapanınca focus açan öğeye döner (öğe sayfadan kalktıysa hata vermez).

## Detay sayfası (`src/pages/MovieDetailsPage.tsx`)
- Mevcut export'u, Suspense/Query akışını ve diğer bölümleri koru.
- Filmin `videos.results` içinde YouTube videosu varsa (önce `type === 'Trailer'` olanı seç), favori düğmesinin yanında **Fragmanı aç** düğmesi göster. Video yoksa düğme hiç olmasın.
- Dialog adı: **`{film başlığı} fragmanı`** (550 → "Dövüş Kulübü fragmanı").
- Dialog içeriği: videonun adı (550 → "Fight Club Trailer HD"), `https://www.youtube.com/watch?v={key}` adresine giden **YouTube'da izle** linki (yeni sekmede, `rel="noreferrer"`) ve **Kapat** (`Modal.Close`).

Testler geçince Sinema'da yalnızca klavyeyle: Tab → Fragmanı aç → Enter → Tab'la dolaş → Escape.
