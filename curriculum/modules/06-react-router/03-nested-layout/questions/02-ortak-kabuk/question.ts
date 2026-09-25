import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Ortak kabuğa çocuk sayfa yerleştir',
  difficulty: 'orta',
  concepts: ['router.nested-layouts', 'react.composition'],
  files: ['RootLayout.tsx'],
  hints: [
    'Çocuk route içeriğinin nereye yerleşeceğini düşün.',
    '`react-router` içinden `Outlet` ekle; kök linkte `end` kullan.',
  ],
})
