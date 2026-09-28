import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İki sayfada film listesi',
  difficulty: 'zor',
  concepts: ['arch.separation-of-concerns', 'arch.refactoring', 'react.composition'],
  files: ['MoviePages.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'İki ekranda kullanıcıya aynı görünen parçayı, ekrana göre değişen veriden ayır.',
    'Composition ve props ile aynı liste component’ini farklı veri kaynağına bağlayabilirsin.',
    'Ortak listeye sonuç/durum ver; yalnız arama ekranı sorguyu ve isteği yönetsin.',
    'Boş sonuç ve hata başarı listesinden farklı görünmeli; hata accessible alert olmalı.',
  ],
  rubric: [
    'İki ekran aynı film listesi görünümünü yeniden kullanır.',
    'Veri alma sorumluluğu liste işaretlemesinden ayrıdır.',
    'Ortak parçanın aldığı değerler ve adları anlaşılırdır.',
    'Yükleme, boş sonuç ve hata görünümü iki ekranda da korunur.',
  ],
})
