import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtre API seçimi',
  difficulty: 'orta',
  concepts: ['arch.component-api', 'react.composition', 'react.controlled-input'],
  files: ['DiscoverFilters.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'İki kontrol birlikte çalışır ama yeni bir kontrol sonradan eklenebilir.',
    'Tek filters değeri veya alt seçim parçalarıyla aynı kullanıcı davranışını sağlayabilirsin.',
    'Seçimi yorumda anlat; tür ve sıralamayı etiketli kontrollerle sun, sıfırlamayı aynı kaynaktan yap.',
  ],
  rubric: [
    'Kod yorumu seçilen API biçimini ve nedenini somut biçimde açıklar.',
    'Tür ve sıralama kontrollerinin erişilebilir etiketleri vardır.',
    'Yeni bir filtre eklendiğinde hangi parça değişeceği nettir.',
    'Kullanıcı seçimi ile görünüm tek bir doğru kaynaktan beslenir.',
  ],
})
