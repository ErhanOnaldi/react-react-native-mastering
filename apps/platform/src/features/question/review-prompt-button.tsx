import { useMutation } from '@tanstack/react-query'
import { Check, ClipboardCopy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { fetchReviewPrompt } from './api'

/** Görev + kriterler + kod + test sonuçlarını, istediğin AI aracına yapıştırılacak prompt olarak kopyalar. */
export function ReviewPromptButton({
  code,
  variant = 'secondary',
}: {
  code: string
  variant?: 'secondary' | 'primary'
}) {
  const [copied, setCopied] = useState(false)
  const [warning, setWarning] = useState<string>()
  const copy = useMutation({
    mutationFn: async () => {
      const { prompt, warn, chars } = await fetchReviewPrompt(code)
      await navigator.clipboard.writeText(prompt)
      setWarning(
        warn
          ? `Prompt uzun (${Math.round(chars / 1000)}k karakter); bazı araçlar kesebilir.`
          : undefined,
      )
    },
    onSuccess: () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    },
  })
  return (
    <div className="flex flex-col gap-1">
      <Button variant={variant} onClick={() => copy.mutate()} disabled={copy.isPending}>
        {copied ? <Check /> : <ClipboardCopy />}
        {copied ? 'Kopyalandı!' : "AI review prompt'unu kopyala"}
      </Button>
      {copy.error && <p className="text-xs text-danger">{copy.error.message}</p>}
      {warning && <p className="text-xs text-warning">{warning}</p>}
    </div>
  )
}
