# React Ecosystem Research Digest — September 2026

Compiled for the Turkish React curriculum. Target versions (confirmed live via `npm view <pkg> version` on 2026-09-25):

| Package | Latest | Notes |
|---|---|---|
| react / react-dom | **19.3.0** | released 2026-09-09 |
| react-router | **8.4.0** | released 2026-09-15; peer `react >=19.2.7` |
| @tanstack/react-query | **5.103.2** | released 2026-09-21; **still v5**, no React v6 |
| react-hook-form | **7.88.0** | v8 is **beta only** (`8.0.0-beta.3`), not latest |
| @hookform/resolvers | **5.9.1** | |
| zod | **4.6.5** | released 2026-09-13 |
| @reduxjs/toolkit | **2.12.0** | released 2026-05-15 |
| react-redux | **9.3.0** | released 2026-05-15; `9.4.0-alpha` in progress |
| radix-ui | **1.6.7** | unified package (Feb 2026); shadcn now defaults to Base UI (Jul 2026) but Radix fully supported |
| lucide-react | **1.48.0** | |

Everything below is sourced from official docs/changelogs/GitHub releases unless marked **UNVERIFIED**. Where a fetched summary looked shaky, it was cross-checked against `gh release view` on the source repo.

---

## 1. React 19.1 → 19.3

### 19.2 (2025-10-01) — [react.dev/blog/2025/10/01/react-19-2](https://react.dev/blog/2025/10/01/react-19-2)

- **`<Activity>`** — stable. Wraps parts of the tree that can be `visible` or `hidden`. Hidden: unmounts effects, defers updates, keeps DOM/state around (cheaper remount, good for tab-like UIs, pre-rendering, background nav state).
  ```jsx
  <Activity mode={isVisible ? 'visible' : 'hidden'}>
    <Page />
  </Activity>
  ```
- **`useEffectEvent`** — stable. Extracts non-reactive logic out of an Effect so it can read latest props/state without being a dependency. Requires `eslint-plugin-react-hooks@latest` for correct linting.
  ```jsx
  const onConnected = useEffectEvent(() => showNotification('Connected!', theme));
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // theme intentionally excluded
  ```
- **`cacheSignal()`** — stable, **Server Components only**. Lets you know when a `cache()` lifetime has ended (for aborting in-flight work tied to that cache scope).
- **`useId` prefix changed**: `:r:` (19.0) / `«r»` (19.1) → **`_r_`** (19.2), to be XML-1.0-safe and support View Transitions. Breaking if you had ID-based selectors/tests hardcoded.
- **Partial pre-rendering (stable)**: `prerender()`, `resume()`, `resumeToPipeableStream()`, `resumeAndPrerender()`, `resumeAndPrerenderToNodeStream()` — pre-render static shell, resume later (SSR/SSG hybrid).
- **Performance Tracks** in Chrome DevTools (Scheduler track + Components track) — stable, dev tooling only.
- Web Streams support for Node (`renderToReadableStream`, `prerender`, `resume`, `resumeAndPrerender` now work in Node too).
- SSR Suspense boundaries now **batch reveals** before first paint instead of popping in one-by-one (prep work for View Transitions).
- `eslint-plugin-react-hooks@6` ships flat config as the default `recommended` preset (legacy available as `recommended-legacy`), and gained compiler-powered rules (`set-state-in-render`, `set-state-in-effect`, `refs`).

### 19.3 (2026-09-09) — [react.dev/blog/2026/09/09/react-19-3](https://react.dev/blog/2026/09/09/react-19-3)

- **`<ViewTransition>`** — now **stable** (was experimental). Animates enter/exit/update/move via the browser View Transition API, integrates with `useTransition`/`startTransition`/`useDeferredValue`/Suspense. Non-transition updates are never animated.
  ```jsx
  import { ViewTransition, startTransition, addTransitionType } from 'react';

  <ViewTransition enter={{ next: 'from-right', previous: 'from-left' }}
                  exit={{ next: 'to-left', previous: 'to-right' }}>
    <Page />
  </ViewTransition>
  ```
  `addTransitionType()` (also stable) tags a transition with a cause so the animation can branch (`next` vs `previous`, etc).
  With Suspense: `<ViewTransition update="auto" default="none"><Suspense fallback={<F/>}>…</Suspense></ViewTransition>` animates only the fallback→content reveal, not the initial fallback paint.
- **Fragment refs** — stable. `<Fragment ref={...}>` gives a `FragmentInstance` with `focus()/blur()/observeUsing()/getClientRects()/scrollIntoView()` etc., useful for a group of siblings without adding a wrapper DOM node.
- **`browser()` (react-dom)** — stable. Lets a component opt out of SSR for browser-only APIs while still rendering fine on the client; used with `use()` + `Suspense`.
  ```jsx
  import { use } from 'react';
  import { browser } from 'react-dom';
  function TimeZone() {
    use(browser());
    return <p>{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>;
  }
  ```
- **Trusted Types support** — stable, automatic; no code changes required, relevant if your CSP enforces `require-trusted-types-for 'script'`.
- Server Components can render Context (`<UserContext value={...}>`) directly from a `'use client'` module without a wrapper Provider component.
- Misc fixes: independent Transition scheduling (a slow transition no longer blocks others), `onFullscreenChange`/`onFullscreenError` events, `submit` events expose `submitter`, hydration/Strict-Mode double-invoke parity fixes, `useDeferredValue` stuck-value fix.
- **19.3 blog post does not re-announce** `useEffectEvent`, `cacheSignal`, `Activity`, `useActionState`, `useOptimistic`, ref-as-prop, or Owner Stack — those are unchanged/already shipped (see below), not new in this release.

### Already-stable from 19.0/19.1 (confirm for the curriculum, unchanged in 19.2/19.3)

- **`ref` as a prop** — stable since 19.0. `forwardRef` is no longer required for function components to accept `ref`; it is **not yet removed**, just discouraged (`forwardRef` will be deprecated in a *future* release, with a codemod, per the React team). Ref callbacks may now return a cleanup function. — [react.dev/reference/react/forwardRef](https://react.dev/reference/react/forwardRef)
- **Actions / `useActionState` / `useOptimistic` / form actions** — all stable, unchanged status in 19.2/19.3. `useActionState(action, initialState)` returns `[state, formAction, isPending]`; passing `formAction` to a `<form action={...}>` lets React manage the pending transition automatically. — [react.dev/reference/react/useActionState](https://react.dev/reference/react/useActionState)
- **`use()`** — stable since 19.0, for reading promises/context conditionally during render (only inside Suspense-wrapped code for promises).
- **Owner Stack (`captureOwnerStack`)** — introduced 19.1 (2025-03-28), unchanged in 19.2/19.3. **Dev-only** (`undefined` in production), reads the "who rendered this" stack inside Effects/event handlers/error handlers, for building better dev-tool error overlays. — [react.dev/reference/react/captureOwnerStack](https://react.dev/reference/react/captureOwnerStack)

### React Compiler — 1.0 is stable

Shipped **2025-10-07**. Production-ready, battle-tested at Meta (Quest Store: up to 12% faster loads/nav, some interactions 2.5x faster, no extra memory). Works with **React 17+** (via a compatibility runtime), not just 19. — [react.dev/blog/2025/10/07/react-compiler-1](https://react.dev/blog/2025/10/07/react-compiler-1)

**Enabling in Vite:**
```bash
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
```
```js
// vite.config.js
import react from '@vitejs/plugin-react';
export default {
  plugins: [
    react({ babel: { plugins: [['babel-plugin-react-compiler']] } }),
  ],
};
```
`npm create vite@latest` also now offers a compiler-enabled template directly.

**Current guidance on `useMemo`/`useCallback`/`memo`:**
- New code: let the compiler handle memoization (it's typically *more* precise than hand-written memoization, e.g. it can memoize after early/conditional returns). Reach for manual `useMemo`/`useCallback` only for specific control (e.g., a value used as an Effect dependency, where you need a stable reference on purpose).
- Existing code: don't blanket-remove existing `useMemo`/`useCallback`/`memo` — either leave them (compiler treats them as a hint) or remove deliberately with testing, since removing memoization can change *behavior* in edge cases (not just performance).

**Linting** is now built into `eslint-plugin-react-hooks@6` (no separate compiler ESLint plugin needed):
```js
// eslint.config.js (flat config)
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
export default defineConfig([reactHooks.configs.flat.recommended]);
```
Ships rules like `set-state-in-render`, `set-state-in-effect`, `refs`.

### react.dev guidance changes

"[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)" — structurally the same set of ~7 anti-pattern categories (derive-during-render, event-handler logic, `key`-based reset, `useSyncExternalStore` for external stores, etc.) as before, but now explicitly references **React Compiler** as a reason you often don't need manual `useMemo` for derived-value performance. It does **not** currently mention `useEffectEvent` on that page itself (that hook has [its own reference page](https://react.dev/reference/react/useEffectEvent) and is covered under "Separating Events from Effects").

---

## 2. React Router 8

Released **2026-06-17** ([GitHub](https://github.com/remix-run/react-router/releases/tag/react-router%408.0.0)), current patch **8.4.0** (2026-09-15). Team calls it a deliberately "boring" release: most breaking changes were already opt-in behind `future.v8_*` flags in v7, so a fully-flagged v7 app upgrades with little friction. — [remix.run/blog/react-router-v8](https://remix.run/blog/react-router-v8), [reactrouter.com/changelog](https://reactrouter.com/changelog)

### Breaking changes from v7

- **`react-router-dom` is gone.** It was "just a mirror of `react-router` to help smooth the v6→v7 upgrade." Import everything from `react-router`, and use `react-router/dom` for the DOM-specific entry (`RouterProvider`, hydration helpers).
  ```js
  // OLD (v7 and earlier)
  import { RouterProvider } from "react-router-dom";
  // NEW (v8)
  import { RouterProvider } from "react-router/dom";
  import { useNavigate, Link, Outlet } from "react-router";
  ```
- **ESM-only build.** No CommonJS. TS target bumped `ES2020` → `ES2022`.
- **Minimum versions:** Node **22.22.0+** (one source said 22.12+, the changelog/release notes say 22.22.0+ — go with the higher, more conservative number), **React 19.2.7+**, **Vite 7+**.
- All `future.v8_*` flags **removed**; their behavior is now the unconditional default: trailing-slash-aware data requests, pass-through requests, **middleware enabled by default**, **Vite Environment API enabled by default**, `splitRouteModules` (now a top-level config option, not a flag).
- `context` in `loader`/`action`/middleware is now **always** a `RouterContextProvider` (custom servers must return one from `getLoadContext()`, not a plain object).
- `meta({ data })` → `meta({ loaderData })`; the deprecated `data` field is removed.
- `hasErrorBoundary` route field removed (inferred automatically from presence of `errorElement`/`ErrorBoundary`).
- `@react-router/dev/vite/cloudflare` removed — use `@cloudflare/vite-plugin`.
- `AppLoadContext` type export removed.
- Instrumentation APIs (`unstable_*` request instrumentation) are now **stable** (dropped the `unstable_` prefix).
- New **`unstable_routePatternMatching`** flag + `unstable_validateParams` for regex-validated dynamic segments.

### The three modes — [reactrouter.com/start/modes](https://reactrouter.com/start/modes)

1. **Declarative mode** — `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Link>`, `useNavigate`, `useLocation`. No loaders/actions. **Docs explicitly recommend this mode when "you have a data layer... with its own abstractions" for pending states** — i.e., this is the mode the docs point to for a TanStack-Query-driven SPA.
2. **Data mode** — `createBrowserRouter` + `<RouterProvider>`, adds `loader`, `action`, `useNavigation`, `useFetcher`, pending UI, error boundaries — still just a client library (no bundler plugin, no server requirement).
3. **Framework mode** — Data mode + the Vite plugin (`@react-router/dev`), file-based/config-based routes, type-safe `href`, code-splitting, SSR/SSG/SPA build targets.

**In practice for a TanStack Query SPA course:** the docs' own reasoning ("has its own abstractions for pending states") points to **Declarative mode** as the "purest" fit, but a very common and officially-documented real-world pattern is **Data mode** (`createBrowserRouter`) with loaders calling `queryClient.ensureQueryData(queryOptions)` purely to *kick off* prefetching before/while the route renders, then reading the data with `useSuspenseQuery` in the component — giving you route-level prefetch + TanStack Query's caching/refetch/mutation machinery as the actual source of truth. Both are defensible; teach Declarative first for simplicity, introduce Data-mode-loader-as-prefetch-trigger as an intermediate optimization.

### Core usage (all confirmed against current docs/changelog)

```jsx
// main.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,        // renders <Outlet/>
    children: [
      { index: true, Component: Home },
      {
        path: "movies/:movieId",
        Component: MovieDetail,
        loader: ({ params }) =>
          queryClient.ensureQueryData(movieQueryOptions(params.movieId)),
        errorElement: <RouteError />, // or export ErrorBoundary from the route module in framework mode
      },
      {
        path: "search",
        lazy: () => import("./routes/search"), // code-split route module
      },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```
```jsx
function RootLayout() {
  const navigation = useNavigation(); // "idle" | "loading" | "submitting"
  return (
    <>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/search">Search</NavLink>
      </nav>
      {navigation.state === "loading" && <TopBar />}
      <Outlet />
    </>
  );
}

function MovieDetail() {
  const { movieId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  // ...
}
```

`useParams`, `useSearchParams`, `Outlet`, `Link`, `NavLink`, `useNavigation`, `lazy` route loading, `errorElement`/route-module `ErrorBoundary` all remain part of the current (v8) public API with the same shapes as v7 — the breaking changes are about *imports* and *config*, not these hook/component signatures.

**Is `react-router-dom` still a thing?** **No** — removed in v8. `react-router` + `react-router/dom` only.

---

## 3. TanStack Query 5.x (latest 5.103.2) — no v6 for React

**Confirmed via `gh release list --repo TanStack/query`:** the React adapter's newest tag is `@tanstack/react-query@5.103.2` (2026-09-21). A **v6 exists only for the Svelte adapter** (`@tanstack/svelte-query@6.2.4`) and an Angular v5 RC is in progress — **React Query is still on major version 5**, no v6 announced/released for React. Teach v5 patterns as current.

### Recommended patterns

- **`queryOptions` helper** — co-locates `queryKey`+`queryFn`(+other options) in one typed object, reused across `useQuery`, `useSuspenseQuery`, `useQueries`, and `queryClient` methods (`ensureQueryData`, `prefetchQuery`, `setQueryData`). Pair with a **query key factory** per resource:
  ```ts
  export const movieKeys = {
    all: ['movies'] as const,
    lists: () => [...movieKeys.all, 'list'] as const,
    list: (filters: MovieFilters) => [...movieKeys.lists(), filters] as const,
    details: () => [...movieKeys.all, 'detail'] as const,
    detail: (id: number) => [...movieKeys.details(), id] as const,
  };

  export const movieQueryOptions = (id: number) =>
    queryOptions({
      queryKey: movieKeys.detail(id),
      queryFn: () => fetchMovie(id),
    });
  ```
- **`skipToken`** — type-safe way to conditionally disable a query while keeping full `queryFn` type inference (pass `skipToken` in place of the function). Equivalent to `enabled: false` for disabling, **but** `refetch()` will error ("Missing queryFn") on a `skipToken` query — use `enabled: false` instead if you need manual refetch.
- **`useSuspenseQuery`** — same options as `useQuery` minus `throwOnError`/`enabled`/`placeholderData` (can't render a "disabled" Suspense state); `queryFn` cannot be `skipToken`. Guarantees `data` is defined, no `isPlaceholderData`, status is `'success' | 'error'`.
- **`placeholderData: keepPreviousData`** — `keepPreviousData` (option, not a boolean) was v4's `keepPreviousData: true`; in v5 you pass the exported `keepPreviousData` function as `placeholderData` to keep prior page's data visible during refetch of a new key (pagination/filter changes).
  ```ts
  useQuery({ queryKey: ['movies', page], queryFn: () => fetchMovies(page), placeholderData: keepPreviousData });
  ```
- **`useInfiniteQuery` `maxPages`** — caps how many pages are kept in the cache/refetched, used together with both `getNextPageParam` and `getPreviousPageParam` for bidirectional infinite lists without unbounded memory growth.
- **`useMutationState`** — reads mutation state out of the global `MutationCache` (with `filters`/`select`), useful for showing "N items syncing" UI outside the component that called `useMutation`.
- **Optimistic updates** — two supported approaches: (a) via **variables** — render directly from `mutation.variables` while pending (simplest, no manual cache patching); (b) via **`onMutate`** — manually snapshot + patch the query cache, roll back in `onError`. `onMutate`/variables approach is preferred by the docs for typical optimistic UI because it avoids the cache-patch/rollback boilerplate.

### Router integration — `ensureQueryData`

`queryClient.ensureQueryData(queryOptions)` returns cached data or fetches it once (no revalidation, no subscription — data becomes GC-eligible immediately unless a component also calls `useQuery`/`useSuspenseQuery` for the same key). Standard pattern: call it inside a React Router `loader`, then read the data in the component with `useSuspenseQuery(sameQueryOptions)` so the component still gets live cache subscription/refetch behavior.

**Sources:** [tanstack.com/query/latest/docs/framework/react/reference/functions/useSuspenseQuery](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useSuspenseQuery), [.../guides/paginated-queries](https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries), [.../guides/infinite-queries](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries), [.../reference/functions/useMutationState](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useMutationState), [.../guides/query-options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options), GitHub release feed [github.com/TanStack/query/releases](https://github.com/TanStack/query/releases).

---

## 4. React Hook Form 7.88 + @hookform/resolvers — v8 is BETA, not released

**Confirmed via `npm view react-hook-form dist-tags`:** `latest = 7.88.0`, `beta = 8.0.0-beta.3`, `alpha = 8.0.0-alpha.5`. **RHF v8 is NOT the current release** — teach v7. The official migration guide page is explicitly titled "Migrate V7 to V8 **(BETA)**." — [react-hook-form.com/migrate-v7-to-v8](https://react-hook-form.com/migrate-v7-to-v8)

v8 beta highlights (for a "what's coming" sidebar, not core curriculum): renames `useFieldArray` `fields.id` → `fields.key`, `field.ref` becomes the actual DOM element directly, flat field-array data shapes, first-class React Compiler compatibility claimed. — [github.com/react-hook-form/react-hook-form/releases](https://github.com/react-hook-form/react-hook-form/releases)

### Current (v7) APIs worth calling out as "recent"

- **`subscribe`** (on `useForm`'s return / on `control`) and **`createFormControl`** (published starting v7.55.0, June 2025) — a way to subscribe to form state **without triggering a React re-render**, and to create form state **outside a React component entirely** (no Context needed). `subscribe` should be preferred over the `watch` callback form for non-rendering subscriptions. — [react-hook-form.com/docs/useform/subscribe](https://react-hook-form.com/docs/useform/subscribe), [react-hook-form.com/docs/createformcontrol](https://react-hook-form.com/docs/createFormControl)

### Zod 4 support

Added in **`@hookform/resolvers@5.1.0`** (2025-06-07) — current latest is **5.9.1** (2026-08-17), Zod 4 support is long since stable in the resolvers package. — [github.com/react-hook-form/resolvers/pull/777](https://github.com/react-hook-form/resolvers/pull/777), `gh release list --repo react-hook-form/resolvers`

```ts
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // zod 4 is now the root import
import { useForm } from 'react-hook-form';

const schema = z.object({
  name: z.string().min(1),
  age: z.coerce.number().min(18),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

**Typing with `z.input`/`z.output`:** when a schema transforms/coerces (e.g. `z.coerce.number()`, `.transform()`), the *values RHF holds in the form* (pre-parse) differ from the *values your submit handler receives* (post-parse). Use the 3-generic `useForm` signature so both are type-checked correctly:
```ts
type FormInput = z.input<typeof schema>;   // what register()/defaultValues expect
type FormOutput = z.output<typeof schema>; // what handleSubmit(onValid) receives
const form = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(schema) });
```

### Relation to React 19 form actions

RHF and native React 19 Actions solve overlapping-but-different problems: `useActionState`/`useFormStatus` manage **server round-trip + pending state** for a `<form action={fn}>`; RHF manages **client-side field state, validation, dirty/touched tracking**. The common pattern combines them: use `useActionState` for the async submit + pending/error state, and feed its returned state back into `useForm`'s `defaultValues`/error display, with RHF driving client-side (Zod) validation before the action even fires. `useFormStatus` cannot be called in the same component as the `useActionState` that owns the `<form>` — it must be read from a child component. This is a community-documented integration pattern, not an official first-party RHF↔React-19 API — **flagged as guidance, not a shipped API**.

**Is RHF v8 released?** **No — beta only** (`8.0.0-beta.3` as of research date). Latest stable is **7.88.0**.

---

## 5. Zod 4.x (up to 4.6.5)

Root `zod` import **is Zod 4** now (confirmed: `npm view zod dist-tags` → `latest: 4.6.5`; canary channel active for v5 work but not released). `zod/v4` and `zod/v4-mini` subpaths still exist and "will continue to work forever" for incremental migration, but **for new code, `import * as z from "zod"` is the recommended, current, stable way to get Zod 4** — no need to reach for the `/v4` subpath anymore. — [zod.dev/v4](https://zod.dev/v4), [zod.dev/v4/versioning](https://zod.dev/v4/versioning)

### API differences a teacher must get right (v3 → v4)

- **Top-level string-format functions**, tree-shakeable, replace the old chained methods:
  ```ts
  z.email();   // was z.string().email()
  z.url();     // was z.string().url()
  z.uuid();    // was z.string().uuid()
  ```
  `.email()`/`.url()` as **methods** still work but are deprecated.
- **`error` param replaces `message` / `invalid_type_error` / `required_error` / `errorMap`:**
  ```ts
  z.string({ error: "Not a string!" });
  z.string().min(5, { error: "Too short!" });
  z.string({ error: (iss) => `Invalid: ${iss.code}` }); // function form, replaces old errorMap
  ```
  Error precedence (highest→lowest): check-level → schema-level → per-parse → global `z.config()` map → locale map. Return `undefined` from a function-form error to fall through to the next level. — [zod.dev/error-customization](https://zod.dev/error-customization)
- **`z.infer<typeof schema>`** unchanged as the standard type-extraction utility; new emphasis on **`z.input<T>`** (pre-transform/pre-coerce shape) vs **`z.output<T>`** (post-transform shape) for schemas that coerce/transform.
- **`.extend()` / `.pick()` / `.omit()`** — same names/shapes as v3, refined internals for better inference/perf:
  ```ts
  const DogWithBreed = Dog.extend({ breed: z.string() });
  const JustTitle = Recipe.pick({ title: true });
  const RecipeNoId = Recipe.omit({ id: true });
  ```
- **`z.coerce`** unchanged in spirit — `z.coerce.string()/.number()/.boolean()/.date()` wrap `String()`/`Number()`/`Boolean()`/`new Date()`.
- **`z.stringbool()`** — new in v4. Parses string-ish booleans: `"true"/"1"/"yes"/"on"/"y"/"enabled"` → `true`, `"false"/"0"/"no"/"off"/"n"/"disabled"` → `false`. Great for env vars / query-string flags.
- **`.check()`** (Zod Mini) — chains multiple validation checks onto a schema in the functional Mini API style.
- **`.strict()`/`.passthrough()` → `z.strictObject()`/`z.looseObject()`** as top-level constructors (old chained forms still work but the new constructors are preferred).
- **`z.treeifyError(error)`** replaces the deprecated `.format()` on `ZodError` — returns a nested tree mirroring the schema shape:
  ```ts
  const tree = z.treeifyError(result.error);
  // { errors: [...], properties: { username: { errors: [...] }, ... } }
  tree.properties?.username?.errors;
  ```
- **`z.prettifyError(error)`** — human-readable string for `console.log`. Both `treeifyError`/`prettifyError` require Zod **4**, not available in v3.
- **Discriminated unions** — same `z.discriminatedUnion(key, options)` shape, but v4's implementation now supports composed/piped/union discriminator branches (more flexible than v3's plain-literal-only discriminators):
  ```ts
  const Result = z.discriminatedUnion("status", [
    z.object({ status: z.literal("success"), data: z.string() }),
    z.object({ status: z.literal("failed"), error: z.string() }),
  ]);
  ```
- **`zod/mini`** — tree-shakable functional-API variant (chained methods → wrapper functions), ~1.9KB gzip core, `.parse()`/`.safeParse()`(+async) supported, schemas interop with full Zod. Use for bundle-size-constrained frontends; use full `zod` for DX/full feature set when size isn't the constraint.
- **JSON Schema**: `z.toJSONSchema(schema)` — first-party, built in. Honors `.describe()`/`.meta()`. Pass `{ io: "input" }` to get the JSON Schema for the *input* type of pipes/defaults/coercions instead of the output type.
- **Performance** (v4 vs v3, per official release notes): substantially faster parsing and drastically fewer TypeScript type instantiations (helps IDE responsiveness on large schemas) — treat exact multipliers found in secondary sources (14x/7x/100x) as **UNVERIFIED marketing figures**, not re-confirmed against a primary benchmark page in this pass.

**Recommended import path for the course: `import { z } from "zod"`** (root import = Zod 4). Only mention `zod/v4` / `zod/mini` as advanced/optional topics.

---

## 6. Redux Toolkit 2.12 + react-redux 9.3

Both confirmed via `gh release view` against the official GitHub repos (not secondary blog content):

### RTK 2.12.0 (2026-05-15) — [github.com/reduxjs/redux-toolkit/releases/tag/v2.12.0](https://github.com/reduxjs/redux-toolkit/releases/tag/v2.12.0)
- Ships **agent "skills" files** in the package itself (`skills/` folder) covering modern RTK usage/migration/state patterns, discoverable via **TanStack Intent** — a curriculum-relevant detail: RTK now ships machine-readable "how to use this correctly" docs targeted at AI coding agents.
- Exports RTK Query hook **options types** directly (no more digging them out via `Parameters<...>`).
- Fix: `isSuccess` flag no longer incorrectly flips when switching between infinite-query cache entries.
- Fix: `autoBatch` enhancer gets a 100ms `setTimeout` fallback alongside `requestAnimationFrame`, since rAF doesn't reliably fire in backgrounded tabs (was causing missed UI updates).
- Internal: adopts native `NoInfer` (needs TS 5.4+), listener-middleware matcher types now accept `interface`-based type guards too.

### react-redux 9.3.0 (2026-05-15) — [github.com/reduxjs/react-redux/releases/tag/v9.3.0](https://github.com/reduxjs/react-redux/releases/tag/v9.3.0)
- **`connect` is now marked `@deprecated`** (IDE strikethrough only — **no runtime change, not removed**, `legacy_connect` export remains available without the deprecation tag). Explicit team stance: **"hooks (`useSelector`/`useDispatch`) are the correct way to use React and React-Redux today."**
- (from 9.1.0, still current API) **`.withTypes<T>()` pattern** for pre-typed hooks, mirroring RTK's `createAsyncThunk.withTypes()`:
  ```ts
  export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
  export const useAppSelector = useSelector.withTypes<RootState>();
  export const useAppStore = useStore.withTypes<AppStore>();
  ```
- (from 9.2.0) React 19 peer-dependency compatibility confirmed.

### Current recommended setup (stable API, confirmed against redux-toolkit.js.org)

```ts
// store.ts
import { configureStore, combineSlices, createListenerMiddleware } from '@reduxjs/toolkit';

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  actionCreator: todoAdded,
  effect: async (action, listenerApi) => { /* side effect */ },
});

const rootReducer = combineSlices(todosSlice, usersSlice);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// slice with selectors + create.asyncThunk
import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
const createAppSlice = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } });

export const todosSlice = createAppSlice({
  name: 'todos',
  initialState: { items: [] as Todo[], loading: false },
  reducers: (create) => ({
    fetchTodos: create.asyncThunk(
      async (_: void) => (await fetch('/api/todos')).json() as Promise<Todo[]>,
      {
        pending: (state) => { state.loading = true; },
        fulfilled: (state, action) => { state.items = action.payload; state.loading = false; },
        rejected: (state) => { state.loading = false; },
      },
    ),
  }),
  selectors: {
    selectAllTodos: (state) => state.items,
  },
});
export const { fetchTodos } = todosSlice.actions;
export const { selectAllTodos } = todosSlice.selectors;
```

`combineSlices(...).withLazyLoadedSlices<T>()` + `.inject(slice)` supports code-split/lazily-registered slices with correct `RootState` typing via declaration merging (`WithSlice<typeof slice>`).

— [redux-toolkit.js.org/api/createSlice](https://redux-toolkit.js.org/api/createSlice), [.../api/combineSlices](https://redux-toolkit.js.org/api/combineSlices), [.../api/createListenerMiddleware](https://redux-toolkit.js.org/api/createListenerMiddleware)

### When to use RTK vs TanStack Query vs Zustand

No single "official Redux team position paper" was found stating this in one place (**flag: synthesized from multiple 2026 community sources, not one canonical doc — treat the RTK-vs-Query split itself as verified/uncontroversial, but the exact wording as paraphrase**). Consistent 2026 guidance across sources:
- **Server state (API data, caching, background refetch, pagination)** → TanStack Query (or RTK Query if already deep in the Redux ecosystem).
- **Client/UI state (toggles, form/local UI state, cross-cutting app state)** → Redux Toolkit slices *or* Zustand.
- Pick **RTK** when: multiple developers need shared conventions/guardrails, you want everything (server + client state) in one DevTools timeline, or you're already committed to RTK Query.
- Pick **Zustand** when: the app/state surface is small, you want minimal ceremony, no need for the Redux DevTools/middleware ecosystem.
- Dominant 2026 non-Redux pattern: **TanStack Query for server state + Zustand for client state**, the two deliberately not knowing about each other.

---

## 7. shadcn/ui in 2026

### Setup with Vite + Tailwind v4

```bash
pnpm dlx shadcn@latest init -t vite
# then, per component:
pnpm dlx shadcn@latest add card button
```
`components.json` still exists and controls install paths/aliases/style; for Tailwind v4 projects the `tailwind.config` field is left blank (v4 has no JS config file by default — it's CSS-first via `@theme`). Vite's split `tsconfig.json`/`tsconfig.app.json` template needs the `@/*` path alias added to **both** files. — [ui.shadcn.com/docs/installation/vite](https://ui.shadcn.com/docs/installation/vite), [ui.shadcn.com/docs/tailwind-v4](https://ui.shadcn.com/docs/tailwind-v4), [ui.shadcn.com/docs/components-json](https://ui.shadcn.com/docs/components-json)

### Radix → unified `radix-ui` package (Feb 2026)

New-york style components now import from the single **`radix-ui`** package instead of many `@radix-ui/react-*` packages:
```ts
// before
import * as DialogPrimitive from "@radix-ui/react-dialog";
// after
import { Dialog as DialogPrimitive } from "radix-ui";
```
Migration command for existing projects: `pnpm dlx shadcn@latest migrate radix` (optionally scoped to a custom components path). — [ui.shadcn.com/docs/changelog/2026-02-radix-ui](https://ui.shadcn.com/docs/changelog/2026-02-radix-ui)

### Base UI becomes the default (Jul 2026) — **important for a 2026 curriculum**

As of July 2026, **`npx shadcn init` defaults new projects to Base UI** (the MUI-team-maintained, Radix-creator-informed primitives library), because community data showed new `shadcn/create` projects already picking Base UI over Radix ~2:1. **Radix is explicitly *not* deprecated** — "every update and new component will ship for both libraries" — and existing Radix-based projects require **zero migration**. To keep using Radix explicitly:
```bash
npx shadcn init -b radix
```
— [ui.shadcn.com/docs/changelog/2026-07-base-ui-default](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)

**Curriculum implication:** since the user's target lockfile pins `radix-ui@1.6.7` (not Base UI), the course should explicitly init with `-b radix` (or just note that CLI default changed and pick Radix on purpose) so generated components match the pinned dependency — and call out to students that Base UI is the new CLI default they'll see if they don't pass the flag.

### Theming — CSS variables + OKLCH

Default color format is now **OKLCH**, set via CSS variables consumed by Tailwind v4 utilities (`bg-background`, `text-foreground`, etc.), following a semantic `token` / `token-foreground` pairing convention:
```css
:root {
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
}
.dark {
  --primary: oklch(0.92 0 0);
  --primary-foreground: oklch(0.205 0 0);
}
```
`components.json` → `tailwind.cssVariables: true` (default) enables this mode. — [ui.shadcn.com/docs/theming](https://ui.shadcn.com/docs/theming)

### Forms: RHF + Zod remains the primary story, plus new `Field` primitives

Current (2026) shadcn form docs still center on **React Hook Form + Zod** via `Form`/`FormField`/`FormItem`/`FormControl`/`FormMessage`, which auto-wire `aria-invalid`/`aria-describedby`/label linkage on top of RHF's `Controller` + `zodResolver`. Composition: `FormField` (RHF binding) → `FormItem` → `FormLabel` + `FormControl(input)` + `FormDescription` + `FormMessage` (renders RHF's error message). — [ui.shadcn.com/docs/forms/react-hook-form](https://ui.shadcn.com/docs/forms/react-hook-form)
Additionally, newer **`Field`/`FieldContent`/`FieldLabel`/`FieldDescription`/`FieldError`** primitives give more layout flexibility for building forms (still typically paired with RHF + `zodResolver` under the hood) — **treat as an additive/lower-level styling layer, not a replacement for the RHF+Zod story**.

---

## 8. APIs used for course projects

### TMDB (The Movie Database)

Base URL: `https://api.themoviedb.org/3`. **Auth: v4 Read Access Token as a Bearer header** works for v3-style endpoints too — this is the recommended single auth method going forward (`Authorization: Bearer <v4_read_access_token>`), simpler than the old `?api_key=` query param. — [developer.themoviedb.org/docs/getting-started](https://developer.themoviedb.org/docs/getting-started)

Confirmed endpoint paths (official reference):
| Endpoint | Path | Notes |
|---|---|---|
| Trending | `GET /trending/movie/{time_window}` | `time_window` = `day` \| `week` |
| Discover | `GET /discover/movie` | params incl. `with_genres`, `page`, `sort_by` |
| Search | `GET /search/movie` | param `query` |
| Movie details | `GET /movie/{id}` | `append_to_response=credits,videos` supported |
| Genre list | `GET /genre/movie/list` | returns `{ genres: [{id,name}] }` |
| Configuration | `GET /configuration` | returns `images.base_url`/`images.secure_base_url` + size arrays (poster: `w92..w780,original`; backdrop: `w300,w780,w1280,original`; etc.) |
| Guest session create | `GET /authentication/guest_session/new` | returns `{ success, guest_session_id, expires_at }` |
| Rate movie | `POST /movie/{movie_id}/rating?guest_session_id=...` | body `{ "value": 8.5 }` |
| Guest session's rated movies | `GET /guest_session/{guest_session_id}/rated/movies` | params `sort_by` (`created_at.asc/desc`), `language`, `page` |

**UNVERIFIED / conflicting:** guest session inactivity expiry — one part of the official docs site states "24 hours," while a separate reference page fetched in this research and TMDB staff forum posts say sessions are deleted if **not used within 60 minutes** of issuance. Verify against `https://developer.themoviedb.org/docs/authentication-guest-sessions` and `.../reference/authentication-create-guest-session` directly before teaching a specific number — don't commit to one figure in course material without a fresh check.

**Rate limit:** the old hard limit (40 req/10s) was disabled 2019-12-16; current behavior is an unpublished soft ceiling informally reported around **~40–50 requests/second** with IP-level throttling, subject to change — TMDB's own docs say only to "be respectful" and handle HTTP 429 with backoff. Treat any exact number as **UNVERIFIED/approximate**, not a documented SLA. — [developer.themoviedb.org/docs/rate-limiting](https://developer.themoviedb.org/docs/rate-limiting)

### DummyJSON

```
POST https://dummyjson.com/auth/login
Body: { "username": "emilys", "password": "emilyspass", "expiresInMins": 30 }
Response: { accessToken, refreshToken, id, username, email, ... }  // note: NOT a single "token" field, both accessToken + refreshToken
```
```
GET https://dummyjson.com/auth/me
Header: Authorization: Bearer <accessToken>
```
```
POST https://dummyjson.com/auth/refresh
Body: { "refreshToken": "<refreshToken>" (optional if cookie present), "expiresInMins": 30 }
Response: new { accessToken, refreshToken }
```
Sample credentials confirmed in docs: **username `emilys` / password `emilyspass`** (any user from `dummyjson.com/users` also works). Tokens can also be carried as httpOnly cookies in addition to the Authorization header. — [dummyjson.com/docs/auth](https://dummyjson.com/docs/auth)

### Open Library

```
GET https://openlibrary.org/search.json?q=<query>&fields=*&limit=20&page=1
GET https://openlibrary.org/search/authors.json?q=<query>
GET https://openlibrary.org/works/{OLID}.json          // work-level record
GET https://openlibrary.org/authors/{OLID}.json
```
Covers:
```
https://covers.openlibrary.org/b/id/{cover_id}-{S|M|L}.jpg     // book cover by cover id
https://covers.openlibrary.org/b/isbn/{isbn}-{S|M|L}.jpg       // book cover by ISBN
https://covers.openlibrary.org/a/olid/{author_olid}-{S|M|L}.jpg // author photo
```
Any Open Library page returns structured data by appending `.json`/`.yml`/`.rdf` to its URL (e.g. `https://openlibrary.org/works/OL15626917W.json`). No auth required for read endpoints. — [openlibrary.org/dev/docs/api/search](https://openlibrary.org/dev/docs/api/search), [openlibrary.org/dev/docs/api/covers](https://openlibrary.org/dev/docs/api/covers), [openlibrary.org/developers/api](https://openlibrary.org/developers/api)

---

## Verification method note

Version numbers and release dates for react-router, @tanstack/react-query, react-hook-form, zod, @reduxjs/toolkit, and react-redux were cross-checked directly with `npm view <pkg> dist-tags/versions` and `gh release list/view` against the primary GitHub repos, not just prose summaries of fetched pages — those are the highest-confidence facts in this document. Prose facts pulled via automated page-summarization (single WebFetch calls) were, where feasible, cross-checked against a second source or the CLI-verified release notes; anything that couldn't be cross-checked is explicitly marked **UNVERIFIED** above (TMDB guest-session expiry window, TMDB exact rate-limit number, Zod v3→v4 performance-multiplier marketing figures, the "RTK vs Query vs Zustand" framing as a single canonical doc).
