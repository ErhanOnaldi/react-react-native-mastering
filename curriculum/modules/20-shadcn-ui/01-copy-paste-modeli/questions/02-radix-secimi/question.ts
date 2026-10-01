import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Primitive ailesiyle bağımlılığı eşleştir',
  difficulty: 'orta',
  concepts: ['shadcn.setup', 'pattern.headless'],
  question:
    'Sinema checkpoint’inde `radix-ui` zaten kurulu ve mevcut Dialog primitive’i Radix API’sini kullanıyor. Yeni eklediğin shadcn bileşeni ise Base UI import ediyor. Bu kaynakları aynı primitive ailesinde tutmak için ne yaparsın?',
  options: [
    {
      text: 'Yeni bileşenleri Radix ailesiyle üret; böylece üretilen parçalar mevcut `radix-ui` primitive API’siyle aynı sözleşmeyi kullanır.',
      correct: true,
      explanation:
        'Doğru. shadcn’in primitive aile seçimi üretilen bileşen API’sini belirler; Sinema’nın mevcut Radix koduyla aynı aileyi seçmelisin.',
    },
    {
      text: 'Base UI import’unu `radix-ui` import’una elle değiştirmek; iki ailenin bileşen adları ve props’ları eşdeğerdir.',
      explanation:
        'Aileler benzer arayüzler sunsa da export ve props sözleşmeleri aynı değildir; yalnız import adını değiştirmek uyum sağlamaz.',
    },
    {
      text: 'Projeye ikinci primitive paketini ekleyip iki aileyi aynı Dialog içinde karıştırmak; dış görünüşleri eşitlenince davranışları da birleşir.',
      explanation:
        'İki aileyi ayrı bileşenlerde birlikte kullanabilirsin, ancak tek bir compound Dialog ağacı paylaşmazlar. Bu görevde amaç mevcut Radix ailesiyle tutarlılık.',
    },
  ],
})
