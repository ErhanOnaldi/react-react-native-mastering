import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Code2,
  FolderOpen,
  Lightbulb,
  LoaderCircle,
  Play,
  Terminal,
} from 'lucide-react'
import { useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { Link } from 'react-router'
import type { ProjectQuestionDto } from '@rm/server/dto'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { Html } from '@/components/ui/html'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { updateQuestion, useMarkDone, useRunQuestion, withProgress } from './api'
import { HintsPanel } from './hints-panel'
import { ResultPanel } from './result-panel'
import { ReviewPromptButton } from './review-prompt-button'

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 py-1.5 pr-1.5 pl-3 font-mono text-sm">
      <Terminal className="size-4 text-subtle" />
      <code className="flex-1">{command}</code>
      <Button
        size="sm"
        variant="ghost"
        aria-label="Komutu kopyala"
        onClick={() => {
          void navigator.clipboard.writeText(command)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
      >
        {copied ? <Check /> : <ClipboardCopy />}
      </Button>
    </div>
  )
}

export function ProjectView({ question }: { question: ProjectQuestionDto }) {
  const queryClient = useQueryClient()
  const run = useRunQuestion(question.code)
  const markDone = useMarkDone(question.code)
  const result = run.data?.result ?? (run.isIdle ? question.lastResult : undefined)
  const passed = run.data?.progress.status === 'passed' || question.progress.status === 'passed'

  const handleRun = async () => {
    const response = await run.mutateAsync().catch(() => undefined)
    if (response) {
      updateQuestion(queryClient, question.code, (q) => withProgress(q, response.progress))
    }
  }

  return (
    <Group orientation="horizontal" className="h-full">
      <Panel defaultSize="50" minSize="25">
        <Tabs defaultValue="prompt" className="flex h-full flex-col bg-surface">
          <TabsList>
            <TabsTrigger value="prompt">
              <BookOpen /> Görev
            </TabsTrigger>
            <TabsTrigger value="hints">
              <Lightbulb /> İpuçları
              {question.hintCount > 0 && <span className="text-subtle">{question.hintCount}</span>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="prompt" className="overflow-y-auto">
            <div className="p-5">
              <Html html={question.promptHtml} />
            </div>
          </TabsContent>
          <TabsContent value="hints" className="overflow-y-auto">
            <HintsPanel
              code={question.code}
              total={question.hintCount}
              used={question.progress.hintsUsed}
            />
          </TabsContent>
        </Tabs>
      </Panel>
      <Separator className="w-1.5 bg-border/40 transition-colors hover:bg-accent/60" />
      <Panel minSize="30">
        <div className="flex h-full flex-col overflow-y-auto bg-surface">
          <div className="space-y-5 p-5">
            {passed && (
              <div className="flex items-center gap-3 rounded-xl border border-success/40 bg-success-soft p-3 text-sm">
                <CheckCircle2 className="size-4 text-success" />
                <span className="flex-1">Görev tamamlandı. Git'te bir commit atmayı unutma!</span>
                {question.next && (
                  <Link
                    to={`/q/${question.next.code}`}
                    className={buttonVariants({ variant: 'success', size: 'sm' })}
                  >
                    Sonraki <ArrowRight />
                  </Link>
                )}
              </div>
            )}

            <section className="rounded-xl border border-border bg-surface-2 p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Code2 className="size-4 text-accent" /> Bu görev VS Code'da yapılır
              </h2>
              <p className="mt-1 text-sm text-muted">
                Proje klasörü:{' '}
                <code className="font-mono text-xs">projects/{question.project}</code>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`vscode://file/${question.projectDir}`}
                  className={buttonVariants({ size: 'sm' })}
                >
                  <FolderOpen /> Projeyi VS Code'da aç
                </a>
                {question.focusFiles.map((f) => (
                  <a
                    key={f.path}
                    href={`vscode://file/${f.absolutePath}`}
                    className={buttonVariants({ size: 'sm', variant: 'ghost' })}
                  >
                    <Code2 /> {f.path}
                  </a>
                ))}
              </div>
            </section>

            {question.hasTests ? (
              <section className="space-y-3">
                <p className="text-sm text-muted">
                  Terminalden (dosya değiştikçe otomatik: <code>--watch</code>) ya da buradan
                  çalıştırabilirsin:
                </p>
                <CopyCommand command={question.command} />
                <Button variant="primary" onClick={() => void handleRun()} disabled={run.isPending}>
                  {run.isPending ? <LoaderCircle className="animate-spin" /> : <Play />} Testleri
                  çalıştır
                </Button>
                <div className="min-h-40 rounded-xl border border-border">
                  <ResultPanel
                    result={result}
                    running={run.isPending}
                    emptyHint="Görevi VS Code'da yaptıktan sonra testleri çalıştır."
                  />
                </div>
                {run.error && <p className="text-sm text-danger">{run.error.message}</p>}
              </section>
            ) : (
              <section className="rounded-xl border border-border p-4">
                <h2 className="text-sm font-semibold">Bu görevin otomatik testi yok</h2>
                <p className="mt-1 text-sm text-muted">
                  Çalışmanı bir AI aracına inceletip değerlendirme listesine göre geri bildirim al.
                  Önerileri uyguladıktan sonra görevi tamamlandı olarak işaretle.
                </p>
              </section>
            )}

            {question.hasRubric && (
              <section className="space-y-3 rounded-xl border border-border p-4">
                <h2 className="text-sm font-semibold">Kod kalitesi incelemesi</h2>
                <ReviewPromptButton
                  code={question.code}
                  variant={question.hasTests ? 'secondary' : 'primary'}
                />
                {!question.hasTests && (
                  <Button
                    variant={passed ? 'success' : 'secondary'}
                    disabled={markDone.isPending}
                    onClick={() => markDone.mutate(!passed)}
                  >
                    <CheckCircle2 /> {passed ? 'Tamamlandı (geri al)' : 'Tamamladım'}
                  </Button>
                )}
              </section>
            )}
          </div>
        </div>
      </Panel>
    </Group>
  )
}
