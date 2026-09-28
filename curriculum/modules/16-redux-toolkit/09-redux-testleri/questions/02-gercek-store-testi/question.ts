import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Bileşeni gerçek store ile bağla',
  difficulty: 'orta',
  concepts: ['redux.testing', 'test.rtl-queries', 'test.user-event'],
  files: ['WatchCounter.tsx'],
  hints: [
    'Arayüz hem store’daki liste boyunu göstermeli hem de kullanıcı etkileşimiyle listeyi güncellemelidir.',
    'Hazır tipli selector/dispatch hook’larıyla `ids.length` değerini oku ve `add(550)` action’ını gönder.',
    '`<output>{count} film</output>` üret; düğmenin `onClick` olayında dispatch yap.',
  ],
  preview: { entry: 'Preview.tsx' },
})
