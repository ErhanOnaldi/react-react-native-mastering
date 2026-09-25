export const TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
] as const

export type CommitType = (typeof TYPES)[number]

export interface ParsedCommit {
  type: CommitType
  scope: string | undefined
  breaking: boolean
  subject: string
}

const HEADER = /^(\w+)(?:\(([^)]+)\))?(!)?: (.+)$/

function isCommitType(value: string): value is CommitType {
  return (TYPES as readonly string[]).includes(value)
}

export function parseCommit(message: string): ParsedCommit | null {
  const header = message.split('\n')[0] ?? ''
  const match = HEADER.exec(header)
  if (!match) return null

  const [, type = '', scope, bang, rawSubject = ''] = match
  const subject = rawSubject.trim()
  if (!isCommitType(type) || subject === '') return null

  return { type, scope, breaking: bang === '!', subject }
}
