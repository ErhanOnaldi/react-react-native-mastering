import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sıralanan notlar',
  difficulty: 'kolay',
  concepts: ['react.lists-keys', 'react.immutability', 'js.spread'],
  files: ['SortableNotes.tsx'],
  hints: [
    'Önce ekranda hangi davranışın eksik kaldığını ve state’in kime ait olduğunu belirle.',
    'Olay işleyicisinde doğru değeri üret; liste için sabit id, güncelleme için yeni referans kullan.',
    'Çözümü render çıktısı ve etkileşim sırasıyla kontrol et; testteki rol adlarını yakala.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
