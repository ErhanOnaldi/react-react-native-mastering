export function ciSteps(): string[] {
  return [
    'pnpm install --frozen-lockfile',
    'pnpm lint',
    'pnpm typecheck',
    'pnpm test',
    'npx playwright install --with-deps chromium',
    'npx playwright test',
  ]
}
