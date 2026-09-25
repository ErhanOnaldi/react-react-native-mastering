import { CheckCircle2, Circle, CircleDot } from 'lucide-react'
import type { Difficulty, QuestionStatus, QuestionType } from '@rm/server/dto'
import { cn } from '@/lib/cn'
import { Badge } from './badge'

export function StatusIcon({ status, className }: { status: QuestionStatus; className?: string }) {
  if (status === 'passed')
    return <CheckCircle2 aria-label="Tamamlandı" className={cn('size-4 text-success', className)} />
  if (status === 'in-progress')
    return <CircleDot aria-label="Devam ediyor" className={cn('size-4 text-warning', className)} />
  return <Circle aria-label="Başlanmadı" className={cn('size-4 text-subtle', className)} />
}

const difficultyTone = { kolay: 'success', orta: 'warning', zor: 'danger' } as const
const difficultyLabel = { kolay: 'Kolay', orta: 'Orta', zor: 'Zor' } as const

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge tone={difficultyTone[difficulty]}>{difficultyLabel[difficulty]}</Badge>
}

const typeLabel = { quiz: 'Quiz', code: 'Kod', project: 'Proje' } as const

export function TypeBadge({ type }: { type: QuestionType }) {
  return <Badge tone="neutral">{typeLabel[type]}</Badge>
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 overflow-hidden rounded-full bg-surface-3', className)}
    >
      <div
        className="h-full rounded-full bg-success transition-[width] duration-500"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  )
}
