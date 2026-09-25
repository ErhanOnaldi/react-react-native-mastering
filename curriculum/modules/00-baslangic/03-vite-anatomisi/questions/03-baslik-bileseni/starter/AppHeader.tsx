interface AppHeaderProps {
  title: string
  tagline: string
}

export function AppHeader({ title, tagline }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-4">
      {/* Başlığı ve alt yazıyı burada göster */}
    </header>
  )
}
