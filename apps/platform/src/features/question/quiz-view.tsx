import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import type { QuizQuestionDto } from '@rm/server/dto'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { Html } from '@/components/ui/html'
import { cn } from '@/lib/cn'
import { useAnswerQuiz } from './api'

export function QuizView({ question }: { question: QuizQuestionDto }) {
  const [selected, setSelected] = useState<number[]>([])
  const answer = useAnswerQuiz(question.code)
  const result = answer.data
  const multiple = question.mode === 'multiple'

  const toggle = (index: number) => {
    if (result) return
    setSelected((prev) =>
      multiple
        ? prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
        : [index],
    )
  }

  const retry = () => {
    answer.reset()
    setSelected([])
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Html html={question.questionHtml} />
        <p className="mt-4 text-xs text-muted">
          {multiple ? 'Birden fazla doğru cevap olabilir.' : 'Tek bir doğru cevap var.'}
        </p>

        <fieldset className="mt-4 space-y-2.5">
          <legend className="sr-only">Seçenekler</legend>
          {question.options.map((option) => {
            const outcome = result?.options[option.index]
            const isSelected = selected.includes(option.index)
            return (
              <div
                key={option.index}
                className={cn(
                  'rounded-xl border bg-surface transition-colors',
                  !outcome &&
                    (isSelected
                      ? 'border-accent bg-accent-soft'
                      : 'border-border hover:border-border-strong'),
                  outcome?.correct && 'border-success/50 bg-success-soft',
                  outcome &&
                    !outcome.correct &&
                    outcome.selected &&
                    'border-danger/50 bg-danger-soft',
                  outcome && !outcome.correct && !outcome.selected && 'border-border opacity-70',
                )}
              >
                <label className={cn('flex gap-3 px-4 py-3', !result && 'cursor-pointer')}>
                  <input
                    type={multiple ? 'checkbox' : 'radio'}
                    name="quiz"
                    className="mt-1 accent-(--accent)"
                    checked={isSelected}
                    disabled={Boolean(result)}
                    onChange={() => toggle(option.index)}
                  />
                  <Html html={option.html} className="prose-sm min-w-0 flex-1 [&>p]:m-0" />
                  {outcome?.correct && <CheckCircle2 className="size-5 shrink-0 text-success" />}
                  {outcome && !outcome.correct && outcome.selected && (
                    <XCircle className="size-5 shrink-0 text-danger" />
                  )}
                </label>
                {outcome && (outcome.selected || outcome.correct) && (
                  <Html
                    html={outcome.explanationHtml}
                    className="prose-sm border-t border-border/60 px-4 py-2.5 text-muted"
                  />
                )}
              </div>
            )
          })}
        </fieldset>

        {result ? (
          <div className="mt-6 space-y-4">
            <div
              className={cn(
                'rounded-xl border p-4 text-sm font-medium',
                result.correct
                  ? 'border-success/40 bg-success-soft text-success'
                  : 'border-danger/40 bg-danger-soft text-danger',
              )}
            >
              {result.correct ? '🎉 Doğru!' : 'Tam olarak değil — açıklamaları oku ve tekrar dene.'}
            </div>
            {result.explanationHtml && <Html html={result.explanationHtml} className="prose-sm" />}
            <div className="flex gap-2">
              {!result.correct && (
                <Button onClick={retry}>
                  <RotateCcw /> Tekrar dene
                </Button>
              )}
              {question.next && (
                <Link
                  to={`/q/${question.next.code}`}
                  className={buttonVariants({ variant: result.correct ? 'primary' : 'ghost' })}
                >
                  Sonraki soru <ArrowRight />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            className="mt-6"
            disabled={selected.length === 0 || answer.isPending}
            onClick={() => answer.mutate(selected)}
          >
            Cevapla
          </Button>
        )}
        {answer.error && <p className="mt-3 text-sm text-danger">{answer.error.message}</p>}
      </div>
    </div>
  )
}
