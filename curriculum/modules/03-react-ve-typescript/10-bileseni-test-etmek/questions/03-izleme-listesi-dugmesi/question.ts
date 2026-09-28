import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İzleme listesi düğmesini kur',
  difficulty: 'kolay',
  concepts: ['react.components', 'react.props', 'test.rtl-queries', 'test.user-event'],
  files: ['WatchlistButton.tsx'],
  hints: [
    'Düğmenin metni ve basılı durumu, `isSaved` değerine göre nasıl değişmeli?',
    'Düğme için erişilebilir bir ad ve `aria-pressed` kullan; tıklama prop’u üst bileşene iletsin.',
    '`<button type="button" aria-pressed={isSaved} onClick={onToggle}>…</button>` yapısını kur ve metni iki durum arasında seç.',
  ],
})
