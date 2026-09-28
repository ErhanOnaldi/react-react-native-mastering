import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Başlık bileşeni',
  difficulty: 'kolay',
  concepts: ['react.components', 'react.props', 'tooling.hmr'],
  files: ['AppHeader.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Test dosyasını incele: en dışta bir `<header>` elementi, içinde `<h1>` başlığı ve `<p>` alt yazısı bekleniyor.',
    'Bileşen parametresinde props destructuring kullan: `export function AppHeader({ title, tagline }: AppHeaderProps)`.',
    'İskelet: `<header className="border-b border-slate-200 pb-4"><h1>{title}</h1><p>{tagline}</p></header>`.',
  ],
})
