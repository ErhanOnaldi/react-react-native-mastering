import { AlertTriangle, CheckCircle2, CircleSlash, Clock, Sparkles, XCircle } from 'lucide-react'
import type { RunResult } from '@rm/server/dto'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/cn'

export function ResultPanel({
  result,
  running,
  emptyHint,
}: {
  result?: RunResult
  running: boolean
  emptyHint: string
}) {
  if (running) {
    return (
      <div
        role="status"
        className="flex h-full items-center justify-center gap-2 text-sm text-muted"
      >
        <Spinner /> Testler çalışıyor…
      </div>
    )
  }
  if (!result) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">
        {emptyHint}
      </div>
    )
  }

  const tone =
    result.status === 'passed'
      ? 'text-success'
      : result.status === 'failed'
        ? 'text-danger'
        : 'text-warning'
  const Icon =
    result.status === 'passed'
      ? Sparkles
      : result.status === 'timeout'
        ? Clock
        : result.status === 'error'
          ? AlertTriangle
          : XCircle

  return (
    <div className="h-full overflow-y-auto px-4 py-3" aria-live="polite">
      <div className={cn('flex items-center gap-2 font-semibold', tone)}>
        <Icon className="size-4" />
        {result.summary}
        <span className="ml-auto text-xs font-normal text-subtle">
          {(result.durationMs / 1000).toFixed(1)} sn
        </span>
      </div>

      {result.tests.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {result.tests.map((test) => (
            <li key={test.fullName} className="rounded-lg border border-border bg-surface-2">
              <div className="flex items-start gap-2 px-3 py-2 text-sm">
                {test.status === 'passed' ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                ) : test.status === 'skipped' ? (
                  <CircleSlash className="mt-0.5 size-4 shrink-0 text-subtle" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />
                )}
                <span className={cn(test.status === 'skipped' && 'text-subtle')}>
                  {test.fullName}
                </span>
                {test.failedBy === 'type' && (
                  <span className="ml-auto shrink-0 rounded bg-warning-soft px-1.5 text-[10px] text-warning">
                    tip testi
                  </span>
                )}
              </div>
              {test.status === 'failed' && test.message && (
                <div className="border-t border-border px-3 py-2">
                  <pre className="max-h-64 overflow-auto font-mono text-xs leading-relaxed whitespace-pre-wrap text-danger/90">
                    {test.message}
                  </pre>
                  {test.location && (
                    <p className="mt-1 font-mono text-[11px] text-subtle">→ {test.location}</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {result.mutants && result.mutants.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">
            Hatalı versiyonlar
          </h3>
          <ul className="mt-2 space-y-1">
            {result.mutants.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                {m.caught ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : (
                  <XCircle className="size-4 text-danger" />
                )}
                <span>{m.label}</span>
                <span className={cn('ml-auto text-xs', m.caught ? 'text-success' : 'text-danger')}>
                  {m.caught ? 'yakalandı' : 'kaçtı'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.typeErrors.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold tracking-wide text-warning uppercase">
            Tip hataları
          </h3>
          <ul className="mt-2 space-y-1.5">
            {result.typeErrors.map((e, i) => (
              <li key={i} className="rounded-lg border border-warning/30 bg-warning-soft px-3 py-2">
                <p className="font-mono text-[11px] text-muted">
                  {e.file}:{e.line}:{e.column} · {e.code}
                </p>
                <pre className="mt-1 font-mono text-xs whitespace-pre-wrap">{e.message}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.output && (
        <pre className="mt-4 max-h-72 overflow-auto rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs whitespace-pre-wrap text-muted">
          {result.output}
        </pre>
      )}
    </div>
  )
}
