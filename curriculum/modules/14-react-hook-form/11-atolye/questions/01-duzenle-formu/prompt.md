İzleme listesi düzenleme kartı başka bir kayda geçtiğinde ekrandaki alanlar seçilen listeyle eşleşmiyor.

## Gereksinimler

- Seçilen listenin adı ve açıklaması düzenlenebilir alanlarda görünsün.
- `list` başka kayda geçtiğinde iki alan da yeni listenin değerini hemen göstersin.
- Hiçbir alan değişmemişse “Kaydet” etkin olmasın ve callback çağrılmasın.
- Bir alan değişince “Kaydet” etkinleşsin; tıklanınca güncel ad ve açıklama callback'e gitsin.
- Kayıt tamamlanınca aynı liste için düğme yeniden devre dışı olsun.

## Örnek

İlk listede açıklamayı düzenle ve kaydet; sonra ikinci listeye geç. İkinci listenin adı/açıklaması görünmeli, düğme değişiklik yapılana kadar kapalı kalmalı.

## Sözleşme

- Dosya ve export: `WatchlistEditor.tsx` → named export `WatchlistEditor`.
- Props: `list: { id: string; name: string; description: string }`; `onSave(values: { name: string; description: string }): void`.
- Arayüz: “Liste adı”, “Açıklama” alanları ve “Kaydet” düğmesi.
- Önizleme `Preview.tsx` içinden birkaç listeyi sırayla gösterir.
