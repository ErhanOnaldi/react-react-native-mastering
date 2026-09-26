import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Ürün keşfi',
  difficulty: 'zor',
  concepts: ['arch.feature-folders', 'arch.api-client', 'arch.state-categories', 'tooling.vite'],
  reviewFiles: ['src/urun-kesfi/**'],
  hints: [
    'Önce ürün listeleme ile gezinme davranışını ayır.',
    'Arama ve kategori URL’de, açık detay ürünün kimliğine bağlı olabilir.',
    'DummyJSON /products, /products/search ve /products/categories kaynaklarını kullan; detay için /products/:id iste.',
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
