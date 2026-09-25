import { useQuery } from '@tanstack/react-query'
import { BookOpenCheck, Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useMatch } from 'react-router'
import { curriculumQueries } from '@/features/curriculum/api'
import { overallTally } from '@/features/curriculum/progress'
import { Sidebar } from '@/features/curriculum/sidebar'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/status'
import { Tooltip } from '@/components/ui/tooltip'
import { useCurriculumLiveReload } from '@/lib/events'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'

function readSidebarPref() {
  try {
    return localStorage.getItem('rm-sidebar') !== 'closed'
  } catch {
    return true
  }
}

export function AppLayout() {
  useCurriculumLiveReload()
  const { theme, toggle } = useTheme()
  const onQuestion = Boolean(useMatch('/q/:code'))
  const [sidebarOpen, setSidebarOpen] = useState(readSidebarPref)
  const { data } = useQuery(curriculumQueries.tree())
  const tally = data ? overallTally(data) : undefined

  const toggleSidebar = () => {
    setSidebarOpen((open) => {
      try {
        localStorage.setItem('rm-sidebar', open ? 'closed' : 'open')
      } catch {
        // yok say
      }
      return !open
    })
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-3">
        <Tooltip content={sidebarOpen ? 'Menüyü gizle' : 'Menüyü göster'}>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Menü">
            {sidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        </Tooltip>
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <BookOpenCheck className="size-5 text-accent" />
          React Mastering
        </Link>
        <div className="flex-1" />
        {tally && (
          <div className="hidden items-center gap-2 text-xs text-muted sm:flex">
            <span>
              {tally.passed}/{tally.total} soru
            </span>
            <ProgressBar value={tally.ratio} className="w-28" />
          </div>
        )}
        <Tooltip content={theme === 'dark' ? 'Açık tema' : 'Koyu tema'}>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Temayı değiştir">
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </Tooltip>
      </header>
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && <Sidebar />}
        <main className={cn('min-w-0 flex-1', onQuestion ? 'overflow-hidden' : 'overflow-y-auto')}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
