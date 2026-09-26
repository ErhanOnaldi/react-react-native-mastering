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
    'İşlevsel olmayan gereksinimler (erişilebilirlik, mobil, gizlilik, API nezaketi, kalite/CI) ölçülebilir biçimde var mı?',
    '“Kapsam dışı” bölümü var mı ve v1’de yapılmayacakları açıkça söylüyor mu?',
    'Belge çözüm/mimari detayı (Redux, Context, hangi hook) içermeden sadece ne ve neden’i anlatıyor mu?',
  ],
  hints: [
    'İskelet: Amaç → Kullanıcı → Sözlük → Hikâyeler ve kabul kriterleri → Kenar durumları → İşlevsel olmayan gereksinimler → Kapsam dışı → Açık sorular.',
    'Her kabul kriterini okurken kendine sor: “Bunun için bir test yazabilir miyim? Testin adı ne olurdu?” Yazamıyorsan kriter henüz belirsizdir.',
    'Kenar durumlarını bir tabloda topla: Durum | Örnek veri | Beklenen davranış. Örnek verileri curl çıktısından kopyala.',
  ],
})
