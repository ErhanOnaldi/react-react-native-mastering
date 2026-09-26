import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Hatadan sonra yükleniyor',
  difficulty: 'orta',
  concepts: ['fetch.error-handling', 'fetch.loading-states', 'test.msw-overrides'],
  files: ['MovieDetail.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    '500 cevabının ekranda hangi duruma dönüşmesi gerektiğini düşün.',
    'Yeniden deneme yeni istek başlatmalı; film değişimi eski durumları temizlemeli.',
    'Başlangıç, başarı ve hata durumlarını ayrıştır; response.ok kontrolünden sonra retry sayacını isteğe bağla.',
  ],
})
