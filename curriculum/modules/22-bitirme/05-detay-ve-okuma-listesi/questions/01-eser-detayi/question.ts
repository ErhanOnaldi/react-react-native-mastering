import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Eser detayı ve bağımlı yazar verisi',
  difficulty: 'zor',
  concepts: [
    'router.params',
    'query.query-options',
    'query.dependent',
    'zod.api-validation',
    'ts.optional-nullable',
    'fetch.error-handling',
  ],
  project: 'kitaplik',
  focusFiles: ['src/app/routes.tsx', 'src/features/books/pages/WorkPage.tsx'],
  reviewFiles: ['src/features/books/**/*.{ts,tsx}', 'src/app/routes.tsx'],
  rubric: [
    'URL kimliği query key içinde mi; başka esere geçince yeni veri geliyor mu?',
    'Open Library cevapları Zod ile doğrulanıp açıklamanın iki biçimi tek UI tipine çevriliyor mu?',
    'Yazar isteği eser verisinden sonra ve ancak yazar anahtarı varsa atılıyor mu; yazar 404 ayrı ele alınıp eser ekranı korunuyor mu?',
    'Kapak id’si pozitif değilse kırık görsel yerine yer tutucu var mı?',
    '404 ile geçici sunucu/ağ hatası ayrılıyor; yeniden deneme sorguyu tekrar çalıştırıyor mu?',
  ],
  hints: [
    'Eser detayı ve yazar bilgisi Open Library’de iki ayrı API kaynağıdır; yazar isteğini eserin getirdiği anahtara bağla.',
    'URL’deki `workId` parametresini hem rota hem de query key için kullan. Bağımlı sorgu için `enabled: Boolean(authorKey)` tanımla veya yazar isteğini güvenli bir yardımcı fonksiyonla tamamla.',
    'Eser cevabında `description` alanını kontrol et: hem düz string hem `{ type, value }` nesnesi gelebilir; ikisini de tek bir string’e dönüştür. Kapak görseli için `covers?.[0] > 0` kontrolü yap.',
    'Yazar isteği 404 dönerse veya başarısız olursa tüm ekranı çökertme; eser detayını göstermeye devam et ve yazar alanında “Yazar bilinmiyor” yaz. Eserin kendisi 404 ise “Kitap bulunamadı” mesajı göster.',
  ],
})
