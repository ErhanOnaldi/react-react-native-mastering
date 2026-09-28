import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Uzak veri geçişleri',
  difficulty: 'zor',
  concepts: ['ts.discriminated-union', 'ts.generics', 'ts.exhaustive-check', 'js.spread'],
  files: ['task.ts'],
  hints: [
    'Her action için oluşacak yeni durum nesnesini ve taşıması gereken alanları belirle.',
    "`switch (action.type)` ile union'ı daralt; her dalda yeni bir nesne döndür.",
    'Başlangıç dalında eski veriyi taşımamaya ve default içinde `never` kontrolüne dikkat et.',
  ],
})
