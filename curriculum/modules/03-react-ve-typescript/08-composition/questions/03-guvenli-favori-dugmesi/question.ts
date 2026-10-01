import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Güvenli favori düğmesi',
  difficulty: 'orta',
  concepts: ['ts.omit', 'react.props', 'react.children'],
  files: ['FavoriteButton.tsx'],
  hints: [
    'Button özelliklerini çağırandan al, ancak form davranışını sabit tut.',
    "`ComponentProps<'button'>` ile HTML button tipini al; `Omit` ile `type` alanını çıkar.",
    'Children\'ı kalan özelliklerden ayır; `<button {...rest} type="button">{children}</button>` döndür.',
  ],
})
