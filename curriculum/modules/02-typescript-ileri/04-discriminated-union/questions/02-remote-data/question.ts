import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Dört istek durumunu modelle',
  difficulty: 'orta',
  concepts: ['ts.discriminated-union', 'ts.generics', 'ts.narrowing'],
  files: ['task.ts'],
  hints: [
    'Bir isteğin olası sonuçlarını ve her sonuçta bulunması gereken alanları listele.',
    '`status` literal alanlı ayrı nesne unionı kur; guard için status karşılaştırması kullan.',
    '`message` fonksiyonunda dört durumu `switch` ile ayrı işle.',
  ],
})
