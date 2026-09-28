import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Açılma mantığını hook’a çıkar',
  difficulty: 'kolay',
  concepts: ['pattern.headless', 'react.custom-hooks', 'react.state-snapshot', 'react.useCallback'],
  files: ['useDisclosure.ts'],
  hints: [
    'Açma ve kapatma tekrar çağrıldığında aynı sonucu vermeli; iki hızlı tersine çevirme ise ilk duruma dönmeli.',
    '`useState` functional updater ve `useCallback` davranışlarını gözden geçir.',
    '`open` true, `close` false planlasın. `toggle`, updater içinde önceki değeri tersine çevirsin; public eylem referanslarını sabitle.',
  ],
})
