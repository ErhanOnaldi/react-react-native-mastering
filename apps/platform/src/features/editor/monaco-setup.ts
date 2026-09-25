// Monaco'yu CDN yerine yerel paketten yükler, TypeScript ayarlarını öğrenci ortamına eşitler.
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    if (label === 'typescript' || label === 'javascript') return new TsWorker()
    return new EditorWorker()
  },
}

loader.config({ monaco })

// Platform temasıyla uyumlu editör renkleri
monaco.editor.defineTheme('rm-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#10151f',
    'editorGutter.background': '#10151f',
    'editor.lineHighlightBackground': '#161d2a',
    'editor.lineHighlightBorder': '#00000000',
    'editorLineNumber.foreground': '#4b5870',
    'editorLineNumber.activeForeground': '#8b97ab',
    'editorWidget.background': '#161d2a',
    'editorWidget.border': '#253043',
    'editorSuggestWidget.background': '#161d2a',
    'editorSuggestWidget.border': '#253043',
    'editorHoverWidget.background': '#161d2a',
    'editorHoverWidget.border': '#253043',
    'scrollbarSlider.background': '#33415a80',
  },
})
monaco.editor.defineTheme('rm-light', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#ffffff',
    'editor.lineHighlightBackground': '#f0f3f7',
    'editor.lineHighlightBorder': '#00000000',
    'editorLineNumber.foreground': '#a3afc0',
    'editorLineNumber.activeForeground': '#5b6b82',
  },
})

const ts = monaco.typescript
const baseOptions: monaco.typescript.CompilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  // Monaco'nun tip tanımında Bundler yok (100); TypeScript bu değeri tanır.
  moduleResolution: 100 as monaco.typescript.ModuleResolutionKind,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  allowNonTsExtensions: true,
  allowImportingTsExtensions: true,
  resolveJsonModule: true,
  esModuleInterop: true,
  isolatedModules: true,
  lib: ['es2023', 'dom', 'dom.iterable'],
  baseUrl: 'file:///',
}

ts.typescriptDefaults.setEagerModelSync(true)
ts.typescriptDefaults.setCompilerOptions(baseOptions)
ts.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
  // 2792: "Cannot find module" — Monaco'da çözülemeyen bir kütüphane tipi yanlış alarm vermesin;
  // asıl otorite sunucudaki tsc'dir.
  diagnosticCodesToIgnore: [2792],
})

/** Soruya özel takma yollar (`@exercise/*` → workspace modelleri). */
export function configurePaths(paths: Record<string, string[]>) {
  ts.typescriptDefaults.setCompilerOptions({ ...baseOptions, paths })
}

let typesLoaded: Promise<void> | undefined

/** React ve kütüphane tip tanımlarını sunucudan bir kez yükler. */
export function loadEditorTypes() {
  typesLoaded ??= fetch('/api/editor-types')
    .then((r) => (r.ok ? (r.json() as Promise<{ path: string; content: string }[]>) : []))
    .then((libs) => {
      ts.typescriptDefaults.setExtraLibs(
        libs.map((l) => ({ filePath: l.path, content: l.content })),
      )
    })
    .catch(() => {
      // Tipler yüklenemezse editör yine çalışır; yalnızca otomatik tamamlama zayıflar.
    })
  return typesLoaded
}

export { monaco }

// Geliştirmede ve uçtan uca testlerde editörü programatik olarak sürebilmek için
if (import.meta.env.DEV) {
  ;(window as unknown as { monaco: typeof monaco }).monaco = monaco
}
