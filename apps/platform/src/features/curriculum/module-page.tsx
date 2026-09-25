import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Clock } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Html } from '@/components/ui/html'
import { PageLoader } from '@/components/ui/spinner'
import { ProgressBar } from '@/components/ui/status'
import { curriculumQueries } from './api'
import { lessonTally, moduleTally, PHASES } from './progress'
import { QuestionList } from './question-list'

const kindLabel = {
  concept: undefined,
  review: 'Tekrar',
  practice: 'Pekiştirme',
  project: 'Proje',
} as const

export function ModulePage() {
  const { code = '' } = useParams()
  const { data: module, isPending, error } = useQuery(curriculumQueries.module(code))
  if (isPending) return <PageLoader />
  if (error) return <p className="p-8 text-danger">{error.message}</p>
  const tally = moduleTally(module)

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-xs font-semibold tracking-wider text-subtle uppercase">
        Faz {module.phase} · {PHASES[module.phase]} · Modül {module.number}
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{module.title}</h1>
      <p className="mt-2 text-muted">{module.summary}</p>
      <div className="mt-4 flex items-center gap-3">
        <ProgressBar value={tally.ratio} className="w-48" />
        <span className="text-xs text-muted">
          {tally.passed}/{tally.total} soru
        </span>
      </div>

      <section className="mt-8 rounded-xl border border-danger/30 bg-danger-soft p-5">
        <h2 className="text-sm font-semibold text-danger">🔥 Neden bu modül?</h2>
        <Html html={module.painHtml} className="mt-2" />
      </section>

      <section className="mt-6 rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold">Bu modülün sonunda</h2>
        <ul className="mt-3 space-y-2">
          {module.outcomes.map((o) => (
            <li key={o} className="flex gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> {o}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-8">
        {module.lessons.map((lesson) => {
          const t = lessonTally(lesson)
          const kind = kindLabel[lesson.kind]
          return (
            <div key={lesson.id}>
              <div className="mb-3 flex items-center gap-3">
                <Link to={`/l/${lesson.code}`} className="text-lg font-semibold hover:text-accent">
                  <span className="mr-2 font-mono text-sm text-subtle">{lesson.code}</span>
                  {lesson.title}
                </Link>
                {kind && <Badge tone="violet">{kind}</Badge>}
                <span className="flex items-center gap-1 text-xs text-subtle">
                  <Clock className="size-3" /> {lesson.minutes} dk
                </span>
                <span className="ml-auto font-mono text-xs text-subtle">
                  {t.passed}/{t.total}
                </span>
              </div>
              <QuestionList questions={lesson.questions} />
            </div>
          )
        })}
      </section>
    </div>
  )
}
