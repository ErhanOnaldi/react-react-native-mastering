# ADR 0002 — Okuma listesi: Context + useReducer + localStorage (Zod doğrulamalı)

- **Durum:** Kabul edildi
- **Tarih:** 2026-09-25
- **İlgili gereksinimler:** K-15, K-16, K-20, K-21

## Bağlam

Okuma listesi Kitaplık'ın **kendi** verisi (client state): sunucuda karşılığı yok. İki yerden okunur (menüdeki sayı, liste sayfası), iki yerden yazılır (detay formu, liste sayfası). Hesap olmadığı için tarayıcıda kalıcı olmalı. Liste büyüklüğü birkaç yüz kaydı geçmez.

Sinema'da favoriler önce `useState`, sonra Context, sonra Redux'a taşındı: karar baştan verilmediği için üç kez taşıma yaptık.

## Karar

1. Liste bir `ReadingListProvider` içinde **`useReducer`** ile tutulur (`upsert`, `remove`, `replace` eylemleri). Bileşenler `useReadingList()` hook'u ile erişir; Context'in kendisi dışarı açılmaz.
2. Her değişiklik bir effect ile `localStorage`'a (`kitaplik:reading-list`) yazılır; ilk değer oradan okunur.
3. **Okurken Zod ile doğrulanır.** Tarayıcıdaki veri de dış veridir: elle değiştirilmiş ya da eski biçimde olabilir. Geçersizse boş listeyle başlanır (K-21).
4. Başka sekmedeki değişiklik `storage` olayıyla bu sekmeye yansıtılır.
5. Provider, `AppProviders` içinde; testler de aynı bileşeni kullanır.

## Değerlendirilen alternatifler

| Seçenek                                     | Artı                                  | Eksi                                                  |
| ------------------------------------------- | ------------------------------------- | ----------------------------------------------------- |
| Redux Toolkit + listener middleware         | DevTools, zaman yolculuğu, ölçeklenir | Tek özellik için fazla kurulum; ekip yok              |
| Zustand (`persist` ile)                     | Çok az kod, seçici abonelik           | Yeni bağımlılık; `persist` doğrulamayı kendisi yapmaz |
| `useSyncExternalStore` ile kendi store'umuz | Bağımlılık yok, seçici okuma          | Abonelik kodunu kendimiz yazıp test etmeliyiz         |
| Her bileşende `useLocalStorage`             | En basit                              | İki kopya state: menü sayısı ile liste senkron kalmaz |

## Sonuçlar

- ✅ Bağımlılık eklemeden, küçük ve test edilebilir bir çözüm; reducer saf fonksiyon.
- ✅ Bozuk veri uygulamayı çökertmez.
- ⚠️ Context değeri değişince tüm tüketiciler render olur. Bugün iki tüketici var; liste binleri bulursa ya da tüketici sayısı artarsa `useSyncExternalStore`/Zustand'a geçiş yeniden değerlendirilecek.
- ⚠️ Kayıt biçimi değişirse eski listeler "geçersiz" sayılıp silinir. Biçim değişikliğinde bir `version` alanı ve dönüştürme adımı eklenecek.
