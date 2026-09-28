import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Azaltılmış hareket tercihini izle',
  difficulty: 'orta',
  concepts: ['motion.reduced-motion', 'react.custom-hooks', 'react.useEffect'],
  files: ['usePrefersReducedMotion.ts'],
  hints: [
    'İlk render’daki değerin yanında, kullanıcı sistem ayarını sonradan değiştirirse ne olacağını da düşün.',
    '`window.matchMedia`, `MediaQueryList` ve `change` event listener’ı kullan; temizliği effect kapanışında yap.',
    "Sorgu `'(prefers-reduced-motion: reduce)'`; başlangıçta `matches` değerini oku, listener’da `event.matches` değerini state'e yaz.",
    '`jsdom` her zaman `matchMedia` sunmaz; test ortamında bu globali ve listener’ı taklit et.',
  ],
})
