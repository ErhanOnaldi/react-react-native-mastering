Sinema projesine tek komutla yerelde çalıştırılabilen test altyapısı ekle. İlk kalıcı testler puan ve boş tarih biçimleme davranışlarını korusun.

## Gereksinimler

- Vite yapılandırması DOM test ortamını kullansın ve test API’lerini global değişken olarak açmasın.
- package.json içinde tek seferlik test çalıştırma script’i bulunsun.
- Proje bağımlılıklarında Vitest ve jsdom olsun; sürümler kök `pnpm-workspace.yaml` içindeki catalog (ortak sürüm tablosu) ile eşleşsin.
- Dört biçimleme durumunu Türkçe davranış adlarıyla sınayan gerçek assertion’lar ekle.
- Beklenen değerlerden biri geçici olarak değiştirildiğinde test komutu başarısız olmalı; sonra doğru beklentiyi geri koy.

## Örnek

| Durum | Beklenen |
| --- | --- |
| Puan 8 | 8.0 |
| Puan 0 | Henüz oy yok |
| Boş çıkış yılı | boş string |
| Boş tarih | Tarih yok |

## Sözleşme

- Vite ayarı: vite.config.ts
- Test dosyası: src/shared/lib/format.test.ts
- Modül: src/shared/lib/format.ts; export’lar formatVote, releaseYear ve formatDate
- Proje script’i: package.json içindeki test komutu
- Doğrulama: Sinema klasöründe pnpm test

## Kısıtlar

- Mevcut Vite ayarlarını ve proje import takma adlarını koru.
- Bağımlılık sürümleri kök workspace’teki ortak sürüm tablosunda yazanlarla aynı olmalı.
