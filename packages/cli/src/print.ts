import type { QuestionEntry } from '@rm/content'
import type { RunResult } from '@rm/runner'
import pc from 'picocolors'

const indent = (text: string, spaces: number) =>
  text
    .split('\n')
    .map((l) => ' '.repeat(spaces) + l)
    .join('\n')

export function printHeader(question: QuestionEntry) {
  const type = { quiz: 'quiz', code: 'kod', project: 'proje' }[question.type]
  console.log(`\n${pc.bold(pc.cyan(`▶ ${question.code}`))} ${pc.bold(question.meta.title)} ${pc.dim(`(${type})`)}`)
}

export function printResult(result: RunResult) {
  for (const test of result.tests) {
    if (test.status === 'passed') console.log(`  ${pc.green('✓')} ${test.fullName}`)
    else if (test.status === 'skipped') console.log(`  ${pc.dim('○')} ${pc.dim(test.fullName)}`)
    else {
      console.log(`  ${pc.red('✗')} ${test.fullName}`)
      if (test.message) console.log(pc.dim(indent(test.message.split('\n').slice(0, 12).join('\n'), 6)))
      if (test.location) console.log(pc.dim(`      → ${test.location}`))
    }
  }
  for (const error of result.typeErrors) {
    console.log(
      `  ${pc.yellow('⚠ Tip hatası')} ${error.file}:${error.line}:${error.column} ${pc.dim(error.code)}`,
    )
    console.log(pc.dim(indent(error.message, 6)))
  }
  for (const mutant of result.mutants ?? []) {
    console.log(
      `  ${mutant.caught ? pc.green('✓ yakalandı') : pc.red('✗ kaçtı    ')} ${mutant.label}`,
    )
  }
  if (result.output) console.log(pc.dim(indent(result.output.split('\n').slice(0, 30).join('\n'), 2)))
  const color = result.status === 'passed' ? pc.green : result.status === 'failed' ? pc.red : pc.yellow
  console.log(`  ${pc.dim('─'.repeat(40))}`)
  console.log(`  ${color(pc.bold(result.summary))} ${pc.dim(`(${(result.durationMs / 1000).toFixed(1)} sn)`)}\n`)
}
