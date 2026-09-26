import { Link, NavLink, Outlet } from 'react-router'
import { SearchForm } from '@/features/books/components/SearchForm'
import { useReadingList } from '@/features/reading-list/useReadingList'
import { cn } from '@/shared/lib/cn'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn('rounded-md px-3 py-1.5 text-sm', isActive ? 'bg-stone-200 font-medium' : 'hover:bg-stone-100')

export function RootLayout() {
  const { entries } = useReadingList()
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/" className="font-serif text-xl font-bold">
            📚 Kitaplık
          </Link>
          <SearchForm />
          <nav aria-label="Ana menü" className="ml-auto flex gap-1">
            <NavLink to="/reading-list" className={navClass}>
              Okuma listem ({entries.length})
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
