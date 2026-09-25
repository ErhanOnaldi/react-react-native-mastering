import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  BookOpen,
  Check,
  CloudOff,
  Eye,
  FlaskConical,
  Lightbulb,
  LoaderCircle,
  MonitorPlay,
  Play,
  RotateCcw,
  ScrollText,
  Sparkles,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { Link } from 'react-router'
import type { CodeQuestionDto, ServerEvent } from '@rm/server/dto'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { ConfirmDialog } from '@/components/ui/dialog'
import { Html } from '@/components/ui/html'
import { Kbd } from '@/components/ui/kbd'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeEditor, type EditorModel } from '@/features/editor/code-editor'
import { modelUri } from '@/features/editor/model-uri'
import { PreviewPane } from '@/features/preview/preview-pane'
import { useServerEvents } from '@/lib/events'
import { updateQuestion, useResetQuestion, useRunQuestion, withProgress } from './api'
import { HintsPanel } from './hints-panel'
import { ResultPanel } from './result-panel'
import { ReviewPromptButton } from './review-prompt-button'
import { SolutionPanel } from './solution-panel'
import { useAutosave, type SaveStatus } from './use-autosave'

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'saving')
    return (
      <span className="flex items-center gap-1 text-xs text-subtle">
        <LoaderCircle className="size-3 animate-spin" /> Kaydediliyor
      </span>
    )
  if (status === 'error')
    return (
      <span className="flex items-center gap-1 text-xs text-danger">
        <CloudOff className="size-3" /> Kaydedilemedi
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-xs text-subtle">
      <Check className="size-3" /> Kaydedildi
    </span>
  )
}

function ResizeHandle({ vertical }: { vertical?: boolean }) {
  return (
    <Separator
      className={
        vertical
          ? 'h-1.5 bg-border/40 transition-colors hover:bg-accent/60 data-[separator=active]:bg-accent'
          : 'w-1.5 bg-border/40 transition-colors hover:bg-accent/60 data-[separator=active]:bg-accent'
      }
    />
  )
}

export function CodeView({ question }: { question: CodeQuestionDto }) {
  const queryClient = useQueryClient()
  const [contents, setContents] = useState(() =>
    Object.fromEntries(question.files.filter((f) => f.editable).map((f) => [f.name, f.content])),
  )
  const [activeFile, setActiveFile] = useState(question.files[0]?.name ?? '')
  const [previewVersion, setPreviewVersion] = useState(0)
  const [bottomTab, setBottomTab] = useState(question.preview ? 'preview' : 'result')
  const [confirmReset, setConfirmReset] = useState(false)

  const autosave = useAutosave(
    question.code,
    useCallback(() => setPreviewVersion((v) => v + 1), []),
  )
  const run = useRunQuestion(question.code)
  const reset = useResetQuestion(question.code)

  const result = run.data?.result ?? (run.isIdle ? question.lastResult : undefined)
  const passed = run.data?.progress.status === 'passed' || question.progress.status === 'passed'

  const root = `workspace/${question.workspacePath}`
  const readonlyRoot = `curriculum/${question.workspacePath}`
  const models: EditorModel[] = useMemo(
    () =>
      question.files.map((f) => ({
        ...f,
        content: f.editable ? (contents[f.name] ?? f.content) : f.content,
        // Test ve impl dosyaları ayrı bir kökte: öğrencinin dosyalarıyla karışmasın
        uri: modelUri(f.editable || f.kind === 'code' ? root : readonlyRoot, f.name),
      })),
    [question.files, contents, root, readonlyRoot],
  )
  const tsPaths = useMemo(
    () => ({
      '@exercise/*': [`${root}/*`],
      '@impl/*': [`${readonlyRoot}/impl/*`],
      '@test-utils': ['test-env/index.d.ts'],
    }),
    [root, readonlyRoot],
  )

  // VS Code'da yapılan değişiklikler editöre yansısın
  useServerEvents(
    useCallback(
      (event: ServerEvent) => {
        if (event.type !== 'file-changed' || event.questionId !== question.id) return
        const file = question.files.find((f) => f.name === event.file && f.editable)
        if (!file) return
        void fetch(`/api/questions/${question.code}`)
          .then((r) => r.json() as Promise<CodeQuestionDto>)
          .then((fresh) => {
            const updated = fresh.files.find((f) => f.name === event.file)
            if (updated) setContents((prev) => ({ ...prev, [updated.name]: updated.content }))
            setPreviewVersion((v) => v + 1)
          })
      },
      [question.id, question.code, question.files],
    ),
  )

  const handleRun = useCallback(async () => {
    await autosave.flush()
    setBottomTab('result')
    const response = await run.mutateAsync().catch(() => undefined)
    if (response) {
      updateQuestion(queryClient, question.code, (q) => withProgress(q, response.progress))
    }
  }, [autosave, run, queryClient, question.code])

  const handleReset = async () => {
    const { files } = await reset.mutateAsync()
    setContents(Object.fromEntries(files.filter((f) => f.editable).map((f) => [f.name, f.content])))
    run.reset()
    setPreviewVersion((v) => v + 1)
  }

  return (
    <Group orientation="horizontal" className="h-full">
      <Panel defaultSize="40" minSize="22">
        <Tabs defaultValue="prompt" className="flex h-full flex-col bg-surface">
          <TabsList>
            <TabsTrigger value="prompt">
              <BookOpen /> Açıklama
            </TabsTrigger>
            <TabsTrigger value="hints">
              <Lightbulb /> İpuçları
              {question.hintCount > 0 && <span className="text-subtle">{question.hintCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="solution">
              <Eye /> Çözüm
            </TabsTrigger>
          </TabsList>
          <TabsContent value="prompt" className="overflow-y-auto">
            <div className="p-5">
              {passed && (
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-success/40 bg-success-soft p-3 text-sm">
                  <Sparkles className="size-4 text-success" />
                  <span className="flex-1">
                    Bu görevi tamamladın. Çözüm sekmesinde referans çözümle karşılaştır.
                  </span>
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
              <Html html={question.promptHtml} />
              {question.mutants && (
                <section className="mt-6 rounded-xl border border-violet/30 bg-violet-soft p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-violet">
                    <FlaskConical className="size-4" /> Testlerinin yakalaması gereken hatalı
                    versiyonlar
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {question.mutants.map((m) => (
                      <li key={m.id}>{m.label}</li>
                    ))}
                  </ul>
                </section>
              )}
              {question.hasRubric && (
                <section className="mt-6 rounded-xl border border-border bg-surface-2 p-4">
                  <h3 className="text-sm font-semibold">Kod kalitesi incelemesi</h3>
                  <p className="mt-1 mb-3 text-sm text-muted">
                    Testler geçtikten sonra kodunu bir AI aracına (Claude, ChatGPT…) inceletip
                    sektör gözüyle geri bildirim al.
                  </p>
                  <ReviewPromptButton code={question.code} />
                </section>
              )}
              {question.concepts.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {question.concepts.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-md bg-surface-3 px-2 py-0.5 text-[11px] text-muted"
                    >
                      {c.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="hints" className="overflow-y-auto">
            <HintsPanel
              code={question.code}
              total={question.hintCount}
              used={question.progress.hintsUsed}
            />
          </TabsContent>
          <TabsContent value="solution" className="overflow-y-auto">
            <SolutionPanel key={String(passed)} code={question.code} passed={passed} />
          </TabsContent>
        </Tabs>
      </Panel>
      <ResizeHandle />
      <Panel minSize="30">
        <Group orientation="vertical" className="h-full">
          <Panel defaultSize="62" minSize="20">
            <div className="flex h-full flex-col bg-surface">
              <div className="min-h-0 flex-1">
                <CodeEditor
                  files={models}
                  activeFile={activeFile}
                  onActiveFileChange={setActiveFile}
                  onChange={(name, content) => {
                    setContents((prev) => ({ ...prev, [name]: content }))
                    autosave.schedule(name, content)
                  }}
                  onRun={() => void handleRun()}
                  paths={tsPaths}
                />
              </div>
              <div className="flex h-11 shrink-0 items-center gap-2 border-t border-border px-3">
                <SaveIndicator status={autosave.status} />
                <div className="flex-1" />
                <ConfirmDialog
                  open={confirmReset}
                  onOpenChange={setConfirmReset}
                  title="Başlangıç koduna dönülsün mü?"
                  description="Bu sorudaki tüm değişikliklerin silinir. Bu işlem geri alınamaz."
                  confirmLabel="Sıfırla"
                  onConfirm={() => void handleReset()}
                />
                <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
                  <RotateCcw /> Sıfırla
                </Button>
                <Button variant="primary" onClick={() => void handleRun()} disabled={run.isPending}>
                  {run.isPending ? <LoaderCircle className="animate-spin" /> : <Play />}
                  Çalıştır
                  <Kbd className="border-white/30 bg-white/15 text-inherit">
                    {isMac ? '⌘' : 'Ctrl'}↵
                  </Kbd>
                </Button>
              </div>
            </div>
          </Panel>
          <ResizeHandle vertical />
          <Panel minSize="12">
            <Tabs
              value={bottomTab}
              onValueChange={setBottomTab}
              className="flex h-full flex-col bg-surface"
            >
              <TabsList>
                <TabsTrigger value="result">
                  <ScrollText /> Sonuç
                </TabsTrigger>
                {question.preview && (
                  <TabsTrigger value="preview">
                    <MonitorPlay /> Önizleme
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="result">
                <ResultPanel
                  result={result}
                  running={run.isPending}
                  emptyHint="Kodunu yaz, sonra Çalıştır'a bas. Testler burada tek tek görünecek."
                />
                {run.error && <p className="px-4 text-sm text-danger">{run.error.message}</p>}
              </TabsContent>
              {question.preview && (
                <TabsContent value="preview" forceMount className="data-[state=inactive]:hidden">
                  <PreviewPane modulePath={question.preview.modulePath} version={previewVersion} />
                </TabsContent>
              )}
            </Tabs>
          </Panel>
        </Group>
      </Panel>
    </Group>
  )
}
