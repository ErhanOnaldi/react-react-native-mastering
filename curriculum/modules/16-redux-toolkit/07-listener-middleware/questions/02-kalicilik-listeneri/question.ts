import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Favorileri kalıcı yaz',
  difficulty: 'orta',
  concepts: ['redux.listener', 'redux.store'],
  files: ['persist.ts'],
  hints: [
    'Listener’ı store’dan önce oluştur.',
    '`startListening({ actionCreator: toggle, effect })` kullan.',
    '`api.getState()` reducer sonrası state’i verir; `JSON.stringify(ids)` yaz.',
  ],
})
