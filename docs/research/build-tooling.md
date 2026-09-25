# Build Tooling Research Digest — Sept 2026 snapshot

Scope: verified facts about the current ("latest" as of 2026-09-25) toolchain versions named in the brief —
TypeScript 6.0.3 / 7.0.2, Vite 8.3.1, @vitejs/plugin-react 6.1.1, ESLint 10.11.0, typescript-eslint 8.70.1,
eslint-plugin-react-hooks 7.1.1, Prettier 3.9.9, Tailwind CSS 4.3.x, monaco-editor 0.57.0, @monaco-editor/react 4.7.0.

Every claim below is sourced. Claims I could not pin to a primary source, or where secondary sources
disagreed, are marked **UNVERIFIED** with the reason. Where a fact was confirmed by directly reading
Monaco's shipped `.d.ts` (not just a summarizer's paraphrase), that's noted explicitly because it's the
highest-confidence evidence in this digest.

---

## 1. TypeScript 6.0 and 7.0

### 1.1 TypeScript 6.0 — changed defaults

TS 6.0 (final JS-based release, shipped ~March 2026) changed several project-wide defaults. If a
`tsconfig.json` doesn't set these explicitly, behavior silently changes on upgrade.

| Option | Old default | TS 6.0 default | Source |
|---|---|---|---|
| `strict` | `false` | **`true`** | [TS 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) |
| `module` | varies (`commonjs` in practice) | **`esnext`** | same |
| `target` | `es3`/`es5` historically | **floating, currently `es2025`** (tracks latest spec each release) | same |
| `types` | auto-include everything under `node_modules/@types` | **`[]`** (empty — nothing auto-included) | same |
| `rootDir` | inferred from lowest common ancestor of input files | **directory containing `tsconfig.json`** | same |

> "If you were relying on the previous default of `false`, you'll need to explicitly set `"strict": false"`.
> — [TS 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)

Practical fallout: a project that never set `types` explicitly will stop picking up ambient `@types/node`,
`@types/jest`, etc. automatically — add `"types": ["node"]` (etc.) explicitly. A project relying on inferred
`rootDir` for multi-root output layout needs to set it explicitly.

**`moduleResolution` default — partially verified.** The official announcement text I fetched confirms
`module` defaults to `esnext` and that `moduleResolution node`/`node10` is deprecated, but does not spell out
in one sentence "the default `moduleResolution` is now X." Independent corroboration (a TypeScript GitHub
issue and third-party explainers) indicates the long-standing behavior — and the point TS 6.0 formalizes — is
that `moduleResolution` is derived from `module`: when `module` is `esnext`/`es2015+`/`preserve`, the
resolution mode is **`bundler`**; the old `classic` resolution (used for ESM-family `module` values pre-6.0,
a well-known footgun) is deprecated. Treat "the new default pairing is `module: esnext` + `moduleResolution:
bundler`" as **UNVERIFIED at the level of exact wording**, but high confidence directionally.
Sources: [TS 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html),
[microsoft/TypeScript#61454](https://github.com/microsoft/TypeScript/issues/61454),
[TypeScript tsconfig moduleResolution reference](https://www.typescriptlang.org/tsconfig/moduleResolution.html).

### 1.2 Removed / deprecated in 6.0

> "`baseUrl` is deprecated and will no longer be considered a look-up root for module resolution."
> — [TS 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)

- **`baseUrl`** — deprecated. `paths` entries must now include the full relative prefix themselves (see 1.3).
- **`moduleResolution: node` / `node10`** — deprecated. Migrate to `nodenext` (Node-targeted code) or
  `bundler` (bundler/Bun-targeted code).
- **`esModuleInterop: false` / `allowSyntheticDefaultImports: false`** — deprecated; the safer interop
  behavior is now always on (no way to opt out).
- **`target: es5`** — deprecated; ES2015 is the new floor.
- **`downlevelIteration`** — deprecated (only mattered for ES5 emit).
- **`moduleResolution: classic`** — removed outright.
- **`module: amd | umd | systemjs | none`** — removed outright.
- **`outFile`** — removed.
- **`alwaysStrict: false`** — deprecated.
- Bare `module` keyword for TS namespaces is hard-deprecated in favor of `namespace`.

Deprecated-but-still-working options can be silenced for one more release with
`"ignoreDeprecations": "6.0"` in `tsconfig.json` — **but TS 7.0 does not honor `ignoreDeprecations` and will
hard-error** on any of these. Source: [TS 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html).

### 1.3 `paths` without `baseUrl`

Previously `paths` entries were resolved relative to `baseUrl`. Now the prefix must be written into each
`paths` value directly:

```jsonc
// tsconfig.json (TS 6.0+, no baseUrl)
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["./src/app/*"],
      "@lib/*": ["./src/lib/*"]
    }
  }
}
```

Source: [TS 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html).

### 1.4 `erasableSyntaxOnly`

Introduced in **TS 5.8** (not new in 6.0, but directly relevant to "current practice" since Node 23.6+/24 can
run `.ts` files directly via type-stripping, and this flag is how you guarantee your code is compatible with
that). With `erasableSyntaxOnly: true`, TS hard-errors on any construct that has runtime behavior beyond
type erasure:

```ts
// ❌ error: import alias with runtime behavior
import foo = require("foo");

// ❌ error: namespace with runtime code
namespace container { export const x = 1; }

// ❌ error: parameter properties (they desugar to assignments)
class Point {
  constructor(public x: number, public y: number) {}
}

// ❌ error: export = assignment
export = Point;

// ❌ error: enum (even const enum) — generates a runtime object
enum Direction { Up, Down, Left, Right }
```

Recommended pairing: `erasableSyntaxOnly` + `verbatimModuleSyntax` (to also stop import elision from hiding
runtime-relevant imports). Source: [TS 5.8 release notes, "The `--erasableSyntaxOnly` Option"](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html).

### 1.5 TypeScript 7.0 — status and compatibility

- **Native Go port.** Ported (not rewritten from scratch, but a faithful line-for-line port preserving
  compiler structure) to Go for native-code speed and multithreading. Reported **8–12x** full-build speedups.
  Source: [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).
- **Release timeline:** RC ~June 18, 2026; **GA July 8, 2026**. Source: same, corroborated by
  [InfoQ](https://www.infoq.com/news/2026/08/typescript-7-released/) and
  [InfoWorld](https://www.infoworld.com/article/4196378/go-based-typescript-7-0-arrives.html).
- **`tsc` CLI compatibility:** high. Per the official post: "Practically any TypeScript code that compiles
  cleanly with TypeScript 6.0 (with the `stableTypeOrdering` flag on, and without any `ignoreDeprecations`
  flag set) should compile identically in TypeScript 7.0." New hard errors appear for the flags deprecated in
  6.0 (see 1.2) — `ignoreDeprecations` no longer suppresses them. Source:
  [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).
- **No classic JS compiler API.** This is the single biggest ecosystem-breaking fact:
  > "TypeScript 7.0 does not ship with an API. We expect TypeScript 7.1 to ship with a new (and different) API."
  — [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)

  Concretely, `require('typescript')` / `import * as ts from 'typescript'` at `typescript@7.0.2` exports only
  `version` and `versionMajorMinor`. **`ts.createProgram`, `ts.createSourceFile`, `ts.sys`,
  `ts.findConfigFile`, `ts.forEachChild` — all `undefined`.** The package's `exports` map only publishes
  `./unstable/*` subpaths (`typescript/unstable/ast`, `/sync`, `/async`, `/fs`, `/proto`), and those are
  explicitly unstable/pre-release — e.g. `unstable/ast`'s `createSourceFile` is a node-factory constructor,
  not a parser, and there is no supported "parse this string" entry point yet. A stable public API is expected
  in **TypeScript 7.1** (community estimates ~October 2026 — **UNVERIFIED**, not in an official Microsoft
  post I could fetch, only in secondary blog commentary).
  Sources: [typescript-eslint issue #12518](https://github.com/typescript-eslint/typescript-eslint/issues/12518),
  [dev.to: Why Your TypeScript 7 Upgrade Broke ESLint, ts-jest, and ts-morph](https://dev.to/dev_encyclopedia/why-your-typescript-7-upgrade-broke-eslint-ts-jest-and-ts-morph-385k).

- **Ecosystem compatibility as of today:**
  - **typescript-eslint 8.70.1** — peer range is `>=4.8.4 <6.1.0` by design; does **not** support TS 7 yet
    (needs the compiler API that only lands in 7.1). Confirms the version numbers given in the brief.
    Source: [loke.dev — Run TypeScript 7 Without Breaking typescript-eslint](https://loke.dev/writing/typescript-7-typescript-eslint-side-by-side).
  - **Vitest typecheck** — Vitest's own transform pipeline uses esbuild/oxc, not the TS compiler API, so
    `vitest --typecheck` is not blocked by the API removal; it can point at either `tsc` (6 or 7) as an
    external process. **UNVERIFIED**: I could not fetch Vitest's own docs page confirming this in this
    session; this is inferred from secondary sources describing Vitest's typecheck mode as shelling out to
    `tsc` rather than importing the compiler API directly.
  - **Monaco Editor** — irrelevant to the TS6/TS7 API question because Monaco vendors its **own bundled**
    TypeScript language service (confirmed **5.9.3**, see §6) — it doesn't consume the workspace's installed
    `typescript` package at all.
  - Vue/Svelte/Astro (Volar-based), Angular template checking, ts-node, ts-morph, webpack `ts-loader`-style
    tools — all currently blocked on TS 7 until the 7.1 API ships.

- **Compatibility shim:** Microsoft publishes **`@typescript/typescript6`**, which re-exports the TS 6.0 API
  under a new binary name `tsc6`, so a project can alias `typescript` to `@typescript/typescript6` for
  API-dependent tools while running the real TS 7 `tsc` under a different alias (e.g. `typescript-7`) for raw
  type-checking/build scripts. Example from the official post:
  ```json
  {
    "devDependencies": {
      "typescript": "npm:@typescript/typescript6@^6.0.2",
      "typescript-7": "npm:typescript@^7.0.2"
    },
    "scripts": {
      "typecheck:ts6": "tsc6 --noEmit",
      "typecheck:ts7": "tsc --noEmit"
    }
  }
  ```
  Source: [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
  (fetched directly), corroborated by [microsoft/typescript-go#4368](https://github.com/microsoft/typescript-go/issues/4368).

### 1.6 What the ecosystem currently recommends

For a project like this one (Hono server + Vite SPA + a runner that shells out `tsc` and runs Vitest):

- **Use TypeScript 6.0.3 as the installed `typescript` package** for anything that needs the classic
  compiler API — typescript-eslint, and any custom tooling you write that calls `ts.createProgram`/
  `ts.transpileModule` directly (this matters for you specifically: the runner's own programmatic
  type-checking, if it uses the JS API rather than shelling out to `tsc`, must stay on 6.0.3 until 7.1).
- **`tsc` as a CLI subprocess** (spawned, not imported) can safely be TypeScript 7.0.2 today for raw speed,
  since the CLI's behavior is compatible with 6.0 output per the official compatibility statement (1.5).
- Because typescript-eslint 8.70.1's peer range hard-caps at `<6.1.0`, do **not** let `typescript` drift to
  6.1+ in a project that also runs typescript-eslint, until typescript-eslint publishes a wider range.
- Net recommendation actually forming in the ecosystem is the **inverse** of "TS6 for tooling, TS7 for
  type-checking" — it's "**TS 6.0.3 wherever the compiler API is consumed (lint, custom tooling); TS 7.0.2
  only for a pure `tsc --noEmit` subprocess call** if you want the speed and don't need the API." Given this
  project's runner already invokes `tsc` as a subprocess per the brief, TS 7.0.2 is a reasonable choice for
  that specific call site, while the repo's `typescript` devDependency driving the editor/typescript-eslint/
  IDE experience should stay on 6.0.3.

---

## 2. Vite 8

### 2.1 Headline change

Vite 8 replaces the dev-time esbuild + prod-time Rollup split with a single unified bundler, **Rolldown**
(Rust, uses **Oxc** for parsing/transforming/minifying). This was previously shipped as an opt-in preview
package `rolldown-vite`; **that package is now folded into the mainline `vite` package as of v8** — you no
longer install `rolldown-vite` separately, you just use `vite@8`. Sources:
[Vite 8.0 is out!](https://vite.dev/blog/announcing-vite8),
[npm: rolldown-vite](https://www.npmjs.com/package/rolldown-vite?activeTab=readme) ("a separate rolldown-vite
package was released as a technical preview... eventually this package is not needed anymore as all changes
will be merged into the main Vite repository").

Claimed performance: "3x faster dev server startup, 40% faster full reloads, 10x fewer network requests" and
"10–30x faster builds" in various real-world reports (Linear 46s→6s, Beehiiv -64%, Mercedes-Benz.io -38%).
Source: [Vite 8.0 is out!](https://vite.dev/blog/announcing-vite8). Install size is ~15MB larger than v7
(lightningcss ~10MB + Rolldown binary ~5MB) — same source.

### 2.2 Config key renames (breaking)

| Vite 7 / esbuild-era key | Vite 8 key | Notes |
|---|---|---|
| `esbuild` (top-level config) | **`oxc`** | Oxc replaces esbuild for JS/TS transforms |
| `transformWithEsbuild` | **`transformWithOxc`** | |
| `build.rollupOptions` | **`build.rolldownOptions`** | |
| `worker.rollupOptions` | **`worker.rolldownOptions`** | |
| `optimizeDeps.esbuildOptions` | **`optimizeDeps.rolldownOptions`** | |

A compatibility shim auto-converts old `esbuild`/`rollupOptions` config into Rolldown/Oxc equivalents for
most projects, so many configs work unmodified — but new projects/docs use the new key names.
Source: [Vite migration guide (v7→v8)](https://vite.dev/guide/migration).

Other breaking changes in the migration guide:
- `build.commonjsOptions` — now a no-op, deprecated (Rolldown handles CJS interop natively).
- `build.dynamicImportVarsOptions.warnOnError` — deprecated.
- `resolve.alias[].customResolver` — removed; use a plugin's `resolveId` hook instead.
- Passing a URL to `import.meta.hot.accept` — must pass an id string instead.
- Oxc's minifier does **not** support property mangling (`mangleProps`, `reserveProps`, `mangleQuoted`,
  `mangleCache`) — those options are gone.
- **CSS minification now defaults to Lightning CSS** instead of esbuild (can slightly change output size).
- `build()` now throws a `BundleError` wrapping individual errors in an `.errors` array (changed error
  shape for programmatic API consumers).
- Removed support: AMD/SystemJS output formats, ES5 output via `@vitejs/plugin-legacy`, and plugin hooks
  `shouldTransformCachedModule`, `resolveImportMeta`, `renderDynamicImport`, `resolveFileUrl`.
- New module-type handling: plugins that turn non-JS content into JS must now explicitly return
  `moduleType: 'js'`; Rolldown auto-detects module types instead of Vite's old "format sniffing."

Source for this list: [Vite migration guide](https://vite.dev/guide/migration).

Also new in 8 (not breaking, additive): `resolve.tsconfigPaths` (native tsconfig path-alias resolution,
no plugin needed), built-in `emitDecoratorMetadata` support, `.wasm?init` now works in SSR, `devtools` config
option for Vite Devtools, `server.forwardConsole` to pipe browser console logs to the terminal.
Source: [Vite 8.0 is out!](https://vite.dev/blog/announcing-vite8).

### 2.3 `server.fs.allow` and `/@fs/` imports — unchanged behavior in v8

```js
// vite.config.js
export default defineConfig({
  server: {
    fs: {
      allow: ['..'], // extend from project root
    },
  },
})
```

`server.fs.strict` (default **on**) restricts which files the dev server will serve outside the project root
via the `/@fs/<absolute-path>` protocol; anything not covered by `fs.allow` 403s. Vite auto-detects monorepo
workspace roots (`package.json` `workspaces`, `lerna.json`, `pnpm-workspace.yaml`) and a `searchForWorkspaceRoot`
utility is exported for custom detection. Source: [Vite server options docs](https://vite.dev/config/server-options.html).

### 2.4 Multi-page apps

```js
// vite.config.js
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        nested: resolve(import.meta.dirname, 'nested/index.html'),
      },
    },
  },
})
```

Note the key is `build.rolldownOptions.input` in Vite 8 (was `build.rollupOptions.input`). Source:
[Vite build guide, Multi-Page App](https://vite.dev/guide/build.html) (the fetched example omitted the
`build:` wrapper key in the summarized output — the `rolldownOptions.input` field itself is confirmed; nest
it under `build` per the documented top-level config shape).

### 2.5 Worker imports (`?worker`) — unchanged public API

```js
import MyWorker from './worker?worker'
const worker = new MyWorker()
```

Modifiers: `?worker&inline` (base64-embedded), `?worker&url` (URL only, no instantiation). Works in both dev
(native ESM import in the browser) and production builds. Source: [Vite features guide](https://vite.dev/guide/features.html).

### 2.6 Dev proxy — unchanged public API

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://localhost:4567', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
      '^/fallback/.*': { target: 'http://localhost:4567', rewrite: (p) => p.replace(/^\/fallback/, '') },
      '/socket': { target: 'ws://localhost:4567', ws: true },
    },
  },
})
```

Vite does **not** validate the `Origin` header on proxied WebSocket requests — the proxy target must do so
itself if that matters. Source: [Vite server options docs](https://vite.dev/config/server-options.html).

### 2.7 @vitejs/plugin-react 6 — enabling React Compiler

Two paths, both wired through `@vitejs/plugin-react@6.1.1` (peer: `vite ^8`):

**A. Native Rust path (`oxc-transform-react`, experimental, fastest)**
```bash
npm install -D oxc-transform-react
```
```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ compiler: true })],
  // or: react({ compiler: { compilationMode: 'annotation' } })
})
```
Claim: "oxc-transform-react is more than 10x faster than babel-plugin-react-compiler... files that took ~100ms
now take ~10ms" because it runs the compiler's memoization pass directly on Oxc's AST instead of round-tripping
through Babel. Vite 8+ also runs React Refresh transform via Oxc, so Babel isn't needed for Fast Refresh either.
Sources: [Oxlint blog — React Compiler Support](https://oxc.rs/blog/2026-08-18-react-compiler-support),
[@vitejs/plugin-react README (main branch)](https://raw.githubusercontent.com/vitejs/vite-plugin-react/main/packages/plugin-react/README.md).

**B. Classic Babel path (`babel-plugin-react-compiler`, stable, via the new `@rolldown/plugin-babel` bridge)**
```bash
npm install -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler
```
```js
// vite.config.js
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
})
```
Source: [@vitejs/plugin-react README (main branch)](https://raw.githubusercontent.com/vitejs/vite-plugin-react/main/packages/plugin-react/README.md).

The plugin's README explicitly labels native React Compiler support as **experimental**. Given this is a
learning platform, the Babel path (B) is the safer default to teach as "current stable practice"; mention (A)
as the emerging fast path.

---

## 3. ESLint 10 and the React + TS lint stack

### 3.1 ESLint 10 breaking changes vs 9

- **Eslintrc is completely removed.** No `.eslintrc.*`, no `.eslintignore`, no `--no-eslintrc`, `--env`,
  `--resolve-plugins-relative-to`, `--rulesdir`, `--ignore-path` CLI flags, no `ESLINT_USE_FLAT_CONFIG` env
  var. Flat config (`eslint.config.js`/`.mjs`/`.cjs`/`.ts`) is the **only** supported format.
  Source: [ESLint v10.0.0 released](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/).
- **Config file lookup changed**: ESLint now searches for `eslint.config.*` starting from **each linted
  file's directory** and walking up, rather than from the CWD — enables multiple config files per monorepo
  package naturally. Same source.
- **Node.js baseline raised:** drops Node < 20.19.0, and drops 21.x/23.x entirely; Node 24.x is the new LTS
  baseline. Same source.
- API removals: deprecated `SourceCode` methods (`getTokenOrCommentBefore`, `getTokenOrCommentAfter`,
  `isSpaceBetweenTokens`, `getJSDocComment`); deprecated `context` methods (`getCwd`, `getFilename`,
  `getPhysicalFilename`, `getSourceCode`); `LegacyESLint`/`FileEnumerator` removed from
  `/use-at-your-own-risk`. Same source.
- JSX identifiers are now tracked as references (fixes false positives/negatives in `no-unused-vars`,
  `no-undef` for JSX-heavy React code). Same source.
- Program AST node's range now spans the entire source text including leading/trailing comments/whitespace.
  Same source.
- New: `max-params` gets a TS-only `countThis` option; RuleTester gets stricter assertion options
  (`requireMessage`, `requireLocation`, `requireData`).

### 3.2 `eslint.config.ts` support

TypeScript config files (`.ts`/`.mts`/`.cts`) have been loadable like plain JS configs since **ESLint
v9.18.0**, and that carries forward into 10. Two loading paths exist:
- **Via `jiti`** (the common path today): ESLint 10 requires **jiti ≥ 2.2.0**; without it you get
  `"The 'jiti' library is required for loading TypeScript configuration files."`
- **Native, experimental:** on Node.js ≥ 22.13.0, TS config files can load without jiti via Node's
  `--experimental-strip-types`, gated behind ESLint's own `unstable_native_nodejs_ts_config` flag.

Source: [ESLint v9.18.0 released](https://eslint.org/blog/2025/01/eslint-v9.18.0-released/),
[eslint/eslint#19357](https://github.com/eslint/eslint/issues/19357),
[eslint/eslint#19485](https://github.com/eslint/eslint/issues/19485).

### 3.3 Current recommended flat config shape: `defineConfig` (not `tseslint.config`)

typescript-eslint's own **`config()`/`tseslint.config()` helper is now deprecated in favor of ESLint core's
own `defineConfig()`** (from the `eslint/config` subpath, built into ESLint itself). The official
typescript-eslint getting-started doc now shows:

```js
// eslint.config.js
// @ts-check
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig({
  files: ['**/*.{js,ts,jsx,tsx}'],
  extends: [js.configs.recommended, tseslint.configs.recommended],
})
```
Source: [typescript-eslint Getting Started](https://typescript-eslint.io/getting-started/) (fetched directly).

Known semantic difference: when both a base config object and one of its `extends` entries specify `files`,
`tseslint.config()` has the extension's `files` **override** the base, while `defineConfig()` **intersects**
the two `files` matchers. This can silently change which files a rule set applies to during a migration —
worth calling out explicitly in curriculum material. Source: [typescript-eslint `typescript-eslint` package docs](https://typescript-eslint.io/packages/typescript-eslint/).

### 3.4 eslint-plugin-react-hooks 7 (flat config, React Compiler rules)

```js
// eslint.config.js
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  reactHooks.configs.flat.recommended,
  // or, for bleeding-edge compiler rules:
  // reactHooks.configs.flat['recommended-latest'],
])
```

v7 slims the preset surface down to just two: `recommended` and `recommended-latest`; **all React Compiler
lint rules are enabled by default** in both. Rule set includes the long-standing `rules-of-hooks` and
`exhaustive-deps`, plus compiler-powered rules: `config`, `error-boundaries`, `gating`, `globals`,
`immutability`, `preserve-manual-memoization`, `purity`, `refs`, `set-state-in-effect`,
`set-state-in-render`, `static-components`, `unsupported-syntax`, `use-memo`, `incompatible-library`.
Source: [eslint-plugin-react-hooks README, facebook/react main branch](https://raw.githubusercontent.com/facebook/react/main/packages/eslint-plugin-react-hooks/README.md)
(fetched directly), corroborated by [React docs — eslint-plugin-react-hooks](https://react.dev/reference/eslint-plugin-react-hooks).

### 3.5 eslint-plugin-react-refresh

```js
import { defineConfig } from 'eslint/config'
import { reactRefresh } from 'eslint-plugin-react-refresh'

export default defineConfig(
  reactRefresh.configs.vite({ extraHOCs: ['someLibHOC'] }),
)
```
Ships ESM-only, requires ESLint ≥ 9 + Node ≥ 20 (flat config only — no eslintrc build exists for it).
Source: [eslint-plugin-react-refresh README via search summary](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) — **note:** this exact snippet came from a search-engine synthesis rather than a directly-fetched README; treat the `reactRefresh.configs.vite(...)` call shape as **UNVERIFIED** pending a direct read of the current README, though the overall "flat-config-only, ESLint 9+/Node 20+" requirement is corroborated by multiple independent write-ups.

### 3.6 eslint-config-prettier

```js
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default [
  // ...your other configs
  eslintConfigPrettier, // must go last, turns off formatting-related rules
]
```
The `/flat` subpath entry point still exists as of the latest version and differs from the bare import only
by adding a `name` property to the exported config object (for the ESLint config-inspector). Source:
[eslint-config-prettier GitHub](https://github.com/prettier/eslint-config-prettier) (fetched directly).
Exact current version number **UNVERIFIED** in this session (npm page returned 403; one search result cited
"10.1.8" but I could not independently confirm that against the registry).

### 3.7 Industry trend: oxlint / oxfmt / Biome vs ESLint+Prettier (2026 adoption facts)

- **Positioning that's crystallizing in 2026:** Oxlint runs *alongside* ESLint as a very fast first-pass
  linter (broad ESLint-rule-compatible, catches common mistakes in milliseconds); Biome positions itself to
  *fully replace* both ESLint and Prettier as one unified formatter+linter binary. "Oxlint wins raw lint
  throughput; Biome wins the 'replace ESLint+Prettier with one tool' job; ESLint wins when you need custom
  rules, framework-specific plugins, or the most mature type-aware TS lint coverage." Source:
  [dev.to — Biome vs Oxlint in 2026](https://dev.to/jsmanifest/biome-vs-oxlint-in-2026-which-rust-powered-linter-should-you-replace-eslint-with-48lh).
- **Throughput benchmarks cited:** ESLint ~45.2s vs Biome ~0.8s on a 10,000-file benchmark (~56x); Oxlint 21s
  vs ESLint 1m43s on the Node.js repo itself (6,298 files, ~4.8x). These are third-party benchmark claims,
  not from ESLint/Biome/Oxc's own docs — treat magnitude as indicative, not authoritative. Same source.
- **Adoption:** oxlint recorded ~6.7M weekly npm downloads (week of 2026-05-14). Biome sits at the 2.4.x line
  and added type-aware linting rules through 2025–2026; Vercel is a public sponsor of Biome 2.0 development.
  **VoidZero** (the company behind Oxc/Oxlint/Rolldown/Vite) joined **Cloudflare in June 2026**, putting
  Oxlint's roadmap behind a large infra company. Source: [dev.to — Biome vs Oxlint in 2026](https://dev.to/jsmanifest/biome-vs-oxlint-in-2026-which-rust-powered-linter-should-you-replace-eslint-with-48lh).
- **Concretely in this stack:** the official `create-vite react-ts` template ships **oxlint** (`.oxlintrc.json`)
  instead of ESLint as of ~Sept 2026, per the brief's own premise. A GitHub issue thread
  ([vitejs/vite#22025](https://github.com/vitejs/vite/issues/22025)) shows this was actively being finalized
  through March–September 2026 (as of March 25, 2026 the templates still used ESLint; by Sept 23, 2026 a
  bootstrapped react-ts template included `.oxlintrc.json`). For **type-aware** oxlint rules, the companion
  package is `oxlint-tsgolint`. **UNVERIFIED**: I could not fetch Vite's own template source at a pinned
  commit in this session to confirm the exact current file list — this is inferred from the issue thread and
  matches the fact pattern already given in your brief (create-vite ships oxlint, not ESLint, today).

**Recommendation for the curriculum:** teach ESLint 10 + typescript-eslint + eslint-plugin-react-hooks as the
"how real production TS/React codebases are linted, and why the rules exist" layer (this is where the
pedagogical value is — understanding *why* a rule fires), and mention oxlint/Biome as "what you'll likely
reach for on a new project in 2026 for raw speed" — the two are not mutually exclusive (oxlint-as-fast-prefilter
+ ESLint-as-deep-checker is a documented pattern, not an either/or).

---

## 4. Prettier 3.9 and prettier-plugin-tailwindcss

### 4.1 Prettier 3.9 notable changes

- **3.9.0** (shipped ~June 27, 2026): "major parser upgrades" for Markdown, YAML, Flow, GraphQL, and Angular;
  JS/TS formatting improvements particularly around `--no-semi` mode; preserves quotes for methods literally
  named `new`; supports `import defer` syntax in the TypeScript parser; new official
  `@prettier/plugin-yuku` plugin; improved CJK (Chinese/Japanese) text-wrapping in Markdown by treating more
  non-Unicode punctuation as CJK-equivalent. Source:
  [Prettier 3.9 blog post](https://prettier.io/blog/2026/06/27/3.9.0).
- **Patch releases through 3.9.9** are mostly Markdown-parser bugfixes (e.g. 3.9.8 fixed Liquid objects
  incorrectly interrupting paragraphs; 3.9.9 fixed text containing `$` being misparsed as math syntax).
  Source: [prettier/prettier CHANGELOG.md](https://github.com/prettier/prettier/blob/main/CHANGELOG.md).

Nothing in 3.9 changes core JS/TS/JSX formatting output in a way that would surprise someone coming from
Prettier 3.x — it's incremental parser/edge-case work, not a formatting-philosophy change.

### 4.2 prettier-plugin-tailwindcss with Tailwind v4

Tailwind v4 moved config into CSS (see §5), so the plugin needs to be told **which CSS file** defines your
theme/custom utilities via the `tailwindStylesheet` option (not `tailwindConfig` anymore, and note the exact
casing — a common typo is `tailwindStyleSheet`):

```jsonc
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/index.css"
}
```

Paths are resolved relative to the location of the Prettier config file. The referenced stylesheet should
contain `@import "tailwindcss";` plus any `@theme`/`@utility`/`@custom-variant` customization — the plugin
reads it to know your custom class names and sort order. Source:
[prettier-plugin-tailwindcss README](https://github.com/tailwindlabs/prettier-plugin-tailwindcss/blob/main/README.md)
(via search synthesis — the exact option name/casing is corroborated by multiple independent sources, but I
did not directly fetch the README's raw text in this session, so treat the option's full default-detection
behavior, if any, as **UNVERIFIED** beyond "you must set it explicitly for v4 CSS-first config").

---

## 5. Tailwind CSS 4.x (through 4.3)

### 5.1 Vite setup (unchanged shape since 4.0)

```bash
npm install tailwindcss@latest @tailwindcss/vite@latest
```
```js
// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```
```css
/* src/index.css */
@import "tailwindcss";
```
Source: [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4).

### 5.2 CSS-first configuration (the headline v4 change, still current in 4.3)

Tailwind v4's config **is** your CSS file — no `tailwind.config.js` needed for most projects:
- `@theme { ... }` replaces `theme.extend` in the old JS config.
- `@plugin "..."` replaces the JS `plugins: [...]` array.
- `@utility name { ... }` replaces the old `@layer utilities { ... }` pattern for custom utility classes —
  and unlike manually-written `@layer utilities` rules, `@utility`-defined classes automatically participate
  in variant sorting/ordering exactly like built-in utilities (so `hover:my-utility`, `lg:my-utility` etc.
  "just work"). Supports both **static** utilities (fixed declarations) and **functional** utilities that
  take a value via the special `--value()` function, e.g.:
  ```css
  @utility tab-* {
    tab-size: --value(integer, --default(4)); /* bare `tab` falls back to 4 (v4.3+) */
  }
  ```
- `@source "path/or/glob"` — tells Tailwind's automatic class-detection scanner about extra files/dirs it
  wouldn't otherwise find (it already auto-scans the project, respecting `.gitignore`, using the same
  heuristics `@source` uses to skip binary files). As of **v4.1**: `@source not "path"` excludes a path from
  scanning, and `@source inline("class-a class-b")` force-generates specific utility classes even if they
  never appear literally in scanned source text (useful for dynamically-constructed class name strings).
- `@custom-variant name (...)` — defines a new variant, most commonly used for class-based dark mode:
  ```css
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));
  ```
  This makes `dark:` utilities apply whenever a `.dark` class is present on an ancestor (or the element
  itself), matching the old "class strategy" dark mode from v3's JS config, but expressed in CSS.

Sources: [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4),
[Tailwind CSS Functions and Directives docs](https://tailwindcss.com/docs/functions-and-directives),
[Tailwind CSS Detecting classes in source files docs](https://tailwindcss.com/docs/detecting-classes-in-source-files),
[GitHub discussion on `@custom-variant dark`](https://github.com/tailwindlabs/tailwindcss/discussions/16974).

### 5.3 New since 4.0, through 4.3 (official blog, fetched directly)

**v4.2** (previously un-blogged, covered retroactively in the 4.3 post):
- Four new neutral-adjacent color palettes: `mauve`, `olive`, `mist`, `taupe`.
- First-class `@tailwindcss/webpack` loader (2.17x faster than the PostCSS path in Tailwind's own benchmark:
  429ms vs 932ms); works through Turbopack's webpack-loader compatibility layer (benefits Next.js).
- More logical-property utilities: block-start/end spacing (`mbs-6`, `mbe-2`, `pbs-4`, `pbe-8`,
  `border-bs`, `border-be-2`), logical sizing (`block-64`, `inline-full`, `max-block-screen`,
  `min-block-24`), logical inset (`inset-s-0`, `inset-e-4`, `inset-bs-2`, `inset-be-8`).
  **Deprecated:** `start-*`/`end-*` utilities, superseded by `inset-s-*`/`inset-e-*`.
- New `font-features-*` utility for `font-feature-settings` (e.g. `font-features-["tnum"]` for tabular
  numerals) without hand-written CSS.

**v4.3:**
- First-party **scrollbar utilities**: `scrollbar-auto/thin/none` (→ `scrollbar-width`);
  `scrollbar-thumb-*`/`scrollbar-track-*` (→ `scrollbar-color`, full palette + opacity modifiers);
  `scrollbar-gutter-auto/stable/both` (prevents layout shift when a scrollbar appears).
- **`@container-size`**: creates a *size* container query context (block-size aware), distinct from the
  existing `@container` (inline-size only); supports named containers `@container-size/{name}`.
- **`zoom-*`** utilities for the CSS `zoom` property (`zoom-75`, `zoom-100`, `zoom-125`, arbitrary
  `zoom-[1.1]`, CSS-var `zoom-(--preview-zoom)`).
- **`tab-*`** utilities for `tab-size` (`tab-2`, `tab-8`, arbitrary `tab-[12px]`, CSS-var `tab-(--tab-size)`).
- **Stacked and compound `@variant`** support inside custom CSS rules:
  ```css
  .button {
    @variant hover:focus { background: var(--color-sky-600); }   /* stacked */
    @variant hover, focus { background: var(--color-sky-600); }  /* compound (either) */
  }
  ```
- **`--default(...)`** for functional `@utility` definitions, giving a fallback value when the utility is
  used bare (see `tab-*` example above).

Source for all of §5.3: [Tailwind CSS v4.3 blog post](https://tailwindcss.com/blog/tailwindcss-v4-3) (fetched
directly). The only deprecation called out anywhere in 4.0→4.3 is `start-*`/`end-*` → `inset-s-*`/`inset-e-*`.

### 5.4 Legacy `@tailwind` directives

`@tailwind base` / `@tailwind components` no longer work in v4 — replaced by `@import "tailwindcss";` (which
pulls in the preflight/theme/utilities layers via native CSS `@layer` ordering) — or, if you need surgical
control, explicit sub-imports like `@import "tailwindcss/preflight";` + `@tailwind utilities;`. Source:
[tailwindlabs/tailwindcss.com#2076](https://github.com/tailwindlabs/tailwindcss.com/issues/2076),
[Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide).

---

## 6. monaco-editor 0.57.0 + @monaco-editor/react 4.7.0 on Vite 8

### 6.1 Bundling locally (no CDN)

```bash
npm install monaco-editor @monaco-editor/react
```
```ts
// monacoSetup.ts — import once, before any <Editor /> renders
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === 'json') return new jsonWorker()
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker()
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker()
    if (label === 'typescript' || label === 'javascript') return new tsWorker()
    return new editorWorker()
  },
}

loader.config({ monaco })
```
This is the exact pattern in both the official Monaco `docs/integrate-esm.md` (main branch) and the
`@monaco-editor/react` README — confirmed identical in both, fetched directly. Only `getWorker` is needed for
Vite (not `getWorkerUrl` — that's the webpack-era approach). The `?worker` suffix is Vite's built-in
"import this module as a Worker constructor" convention (§2.5); no bundler plugin config is required beyond
that. Sources: [monaco-editor/docs/integrate-esm.md](https://raw.githubusercontent.com/microsoft/monaco-editor/main/docs/integrate-esm.md),
[@monaco-editor/react README (suren-atoyan/monaco-react)](https://raw.githubusercontent.com/suren-atoyan/monaco-react/master/README.md).

**Note on 0.57.0's internal path reorg:** the package's own changelog for 0.56.0 says Monaco "reorganizes the
exported ESM modules to provide supported, tree-shakeable entry points." I confirmed via the published file
listing for `monaco-editor@0.57.0` on npm that **both** the classic paths (e.g.
`esm/vs/language/typescript/ts.worker.js`) **and** new tree-shakeable paths (e.g.
`esm/vs/languages/features/typescript/ts.worker.js`) exist in the package today. The docs above still point
at the classic path — use that one; it's what's documented and tested.

### 6.2 Bundled TypeScript version

**Confirmed by reading `monaco-editor@0.57.0`'s own `package.json` directly: `typescript: "^5.9.3"` in
devDependencies** — i.e. Monaco 0.57's built-in language service is powered by **TypeScript ~5.9**, not 6.0
and not 7.0. This is independent of whatever `typescript` version is installed in your workspace — Monaco
vendors its own copy and does not read your `node_modules/typescript`. Practical implication for a learning
platform: **Monaco's in-editor red squiggles will not perfectly match your `tsc`/Vitest type-check results**
if your project's real compiler is TS 6.0.3 or 7.0.2 — there's a real (if usually small) version skew to be
aware of and potentially call out to learners. Also confirmable live at runtime via
`monaco.typescript.typescriptVersion` (see 6.3 — this getter exists in the shipped `.d.ts`).
Source: directly fetched `https://raw.githubusercontent.com/microsoft/monaco-editor/v0.57.0/package.json`.

### 6.3 API location: `monaco.languages.typescript.*` was renamed to `monaco.typescript.*`

**This is a real, confirmed breaking change**, and it directly contradicts a lot of still-circulating
tutorial code (including some of what search engines surfaced for this query) that shows
`monaco.languages.typescript.typescriptDefaults`. I verified this two ways:

1. **Changelog, 0.55.0**: "Moves nested namespaces (`languages.css`, `languages.html`, `languages.json`,
   `languages.typescript`) to top level namespaces (`css`, `html`, `json`, `typescript`)." Source:
   [monaco-editor CHANGELOG.md](https://raw.githubusercontent.com/microsoft/monaco-editor/main/CHANGELOG.md)
   (fetched directly).
2. **Direct inspection of the shipped `monaco.d.ts` for 0.57.0** (downloaded and grepped, not summarized): the
   root export list is
   ```ts
   export { /* ... */ css, editor, html, json, languages, lsp, typescript as typescript, worker }
   ```
   — `typescript` is a **sibling** of `languages`, not nested inside it. I also grepped the full body of the
   `declare namespace languages { ... }` block in `monaco.d.ts` for any `typescript` property and found none.
   So as of 0.57.0 there is **no backward-compatible alias**; `monaco.languages.typescript` does not exist in
   the types at all.

**Current correct usage (verified against the shipped `.d.ts`):**
```ts
import * as monaco from 'monaco-editor'

monaco.typescript.typescriptDefaults.setCompilerOptions({ /* ... */ })
monaco.typescript.typescriptDefaults.addExtraLib(content, filePath)
monaco.typescript.typescriptVersion // string — reads "5.9.3"-ish at runtime
```

### 6.4 `addExtraLib`, `setCompilerOptions`, `paths`, and `moduleResolution: "Bundler"`

Read directly out of the shipped `monaco.d.ts` (10,264 lines, downloaded and grepped):

```ts
interface LanguageServiceDefaults {
  addExtraLib(content: string, filePath?: string): IDisposable
  setExtraLibs(libs: { content: string; filePath?: string }[]): void
  getCompilerOptions(): CompilerOptions
  setCompilerOptions(options: CompilerOptions): void
  // ...
}

interface CompilerOptions {
  // ...
  baseUrl?: string
  paths?: MapLike<string[]>   // MapLike<T> = { [index: string]: T }
  moduleResolution?: ModuleResolutionKind
  module?: ModuleKind
  // ...
}

declare enum ModuleResolutionKind {
  Classic = 1,
  NodeJs = 2,
}
```

**Important, verified gap: Monaco's typed `ModuleResolutionKind` enum only has `Classic` and `NodeJs` — there
is no `Bundler`, `Node16`, or `NodeNext` member.** This is despite Monaco vendoring TypeScript ~5.9.3
internally, which fully supports `"bundler"` as a real moduleResolution mode — the gap is specifically in
Monaco's own hand-maintained public `.d.ts` surface for `CompilerOptions`, which hasn't been updated past the
two oldest resolution kinds. In practice this means:
- Setting `moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs` is fully type-safe and works.
- Getting `"bundler"` behavior requires **bypassing the type** — e.g.
  `setCompilerOptions({ moduleResolution: 'bundler' as any, ... })` or a numeric cast — because the
  underlying vendored TS compiler does accept the string at runtime even though Monaco's own `.d.ts` won't
  type-check it. **The exact numeric ID for `Bundler` mode inside Monaco's own vendored copy, and whether
  passing the plain string `'bundler'` (rather than a cast number) reliably works at runtime, is
  UNVERIFIED** — I confirmed the type-level gap by reading the `.d.ts` directly, but did not execute Monaco
  in a live browser/worker in this research session to confirm runtime string-coercion behavior. Recommend
  your team verify this empirically against the actual 0.57.0 build before committing curriculum content to
  it, or simply avoid depending on `bundler`-mode-specific resolution semantics in the in-browser editor and
  rely on your `tsc`-based runner (a real, current TypeScript compiler) for resolution-sensitive
  type-checking, treating Monaco purely as a fast in-browser hinting layer.

`paths` works exactly as `MapLike<string[]>` (i.e. a plain `{ [glob: string]: string[] }` object), same shape
as `tsconfig.json`'s `paths` — pass it straight through `setCompilerOptions({ paths: { '@/*': ['src/*'] } })`.

### 6.5 Does `file:///node_modules/<pkg>/package.json` as an extra lib make `exports`/`types` resolution work?

**No — confirmed by an open, unresolved upstream feature request.** Monaco's TypeScript worker resolves
extra-lib packages using only the **legacy** `package.json` fields — `main` and `typings` (or `types`). It
does **not** understand the modern conditional `exports` map (`{ "exports": { ".": { "types": "...",
"import": "..." } } }`) at all:

> "the only way for the TypeScript worker to pick up added libraries via `setExtraLibs` or `addExtraLib` is
> by using the `main` or `typings` fields inside the package.json file"
> — [microsoft/monaco-editor#4464](https://github.com/microsoft/monaco-editor/issues/4464) (open, unresolved
> as of this research; fetched directly)

Practical implication for "make package types resolve in the in-browser editor": adding
`file:///node_modules/<pkg>/package.json` as an extra lib **only** helps Monaco find types if that
package.json still exposes an old-style `main`/`typings` pair. For an `exports`-only modern package (the
norm for anything published in the last few years), this trick silently does nothing useful — you must
instead directly `addExtraLib()` the package's actual `.d.ts` file content(s) at the virtual path(s) the
import specifier would resolve to (e.g. `file:///node_modules/zod/index.d.ts`), or pre-flatten/pre-bundle the
types you want available, rather than relying on Monaco to walk the package's `exports` map.

---

## Summary table of primary sources used

| Area | Primary source(s) |
|---|---|
| TS 6.0 | [typescriptlang.org TS 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html), [devblogs Announcing TS 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) |
| TS 5.8 erasableSyntaxOnly | [typescriptlang.org TS 5.8 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html) |
| TS 7.0 | [devblogs Announcing TS 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) |
| Vite 8 | [vite.dev blog: Vite 8.0 is out!](https://vite.dev/blog/announcing-vite8), [vite.dev migration guide](https://vite.dev/guide/migration), [vite.dev server-options](https://vite.dev/config/server-options.html), [vite.dev features](https://vite.dev/guide/features.html) |
| @vitejs/plugin-react 6 | [vite-plugin-react README (main)](https://raw.githubusercontent.com/vitejs/vite-plugin-react/main/packages/plugin-react/README.md) |
| ESLint 10 | [eslint.org blog: ESLint v10.0.0 released](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/), [eslint.org blog: v9.18.0 released](https://eslint.org/blog/2025/01/eslint-v9.18.0-released/) |
| typescript-eslint | [typescript-eslint.io Getting Started](https://typescript-eslint.io/getting-started/) |
| eslint-plugin-react-hooks 7 | [facebook/react eslint-plugin-react-hooks README (main)](https://raw.githubusercontent.com/facebook/react/main/packages/eslint-plugin-react-hooks/README.md) |
| eslint-config-prettier | [prettier/eslint-config-prettier GitHub](https://github.com/prettier/eslint-config-prettier) |
| Prettier 3.9 | [prettier.io blog: 3.9.0](https://prettier.io/blog/2026/06/27/3.9.0), [prettier CHANGELOG.md](https://github.com/prettier/prettier/blob/main/CHANGELOG.md) |
| Tailwind CSS 4.x | [tailwindcss.com blog: v4.0](https://tailwindcss.com/blog/tailwindcss-v4), [tailwindcss.com blog: v4.3](https://tailwindcss.com/blog/tailwindcss-v4-3), [tailwindcss.com functions-and-directives docs](https://tailwindcss.com/docs/functions-and-directives) |
| monaco-editor 0.57.0 | [monaco-editor CHANGELOG.md (main)](https://raw.githubusercontent.com/microsoft/monaco-editor/main/CHANGELOG.md), [monaco-editor package.json @ v0.57.0](https://raw.githubusercontent.com/microsoft/monaco-editor/v0.57.0/package.json), [monaco.d.ts @ 0.57.0 via unpkg](https://unpkg.com/monaco-editor@0.57.0/monaco.d.ts) (downloaded and grepped directly), [monaco-editor#4464](https://github.com/microsoft/monaco-editor/issues/4464), [docs/integrate-esm.md (main)](https://raw.githubusercontent.com/microsoft/monaco-editor/main/docs/integrate-esm.md) |
| @monaco-editor/react | [suren-atoyan/monaco-react README (master)](https://raw.githubusercontent.com/suren-atoyan/monaco-react/master/README.md) |

## Items flagged UNVERIFIED (collected)

1. Exact literal wording of TS 6.0's new default `moduleResolution` value (directionally confirmed as
   `bundler`-paired-with-`esnext`, but not found as one explicit sentence in the fetched official text).
2. TS 7.1's expected ship date (~October 2026) — only in secondary/blog sources, not an official Microsoft post.
3. Whether Vitest's typecheck mode is unaffected by TS 7's API removal — inferred from secondary sources
   describing Vitest's architecture, not from Vitest's own docs directly.
4. `eslint-plugin-react-refresh`'s exact current README code sample (`reactRefresh.configs.vite(...)`).
5. `eslint-config-prettier`'s exact current published version number (saw "10.1.8" once, unconfirmed against npm).
6. `prettier-plugin-tailwindcss`'s full default-detection behavior for `tailwindStylesheet` beyond "you must
   set it explicitly for v4."
7. The `create-vite` react-ts template's exact current file list (oxlint config specifics) — inferred from an
   open GitHub issue thread rather than a pinned-commit read of the template source.
8. Monaco's runtime behavior when passing `moduleResolution: 'bundler'` (string) or a numeric cast to
   `setCompilerOptions` — the *type-level* gap (no `Bundler` enum member) is directly verified from the
   shipped `.d.ts`; the *runtime* coercion behavior is not verified in this session.
