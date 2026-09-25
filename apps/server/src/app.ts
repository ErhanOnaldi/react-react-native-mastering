import path from 'node:path'
import {
  allLessons,
  allQuestions,
  findLesson,
  findModule,
  findQuestion,
  nextQuestion,
  previousQuestion,
  type Curriculum,
  type LessonEntry,
  type ModuleEntry,
  type QuestionEntry,
} from '@rm/content'
import {
  buildReviewPrompt,
  collectReviewFiles,
  emptyQuestionProgress,
  ensureWorkspace,
  listEditorFiles,
  loadLastResult,
  markDone,
  readProgress,
  readSolutionFiles,
  recordAttempt,
  recordHint,
  recordSolutionView,
  recordVisit,
  resetWorkspace,
  REVIEW_PROMPT_WARN_CHARS,
  runQuestion,
  saveLastResult,
  workspaceDir,
  writeWorkspaceFile,
  type Progress,
  type RepoPaths,
} from '@rm/runner'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { streamSSE } from 'hono/streaming'
import { z } from 'zod'
import type {
  AnswerResultDto,
  CurriculumDto,
  HintsDto,
  LessonDto,
  LessonSummaryDto,
  ModuleDto,
  ModuleSummaryDto,
  NavRef,
  QuestionDto,
  ReviewPromptDto,
  RunResponseDto,
  SolutionDto,
} from './dto.ts'
import type { EventHub, WriteTracker } from './events.ts'
import type { CurriculumStore } from './store.ts'
import { readFile } from 'node:fs/promises'
import { collectEditorTypes, type EditorLib } from './editor-types.ts'

export interface AppContext {
  paths: RepoPaths
  store: CurriculumStore
  hub: EventHub
  tracker: WriteTracker
  /** .env içinde TMDB token'ı var mı (değeri asla dışarı verilmez) */
  hasTmdbToken: () => boolean
}

const statusOf = (progress: Progress, id: string) => progress.questions[id]?.status ?? 'not-started'

function lessonSummary(lesson: LessonEntry, progress: Progress): LessonSummaryDto {
  return {
    id: lesson.id,
    code: lesson.code,
    title: lesson.frontmatter.title,
    minutes: lesson.frontmatter.minutes,
    kind: lesson.frontmatter.kind,
    questions: lesson.questions.map((q) => ({
      id: q.id,
      code: q.code,
      title: q.meta.title,
      type: q.type,
      difficulty: q.meta.difficulty,
      status: statusOf(progress, q.id),
    })),
  }
}

function moduleSummary(module: ModuleEntry, progress: Progress): ModuleSummaryDto {
  return {
    id: module.id,
    code: module.code,
    number: module.number,
    title: module.meta.title,
    phase: module.meta.phase,
    summary: module.meta.summary,
    optional: module.meta.optional,
    lessons: module.lessons.map((l) => lessonSummary(l, progress)),
  }
}

const navRef = (
  entry: { code: string; meta?: { title: string }; frontmatter?: { title: string } } | undefined,
): NavRef | undefined =>
  entry
    ? { code: entry.code, title: entry.meta?.title ?? entry.frontmatter?.title ?? '' }
    : undefined

function requireQuestion(curriculum: Curriculum, code: string): QuestionEntry {
  const question = findQuestion(curriculum, code)
  if (!question) throw new HTTPException(404, { message: `Soru bulunamadı: ${code}` })
  return question
}

async function json<T extends z.ZodType>(request: Request, schema: T): Promise<z.infer<T>> {
  const parsed = schema.safeParse(await request.json().catch(() => undefined))
  if (!parsed.success) throw new HTTPException(400, { message: z.prettifyError(parsed.error) })
  return parsed.data
}

const LOCAL_HOSTS = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/

export function createApp(ctx: AppContext) {
  const { paths, store, hub, tracker } = ctx
  const app = new Hono().basePath('/api')

  // DNS rebinding koruması: yalnızca yerel host başlıklarına izin ver.
  app.use(async (c, next) => {
    const host = c.req.header('host') ?? ''
    if (!LOCAL_HOSTS.test(host)) return c.json({ error: 'Yalnızca yerel erişim' }, 403)
    await next()
  })

  // CSRF koruması: başka bir sitenin (form, img, fetch) API'yi tetiklemesini engelle.
  // 1) Tarayıcı Origin gönderiyorsa yerel olmalı. 2) /events, /health ve /editor-types dışındaki
  //    her istek özel `x-rm-client` başlığı taşımalı; çapraz siteden bu başlık CORS izni olmadan
  //    gönderilemez (sunucu CORS izni vermez).
  app.use(async (c, next) => {
    const origin = c.req.header('origin')
    if (origin) {
      let originHost = ''
      try {
        originHost = new URL(origin).host
      } catch {
        // geçersiz origin
      }
      if (!LOCAL_HOSTS.test(originHost)) return c.json({ error: 'İzin verilmeyen kaynak' }, 403)
    }
    const open = ['/api/events', '/api/health', '/api/editor-types'].includes(c.req.path)
    if (!open && c.req.header('x-rm-client') !== '1') {
      return c.json({ error: 'Eksik istemci başlığı' }, 403)
    }
    await next()
  })

  app.onError((error, c) => {
    if (error instanceof HTTPException) return c.json({ error: error.message }, error.status)
    console.error(error)
    return c.json({ error: error.message }, 500)
  })

  app.get('/health', (c) => c.json({ ok: true }))

  app.get('/curriculum', async (c) => {
    const [curriculum, progress] = await Promise.all([
      store.get(),
      readProgress(paths.progressFile),
    ])
    const last = progress.lastVisited ? findQuestion(curriculum, progress.lastVisited) : undefined
    const body: CurriculumDto = {
      modules: curriculum.modules.map((m) => moduleSummary(m, progress)),
      lastVisited: last ? { code: last.code, title: last.meta.title } : undefined,
      errors: curriculum.errors.map((e) => ({
        file: path.relative(paths.repoRoot, e.file),
        message: e.message,
      })),
      env: { tmdbToken: ctx.hasTmdbToken() },
    }
    return c.json(body)
  })

  app.get('/progress', async (c) => c.json(await readProgress(paths.progressFile)))

  app.get('/modules/:code', async (c) => {
    const [curriculum, progress] = await Promise.all([
      store.get(),
      readProgress(paths.progressFile),
    ])
    const module = findModule(curriculum, c.req.param('code'))
    if (!module) throw new HTTPException(404, { message: 'Modül bulunamadı' })
    const body: ModuleDto = {
      ...moduleSummary(module, progress),
      painHtml: await store.html(module.meta.pain),
      outcomes: module.meta.outcomes,
    }
    return c.json(body)
  })

  app.get('/lessons/:code', async (c) => {
    const [curriculum, progress] = await Promise.all([
      store.get(),
      readProgress(paths.progressFile),
    ])
    const lesson = findLesson(curriculum, c.req.param('code'))
    if (!lesson) throw new HTTPException(404, { message: 'Ders bulunamadı' })
    const lessons = allLessons(curriculum)
    const index = lessons.indexOf(lesson)
    const module = findModule(curriculum, lesson.moduleId)!
    const body: LessonDto = {
      ...lessonSummary(lesson, progress),
      html: await store.fileHtml(lesson.markdownPath),
      module: { code: module.code, title: module.meta.title },
      previous: navRef(lessons[index - 1]),
      next: navRef(lessons[index + 1]),
    }
    return c.json(body)
  })

  app.get('/questions/:code', async (c) => {
    const curriculum = await store.get()
    const question = requireQuestion(curriculum, c.req.param('code'))
    const progress = await recordVisit(paths.progressFile, question.id)
    const lesson = findLesson(curriculum, question.lessonId)!
    const module = findModule(curriculum, question.moduleId)!
    const meta = question.meta
    const base = {
      id: question.id,
      code: question.code,
      title: meta.title,
      difficulty: meta.difficulty,
      concepts: meta.concepts.map((id) => ({ id, title: curriculum.concepts[id]?.title ?? id })),
      module: { code: module.code, title: module.meta.title },
      lesson: { code: lesson.code, title: lesson.frontmatter.title },
      previous: navRef(previousQuestion(curriculum, question.id)),
      next: navRef(nextQuestion(curriculum, question.id)),
      progress: progress.questions[question.id] ?? emptyQuestionProgress(),
      hintCount: meta.type === 'quiz' ? 0 : meta.hints.length,
    }
    const promptHtml = question.promptPath ? await store.fileHtml(question.promptPath) : ''
    let body: QuestionDto
    if (meta.type === 'quiz') {
      body = {
        ...base,
        type: 'quiz',
        questionHtml: await store.html(meta.question),
        mode: meta.mode,
        options: await Promise.all(
          meta.options.map(async (o, index) => ({ index, html: await store.html(o.text) })),
        ),
      }
    } else if (meta.type === 'code') {
      const files = await listEditorFiles(paths, question)
      for (const f of files)
        if (f.editable)
          tracker.remember(path.join(workspaceDir(paths, question), f.name), f.content)
      body = {
        ...base,
        type: 'code',
        promptHtml,
        files,
        workspacePath: question.id,
        preview: meta.preview ? { entry: meta.preview.entry } : undefined,
        hasRubric: Boolean(meta.rubric),
        mutants: meta.testWriting?.mutants,
        hasSolutionNotes: Boolean(question.solutionNotesPath),
        lastResult: (await loadLastResult(paths, question.id))?.result,
      }
    } else {
      const projectDir = path.join(paths.projectsRoot, meta.project)
      body = {
        ...base,
        type: 'project',
        promptHtml,
        project: meta.project,
        projectDir,
        focusFiles: meta.focusFiles.map((f) => ({
          path: f,
          absolutePath: path.join(projectDir, f),
        })),
        hasTests: question.testFiles.length > 0,
        hasRubric: Boolean(meta.rubric),
        command: `pnpm check ${question.code}`,
        lastResult: (await loadLastResult(paths, question.id))?.result,
      }
    }
    return c.json(body)
  })

  // Önizleme iframe'i yalnızca bir soru kodu bilir; yüklenecek modülün yolunu sunucu belirler.
  app.get('/questions/:code/preview', async (c) => {
    const question = requireQuestion(await store.get(), c.req.param('code'))
    if (question.meta.type !== 'code' || !question.meta.preview) {
      throw new HTTPException(404, { message: 'Bu soruda önizleme yok' })
    }
    await ensureWorkspace(paths, question)
    return c.json({
      modulePath: `/@fs${path.join(workspaceDir(paths, question), question.meta.preview.entry)}`,
    })
  })

  app.post('/questions/:code/answer', async (c) => {
    const question = requireQuestion(await store.get(), c.req.param('code'))
    if (question.meta.type !== 'quiz')
      throw new HTTPException(400, { message: 'Quiz sorusu değil' })
    const { selected } = await json(
      c.req.raw,
      z.object({ selected: z.array(z.number().int().min(0)).min(1) }),
    )
    const meta = question.meta
    const chosen = new Set(selected)
    const correct = meta.options.every((o, i) => o.correct === chosen.has(i))
    const progress = await recordAttempt(paths.progressFile, question.id, correct)
    const body: AnswerResultDto = {
      correct,
      options: await Promise.all(
        meta.options.map(async (o, index) => ({
          index,
          correct: o.correct,
          selected: chosen.has(index),
          explanationHtml: await store.html(o.explanation),
        })),
      ),
      explanationHtml: meta.explanation ? await store.html(meta.explanation) : undefined,
      progress: progress.questions[question.id]!,
    }
    return c.json(body)
  })

  app.put('/questions/:code/files', async (c) => {
    const question = requireQuestion(await store.get(), c.req.param('code'))
    const { name, content } = await json(
      c.req.raw,
      z.object({ name: z.string().min(1), content: z.string() }),
    )
    tracker.remember(path.join(workspaceDir(paths, question), name), content)
    try {
      await writeWorkspaceFile(paths, question, name, content)
    } catch (error) {
      throw new HTTPException(400, { message: (error as Error).message })
    }
    return c.json({ ok: true })
  })

  app.post('/questions/:code/run', async (c) => {
    const curriculum = await store.get()
    const question = requireQuestion(curriculum, c.req.param('code'))
    if (question.type === 'quiz') throw new HTTPException(400, { message: 'Quiz çalıştırılamaz' })
    if (question.type === 'project' && question.testFiles.length === 0) {
      throw new HTTPException(400, {
        message: 'Bu görevin testi yok; değerlendirme listesiyle tamamlanır.',
      })
    }
    const result = await runQuestion(paths, question)
    await saveLastResult(paths, question.id, result)
    const progress = await recordAttempt(
      paths.progressFile,
      question.id,
      result.status === 'passed',
    )
    const body: RunResponseDto = {
      result,
      progress: progress.questions[question.id]!,
      next: result.status === 'passed' ? navRef(nextQuestion(curriculum, question.id)) : undefined,
    }
    return c.json(body)
  })

  app.post('/questions/:code/reset', async (c) => {
    const question = requireQuestion(await store.get(), c.req.param('code'))
    if (question.type !== 'code')
      throw new HTTPException(400, { message: 'Yalnızca kod görevleri sıfırlanabilir' })
    await resetWorkspace(paths, question)
    const files = await listEditorFiles(paths, question)
    for (const f of files)
      if (f.editable) tracker.remember(path.join(workspaceDir(paths, question), f.name), f.content)
    return c.json({ files })
  })

  app.get('/questions/:code/hints', async (c) => {
    const question = requireQuestion(await store.get(), c.req.param('code'))
    const hints = question.meta.type === 'quiz' ? [] : question.meta.hints
    const count = Math.min(hints.length, Math.max(0, Number(c.req.query('count') ?? 0)))
    if (count > 0) await recordHint(paths.progressFile, question.id, count)
    const body: HintsDto = {
      hints: await Promise.all(hints.slice(0, count).map((h) => store.html(h))),
      total: hints.length,
    }
    return c.json(body)
  })

  app.get('/questions/:code/solution', async (c) => {
    const question = requireQuestion(await store.get(), c.req.param('code'))
    if (question.type !== 'code')
      throw new HTTPException(400, { message: 'Çözüm yalnızca kod görevlerinde var' })
    await recordSolutionView(paths.progressFile, question.id)
    const body: SolutionDto = {
      files: await readSolutionFiles(question),
      notesHtml: question.solutionNotesPath
        ? await store.fileHtml(question.solutionNotesPath)
        : undefined,
    }
    return c.json(body)
  })

  app.get('/questions/:code/review-prompt', async (c) => {
    const question = requireQuestion(await store.get(), c.req.param('code'))
    if (question.type === 'quiz') throw new HTTPException(400, { message: 'Quiz için review yok' })
    const task = question.promptPath ? await readFile(question.promptPath, 'utf8') : ''
    const prompt = buildReviewPrompt({
      question,
      task,
      files: await collectReviewFiles(paths, question),
      lastResult: (await loadLastResult(paths, question.id))?.result,
    })
    const body: ReviewPromptDto = {
      prompt,
      chars: prompt.length,
      warn: prompt.length > REVIEW_PROMPT_WARN_CHARS,
    }
    return c.json(body)
  })

  app.post('/questions/:code/done', async (c) => {
    const question = requireQuestion(await store.get(), c.req.param('code'))
    if (question.type !== 'project' || question.testFiles.length > 0) {
      throw new HTTPException(400, { message: 'Yalnızca testsiz proje görevleri elle tamamlanır' })
    }
    const { done } = await json(c.req.raw, z.object({ done: z.boolean() }))
    const progress = await markDone(paths.progressFile, question.id, done)
    return c.json({ progress: progress.questions[question.id] })
  })

  app.get('/events', (c) =>
    streamSSE(c, async (stream) => {
      const unsubscribe = hub.subscribe((event) => {
        void stream.writeSSE({ event: event.type, data: JSON.stringify(event) })
      })
      stream.onAbort(() => {
        unsubscribe()
      })
      // Bağlantıyı açık tut (15 sn'de bir yorum satırı)
      while (!stream.aborted) {
        await stream.write(': ping\n\n')
        await stream.sleep(15_000)
      }
    }),
  )

  // Monaco editörünün tip tanımları (bir kez hesaplanır, tarayıcı da önbelleğe alır)
  let editorTypes: Promise<EditorLib[]> | undefined
  app.get('/editor-types', async (c) => {
    editorTypes ??= (async () => {
      const testUtils = await readFile(path.join(paths.testEnvDir, 'editor.d.ts'), 'utf8')
      return collectEditorTypes(paths.repoRoot, [
        { path: 'file:///test-env/index.d.ts', content: testUtils },
        // import.meta.env (vite/client'ın öğrenci kodu için gereken kısmı)
        {
          path: 'file:///globals.d.ts',
          content:
            'interface ImportMetaEnv { readonly [key: string]: string | undefined; readonly VITE_TMDB_TOKEN: string }\n' +
            'interface ImportMeta { readonly env: ImportMetaEnv }\n',
        },
        // Testlerdeki jest-dom eşleştiricileri (toBeInTheDocument vb.)
        {
          path: 'file:///setup.d.ts',
          content: "import '@testing-library/jest-dom/vitest'\nexport {}\n",
        },
      ])
    })()
    c.header('Cache-Control', 'max-age=3600')
    return c.json(await editorTypes)
  })

  // Tüm soruların listesi (CLI ve hızlı arama için)
  app.get('/questions', async (c) => {
    const curriculum = await store.get()
    return c.json(
      allQuestions(curriculum).map((q) => ({
        id: q.id,
        code: q.code,
        title: q.meta.title,
        type: q.type,
      })),
    )
  })

  return app
}
