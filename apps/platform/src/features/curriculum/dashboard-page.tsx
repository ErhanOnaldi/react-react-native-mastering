import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, ArrowRight, KeyRound, PlayCircle } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button-variants'
import { PageLoader } from '@/components/ui/spinner'
import { ProgressBar } from '@/components/ui/status'
import { curriculumQueries } from './api'
import { firstOpenQuestion, moduleTally, overallTally, PHASES } from './progress'

export function DashboardPage() {
  const { data, isPending, error } = useQuery(curriculumQueries.tree())
  if (isPending) return <PageLoader />
  if (error) return <p className="p-8 text-danger">{error.message}</p>

  const tally = overallTally(data)
  const next = firstOpenQuestion(data)
  const resume = data.lastVisited ?? (next ? { code: next.code, title: next.title } : undefined)
  const phases = [...new Set(data.modules.map((m) => m.phase))]

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm text-muted">Sektör standardında React yolculuğu</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {tally.passed === 0 ? 'Hoş geldin! Başlayalım 👋' : 'Tekrar hoş geldin 👋'}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <ProgressBar value={tally.ratio} className="h-2 w-64" />
          <span className="text-sm text-muted">
            {tally.passed}/{tally.total} soru · %{Math.round(tally.ratio * 100)}
          </span>
        </div>
        {resume && (
          <Link
            to={`/q/${resume.code}`}
            className={buttonVariants({ variant: 'primary', size: 'lg', className: 'mt-6' })}
          >
            <PlayCircle />
            {data.lastVisited ? 'Kaldığın yerden devam et' : 'Başla'}
            <span className="font-normal opacity-80">
              · {resume.code} {resume.title}
            </span>
          </Link>
        )}
      </section>

      {!data.env.tmdbToken && (
        <div className="mt-4 flex gap-3 rounded-xl border border-warning/40 bg-warning-soft p-4 text-sm">
          <KeyRound className="mt-0.5 size-4 shrink-0 text-warning" />
          <p>
            <strong>TMDB token'ı bulunamadı.</strong> Egzersizler ve önizleme sahte veriyle çalışır;
            ama Sinema projesi (7. modülden itibaren) gerçek API'yi kullanır. Kök dizindeki{' '}
            <code>.env</code> dosyasına <code>VITE_TMDB_TOKEN=…</code> satırını ekle.
          </p>
        </div>
      )}

      {data.errors.length > 0 && (
        <details className="mt-4 rounded-xl border border-danger/40 bg-danger-soft p-4 text-sm">
          <summary className="flex cursor-pointer items-center gap-2 font-medium text-danger">
            <AlertTriangle className="size-4" /> İçerikte {data.errors.length} hata var
          </summary>
          <ul className="mt-3 space-y-2 font-mono text-xs">
            {data.errors.map((e, i) => (
              <li key={i}>
                <span className="text-muted">{e.file}</span>
                <pre className="whitespace-pre-wrap">{e.message}</pre>
              </li>
            ))}
          </ul>
        </details>
      )}

      {phases.map((phase) => (
        <section key={phase} className="mt-10">
          <h2 className="text-xs font-semibold tracking-wider text-subtle uppercase">
            Faz {phase} · {PHASES[phase]}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {data.modules
              .filter((m) => m.phase === phase)
              .map((module) => {
                const t = moduleTally(module)
                return (
                  <Link
                    key={module.id}
                    to={`/m/${module.code}`}
                    className="group flex flex-col rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid size-7 place-items-center rounded-lg bg-surface-3 font-mono text-xs text-muted">
                        {module.number}
                      </span>
                      <h3 className="flex-1 font-semibold">{module.title}</h3>
                      {module.optional && <Badge tone="violet">Opsiyonel</Badge>}
                      <ArrowRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{module.summary}</p>
                    <div className="mt-auto flex items-center gap-3 pt-4">
                      <ProgressBar value={t.ratio} className="flex-1" />
                      <span className="font-mono text-[11px] text-subtle">
                        {t.passed}/{t.total}
                      </span>
                    </div>
                  </Link>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}
