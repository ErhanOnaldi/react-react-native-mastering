import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useParams } from 'react-router'
import type { QuestionDto } from '@rm/server/dto'
import { buttonVariants } from '@/components/ui/button-variants'
import { PageLoader } from '@/components/ui/spinner'
import { DifficultyBadge, StatusIcon, TypeBadge } from '@/components/ui/status'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { questionQueries } from './api'
import { CodeView } from './code-view'
import { ProjectView } from './project-view'
import { QuizView } from './quiz-view'

function QuestionHeader({ question }: { question: QuestionDto }) {
  const nav = (target: QuestionDto['next'], dir: 'prev' | 'next') => {
    const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
    const label = dir === 'prev' ? 'Önceki soru' : 'Sonraki soru'
    return target ? (
      <Tooltip content={`${label}: ${target.code} ${target.title}`}>
        <Link
          to={`/q/${target.code}`}
          aria-label={label}
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
        >
          <Icon />
        </Link>
      </Tooltip>
    ) : (
      <span
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'opacity-30')}
        aria-hidden
      >
        <Icon />
      </span>
    )
  }
  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-3">
      {nav(question.previous, 'prev')}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-subtle">
          <Link to={`/m/${question.module.code}`} className="hover:text-accent">
            {question.module.title}
          </Link>{' '}
          ›{' '}
          <Link to={`/l/${question.lesson.code}`} className="hover:text-accent">
            {question.lesson.title}
          </Link>
        </p>
        <h1 className="flex items-center gap-2 truncate text-sm font-semibold">
          <StatusIcon status={question.progress.status} className="size-3.5" />
          <span className="font-mono text-xs text-subtle">{question.code}</span>
          {question.title}
        </h1>
      </div>
      <TypeBadge type={question.type} />
      <DifficultyBadge difficulty={question.difficulty} />
      {nav(question.next, 'next')}
    </div>
  )
}

export function QuestionPage() {
  const { code = '' } = useParams()
  const { data: question, isPending, error } = useQuery(questionQueries.detail(code))
  if (isPending) return <PageLoader />
  if (error) return <p className="p-8 text-danger">{error.message}</p>

  return (
    <div className="flex h-full flex-col">
      <QuestionHeader question={question} />
      <div className="min-h-0 flex-1">
        {/* key: soru değişince tüm yerel state (seçimler, editör içerikleri) sıfırlansın */}
        {question.type === 'quiz' && <QuizView key={question.code} question={question} />}
        {question.type === 'code' && <CodeView key={question.code} question={question} />}
        {question.type === 'project' && <ProjectView key={question.code} question={question} />}
      </div>
    </div>
  )
}
