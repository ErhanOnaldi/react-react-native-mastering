Controlled input kullanarak izleme listesi formunu tamamla. Kullanıcı sekiz alanı doldurabilsin, hataları görebilsin ve yalnız geçerli bir taslağı kaydedebilsin.

## Gereksinimler

- `Liste adı`, `Açıklama`, `Kapak`, `İlk film`, `Etiket`, `Renk`, `Sıra` ve `Not` alanlarının tamamı görünür label ile kullanılabilsin.
- Boş ad için “Liste adı gerekli”; üç karakterden kısa ad için “Liste adı en az 3 karakter olmalı” göster.
- İlk film boşsa “İlk film gerekli” göster.
- Herhangi bir hata varken kayıt callback'ini çağırma.
- Geçerli gönderimde sekiz alanın tümünü string değerlerle callback'e ver; boş bırakılan alanlar da `''` olsun.
- Önizlemede erişilebilir adı “Render sayısı” olan sayaç kalsın ve input yazıldığında sayı artsın.

## Örnek

`Liste adı: Akşam`, `İlk film: Dövüş Kulübü`, diğer alanlar boş → Kaydet → `{ name: 'Akşam', description: '', cover: '', firstMovie: 'Dövüş Kulübü', tag: '', color: '', sort: '', note: '' }`.

## Sözleşme

- Dosya ve export: `ManualWatchlistForm.tsx` → named export `ManualWatchlistForm`.
- Prop: `onSave(draft: WatchlistDraft)`; `WatchlistDraft` alanları `name`, `description`, `cover`, `firstMovie`, `tag`, `color`, `sort`, `note` (tamamı `string`).
- Arayüz: yukarıdaki label adları, “Kaydet” düğmesi, hata metinleri `role="alert"` içinde ve “Render sayısı” adlı `role="status"`.
- Önizleme girişi `Preview.tsx` üzerinden `ManualWatchlistForm` bileşenini kullanır.
