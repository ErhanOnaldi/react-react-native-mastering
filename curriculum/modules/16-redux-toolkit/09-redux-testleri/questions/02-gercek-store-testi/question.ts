import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Gerçek store bağlantısına test yaz',
  difficulty: 'orta',
  concepts: ['redux.testing', 'test.rtl-queries', 'test.user-event'],
  files: ['WatchCounter.test.tsx'],
  hints: [
    'Önce başlangıç store’uyla ekranda görünen sayıyı kontrol et.',
    'RTL’de bileşeni gerçek Provider ve yeni store altında render et; kullanıcı tıklamasını `userEvent` ile yap.',
    'Sonuç metnini ve store’daki ID’leri kontrol et; aynı filmi iki kez ekleme davranışını da sınat.',
  ],
  testWriting: {
    mutants: [
      { id: 'does-not-dispatch', label: 'düğme tıklamasını store’a göndermeyen sürüm' },
      { id: 'wrong-count', label: 'store’daki kayıt sayısını yanlış gösteren sürüm' },
    ],
  },
})
