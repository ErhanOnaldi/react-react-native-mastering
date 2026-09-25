export function chooseFolder(users: string[]): string {
  const unique = [...new Set(users)]
  if (unique.length === 0) return 'unassigned'
  return unique.length === 1 ? `features/${unique[0]}` : 'shared'
}
