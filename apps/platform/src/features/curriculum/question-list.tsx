import { Link } from 'react-router'
import type { QuestionSummaryDto } from '@rm/server/dto'
import { DifficultyBadge, StatusIcon, TypeBadge } from '@/components/ui/status'

export function QuestionList({ questions }: { questions: QuestionSummaryDto[] }) {
  return (
    <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {questions.map((q) => (
        <li key={q.id}>
          <Link
            to={`/q/${q.code}`}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-2"
          >
            <StatusIcon status={q.status} />
            <span className="w-14 shrink-0 font-mono text-xs text-subtle">{q.code}</span>
            <span className="min-w-0 flex-1 truncate text-sm">{q.title}</span>
            <TypeBadge type={q.type} />
            <DifficultyBadge difficulty={q.difficulty} />
          </Link>
        </li>
      ))}
    </ol>
  )
}
