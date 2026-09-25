import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film tarayıcısı',
  difficulty: 'kolay',
  concepts: [
    'react.lifting-state',
    'react.immutability',
    'react.controlled-input',
    'react.lists-keys',
  ],
  files: ['MovieBrowser.tsx'],
  hints: [
    'Önce aramanın ve favorinin sahiplerini belirle.',
    'İki state’i MovieBrowser’da tut; filtreyi render’da hesapla, favoriyi id listesinde güncelle.',
    '`setFavorites(ids => ids.includes(id) ? ids.filter(...) : [...ids,id])` kullan; düğme adını ve `aria-pressed` değerini aynı üyelikten çıkar.',
  ],
})
