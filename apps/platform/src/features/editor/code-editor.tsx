import Editor, { type OnMount } from '@monaco-editor/react'
import { FileCode2, FlaskConical, Lock } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { EditorFile } from '@rm/server/dto'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'
import { configurePaths, loadEditorTypes, monaco } from './monaco-setup'

export interface EditorModel extends EditorFile {
  /** Monaco model URI'si */
  uri: string
}

interface CodeEditorProps {
  files: EditorModel[]
  activeFile: string
  onActiveFileChange: (name: string) => void
  onChange: (name: string, content: string) => void
  onRun: () => void
  paths: Record<string, string[]>
}

function languageOf(name: string) {
  if (/\.(ts|tsx)$/.test(name)) return 'typescript'
  if (/\.(js|jsx)$/.test(name)) return 'javascript'
  if (name.endsWith('.json')) return 'json'
  if (name.endsWith('.css')) return 'css'
  return 'plaintext'
}

export function CodeEditor({
  files,
  activeFile,
  onActiveFileChange,
  onChange,
  onRun,
  paths,
}: CodeEditorProps) {
  const { theme } = useTheme()
  const runRef = useRef(onRun)
  useEffect(() => {
    runRef.current = onRun
  }, [onRun])

  // Tüm dosyalar model olarak kayıtlı olmalı: import'lar ve tip kontrolü dosyalar arası çalışsın
  useEffect(() => {
    void loadEditorTypes()
    configurePaths(paths)
    for (const file of files) {
      const uri = monaco.Uri.parse(file.uri)
      const existing = monaco.editor.getModel(uri)
      if (!existing) monaco.editor.createModel(file.content, languageOf(file.name), uri)
      else if (existing.getValue() !== file.content) existing.setValue(file.content)
    }
  }, [files, paths])

  const active = files.find((f) => f.name === activeFile) ?? files[0]

  const handleMount: OnMount = (editor) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current())
  }

  return (
    <div className="flex h-full flex-col">
      <div
        role="tablist"
        aria-label="Dosyalar"
        className="flex h-9 shrink-0 items-end gap-0.5 overflow-x-auto border-b border-border bg-surface-2 px-1.5"
      >
        {files.map((file) => {
          const Icon = file.kind === 'test' ? FlaskConical : file.editable ? FileCode2 : Lock
          return (
            <button
              key={file.name}
              role="tab"
              type="button"
              aria-selected={file.name === active?.name}
              onClick={() => onActiveFileChange(file.name)}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-t-md px-3 font-mono text-xs whitespace-nowrap',
                file.name === active?.name ? 'bg-surface text-fg' : 'text-muted hover:text-fg',
              )}
            >
              <Icon
                className={cn(
                  'size-3.5',
                  file.kind === 'test'
                    ? 'text-violet'
                    : file.editable
                      ? 'text-accent'
                      : 'text-subtle',
                )}
              />
              {file.name}
            </button>
          )
        })}
      </div>
      <div className="min-h-0 flex-1">
        {active && (
          <Editor
            path={active.uri}
            language={languageOf(active.name)}
            defaultValue={active.content}
            theme={theme === 'dark' ? 'rm-dark' : 'rm-light'}
            onMount={handleMount}
            onChange={(value) => active.editable && onChange(active.name, value ?? '')}
            options={{
              readOnly: !active.editable,
              readOnlyMessage: { value: 'Bu dosya salt okunur.' },
              fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
              fontSize: 13.5,
              lineHeight: 21,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 12 },
              renderLineHighlight: 'gutter',
              fixedOverflowWidgets: true,
            }}
            loading={<div className="p-4 text-sm text-muted">Editör yükleniyor…</div>}
          />
        )}
      </div>
    </div>
  )
}
