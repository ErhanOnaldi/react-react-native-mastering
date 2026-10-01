import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Arama reducer geçişleri',
  difficulty: 'orta',
  concepts: ['react.useReducer', 'ts.discriminated-union'],
  files: ['searchReducer.ts'],
  hints: [
    'Her action, arama ekranında tek bir anlamlı geçişi temsil ediyor.',
    '`switch(action.type)` ile dallan; her dalda yeni state nesnesi döndür.',
    '`query` dalında page/results/error birlikte sıfırlanır; `success` ve `error` loading’i kapatır.',
    'Tüm bilinen `action.type` değerlerini ayrı case ile ele al; geçersiz durum için sade bir varsayılan dönüş kullan.',
  ],
})
