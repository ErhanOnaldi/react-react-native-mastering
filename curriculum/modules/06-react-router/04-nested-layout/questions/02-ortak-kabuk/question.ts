import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Ortak kabuğa çocuk sayfa yerleştir',
  difficulty: 'orta',
  concepts: ['router.nested-layouts', 'react.composition'],
  files: ['RootLayout.tsx'],
  hints: [
    'Menünün route değişirken kalması, child içeriğinin ise değişmesi için layout içinde hangi yer tutucu gerekir?',
    '`react-router` içindeki `Outlet` çocuk içeriğini render eder; aktif bağlantı için `NavLink` kullan.',
    'Tek `<nav aria-label="Ana menü">` ve `<main><Outlet /></main>` kur; Ana sayfa linkinde `end` kullan.',
  ],
})
