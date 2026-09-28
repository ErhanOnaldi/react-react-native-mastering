import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Ürün keşfi',
  difficulty: 'zor',
  concepts: ['arch.feature-folders', 'arch.api-client', 'arch.state-categories', 'tooling.vite'],
  reviewFiles: ['src/urun-kesfi/**'],
  hints: [
    'Önce ürün verisi, paylaşılabilir seçimler ve geçici görünüm durumunun sahiplerini belirle.',
    'Arama/kategoriyi URL’de, açılan ürünü route kimliğinde tut; listeyle detay arasında geri dönüşü koru.',
    'DummyJSON `/products`, `/products/search`, `/products/categories` ve `/products/:id` kaynaklarını kullan.',
    'Liste, arama, kategori ve detay için aynı ürün tipini kullan; her görünür durum için ayrı UI parçası çıkar.',
  ],
  rubric: [
    'Gerçek DummyJSON ürünleri listelenir; arama ve kategori filtresi çalışır.',
    'Ürün detayı açılır ve geri dönüş önceki arama/kategori seçimini korur.',
    'Yükleme, boş sonuç ve API hatası anlaşılır ve erişilebilir biçimde görünür.',
    'Paylaşılabilir seçimler URL’de tutulur; geçici ekran durumu ayrı yönetilir.',
    'API adresi ve hata kontrolü görünüm işaretlemesine dağılmamıştır.',
    'Bu özelliğin dosyaları src/urun-kesfi altında anlamlı sorumluluklarla düzenlenmiştir.',
  ],
})
