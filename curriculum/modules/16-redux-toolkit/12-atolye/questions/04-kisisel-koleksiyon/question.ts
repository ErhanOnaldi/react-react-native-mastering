import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Kişisel koleksiyon',
  difficulty: 'zor',
  concepts: ['arch.state-categories', 'arch.feature-folders', 'redux.slice'],
  reviewFiles: ['src/kisisel-koleksiyon/**'],
  hints: [
    'Ürünleri listeleme/filtreleme ile sepete ekleme farklı sorumluluklar; ayrı tut.',
    'Sepet içeriği bu oturuma özel bir client state’tir; ürün verisi sunucudan gelir ve filtre değişse bile sepetin kendisi silinmemeli.',
    'DummyJSON `/products`, `/products/search` ve `/products/categories` ile listele; sepeti yerelde (ör. bir slice ya da context) `{ productId, quantity }` biçiminde tut, toplamı oradan hesapla.',
  ],
  rubric: [
    'Gerçek DummyJSON ürünleri listelenir; arama ve kategori filtresi çalışır.',
    'Ürün sepete eklenip çıkarılabilir, miktar değiştirilebilir.',
    'Sepet toplam tutarı doğru hesaplanır ve her değişiklikte güncel kalır.',
    'Filtre değişse bile sepet içeriği korunur: ürün verisi (sunucu) ile sepet seçimi (client) ayrı yönetilir.',
    'Yükleme ve API hatası anlaşılır ve erişilebilir biçimde gösterilir.',
    'Bu özelliğin dosyaları src/kisisel-koleksiyon altında anlamlı sorumluluklarla düzenlenmiştir.',
  ],
})
