import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Filtre API seçimi',
  difficulty: 'orta',
  concepts: ['arch.component-api', 'react.composition', 'react.controlled-input'],
  files: ['DiscoverFilters.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Yeni bir seçim eklendiğinde hangi kullanım biçimi anlaşılır kalır?',
    'Controlled select alanları için ayrı props ya da tek filters nesnesi tasarlayabilirsin.',
    'Tür ve sıralama state’ini varsayılanlarıyla başlat; değişince aynı sahibi güncelle.',
    'Reset iki değeri beraber geri almalı; yorumda seçtiğin API biçimini gerekçelendir.',
  ],
  rubric: [
    'Kod yorumu seçilen API biçimini ve nedenini somut biçimde açıklar.',
    'Tür ve sıralama kontrollerinin erişilebilir etiketleri vardır.',
    'Yeni bir filtre eklendiğinde hangi parça değişeceği nettir.',
    'Kullanıcı seçimi ile görünüm tek bir doğru kaynaktan beslenir.',
  ],
})
