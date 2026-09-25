import path from 'node:path'
import ts from 'typescript'
import type { TestOutcome, TestStatus, TypeDiagnostic } from './result.ts'

// ---------- Vitest JSON raporu ----------

interface VitestAssertion {
  ancestorTitles: string[]
  fullName: string
  title: string
  status: string
  failureMessages: string[] | null
}

interface VitestFile {
  name: string
  status: string
  message: string
  assertionResults: VitestAssertion[]
}

export interface VitestReport {
  testResults: VitestFile[]
}

// eslint-disable-next-line no-control-regex
const ANSI = /\u001b\[[0-9;]*m/g

/** Hata mesajından stack satırlarını ayıklar; test dosyasındaki satırı konum olarak döner. */
export function cleanFailure(raw: string, testFile: string) {
  const text = raw.replace(ANSI, '')
  const lines = text.split('\n')
  const stackStart = lines.findIndex((l) => /^\s+at\s/.test(l))
  const messageLines = (stackStart === -1 ? lines : lines.slice(0, stackStart)).slice(0, 60)
  const base = path.basename(testFile)
  const frame = lines.find((l) => l.includes(testFile) || l.includes(`/${base}:`))
  const lineMatch = frame ? new RegExp(`${base.replace(/\./g, '\\.')}:(\\d+)`).exec(frame) : null
  return {
    message: messageLines.join('\n').trim(),
    location: lineMatch ? `${base}:${lineMatch[1]}` : undefined,
  }
}

function mapStatus(status: string): TestStatus {
  if (status === 'passed') return 'passed'
  if (status === 'failed') return 'failed'
  return 'skipped' // pending, todo, skipped, disabled
}

export function parseVitestReport(report: VitestReport) {
  const tests: TestOutcome[] = []
  const suiteErrors: string[] = []
  for (const file of report.testResults) {
    if (file.status === 'failed' && file.message && file.assertionResults.length === 0) {
      suiteErrors.push(`${path.basename(file.name)}: ${file.message.replace(ANSI, '')}`)
    }
    for (const a of file.assertionResults) {
      const status = mapStatus(a.status)
      const outcome: TestOutcome = { name: a.title, fullName: a.fullName, status }
      if (status === 'failed') {
        const { message, location } = cleanFailure((a.failureMessages ?? []).join('\n'), file.name)
        outcome.failedBy = 'runtime'
        outcome.message = message
        if (location) outcome.location = location
      }
      tests.push(outcome)
    }
  }
  return { tests, suiteError: suiteErrors.length ? suiteErrors.join('\n\n') : undefined }
}

// ---------- tsc çıktısı ----------

export interface RawTypeDiagnostic {
  /** Mutlak ya da cwd'ye göre yol, tsc'nin yazdığı gibi */
  file: string
  line: number
  column: number
  code: string
  message: string
}

const TSC_LINE = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/

export function parseTscOutput(output: string): { diagnostics: RawTypeDiagnostic[]; global: string[] } {
  const diagnostics: RawTypeDiagnostic[] = []
  const global: string[] = []
  for (const line of output.replace(ANSI, '').split('\n')) {
    const match = TSC_LINE.exec(line)
    if (match) {
      const [, file, l, c, code, message] = match
      diagnostics.push({ file: file!, line: Number(l), column: Number(c), code: code!, message: message! })
    } else if (/^\s{2,}\S/.test(line) && diagnostics.length > 0) {
      diagnostics[diagnostics.length - 1]!.message += `\n${line.trimEnd()}`
    } else if (/error TS\d+/.test(line)) {
      global.push(line.trim())
    }
  }
  return { diagnostics, global }
}

// ---------- test gövdelerinin satır aralıkları ----------

export interface TestRange {
  name: string
  fullName: string
  startLine: number
  endLine: number
}

function calleeBase(expression: ts.Expression): string | undefined {
  if (ts.isIdentifier(expression)) return expression.text
  if (ts.isPropertyAccessExpression(expression)) return calleeBase(expression.expression)
  if (ts.isCallExpression(expression)) return calleeBase(expression.expression) // it.each([...])('...')
  return undefined
}

/** `it`/`test` çağrılarının satır aralıklarını ve (describe dahil) tam adlarını bulur. */
export function findTestRanges(source: string, fileName: string): TestRange[] {
  const kind = fileName.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, kind)
  const ranges: TestRange[] = []
  const lineOf = (pos: number) => sf.getLineAndCharacterOfPosition(pos).line + 1

  const visit = (node: ts.Node, ancestors: string[]) => {
    if (ts.isCallExpression(node)) {
      const base = calleeBase(node.expression)
      const first = node.arguments[0]
      const title =
        first && (ts.isStringLiteral(first) || ts.isNoSubstitutionTemplateLiteral(first))
          ? first.text
          : undefined
      if (title !== undefined && base === 'describe') {
        for (const arg of node.arguments.slice(1)) visit(arg, [...ancestors, title])
        return
      }
      if (title !== undefined && (base === 'it' || base === 'test')) {
        ranges.push({
          name: title,
          fullName: [...ancestors, title].join(' '),
          startLine: lineOf(node.getStart(sf)),
          endLine: lineOf(node.getEnd()),
        })
        return
      }
    }
    ts.forEachChild(node, (child) => visit(child, ancestors))
  }
  visit(sf, [])
  return ranges
}

/**
 * Test dosyalarındaki tip hatalarını ait oldukları teste bağlar (`expectTypeOf` iddiaları).
 * Test dışındaki hatalar (öğrenci dosyası vb.) `remaining` olarak döner.
 */
export function applyTypeErrorsToTests(
  tests: TestOutcome[],
  diagnostics: RawTypeDiagnostic[],
  testSources: Map<string, string>,
) {
  const remaining: RawTypeDiagnostic[] = []
  const rangesByFile = new Map<string, TestRange[]>()
  for (const [file, source] of testSources) rangesByFile.set(file, findTestRanges(source, file))

  for (const d of diagnostics) {
    const ranges = rangesByFile.get(d.file)
    const range = ranges
      ?.filter((r) => d.line >= r.startLine && d.line <= r.endLine)
      .sort((a, b) => a.endLine - a.startLine - (b.endLine - b.startLine))[0]
    if (!range) {
      remaining.push(d)
      continue
    }
    const message = `Tip iddiası tutmadı: ${d.message}`
    const location = `${path.basename(d.file)}:${d.line}`
    const test = tests.find((t) => t.fullName === range.fullName)
    if (test) {
      if (test.status !== 'failed') {
        test.status = 'failed'
        test.failedBy = 'type'
        test.message = message
        test.location = location
      }
    } else {
      tests.push({ name: range.name, fullName: range.fullName, status: 'failed', failedBy: 'type', message, location })
    }
  }
  return remaining
}

export function toDiagnostic(d: RawTypeDiagnostic, relativeTo: string): TypeDiagnostic {
  const file = path.isAbsolute(d.file) ? path.relative(relativeTo, d.file) : d.file
  return { file, line: d.line, column: d.column, code: d.code, message: d.message }
}
