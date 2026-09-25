import { useQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/dialog'
import { Html } from '@/components/ui/html'
import { PageLoader } from '@/components/ui/spinner'
import { questionQueries } from './api'

export function SolutionPanel({ code, passed }: { code: string; passed: boolean }) {
  const [revealed, setRevealed] = useState(passed)
  const [confirming, setConfirming] = useState(false)
  const { data, isPending } = useQuery({
    ...questionQueries.solution(code),
    enabled: revealed || passed,
  })

  if (!revealed && !passed) {
    return (
      <div className="flex flex-col items-center gap-3 p-8 text-center">
        <p className="max-w-sm text-sm text-muted">
          Önce kendin dene, takılırsan ipuçlarına bak. Çözüm, görevi geçtikten sonra "neden böyle?"
          notlarıyla birlikte otomatik açılır.
        </p>
        <ConfirmDialog
          open={confirming}
          onOpenChange={setConfirming}
          title="Çözüme şimdi bakmak istiyor musun?"
          description="Sorun değil, ama ilerlemende 'çözüme bakıldı' olarak işaretlenir. Kendine karşı dürüst istatistik 🙂"
          confirmLabel="Çözümü göster"
          onConfirm={() => setRevealed(true)}
        />
        <Button onClick={() => setConfirming(true)}>
          <Eye /> Çözümü göster
        </Button>
      </div>
    )
  }
  if (isPending || !data) return <PageLoader />
  return (
    <div className="space-y-4 p-5">
      {data.notesHtml && (
        <section className="rounded-xl border border-success/30 bg-success-soft p-4">
          <p className="mb-1 text-xs font-semibold text-success">Neden böyle?</p>
          <Html html={data.notesHtml} className="prose-sm" />
        </section>
      )}
      {data.files.map((file) => (
        <section key={file.name}>
          <p className="mb-1 font-mono text-xs text-muted">{file.name}</p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface-2 p-3 font-mono text-xs leading-relaxed">
            {file.content}
          </pre>
        </section>
      ))}
    </div>
  )
}
