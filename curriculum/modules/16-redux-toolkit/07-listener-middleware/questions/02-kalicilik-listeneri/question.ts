import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Favorileri kalıcı yaz',
  difficulty: 'orta',
  concepts: ['redux.listener', 'redux.store'],
  files: ['persist.ts'],
  hints: [
    'Reducer state’i değiştirsin; storage’a güncel değeri action tamamlandıktan sonra yaz.',
    '`createListenerMiddleware` içindeki `startListening` ile ilgili action creator’a bağlan.',
    '`effect` içinde `api.getState()`ten ID’leri oku ve `JSON.stringify(ids)` sonucunu storage anahtarına yaz.',
  ],
})
