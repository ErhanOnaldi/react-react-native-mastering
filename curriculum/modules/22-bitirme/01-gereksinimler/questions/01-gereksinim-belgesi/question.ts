import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Kitaplık’ın gereksinim belgesini yaz',
  difficulty: 'orta',
  concepts: ['capstone.requirements', 'test.what-to-test', 'ts.api-types', 'ts.optional-nullable'],
  project: 'kitaplik',
  focusFiles: ['REQUIREMENTS.md'],
  reviewFiles: ['REQUIREMENTS.md'],
  rubric: [
    'Amaç 2–3 cümlede ve kullanıcı (persona) somut anlatılmış mı? Kimin, hangi durumda, neden kullandığı belli mi?',
    'Her kullanıcı hikâyesi “Kullanıcı olarak … istiyorum, çünkü …” biçiminde mi ve “çünkü” kısmı gerçek bir ihtiyaç mı söylüyor?',
    'Kabul kriterleri numaralı (K-1, K-2…), tek tek doğru/yanlış diye kontrol edilebilir ve test adına çevrilebilir mi? “Hızlı”, “güzel”, “kolay” gibi ölçülemez kelimeler kalmış mı?',
    'Sabit sözleşmedeki kararlar (adresler, sayfa başına 10 sonuç, form gönderilince arama, localStorage anahtarı, arayüz metinleri) belgede yer alıyor mu?',
    'Open Library’nin gerçek verisinden çıkan kenar durumları (kapak yok / -1, yazar yok, description’ın iki biçimi, yazar isteğinin 404’ü, çok büyük numFound, yavaş cevap) ve her birinde beklenen davranış yazılmış mı?',
    'Güvenlik kriterleri tanımlı mı: kullanıcı girdisinde ve API çıktısında XSS’e açık kontrolsüz çıkış olmaması, güvenli dış bağlantılar (rel="noreferrer"), istemci kodunda gizli anahtar/sır tutulmaması?',
    'Yayına hazırlık kriterleri tanımlı mı: SPA fallback yönlendirmesi, hash’li dosyalar ve HTML için cache stratejisi, çalışma zamanı hata izleme/raporlama yaklaşımı?',
    'İşlevsel olmayan gereksinimler (erişilebilirlik, mobil, gizlilik, API nezaketi, kalite/CI) ölçülebilir biçimde var mı?',
    '“Kapsam dışı” bölümü var mı ve v1’de yapılmayacakları açıkça söylüyor mu?',
    'Belge çözüm/mimari detayı (Redux, Context, hangi hook) içermeden sadece ne ve neden’i anlatıyor mu?',
  ],
  hints: [
    'İskelet: Amaç → Kullanıcı → Sözlük → Hikâyeler ve kabul kriterleri → Kenar durumları → Güvenlik ve yayına hazırlık → İşlevsel olmayan gereksinimler → Kapsam dışı → Açık sorular.',
    'Her kabul kriterine “Diyelim ki / … yaptığımda / … görürüm” (Given/When/Then) yapısıyla yaklaş. Test edilebilir kesin cümleler kur.',
    'Kenar durumları ve güvenlik için bir tablo kur: Durum | Örnek veri / Risk | Beklenen güvenli davranış.',
    'Kriterlere “Redux kullanılacak” veya “useState ile tutulacak” gibi çözüm yöntemleri yazma. Gereksinim “ne” ve “neden”i söyler; mimari kararlar ADR’ye aittir.',
  ],
})
