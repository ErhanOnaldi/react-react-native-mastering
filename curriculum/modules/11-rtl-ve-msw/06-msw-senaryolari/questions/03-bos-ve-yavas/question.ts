import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Boş ve yavaş arama cevabı',
  difficulty: 'orta',
  concepts: ['test.msw-overrides', 'test.async'],
  files: ['emptyHandler.ts'],
  hints: [
    'MSW delay fonksiyonu Promise döndürür; await et.',
    'new URL(request.url).searchParams.get("page") ile sayfayı oku.',
    'Number.isInteger ve page < 1 kontrolünden sonra HttpResponse.json dön.',
  ],
})
