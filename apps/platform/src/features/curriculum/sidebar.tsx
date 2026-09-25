import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useParams } from 'react-router'
import type { ModuleSummaryDto } from '@rm/server/dto'
import { StatusIcon } from '@/components/ui/status'
import { cn } from '@/lib/cn'
import { curriculumQueries } from './api'
import { moduleTally, PHASES } from './progress'

/** URL'deki koddan (5, 5.1, 5.1.2) modül kodunu çıkarır. */
function activeModuleCode(params: Record<string, string | undefined>) {
  return params.code?.split('.')[0]
}

function ModuleNode({
  module,
  expanded,
  onToggle,
}: {
  module: ModuleSummaryDto
  expanded: boolean
  onToggle: () => void
}) {
  const tally = moduleTally(module)
  return (
    <li>
      <div className="group flex items-center gap-1 rounded-lg pr-2 hover:bg-surface-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={`${module.title} derslerini ${expanded ? 'gizle' : 'göster'}`}
          className="grid size-7 shrink-0 place-items-center text-subtle hover:text-fg"
        >
          <ChevronRight className={cn('size-3.5 transition-transform', expanded && 'rotate-90')} />
        </button>
        <NavLink
          to={`/m/${module.code}`}
          className={({ isActive }) =>
            cn(
              'flex min-w-0 flex-1 items-center gap-2 py-1.5 text-sm',
              isActive ? 'text-accent' : 'text-fg',
            )
          }
        >
          <span className="w-5 shrink-0 text-right font-mono text-[11px] text-subtle">
            {module.number}
          </span>
          <span className="truncate">{module.title}</span>
        </NavLink>
        <span className="shrink-0 font-mono text-[10px] text-subtle">
          {tally.passed}/{tally.total}
        </span>
      </div>
      {expanded && (
        <ul className="mb-1 ml-[1.1rem] border-l border-border pl-2">
          {module.lessons.map((lesson) => (
            <li key={lesson.id}>
              <NavLink
                to={`/l/${lesson.code}`}
                className={({ isActive }) =>
                  cn(
                    'block truncate rounded-md px-2 py-1 text-[13px]',
                    isActive ? 'bg-accent-soft text-accent' : 'text-muted hover:text-fg',
                  )
                }
              >
                <span className="mr-1.5 font-mono text-[10px] text-subtle">{lesson.code}</span>
                {lesson.title}
              </NavLink>
              <ul className="mb-1">
                {lesson.questions.map((q) => (
                  <li key={q.id}>
                    <NavLink
                      to={`/q/${q.code}`}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2 rounded-md py-0.5 pr-2 pl-4 text-xs',
                          isActive ? 'bg-surface-3 text-fg' : 'text-muted hover:text-fg',
                        )
                      }
                    >
                      <StatusIcon status={q.status} className="size-3.5" />
                      <span className="truncate">{q.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export function Sidebar() {
  const { data } = useQuery(curriculumQueries.tree())
  const active = activeModuleCode(useParams())
  // Kullanıcının açıp kapattıkları; dokunulmamış modüllerde aktif modül açık gelir (türetilmiş state)
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const isExpanded = (code: string) => toggled[code] ?? code === active

  if (!data) return <aside className="w-72 shrink-0 border-r border-border bg-surface" />

  const phases = [...new Set(data.modules.map((m) => m.phase))]
  return (
    <aside
      aria-label="Müfredat"
      className="w-72 shrink-0 overflow-y-auto border-r border-border bg-surface px-2 py-3"
    >
      {phases.map((phase) => (
        <section key={phase} className="mb-3">
          <h2 className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-subtle uppercase">
            Faz {phase} · {PHASES[phase]}
          </h2>
          <ul>
            {data.modules
              .filter((m) => m.phase === phase)
              .map((module) => (
                <ModuleNode
                  key={module.id}
                  module={module}
                  expanded={isExpanded(module.code)}
                  onToggle={() =>
                    setToggled((prev) => ({ ...prev, [module.code]: !isExpanded(module.code) }))
                  }
                />
              ))}
          </ul>
        </section>
      ))}
    </aside>
  )
}
