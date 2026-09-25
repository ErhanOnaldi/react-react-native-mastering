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

export function parseCommit(message: string): ParsedCommit | null {
  // Buraya yaz
  return null
}
