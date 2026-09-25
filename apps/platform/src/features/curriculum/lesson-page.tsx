import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Clock, PlayCircle } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button-variants'
import { Html } from '@/components/ui/html'
import { PageLoader } from '@/components/ui/spinner'
import { curriculumQueries } from './api'
import { QuestionList } from './question-list'

const kindLabel = {
  concept: 'Ders',
  review: 'Tekrar',
  practice: 'Pekiştirme',
  project: 'Proje görevi',
} as const

export function LessonPage() {
  const { code = '' } = useParams()
  const { data: lesson, isPending, error } = useQuery(curriculumQueries.lesson(code))
  if (isPending) return <PageLoader />
  if (error) return <p className="p-8 text-danger">{error.message}</p>
  const firstOpen = lesson.questions.find((q) => q.status !== 'passed') ?? lesson.questions[0]

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      <Link to={`/m/${lesson.module.code}`} className="text-xs text-muted hover:text-accent">
        ← Modül {lesson.module.code} · {lesson.module.title}
      </Link>
      <div className="mt-3 flex items-center gap-2">
        <Badge tone={lesson.kind === 'concept' ? 'accent' : 'violet'}>
          {kindLabel[lesson.kind]}
        </Badge>
        <span className="font-mono text-xs text-subtle">{lesson.code}</span>
        <span className="flex items-center gap-1 text-xs text-subtle">
          <Clock className="size-3" /> {lesson.minutes} dk okuma
        </span>
      </div>

      <Html html={lesson.html} className="mt-6" />

      {lesson.questions.length > 0 && (
        <section className="mt-12">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sorular</h2>
            {firstOpen && (
              <Link to={`/q/${firstOpen.code}`} className={buttonVariants({ variant: 'primary' })}>
                <PlayCircle /> Sorulara başla
              </Link>
            )}
          </div>
          <QuestionList questions={lesson.questions} />
        </section>
      )}

      <nav className="mt-12 flex justify-between gap-4 border-t border-border pt-6 text-sm">
        {lesson.previous ? (
          <Link
            to={`/l/${lesson.previous.code}`}
            className="flex items-center gap-2 text-muted hover:text-fg"
          >
            <ArrowLeft className="size-4" /> {lesson.previous.title}
          </Link>
        ) : (
          <span />
        )}
        {lesson.next && (
          <Link
            to={`/l/${lesson.next.code}`}
            className="flex items-center gap-2 text-muted hover:text-fg"
          >
            {lesson.next.title} <ArrowRight className="size-4" />
          </Link>
        )}
      </nav>
    </article>
  )
}
