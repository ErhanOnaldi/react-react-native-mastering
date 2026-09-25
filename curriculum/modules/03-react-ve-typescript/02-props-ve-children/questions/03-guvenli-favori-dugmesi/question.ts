import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Güvenli favori düğmesi',
  difficulty: 'kolay',
  concepts: ['ts.omit', 'react.props', 'react.children'],
  files: ['FavoriteButton.tsx'],
  hints: [
    'Doğal düğme props’unu tek tek saymadan nasıl türetirsin?',
    "`ComponentProps<'button'>` üzerinden `type` alanını `Omit` ile çıkar.",
    '`{ children, ...rest }` ayır; `<button {...rest} type="button">{children}</button>` döndür.',
  ],
})
