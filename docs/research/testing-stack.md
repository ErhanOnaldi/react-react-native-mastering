# Testing Stack Research Digest — Vitest 5 / Vite 8 / jsdom 30 / MSW 2.15 / RTL 16 / Playwright 1.63

Researched 2026-09-25 against official docs, changelogs, and GitHub releases. Versions targeted: vitest 5.0.2, jsdom 30.1.1, happy-dom 20.14.5, msw 2.15.0, @testing-library/react 16.3.3, @testing-library/user-event 14.6.7, @testing-library/jest-dom 7.0.1, @playwright/test 1.63.0, Vite 8.3.1 (Rolldown/Oxc).

Every claim below is sourced. Anything I could not confirm from a primary source is explicitly flagged **UNVERIFIED**.

---

## 1. Vitest 4 → 5: breaking changes, config, JSON reporter, Node API

### 1.1 Version requirements

- Vitest 5 requires **Node.js ≥ 22.12.0** and **Vite ≥ 6.4.0**. Vite is now a *peer* dependency only — Yarn users must install `vite` explicitly or resolution fails.
  Source: [Migration Guide](https://vitest.dev/guide/migration/), [Vitest 5.0 blog](https://vitest.dev/blog/vitest-5.html)

### 1.2 Config keys renamed/removed (v3 → v4/v5)

| v3 | v4/v5 | Notes |
|---|---|---|
| `test.workspace` (workspace file or key) | `test.projects` | `workspace` deprecated since 3.2, **removed** in v4. Functionally equivalent; renamed partly because `workspace` clashed with pnpm's own concept. |
| `test.poolOptions.threads`/`.forks`/`.vmThreads` sub-keys | pool options moved to **top level** of `test` config | `poolOptions` object is gone in v4. |
| `maxThreads` / `maxForks` | `maxWorkers` | consolidated into one option. |
| `singleThread` / `singleFork` | `maxWorkers: 1` + `isolate: false` | both flags removed. |
| `test.sequential`, `describe.sequential`, `sequential` | `concurrent: false` | deprecated options removed in v5. |
| `browser: 'playwright'` (string) | `browser: { provider: ... }` (object) + separate installed package | must install `@vitest/browser-playwright`, `@vitest/browser-webdriverio`, or `@vitest/browser-preview`. |
| `@vitest/browser/context` | `vitest/browser` | import path changed. |
| `environmentMatchGlobs`, `poolMatchGlobs` | removed | replaced by per-project config. |
| `basic` reporter | removed | use `['default', { summary: false }]`. |
| `benchmark.reporters`, `benchmark.outputFile`, `benchmark.compare`, `bench.skip/.only/.todo` | removed | benchmarking rewritten (see below). |
| `vitest/coverage`, `vitest/reporters`, `vitest/environments`, `vitest/snapshot`, `vitest/runners`, `vitest/suite`, `vitest/mocker` entrypoints | removed | deprecated deep-import entrypoints deleted. |
| `browser.api` | top-level `api` option | deprecated. |
| HTML reporter `outputFile` | `outputDir` | renamed. |

Sources: [Migration Guide](https://vitest.dev/guide/migration/), [Vitest 4.0 blog](https://vitest.dev/blog/vitest-4), [Vitest 5.0 blog](https://vitest.dev/blog/vitest-5.html)

### 1.3 Other important behavior changes

- **`clearMocks` now defaults to `true`** (was `false`). Vitest calls `vi.clearAllMocks()` before every test — mock *call history* resets between tests automatically, but implementations are preserved. If you assert mock calls set up in `beforeAll`/setup files across tests, this will now show 0 calls unless you set `clearMocks: false`.
  Source: [Migration Guide](https://vitest.dev/guide/migration/)
- **`-t`/`testNamePattern` matching changed**: full test name is now the suite chain joined by `' > '` (was space-joined). E.g. `'math adds'` → `'math > adds'`.
- **Inline `test.projects` now inherit root config by default** (`extends: true` is now the default; previously you had to opt in). Set `extends: false` to isolate a project. Inline projects that don't touch Vite config **share the Vite dev server** now (`sharedViteServer`, on by default) — a real perf win but means projects are less isolated unless you configure differently.
- **`vi.mock`, `vi.unmock`, `vi.hoisted` are hoisted** — calling them conditionally/inside functions now **throws** in v5 (only warned in v4).
- Unawaited `expect(...).resolves`/`.rejects` now **fail the test** instead of silently continuing.
- `expect.poll()` now rejects on timeout and accepts an `AbortSignal`.
- Worker/pool identifiers (`VITEST_POOL_ID`, `VITEST_WORKER_ID`) now start at **1** instead of **0**.
- Fake timers (via `@sinonjs/fake-timers` v15.4) now also mock the `Temporal` API alongside `Date`.
- Report/artifact output centralized under a single **`.vitest/`** directory (attachments, JSON, JUnit, HTML, screenshots, traces all nest under it).
- Benchmarking (`bench`) is **no longer a module-level import** — it's now a test-context fixture used from inside a regular `test()`.

Sources: [Migration Guide](https://vitest.dev/guide/migration/), [Vitest 5.0 blog](https://vitest.dev/blog/vitest-5.html), [Vitest 4.0 blog](https://vitest.dev/blog/vitest-4)

### 1.4 `defineConfig` / current usage

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: false,
  },
})
```
Source: [vitest.dev/config/](https://vitest.dev/config/)

### 1.5 `test.projects` — inline project configs

Confirmed: each project **can** have its own `name`, `environment`, `include`, `plugins`, and **`resolve.alias`**. Only `coverage`, `reporters`, and `resolveSnapshotPath` are root-only ("Unsupported Options" per the docs — everything else is per-project).

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'happy-dom',
          environment: 'happy-dom',
          include: ['tests/**/*.browser.test.{ts,js}'],
        },
      },
      {
        extends: false,
        test: {
          name: { label: 'node', color: 'green' },
          environment: 'node',
          include: ['tests/**/*.node.test.{ts,js}'],
        },
      },
    ],
  },
})
```
Note the new object form for `name` (`{ label, color }`) alongside plain strings.
Source: [Test Projects guide](https://vitest.dev/guide/projects)

### 1.6 `test.setupFiles`, `test.environment`, `test.env`

- `setupFiles: string | string[]` — resolved relative to `root`; run before **each test file**, in the same worker process (not main thread); exports from these files are ignored. Order controlled via `sequence.setupFiles`.
  Source: [config/setupfiles](https://vitest.dev/config/setupfiles)
- `environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' | string`, default `'node'`. Per-file override via docblock: `/** @vitest-environment jsdom */`.
  Source: [config/environment](https://vitest.dev/config/environment)
- `env: Partial<NodeJS.ProcessEnv>` — available on `process.env` and `import.meta.env` **inside test files only** (not visible in `globalSetup`). Setting `TZ` here does **not** affect `threads`/`vmThreads` pool workers.
  Source: [config/env](https://vitest.dev/config/env)

### 1.7 `vi.stubEnv`

```ts
import { vi } from 'vitest'

vi.stubEnv('NODE_ENV', 'production')
process.env.NODE_ENV === 'production'
import.meta.env.NODE_ENV === 'production'

vi.unstubAllEnvs() // restores value from before first stubEnv call
```
Signature: `vi.stubEnv<T extends string>(name: T, value: T extends 'PROD'|'DEV'|'SSR' ? boolean : string | undefined): Vitest`.
Source: [vitest.dev/api/vi](https://vitest.dev/api/vi.html)

### 1.8 Fake timers

Vitest uses `@sinonjs/fake-timers`; in v5 this was bumped to v15.4, adding **Temporal API** mocking alongside `Date`/timer mocking. Standard `vi.useFakeTimers()` / `vi.useRealTimers()` / `vi.advanceTimersByTime()` API is unchanged from v3.
Sources: [Vitest 5.0 blog](https://vitest.dev/blog/vitest-5.html), [Timers guide](https://vitest.dev/guide/mocking/timers)

### 1.9 `expectTypeOf`

```ts
import { assertType, expectTypeOf } from 'vitest'
import { mount } from './mount.js'

test('my types work properly', () => {
  expectTypeOf(mount).toBeFunction()
  expectTypeOf(mount).parameter(0).toExtend<{ name: string }>()
  // @ts-expect-error name is a string
  assertType(mount({ name: 42 }))
})
```
Type-test files use `*.test-d.ts` by default; run with `vitest --typecheck`. `Assertion`/`Matchers` types now expose **two** type params (return type `R`, received `T`) in v5 — custom matcher typings written for v3 may need updating.
Source: [Testing Types guide](https://vitest.dev/guide/testing-types)

### 1.10 JSON reporter — exact usage and shape

CLI:
```bash
npx vitest run --reporter=json --outputFile=./test-output.json
```
Or in config: `reporters: ['json'], outputFile: './test-output.json'`. Default location if unspecified changed to **`.vitest/json/output.json`** (reporters write to a file by default now instead of stdout, to avoid interleaving with stray `console.log`/`process.stdout.write` output).

Shape (Jest-`--json`-compatible):
```jsonc
{
  "numTotalTestSuites": 1,
  "numPassedTestSuites": 1,
  "numFailedTestSuites": 0,
  "numPendingTestSuites": 0,
  "numTotalTests": 2,
  "numPassedTests": 2,
  "numFailedTests": 0,
  "numPendingTests": 0,
  "numTodoTests": 0,
  "startTime": 1234567890,
  "success": true,
  "testResults": [
    {
      "name": "/abs/path/to/file.test.ts",   // absolute file path
      "status": "passed",
      "startTime": 0,
      "endTime": 0,
      "message": "",
      "assertionResults": [
        {
          "title": "adds 1 + 2",
          "fullName": "math > adds 1 + 2",
          "ancestorTitles": ["math"],
          "status": "passed",
          "duration": 3,
          "failureMessages": [],
          "location": { "line": 10, "column": 3 },
          "meta": {}
        }
      ]
    }
  ]
}
```
- Confirmed fields per test: `status`, `title`, `fullName`, `ancestorTitles`, `failureMessages`, `location` (`{line, column}`), `duration`, plus `meta` (filterable via `filterMeta`).
- **Project name**: not a flat field per test in the standard JSON reporter schema I could confirm from docs; project display names appear in `displayName`-style fields in project-aware contexts (e.g. console/other reporters). **UNVERIFIED**: I could not find an official doc snippet showing a `projectName` key literally inside `assertionResults`; if you need it reliably, consider the Node API (`vitest.state.getFiles()`/`TestModule.project.name`) or a custom reporter instead of parsing the JSON reporter blindly.
- `coverageMap` is included in the JSON output when coverage is enabled (since Vitest 3).

Sources: [Reporters guide](https://vitest.dev/guide/reporters), [outputFile config](https://vitest.dev/config/outputfile), [reporters config](https://vitest.dev/config/reporters)

### 1.11 Test files outside `root`, and CLI filter path behavior

- `include` defaults to `['**/*.{test,spec}.?(c|m)[jt]s?(x)']`, resolved **relative to `root`** via `tinyglobby`. The docs state patterns "are resolved relative to root" but do not explicitly confirm/deny `../` traversal or absolute-path globs in `include`. **UNVERIFIED** whether `include: ['../shared-tests/**/*.test.ts']` is officially supported — treat with caution and test locally; `tinyglobby` generally supports `../` and absolute patterns, but this isn't spelled out for Vitest's own resolution logic in the docs I could reach.
  Source: [config/include](https://vitest.dev/config/include)
- **CLI filename filters DO support absolute paths**, and require the *full* filename (no partial match):
  ```
  vitest basic/foo.js:10     # ✅ relative
  vitest ./basic/foo.js:10   # ✅ relative
  vitest /users/project/basic/foo.js:10  # ✅ absolute
  vitest foo:10               # ❌ incomplete filename
  vitest basic/foo.test.ts:10, basic/foo.test.ts:25  # ✅ multiple line filters
  vitest basic/foo.test.ts:10-25  # ❌ ranges not supported
  ```
  `-t`/`--testNamePattern` filters by full test name (regex). `-p`/`--project <name>` supports wildcards (`--project=packages*`) and negation (`--project=!pattern`). `--root <path>` sets root; `--dir <path>` sets the directory scanned for tests.
  Source: [vitest.dev/guide/cli](https://vitest.dev/guide/cli)

### 1.12 Node API: `startVitest` / `createVitest` (from `vitest/node`)

Both are exported from `'vitest/node'`.

- `createVitest('test', options)` — creates a Vitest instance **without** running tests and **without** validating installed packages; useful for programmatic setup before triggering runs yourself.
  ```ts
  import { createVitest } from 'vitest/node'
  const vitest = await createVitest('test', { watch: false })
  ```
- `startVitest(cliFilters, testConfigOverrides, viteConfigOverrides, vitestOptions)` — validates packages are installed and **runs tests immediately**, returning the same `Vitest` instance type.
  ```ts
  import { startVitest } from 'vitest/node'
  const vitest = await startVitest(
    [],  // CLI filters
    {},  // test config overrides
    {},  // Vite config overrides
    {},  // Vitest options
  )
  ```
  **Caveat**: I could not fetch the literal current TypeScript signature (full parameter/return types) from `vitest.dev/advanced/api/vitest.html` — the page didn't render the exact type block in this session. The shapes above are corroborated by multiple secondary sources and match the historical v2/v3 API shape, but treat exact parameter typing as **UNVERIFIED** — confirm against `node_modules/vitest/dist/node.d.ts` in your actual install before building tooling on it.
  Sources: [Advanced API](https://vitest.dev/advanced/api/vitest.html), [Running Tests advanced guide](https://vitest.dev/guide/advanced/tests)

---

## 2. JSX/TSX transform in Vitest 5 + Vite 8 (Oxc)

**You do NOT need `@vitejs/plugin-react` just to make JSX/TSX parse and transform in Vitest tests.** Vite 8 handles `.jsx`/`.tsx` **out of the box** via the **Oxc Transformer**, replacing esbuild's role for dev-time JSX/TS stripping:

> ".jsx and .tsx files are also supported out of the box. JSX transpilation is also handled via [Oxc Transformer]."

Config key is **`oxc`**, not `esbuild.jsx`:
```ts
export default defineConfig({
  oxc: {
    jsx: {
      // e.g. for Preact:
      importSource: 'preact',
    },
  },
})
```
Source: [Vite Features — JSX](https://vite.dev/guide/features.html)

For plain React with the automatic runtime, Vite/Oxc's default JSX handling already targets the automatic runtime for `.jsx`/`.tsx` (no need to write `import React from 'react'` in every file) — this is Vite's long-standing default behavior carried into the Oxc pipeline. A secondary source (not vitejs official) described enabling this explicitly as `oxc: { jsx: { runtime: 'automatic' } }`; I could **not** verify that exact config key from an official Vite/Vitest doc page in this session — flag as **UNVERIFIED**, but it is consistent with the `oxc.jsx` config shape confirmed above, so it's a reasonable fallback if you need to force it.

**What `@vitejs/plugin-react` still adds** (per npm and community sources) is **Fast Refresh/HMR** and Babel-plugin support (e.g. for React Compiler) — none of which matter for a one-shot `vitest run`. Since Vite 8, `@vitejs/plugin-react` itself **also switched to Oxc-based Fast Refresh by default**, and Babel is "no longer a mandatory dependency." `@vitejs/plugin-react-oxc` is now **deprecated** in favor of plain `@vitejs/plugin-react`.
Sources: [DEV Community — Vite 8 Complete Guide](https://dev.to/stacknotice/vite-8-complete-guide-rolldown-oxc-and-10x-faster-builds-2026-48lh), [npm @vitejs/plugin-react-oxc](https://www.npmjs.com/package/@vitejs/plugin-react-oxc)

**Practical recommendation**: for a Vitest-only config that just needs to run tests against JSX/TSX (no HMR), you can likely skip `@vitejs/plugin-react` entirely and rely on Vite 8's built-in Oxc JSX transform. If your *app* build already uses `@vitejs/plugin-react` (recommended for the dev server/HMR), it's simplest and safest to keep using the **same `vite.config.ts`** for Vitest (`test` key merged into your app's Vite config) so JSX behavior is guaranteed identical between app and tests — this also has been the long-standing official recommendation pattern from Vitest's own example configs, which typically **do** include `@vitejs/plugin-react` because they share the app's Vite config rather than because Vitest strictly requires it for JSX parsing itself.

---

## 3. jsdom 30 issues (fetch/AbortSignal, MSW) and jest-dom 7

### 3.1 `AbortSignal` + `fetch` "Expected signal to be an instance of AbortSignal"

- **Root cause**: Node 24 ships **undici v7**, whose native `fetch()` does strict `instanceof AbortSignal` checks. jsdom's `jsdom` test environment in Vitest **replaces** the global `AbortController`/`AbortSignal` with its own polyfill implementation, so Node's native fetch rejects jsdom's `AbortSignal` object as not a "real" `AbortSignal`. This breaks any code (including MSW, Redux Toolkit Query, etc.) that creates an `AbortController` and passes `.signal` into `fetch()` under Node 24 + jsdom.
  Sources: [vitest-dev/vitest#8374](https://github.com/vitest-dev/vitest/issues/8374), [mswjs/msw discussion #2530](https://github.com/mswjs/msw/discussions/2530), [reduxjs/redux-toolkit#4966](https://github.com/reduxjs/redux-toolkit/issues/4966)
- **Fix status**: Resolved via [vitest-dev/vitest#8390](https://github.com/vitest-dev/vitest/pull/8390), which stops jsdom from overriding Node's native `fetch`, `Request`, `Response`, `Headers`, `AbortController`, `AbortSignal`, `URL`, `URLSearchParams` globals — Node's own implementations are kept. **This landed in Vitest 4** (merged Aug 2025). Given your stack is on **Vitest 5.0.2**, this fix is already included — you should **not** hit this error with jsdom on current Vitest as long as you're not pinned to Vitest 3.x.
- **If you're ever stuck on Vitest 3.x**: the only documented workaround found is a `pnpm patch` manually reapplying the same override-removal to jsdom's environment setup in `vitest@3.2.4` — there's no clean userland config flag for it. **Recommendation: just be on Vitest ≥4** (you are, at 5.0.2), and this class of bug should not recur.
- **jsdom vs happy-dom**: I found **no current official Vitest doc statement recommending happy-dom over jsdom by default** in 2026 — `environment` docs list jsdom and happy-dom as parallel options with no default preference beyond "if you're building a web app, use jsdom or happy-dom instead of node." Community sources (blogs, not vitest.dev) suggest a **pragmatic hybrid**: happy-dom for most component tests (faster, ~2-4x), with per-file `/** @vitest-environment jsdom */` overrides for tests needing deeper web-platform fidelity (this pattern is explicitly supported via the per-file docblock). Both jsdom and happy-dom have had **historical** MSW-interception bugs (e.g. `TypeError: Failed to parse URL from [object Request]` with happy-dom, `response.body.getReader is not a function` with jsdom in old Vitest 1.0.2) — these were mostly tied to specific old Vitest/MSW version combinations, not necessarily current jsdom 30 / MSW 2.15. **UNVERIFIED for the exact current (jsdom 30.1.1 + MSW 2.15 + Vitest 5.0.2) combination** — I found no open GitHub issue describing a *live, unresolved* interception bug at these exact versions; treat jsdom 30 + MSW 2.15 + Vitest 5 as **currently compatible** based on absence of open bug reports, but verify empirically in your project since these three projects release independently.
  Sources: [vitest-dev/vitest#2305](https://github.com/vitest-dev/vitest/issues/2305), [mswjs/msw#2191](https://github.com/mswjs/msw/issues/2191), [capricorn86/happy-dom#476](https://github.com/capricorn86/happy-dom/issues/476)

### 3.2 jsdom 30.0.0 breaking change

- jsdom 30 raises its **Node.js minimum to `^22.22.2 || ^24.15.0 || >=26.0.0`**. Make sure your CI/Node version satisfies this (it's stricter than Vitest 5's own `>=22.12.0` floor).
  Source: [jsdom GitHub releases](https://github.com/jsdom/jsdom/releases)

### 3.3 `@testing-library/jest-dom` 7 — what changed from v6, Vitest import

- **v7.0.0 breaking changes**: `@testing-library/dom` moved from optional to **required peer dependency**; minimum supported **Node.js is now 22**. New matchers `toContainAnyBy*`/`toContainOneBy*` were added.
- **v7.0.1** (bugfix): declares `vitest` as an **optional** peer dependency (fixes install friction for Vitest users).
  Source: [jest-dom releases](https://github.com/testing-library/jest-dom/releases) (fetched via cache; verify against https://github.com/testing-library/jest-dom/releases directly if precise dates matter — dates shown were Jul/Aug 2026, **UNVERIFIED** to the day)
- **Correct Vitest import**: use the dedicated subpath export, which auto-extends Vitest's `expect` with all jest-dom matchers — no manual `expect.extend()` needed:
  ```ts
  // vitest.setup.ts
  import '@testing-library/jest-dom/vitest'
  ```
  ```ts
  // vitest.config.ts
  export default defineConfig({
    test: { setupFiles: ['./vitest.setup.ts'] },
  })
  ```
  The older pattern (`import * as matchers from '@testing-library/jest-dom/matchers'; expect.extend(matchers)`) still works but is the **generic/Jest-interop path**; `@testing-library/jest-dom/vitest` is the Vitest-specific, zero-boilerplate entry point.
  Source: multiple corroborating community setup guides; the `/vitest` subpath itself is a long-standing exported entry in the package (confirmed present in current npm package structure via search, **UNVERIFIED** against the raw `package.json#exports` map directly in this session).

---

## 4. MSW 2.15

### 4.1 Core usage (Node/tests)

```ts
// mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/user', () => {
    return HttpResponse.json({ id: '15d42a4d', firstName: 'John' })
  }),
]
```
```ts
// mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```
```ts
// vitest.setup.ts
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```
Source: [mswjs.io setupServer](https://mswjs.io/docs/api/setup-server)

### 4.2 `onUnhandledRequest`

Three built-in strategies (docs' exact wording):
- `'warn'` (default) — "Print a warning but perform the request as-is."
- `'error'` — "Print an error and halt request execution."
- `'bypass'` — "Does not print anything and perform the request as-is."

Custom callback (note `request.url` is a **string**, not a `URL`, so you must `new URL(request.url)`):
```ts
server.listen({
  onUnhandledRequest(request, print) {
    const url = new URL(request.url)
    if (url.pathname.includes('/assets/')) return // ignore static assets
    print.warning()
  },
})
```
A custom callback **opts out of MSW's default static-asset filtering** — use the exported `isCommonAssetRequest()` helper to restore it if needed.
Source: [mswjs.io onUnhandledRequest](https://mswjs.io/docs/api/setup-server/on-unhandled-request)

### 4.3 `server.use` (per-test overrides)

Standard pattern (unchanged from MSW 1→2 conceptually): call `server.use(...)` inside a test to add/override handlers for that test only; `afterEach(() => server.resetHandlers())` clears them back to the defaults.

### 4.4 `server.events.on('request:start', ...)` for counting requests

```ts
const server = setupServer(...handlers)
let requestCount = 0

server.events.on('request:start', ({ request, requestId }) => {
  requestCount++
})
```
Note the **single destructured object** argument `{ request, requestId }` — this is a MSW 2.x breaking change from MSW 1.x, which passed `(request, requestId)` as two positional args.
Source: [mswjs.io life-cycle-events](https://mswjs.io/docs/api/life-cycle-events)

### 4.5 Breaking changes since MSW 2.0 (confirmed)

MSW 2.0 was the big rewrite from MSW 1.x — full list in the [1.x→2.x migration guide](https://mswjs.io/docs/migrations/1.x-to-2.x/):
- `setupWorker` now imported from **`msw/browser`** (not `msw`).
- `rest` → **`http`** namespace; resolver signature changed from `(req, res, ctx)` to a single `{ request, params, cookies }` object.
- `req.url` (a `URL` instance) → `request.url` (a **string**) — must `new URL(request.url)` yourself.
- Response building: `res(ctx.json(...))` composition → return `HttpResponse.json(...)` (or a native `Response`) directly.
- `req.passthrough()` → standalone `passthrough()` export.
- `res.once(...)` → third `{ once: true }` options arg to `http.get(...)`.
- `res.networkError(...)` → `HttpResponse.error()`.
- `ctx.fetch(req)` → `fetch(bypass(request))` using the new `bypass()` helper.
- `worker.printHandlers()` → `worker.listHandlers()`.
- Life-cycle event callbacks: positional args → single destructured object (see 4.4).
- Node.js minimum raised to **18.0.0**; TypeScript minimum **4.7**.

**Additional breaking change found within the 2.x line** (not just 2.0): **MSW 2.13** changed `setupServer()`'s return type from the exported `SetupServerApi` type to a renamed **`SetupServer`** type, with some other "trivial but breaking" API surface changes — flagged by a user as a semver violation in [mswjs/msw#2717](https://github.com/mswjs/msw/issues/2717) (no maintainer resolution/response visible in what I could fetch). If you import the `SetupServerApi` type name anywhere in your own TypeScript code, check this when pinning versions around 2.13+.
Source: [mswjs/msw#2717](https://github.com/mswjs/msw/issues/2717)

I found **no evidence of an MSW 3.0 release or beta** as of today; latest on npm is confirmed at **2.15.0**, consistent with your stated "current npm latest." (There is a PR titled `feat!: v3.0.0` open/in-progress upstream, but nothing published — **UNVERIFIED**/speculative, do not plan around it yet.)
Source: [mswjs/msw#2692](https://github.com/mswjs/msw/pull/2692)

### 4.6 Browser worker setup for Vite (`mockServiceWorker.js`)

```bash
npx msw init public --save
```
This copies `mockServiceWorker.js` into your Vite app's `public/` directory (the `--save` flag records the chosen path in your `package.json` `msw.workerDirectory` field so `msw init` can be re-run consistently, e.g. in a `postinstall` script). Verify it's served at `http://localhost:5173/mockServiceWorker.js` in dev.

```ts
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```
```ts
// entry point, before rendering
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') return
  const { worker } = await import('./mocks/browser')
  return worker.start()
}
enableMocking().then(() => { /* render app */ })
```
Always `await worker.start()` before rendering to avoid a race between service-worker registration and your app's first requests.
Sources: [mswjs.io browser integration](https://mswjs.io/docs/integrations/browser), [mswjs.io setupWorker](https://mswjs.io/docs/api/setup-worker)

---

## 5. React Testing Library 16 + user-event 14.6 (React 19)

### 5.1 Automatic cleanup

**`cleanup()` is only automatic if `globals: true`** in your Vitest config (RTL's auto-cleanup hooks into the global `afterEach` that Jest/Jasmine/Mocha inject automatically; Vitest only injects globals when `test.globals: true`). With `globals: false` (which the user's question specifies), you **must** call `cleanup()` yourself in a setup file:

```ts
// vitest.setup.ts
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```
```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```
Source: [testing-library.com/docs/react-testing-library/setup](https://testing-library.com/docs/react-testing-library/setup/)

### 5.2 React Testing Library 16.x changelog highlights

- **16.0.0**: `@testing-library/dom` and `@types/react-dom` moved to **peer dependencies** (install them explicitly).
- **16.1.0**: **React 19 support added.**
- **16.2.0**: support for React error handlers (`onCaughtError`, etc. in `render` options).
- **16.3.2**: fixed TypeScript inference for `onCaughtError` in `RenderOptions` for React 19 compat.
- **16.3.3**: bugfix for `act()` re-entrance issues when dispatching events.
  Source: [react-testing-library releases](https://github.com/testing-library/react-testing-library/releases)

### 5.3 user-event 14.6.x

- **14.6.0/14.6.1**: keyboard improvements (`ContextMenu` in default key map, bracket-key support, radio-group arrow-key navigation fix), pointer event `button`/`buttons` property corrections, clipboard `DataTransferItem.getAsString()` await fix, click-prevention fix for form-associated custom elements.
- No React-19-specific or fake-timer-specific changes found in the 14.5–14.6 changelog entries themselves. **user-event has been React-19-compatible since RTL added support (16.1.0)**, since user-event operates on real DOM events, not React internals directly — **UNVERIFIED** as an explicit statement, inferred from absence of user-event changelog entries tied to React version support.
  Source: [user-event releases](https://github.com/testing-library/user-event/releases)

### 5.4 Fake timers + user-event

If you use `vi.useFakeTimers()` together with `userEvent`, you must bridge them or interactions can hang (user-event schedules its own internal delays which never resolve if you've swapped the clock):
```ts
const user = userEvent.setup({
  advanceTimers: vi.advanceTimersByTime,
})
```
Source: [testing-library.com/docs/using-fake-timers](https://testing-library.com/docs/using-fake-timers/), corroborated by multiple `vitest-dev/vitest` issues (#3184, #2549, #6179)

---

## 6. Playwright 1.63

### 6.1 New in 1.63 itself (shipped ~Sept 4, 2026, per secondary sources — **date UNVERIFIED** against playwright.dev directly)

- **Test locks**: name a lock on a test so only one instance runs at a time across files/machines, while other tests keep running in parallel.
- **Cross-frame locators**: `page.frameLocator()` / `frame.frameLocator()` called *without* a selector now searches the whole frame subtree — no need to locate the iframe first.
- **Visible-only locators**: new `locator.visible()` method (replaces `:visible` CSS pseudo-class usage).
- **Step enhancements**: `test.step()` now accepts `subtitle` and `params` options, shown in the trace viewer/HTML report; Playwright's own built-in API steps also now report target locator + call args as structured data.
- **Aria/screen snapshots in traces**: trace viewer captures DOM + aria + screen snapshots together; new "Display Aria" mode.
- New APIs: `httpCredentials` array support, `opfs` in storage state, `page.on('dialogclosed')`, `locator.ariaSnapshotJSON()` / `page.ariaSnapshotJSON()` (JSON instead of YAML), typed API responses via generics, `--add-reporter` CLI flag (adds a reporter on top of config instead of replacing), new built-in **`perfetto` reporter** (Trace Event Format for `chrome://tracing`/Perfetto UI, per-worker timeline lanes), `omitTags` option for list/line/dot/github/junit reporters.
- **Breaking**: Ubuntu 20.04 no longer supported; the experimental component-testing packages (`@playwright/experimental-ct-react`, `-ct-react17`, `-ct-vue`) will **no longer be updated** — migrate to the "stories" model introduced in 1.62.
  Sources: [TestDino — Playwright 1.63](https://testdino.com/blog/playwright-1-63-release), [GitHub release v1.63.0](https://github.com/microsoft/playwright/releases/tag/v1.63.0) (fetch of this exact page returned 404 in-session — corroborated via secondary aggregator sites only; treat specific wording as **UNVERIFIED**, confirm against `playwright.dev/docs/release-notes` yourself)

### 6.2 Features relevant to teaching that predate 1.63 but are current/stable and worth knowing (not new in 1.63 specifically)

- **`page.ariaSnapshot()` / `locator.ariaSnapshot()`** and **`expect(locator/page).toMatchAriaSnapshot()`**: produce/assert a YAML accessibility-tree snapshot. `toMatchAriaSnapshot()` on `page` (not just `locator`) and a `boxes` option (bounding boxes, for AI/LLM consumption) were added around **1.60**.
- **Clock API** (`page.clock.install()`, etc.): introduced **~1.45**, lets you fake timers/Date inside the browser page itself:
  ```ts
  await page.clock.install({ time: new Date('2024-02-02T08:00:00') })
  await page.goto('http://localhost:3333')
  ```
  Best practice: install the clock **before** navigating, set it slightly before your intended test time so page-load timers still fire normally.
  Source: [playwright.dev/docs/api/class-clock](https://playwright.dev/docs/api/class-clock), [Microsoft Learn Clock sample](https://learn.microsoft.com/en-us/samples/microsoft/playwright-examples/clock/)
- **Test Agents (Planner / Generator / Healer)**: introduced in **Playwright 1.56**, these are VS-Code-integrated AI agents — Planner explores your live app and writes a test plan, Generator writes spec files from the plan, Healer runs alongside your test suite and repairs broken locators automatically. Output is ordinary `.spec.ts` files checked into your repo; no separate runtime/account needed. Good teaching hook for "AI-assisted test authoring" but **not new in 1.63**.
  Source: [Bug0 — Playwright Test Agents](https://bug0.com/blog/playwright-test-agents), [TestDino — Playwright Test Agents](https://testdino.com/blog/playwright-test-agents) (both secondary/blog sources — **UNVERIFIED** against an official Microsoft/Playwright first-party page in this session; corroborate on playwright.dev before teaching as gospel)
- **`--ui` (UI Mode)**: long-established (since ~1.28), not new — still the recommended way to teach debugging/watch-mode-style interactive test running.

### 6.3 Recommended config for a Vite app

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'npm run dev', // or `npm run preview` for a prod-like build
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```
`timeout` defaults to 60000ms; bump it for slower dev-server cold starts. `reuseExistingServer: !process.env.CI` reuses a server you already have running locally, but always starts fresh in CI.
Source: [playwright.dev/docs/test-webserver](https://playwright.dev/docs/test-webserver)

### 6.4 JSON reporter

```bash
PLAYWRIGHT_JSON_OUTPUT_NAME=results.json npx playwright test --reporter=json
```
or in config:
```ts
reporter: [['json', { outputFile: 'results.json' }]]
```
Env vars: `PLAYWRIGHT_JSON_OUTPUT_DIR`, `PLAYWRIGHT_JSON_OUTPUT_NAME`, `PLAYWRIGHT_JSON_OUTPUT_FILE` (full path override).
**I could not retrieve the exact JSON schema** (suite/spec/test/result field names) from the official docs page in this session — the page describes the reporter but didn't render the schema table/example for the fetch tool used. **UNVERIFIED** — for exact fields, either run it once locally and inspect the output, or consult the `Reporter`/`JSONReport` TypeScript types shipped in `@playwright/test`'s `.d.ts` files, which are the authoritative source.
Source: [playwright.dev/docs/test-reporters](https://playwright.dev/docs/test-reporters) (partial — schema table not captured)

---

## Summary of UNVERIFIED items (for follow-up if precision matters)

1. Whether the JSON reporter includes an explicit per-test **project name** field (likely not, in the standard schema).
2. Exact TypeScript signatures of `startVitest`/`createVitest` from `vitest/node` — shape confirmed, literal types not.
3. Whether `oxc: { jsx: { runtime: 'automatic' } }` is an actual documented Vitest/Vite config key (plausible given the `oxc.jsx` namespace, not confirmed on an official page).
4. Whether `test.include` globs can officially reference paths outside `root` via `../` or absolute patterns.
5. jest-dom 7.0.0/7.0.1 exact release dates.
6. The `@testing-library/jest-dom/vitest` subpath's presence, confirmed only via secondary/community sources, not a direct read of the package's `exports` map.
7. Whether jsdom 30.1.1 + MSW 2.15 + Vitest 5.0.2 have any currently-open, version-specific interception bugs (none found, but this is an absence-of-evidence check, not a changelog confirmation).
8. Playwright 1.63 exact release date and the GitHub release-notes page content (404'd directly; relied on secondary blog aggregators corroborating each other).
9. Playwright JSON reporter exact schema (suite/spec/test/result field names).
10. Playwright Test Agents (Planner/Generator/Healer) details, sourced only from third-party blogs, not playwright.dev directly.

---

## Key sources index

- Vitest: [Migration Guide](https://vitest.dev/guide/migration/) · [5.0 blog](https://vitest.dev/blog/vitest-5.html) · [4.0 blog](https://vitest.dev/blog/vitest-4) · [Projects guide](https://vitest.dev/guide/projects) · [Reporters guide](https://vitest.dev/guide/reporters) · [CLI guide](https://vitest.dev/guide/cli) · [config/*](https://vitest.dev/config/) · [api/vi](https://vitest.dev/api/vi.html) · [Testing Types](https://vitest.dev/guide/testing-types) · [vitest-dev/vitest#8374](https://github.com/vitest-dev/vitest/issues/8374) / [#8390](https://github.com/vitest-dev/vitest/pull/8390)
- Vite: [Features — JSX](https://vite.dev/guide/features.html) · [Migration from v7](https://vite.dev/guide/migration)
- jsdom: [GitHub releases](https://github.com/jsdom/jsdom/releases)
- MSW: [setupServer](https://mswjs.io/docs/api/setup-server) · [onUnhandledRequest](https://mswjs.io/docs/api/setup-server/on-unhandled-request) · [life-cycle-events](https://mswjs.io/docs/api/life-cycle-events) · [browser integration](https://mswjs.io/docs/integrations/browser) · [1.x→2.x migration](https://mswjs.io/docs/migrations/1.x-to-2.x/) · [mswjs/msw#2717](https://github.com/mswjs/msw/issues/2717)
- Testing Library: [react-testing-library setup](https://testing-library.com/docs/react-testing-library/setup/) · [using-fake-timers](https://testing-library.com/docs/using-fake-timers/) · [RTL releases](https://github.com/testing-library/react-testing-library/releases) · [user-event releases](https://github.com/testing-library/user-event/releases) · [jest-dom releases](https://github.com/testing-library/jest-dom/releases)
- Playwright: [release-notes](https://playwright.dev/docs/release-notes) · [test-webserver](https://playwright.dev/docs/test-webserver) · [test-reporters](https://playwright.dev/docs/test-reporters) · [class-clock](https://playwright.dev/docs/api/class-clock) · [TestDino 1.63 writeup](https://testdino.com/blog/playwright-1-63-release)
