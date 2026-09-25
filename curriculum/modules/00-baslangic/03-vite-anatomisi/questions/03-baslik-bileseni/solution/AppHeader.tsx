interface AppHeaderProps {
  title: string
  tagline: string
}

export function AppHeader({ title, tagline }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-slate-500">{tagline}</p>
    </header>
  )
}
