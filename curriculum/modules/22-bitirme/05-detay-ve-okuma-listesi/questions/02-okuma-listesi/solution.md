Referans uygulama: `curriculum/checkpoints/kitaplik/22/src/features/reading-list/`.

## Neden böyle?

- Listeyi `ReadingListProvider` tek sahip olarak tutar. Menüdeki sayı, detay formu ve liste sayfası aynı kaynağı okur. Sayı `entries.length` ile hesaplanır; ikinci bir state yoktur.
- `useReducer` ekle/güncelle/çıkar geçişlerini açık kılar. Küçük bir uygulamada Redux da çalışırdı, fakat ek kurulumun getirisi sınırlı. Liste binlerce kayda veya cihazlar arası eşitlemeye büyürse bu karar yeniden değerlendirilmeli.
- Formun RHF değerleri geçici, kayıtlar kalıcıdır. Zod kuralı “Okudum → puan 1–5” ilişkisini alan görünürlüğünden bağımsız doğrular. Yalnız `required` niteliğine güvenmek, saklanan ya da elle gönderilen yanlış veriyi yakalamaz.
- `localStorage` okumasında hem `JSON.parse` hem `safeParse` gerekir. Geçersiz veri boş listeye düşer; güvenilmeyen veriyi `as ReadingEntry[]` diye geçirmek tip güvenliği sağlamaz.
- `?status=` yalnız görünümü filtreler; kayıtların kendisini değiştirmez. Böylece link paylaşımı ve geri tuşu doğal çalışır.

Sektörde yerel saklama, hesap ve senkronizasyon yerine geçmez. Kullanıcı başka tarayıcıda aynı listeyi görmeyi isterse, veri sahibini sunucuya taşımak ve göç stratejisi yazmak gerekir.
