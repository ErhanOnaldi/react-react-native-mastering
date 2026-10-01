Sinema yorum formunda puan seçimi gerçek tek seçimli grup gibi çalışsın, alan hataları doğru kontrollere bağlansın ve gönderim sonucu kullanıcıya bildirilsin.

## Gereksinimler
- Yorum formunda puan, adı `Puan` olan bir `radiogroup` ve `1 yıldız`–`5 yıldız` adlı beş seçenek olarak sunulsun.
- Puan grubu yön tuşlarıyla seçim değiştirsin; seçili değer form verisine sayı olarak aktarılsın.
- Yorum alanı `Yorum` etiketiyle erişilebilir olsun.
- Boş gönderim sunucuya istek atmasın; `Puan seç` ve `Yorum gerekli` mesajları görünsün ve ilgili alanlara açıklama olarak bağlansın.
- Geçerli gönderim `POST /comments/add` isteği yapsın; başarıda `Yorum kaydedildi` mesajı görünsün.
- Formda elle sabitlenmiş DOM id'leri ve `aria-describedby` ilişkileri kalmasın.

## Örnek
Boş `Gönder` → alanlar kendi hatalarını gösterir, istek sayısı 0. Puan 4 seçilip yorum yazılırsa → başarılı gönderim ve `Yorum kaydedildi`.

## Sözleşme
- `src/components/ui/form.tsx` → `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`.
- `src/components/ui/label.tsx` → `Label`; `textarea.tsx` → `Textarea`; `radio-group.tsx` → `RadioGroup`, `RadioGroupItem`.
- `src/features/watchlists/ReviewForm.tsx` → mevcut `ReviewForm({ postId })` export'u.
- `src/features/watchlists/schemas.ts` → `reviewSchema`.
- Gönder düğmesinin adı `Gönder`.

## Kısıtlar
- Mevcut DummyJSON mutation ve yükleniyor/hata/başarı akışlarını koru.
