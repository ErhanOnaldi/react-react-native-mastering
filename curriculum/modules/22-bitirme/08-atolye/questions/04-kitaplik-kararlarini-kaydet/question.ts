import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Kitaplık kararlarını kaydet',
  difficulty: 'zor',
  concepts: ['arch.adr', 'arch.api-client', 'capstone.requirements'],
  reviewFiles: ['src/kitaplik-kararlarini-kaydet/**'],
  hints: [
    'Arama sonucu ile yazarın kendi detayları arasındaki veri sınırını belirle; seçtiğin mimari kararın gerekçesini kısa bir notta açıkla.',
    'Arama sonuçlarında gelen özet yazar bilgisiyle yetinmek (az istek, az detay) ile yazarın kendi uç noktasına (`/authors/{id}.json`) giderek tüm eserlerini çekmek (zengin görünüm, ek istek maliyeti) arasındaki ödünleşimi değerlendir.',
    '`src/kitaplik-kararlarini-kaydet/KARAR.md` dosyasında: Bağlam → Karar → Seçenekler → Kabul edilen bakım maliyeti başlıklarını doldur.',
    'Klavye erişilebilirliğini (Tab ile gezinme, Enter ile seçim) ve hata durumlarında kullanıcıya açık bilgi verilmesini gözden kaçırma.',
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
