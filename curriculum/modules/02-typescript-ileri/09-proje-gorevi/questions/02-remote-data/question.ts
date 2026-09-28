import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Uzak veri durumlarını ortaklaştır',
  difficulty: 'zor',
  concepts: ['ts.discriminated-union', 'ts.type-guards', 'ts.exhaustive-check', 'ts.generics'],
  project: 'sinema',
  focusFiles: ['src/lib/remote-data.ts'],
  hints: [
    'Önce her durumda hangi alanların bulunmasının anlamlı olduğunu yaz.',
    '`status` literal alanıyla dört union dalı kur ve her helper için type predicate tanımla.',
    'Her guard yalnızca kendi status eşitliğini döndürmeli; success dalı `T` bilgisini korur.',
  ],
})
