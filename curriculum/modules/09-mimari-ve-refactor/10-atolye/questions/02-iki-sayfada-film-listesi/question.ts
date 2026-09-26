import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İki sayfada film listesi',
  difficulty: 'zor',
  concepts: ['arch.separation-of-concerns', 'arch.refactoring', 'react.composition'],
  files: ['MoviePages.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'İki ekranda aynı kalan görünüm ile farklı olan veri kaynağını ayır.',
    'Popüler ve arama ekranları aynı liste durumlarını gösterebilir.',
    'Ortak listeyi sonuç ve durum props’larıyla besle; sorguyu yalnız arama ekranı kullansın.',
  ],
  rubric: [
    'İki ekran aynı film listesi görünümünü yeniden kullanır.',
    'Veri alma sorumluluğu liste işaretlemesinden ayrıdır.',
    'Ortak parçanın aldığı değerler ve adları anlaşılırdır.',
    'Yükleme, boş sonuç ve hata görünümü iki ekranda da korunur.',
  ],
})
