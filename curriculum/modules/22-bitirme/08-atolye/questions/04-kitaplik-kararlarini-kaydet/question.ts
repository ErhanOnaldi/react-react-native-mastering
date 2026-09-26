import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Kitaplık kararlarını kaydet',
  difficulty: 'zor',
  concepts: ['arch.adr', 'arch.api-client', 'capstone.requirements'],
  reviewFiles: ['src/kitaplik-kararlarini-kaydet/**'],
  hints: [
    'Arama sonucundaki yazar bilgisiyle ayrı bir yazar sorgusu arasında seçim yapıyorsun; ikisinin bakım maliyeti farklı.',
    'Seçimini kısa bir karar notunda yaz: hangi seçenekleri düşündün, hangisini seçtin, neden.',
    'Örnek sınır: arama sonucundaki yazar adını doğrudan göster (basit, ayrıntı az) ya da yazarın kendi verisini ayrıca iste (daha fazla istek, daha zengin görünüm).',
  ],
  rubric: [
    'Gerçek Open Library araması çalışır ve sonuçlar listelenir.',
    'Bir yazara gidince o yazarın diğer kitapları gerçek veriyle görünür.',
    'Sonuç yokken ve istek hata verince ekran anlaşılır bir durum gösterir.',
    'Arama ve yazar geçişleri klavye ile de kullanılabilir.',
    'Karar notu iki seçeneği ve seçilenin gerekçesini somut biçimde anlatır.',
    'Karar notu kabul edilen bakım/maliyet ödünleşimini adlandırır.',
  ],
})
